from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from .serializers import UpdateUserDetailsSerializer, UserDetailsWithProfileSerializer # Assuming UserDetailsWithProfileSerializer is for retrieving updated user details.

User = get_user_model()

class UpdateUserDetailsView(generics.UpdateAPIView):
    """
    Allows authenticated users to update their first_name, last_name, and age.
    Uses PATCH for partial updates by default, or PUT for full updates.
    """
    serializer_class = UpdateUserDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]
    # queryset = User.objects.all() # Not strictly needed if get_object is overridden

    def get_object(self):
        """
        Returns the user instance for the currently authenticated user.
        This ensures users can only update their own profile.
        """
        return self.request.user

    def get_serializer_context(self):
        """
        Pass request to the serializer context.
        Needed by UpdateUserDetailsSerializer if it were a ModelSerializer and needed to access request.user directly
        for creating/updating related objects, but our custom Serializer.update handles it.
        Still good practice.
        """
        return {'request': self.request}

    # Optional: If you want to return the full user details (including profile) after update
    # you might override the update method or use a different serializer for the response.
    # By default, UpdateAPIView will use the same serializer_class for response which might be fine.
    # If UpdateUserDetailsSerializer only returns a success message or limited fields,
    # and you want to return the full updated user object (e.g. as defined by UserDetailsWithProfileSerializer),
    # you might customize the perform_update or update method.

    # For example, to return more detailed user info after update:
    # from rest_framework.response import Response
    # def update(self, request, *args, **kwargs):
    #     partial = kwargs.pop('partial', False)
    #     instance = self.get_object()
    #     serializer = self.get_serializer(instance, data=request.data, partial=partial)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_update(serializer)

    #     if getattr(instance, '_prefetched_objects_cache', None):
    #         # If 'prefetch_related' has been applied to a queryset, we need to
    #         # forcibly invalidate the prefetch cache on the instance.
    #         instance._prefetched_objects_cache = {}

    #     # Serialize with the UserDetailsWithProfileSerializer for the response
    #     response_serializer = UserDetailsWithProfileSerializer(instance, context=self.get_serializer_context())
    #     return Response(response_serializer.data)

# Note: If you also need an endpoint to *retrieve* the user details (including profile),
# you would typically use dj_rest_auth's /auth/user/ endpoint and configure it
# with REST_AUTH['USER_DETAILS_SERIALIZER'] = 'accounts.serializers.UserDetailsWithProfileSerializer'
# in your settings.py, as commented in the serializers.py file.
# Or create a separate generics.RetrieveAPIView here if not using dj_rest_auth.
# For now, this UpdateUserDetailsView is focused solely on updating.
