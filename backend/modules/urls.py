from django.urls import path
from .views import UserModuleProgressListView, UserModuleProgressCreateView

urlpatterns = [
    path('<str:module_id>/progress/', UserModuleProgressListView.as_view(), name='user_module_progress_list'),
    path('progress/', UserModuleProgressCreateView.as_view(), name='user_module_progress_create'),
]
