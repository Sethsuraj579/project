from django.db import models

# Create your models here.

class Document(models.Model):
    # The original file uploaded by the user
    uploaded_file = models.FileField(upload_to='documents/')
    # The simplified text we will generate
    simplified_text = models.TextField(blank=True, null=True)
    # The timestamp of when it was uploaded
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.uploaded_file.name