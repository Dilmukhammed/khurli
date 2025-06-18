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
        self.url = reverse('ai_explain_proverb') # Make sure 'ai_explain_proverb' is correct

        # Default valid payload
        self.valid_payload = {
            'block_context': 'This is a proverb context.',
            'user_answers': ['User answer 1'],
            'correct_answers': ['Correct answer 1'],
            'user_query': 'Why is this so?'
        }

    @patch('modules.views.genai.GenerativeModel')
    def test_successful_explanation(self, MockGenerativeModel):
        # Configure the mock Gemini model and its response
        mock_model_instance = MockGenerativeModel.return_value
        mock_gemini_response = MagicMock()
        mock_gemini_response.text = "This is a mock AI explanation."
        mock_model_instance.generate_content.return_value = mock_gemini_response

        # Ensure API key is set for this test using Django's settings override
        with self.settings(GEMINI_API_KEY='test_api_key'):
            response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('explanation', response.data)
        self.assertEqual(response.data['explanation'], "This is a mock AI explanation.")
        MockGenerativeModel.assert_called_once_with('gemini-1.5-flash-latest')
        mock_model_instance.generate_content.assert_called_once()
        # Example of checking prompt part:
        # called_prompt = mock_model_instance.generate_content.call_args[0][0]
        # self.assertIn("Context/Questions: This is a proverb context.", called_prompt)

    def test_missing_required_fields(self):
        payload = {'block_context': 'Test context'} # Missing user_answers, correct_answers
        with self.settings(GEMINI_API_KEY='test_api_key'):
            response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('user_answers', response.data)
        self.assertIn('correct_answers', response.data)

    def test_missing_gemini_api_key(self):
        with self.settings(GEMINI_API_KEY=None): # Simulate missing API key
            response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], "GEMINI_API_KEY not configured on the server.")

    @patch('modules.views.genai.configure')
    def test_gemini_configure_failure(self, mock_gemini_configure):
        mock_gemini_configure.side_effect = Exception("Config error")
        with self.settings(GEMINI_API_KEY='test_api_key'):
            response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('error', response.data)
        # The error message includes the original exception's message
        self.assertTrue("Failed to configure Gemini API: Config error" in response.data['error'])

    @patch('modules.views.genai.GenerativeModel')
    def test_gemini_generate_content_failure(self, MockGenerativeModel):
        mock_model_instance = MockGenerativeModel.return_value
        mock_model_instance.generate_content.side_effect = Exception("API call failed")

        with self.settings(GEMINI_API_KEY='test_api_key'):
            response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('error', response.data)
        self.assertTrue("Error communicating with AI service: API call failed" in response.data['error'])

    def test_unauthenticated_access(self):
        unauth_client = APIClient() # New client, not authenticated
        response = unauth_client.post(self.url, self.valid_payload, format='json')
        # Default for IsAuthenticated is 401 if JWT is primary and no session auth in test client
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
