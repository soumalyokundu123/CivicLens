from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import os

# the directory of this file (image_predictor.py)
# .../CivicLens/app/services
SERVICES_DIR = os.path.dirname(os.path.abspath(__file__))

# get the 'app' directory
# .../CivicLens/app
APP_DIR = os.path.dirname(SERVICES_DIR)

# 3. get the project's root directory
# .../CivicLens
PROJECT_ROOT = os.path.dirname(APP_DIR)

# 4. Build the correct paths
IMAGE_MODEL_PATH = os.path.join(APP_DIR, "models", "civic_issue_image_model.h5")
TRAIN_DIR = os.path.join(PROJECT_ROOT, "data", "image_dataset", "train")

# --- Load Model and Class Names ---

image_model = load_model(IMAGE_MODEL_PATH)

# Get class names by sorting the folder names
class_names = sorted([
    folder for folder in os.listdir(TRAIN_DIR)
    if os.path.isdir(os.path.join(TRAIN_DIR, folder))
])

# print(class_names)

# testing -> for the class labels sequence
# debug checks — run once to print details
# print("IMAGE_MODEL_PATH:", IMAGE_MODEL_PATH)
# print("TRAIN_DIR:", TRAIN_DIR)
# print("IMAGE MODEL exists:", os.path.exists(IMAGE_MODEL_PATH))
# print("TRAIN_DIR exists:", os.path.exists(TRAIN_DIR))
# print("Folders in TRAIN_DIR:", sorted([d for d in os.listdir(TRAIN_DIR) if os.path.isdir(os.path.join(TRAIN_DIR,d))]) )
# print("Model summary:")
# image_model.summary()
# print("Model output shape (num classes):", image_model.output_shape)
# print("Len(class_names):", len(class_names))

def predict_image_issue(img_path: str):
    """Predict civic issue from uploaded image file."""
    if image_model is None:
        raise RuntimeError("Image model not loaded properly.")
    try:
        # img = image.load_img(img_path, target_size=(128, 128))
        # img_array = image.img_to_array(img)
        # img_array = np.expand_dims(img_array, axis=0) / 255.0
        # prediction = image_model.predict(img_array)
        # predicted_index = np.argmax(prediction, axis=1)[0]
        # predicted_class = class_names[predicted_index]
        # # result = predicted_class + ' ' + str(predicted_index)
        # return predicted_class

        img = Image.open(img_path).convert("RGB").resize((128, 128))
        img_array = np.array(img) / 255.0
        image_batch = np.expand_dims(img_array, axis=0)
        prediction_probs = image_model.predict(image_batch)[0]
        predicted_index = np.argmax(prediction_probs)
        predicted_class = class_names[predicted_index].replace('_', ' ').title()
        confidence = np.max(prediction_probs) * 100
        return predicted_class, float(confidence)
    except Exception as e:
        raise RuntimeError(f"Error during image prediction: {e}")
