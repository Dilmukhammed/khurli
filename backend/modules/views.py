from django.conf import settings
from rest_framework import generics, permissions, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserModuleProgress, UserTaskAnswer # Assumes models.py exists
from .serializers import UserModuleProgressSerializer, UserTaskAnswerSerializer, GeminiExplanationRequestSerializer, GeminiExplanationResponseSerializer
import google.generativeai as genai
# from google import genai # Corrected import
from openai import OpenAI
import logging
logger = logging.getLogger(__name__)

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
        chat_history = request.data.get("chat_history", [])


        print("Block", block_context)
        print("User answers",user_answers_list)
        print("correct ", correct_answers_list)

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
            client = OpenAI(
                    api_key=api_key,
                    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
                )
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

            new_core_instruction = "You are an AI assistant. Your role is to provide feedback on the user's work or answer the user's questions. Ensure your tone is always polite, respectful, and encouraging. When you generate your response, speak directly TO the user, addressing them using 'you' and referring to their work as 'your response', 'your answers', or 'your question'. Do NOT speak as if you ARE the user. For example, if the user wrote an essay, your feedback should be like 'Your essay is good because...' AND NOT 'My essay is good because...'."

            if user_query: # Follow-up for mistake explanation
                chat_history.append({"role": "user", "content": user_query})
            # Initial mistake explanation
            prompt_parts = [
                new_core_instruction,
                "The user was presented with the following context/questions related to proverbs:",
                f"Context/Questions: {block_context}",
                f"The user's answers were: {formatted_user_answers}",
                f"The correct answers are: {formatted_correct_answers}",
                topic_relevance_instruction,
                "Now, please analyze the user's answers and explain any mistakes directly to them. For example, start with 'In your answer to question 1, you mentioned X, but the correct approach is Y because...'.",
                "If all answers are correct, acknowledge this by saying something like 'Your answers are all correct!' or 'You've answered everything correctly!'.",
                "After your analysis/acknowledgement, please ask the user if they have any further questions, like 'Do you have any questions about this?'."
            ]
        elif interaction_type == 'discuss_open_ended':
            new_core_instruction = "You are an AI assistant. Your role is to provide feedback on the user's work or answer the user's questions. Ensure your tone is always polite, respectful, and encouraging. When you generate your response, speak directly TO the user, addressing them using 'you' and referring to their work as 'your response', 'your answers', or 'your question'. Do NOT speak as if you ARE the user. For example, if the user wrote an essay, your feedback should be like 'Your essay is good because...' AND NOT 'My essay is good because...'." # Duplicated for safety, though ideally defined once.

            if user_query: # Follow-up within a discussion
                chat_history.append({"role": "user", "content": user_query})
            
            prompt_parts = [
                new_core_instruction,
                f"The discussion prompt/context given to the user was: {block_context}",
                f"The user has provided the following response/input: {user_written_response}",
                topic_relevance_instruction,
                "Please review the user's response. Provide constructive feedback directly TO THE USER on their input (e.g., acknowledge their points by saying 'You made a good point about...' or 'Your analysis of X was insightful because...', suggest areas for deeper thought, or offer different perspectives).",
                "Your feedback should be encouraging and aim to stimulate further thought.",
                "After providing your feedback on their initial response, please invite the user to ask further questions or discuss related ideas, for example: 'What are your further thoughts on this?' or 'Do you have any questions?'."
            ]
        else:
            return Response({"error": "Invalid interaction_type specified."}, status=status.HTTP_400_BAD_REQUEST)

        final_prompt = "\n\n".join(prompt_parts)
        if not user_query:
            chat_history.append({"role": "user", "content": final_prompt})
            print("Line 122 views", chat_history)
        else:
            chat_history = [{"role": "user", "content": final_prompt}] + chat_history
        logger.debug(f"Generic AI Final Prompt:\n{final_prompt}")

        # 4. Initialize the Gemini model and generate content
        try:
            print("Line 129", chat_history)
            response = client.chat.completions.create(
                model="gemini-2.5-flash",
                messages = chat_history
            )
            print("Line 134", response.choices[0].message.content)
            # response_gemini = model.generate_content(final_prompt)
            ai_explanation = response.choices[0].message.content

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

