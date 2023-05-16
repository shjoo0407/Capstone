from django.urls import path
from accounts import views

urlpatterns = [
    # accounts(로그인, 로그아웃, 회원가입, 마이페이지 조회)
    path('accounts/login/', views.Login, name='login'),
    path('accounts/logout/', views.Logout, name='logout'),
    #path('accounts/register/',views.Register, name='register'),
    #path('accounts/mypage/<int:id>/', views.Mypage, name='mypage'), -> 'accounts/mypage/' 로 해도 될듯

    # todo(식단 업로드 페이지 조회, Daily 식단 페이지 조회, 식단 통계 페이지 조회, 사진 업로드)
]