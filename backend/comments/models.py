from django.db import models

# Create your models here.

class Comment(models.Model):
    author = models.CharField(max_length=200)
    text = models.TextField(blank=False, null=False)
    date = models.DateTimeField()
    likes = models.IntegerField(default=0)
    image = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"@{self.author}: {self.text}"

class Reply(models.Model):
    parent = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='replies')
    author = models.CharField(max_length=200, default='admin')
    text = models.TextField(blank=False, null=False)
    date = models.DateTimeField()
    likes = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.author}: {self.text}"
