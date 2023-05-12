from django.contrib import admin
from .models import Account

#Register your models here.
class AccountAdmin(admin.ModelAdmin) :
    list_display = ('id', 'password', 'name', 'birth', 'gender', 'height', 'weight')

admin.site.register(Account, AccountAdmin)