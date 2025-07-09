from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm password")
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        # We don't need to store password2
        # user.set_password(validated_data['password']) # create_user already handles password hashing
        # user.save() # create_user already saves the user
        return user

from user_profile_data.models import UserProfile # Import UserProfile from its app

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('age',)

class UserDetailsSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True, allow_null=True) # Allow profile to be null if not found, though signal should create it.
    # 'first_name' is a standard field on Django's User model.
    # It will be included if listed in 'fields' and User is the model.

    class Meta:
        model = User # Serializing the User model
        fields = ('id', 'username', 'email', 'first_name', 'profile')
        # read_only_fields are implicitly handled for ModelSerializer fields not otherwise specified.
        # Explicitly listing them is fine for clarity or if some were writable.
        # Since all are read-only from the perspective of this GET endpoint, this is okay.
