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
from datetime import date

# Create your views here.
# todo 식단 업로드 페이지 조회
def Upload(request):
    if validate_token(request):
        # '식단 업로드' 페이지 접속
        if request.method == 'GET':
            userid = get_id_from_token(request)

            # Gallery 에서 날짜별 총 칼로리 섭취량 반환(ex date : 230531, total_calories : 2000)
            aggregated_data = (
                Gallery.objects.filter(user=userid)
                .annotate(date=TruncDate('uploaded_at'))
                .values('date')
                .annotate(total_calories=Sum('kcal'))
                .values('date', 'total_calories')
            )

            data = [
                {
                    'date': item['date'].strftime('%Y%m%d'),
                    'total_calories': item['total_calories']
                }
                for item in aggregated_data
            ]

            # galleries = Gallery.objects.filter(user=userid)
            # # 각 객체의 정보를 JSON 형식으로 변환합니다.
            # data = [{'name': gallery.name,
            #          'total': gallery.total,
            #          'kcal': gallery.kcal,
            #          'protein': gallery.protein,
            #          'carbon': gallery.carbon,
            #          'fat': gallery.fat,
            #          'uploaded_at': gallery.uploaded_at} for gallery in galleries]
            # 결과를 반환합니다.
            return JsonResponse(data, safe=False, status=200)

        # 식단 업로드 버튼
    #     elif request.method == "POST":
    #         #request_data = json.loads(request.body)
    #         name = request.POST.get('name')
    #         total = request.POST.get('total')
    #         kcal = request.POST.get('kcal')
    #         pro = request.POST.get('protein')
    #         carbon = request.POST.get('carbon')
    #         fat = request.POST.get('fat')
    #
    #         if 'image' in request.FILES:
    #             image = request.FILES['image']
    #             gallery = Gallery(name=name, total=total, kcal=kcal, pro=pro, carbon=carbon, fat=fat, food_image=image)
    #             gallery.save()
    #
    #         else:
    #             return JsonResponse({'message': '이미지 파일이 필요합니다.'}, status=400)
    #
    #         return JsonResponse({'message': '성공적으로 업로드되었습니다.'}, status=200)
        else:
            return JsonResponse({'message': '잘못된 요청'}, status=500)
    else:

        return JsonResponse({'message': '유효하지 않은 토큰'}, status=500)


# todo 데일리 식단 페이지 조회
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

def UploadDate(request, date=None):
    if validate_token(request):
        if request.method == 'GET':
            userid = get_id_from_token(request)
            # 권장 섭취량
            recommended = calculator(userid) # 권장 섭취량([칼로리, 탄수화물, 단백질, 지방])
            # 날짜별 각 음식의 영양소 정보
            food_data = (
                Gallery.objects.filter(user=userid, uploaded_date=date)
                .values('name', 'kcal', 'protein', 'carbon', 'fat')
            )

            # 날짜별 각 영양소의 총합
            aggregated_data = (
                Gallery.objects.filter(user=userid, upload_date=date)
                .annotate(
                    total_kcal=Sum('kcal'),
                    total_pro=Sum('protein'),
                    total_carbon=Sum('carbon'),
                    total_fat=Sum('fat')
                )
                .values('total_kcal', 'total_pro', 'total_carbon', 'total_fat')[0]
            )
            menulist = Gallery.objects.filter(user=userid).order_by('upload_date').values_list('name', flat=True)
            # data = {
            #     'date': date,
            #     'total_kcal': aggregated_data['total_kcal'],
            #     'total_pro': aggregated_data['total_pro'],
            #     'total_carbon': aggregated_data['total_carbon'],
            #     'total_fat': aggregated_data['total_fat'],
            #     'foods': list(food_data)
            # }
            data = {
                'menulist': menulist,
                'Calorie': {
                    'Recommended': recommended[0],
                    'Actual': int(aggregated_data['total_kcal']),
                },
                'Carbonhydrate': {
                    'Recommended': recommended[1],
                    'Actual': int(aggregated_data['total_carbon']),
                },
                'Protein': {
                    'Recommended': recommended[2],
                    'Actual': int(aggregated_data['total_protein']),
                },
                'Fat': {
                    'Recommended': recommended[3],
                    'Actual': int(aggregated_data['total_fat']),
                },
            }

            return JsonResponse(data, safe=False, status=200)

        #사진 업로드 버튼 "다음 단계"
        elif request.method == "POST":
            userid = get_id_from_token(request)
            food_image = request.FILES.get('food_image')
            if food_image:
                # Create a new Gallery entry with the image
                gallery = Gallery.objects.create(user=userid, food_image=food_image)

                # Process the image
                response = prediction(gallery.food_image.path)
                result = response.json()

                # Update the Gallery entry with the image data
                gallery.name = result['name']
                gallery.total = result['total']
                gallery.kcal = result['kcal']
                gallery.pro = result['pro']
                gallery.carbon = result['carbon']
                gallery.fat = result['fat']
                gallery.save()

                return JsonResponse({
                    'message': 'Image uploaded successfully',
                    'id': gallery.image_id,
                    'name': result['name'],
                    'total': result['total'],
                    'kcal': result['kcal'],
                    'pro': result['pro'],
                    'carbon': result['carbon'],
                    'fat': result['fat'],
                }, status=200)

            else:
                return JsonResponse({'message': '이미지 파일이 필요합니다.'}, status=400)

    return JsonResponse({'message': '유효하지 않은 토큰'}, status=500)



