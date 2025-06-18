from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from unittest.mock import patch, MagicMock
from django.conf import settings # Not strictly needed for self.settings, but good practice
from rest_framework import status

class GeminiProverbExplanationViewTests(APITestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword123')
        # Configure the client to authenticate as this user
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # URL for the view
        # Ensure self.url is defined, e.g. self.url = reverse('ai_explain_proverb')
        if not hasattr(self, 'url'): # Add if setUp might be from an older version
            self.url = reverse('ai_explain_proverb')


        self.valid_payload_explain_initial = { # For initial explanation of mistakes
            'block_context': 'This is a proverb context for mistake explanation.',
            'user_answers': ['User answer 1 to explain'],
            'correct_answers': ['Correct answer 1 for explain'],
            'interaction_type': 'explain_mistakes'
        }
        self.valid_payload_explain_follow_up = { # For follow-up on mistake explanation
            'block_context': 'This is a proverb context for mistake explanation.',
            'user_answers': ['User answer 1 to explain'],
            'correct_answers': ['Correct answer 1 for explain'],
            'user_query': 'Why is my answer wrong about the explanation context?',
            'interaction_type': 'explain_mistakes'
        }
        self.valid_payload_discuss_initial = {
            'block_context': 'Discuss this proverb: "A rolling stone gathers no moss."',
            'user_answers': ["I think this means that people who are always moving don't settle down or accumulate things."],
            'interaction_type': 'discuss_open_ended'
            # correct_answers is optional, so not included here
        }
        self.valid_payload_discuss_follow_up = {
            'block_context': 'Discuss this proverb: "A rolling stone gathers no moss."',
            'user_answers': ["I think this means that people who are always moving don't settle down or accumulate things."],
            'user_query': "Can this proverb also have a positive meaning?",
            'interaction_type': 'discuss_open_ended'
        }

    @patch('modules.views.genai.GenerativeModel') # Path to GenerativeModel as used in views.py
    def test_successful_explanation_initial_explicit_type(self, MockGenerativeModel):
        mock_model_instance = MockGenerativeModel.return_value
        mock_gemini_response = MagicMock()
        mock_gemini_response.text = "This is a mock AI explanation for a mistake (initial)."
        mock_model_instance.generate_content.return_value = mock_gemini_response

        with self.settings(GEMINI_API_KEY='test_api_key'):
            response = self.client.post(self.url, self.valid_payload_explain_initial, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('explanation', response.data)
        args, _ = mock_model_instance.generate_content.call_args
        prompt_sent = args[0]
        self.assertIn("analyze the user's answers based on the correct answers", prompt_sent)
        self.assertNotIn("User's follow-up question:", prompt_sent)


    @patch('modules.views.genai.GenerativeModel')
    def test_successful_explanation_follow_up_explicit_type(self, MockGenerativeModel):
        mock_model_instance = MockGenerativeModel.return_value
        mock_gemini_response = MagicMock()
        mock_gemini_response.text = "This is a mock AI explanation for a mistake (follow-up)."
        mock_model_instance.generate_content.return_value = mock_gemini_response

        with self.settings(GEMINI_API_KEY='test_api_key'):
            response = self.client.post(self.url, self.valid_payload_explain_follow_up, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('explanation', response.data)
        args, _ = mock_model_instance.generate_content.call_args
        prompt_sent = args[0]
        self.assertIn("User's follow-up question:", prompt_sent)
        self.assertIn(self.valid_payload_explain_follow_up['user_query'], prompt_sent)


    @patch('modules.views.genai.GenerativeModel')
    def test_successful_discussion_initial_feedback(self, MockGenerativeModel):
        mock_model_instance = MockGenerativeModel.return_value
        mock_gemini_response = MagicMock()
        mock_gemini_response.text = "That's an interesting take on the proverb. It indeed often refers to..."
        mock_model_instance.generate_content.return_value = mock_gemini_response

        with self.settings(GEMINI_API_KEY='test_api_key'):
            response = self.client.post(self.url, self.valid_payload_discuss_initial, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('explanation', response.data) # 'explanation' key is still used for the response

        args, _ = mock_model_instance.generate_content.call_args
        prompt_sent = args[0]
        self.assertIn("facilitate discussion on user responses", prompt_sent)
        self.assertIn(self.valid_payload_discuss_initial['user_answers'][0], prompt_sent)
        self.assertNotIn("Correct Answers for that context:", prompt_sent) # correct_answers not sent for discussion
        self.assertNotIn("User's follow-up question:", prompt_sent)


    @patch('modules.views.genai.GenerativeModel')
    def test_successful_discussion_follow_up(self, MockGenerativeModel):
        mock_model_instance = MockGenerativeModel.return_value
        mock_gemini_response = MagicMock()
        mock_gemini_response.text = "Yes, it can also imply that by always moving, one stays fresh and avoids stagnation."
        mock_model_instance.generate_content.return_value = mock_gemini_response

        with self.settings(GEMINI_API_KEY='test_api_key'):
            response = self.client.post(self.url, self.valid_payload_discuss_follow_up, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('explanation', response.data)

        args, _ = mock_model_instance.generate_content.call_args
        prompt_sent = args[0]
        self.assertIn("User's follow-up:", prompt_sent)
        self.assertIn(self.valid_payload_discuss_follow_up['user_query'], prompt_sent)
        self.assertIn(self.valid_payload_discuss_follow_up['user_answers'][0], prompt_sent) # Original discussion response

    def test_missing_required_fields_for_explain(self):
        payload = {
            'block_context': 'Test context',
            'interaction_type': 'explain_mistakes'
            # Missing 'user_answers'. 'correct_answers' is optional but good for explain.
        }
        with self.settings(GEMINI_API_KEY='test_api_key'):
            response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('user_answers', response.data)

    def test_missing_required_fields_for_discuss(self):
        payload = {
            'block_context': 'Test context',
            'interaction_type': 'discuss_open_ended'
            # Missing user_answers (which holds the user's discussion input)
        }
        with self.settings(GEMINI_API_KEY='test_api_key'):
            response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('user_answers', response.data)

    def test_missing_gemini_api_key(self): # This test can use any valid payload structure
        with self.settings(GEMINI_API_KEY=None):
            response = self.client.post(self.url, self.valid_payload_explain_initial, format='json')
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], "GEMINI_API_KEY not configured on the server.")

    @patch('modules.views.genai.configure')
    def test_gemini_configure_failure(self, mock_gemini_configure): # This test can use any valid payload
        mock_gemini_configure.side_effect = Exception("Config error")
        with self.settings(GEMINI_API_KEY='test_api_key'):
            response = self.client.post(self.url, self.valid_payload_explain_initial, format='json')
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('error', response.data)
        self.assertTrue("Failed to configure Gemini API: Config error" in response.data['error'])

    @patch('modules.views.genai.GenerativeModel')
    def test_gemini_generate_content_failure(self, MockGenerativeModel): # This test can use any valid payload
        mock_model_instance = MockGenerativeModel.return_value
        mock_model_instance.generate_content.side_effect = Exception("API call failed")

        with self.settings(GEMINI_API_KEY='test_api_key'):
            response = self.client.post(self.url, self.valid_payload_explain_initial, format='json')

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('error', response.data)
        self.assertTrue("Error communicating with AI service: API call failed" in response.data['error'])

    def test_unauthenticated_access(self): # This test can use any valid payload
        unauth_client = APIClient()
        response = unauth_client.post(self.url, self.valid_payload_explain_initial, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
