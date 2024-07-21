from django.contrib import admin
from .models import Post, PostImage, Comment, Like, Reply

class PostImageInline(admin.TabularInline):
    model = PostImage
    extra = 1

class PostAdmin(admin.ModelAdmin):
    inlines = [PostImageInline]
    list_display = ['user', 'caption', 'created_at']

admin.site.register(Post, PostAdmin)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Reply)