# todo 식단 통계 페이지 조회
def Statistics(request):
    if validate_token(request):
        if request.method == 'GET':

            userid = get_id_from_token(request)

            galleries = Gallery.objects.filter(user=userid)

            aggregated_data = {
                'pro': defaultdict(int),
                'carbon': defaultdict(int),
                'fat': defaultdict(int)
            }

            for gallery in galleries:
                date = gallery.uploaded_at.strftime("%Y%m%d")
                aggregated_data['pro'][date] += gallery.pro
                aggregated_data['carbon'][date] += gallery.carbon
                aggregated_data['fat'][date] += gallery.fat

            data = {
                'pro': [],
                'carbon': [],
                'fat': [],
            }

            for nutrient in ['pro', 'carbon', 'fat']:
                for date, amount in aggregated_data[nutrient].items():
                    data[nutrient].append({'x': date, 'y': amount})

            return JsonResponse(data, safe=False)

        return JsonResponse({'message': '잘못된 요청'}, status=500)

    return JsonResponse({'message': '유효하지 않은 토큰'}, status=500)


# todo 이미지 파일 업로드 &
# def FileUpload(request):
#     if validate_token(request):
#         if request.method == 'POST':
#             userid = get_id_from_token(request)
#             food_image = request.FILES['food_image']
#
#             gallery = Gallery.objects.create(
#                 user=userid,
#                 food_image=food_image
#             )
#
#             response = prediction(gallery.food_image.path)
#             result = response.json()
#
#             gallery.name = result['name']
#             gallery.total = result['total']
#             gallery.kcal = result['kcal']
#             gallery.pro = result['pro']
#             gallery.carbon = result['carbon']
#             gallery.fat = result['fat']
#             gallery.save()
#
#             return JsonResponse({'message':'Image uploaded successfully',
#                                  'id': gallery.image_id,
#                                  'name': result['name'],
#                                  'total': result['total'],
#                                  'kcal': result['kcal'],
#                                  'pro': result['pro'],
#                                  'carbon': result['carbon'],
#                                  'fat': result['fat'],
#                                  }, status=200)
#
#     return JsonResponse({'message': '잘못된 요청'}, status=500)

def ImageUpload(request):
    if validate_token(request):
        if request.method == "POST":
            userid = get_id_from_token(request)
            food_image = request.FILES.get('food_image')
            if food_image:
                # Create a new Gallery entry with the image
                gallery = Gallery.objects.create(user=userid, food_image=food_image)

                # Process the image
                response = prediction(gallery.food_image.path)
                result = response.json()

                # Update the Gallery entry with the image data
                gallery.name = result['name']
                gallery.total = result['total']
                gallery.kcal = result['kcal']
                gallery.pro = result['pro']
                gallery.carbon = result['carbon']
                gallery.fat = result['fat']
                gallery.save()

                return JsonResponse({
                    'message': 'Image uploaded successfully',
                    'id': gallery.image_id,
                    'name': result['name'],
                    'total': result['total'],
                    'kcal': result['kcal'],
                    'pro': result['pro'],
                    'carbon': result['carbon'],
                    'fat': result['fat'],
                }, status=200)

            else:
                return JsonResponse({'message': '이미지 파일이 필요합니다.'}, status=400)

#todo(모델을 이용하여 이미지 분류)
# 0. .mar 경로 : model/model_store/<.mar file>
# 1. .mar 생성(torch-model-archiver --model-name <모델이름> --version <버전> --model-file <모델파일(.py)> --serialized-file <.pth파일> --handler <handler 파일> --export-path model/model_store/)
# 2. torchserve 서버에 모델 등록(torchserve --model-store model/model_store --models <모델이름>=model/model_store/<.mar파일> --host <localhost or 퍼블릭 IPv4 주소> --port <8080 or 80 or 443>)
# 3. torchserve 서버 시작/중지(torchserve --start // torchserve --stop)
# 4. torchserve API 호출 후 등록된 모델에 이미지 넣어서 결과 확인

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
        # ex) result = {
        #   "53": 0.9821317195892334,
        #   "125": 0.016887102276086807,
        #   "58": 0.0008895615465007722,
        #   "81": 5.9507572586881e-05,
        #   "123": 1.2144737411290407e-05
        # }
        sorted_data = sorted(result.items(), key=lambda x: x[1], reverse=True) # value 값으로 정렬
        sorted_keys = [item[0] for item in sorted_data]

        label_data = read_json_file('../model/model_label.json')
        top5 = {}
        for key in sorted_keys:
            label = label_data[key], prob = result[key]
            top5[label] = prob

        top5_json = json.dumps(top5) # json 파일로 변환
        print("성공")
        print(f"분류 결과 : {top5_json}")
        return result
    else:
        print("실패")
        return None

def read_json_file(file_path):
    with open(file_path, 'r') as json_file:
        data = json.load(json_file)
        return data

def calculator(userid): # 권장 섭취량(칼로리, 탄수화물, 단백질, 지방) 계산기
    user = Account.objects.get(id=userid)
    today = date.today()
    type(today)

    gender, birth, height, weight = user.gender, user.birth, user.height, user.weight
    birth_year, birth_month, birth_day = str(birth).split('-')[0], str(birth).split('-')[1], str(birth).split('-')[2]

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
    rec_fat = int(rec_kcal / 0.25 / 9)
    return [rec_kcal, rec_carbon, rec_pro, rec_fat]
# 테스트
from .forms import ImageUploadForm
from  django.conf import settings
def test_view(request):
    if request.method == 'POST':
        form = ImageUploadForm(request.POST, request.FILES)
        if form.is_valid():
            image_file = form.cleaned_data['image']
            image_url = settings.MEDIA_URL + image_file.name
            print(f"image_file : {image_file}, image_url : {image_url}")
        else:
            form = ImageUploadForm()

        return render(request, 'testview.html', {'form': form})

