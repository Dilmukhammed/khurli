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


from django.conf import settings # To import the User model more robustly

class UserTaskAnswer(models.Model):
    """
    Stores a user's answers for a specific task within a module.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, # Standard way to refer to the User model
        on_delete=models.CASCADE,
        related_name='task_answers'
    )
    module_id = models.CharField(
        max_length=100,
        db_index=True, # Index for faster lookups by module_id
        help_text="Identifier for the module (e.g., 'cultural-proverbs')."
    )
    task_id = models.CharField(
        max_length=100,
        db_index=True, # Index for faster lookups by task_id
        help_text="Identifier for the specific task within the module (e.g., 'beginnerTask4')."
    )
    answers = models.JSONField(
        default=dict, # Default to an empty dictionary
        blank=True,   # Allows storing empty answers if needed, or if a task is just 'visited'
        help_text="User's answers for the task, stored as a JSON object."
    )
    last_updated = models.DateTimeField(
        auto_now=True, # Automatically set to now when the object is saved
        help_text="Timestamp of the last update to these answers."
    )

    class Meta:
        # Ensures that a user can only have one set of answers for a specific task in a module
        unique_together = ('user', 'module_id', 'task_id')
        ordering = ['-last_updated'] # Default ordering
        verbose_name = _('User Task Answer')
        verbose_name_plural = _('User Task Answers')


    def __str__(self):
        return f"{self.user.username} - {self.module_id} - {self.task_id} (Answers)"
