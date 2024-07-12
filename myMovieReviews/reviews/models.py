from django.db import models

class MovieReview(models.Model):
    GENRE_CHOICES = [
        ('ACTION', 'Action'),
        ('COMEDY', 'Comedy'),
        ('DRAMA', 'Drama'),
        ('HORROR', 'Horror'),
        ('SCI_FI', 'Science Fiction'),
        ('ROMANCE', 'Romance'),
        ('THRILLER', 'Thriller'),
        ('ANIMATION', 'Animation'),
        ('DOCUMENTARY', 'Documentary'),
        ('OTHER', 'Other'),
    ]

    title = models.CharField(max_length=200)
    director = models.CharField(max_length=100)
    actors = models.CharField(max_length=200)
    genre = models.CharField(max_length=20, choices=GENRE_CHOICES, default='OTHER')
    rating = models.IntegerField()
    release_year = models.IntegerField()
    runtime = models.IntegerField(help_text="Enter runtime in minutes")
    content = models.TextField()
    poster = models.ImageField(upload_to='movie_posters/', null=True, blank=True)

    def __str__(self):
        return self.title

    def get_runtime_display(self):
        hours, minutes = divmod(self.runtime, 60)
        if hours == 0:
            return f"{minutes}분"
        elif minutes == 0:
            return f"{hours}시간"
        else:
            return f"{hours}시간 {minutes}분"