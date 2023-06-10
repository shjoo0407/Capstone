from django.contrib import admin
from main.models import Gallery, Food
# Register your models here.
class GalleryAdmin(admin.ModelAdmin) :
    list_display = ('user', 'image_id', 'name', 'total', 'kcal', 'carbon', 'pro', 'fat', 'upload_date', 'food_image')

class FoodAdmin(admin.ModelAdmin):
    list_display = ('name', 'total', 'kcal', 'carbon', 'pro', 'fat')


admin.site.register(Gallery, GalleryAdmin)
admin.site.register(Food, FoodAdmin)