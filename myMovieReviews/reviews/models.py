from django.db import models

# Create your models here.
class MovieReview(models.Model):
    title = models.CharField(max_length=200)
    director = models.CharField(max_length=100)
    actors = models.CharField(max_length=200)
    genre = models.CharField(max_length=100)
    rating = models.IntegerField()
    release_year = models.IntegerField()
    runtime = models.IntegerField()
    content = models.TextField()

    def __str__(self):
        return self.title