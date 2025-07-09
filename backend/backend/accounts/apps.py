from django.apps import AppConfig


class UserProfileDataConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user_profile_data' # Unique name for this app

    def ready(self):
        # The @receiver decorator in models.py is usually sufficient for Django to discover signals
        # once the app is loaded. Explicitly importing models here ensures the module is loaded.
        from . import models # Ensures models.py (and thus signals within it) is loaded
