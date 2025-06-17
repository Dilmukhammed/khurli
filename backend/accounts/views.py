from django.contrib.auth.models import User
from .serializers import UserRegistrationSerializer
from rest_framework import generics, permissions

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegistrationSerializer
