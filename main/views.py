from django.shortcuts import render
from accounts.views import validate_token
from accounts.views import get_id_from_token
from django.http import JsonResponse
import json
import requests
from django.http import JsonResponse
from .models import Gallery
from collections import defaultdict
from django.db.models import Sum
from django.db.models.functions import TruncDate
from accounts.models import Account
from .models import Food
from django.views.decorators.csrf import csrf_exempt
from accounts.views import get_user_model
from datetime import date, datetime, timedelta
from django.core.files.storage import FileSystemStorage
import os
from django.conf import settings
from django.core.cache import cache
from collections import defaultdict
import pytz


# Create your views here.

# 식단 업로드 페이지 접속(Calendar)
@csrf_exempt
def Upload(request):
    if validate_token(request):
        # '식단 업로드' 페이지 접속
        if request.method == 'GET':
            userid = get_id_from_token(request)

            # Gallery 에서 날짜별 총 칼로리 섭취량 반환(ex date : 230531, total_calories : 2000)
            aggregated_data = (
                Gallery.objects.filter(user=userid)
                .annotate(total_calories=Sum('kcal'))
                .values('upload_date', 'total_calories')
            )
            print(aggregated_data)

            seoul_tz = pytz.timezone('Asia/Seoul')
            temp_data = [
                {
                    'date': item['upload_date'].astimezone(seoul_tz).strftime('%Y%m%d') if item['upload_date'] is not None else None,
                    'total_calories': item['total_calories']
                }
                for item in aggregated_data
            ]
            print(temp_data)
            # create a dictionary to hold date and total calories
            calories_by_date = defaultdict(float)  # default value of float is 0.0

            for item in temp_data:
                # sum up calories by date
                calories_by_date[item['date']] += item['total_calories']

            # convert the defaultdict to a list of dictionaries
            data = [{'date': k, 'total_calories': v} for k, v in calories_by_date.items()]

            print(data)
            return JsonResponse(data, safe=False, status=200)

        else:
            return JsonResponse({'message': '잘못된 요청'}, status=500)
    else:

        return JsonResponse({'message': '유효하지 않은 토큰'}, status=500)


# 식단 업로드 페이지 -> 날짜 선택
@csrf_exempt
def UploadDate(request, formattedDate):
    if validate_token(request):
        if request.method == 'GET':
            userid = get_id_from_token(request)

            # 권장 섭취량
            recommended = calculator(userid) # 권장 섭취량([칼로리, 탄수화물, 단백질, 지방])
            # 날짜별 각 음식의 영양소 정보

            date = datetime.strptime(formattedDate, '%Y%m%d')
            next_date = date + timedelta(days=1)

            aggregated_data = (
                Gallery.objects.filter(user=userid, upload_date__range=(date, next_date))
                .annotate(date=TruncDate('upload_date'))
                .values('date')
                .annotate(
                    total_kcal=Sum('kcal'),
                    total_carbon=Sum('carbon'),
                    total_pro=Sum('pro'),
                    total_fat=Sum('fat'),
                )
            )

            menulist = [menu['name'] for menu in Gallery.objects.filter(user=userid, upload_date__range=(date, next_date)).order_by('upload_date').values('name')]
            print(menulist)

            if not aggregated_data:
                data = {
                    'menulist': [],
                    'calorie': {
                        'recommended': recommended[0],
                        'actual': 0,
                    },
                    'carbonhydrate': {
                        'recommended': recommended[1],
                        'actual': 0,
                    },
                    'protein': {
                        'recommended': recommended[2],
                        'actual': 0,
                    },
                    'fat': {
                        'recommended': recommended[3],
                        'actual': 0,
                    },
                }
            else:
                data = {
                    'menulist': menulist,
                    'calorie': {
                        'recommended': recommended[0],
                        'actual': int(aggregated_data[0]['total_kcal']),
                    },
                    'carbonhydrate': {
                        'recommended': recommended[1],
                        'actual': int(aggregated_data[0]['total_carbon']),
                    },
                    'protein': {
                        'recommended': recommended[2],
                        'actual': int(aggregated_data[0]['total_pro']),
                    },
                    'fat': {
                        'recommended': recommended[3],
                        'actual': int(aggregated_data[0]['total_fat']),
                    },
                }

            return JsonResponse(data, safe=False, status=200)


