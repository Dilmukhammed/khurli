from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserModuleProgress # Assumes models.py exists
from .serializers import UserModuleProgressSerializer, GeminiExplanationRequestSerializer, GeminiExplanationResponseSerializer
import google.generativeai as genai

class UserModuleProgressListView(generics.ListAPIView):
    serializer_class = UserModuleProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        module_id = self.kwargs.get('module_id')
        if module_id:
            return UserModuleProgress.objects.filter(user=user, module_id=module_id)
        return UserModuleProgress.objects.none()

class UserModuleProgressCreateView(generics.CreateAPIView):
    serializer_class = UserModuleProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

class GeminiProverbExplanationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # 1. Validate request data
        request_serializer = GeminiExplanationRequestSerializer(data=request.data)
        if not request_serializer.is_valid():
            return Response(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = request_serializer.validated_data
        block_context = validated_data.get('block_context')
        user_answers = validated_data.get('user_answers')
        correct_answers = validated_data.get('correct_answers')
        user_query = validated_data.get('user_query')

        # 2. Get Gemini API Key
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            return Response(
                {"error": "GEMINI_API_KEY not configured on the server."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            genai.configure(api_key=api_key)
        except Exception as e:
            return Response(
                {"error": f"Failed to configure Gemini API: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 3. Construct the prompt
        prompt_parts = [
            "You are an AI assistant helping a user learn about cultural proverbs.",
            "The user was presented with the following context/questions related to proverbs:",
            f"Context/Questions: {block_context}",
            f"The user's answers were: {user_answers}",
            f"The correct answers are: {correct_answers}",
            "Please analyze the user's answers based on the correct answers.",
            "Provide brief, clear explanations for any mistakes the user made.",
            "If there are no mistakes, acknowledge that."
        ]

        if user_query:
            prompt_parts.append(f"The user also has a specific follow-up question: '{user_query}'. Please answer this question in context.")
        else:
            prompt_parts.append("After your explanation of any mistakes (or if there were no mistakes), please offer to answer any further questions the user might have about these proverbs or their explanations.")

        final_prompt = "\n\n".join(prompt_parts)

        # 4. Initialize the Gemini model and generate content
        try:
            model = genai.GenerativeModel('gemini-1.5-flash-latest')
            response_gemini = model.generate_content(final_prompt)
            ai_explanation = response_gemini.text

        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            error_message = f"Error communicating with AI service: {str(e)}"
            if hasattr(e, 'message') and e.message:
                error_message = e.message
            elif hasattr(e, 'reason') and e.reason:
                error_message = e.reason

            return Response(
                {"error": error_message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 5. Return Gemini's response
        response_data = {"explanation": ai_explanation}
        response_serializer = GeminiExplanationResponseSerializer(data=response_data)
        if response_serializer.is_valid():
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        else:
            print(f"Error serializing Gemini response: {response_serializer.errors}")
            return Response(
                {"error": "Server error processing AI response."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
