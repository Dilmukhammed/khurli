from django.contrib.auth.models import User
from .serializers import UserRegistrationSerializer
from rest_framework import generics, permissions

from .serializers import UserRegistrationSerializer, UserDetailsSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegistrationSerializer

class UserDetailsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = UserDetailsSerializer(request.user)
        return Response(serializer.data)
