"""
URL configuration for CapstoneProject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from accounts.views import Login
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('accounts/', include('accounts.urls')),
    path('api/', Login, name='login'),#todo api 수정 필요
    path('', TemplateView.as_view(template_name='index.html')),
    path('Login/', TemplateView.as_view(template_name='index.html')),
    path('join/', TemplateView.as_view(template_name='index.html')),
    path('Success/', TemplateView.as_view(template_name='index.html')),
    path('calendar/', TemplateView.as_view(template_name='index.html')),
    path('daily/', TemplateView.as_view(template_name='index.html')),
    path('stats/', TemplateView.as_view(template_name='index.html')),
]

#path('login/', serve, {'document_root': settings.STATIC_ROOT, 'path': 'capstone-cra/build/index.html'}),


#if settings.DEBUG:
    #urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

#STATIC_URL = '/static/'

#STATICFILES_DIRS = [
    #os.path.join(BASE_DIR, 'static'),
    #os.path.join(BASE_DIR, 'static/capstone-cra/build')
#]

#STATIC_ROOT = os.path.join(BASE_DIR, 'static', 'staticfiles')

#STATICFILES_EXCLUDE = [
    #'node_modules',
#]