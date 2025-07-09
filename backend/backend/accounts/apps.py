from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts' # This should match the actual app directory name if it's 'backend.accounts' or just 'accounts' based on INSTALLED_APPS

    def ready(self):
        import backend.accounts.signals # Or just .signals if signals.py is in the same app
        # If signals are in models.py, you might do:
        # from . import models
        # This line above isn't strictly necessary if the @receiver decorator in models.py is enough
        # for Django to discover it, but explicitly importing the module where signals are defined
        # within ready() is a robust way to ensure they are connected.
        # Given our signal is in models.py, let's ensure models.py is imported.
        from . import models # Ensures models.py (and thus signals within it) is loaded
