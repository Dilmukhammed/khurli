from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserModuleProgress # Assumes models.py exists
from .serializers import UserModuleProgressSerializer, GeminiExplanationRequestSerializer, GeminiExplanationResponseSerializer
import google.generativeai as genai
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

            new_core_instruction = "You are an AI assistant. Your role is to provide feedback on the user's work or answer the user's questions. Ensure your tone is always polite, respectful, and encouraging. When you generate your response, speak directly TO the user, addressing them using 'you' and referring to their work as 'your response', 'your answers', or 'your question'. Do NOT speak as if you ARE the user. For example, if the user wrote an essay, your feedback should be like 'Your essay is good because...' AND NOT 'My essay is good because...'."

            if user_query: # Follow-up for mistake explanation
                prompt_parts = [
                    new_core_instruction,
                    "You previously provided an explanation to the user regarding the following context:",
                    f"Original Context/Questions: {block_context}",
                    f"The user's original answers were: {formatted_user_answers}",
                    f"Correct Answers for that context: {formatted_correct_answers}",
                    topic_relevance_instruction,
                    f"The user now has a specific follow-up question: '{user_query}'",
                    "Please provide a concise answer directly TO THE USER for this follow-up question. Focus on their new question."
                ]
            else: # Initial mistake explanation
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
                prompt_parts = [
                    new_core_instruction,
                    "You are continuing a discussion with the user.",
                    f"The main discussion prompt/context was: {block_context}",
                    f"The user initially responded with: {user_written_response}", # This is the user's main essay/answer
                    topic_relevance_instruction,
                    f"The user now has this follow-up question or comment: '{user_query}'",
                    "Please provide a thoughtful and concise response directly TO THE USER for this follow-up, keeping the discussion going. Encourage deeper reflection or offer related insights if appropriate."
                ]
            else: # Initial feedback on a discussion response
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
            genai.configure(api_key=api_key)
        except Exception as e:
            return Response(
                {"error": f"Failed to configure Gemini API: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        topic_relevance_instruction = "IMPORTANT: Confine your entire response to the subject matter of the provided context, user's input, and direct questions about them. Do not provide information or discuss topics outside of this specific context."

        core_debate_instruction = "You are an AI debate coach and discussion facilitator. Your role is to help the user explore various aspects of a social issue or debate topic. Ensure your tone is always polite, respectful, neutral, and encouraging. When you generate your response, speak directly TO the user, addressing them using 'you' and referring to their arguments/input as 'your points', 'your arguments', or 'your perspective'. Do NOT speak as if you ARE the user. Your goal is to stimulate critical thinking and deeper understanding."
        prompt_parts = []

        if user_query: # Follow-up discussion
            prompt_parts = [
                core_debate_instruction,
                "You are continuing a discussion with the user.",
                f"The main discussion prompt/context was: {block_context}",
                f"The user initially responded with: {user_written_response}",
                topic_relevance_instruction,
                f"The user now has this follow-up question or comment: '{user_query}'",
                "Please provide a thoughtful and concise response directly TO THE USER for this follow-up, keeping the discussion going. Encourage deeper reflection, explore nuances, or offer related insights, as appropriate. Maintain neutrality and politeness."
            ]
        else: # Initial discussion
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
        print(f"Gemini DEBATE Interaction Type: {'Follow-up' if user_query else 'Initial'}")
        print(f"Gemini DEBATE Final Prompt:\n{final_prompt}")

        try:
            model = genai.GenerativeModel('gemini-1.5-flash-latest')
            response_gemini = model.generate_content(final_prompt)
            ai_explanation = response_gemini.text
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
            genai.configure(api_key=api_key)
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
                prompt_parts.extend([
                    f"The user is working on a task with the following context or instructions: {block_context}",
                    f"Previously, the user might have provided these inputs related to the task: {user_inputs_str}",
                    f"The user now has a specific question: '{user_query}'",
                    "Please provide a clear and concise answer to the user's question, keeping in mind the module's focus on facts, opinions, bias, and critical thinking."
                ])
            elif interaction_type == 'explain_fact_opinion_choice':
                prompt_parts.extend([
                    f"The user was presented with this statement/question: {block_context}",
                    f"The user's answer was: {user_inputs_list[0] if user_inputs_list else 'Not provided'}", # Assumes user_inputs_list[0] is the choice
                    f"The correct answer is: {correct_answers_list[0] if correct_answers_data_list else 'Not specified'}", # Assumes correct_answers_data_list[0]
                    "Please explain why the user's answer is correct or incorrect, focusing on the definitions of fact and opinion or the nature of bias if relevant. If the user provided an explanation as part of their input (e.g. if user_inputs_list has more than one element), comment on that too."
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

        final_prompt = "\n\n".join(prompt_parts)
        logger.debug(f"Generic AI Final Prompt:\n{final_prompt}")

        # 4. Initialize the Gemini model and generate content
        try:
            model = genai.GenerativeModel('gemini-1.5-flash-latest') # Or your preferred model
            response_gemini = model.generate_content(final_prompt)
            ai_explanation = response_gemini.text
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
