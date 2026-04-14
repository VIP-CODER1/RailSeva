# from PIL import Image
# import torch
# from transformers import CLIPProcessor, CLIPModel
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.linear_model import LogisticRegression

# device = "cuda" if torch.cuda.is_available() else "cpu"

# model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
# processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# complaints = [
#     "dirty platform",
#     "broken equipment",
#     "overcrowded platform",
#     "unsafe conditions",
#     "missing amenities",
#     "inadequate lighting",
#     "broken signage",
#     "empty platform",
#     "poor seating",
#     "lack of information"
# ]

# complaint_descriptions = [
#     "dirty platform",
#     "broken equipment",
#     "overcrowded platform",
#     "unsafe conditions",
#     "missing amenities",
#     "inadequate lighting",
#     "broken signage",
#     "empty platform",
#     "poor seating",
#     "lack of information"
# ]

# complaint_categories = [
#     "Cleanliness",
#     "Maintenance",
#     "Crowd Control",
#     "Safety",
#     "Facilities",
#     "Lighting",
#     "Signage",
#     "Timeliness",
#     "Comfort",
#     "Information"
# ]

# vectorizer = TfidfVectorizer()
# X = vectorizer.fit_transform(complaint_descriptions)
# classifier = LogisticRegression()
# classifier.fit(X, complaint_categories)


# def generate_complaint_description(image):
#     inputs = processor(text=complaints, images=image, return_tensors="pt", padding=True).to(device)
#     with torch.no_grad():
#         outputs = model(**inputs)
#     logits_per_image = outputs.logits_per_image
#     probs = logits_per_image.softmax(dim=1)
#     description = complaints[probs.argmax().item()]
#     return description


# def classify_complaint_description(description):
#     X_desc = vectorizer.transform([description])
#     category = classifier.predict(X_desc)[0]
#     return category


















from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import os
import shutil
from PIL import Image
import pytesseract
import numpy as np
import cv2
import pytesseract

# Use Windows-specific Tesseract path only when running on Windows.
if os.name == "nt":
    windows_tesseract = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    if os.path.exists(windows_tesseract):
        pytesseract.pytesseract.tesseract_cmd = windows_tesseract
else:
    tesseract_bin = shutil.which("tesseract")
    if tesseract_bin:
        pytesseract.pytesseract.tesseract_cmd = tesseract_bin

# Then proceed with the rest of the OCR code

device = "cuda" if torch.cuda.is_available() else "cpu"

model = None
processor = None


# Lazily loads the CLIP model so the service only pays the cost when needed.
def _ensure_clip_loaded():
    global model, processor
    if model is None or processor is None:
        model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
        processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

complaints = [
    "dirty platform",
    "broken equipment",
    "overcrowded platform",
    "unsafe conditions",
    "missing amenities",
    "inadequate lighting",
    "broken signage",
    "empty platform",
    "poor seating",
    "lack of information"
]

complaint_descriptions = [
    "dirty platform",
    "broken equipment",
    "overcrowded platform",
    "unsafe conditions",
    "missing amenities",
    "inadequate lighting",
    "broken signage",
    "empty platform",
    "poor seating",
    "lack of information"
]

complaint_categories = [
    "Cleanliness",
    "Maintenance",
    "Crowd Control",
    "Safety",
    "Facilities",
    "Lighting",
    "Signage",
    "Timeliness",
    "Comfort",
    "Information"
]

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(complaint_descriptions)
classifier = LogisticRegression()
classifier.fit(X, complaint_categories)


# Generates a likely complaint description from an uploaded image.
def generate_complaint_description(image):
    _ensure_clip_loaded()
    inputs = processor(text=complaints, images=image, return_tensors="pt", padding=True).to(device)
    with torch.no_grad():
        outputs = model(**inputs)
    logits_per_image = outputs.logits_per_image
    probs = logits_per_image.softmax(dim=1)
    description = complaints[probs.argmax().item()]
    return description


# Maps a generated complaint description to a complaint category.
def classify_complaint_description(description):
    X_desc = vectorizer.transform([description])
    category = classifier.predict(X_desc)[0]
    return category


# OCR


# Prepares the image so OCR has a cleaner binary input.
def simple_preprocess(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY)
    return binary


# Extracts text from the preprocessed image using Tesseract.
def perform_ocr(image):
    processed_image = simple_preprocess(image)
    text = pytesseract.image_to_string(processed_image)
    return text



