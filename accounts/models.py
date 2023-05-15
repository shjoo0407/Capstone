from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class Account(AbstractUser): # + id,password,last_login,is_superuser,username,first_name,last_name,email,is_staff,is_active,date_joined
    name = models.CharField(max_length=30, blank=True, null=True) # 이름
    birth = models.DateField(blank=True, null=True) # 생년월일
    gender = models.CharField(max_length=2, blank=True, null=True) # 성별
    height = models.IntegerField(blank=True, null=True) # 키
    weight = models.IntegerField(blank=True, null=True) # 몸무게

    # related_name을 지정하여 충돌 방지
    groups = models.ManyToManyField('auth.Group', related_name="user_accounts", blank=True)
    user_permissions = models.ManyToManyField('auth.Permission', related_name="user_accounts", blank=True)

    USERNAME_FIELD = 'username'
    PASSWORD_FIELD = 'password'
    class Meta:
        managed = True
        db_table = 'account'

    def __str__(self):
        return self.name