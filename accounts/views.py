from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from .models import Account
# Create your views here.

#todo
# 회원가입(/api/auth/register)
# def Register(request):

# 로그인(/api/auth/login)
def Login(request):
    if request.method == 'POST':
        userid = request.POST['id']
        userpw = request.POST['password']
        user = authenticate(request, username=userid, password=userpw, user_model=Account) # ID, PW로 확인

        # 로그인 성공
        if user is not None:
            login(request, user)
            return JsonResponse({
                'status':'로그인 성공',
                'id': user.id,
                'name': user.name,
                'birth': user.birth,
                'gender': user.gender,
                'weight': user.weight
            }, status=200)

        # 로그인 실패
        elif user.objects.filter(username=userid).exists(): # 비밀번호 틀림
            return JsonResponse({'status':'비밀번호가 일치하지 않습니다.'}, status=400)

        else: # 아이디 없음
            return JsonResponse({'status':'존재하지 않는 아이디입니다.'}, status=400)


# 로그아웃(/api/auth/logout)
def Logout(request):
    logout(request) # 로그아웃
    return JsonResponse({'status': '로그아웃 성공'}, status=200)