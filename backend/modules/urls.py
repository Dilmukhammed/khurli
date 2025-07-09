from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views # Modified to import views directly

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'answers', views.UserTaskAnswerViewSet, basename='usertaskanswer')

# The API URLs are now determined automatically by the router.
# urlpatterns = router.urls # This would replace the existing urlpatterns if we only had viewsets.

# Since we have other non-viewset paths, we'll append router.urls
urlpatterns = [
    path('<str:module_id>/progress/', views.UserModuleProgressListView.as_view(), name='user_module_progress_list'),
    path('progress/', views.UserModuleProgressCreateView.as_view(), name='user_module_progress_create'),

    # URLs for UserTaskAnswer (handling GET for list/retrieve with query params, and POST for create/update)
    # The ViewSet handles GET (list/retrieve with query params) and POST (create/update via serializer) on the base path.
    # And specific GET/PUT/PATCH/DELETE on /<pk>/ path.
    path('', include(router.urls)), # This will add paths like 'answers/' and 'answers/<pk>/'

    # AI related paths
    path('ai/explain-proverb/', views.GeminiProverbExplanationView.as_view(), name='ai_explain_proverb'),
    path('ai-debate-discussion/', views.GeminiDebateDiscussionView.as_view(), name='ai_debate_discussion'),
    path('ai-fact-opinion/', views.GeminiFactOpinionView.as_view(), name='ai_fact_opinion'),
    path('ai/generic-interaction/', views.GenericAiInteractionView.as_view(), name='ai_generic_interaction'),
]
