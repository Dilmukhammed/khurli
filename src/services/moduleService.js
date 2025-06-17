import authService from './authService'; // To get the auth token

const API_BASE_URL = 'http://localhost:8000/api/modules'; // Base URL for module-related endpoints

// Function to handle API responses, similar to authService
const handleResponse = async (response) => {
    if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'An error occurred with module data.';
        let errorData;

        if (contentType && contentType.includes('application/json')) {
            errorData = await response.json().catch(() => ({ message: 'Error parsing JSON error response.' }));
        } else if (contentType && contentType.includes('text/html')) {
            throw new Error(`Server error: Received HTML response instead of JSON. Status: ${response.status}`);
        } else {
            // Fallback for other content types or if content-type is missing
            // Try to get text, but avoid crashing if it's not available or not text.
            try {
                const textResponse = await response.text();
                // Use a generic message if textResponse is too long or unhelpful
                errorMessage = `Server error: Status ${response.status}. Response: ${textResponse.substring(0, 100)}`;
            } catch (e) {
                errorMessage = `Server error: Status ${response.status}. Unable to parse response.`;
            }
            throw new Error(errorMessage);
        }

        console.error('Module API Error:', errorData);
        // Process errorData if it was parsed (i.e., it was JSON)
        if (errorData) {
            if (errorData.detail) {
                errorMessage = errorData.detail;
            } else if (errorData.message) {
                errorMessage = errorData.message;
            } else if (typeof errorData === 'object' && Object.keys(errorData).length > 0) {
                errorMessage = Object.entries(errorData).map(([key, value]) => {
                    if (Array.isArray(value)) return `${key}: ${value.join(' ')}`;
                    return `${key}: ${value}`;
                }).join('; ');
            } else {
                // If errorData was from .catch() or not in expected format
                 errorMessage = errorData.message || 'An unknown error occurred while processing module data.';
            }
        }
        throw new Error(errorMessage);
    }

    // For 204 No Content or 304 Not Modified, response.json() will fail as there's no body.
    if (response.status === 204 || response.status === 304) {
        return null;
    }

    // Check Content-Type even for successful responses before attempting to parse as JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
        throw new Error(`API Error: Expected JSON but received HTML content with success status (${response.status}).`);
    }

    // If response.ok is true, and content type is not HTML, proceed to parse as JSON.
    return response.json();
};

// Fetch all progress for a specific module for the current user
const getModuleProgress = async (moduleId) => {
    const token = authService.getAuthToken();
    if (!token) {
        throw new Error('User not authenticated. Cannot fetch module progress.');
    }

    const response = await fetch(`${API_BASE_URL}/${moduleId}/progress/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

// Mark a specific task within a module as completed for the current user
const markTaskAsCompleted = async (moduleId, taskId, status = 'completed') => {
    const token = authService.getAuthToken();
    if (!token) {
        throw new Error('User not authenticated. Cannot save module progress.');
    }

    const response = await fetch(`${API_BASE_URL}/progress/`, { // POST to the general progress creation endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            module_id: moduleId,
            task_id: taskId,
            status: status,
        }),
    });
    return handleResponse(response);
};

export default {
    getModuleProgress,
    markTaskAsCompleted,
};
