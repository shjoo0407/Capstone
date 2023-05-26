from django.contrib import admin
from .models import Account

#Register your models here.
class AccountAdmin(admin.ModelAdmin) :
    list_display = ('id', 'password', 'name', 'birth', 'gender', 'height', 'weight', 'last_login', 'is_superuser')

admin.site.register(Account, AccountAdmin)