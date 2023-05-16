from django.shortcuts import render
from accounts.views import validate_token
from accounts.views import get_id_from_token


# Create your views here.
# todo 식단 업로드 페이지 조회
def Upload(request):
    if validate_token(request):
        userid = get_id_from_token(request)
    return

# todo Daily 식단 페이지 조회
def Daily(request):
    if validate_token(request):
        userid = get_id_from_token(request)
    return
# todo 식단 통계 페이지 조회
def Statistics(request):
    if validate_token(request):
        userid = get_id_from_token(request)
    return

# todo 이미지 파일 업로드
def FileUpload(request):
    if validate_token(request):
        userid = get_id_from_token(request)
    return
