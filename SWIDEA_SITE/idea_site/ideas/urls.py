from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.IdeaListView.as_view(), name='idea_list'),
    path('create/', views.IdeaCreateView.as_view(), name='idea_create'),
    path('<int:pk>/', views.IdeaDetailView.as_view(), name='idea_detail'),
    path('<int:pk>/update/', views.IdeaUpdateView.as_view(), name='idea_update'),
    path('<int:pk>/delete/', views.IdeaDeleteView.as_view(), name='idea_delete'),
    path('api/ideas/<int:pk>/star/', views.idea_star, name='idea_star'),
    path('api/ideas/<int:pk>/interest/<str:action>/', views.idea_interest, name='idea_interest'),
]