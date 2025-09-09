# backend/analyzer/ai_service.py
import os
from transformers import pipeline
import fitz
import docx

# Initialize the summarization pipeline. This will download the model on the first run.
# It's better to load it once here so it's not reloaded on every request.
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def extract_text_from_file(file_path):
    text = ""
    if file_path.endswith('.pdf'):
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text()
    elif file_path.endswith('.docx'):
        doc = docx.Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    return text

def simplify_text(text_content):
    # For long legal docs, you may need to process them in chunks.
    # For now, let's take the first 1024 tokens for this example.
    max_chunk_length = 1024
    
    # Using the summarizer as our "simplifier"
    summary = summarizer(text_content[:max_chunk_length], max_length=150, min_length=40, do_sample=False)
    
    return summary[0]['summary_text']