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
        user_answers_list = validated_data.get('user_answers') # This is a list of strings
        correct_answers_list = validated_data.get('correct_answers', []) # Default to empty list if not provided
        user_query = validated_data.get('user_query')
        interaction_type = validated_data.get('interaction_type')

        # Consolidate user's written response for discussion into a single string if it's from user_answers_list
        user_written_response = ""
        if interaction_type == 'discuss_open_ended' and user_answers_list:
            user_written_response = "\n".join(user_answers_list) # Join if multiple lines/inputs were captured in the list

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
        topic_relevance_instruction = "IMPORTANT: Confine your entire response to the subject matter of the provided context, user's input, and direct questions about them. Do not provide information or discuss topics outside of this specific context."
        prompt_parts = []

        if interaction_type == 'explain_mistakes':
            formatted_user_answers = '; '.join(user_answers_list)
            formatted_correct_answers = '; '.join(correct_answers_list) if correct_answers_list else "Not applicable for this query."

            if user_query: # Follow-up for mistake explanation
                prompt_parts = [
                    "You are an AI assistant who previously provided an explanation to the user about cultural proverbs.",
                    "IMPORTANT: You are speaking directly to the user. Address them using 'you' and 'your'. Refer to their inputs as 'your answers' or 'your response'.",
                    f"Original Context/Questions: {block_context}",
                    f"Your original answers to that context were: {formatted_user_answers}",
                    f"Correct Answers for that context: {formatted_correct_answers}",
                    topic_relevance_instruction,
                    f"The user (you) now has a follow-up question: '{user_query}'. Please answer this question directly.",
                    "Please provide a concise answer ONLY to this follow-up question. Do not repeat the full initial explanation unless a small part of it is absolutely necessary. Focus on the new question."
                ]
            else: # Initial mistake explanation
                prompt_parts = [
                    "You are an AI assistant helping a user learn about cultural proverbs.",
                    "IMPORTANT: You are speaking directly to the user. Address them using 'you' and 'your'. Refer to their inputs as 'your answers' or 'your response'.",
                    "The user was presented with the following context/questions related to proverbs:",
                    f"Context/Questions: {block_context}",
                    f"Your answers were: {formatted_user_answers}",
                    f"The correct answers are: {formatted_correct_answers}",
                    topic_relevance_instruction,
                    "Please analyze your answers based on the correct answers.",
                    "Provide brief, clear explanations for any mistakes you made. If there are no mistakes in your answers, please acknowledge that.",
                    "After your explanation, please ask if you have any further questions."
                ]
        elif interaction_type == 'discuss_open_ended':
            if user_query: # Follow-up within a discussion
                prompt_parts = [
                    "You are an AI assistant facilitating a discussion with the user on a cultural proverb or topic.",
                    "IMPORTANT: You are speaking directly to the user. Address them using 'you' and 'your'. Refer to their inputs as 'your answers' or 'your response'.",
                    f"The main discussion prompt/context was: {block_context}",
                    f"Your initial response was: {user_written_response}", # This is the user's main essay/answer
                    topic_relevance_instruction,
                    f"The user (you) now has a follow-up question or comment: '{user_query}'. Please respond to this follow-up directly.",
                    "Please provide a thoughtful and concise response to this follow-up, keeping the discussion going. Encourage deeper reflection or offer related insights if appropriate. Do not repeat your entire previous feedback unless a small part is essential for context."
                ]
            else: # Initial feedback on a discussion response
                prompt_parts = [
                    "You are an AI assistant designed to provide feedback and facilitate discussion on the user's response to open-ended questions about cultural topics/proverbs.",
                    "IMPORTANT: You are speaking directly to the user. Address them using 'you' and 'your'. Refer to their inputs as 'your answers' or 'your response'.",
                    f"The discussion prompt/context given to the user was: {block_context}",
                    f"Your response was: {user_written_response}",
                    topic_relevance_instruction,
                    "Please review your response. Provide constructive feedback on your input (e.g., acknowledge your points, suggest areas for deeper thought, offer different perspectives, or check for understanding if applicable).",
                    "Your feedback should be encouraging and aim to stimulate further thought.",
                    "After providing your feedback on your initial response, please invite you to ask further questions or discuss related ideas."
                ]
        else:
            return Response({"error": "Invalid interaction_type specified."}, status=status.HTTP_400_BAD_REQUEST)

        final_prompt = "\n\n".join(prompt_parts)
        print(f"Gemini Interaction Type: {interaction_type}") # Log interaction type
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
