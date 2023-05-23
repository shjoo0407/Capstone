from django.shortcuts import render
from accounts.views import validate_token
from accounts.views import get_id_from_token
from django.http import JsonResponse
import json
from django.http import JsonResponse
from .models import Gallery
from collections import defaultdict

# Create your views here.
# todo 식단 업로드 페이지 조회
def Upload(request):
    if request.method == 'GET':
        if validate_token(request):
            userid = get_id_from_token(request)

            # 모든 Gallery 객체를 조회합니다.
            galleries = Gallery.objects.all(user=userid)
            # 각 객체의 정보를 JSON 형식으로 변환합니다.
            data = [{'name': gallery.name,
                     'total': gallery.total,
                     'kcal': gallery.kcal,
                     'protein': gallery.protein,
                     'carbon': gallery.carbon,
                     'fat': gallery.fat,
                     'uploaded_at': gallery.uploaded_at} for gallery in galleries]
            # 결과를 반환합니다.
            return JsonResponse(data, safe=False, status=200)

        return JsonResponse({'message: 잘못된 요청'}, status=500)

    if validate_token(request):
        if request.method == "POST":
            #request_data = json.loads(request.body)
            name = request.POST.get('name')
            total = request.POST.get('total')
            kcal = request.POST.get('kcal')
            pro = request.POST.get('protein')
            carbon = request.POST.get('carbon')
            fat = request.POST.get('fat')

            if 'image' in request.FILES:
                image = request.FILES['image']
                gallery = Gallery(name=name, total=total, kcal=kcal, pro=pro, carbon=carbon, fat=fat, food_image=image)
                gallery.save()

            else:
                return JsonResponse({'message': '이미지 파일이 필요합니다.'}, status=400)

            return JsonResponse({'message': '성공적으로 업로드되었습니다.'}, status=200)

    return JsonResponse({'message': '잘못된 요청'}, status=500)


# todo 데일리 식단 페이지 조회
def Daily(request):
    data = {}
    if request.method == 'GET':

        if validate_token(request):

            userid = get_id_from_token(request)

            galleries = Gallery.objects.all(user=userid)

            aggregated_data = {
                'kcal': defaultdict(int),
                'pro': defaultdict(int),
                'carbon': defaultdict(int),
                'fat': defaultdict(int)
            }

            for gallery in galleries:
                date = gallery.uploaded_at.strftime("%Y-%m-%d")
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

            for nutrient in ['kcal','pro', 'carbon', 'fat']:
                for date, amount in aggregated_data[nutrient].items():
                    data[nutrient].append({'x': date, 'y': amount})

        return JsonResponse(data, safe=False)

    return JsonResponse({'message': '잘못된 요청'}, status=500)


# todo 식단 통계 페이지 조회
def Statistics(request):
    data = {}
    if request.method == 'GET':

        if validate_token(request):

            userid = get_id_from_token(request)

            galleries = Gallery.objects.all(user=userid)

            aggregated_data={
                'pro': defaultdict(int),
                'carbon': defaultdict(int),
                'fat': defaultdict(int)
            }

            for gallery in galleries:
                date = gallery.uploaded_at.strftime("%Y-%m-%d")
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


# todo 이미지 파일 업로드
def FileUpload(request):
    if request.method == 'POST':
        if validate_token(request):
            userid = get_id_from_token(request)
        return
    return JsonResponse({'message': '잘못된 요청'}, status=500)
