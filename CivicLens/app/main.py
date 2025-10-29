from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
import tempfile
from services.text_predictor import predict_text_issue
from services.image_predictor import predict_image_issue
from _datetime import datetime
import os
import json
import urllib.request
import urllib.error
import base64

app = FastAPI(title="CivicLens API", description="Predict civic issues from text or image")

origins = [
    "http://localhost:3000",  #Next.js app
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # origins can connect
    allow_credentials=True,
    allow_methods=["*"],     # Allow all methods (POST, GET, etc.)
    allow_headers=["*"],     # Allow all headers
)

# Helper: send report to Node backend to be saved into Mongo (Issue collection)
def send_to_backend(json_report: dict, location: str = "", coordinates: dict | None = None, images: list | None = None):
    try:
        backend_base = os.getenv("BACKEND_URL", "http://localhost:8080")
        url = f"{backend_base}/issues/ingest"
        payload = {
            "jsonReport": json_report,
            "location": location or "",
            "coordinates": coordinates or None,
            "images": images or []
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=10) as resp:
            # Best-effort; ignore body
            _ = resp.read()
    except Exception as e:
        # Non-fatal: log and continue returning API response
        print(f"[CivicLens] Failed to send report to backend: {e}")

@app.post("/predict/text")
async def predict_text(text: str = Form(...)):
    """Predict civic issue from text input."""
    try:
        result = predict_text_issue(text)
        return {"prediction": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/image")
async def predict_image(file: UploadFile = File(...)):
    """Predict civic issue from uploaded image."""
    try:
        raw_bytes = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(raw_bytes)
            temp_path = temp_file.name

        image_label, image_confidence  = predict_image_issue(temp_path)
        return {"prediction": image_label, "confidence": image_confidence}


    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# NEW ENDPOINT FOR FRONTEND

@app.post("/predict/analysis", tags=["Predictions"])
async def predict_and_analyze(
        text: str = Form(...),
        file: UploadFile = File(...),
        location: str = Form("") ,
        lat: float | None = Form(None),
        lng: float | None = Form(None),
        auto_save: bool = Form(False),
        # , db: Session = Depends(database.get_db) # <-- Uncomment when your DB is set up
):
    """
    Analyzes text and image, saves to DB, and returns JSON results.
    """
    temp_path = None
    try:
        # Run Image Prediction
        raw_bytes = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(raw_bytes)
            temp_path = temp_file.name

        image_label, image_confidence = predict_image_issue(temp_path)

        # Run Text Prediction
        text_prediction = predict_text_issue(text)  # Returns [category, type, severity]

        # Get timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        analysis_result = {
            "timestamp": timestamp,
            "category": text_prediction[0],
            "issue_type_image": image_label,
            "confidence": f"{image_confidence :.2f}%",  # Format confidence
            "issue_type_text": text_prediction[1],
            "severity": text_prediction[2],
            "description": text
        }

        print("Saving to database (placeholder):", analysis_result)

        if auto_save:
            try:
                # Prepare coordinates and images
                coords = None
                if lat is not None and lng is not None:
                    coords = {"lat": lat, "lng": lng}
                mime = file.content_type or "image/jpeg"
                img_b64 = base64.b64encode(raw_bytes).decode("utf-8")
                img_data_url = f"data:{mime};base64,{img_b64}"
                send_to_backend({
                    "category": analysis_result["category"],
                    "issueTypeImage": analysis_result["issue_type_image"],
                    "issueTypeText": analysis_result["issue_type_text"],
                    "severity": analysis_result["severity"],
                    "description": analysis_result["description"],
                }, location=location or "", coordinates=coords, images=[img_data_url])
            except Exception as _e:
                pass

        # return the JSON result to the frontend
        return analysis_result

    except Exception as e:
        if isinstance(e, IndexError):
            e = "Text prediction model did not return 3 values (Category, Type, Severity)."
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # 8. Clean up the temp file
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/predict/report", tags=["Predictions"])
async def predict_and_download_report(
        text: str = Form(...),
        file: UploadFile = File(...),
        location: str = Form("") ,
        lat: float | None = Form(None),
        lng: float | None = Form(None),
        auto_save: bool = Form(False),
):
    """
    Generates a full report from text and image, and returns it as a .txt file.
    """
    temp_path = None
    try:
        # Run Image Prediction
        raw_bytes = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(raw_bytes)
            temp_path = temp_file.name

        image_prediction = predict_image_issue(temp_path)
        image_label = image_prediction[0]
        image_confidence = image_prediction[1]

        # Run Text Prediction
        # NOTE: Assumes your text_prediction is a list like [category, type, severity]
        text_prediction = predict_text_issue(text)

        # Get timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Prepare report content
        # (I've removed image_confidence as our function doesn't return it)
        report_content = f"""
        CIVIC ISSUE REPORT
        ==================
        Timestamp: {timestamp}
        
        - CATEGORY: {text_prediction[0]}
        
        - ISSUE TYPE (from Image): {image_label}
        - CONFIDENCE SCORE : {image_confidence}
        
        - ISSUE TYPE (from Text): {text_prediction[1]}
        - SEVERITY: {text_prediction[2]}
        
        - DESCRIPTION:
        {text}
        """

        # Set up filename and headers
        file_name = f"civic_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        headers = {
            'Content-Disposition': f'attachment; filename="{file_name}"'
        }

        # Optionally push to backend (disabled by default)
        if auto_save:
            try:
                coords = None
                if lat is not None and lng is not None:
                    coords = {"lat": lat, "lng": lng}
                mime = file.content_type or "image/jpeg"
                img_b64 = base64.b64encode(raw_bytes).decode("utf-8")
                img_data_url = f"data:{mime};base64,{img_b64}"
                send_to_backend({
                    "category": text_prediction[0],
                    "issueTypeImage": image_label,
                    "issueTypeText": text_prediction[1],
                    "severity": text_prediction[2],
                    "description": text,
                }, location=location or "", coordinates=coords, images=[img_data_url])
            except Exception as _e:
                pass

        # return the Response object
        return Response(
            content=report_content,
            media_type="text/plain",
            headers=headers
        )

    except Exception as e:
        # Catch potential errors from text_prediction list access
        if isinstance(e, IndexError):
            e = "Text prediction model did not return the expected 3 values (Category, Type, Severity)."
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # Clean up the temp file
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)