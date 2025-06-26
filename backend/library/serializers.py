from rest_framework import serializers
from .models import Book, Article

class BookSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'item_type',
            'file', 'file_url',
            'cover_image', 'cover_image_url',
            'upload_date', 'updated_date'
        ]
        read_only_fields = ['item_type', 'upload_date', 'updated_date', 'file_url', 'cover_image_url']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return None

class ArticleSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'item_type',
            'file', 'file_url',
            'cover_image', 'cover_image_url',
            'upload_date', 'updated_date'
        ]
        read_only_fields = ['item_type', 'upload_date', 'updated_date', 'file_url', 'cover_image_url']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return None
