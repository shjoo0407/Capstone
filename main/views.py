from django.shortcuts import render
from accounts.views import validate_token
from accounts.views import get_id_from_token
from django.http import JsonResponse


# Create your views here.
# todo 식단 업로드 페이지 조회
def Upload(request):
    if request.method == 'GET':
        if validate_token(request):
            userid = get_id_from_token(request)

        return

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