# 식단 업로드 페이지 -> 날짜 선택 -> '다음 단계' 클릭
@csrf_exempt
def ImageUpload(request):
    if not validate_token(request):
        return JsonResponse({'error':'유효하지 않은 토큰'}, status=401)

    if request.method == "POST":
        userid = get_id_from_token(request)
        food_image = request.FILES.get('photo') # 음식 이미지

        # Gallery 객체 cache에 임시 저장
        gallery = Gallery(user_id=userid, name='', total='', kcal='', pro='', carbon='', fat='', food_image=food_image)
        cache.set('temp', gallery, timeout=120)

        # predict 수행
        uploaded_file_url = handle_uploaded_file(food_image)
        print(f"uploaded_file_url : {uploaded_file_url}")
        file_path = os.path.join(settings.MEDIA_ROOT, uploaded_file_url.lstrip('/media/')) # 파일 경로 URL

        predicted_name = str(prediction(file_path)) # 모델이 예측한 음식 이름 받아옴

        # 업로드 성공
        try:
            food = Food.objects.get(name=predicted_name)
            data = {
                'message': '사진 업로드 성공',
                'predicted': predicted_name,
                'kcal': food.kcal,
                'carbon': food.carbon,
                'pro': food.pro,
                'fat': food.fat,
                 }
            return JsonResponse(data, status=200)

        except Food.DoesNotExist:
            return JsonResponse({'error': f"{predicted_name} 을 찾을 수 없습니다."}, status=404)
    # POST 요청이 아닌 경우
    return JsonResponse({"error": "Invalid request"}, status=400)


# 식단 업로드 페이지 -> 날짜 선택 -> '다음 단계' 클릭 -> '식단 업로드' 최종 클릭
@csrf_exempt
def Result(request):
    if not validate_token(request):
        return JsonResponse({'error': '유효하지 않은 토큰'}, status=401)

    if request.method == "POST":
        userid = get_id_from_token(request) # userid

        predicted = request.POST.get('realFoodName') # 프론트에서 보낸 예측한 음식 이름 저장
        print(f"predicted : {predicted}")
        predicted_data = search(predicted)

        gallery = cache.get('temp') # 캐시에서 gallery 객체 꺼내옴
        print(gallery)

        # 꺼내온 객체 Gallery 테이블에 저장
        gallery.name = predicted_data['name']
        gallery.total = predicted_data['total']
        gallery.kcal = predicted_data['kcal']
        gallery.pro = predicted_data['pro']
        gallery.carbon = predicted_data['carbon']
        gallery.fat = predicted_data['fat']

        gallery.save()

        return JsonResponse({'message': '최종 업로드 성공'}, status=200)
    return JsonResponse({'error: 잘못된 요청'}, status=400)
@csrf_exempt
def DeleteMenu(request, date, menuId):
    if not validate_token(request):
        return JsonResponse({'error': '유효하지 않은 토큰'}, status=401)

    if request.method == "DELETE":
        userid = get_id_from_token(request)

        format_date = datetime.strptime(date, '%Y%m%d')
        next_date = format_date + timedelta(days=1)

        menulist = [menu['name'] for menu in
                    Gallery.objects.filter(user=userid, upload_date__range=(format_date, next_date)).order_by(
                        'upload_date').values('name')]

        if menuId >= len(menulist):
            return JsonResponse({'error: 잘못된 인덱스'}, status=400)

        menu_to_delete = menulist[menuId]

        menu_obj = Gallery.objects.filter(user=userid, name=menu_to_delete).first()
        if menu_obj:
            menu_obj.delete()
            return JsonResponse({'message': '메뉴 삭제 성공'}, status=200)
        else:
            return JsonResponse({'error': '해당 메뉴를 찾을 수 없음'}, status=404)
    else:
        return JsonResponse({'error: 잘못된 요청'}, status=400)


# 식단 업로드 페이지 -> 날짜 선택 -> '다음 단계' -> 예측이 틀렸을 때 직접 검색
def search(predicted):
    try:
        searched = Food.objects.get(name=predicted)

        data = {
            'name': predicted,
            'total': searched.total,
            'kcal': searched.kcal,
            'carbon': searched.carbon,
            'pro': searched.pro,
            'fat': searched.fat,
        }
        return data
    except Exception as e:
        return "searcherror"
# Daily 식단 페이지 조회
@csrf_exempt
def Daily(request):
    if validate_token(request):
        if request.method == 'GET':

            userid = get_id_from_token(request)

            galleries = Gallery.objects.filter(user=userid)

            aggregated_data = {
                'kcal': defaultdict(int),
                'pro': defaultdict(int),
                'carbon': defaultdict(int),
                'fat': defaultdict(int)
            }

            for gallery in galleries:
                date = gallery.uploaded_at.strftime("%Y%m%d")
                aggregated_data['kcal'][date] += gallery.kcal
                aggregated_data['pro'][date] += gallery.pro
                aggregated_data['carbon'][date] += gallery.carbon
                aggregated_data['fat'][date] += gallery.fat

            data = {
                'kcal': [],
                'pro': [],
                'carbon': [],
                'fat': [],
            }

            for nutrient in ['kcal', 'pro', 'carbon', 'fat']:
                for date, amount in aggregated_data[nutrient].items():
                    data[nutrient].append({'x': date, 'y': amount})

            return JsonResponse(data, safe=False)
        return JsonResponse({'message': '잘못된 요청'}, status=500)
    return JsonResponse({'message': '유효하지 않은 토큰'}, status=500)




