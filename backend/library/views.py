from rest_framework import viewsets, permissions
from .models import Book, Article
from .serializers import BookSerializer, ArticleSerializer

class BookViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows books to be viewed.
    """
    queryset = Book.objects.all().order_by('-upload_date')
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # Or just IsAuthenticated if only logged-in users can see

    def get_serializer_context(self):
        """
        Extra context provided to the serializer class.
        """
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows articles to be viewed.
    """
    queryset = Article.objects.all().order_by('-upload_date')
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # Or just IsAuthenticated

    def get_serializer_context(self):
        """
        Extra context provided to the serializer class.
        """
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context
