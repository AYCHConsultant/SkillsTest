from django.db import models


# Create your models here.


class SkillInfo(models.Model):
    name = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('-created_at',)
