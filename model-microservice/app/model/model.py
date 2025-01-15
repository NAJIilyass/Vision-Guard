import tensorflow as tf
from pathlib import Path
import cv2
import numpy as np
import requests

image_size = 224
BASE_DIR = Path(__file__).resolve(strict=True).parent

# Load model using TFSMLayer
model = tf.keras.layers.TFSMLayer(
    f"{BASE_DIR}/my_model_directory",
    call_endpoint='serving_default'
)

def preprocess_image(image):
    """Preprocess the image to match model requirements"""
    # Ensure image is in RGB format
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Resize image
    image = cv2.resize(image, (image_size, image_size))
    
    # Convert to float32 and normalize to [0,1]
    image = image.astype('float32') / 255.0
    
    # Add batch dimension
    image = np.expand_dims(image, axis=0)
    
    # Convert to tensor
    image = tf.convert_to_tensor(image)
    
    return image

def predict_pipeline(image_path):
    try:
        # Read the image from the local file path
        image = cv2.imread(image_path)
        
        if image is None:
            raise ValueError("Failed to read image from path")
        
        # Preprocess image
        processed_image = preprocess_image(image)
        
        # Make prediction
        predictions = model(processed_image)
        
        # Handle different types of model outputs
        if isinstance(predictions, dict):
            # Get the first output if it's a dictionary
            prediction_value = list(predictions.values())[0]
        else:
            prediction_value = predictions
        
        # Convert to float and ensure we're getting a single value
        prediction_result = float(prediction_value.numpy().flatten()[0])
        
        return prediction_result

    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")
