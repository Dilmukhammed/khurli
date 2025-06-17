from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from rest_framework.exceptions import APIException, ValidationError

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Default error details
    error_payload = {
        "detail": "An unexpected error occurred.",
        "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR
    }

    if response is not None:
        # Use DRF's standard error response structure if available
        error_payload["detail"] = response.data.get("detail", response.data)
        error_payload["status_code"] = response.status_code

        # For validation errors, the detail might be a dict or list
        if isinstance(exc, ValidationError):
            error_payload["detail"] = exc.detail

    else:
        # Handle specific Django exceptions not automatically handled by DRF's handler
        if isinstance(exc, Http404):
            error_payload["detail"] = "Not found."
            error_payload["status_code"] = status.HTTP_404_NOT_FOUND
        elif isinstance(exc, APIException): # Catch other DRF APIExceptions explicitly
            error_payload["detail"] = exc.detail
            error_payload["status_code"] = exc.status_code
        # Add more specific exception types here if needed
        # For generic Python exceptions, keep the default 500 error
        elif isinstance(exc, Exception): # Broad catch for other exceptions
            # In debug mode, you might want to include more details
            # For production, keep it generic.
            # For now, keeping it generic.
            pass # error_payload is already set to a generic 500 error

    # Ensure the response is always a DRF Response object with JSON content type
    # The status_code in the JSON payload is for clarity, the actual HTTP status is set on the Response
    return Response(error_payload, status=error_payload["status_code"])
