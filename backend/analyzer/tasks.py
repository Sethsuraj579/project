
from celery import shared_task
from .models import Document
from .ai_service import extract_text_from_file, simplify_text

@shared_task
def analyze_document_task(document_id):
    """
    A Celery task to perform AI analysis in the background.
    """
    try:
        document = Document.objects.get(id=document_id)
        
        file_path = document.uploaded_file.path
        raw_text = extract_text_from_file(file_path)
        
        if raw_text:
            simplified_version = simplify_text(raw_text)
            document.simplified_text = simplified_version
        else:
            document.simplified_text = "Could not extract text from the document."
        
        document.save()
        return f"Successfully analyzed document {document_id}"
        
    except Document.DoesNotExist:
        return f"Document with id {document_id} not found."
    except Exception as e:
        # Log the error and potentially update the document state to 'failed'
        print(f"Error analyzing document {document_id}: {e}")
        document.simplified_text = f"An error occurred during analysis: {e}"
        document.save()
        return f"Failed to analyze document {document_id}"