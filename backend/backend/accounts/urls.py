from django.urls import path
from . import views

urlpatterns = [
    # Example: path('register/', views.SomeRegistrationView.as_view(), name='account_register'),
    # Example: path('login/', views.SomeLoginView.as_view(), name='account_login'),
    path('profile/update/', views.UpdateUserDetailsView.as_view(), name='update_user_profile'),
]

# Note: If you are using dj_rest_auth or django-allauth, they provide their own
# set of URLs for registration, login, password reset, etc.
# You would typically include them in your main project urls.py like:
# path('api/auth/', include('dj_rest_auth.urls')),
# path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
# This new 'profile/update/' endpoint is a custom one for our specific needs.
