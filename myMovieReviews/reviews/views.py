from django.shortcuts import render, get_object_or_404, redirect
from .models import MovieReview
from .forms import MovieReviewForm

def review_list(request):
    reviews = MovieReview.objects.all()
    return render(request, 'reviews/review_list.html', {'reviews': reviews})

def review_detail(request, pk):
    review = get_object_or_404(MovieReview, pk=pk)
    return render(request, 'reviews/review_detail.html', {'review': review})

def review_create(request):
    if request.method == 'POST':
        form = MovieReviewForm(request.POST)
        if form.is_valid():
            review = form.save()
            return redirect('review_list')
    else:
        form = MovieReviewForm()
    return render(request, 'reviews/review_form.html', {'form': form})

def review_update(request, pk):
    review = get_object_or_404(MovieReview, pk=pk)
    if request.method == 'POST':
        form = MovieReviewForm(request.POST, instance=review)
        if form.is_valid():
            review = form.save()
            return redirect('review_detail', pk=review.pk)
    else:
        form = MovieReviewForm(instance=review)
    return render(request, 'reviews/review_form.html', {'form': form})

def review_delete(request, pk):
    review = get_object_or_404(MovieReview, pk=pk)
    if request.method == 'POST':
        review.delete()
        return redirect('review_list')
    return render(request, 'reviews/review_confirm_delete.html', {'review': review})