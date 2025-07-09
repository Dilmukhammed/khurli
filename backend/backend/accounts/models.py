from django.db import models
from django.conf import settings # To import the User model robustly

class UserProfile(models.Model):
    """
    Stores additional user profile information, like age.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile', # Allows accessing profile via user.profile
        primary_key=True, # Makes the user field the primary key for this table
    )
    age = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="User's age in years."
    )
    # You can add other fields here in the future, e.g.:
    # date_of_birth = models.DateField(null=True, blank=True)
    # bio = models.TextField(blank=True)
    # avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

    # Note: First name and last name are already part of Django's built-in User model.
    # We will update them directly on the User model instance.
    # This UserProfile model is primarily for fields not present on the built-in User model, like 'age'.
    # If you had a fully custom User model (e.g., inheriting from AbstractUser),
    # you might add 'age' directly to that model instead of creating a separate UserProfile.
    # Since we seem to be using the default User model, a OneToOne UserProfile is a clean approach.

# Signal to create or update UserProfile whenever a User instance is saved.
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    """
    Signal handler to create or update the user profile.
    Creates a UserProfile if a new User is created.
    """
    if created:
        UserProfile.objects.create(user=instance)
    # If you want to ensure profile exists even for existing users (e.g., if they were created before this signal)
    # you could add an else block with UserProfile.objects.get_or_create(user=instance)
    # However, for new registrations, created=True is sufficient.
    # instance.profile.save() # Not strictly needed if only creating, but good if you might add logic to update profile on user save later
