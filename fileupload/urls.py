from django.urls import path
from .views import *
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', fileUpload, name="fileupload"),
    path('train/', train, name="train"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)