from django.db import models
from django.utils.translation import gettext_lazy as _

class ContentTypeChoices(models.TextChoices):
    BOOK = 'BOOK', _('Book')
    ARTICLE = 'ARTICLE', _('Article')
    # Add VIDEO later if we want to manage video metadata via Django too

class LibraryItem(models.Model):
    title = models.CharField(max_length=255, verbose_name=_('Title'))
    item_type = models.CharField(
        max_length=10,
        choices=ContentTypeChoices.choices,
        verbose_name=_('Item Type')
    )
    upload_date = models.DateTimeField(auto_now_add=True, verbose_name=_('Upload Date'))
    updated_date = models.DateTimeField(auto_now=True, verbose_name=_('Updated Date'))

    class Meta:
        abstract = True
        ordering = ['-updated_date']

    def __str__(self):
        return self.title

def book_upload_path(instance, filename):
    print(f'library/books/{filename}')
    # file will be uploaded to MEDIA_ROOT/library/books/<filename>
    return f'library/books/{filename}'

class Book(LibraryItem):
    file = models.FileField(upload_to=book_upload_path, verbose_name=_('File'))
    cover_image = models.ImageField(
        upload_to='library/book_covers/',
        blank=True,
        null=True,
        verbose_name=_('Book Cover Image')
    )
    # Future fields:
    # author = models.CharField(max_length=255, blank=True, null=True, verbose_name=_('Author'))
    # isbn = models.CharField(max_length=20, blank=True, null=True, verbose_name=_('ISBN'))

    def save(self, *args, **kwargs):
        self.item_type = ContentTypeChoices.BOOK
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _('Book')
        verbose_name_plural = _('Books')

def article_upload_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/library/articles/<filename>
    return f'library/articles/{filename}'

class Article(LibraryItem):
    file = models.FileField(upload_to=article_upload_path, verbose_name=_('File'))
    cover_image = models.ImageField(
        upload_to='library/article_covers/',
        blank=True,
        null=True,
        verbose_name=_('Article Cover Image')
    )
    # Future fields:
    # source_url = models.URLField(blank=True, null=True, verbose_name=_('Source URL'))
    # publication_date = models.DateField(blank=True, null=True, verbose_name=_('Publication Date'))

    def save(self, *args, **kwargs):
        self.item_type = ContentTypeChoices.ARTICLE
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _('Article')
        verbose_name_plural = _('Articles')
