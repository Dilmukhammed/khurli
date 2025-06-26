from django.contrib import admin
from .models import Book, Article

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'upload_date', 'updated_date')
    list_filter = ('upload_date', 'updated_date')
    search_fields = ('title',)
    readonly_fields = ('item_type', 'upload_date', 'updated_date')

    fieldsets = (
        (None, {
            'fields': ('title', 'file')
        }),
        ('Metadata', {
            'fields': ('item_type', 'upload_date', 'updated_date'),
            'classes': ('collapse',),
        }),
    )

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'upload_date', 'updated_date')
    list_filter = ('upload_date', 'updated_date')
    search_fields = ('title',)
    readonly_fields = ('item_type', 'upload_date', 'updated_date')

    fieldsets = (
        (None, {
            'fields': ('title', 'file')
        }),
        ('Metadata', {
            'fields': ('item_type', 'upload_date', 'updated_date'),
            'classes': ('collapse',),
        }),
    )
