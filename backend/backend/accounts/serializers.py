from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserProfile

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['age']

class UpdateUserDetailsSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    age = serializers.IntegerField(required=False, allow_null=True, min_value=0, max_value=150) # Assuming age is optional

    def update(self, instance, validated_data):
        # instance here is the User model instance
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()

        # Update or create UserProfile
        # The signal should have created this, but get_or_create is safer.
        profile, created = UserProfile.objects.get_or_create(user=instance)
        if 'age' in validated_data: # Check if age was provided in the request
            profile.age = validated_data.get('age', profile.age) # Use validated_data.get('age') to handle if age is not in payload
            profile.save()

        return instance # Return the user instance

# Serializer for reading User details, including profile information
# This could be used by an endpoint like dj_rest_auth's /auth/user/ if configured,
# or a custom view that returns current user details.
class UserDetailsWithProfileSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    # If User model has email, first_name, last_name directly, they can be included.
    # Django's default User has first_name, last_name, email.

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile')
        read_only_fields = ('username', 'email', 'id', 'profile') # Typically username/email are not changed here

# To integrate with dj_rest_auth, you might set this in settings.py:
# REST_AUTH = {
#     'USER_DETAILS_SERIALIZER': 'accounts.serializers.UserDetailsWithProfileSerializer',
# }
# Make sure 'accounts' is the correct path to this app as seen by Django.
# Given our app is at backend/backend/accounts, if your project root is backend/backend,
# then it might be 'accounts.serializers.UserDetailsWithProfileSerializer'.
# If project root is backend/, then it might be 'backend.accounts.serializers.UserDetailsWithProfileSerializer'.
# This needs to match how your app is named in INSTALLED_APPS and how Django resolves it.
# Assuming 'accounts' is how it's known from project root:
# 'USER_DETAILS_SERIALIZER': 'accounts.serializers.UserDetailsWithProfileSerializer'
