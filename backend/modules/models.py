from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

class UserModuleProgress(models.Model):
    class ProgressStatus(models.TextChoices):
        COMPLETED = 'completed', _('Completed')
        # IN_PROGRESS = 'in_progress', _('In Progress') # Future possibility

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='module_progress')
    module_id = models.CharField(max_length=100, help_text="Identifier for the module, e.g., 'cultural-proverbs'")
    task_id = models.CharField(max_length=100, help_text="Identifier for the specific task or exercise within the module")
    status = models.CharField(
        max_length=20,
        choices=ProgressStatus.choices,
        default=ProgressStatus.COMPLETED
    )
    completed_at = models.DateTimeField(auto_now_add=True)
    last_updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('User Module Progress')
        verbose_name_plural = _('User Module Progresses')
        # Ensures a user can only have one status record per task within a module
        unique_together = ('user', 'module_id', 'task_id')
        ordering = ['-last_updated_at']

    def __str__(self):
        return f"{self.user.username} - {self.module_id} - {self.task_id}: {self.get_status_display()}"
