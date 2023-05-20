from django.shortcuts import render
from accounts.views import validate_token
from accounts.views import get_id_from_token
from django.http import JsonResponse
import json
from django.http import JsonResponse
from .models import Gallery


# Create your views here.
# todo 식단 업로드 페이지 조회
def Upload(request):
    if request.method == 'GET':
        if validate_token(request):
            userid = get_id_from_token(request)

        return
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
    if request.method == 'GET':
        if validate_token(request):
            userid = get_id_from_token(request)
        return

    return JsonResponse({'message': '잘못된 요청'}, status=500)


# todo 식단 통계 페이지 조회
def Statistics(request):
    if request.method == 'GET':
        if validate_token(request):
            userid = get_id_from_token(request)
        return
    return JsonResponse({'message': '잘못된 요청'}, status=500)


# todo 이미지 파일 업로드
def FileUpload(request):
    if request.method == 'POST':
        if validate_token(request):
            userid = get_id_from_token(request)
        return
    return JsonResponse({'message': '잘못된 요청'}, status=500)
