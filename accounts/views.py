from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
from .models import Account
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
import json
# Create your views here.

#todo
# 회원가입(/api/auth/register)
# def Register(request):

# 로그인(/api/accounts/login)
@csrf_exempt
def Login(request):
    if request.method == 'POST':
        request_data = json.loads(request.body)
        print(f"request : {request}")
        print(f"request_data : {request_data}")
        print(f"request body : {request.body}")
        username = request_data.get('id')
        password = request_data.get('password')
        print(f"username : {username}, {type(username)}, password : {password}, {type(password)}")
        user = authenticate(request=request, username=username, password=password, user_model=Account) # ID, PW로 확인

        # 로그인 성공
        if user is not None:
            print('로그인 성공')
            login(request, user)
            data = {
                'status': '로그인 성공',
                'id': user.id,
                'name': user.name,
                'birth': user.birth,
                'gender': user.gender,
                'height': user.height,
                'weight': user.weight
            }
            return JsonResponse(data, status=200)
        # 로그인 실패
        else:
            print('로그인 실패')
            return JsonResponse({'status': '로그인 정보가 틀립니다.'}, status=400)

# 로그아웃(/api/accounts/logout)
def Logout(request):
    logout(request) # 로그아웃
    return JsonResponse({'status': '로그아웃 성공'}, status=200)


# 마이페이지 조회(/api/accounts/mypage/{id})
@login_required
def Mypage(request, id):
    if request == 'GET':
        try:
            user = Account.objects.get(pk=id)
        except Account.DoesNotExist:
            return JsonResponse({'status': '해당 계정이 존재하지 않습니다.'}, status=404)

        data = {
            'status': '마이페이지 조회 성공',
            'id': user.id,
            'name': user.name,
            'birth': user.birth,
            'gender': user.gender,
            'height': user.height,
            'weight': user.weight
        }
        return JsonResponse(data, status=200)