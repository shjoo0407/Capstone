from django.contrib import admin
from .models import User

# Register your models here.
class SearchUser(admin.ModelAdmin):
    search_fields = ['user_id']


admin.site.register(User, SearchUser)