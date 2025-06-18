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
        topic_relevance_instruction = "IMPORTANT: Confine your entire response to the subject matter of the provided proverbs, user's answers, and direct questions about them. Do not provide information or discuss topics outside of this specific context."

        if user_query:
            # Prompt for a follow-up question
            prompt_parts = [
                "You are an AI assistant who previously provided an explanation about cultural proverbs based on the following context:",
                f"Original Context/Questions: {block_context}",
                f"User's Answers to that context: {'; '.join(user_answers)}",
                f"Correct Answers for that context: {'; '.join(correct_answers)}",
                topic_relevance_instruction, # Added instruction
                "The user now has a specific follow-up question regarding this context or your previous explanation.",
                f"User's follow-up question: '{user_query}'",
                "Please provide a concise answer ONLY to this follow-up question. Do not repeat the full initial explanation unless a small part of it is absolutely necessary to answer the current question. Focus on the new question."
            ]
        else:
            # Prompt for an initial explanation
            prompt_parts = [
                "You are an AI assistant helping a user learn about cultural proverbs.",
                "The user was presented with the following context/questions related to proverbs:",
                f"Context/Questions: {block_context}",
                f"The user's answers were: {'; '.join(user_answers)}", # Join list for readability in prompt
                f"The correct answers are: {'; '.join(correct_answers)}", # Join list
                topic_relevance_instruction, # Added instruction
                "Please analyze the user's answers based on the correct answers.",
                "Provide brief, clear explanations for any mistakes the user made. If there are no mistakes, acknowledge that.",
                "After your explanation, please offer to answer any further questions the user might have about these proverbs or their explanations."
            ]

        final_prompt = "\n\n".join(prompt_parts)
        # Add a log to see the final prompt being sent to Gemini (optional, but good for debugging this step)
        print(f"Gemini Final Prompt:\n{final_prompt}")

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
