import joblib
import os

# 1. get the directory of this file (text_predictor.py)
# .../CivicLens/app/services
SERVICES_DIR = os.path.dirname(os.path.abspath(__file__))

# 2. get the 'app' directory
# .../CivicLens/app
APP_DIR = os.path.dirname(SERVICES_DIR)

# the final paths to the models
MODELS_DIR = os.path.join(APP_DIR, "models")
VECTORIZER_PATH = os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl")
CLASSIFIER_PATH = os.path.join(MODELS_DIR, "civic_issue_model.pkl")

# --- Load Models ---
text_vectorizer = joblib.load(VECTORIZER_PATH)
text_model = joblib.load(CLASSIFIER_PATH)


def predict_text_issue(text: str):
    """Predict civic issue from input text."""
    if text_model is None:
        raise RuntimeError("Text model not loaded properly.")
    try:
        text_data = [text]
        text_features = text_vectorizer.transform(text_data)

        prediction = text_model.predict(text_features)

        # Convert the entire NumPy array to a standard Python list
        result = (prediction[0])
        return result.tolist()

    except Exception as e:
        raise RuntimeError(f"Error during text prediction: {e}")
