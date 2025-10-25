from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
import tempfile
from services.text_predictor import predict_text_issue
from services.image_predictor import predict_image_issue
from _datetime import datetime
import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

app = FastAPI(title="CivicLens API", description="Predict civic issues from text or image")

origins = [
    "http://localhost:3000",  #Next.js app
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # Which origins can connect
    allow_credentials=True,
    allow_methods=["*"],     # Allow all methods (POST, GET, etc.)
    allow_headers=["*"],     # Allow all headers
)

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
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(await file.read())
            temp_path = temp_file.name

        image_label, image_confidence  = predict_image_issue(temp_path)
        return {"prediction": image_label, "confidence": image_confidence}


    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# NEW ENDPOINT FOR FRONTEND

@app.post("/predict/analysis", tags=["Predictions"])
async def predict_and_analyze(
        text: str = Form(...),
        file: UploadFile = File(...)
        # , db: Session = Depends(database.get_db) # <-- Uncomment when your DB is set up
):
    """
    Analyzes text and image, saves to DB, and returns JSON results.
    """
    temp_path = None
    try:
        # 1. Run Image Prediction
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(await file.read())
            temp_path = temp_file.name

        image_label, image_confidence = predict_image_issue(temp_path)

        # 2. Run Text Prediction
        text_prediction = predict_text_issue(text)  # Returns [category, type, severity]

        # 3. Get timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # 4. Create the JSON (dict) result
        analysis_result = {
            "timestamp": timestamp,
            "category": text_prediction[0],
            "issue_type_image": image_label,
            "confidence": f"{image_confidence :.2f}%",  # Format confidence
            "issue_type_text": text_prediction[1],
            "severity": text_prediction[2],
            "description": text
        }

        # 5. --- SAVE TO DATABASE ---
        # This is where you call your database function.
        # You would create a new Report object/model and add it to your session.
        #
        # Example (must build this logic):
        # db_report = models.Report(
        #     timestamp=datetime.now(),
        #     category=analysis_result["category"],
        #     image_label=analysis_result["issue_type_image"],
        #     confidence=image_confidence,
        #     text_label=analysis_result["issue_type_text"],
        #     severity=analysis_result["severity"],
        #     description=analysis_result["description"]
        # )
        # db.add(db_report)
        # db.commit()
        # db.refresh(db_report)
        #
        # For now, just print it:
        print("Saving to database (placeholder):", analysis_result)

        # 6. Return the JSON result to the frontend
        return analysis_result

    except Exception as e:
        if isinstance(e, IndexError):
            e = "Text prediction model did not return 3 values (Category, Type, Severity)."
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # 7. Clean up the temp file
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/predict/report", tags=["Predictions"])
async def predict_and_download_report(
        text: str = Form(...),
        file: UploadFile = File(...)
):
    """
    Generates a full report from text and image, and returns it as a .txt file.
    """
    temp_path = None
    try:
        # 1. Run Image Prediction
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(await file.read())
            temp_path = temp_file.name

        image_prediction = predict_image_issue(temp_path)
        image_label = image_prediction[0]
        image_confidence = image_prediction[1]

        # 2. Run Text Prediction
        # NOTE: Assumes your text_prediction is a list like [category, type, severity]
        text_prediction = predict_text_issue(text)

        # 3. Get timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # 4. Prepare report content
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

        # 5. Set up filename and headers
        file_name = f"civic_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        headers = {
            'Content-Disposition': f'attachment; filename="{file_name}"'
        }

        # 6. Return the Response object
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
        # 7. Clean up the temp file
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)