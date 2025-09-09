
from django.urls import path
from .views import AnalyzeDocumentView

urlpatterns = [
    path('analyze/', AnalyzeDocumentView.as_view(), name='analyze-document'),
]