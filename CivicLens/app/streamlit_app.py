import streamlit as st
from PIL import Image
import numpy as np
import joblib
import tensorflow as tf
from datetime import datetime # <<< NEW: Import datetime

# --- PAGE CONFIG ---
st.set_page_config(
    page_title="CivicLens Demo",
    page_icon="🗣",
    layout="wide"
)

# --- MODEL LOADING (remains the same) ---
@st.cache_resource
def load_text_model():
    """Loads the saved NLP model and vectorizer from disk."""
    try:
        model = joblib.load('models/civic_issue_model.pkl')
        vectorizer = joblib.load('models./tfidf_vectorizer.pkl')
        return model, vectorizer
    except FileNotFoundError:
        return None, None

@st.cache_resource
def load_image_model():
    """Loads the saved CNN+RNN image classification model."""
    try:
        model = tf.keras.models.load_model('models/civic_issue_image_model.h5')
        return model
    except (FileNotFoundError, IOError):
        return None

# Load the models into memory
text_classifier, tfidf_vectorizer = load_text_model()
image_classifier = load_image_model()

# --- PREDICTION FUNCTIONS (remains the same) ---
def predict_text(description):
    """Vectorizes text and predicts Category, Issue, and Severity."""
    if text_classifier and tfidf_vectorizer:
        vectorized_text = tfidf_vectorizer.transform([description])
        prediction = text_classifier.predict(vectorized_text)
        return prediction[0]
    return None

def predict_image(image_data):
    """Preprocesses image and predicts the issue type."""
    if image_classifier:
        class_labels = ['broken_streetlight', 'electric_pole_damage', 'flood_waterlogging', 'garbage', 'open_manhole', 'pothole']
        img = Image.open(image_data).convert("RGB").resize((128, 128))
        img_array = np.array(img) / 255.0
        image_batch = np.expand_dims(img_array, axis=0)
        prediction_probs = image_classifier.predict(image_batch)[0]
        predicted_class_index = np.argmax(prediction_probs)
        predicted_label = class_labels[predicted_class_index].replace('_', ' ').title()
        confidence = np.max(prediction_probs) * 100
        return predicted_label, confidence
    return None, None

# --- UI LAYOUT (remains the same) ---
st.title("CivicLens - Unified Civic Issue Reporting")
st.write("Upload an image and provide a text description to get a complete analysis.")
st.divider()
col1, col2 = st.columns(2)
with col1:
    st.subheader("📸 Upload an Image")
    uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"], label_visibility="collapsed")
    if uploaded_file is not None:
        st.image(uploaded_file, caption="Your uploaded image.", use_container_width=True)
with col2:
    st.subheader("✍️ Provide a Description")
    user_text = st.text_area("Describe the issue here...", height=250, placeholder="e.g., A deep pothole near the market is causing traffic issues.")
st.divider()
_, col_submit, _ = st.columns([2, 1, 2])
with col_submit:
    submit_button = st.button("Analyze Report", use_container_width=True)

# --- PROCESSING AND DISPLAYING RESULTS ---
if submit_button:
    if uploaded_file is None or not user_text:
        st.warning("⚠️ Please upload an image AND provide a text description before analyzing.")
    else:
        with st.spinner('AI is analyzing your report... This might take a moment.'):
            # --- NEW: Generate Timestamp ---
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            # Run predictions on both models
            image_label, image_confidence = predict_image(uploaded_file)
            text_prediction = predict_text(user_text)

            st.success("Analysis Complete!")

            # --- NEW: Display Full Report ---
            st.subheader("Generated Report for Submission")

            # Create a container with a border for a cleaner look
            with st.container(border=True):
                # Using columns to align labels and values
                rep_col1, rep_col2 = st.columns(2)
                with rep_col1:
                    st.markdown(f"**Category:**")
                    st.markdown(f"**Issue Type (from Image):**")
                    st.markdown(f"**Confidence Score:**")
                with rep_col2:
                    st.markdown(f"`{text_prediction[0]}`")
                    st.markdown(f"`{image_label}`")
                    st.markdown(f"`{image_confidence:.2f}%`")
                
                rep_col3, rep_col4 = st.columns(2)
                with rep_col3:
                    st.markdown(f"**Issue Type (from Text):**")
                    st.markdown(f"**Predicted Severity:**")
                    st.markdown(f"**Timestamp:**")
                with rep_col4:
                    st.markdown(f"`{text_prediction[1]}`")
                    st.markdown(f"`{text_prediction[2]}`")
                    st.markdown(f"`{timestamp}`")

                st.divider()
                st.markdown("**Full Description:**")
                st.info(user_text)

            # Prepare content for the download button
            report_content = f"""
            CIVIC ISSUE REPORT
            ==================
            Timestamp: {timestamp}
            
            - CATEGORY: {text_prediction[0]}
            - ISSUE TYPE (from Text): {text_prediction[1]}
            - SEVERITY: {text_prediction[2]}
            
            - ISSUE TYPE (from Image): {image_label}
            - CONFIDENCE SCORE: {image_confidence:.2f}%
            
            - DESCRIPTION:
            {user_text}
            """

            # Download Button
            st.download_button(
                label="📥 Download Report",
                data=report_content,
                file_name=f"civic_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt",
                mime="text/plain"
            )