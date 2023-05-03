from django.db import models

# Create your models here.
class Accounts(models.Model):
    # userid = models.CharField(max_length=20, verbose_name="사용자아이디").primary_key
    userpw = models.TextField(max_length=128, verbose_name="사용자비밀번호")
    username = models.TextField(max_length=64, verbose_name="사용자명")
    # gender = models.CharField(max_length=10, verbose_name="성별")
    # weight = models.IntegerField(verbose_name="몸무게")
    # height = models.IntegerField(verbose_name="키")
    registered_dttm = models.DateTimeField(auto_now_add=True, verbose_name="등록 시간")

    def __str__(self):
        return self.username

    class Meta:
        managed = True
        db_table = 'accounts'
        verbose_name ="계정 관리"