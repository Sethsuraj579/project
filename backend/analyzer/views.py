from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import DocumentSerializer
from .ai_service import extract_text_from_file, simplify_text
# analyzer/views.py
# ... other imports


# Create your views here.

class AnalyzeDocumentView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = DocumentSerializer(data=request.data)
        if serializer.is_valid():
            # For now, just save the document.
            # We will add the AI logic in the next phase.
            document = serializer.save()
            
            try:
                # 1. Get the full server path of the saved file
                file_path = document.uploaded_file.path
                
                # 2. Extract the raw text from the file using your service
                raw_text = extract_text_from_file(file_path)

                # 3. If text was extracted, call the AI to simplify it
                if raw_text:
                    simplified_version = simplify_text(raw_text)
                    
                    # 4. Save the result back into the 'simplified_text' field
                    document.simplified_text = simplified_version
                    document.save()
                else:
                    # Handle cases where no text could be extracted
                    document.simplified_text = "Could not extract text from the document."
                    document.save()

            except Exception as e:
                # It's good practice to handle potential errors during analysis
                print(f"An error occurred during analysis: {e}")
                document.simplified_text = f"An error occurred during analysis: {e}"
                document.save()

                # Return the uploaded
            final_serializer = DocumentSerializer(document)
            return Response(final_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)