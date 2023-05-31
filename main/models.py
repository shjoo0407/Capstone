from django.db import models
from accounts.models import Account
# Create your models here.

# 사용자별 업로드 정보
class Gallery(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE) # 유저의 id(Account의 primary key('id' 필드)와 연결)
    image_id = models.CharField(max_length=30, blank=False, null=False, primary_key=True) # 음식 이미지 번호
    name = models.CharField(max_length=30) # 음식 이름
    total = models.CharField(max_length=4) # 음식 총량
    kcal = models.CharField(max_length=4) # 칼로리
    carbon = models.CharField(max_length=4) # 탄수화물
    pro = models.CharField(max_length=4) # 단백질
    fat = models.CharField(max_length=4) # 지방
    upload_date = models.DateField(auto_now_add=True) # 이미지 업로드 날짜
    food_image = models.ImageField(upload_to=" #이미지 파일 디렉토리",blank=False, null=False) # 음식 이미지 파일

    class Meta:
        managed = True




# 식품영양정보 DB의 음식
class Food(models.Model):
    name = models.CharField(max_length=30) # 음식 이름
    total = models.CharField(max_length=4) # 음식 총량
    kcal = models.CharField(max_length=4) # 칼로리
    carbon = models.CharField(max_length=4) # 탄수화물
    pro = models.CharField(max_length=4) # 단백질
    fat = models.CharField(max_length=4) # 지방

    class Meta:
        managed = True