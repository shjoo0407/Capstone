from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Accounts
from django.contrib.auth.hashers import check_password, make_password

# Create your views here.
def register(request):
    template_url = "../templates/register.html"
    if request.method == "GET":
        return render(request, template_url)
    elif request.method == "POST":
        username = request.POST.get('username', None)
        userpw = request.POST.get('userpw', None)
        re_userpw = request.POST.get('re_userpw', None)

        res_data = {}
        if not (username and userpw and re_userpw):
            res_data["error"] = "모든값을 입력하세요"
        elif userpw != re_userpw:
            res_data["error"] = "비밀번호가 다름"
            # return HttpResponse("비밀번호가 다름")
        else:
            account = Accounts(
                username=username,
                userpw=make_password(userpw),
            )
            account.save()

        return render(request, template_url, res_data)

def login(request):
    template_url = "../templates/login.html"
    if request.method =="GET":
        return render(request, template_url)
    elif request.method =="POST":
        username = request.POST.get('username')
        userpw = request.POST.get('userpw')

        res_data = {}
        if not (username and userpw):
            res_data['error'] = '모든값을 입력하세요'
        else:
            account = Accounts.objects.get(username=username)
            if check_password(userpw, account.userpw):
                request.session['account'] = account.id
                return redirect('/')
            else:
                res_data['error'] = "비밀번호가 다릅니다"
        return render(request, template_url, res_data)

def home(request):
    user_pk = request.session.get('account')
    if user_pk:
        account = Accounts.objects.get(pk=user_pk)
        return HttpResponse(account.username)
    return HttpResponse('로그인 성공')

def logout(request):
    if request.session['account']:
        del(request.session['account'])
    return redirect('/')