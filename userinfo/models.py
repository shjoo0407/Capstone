from django.db import models

# Create your models here.
class User(models.Model):
    user_id = models.CharField(primary_key=True, max_length=30)
    user_pw = models.CharField(max_length=30, blank=True, null=True)
    user_name = models.CharField(max_length=30, blank=True, null=True)
    user_birth = models.DateField(blank=True, null=True)
    user_gender = models.CharField(max_length=2, blank=True, null=True)
    user_height = models.IntegerField(blank=True, null=True)
    user_weight = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user'

class Gallery(models.Model):
    food_id = models.CharField(primary_key=True, max_length=30)
    food_name = models.CharField(max_length=30, blank=True, null=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    food_calorie = models.IntegerField(blank=True, null=True)
    food_image = models.ImageField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'gallery'
