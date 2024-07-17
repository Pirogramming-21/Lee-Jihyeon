from django.db import models

class DevTool(models.Model):
    name = models.CharField(max_length=100)
    kind = models.CharField(max_length=50)
    content = models.TextField()