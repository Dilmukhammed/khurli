from django.urls import path
from . import views # Modified to import views directly

urlpatterns = [
    path('<str:module_id>/progress/', views.UserModuleProgressListView.as_view(), name='user_module_progress_list'),
    path('progress/', views.UserModuleProgressCreateView.as_view(), name='user_module_progress_create'),
    path('ai/explain-proverb/', views.GeminiProverbExplanationView.as_view(), name='ai_explain_proverb'),
    path('ai-debate-discussion/', views.GeminiDebateDiscussionView.as_view(), name='ai_debate_discussion'),
    path('ai-fact-opinion/', views.GeminiFactOpinionView.as_view(), name='ai_fact_opinion'),
    path('ai/generic-interaction/', views.GenericAiInteractionView.as_view(), name='ai_generic_interaction'),
]
