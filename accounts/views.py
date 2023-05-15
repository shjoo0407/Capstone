from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
from .models import Account
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
import json
import jwt
# Create your views here.

# 회원가입
@csrf_exempt
def Register(request):
    if request.method == 'POST':
        request_data = json.loads(request.body)
        id = request_data.get('id') # 아이디
        password = request_data.get('password') # 비밀번호
        name = request_data.get('name') # 이름
        birth = request_data.get('birthdate') # 생년월일
        gender = request_data.get('gender') # 성별
        height = request_data.get('height') # 키
        weight = request_data.get('weight') # 몸무게

        account = get_user_model()

        try:
            # 이미 존재하는 아이디
            if User.objects.filter(username=id).exists():
                return JsonResponse({'message': '이미 존재하는 아이디'}, status=400)

            account.objects.create(
                username=id,
                password=make_password(password),
                name=name,
                birth=birth,
                gender=gender,
                height=height,
                weight=weight
            )
            return JsonResponse({'message': '회원가입 성공'}, status=200)

        except Exception as e:
            return JsonResponse({'message': '오류 발생'}, status=500)

    return JsonResponse({'message': '잘못된 요청'}, status=400)


# 로그인(/api/accounts/login)
@csrf_exempt
#todo 토큰 넘겨주기
def Login(request):
    if request.method == 'POST':
        request_data = json.loads(request.body)
        #print(f"request : {request}")
        #print(f"request_data : {request_data}")
        #print(f"request body : {request.body}")
        username = request_data.get('id')
        password = request_data.get('password')

        #account = get_user_model() # Test : Account 모델 불러오기
        #account.objects.create(username='user1', password=make_password('password1')) # 임의로 집어넣어놓기
        #print(f"username : {username}, {type(username)}, password : {password}, {type(password)}")

        user = authenticate(request=request, username=username, password=password, user_model=Account) # ID, PW로 확인

        # 로그인 성공
        if user is not None:
            print('로그인 성공')
            login(request, user)

            # 토큰 생성
            payload = {
                'userid': user.id,
            }
            jwt_token = jwt.encode(payload, 'SECRET_KEY', algorithm='HS256').decode('utf-8')

            # 데이터
            data = {
                'status': '로그인 성공',
                'id': user.id,
                'name': user.name,
                'birth': user.birth,
                'gender': user.gender,
                'height': user.height,
                'weight': user.weight,
                'token': jwt_token  # JWT 토큰
            }
            #print(f"data : {data}, type : {type(data)}, 'token : {data['token']}")
            return JsonResponse(data, status=200)
        # 로그인 실패
        else:
            print('로그인 실패')
            return JsonResponse({'status': '로그인 정보가 틀립니다.'}, status=400)

    # POST 요청이 아닐 때
    return JsonResponse({'message': '잘못된 요청'}, status=400)

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