from django.urls import path
from .views import UserModuleProgressListView, UserModuleProgressCreateView, GeminiProverbExplanationView

urlpatterns = [
    path('<str:module_id>/progress/', UserModuleProgressListView.as_view(), name='user_module_progress_list'),
    path('progress/', UserModuleProgressCreateView.as_view(), name='user_module_progress_create'),
    path('ai/explain-proverb/', GeminiProverbExplanationView.as_view(), name='ai_explain_proverb'), # New path
]
