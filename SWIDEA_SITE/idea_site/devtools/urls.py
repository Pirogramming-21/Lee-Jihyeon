from django.urls import path
from . import views

urlpatterns = [
    path('', views.DevToolListView.as_view(), name='devtool_list'),
    path('create/', views.DevToolCreateView.as_view(), name='devtool_create'),
    path('<int:pk>/', views.DevToolDetailView.as_view(), name='devtool_detail'),
    path('<int:pk>/update/', views.DevToolUpdateView.as_view(), name='devtool_update'),
    path('<int:pk>/delete/', views.DevToolDeleteView.as_view(), name='devtool_delete'),
]