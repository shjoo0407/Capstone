from django.db import models
from accounts.models import Account
# Create your models here.

# todo 사용자 별 
class Gallery(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    image_id = models.CharField(max_length=30, blank=False, null=False, primary_key=True)
    name = models.CharField(max_length=30)
    total = models.CharField(max_length=4)
    kcal = models.CharField(max_length=4)
    carbon = models.CharField(max_length=4)
    pro = models.CharField(max_length=4)
    fat = models.CharField(max_length=4)
    upload_date = models.DateField(auto_now_add=True)
    food_image = models.ImageField(upload_to=" #이미지 파일 디렉토리",blank=False, null = False)

    class Meta:
        managed = True




class Food(models.Model):
    name = models.CharField(max_length=30)
    total = models.CharField(max_length=4)
    kcal = models.CharField(max_length=4)
    carbon = models.CharField(max_length=4)
    pro = models.CharField(max_length=4)
    fat = models.CharField(max_length=4)

    class Meta:
        managed = True

