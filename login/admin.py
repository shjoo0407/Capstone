from django.contrib import admin
from .models import Accounts

# Register your models here.
class AccountAdmin(admin.ModelAdmin) :
    list_display = ('username', 'userpw')

admin.site.register(Accounts, AccountAdmin)