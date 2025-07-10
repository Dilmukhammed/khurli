from django.apps import AppConfig

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts' # This should match the actual app directory name if it's 'backend.accounts' or just 'accounts' based on INSTALLED_APPS
