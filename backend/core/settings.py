import os
from pathlib import Path
from datetime import timedelta
BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'final_migrations_secret_key_v7'
DEBUG = True

# Gemini API Key
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

if not GEMINI_API_KEY and DEBUG:
    # Optionally, print a warning during development if the key is missing
    print("WARNING: GEMINI_API_KEY environment variable is not set. AI features may not work.")
elif not GEMINI_API_KEY and not DEBUG:
    # In production, you might want to raise an error or handle it more strictly
    # For now, just ensuring it's loaded. Proper error handling if key is vital
    # for production would be in the service using it.
    pass

ALLOWED_HOSTS = ['*']
INSTALLED_APPS = [
    'django.contrib.admin', 'django.contrib.auth', 'django.contrib.contenttypes',
    'django.contrib.sessions', 'django.contrib.messages', 'django.contrib.staticfiles',
    'rest_framework', 'rest_framework_simplejwt', 'corsheaders',
    'accounts', # Accounts app (handles main auth views/urls at backend/accounts/)
    'modules',  # Modules app
    'library',  # New library app
]
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
ROOT_URLCONF = 'core.urls'
TEMPLATES = [{'BACKEND': 'django.template.backends.django.DjangoTemplates', 'DIRS': [], 'APP_DIRS': True,
              'OPTIONS': {'context_processors': ['django.template.context_processors.debug',
                                                  'django.template.context_processors.request',
                                                  'django.contrib.auth.context_processors.auth',
                                                  'django.contrib.messages.context_processors.messages']}}]
WSGI_APPLICATION = 'core.wsgi.application'
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'auth',       # Имя вашей БД
        'USER': 'postgres',     # Ваш пользователь БД
        'PASSWORD': 'dima5577', # Ваш пароль
        'HOST': 'localhost',           # Или адрес вашего сервера БД (e.g., an AWS RDS endpoint)
        'PORT': '5432',              # Порт по умолчанию для PostgreSQL
    }
}
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
CORS_ALLOWED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"]
STATIC_URL = 'static/'

# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'


REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'core.exceptions.custom_exception_handler',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30), # Increased for easier debugging
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False, # Default is False
    'BLACKLIST_AFTER_ROTATION': False, # Default is False (True if using blacklist app)
    'UPDATE_LAST_LOGIN': False, # Default is False

    'ALGORITHM': 'HS256', # Default
    'SIGNING_KEY': SECRET_KEY, # Explicitly use the SECRET_KEY defined in this file
    'VERIFYING_KEY': None, # Default
    'AUDIENCE': None, # Default
    'ISSUER': None, # Default
    'JWK_URL': None, # Default
    'LEEWAY': timedelta(seconds=0), # Default

    'AUTH_HEADER_TYPES': ('Bearer',), # Default
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION', # Default
    'USER_ID_FIELD': 'id', # Default
    'USER_ID_CLAIM': 'id', # Default
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule', # Default

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',), # Default
    'TOKEN_TYPE_CLAIM': 'token_type', # Default
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser', # Default

    'JTI_CLAIM': 'jti', # Default

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp', # Default
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5), # Default (not used if not using sliding tokens)
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1), # Default (not used if not using sliding tokens)
}
