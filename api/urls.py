from django.urls import path
from accounts import views

urlpatterns = [
    # accounts
    path('accounts/login/', views.Login, name='login'),
    path('accounts/logout/', views.Logout, name='logout'),
    #path('accounts/register/',views.Register, name='register'),
    path('accounts/mypage/<int:id>/', views.Mypage, name='mypage'),

]