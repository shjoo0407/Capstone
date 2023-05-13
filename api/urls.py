from django.urls import path
from accounts import views

urlpatterns = [
    # auth
    path('accounts/login/', views.Login, name='login'),
    path('accounts/logout/', views.Logout, name='logout'),
    #path('/register/',views.Register, name='register'),
]