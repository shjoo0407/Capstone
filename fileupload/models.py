from django.db import models
from django.utils.safestring import mark_safe
from django.utils.html import format_html

# Create your models here.
class FileUpload(models.Model):
    title = models.TextField(max_length=40, null=True)
    imgfile = models.ImageField(null=True, upload_to="", blank=True)
    content = models.TextField()

    def __str__(self):
        return self.title

    def imgfile_thumbnail(self):
        if self.imgfile:
            thumb_html = '<img src="%s" style="width: 100px; height: 100px;"/>' % self.imgfile.url
        else:
            thumb_html = ''

        return format_html(thumb_html)

    imgfile_thumbnail.short_description = 'Thumbnail'
    imgfile_thumbnail.allow_tags = True
