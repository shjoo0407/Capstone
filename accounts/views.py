import datetime

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
import logging
from CapstoneProject.settings import SECRET_KEY
from .models import BlacklistedToken
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

        if gender == 'male':
            gender = 'M'
        else:
            gender = 'F'

        print(f"id:{id}, password:{password}, name:{name}, birth:{birth}, gender:{gender}, height:{height}, weight:{weight}")
        account = get_user_model()

        try:
            # 이미 존재하는 아이디
            if account.objects.filter(username=id).exists():
                print("이미 존재하는 아이디")
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
            print("회원가입 성공!")
            return JsonResponse({'message': '회원가입 성공'}, status=200)

        except Exception as e:
            print("오류 발생")
            return JsonResponse({'message': '오류 발생'}, status=500)
    print("잘못된 요청")
    return JsonResponse({'message': '잘못된 요청'}, status=400)

# 로그인
@csrf_exempt
#todo 토큰 넘겨주기
def Login(request):
    if request.method == 'POST':
        request_data = json.loads(request.body)

        username = request_data.get('id')
        password = request_data.get('password')

        user = authenticate(request=request, username=username, password=password, user_model=Account) # ID, PW로 확인

        # 로그인 성공
        if user is not None:
            print('로그인 성공')
            login(request, user)

            # 토큰 생성
            expired = datetime.datetime.utcnow() + datetime.timedelta(minutes=1440) # 만료 시간
            payload = {
                'userid': user.id,
                'exp': expired,
            }
            jwt_token = jwt.encode(payload, SECRET_KEY, algorithm='HS256') # jwt 토큰

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
            return JsonResponse({'message': '로그인 정보가 틀립니다.'}, status=400)

    # POST 요청이 아닐 때
    return JsonResponse({'message': '잘못된 요청'}, status=400)

# 로그아웃
@csrf_exempt
def Logout(request):
    jwt_token = request.META.get('HTTP_AUTHORIZATION').split(' ')[1]
    try:
        #decoded_token = jwt.decode(jwt_token, SECRET_KEY, algorithms=['HS256'])
        if is_token_blacklisted(jwt_token):
            return JsonResponse({'message': '이미 로그아웃된 토큰입니다'}, status=400)

        invalidate_token(jwt_token) # 토큰 블랙리스트에 추가
        logout(request) # 로그아웃
        return JsonResponse({'message': '로그아웃 성공'}, status=200)

    except jwt.ExpiredSignatureError:
        return JsonResponse({'message': '만료된 토큰입니다.'}, status=400)

    except jwt.InvalidTokenError:
        return JsonResponse({'message': '유효하지 않은 토큰입니다.'}, status=400)

    return JsonResponse({'message': '로그아웃 실패'}, status=400)

# 마이페이지 조회
@csrf_exempt
def Mypage(request):
    if validate_token(request): # 토큰 유효성 검증
        try:
            account = get_user_model()  # Account
            userid = get_id_from_token(request)  # 토큰에서 userid 가져옴
            user = account.objects.get(id=userid)
        except account.DoesNotExist:
            return JsonResponse({'message': '해당 계정이 존재하지 않습니다.'}, status=404)

        # 마이페이지 조회
        if request.method == 'GET':
            gender = '남성' if user.gender == 'M' else '여성'
            data = {
                'message': '마이페이지 조회 성공',
                'id': user.username,
                'name': user.name,
                'birthdate': user.birth,
                'gender': gender,
                'height': user.height,
                'weight': user.weight
            }
            return JsonResponse(data, status=200)

        # 회원 정보 수정
        elif request.method == 'PUT':
            try:
                request_data = json.loads(request.body)

                # 정보 수정
                data_type = request_data.get('type', None)  # 데이터 타입 가져오기 (height, weight)
                if data_type == 'height':
                    user.height = request_data.get('data', user.height)  # 키
                elif data_type == 'weight':
                    user.weight = request_data.get('data', user.weight)  # 몸무게
                user.username = request_data.get('username', user.username)  # 아이디
                user.name = request_data.get('name', user.name)  # 이름
                user.birth = request_data.get('birthdate', user.birth)  # 생년월일
                user.gender = request_data.get('gender', user.gender)  # 성별
                user.save()

                return JsonResponse({'message': '회원 정보 수정 성공'}, status=200)

            except account.DoesNotExist:
                return JsonResponse({'message': '해당 계정이 존재하지 않습니다.'}, status=404)

        # 회원 정보 삭제
        elif request.method == 'DELETE':
            try:
                user.delete() # 탈퇴

                return JsonResponse({'message': '회원 탈퇴 성공'}, status=200)

            except account.DoesNotExist:
                return JsonResponse({'message': '해당 계정이 존재하지 않습니다.'}, status=404)
        else:
            return JsonResponse({'message': '잘못된 요청 메소드입니다.'}, status=405)
    else:
        return JsonResponse({'message': '토큰 검증에 실패했습니다.'}, status=401)

# 토큰 블랙리스트에 추가
def invalidate_token(token):
    BlacklistedToken.objects.create(token=token)

# 토큰 블랙리스트 존재 여부
def is_token_blacklisted(token):
    return BlacklistedToken.objects.filter(token=token).exists()

# (jwt)토큰 유효성 검증
def validate_token(request):
    jwt_token = request.META.get('HTTP_AUTHORIZATION').split(' ')[1] #todo (지금은 Header의 'HTTP_AUTHORIZATION'에 ['Bearer', '<token>'] 요청받는 경우)
    try:
        decoded_token = jwt.decode(jwt_token, SECRET_KEY, algorithms=['HS256']) #todo
        userid = decoded_token['userid']

        account = get_user_model()
        user = account.objects.get(id=userid)

        if user.is_authenticated:
            return True # 사용자 인증 성공
        else:
            return False # 사용자 인증 실패

    except jwt.ExpiredSignatureError:
        return False # 토큰 만료
    except (jwt.InvalidTokenError, User.DoesNotExist):
        return False # 유효하지 않은 토큰

# (jwt) 토큰에서 사용자 id 받아오기(실제 아이디는 username, id : 1,2,3,4, ...)
def get_id_from_token(request):
    jwt_token = request.META.get('HTTP_AUTHORIZATION').split(' ')[1]
    decoded_token = jwt.decode(jwt_token, SECRET_KEY, algorithms=['HS256'])
    userid = decoded_token['userid']
    return userid