# 식단 통계 페이지 조회
def Statistics(request):
    if validate_token(request):
        if request.method == 'GET':
            userid = get_id_from_token(request)
            if request.path == '/api/main/stats/':
                data = get_stat(userid, 7)
                return JsonResponse(data, safe=False, status=200)

            elif request.path == '/api/main/stats/month1/':
                data = get_stat(userid, 30)
                return JsonResponse(data, safe=False, status=200)

            elif request.path == '/api/main/stats/month3/':
                data = get_stat(userid, 90)
                return JsonResponse(data, safe=False, status=200)

            elif request.path == '/api/main/stats/year/':
                data = get_stat(userid, 365)
                return JsonResponse(data, safe=False, status=200)

        return JsonResponse({'message': '잘못된 요청'}, status=500)

    return JsonResponse({'message': '유효하지 않은 토큰'}, status=500)




# 업로드한 이미지 파일 경로
@csrf_exempt
def handle_uploaded_file(uploaded_file):
    fs = FileSystemStorage()
    filename = fs.save(uploaded_file.name, uploaded_file)
    uploaded_file_url = fs.url(filename)
    print(f"fs : {fs}, filename : {filename}, uploaded_file_url : {uploaded_file_url}")
    return uploaded_file_url


# model 예측(torchserve)
@csrf_exempt
def prediction(image_path):
    # 이미지 파일 열기
    with open(image_path, 'rb') as f:
        image_data = f.read() # 이미지

    # torchserve API 호출
    url = 'http://localhost:8080/predictions/model1'  # torchserve의 예측 엔드포인트 URL
    headers = {'Content-Type': 'application/octet-stream'}
    response = requests.post(url, headers=headers, data=image_data)

    # 결과 확인
    if response.status_code == 200:
        result = response.json()
        sorted_data = sorted(result.items(), key=lambda x: x[1], reverse=True) # value 값으로 정렬
        sorted_keys = [item[0] for item in sorted_data]
        label_path = os.path.join(settings.STATIC_ROOT, 'model_label.json')
        label_data = read_json_file(label_path)
        top5 = {}

        for key in sorted_keys:
            label = label_data[key]
            prob = result[key]
            top5[label] = prob

        top5_json = json.dumps(top5) # json 파일로 변환
        print("성공")
        print(f"분류 결과 : {top5_json}")
        return list(top5.keys())[0] # top 1의 음식 이름
    else:
        print("실패")
        return None


# json 파일 읽어오기
@csrf_exempt
def read_json_file(file_path):
    with open(file_path, 'r') as json_file:
        data = json.load(json_file)
        return data


# 기간별(일주일/1개월/3개월/1년) 통계량 계산
@csrf_exempt
def get_stat(userid, p):
    today = datetime.now().date()
    week_ago = today - timedelta(days=p-1)

    stat = {
        'kcal' : [],
        'carbon' : [],
        'pro' : [],
        'fat' : []
    }

    for i in range(p):
        date = week_ago + timedelta(days=i)
        next_date = date + timedelta(days=1)

        daily_stats = Gallery.objects.filter(
            user=userid
        ).filter(
            upload_date__range=(date, next_date)
        ).aggregate(
            total_kcal=Sum('kcal'),
            total_carbon=Sum('carbon'),
            total_pro=Sum('pro'),
            total_fat=Sum('fat')
        )

        stat['kcal'].append({
            'x': date.strftime('%Y/%m/%d'),
            'y': daily_stats['total_kcal'] or 0
        })
        stat['carbon'].append({
            'x': date.strftime('%Y/%m/%d'),
            'y': daily_stats['total_carbon'] or 0
        })

        stat['pro'].append({
            'x': date.strftime('%Y/%m/%d'),
            'y': daily_stats['total_pro'] or 0
        })

        stat['fat'].append({
            'x': date.strftime('%Y/%m/%d'),
            'y': daily_stats['total_fat'] or 0
        })

    return stat


# 칼/탄/단/지 하루 권장 섭취량 계산기
@csrf_exempt
def calculator(userid): # 권장 섭취량(칼로리, 탄수화물, 단백질, 지방) 계산기
    user = Account.objects.get(id=userid)
    today = date.today()

    gender, birth, height, weight = user.gender, user.birth, user.height, user.weight
    birth_year, birth_month, birth_day = str(birth).split('-')[0], str(birth).split('-')[1], str(birth).split('-')[2]
    print(birth_year, birth_month, birth_day)
    # 나이 계산
    if today.month > int(birth_month) or (today.month == int(birth_month) and today.day >= int(birth_day)):
        age = today.year - int(birth_year)
    else:
        age = today.year - int(birth_year) - 1
    # 칼로리
    # BMR 계산(해리스-베네딕트 공식)
    if gender == 'M':
        BMR = 66 + (13.7 * weight) + (5 * height) - (6.5 * age)
    else:
        BMR = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age)

    # 일일 권장 섭취 칼로리(보통 활동 수준 기준으로 BMR * 1.5)
    rec_kcal = int(BMR * 1.5)

    # 탄수화물(전체 섭취량의 50%)
    rec_carbon = int(rec_kcal / 2 / 4)

    # 단백질(보통 몸무게 1kg 당 1g)
    rec_pro = int(weight)

    # 지방(전체 섭취량의 25%)
    rec_fat = int(rec_kcal * 0.25 / 9)
    return [rec_kcal, rec_carbon, rec_pro, rec_fat]







