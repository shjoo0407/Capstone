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
from userinfo.views import UserList
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="API 문서",
        default_version="v1",
        description="API 문서입니다.",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@contact.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

#path('admin/', admin.site.urls),
    #path('mydatabase/', UserList.as_view(), name='user-list'),
    #path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
urlpatterns = [
    path('fileupload/', include('fileupload.urls')), # todo 삭제예정
    path('admin/', admin.site.urls),
    path('mydatabase/', include('userinfo.urls')), # todo 삭제예정
    path('', include('fileupload.urls')), # todo 삭제예정
    path('account/', include('login.urls')), # todo 삭제예정
    #path('accounts/', include('accounts.urls')), # 로그인/로그아웃/회원가입
    path('api/', include('api.urls')), # API 호출
]
