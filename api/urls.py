from django.urls import path
from accounts import views as view1
from main import views as view2


urlpatterns = [


    # accounts(로그인, 로그아웃, 회원가입, 마이페이지 조회)
    path('accounts/login/', view1.Login, name='login'), # 로그인 요청(POST)
    path('accounts/logout/', view1.Logout, name='logout'), # 로그아웃 요청(POST)
    path('accounts/register/', view1.Register, name='register'), # 회원가입 요청(POST)
    path('accounts/mypage/', view1.Mypage, name='mypage'), # 마이페이지 조회(GET), 회원 정보 수정(PUT), 회원 탈퇴(DELETE)

    # todo(식단 업로드 페이지 조회, Daily 식단 페이지 조회, 식단 통계 페이지 조회, 사진 업로드)
    # main
    # 식단 업로드 페이지
    path('main/upload/', view2.Upload, name='upload'), # 식단 업로드 페이지 조회(GET)
    path('main/calendar/<str:formattedDate>/', view2.UploadDate, name='upload_date'), # 식단 업로드 -> 날짜 선택(해당 날짜의 식단(메뉴들), 칼/탄/단/지), 업로드 후에는)
    #path('main/daily/{date}/fileupload', # todo 식단 업로드 -> 날짜 선택 -> 파일 업로드 버튼 클릭
    path('main/imageupload/', view2.ImageUpload, name='imageupload'),

    path('result/', view2.Result, name='result'),
    path('main/menu/<str:date>/<int:menuId>/', view2.DeleteMenu, name='deletemenu'),

    # Daily 식단 페이지(todo)
    path('main/daily/', view2.Daily, name='daily'), # Daily 식단 페이지 조회(GET)
    #path('main/daily/{date}/',  # #todo Daily 식단 -> 날짜 선택(해당 날짜의 칼/탄/단/지 그래프)(GET)


    # 식단 통계 페이지
    path('main/stats/', view2.Statistics, name='stats'), # 식단 통계 페이지(일주일) 조회(GET)
    path('main/stats/month/', view2.Statistics, name='stats_month1'), # 식단 통계 페이지(1개월) 조회(GET)
    path('main/stats/month3/', view2.Statistics, name='stats_month3'), # 식단 통계 페이지(3개월) 조회(GET)
    path('main/stats/year/', view2.Statistics, name='stats_year'), #식단 통계 페이지(1년) 조회(GET)
]