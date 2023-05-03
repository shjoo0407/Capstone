from django.urls import path
from .views import *

urlpatterns = [
    path('', UserList.as_view(), name='user-list')
]