from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, ArticleViewSet

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'articles', ArticleViewSet, basename='article')

urlpatterns = [
    path('', include(router.urls)),
]
