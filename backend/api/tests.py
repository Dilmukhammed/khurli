from django.test import TestCase, Client
from django.urls import reverse
import json

class APIViewsTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_hello_world_view(self):
        url = reverse('hello_world')  # Assuming 'hello_world' is the name of the URL pattern
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        expected_data = {"message": "Hello, world!"}
        self.assertEqual(json.loads(response.content), expected_data)