# For AI Recommendations - Simplified module data (ideally from a shared source or DB)
# This is a placeholder. In a real app, this might come from settings or another config.
MODULE_DEFINITIONS_BACKEND = [
    {'id': 'cultural-proverbs', 'name': 'Analyzing Cultural Proverbs', 'totalTasks': 14},
    {'id': 'fact-opinion', 'name': 'Fact vs. Opinion', 'totalTasks': 7},
    {'id': 'debating', 'name': 'Debating Social Issues', 'totalTasks': 7},
    {'id': 'ethical-dilemmas', 'name': 'Ethical Dilemmas & Problem Solving', 'totalTasks': 13},
    {'id': 'fake-news-analysis', 'name': 'Fake News Analysis', 'totalTasks': 3},
]

class PersonalizedRecommendationsAIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        progress_summary_parts = []

        # 1. Fetch progress data
        try:
            all_completed_progress = UserModuleProgress.objects.filter(user=user, status=UserModuleProgress.ProgressStatus.COMPLETED)
            all_task_answers = UserTaskAnswer.objects.filter(user=user)
        except Exception as e:
            logger.error(f"Error fetching user progress/answers for AI recommendations: {str(e)}")
            return Response({"error": "Could not fetch user data for recommendations."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        completed_tasks_by_module = {}
        for progress in all_completed_progress:
            completed_tasks_by_module.setdefault(progress.module_id, set()).add(progress.task_id)

        answered_tasks_by_module = {}
        for answer_record in all_task_answers:
            answered_tasks_by_module.setdefault(answer_record.module_id, set()).add(answer_record.task_id)
            # We could also include answer content here if needed for more detailed AI analysis,
            # but for now, just knowing it was attempted/answered is enough for summary.

        # 2. Summarize progress for each module
        for module_def in MODULE_DEFINITIONS_BACKEND:
            module_id = module_def['id']
            module_name = module_def['name']
            total_tasks = module_def['totalTasks']

            completed_count = len(completed_tasks_by_module.get(module_id, set()))

            # Attempted tasks: include completed ones and those with answers but not explicitly completed
            attempted_task_ids = completed_tasks_by_module.get(module_id, set()).copy()
            attempted_task_ids.update(answered_tasks_by_module.get(module_id, set()))
            attempted_count = len(attempted_task_ids)

            if completed_count == total_tasks:
                progress_summary_parts.append(f"- Module '{module_name}': Fully completed ({completed_count}/{total_tasks} tasks).")
            elif attempted_count > 0:
                progress_summary_parts.append(f"- Module '{module_name}': In progress. Completed {completed_count} tasks, attempted {attempted_count}/{total_tasks} tasks.")
            else:
                progress_summary_parts.append(f"- Module '{module_name}': Not started (0/{total_tasks} tasks).")

        if not progress_summary_parts:
            progress_summary_parts.append("User has not started any modules yet.")

        user_progress_summary_text = "\n".join(progress_summary_parts)

        # 3. Construct AI Prompt
        # More sophisticated prompt engineering can be done here.
        ai_prompt = (
            "You are a helpful and encouraging learning assistant called Logiclingua AI coach. "
            "Based on the following summary of a user's progress across various learning modules, "
            "provide 2-3 short, actionable, and personalized recommendations for what they could focus on next. "
            "Start each recommendation with a relevant emoji. "
            "The recommendations should be distinct and suggest specific modules or types of activities. "
            "If the user has completed many modules, congratulate them and suggest advanced topics or revisiting areas for deeper understanding. "
            "If the user is new, suggest good starting points.\n\n"
            "User's Progress Summary:\n"
            f"{user_progress_summary_text}\n\n"
            "Please provide your recommendations as a list of strings, where each string is one recommendation. For example: ['🚀 Suggestion 1...', '💡 Suggestion 2...']"
            "Ensure the output is only the list of recommendation strings."
        )

        logger.debug(f"AI Recommendation Prompt for user {user.id}:\n{ai_prompt}")

        # 4. Call AI Service
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            logger.error("GEMINI_API_KEY not configured for AI recommendations.")
            return Response({"error": "AI service not configured."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            client = OpenAI(api_key=api_key, base_url="https://generativelanguage.googleapis.com/v1beta/openai/")

            # For Gemini, we typically use a chat-like structure or a direct text prompt.
            # Let's use a direct text prompt for simplicity here, assuming the model can handle it.
            # If using chat completions, structure as messages.
            response = client.completions.create( # Using completions for a direct prompt-response
                model="gemini-1.5-flash-latest", # Or a more suitable text generation model if available
                prompt=ai_prompt,
                max_tokens=200, # Adjust as needed
                temperature=0.7, # Adjust for creativity vs. determinism
            )
            raw_ai_response = response.choices[0].text.strip()
            logger.debug(f"Raw AI Response for recommendations: {raw_ai_response}")

            # Attempt to parse the AI response if it's expected to be a list of strings
            # This is a simple parsing; more robust parsing might be needed if AI format varies.
            recommendations_list = []
            try:
                # A common way AI might format a list of strings in text: "['Rec 1', 'Rec 2']" or one per line.
                if raw_ai_response.startswith("['") and raw_ai_response.endswith("']"):
                    # Attempt to parse as a Python list string representation
                    import ast
                    recommendations_list = ast.literal_eval(raw_ai_response)
                elif raw_ai_response.startswith("- ") or raw_ai_response.startswith("🚀") or raw_ai_response.startswith("💡") or raw_ai_response.startswith("📚"): # Check for markdown list or emoji start
                    recommendations_list = [line.strip() for line in raw_ai_response.splitlines() if line.strip()]
                else: # Fallback if it's just plain text or unexpected format
                    recommendations_list = [rec.strip() for rec in raw_ai_response.split('\n') if rec.strip()]

                if not isinstance(recommendations_list, list) or not all(isinstance(item, str) for item in recommendations_list):
                    logger.warning(f"AI recommendation response was not a list of strings: {raw_ai_response}. Using as single recommendation.")
                    recommendations_list = [raw_ai_response] # Fallback to the whole string as one recommendation

            except Exception as parse_error:
                logger.error(f"Error parsing AI recommendations: {parse_error}. Raw response: {raw_ai_response}")
                recommendations_list = [raw_ai_response] # Fallback to the whole string

        except Exception as e:
            logger.error(f"Error calling AI service for recommendations: {str(e)}")
            return Response({"error": f"Failed to get recommendations from AI: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"recommendations": recommendations_list}, status=status.HTTP_200_OK)


class UserTaskAnswerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to view or edit their task answers.
    """
    serializer_class = UserTaskAnswerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the task answers
        for the currently authenticated user.
        """
        user = self.request.user
        queryset = UserTaskAnswer.objects.filter(user=user)

        # Optional: Allow filtering by module_id and task_id if provided in query params
        module_id = self.request.query_params.get('module_id')
        task_id = self.request.query_params.get('task_id')

        if module_id:
            queryset = queryset.filter(module_id=module_id)
        if task_id:
            queryset = queryset.filter(task_id=task_id)
            # If task_id is provided, we typically expect one result or none.
            # For a GET to /api/answers/?module_id=x&task_id=y, this is fine.
            # If we wanted a detail route like /api/answers/module/task/, we'd set up custom routing.
            # For now, query params on the list view cover the "get specific answer" case.

        return queryset

    def perform_create(self, serializer):
        """
        Associate the answer with the currently authenticated user.
        The serializer's `create` method already handles `update_or_create`
        and uses `self.context['request'].user`.
        This method is called by ModelViewSet during create.
        """
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """
        Ensure the user can only update their own answers.
        The get_object method (called internally by ModelViewSet for detail routes)
        will use get_queryset, which is already filtered by user.
        So, an attempt to update another user's answer would result in a 404.
        """
        serializer.save(user=self.request.user)

    # perform_destroy will also be implicitly permissioned by get_queryset
    # if the frontend needs to delete answers.

    # Note: For retrieving a single, specific UserTaskAnswer by module_id and task_id
    # (e.g., for the `getTaskAnswers` service function), the frontend will make a GET request
    # to the list endpoint with query parameters: `/api/modules/answers/?module_id=<moduleId>&task_id=<taskId>`
    # The `get_queryset` method handles this. If exactly one is found, it will be in the list.
    # If we wanted a URL like `/api/modules/answers/<moduleId>/<taskId>/`,
    # we would need a more complex router setup or a custom detail view.
    # For now, using query params on the list endpoint is simpler.

class GeminiDebateDiscussionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        request_serializer = GeminiExplanationRequestSerializer(data=request.data)
        if not request_serializer.is_valid():
            return Response(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = request_serializer.validated_data
        block_context = validated_data.get('block_context')
        user_answers_list = validated_data.get('user_answers')
        user_query = validated_data.get('user_query')
        chat_history = request.data.get("chat_history")
        # interaction_type = validated_data.get('interaction_type') # Likely always 'discuss_open_ended'

        user_written_response = ""
        if user_answers_list: # For debates, user_answers likely holds the main argument
            user_written_response = "\n".join(user_answers_list)

        api_key = settings.GEMINI_API_KEY
        if not api_key:
            return Response(
                {"error": "GEMINI_API_KEY not configured on the server."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        try:
            client = OpenAI(
                    api_key=api_key,
                    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
                )
        except Exception as e:
            return Response(
                {"error": f"Failed to configure Gemini API: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        topic_relevance_instruction = "IMPORTANT: Confine your entire response to the subject matter of the provided context, user's input, and direct questions about them. Do not provide information or discuss topics outside of this specific context."

        core_debate_instruction = "You are an AI debate coach and discussion facilitator. Your role is to help the user explore various aspects of a social issue or debate topic. Ensure your tone is always polite, respectful, neutral, and encouraging. When you generate your response, speak directly TO the user, addressing them using 'you' and referring to their arguments/input as 'your points', 'your arguments', or 'your perspective'. Do NOT speak as if you ARE the user. Your goal is to stimulate critical thinking and deeper understanding."
        prompt_parts = []

        if user_query: # Follow-up discussion
            chat_history.append({"role": "user", "content": user_query})
        # Initial discussion
        prompt_parts = [
            core_debate_instruction,
            f"The discussion prompt/context given to the user was: {block_context}",
            f"The user has provided the following response/input: {user_written_response}",
            topic_relevance_instruction,
            "Acknowledge the user's main points or arguments (e.g., 'Thanks for sharing your thoughts on X. You've made an interesting point about Y.').",
            "Encourage deeper reflection. You can ask clarifying questions, suggest they consider alternative viewpoints, or gently point out potential assumptions or areas to strengthen their argument (e.g., 'Have you considered how Z might view this?', 'What evidence supports your claim about A?', 'That's a valid perspective. How might someone argue against it?').",
            "Avoid taking a strong stance yourself; act as a neutral facilitator.",
            "Invite the user to continue the discussion (e.g., 'What are your further thoughts on this?', 'Is there anything else you'd like to explore regarding this topic?')."
        ]

        final_prompt = "\n\n".join(prompt_parts)
        if not user_query:
            chat_history.append({"role": "user", "content": final_prompt})
        else:
            chat_history = [{"role": "user", "content": final_prompt}] + chat_history

        try:
            response = client.chat.completions.create(
                model="gemini-2.5-flash",
                messages = chat_history
            )
            print("Line 516", response.choices[0].message.content)
            # response_gemini = model.generate_content(final_prompt)
            ai_explanation = response.choices[0].message.content
        except Exception as e:
            print(f"Gemini API Error (Debate View): {str(e)}")
            error_message = f"Error communicating with AI service: {str(e)}"
            if hasattr(e, 'message') and e.message: error_message = e.message
            elif hasattr(e, 'reason') and e.reason: error_message = e.reason
            return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        response_data = {"explanation": ai_explanation}
        response_serializer = GeminiExplanationResponseSerializer(data=response_data)
        if response_serializer.is_valid():
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        else:
            print(f"Error serializing Gemini response (Debate View): {response_serializer.errors}")
            return Response({"error": "Server error processing AI response."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GeminiFactOpinionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        request_serializer = GeminiExplanationRequestSerializer(data=request.data)
        if not request_serializer.is_valid():
            return Response(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = request_serializer.validated_data
        block_context = validated_data.get('block_context')
        user_answers_list = validated_data.get('user_answers', [])
        correct_answers_list = validated_data.get('correct_answers', [])
        user_query = validated_data.get('user_query')
        interaction_type = validated_data.get('interaction_type')

        api_key = settings.GEMINI_API_KEY
        if not api_key:
            return Response({"error": "GEMINI_API_KEY not configured."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        try:
            genai.configure(api_key=api_key)
        except Exception as e:
            return Response({"error": f"Failed to configure Gemini API: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        core_fact_opinion_instruction = "You are an AI assistant specializing in teaching the difference between facts and opinions, identifying bias, and basic fact-checking. Your role is to help the user understand these concepts. Ensure your tone is always polite, respectful, clear, and encouraging. When you generate your response, speak directly TO the user, addressing them using 'you' and referring to their work as 'your response', 'your answers', or 'your question'. Do NOT speak as if you ARE the user. For example, if the user provides an answer, your feedback should be like 'Your answer is interesting because...' AND NOT 'My answer is interesting because...'."
        topic_relevance_instruction = "IMPORTANT: Confine your entire response to the subject matter of the provided context, user's input, and direct questions about them. Do not provide information or discuss topics outside of this specific context."
        prompt_parts = []

        if user_query: # General query or follow-up
            prompt_parts = [
                core_fact_opinion_instruction,
                topic_relevance_instruction,
                f"The context of the user's learning is: {block_context}",
            ]
            if user_answers_list:
                 prompt_parts.append(f"Previously, the user answered: {'; '.join(user_answers_list)}")
            prompt_parts.extend([
                f"The user now has a specific question: '{user_query}'",
                "Please provide a clear and concise answer to the user's question."
            ])
        elif interaction_type == 'explain_fact_opinion_choice':
            prompt_parts = [
                core_fact_opinion_instruction,
                topic_relevance_instruction,
                f"The user was presented with this statement/question: {block_context}",
                f"The user's answer was: {user_answers_list[0] if user_answers_list else 'Not provided'}",
                f"The correct answer is: {correct_answers_list[0] if correct_answers_list else 'Not specified'}",
                "Please explain why the user's answer is correct or incorrect, focusing on the definitions of fact and opinion or the nature of bias if relevant. If the user provided an explanation (often included in user_answers beyond the first element), comment on that too."
            ]
        elif interaction_type == 'feedback_on_rewrite':
            prompt_parts = [
                core_fact_opinion_instruction,
                topic_relevance_instruction,
                f"The original statement was: {block_context}", # block_context here is the original statement
                f"The user was asked to rewrite it. Their rewritten statement is: {user_answers_list[0] if user_answers_list else 'Not provided'}",
                "Please provide feedback on the user's rewritten statement. Does it successfully transform the original as requested (e.g., fact to opinion, or opinion to fact)? Explain why or why not, and offer suggestions for improvement if needed."
            ]
        elif interaction_type == 'feedback_on_justification':
            # Assuming block_context = statement, user_answers[0] = fact/opinion choice, user_answers[1] = justification
            prompt_parts = [
                core_fact_opinion_instruction,
                topic_relevance_instruction,
                f"The statement presented to the user was: {block_context}",
                f"The user identified it as: {user_answers_list[0] if user_answers_list else 'Not specified'}",
                f"The user's justification was: {user_answers_list[1] if len(user_answers_list) > 1 else 'Not provided'}",
                "Please provide feedback on the user's justification. Is their reasoning sound? Does it correctly apply the definitions of fact or opinion? Offer specific comments and suggestions for improvement."
            ]
        elif interaction_type == 'discuss_statement_nature': # For Intermediate Task 2 (Debate: Fact or Opinion)
            prompt_parts = [
                core_fact_opinion_instruction,
                topic_relevance_instruction,
                f"The user is considering the statement: \"{block_context}\"",
                f"Their thoughts/arguments on whether it's a fact or opinion are: {user_answers_list[0] if user_answers_list else 'No initial thoughts provided'}",
                "Your role is to facilitate a discussion. Acknowledge their points. Encourage deeper reflection by asking clarifying questions, suggesting they consider alternative viewpoints, or gently probing their reasoning. For example: 'That's an interesting perspective. What makes you say it's more of an opinion than a fact?' or 'Can this statement be verified with objective evidence?'. Avoid taking a strong stance yourself; act as a neutral facilitator. Invite them to elaborate or ask further questions."
            ]
        elif interaction_type == 'assist_fact_check':
            prompt_parts = [
                core_fact_opinion_instruction,
                topic_relevance_instruction,
                f"The statement to fact-check is: {block_context}",
                f"The user determined it is: {user_answers_list[0] if user_answers_list else 'Not specified (True/False)'}",
                f"The user's explanation/correction is: {user_answers_list[1] if len(user_answers_list) > 1 else 'Not provided'}",
                f"The actual verification (if known) is: {correct_answers_list[0] if correct_answers_list else 'Not specified'}",
                "If the user's True/False assessment is correct, affirm it and comment on their explanation. If incorrect, gently correct them and explain why. If the actual verification isn't provided to you, help the user think about how they could verify the statement or comment on their provided explanation. Suggest reliable methods or types of sources for fact-checking if appropriate."
            ]
        else: # Default or general_query_fact_opinion if no user_query
             prompt_parts = [
                core_fact_opinion_instruction,
                topic_relevance_instruction,
                f"The user is learning about facts, opinions, and bias. The current context is: {block_context}",
                f"The user's input/response was: {user_answers_list[0] if user_answers_list else 'No specific input provided, or this is a general query.'}",
                "Please provide helpful feedback or answer their general query about this topic. If it's a response, comment on it. If it's a question, answer it. Maintain a polite, encouraging, and neutral tone."
            ]

        final_prompt = "\n\n".join(prompt_parts)
        print(f"Gemini Fact/Opinion Interaction Type: {interaction_type or 'general_query (no user_query)'}")
        print(f"Gemini Fact/Opinion Final Prompt:\n{final_prompt}")

        try:
            model = genai.GenerativeModel('gemini-1.5-flash-latest')
            response_gemini = model.generate_content(final_prompt)
            ai_explanation = response_gemini.text
        except Exception as e:
            print(f"Gemini API Error (FactOpinion View): {str(e)}")
            error_message = f"Error communicating with AI service: {str(e)}"
            if hasattr(e, 'message') and e.message: error_message = e.message
            elif hasattr(e, 'reason') and e.reason: error_message = e.reason
            return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        response_data = {"explanation": ai_explanation}
        response_serializer = GeminiExplanationResponseSerializer(data=response_data)
        if response_serializer.is_valid():
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        else:
            print(f"Error serializing Gemini response (FactOpinion View): {response_serializer.errors}")
            return Response({"error": "Server error processing AI response."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GenericAiInteractionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # 1. Validate request data
        # For now, we'll assume GeminiExplanationRequestSerializer can be adapted
        # by making some fields not strictly required or by how we access them.
        # A more robust approach might be a new serializer, but let's try to adapt first.
        request_serializer = GeminiExplanationRequestSerializer(data=request.data)
        if not request_serializer.is_valid():
            logger.error(f"Generic AI Interaction validation error: {request_serializer.errors}")
            return Response(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = request_serializer.validated_data

        # Extract generic parameters
        module_id = request.data.get('module_id', 'unknown_module') # NEW - must be sent by frontend
        task_id = request.data.get('task_id', 'unknown_task')       # NEW - must be sent by frontend
        interaction_type = validated_data.get('interaction_type', 'general_query') # From serializer, with default
        block_context = validated_data.get('block_context', '')
        user_inputs_list = validated_data.get('user_answers', []) # Renamed from user_answers to reflect it's a list
        correct_answers_data_list = validated_data.get('correct_answers', [])
        user_query = validated_data.get('user_query', '')
        chat_history = request.data.get('chat_history', [])
        print("Line 302", chat_history)

        logger.info(f"Generic AI Interaction called: module='{module_id}', task='{task_id}', interaction='{interaction_type}'")

        # 2. Get Gemini API Key
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            logger.error("GEMINI_API_KEY not configured on the server.")
            return Response(
                {"error": "GEMINI_API_KEY not configured on the server."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        try:
            # genai.configure(api_key=api_key)
            # client = genai.Client(api_key=api_key)
            client = OpenAI(
                    api_key=api_key,
                    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
                )
        except Exception as e:
            logger.error(f"Failed to configure Gemini API: {str(e)}")
            return Response(
                {"error": f"Failed to configure Gemini API: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 3. Dynamic Prompt Engineering
        core_ai_instructions = {
            'base_persona': "You are an AI assistant. Your role is to provide feedback on the user's work or answer the user's questions. Ensure your tone is always polite, respectful, clear, and encouraging. When you generate your response, speak directly TO the user, addressing them using 'you' and referring to their work as 'your response', 'your answers', or 'your question'. Do NOT speak as if you ARE the user. For example, if the user wrote an essay, your feedback should be like 'Your essay is good because...' AND NOT 'My essay is good because...'.",
            'topic_relevance': "IMPORTANT: Confine your entire response to the subject matter of the provided context, user's input, and direct questions about them. Do not provide information or discuss topics outside of this specific context."
        }

        prompt_parts = [core_ai_instructions['base_persona'], core_ai_instructions['topic_relevance']]

        # Consolidate user_inputs_list into a string for easier prompt insertion
        user_inputs_str = "\n".join(user_inputs_list) if user_inputs_list else "No specific input provided by the user for this part."
        # Consolidate correct_answers_data_list
        correct_answers_str = "\n".join(correct_answers_data_list) if correct_answers_data_list else "Not specified."

        if module_id == 'fact-opinion':
            prompt_parts.append("You are currently assisting with the 'Fact or Opinion' module.")
            if user_query: # General query within Fact-Opinion, or a follow-up
                chat_history.append({"role": "user", "content": user_query})
            if interaction_type == 'explain_fact_opinion_choice':
                prompt_parts.extend([
                    f"The user was presented with this statement/question: {block_context}",
                    f"The user's answers were: {user_inputs_list if user_inputs_list else 'Not provided'}", # Assumes user_inputs_list[0] is the choice
                    f"The correct answers are: {correct_answers_data_list if correct_answers_data_list else 'Not specified'}", # Assumes correct_answers_data_list[0]
                    "Please explain why the user's answers are correct or incorrect, focusing on the definitions of fact and opinion or the nature of bias if relevant. If the user provided an explanation as part of their input (e.g. if user_inputs_list has more than one element), comment on that too."
                ])
            elif interaction_type == 'feedback_on_rewrite':
                prompt_parts.extend([
                    f"The original statement/task was: {block_context}",
                    f"The user was asked to rewrite it or provide a specific type of response. Their response is: {user_inputs_str}",
                    "Please provide feedback on the user's response. For example, if they were rewriting a fact as an opinion, does their response qualify as an opinion and is it well-phrased? Explain why or why not, and offer suggestions for improvement if needed."
                ])
            elif interaction_type == 'feedback_on_justification':
                prompt_parts.extend([
                    f"The statement/task was: {block_context}", # This might be the statement itself, or instructions for what to justify
                    f"The user identified something as (e.g. fact/opinion): {user_inputs_list[0] if user_inputs_list else 'Not specified'}", # Optional: if the choice itself is part of the input
                    f"The user provided the following justification/explanation: {user_inputs_list[1] if len(user_inputs_list) > 1 else user_inputs_str}", # Prioritize second element if exists, else full input
                    "Please review the user's justification. Is it logical and well-supported in the context of distinguishing facts from opinions? Provide feedback on its strengths and weaknesses, and suggest improvements if any."
                ])
            elif interaction_type == 'discuss_statement_nature': # e.g., Intermediate Task 2 (Fact or Opinion Debate)
                prompt_parts.extend([
                    f"The statement for discussion is: \"{block_context}\"", # block_context is the statement
                    f"The user's initial arguments or thoughts are: {user_inputs_str}",
                    "Your role is to facilitate a deeper understanding. Acknowledge the user's points. Encourage them to consider different angles, provide evidence, or think about how someone might counter their arguments. Ask guiding questions to help them explore the nuances of whether the statement is a fact, an opinion, or something in between."
                ])
            elif interaction_type == 'assist_fact_check':
                prompt_parts.extend([
                    f"The statement to fact-check is: {block_context}",
                    f"The user's True/False assessment is: {user_inputs_list[0] if user_inputs_list else 'Not specified'}",
                    f"The user's explanation/correction (if any) is: {user_inputs_list[1] if len(user_inputs_list) > 1 else 'Not provided'}",
                    f"The actual verification (if known to you from this prompt) is: {correct_answers_str}", # This would be correct_answers_data_list[0]
                    "If the user's True/False assessment is correct, affirm it and comment on their explanation. If incorrect, gently correct them and explain why. If the actual verification isn't provided to you (i.e., correct_answers_str is 'Not specified'), help the user think about how they could verify the statement or critique their provided explanation for soundness. Suggest reliable methods or types of sources for fact-checking if appropriate."
                ])
            else: # Default for fact-opinion if specific interaction_type isn't matched
                prompt_parts.extend([
                    f"The user is working on a task in the 'Fact or Opinion' module. The task context is: {block_context}",
                    f"User's input related to this task: {user_inputs_str}",
                    "Please provide general assistance, clarification, or feedback related to facts, opinions, or critical thinking for this task."
                ])
        elif module_id.startswith('game-'):
            prompt_parts.append(f"You are assisting with the '{module_id}' game.")
            if user_query:
                # prompt_parts.extend([
                #     "The user has previously played this game and seen a summary of their performance.",
                #     f"For reference, the game's general context/rules were: {block_context}",
                #     f"And a summary of their performance/choices was: {user_inputs_str}",
                #     f"The user now has the following specific question about the game or their performance: '{user_query}'",
                #     "Please directly answer this question. You can refer to the game context or their performance summary if it helps clarify your answer to their specific question, but your primary goal is to address their latest query. Do not re-summarize their overall game performance unless it's directly relevant to answering their question."
                # ])
                chat_history.append({"role": "user", "content": user_query})
                print("Views py 472", chat_history)
             # Initial interaction for the game
            prompt_parts.extend([
                f"The user has just completed a session of this game. The game's general context/rules were: {block_context}",
                f"Here is a summary of their performance/choices: {user_inputs_str}",
                "Please provide a brief, helpful commentary on their performance and the game items. You can highlight areas they did well or areas for improvement. After your commentary, invite them to ask specific questions if they want to understand any part better, discuss particular items, or get more examples."
            ])
        # Placeholder for other module_ids (e.g., 'proverbs', 'debating')
        # elif module_id == 'debating':
        #     prompt_parts.append("You are currently assisting with the 'Debating Social Issues' module.")
        #     # ... (similar interaction_type branching for debating) ...
        else: # Fallback for unknown module_id or if no specific logic is hit
            prompt_parts.extend([
                f"The user is seeking assistance regarding module '{module_id}' and task '{task_id}'.",
                f"Context/Instructions provided: {block_context}",
                f"User's input/response: {user_inputs_str}",
                f"User's specific question (if any): {user_query}",
                "Please provide helpful, general assistance based on the information provided. If the module or task is unclear, you can state that you'll provide the best general guidance possible."
            ])
        print("line 500")
        final_prompt = "\n\n".join(prompt_parts)
        if not user_query:
            chat_history.append({"role": "user", "content": final_prompt})
            print("Line 504 views", chat_history)
        else:
            chat_history = [{"role": "user", "content": final_prompt}] + chat_history
        logger.debug(f"Generic AI Final Prompt:\n{final_prompt}")

        # 4. Initialize the Gemini model and generate content
        try:
            # model = genai.GenerativeModel('gemini-2.5-flash') # Or your preferred model
            # chat = client.chats.create(model="gemini-2.5-flash")
            print("Line 510", chat_history)
            response = client.chat.completions.create(
                model="gemini-2.5-flash",
                messages = chat_history
            )
            print("Line 516", response.choices[0].message.content)
            # response_gemini = model.generate_content(final_prompt)
            ai_explanation = response.choices[0].message.content
        except Exception as e:
            logger.error(f"Generic AI Gemini API Error: {str(e)}")
            # Extract more specific error details if possible (similar to other views)
            error_message = f"Error communicating with AI service: {str(e)}"
            # TODO: Add more detailed error extraction if needed, similar to other views
            # if hasattr(e, 'message') and e.message: error_message = e.message
            # elif hasattr(e, 'reason') and e.reason: error_message = e.reason
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
            logger.error(f"Error serializing Generic AI response: {response_serializer.errors}")
            return Response(
                {"error": "Server error processing AI response."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
