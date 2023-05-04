from django.shortcuts import render, redirect
from .forms import FileUploadForm
from .models import FileUpload

# Create your views here.
def fileUpload(request):
    if request.method == 'POST':
        title = request.POST['title']
        content = request.POST['content']
        img = request.FILES['imgfile']
        fileupload = FileUpload(
            title=title,
            content=content,
            imgfile=img,
        )
        fileupload.save() # 업로드한 파일 서버, DB에 저장
        return redirect('fileupload')
    else:
        fileuploadForm = FileUploadForm
        context = {
            'fileuploadForm': fileuploadForm,
        }
        return render(request, '../templates/fileupload.html', context)
