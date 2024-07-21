from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from .models import Post, Comment, Like, Reply
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count

def home(request):
    sort = request.GET.get('sort', 'recent')
    if sort == 'popular':
        posts = Post.objects.annotate(like_count=Count('like')).order_by('-like_count', '-created_at')
    else:
        posts = Post.objects.order_by('-created_at')
    for post in posts:
        for image in post.images.all():
            print(f"Image path: {image.image.path}")
            print(f"Image URL: {image.image.url}") 
    posts = posts.prefetch_related('images')  # 이 줄을 추가
    return render(request, 'home.html', {'posts': posts, 'current_sort': sort})

@require_POST
@login_required
def like_post(request):
    post_id = request.POST.get('post_id')
    post = get_object_or_404(Post, id=post_id)
    like, created = Like.objects.get_or_create(user=request.user, post=post)
    if not created:
        like.delete()
    return JsonResponse({'likes_count': post.like_set.count()})

@require_POST
@login_required
def add_comment(request):
    post_id = request.POST.get('post_id')
    text = request.POST.get('text')
    post = get_object_or_404(Post, id=post_id)
    comment = Comment.objects.create(user=request.user, post=post, text=text)
    return JsonResponse({'comment_id': comment.id, 'text': comment.text, 'user': comment.user.username})

@require_POST
@login_required
def delete_comment(request):
    comment_id = request.POST.get('comment_id')
    comment = get_object_or_404(Comment, id=comment_id, user=request.user)
    comment.delete()
    return JsonResponse({'success': True})

def search_users(request):
    query = request.GET.get('query', '')
    users = User.objects.filter(username__icontains=query)[:5]
    results = [{'id': user.id, 'username': user.username} for user in users]
    return JsonResponse({'results': results})

@csrf_exempt
def add_reply(request):
    if request.method == 'POST':
        comment_id = request.POST.get('comment_id')
        text = request.POST.get('text')
        user = request.user  # 현재 로그인된 사용자

        try:
            comment = Comment.objects.get(id=comment_id)
            reply = Reply.objects.create(comment=comment, text=text, user=user)
            return JsonResponse({'success': True, 'reply_id': reply.id, 'user': user.username, 'text': text})
        except Comment.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Comment not found'})

    return JsonResponse({'success': False, 'error': 'Invalid request method'})

@require_POST
@login_required
def delete_reply(request):
    reply_id = request.POST.get('reply_id')
    reply = get_object_or_404(Reply, id=reply_id, user=request.user)
    reply.delete()
    return JsonResponse({'success': True})