import authService from './authService'; // To get the auth token

const API_BASE_URL = 'http://localhost:8000/api/modules'; // Base URL for module-related endpoints

// Function to handle API responses, similar to authService
const handleResponse = async (response) => {
    if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorData;
        let errorMessage = `An error occurred. Status: ${response.status}`;

        // Specific check for auth errors (401, 403)
        if (response.status === 401 || response.status === 403) {
            if (contentType && contentType.includes('application/json')) {
                errorData = await response.json().catch(() => ({ message: `Authentication error (status ${response.status}). Failed to parse JSON body.` }));
            } else if (contentType && contentType.includes('text/html')) {
                // For HTML auth errors, we don't want to parse the HTML.
                errorData = { message: `Authentication error (status ${response.status}). Received HTML response.` };
            } else {
                errorData = { message: `Authentication error (status ${response.status}). Content-Type: ${contentType}` };
            }

            const err = new Error(errorData.detail || errorData.message || `HTTP error ${response.status}`);
            err.isAuthError = true;
            err.statusCode = response.status;
            console.error('Module API Auth Error:', errorData);
            throw err;
        }

        // General error handling for other !response.ok cases
        if (contentType && contentType.includes('application/json')) {
            errorData = await response.json().catch(() => ({ message: 'Error parsing JSON error response.' }));
        } else if (contentType && contentType.includes('text/html')) {
            // Avoid parsing HTML, create a specific error message
            errorMessage = `Server error: Received HTML response instead of JSON. Status: ${response.status}`;
            console.error('Module API Error: Received HTML instead of JSON', { status: response.status });
            throw new Error(errorMessage);
        } else {
            try {
                const textResponse = await response.text();
                errorMessage = `Server error: Status ${response.status}. Response: ${textResponse.substring(0, 100)}`;
            } catch (e) {
                errorMessage = `Server error: Status ${response.status}. Unable to parse response.`;
            }
            console.error('Module API Error: Non-JSON/HTML error', { status: response.status, contentType });
            throw new Error(errorMessage);
        }

        console.error('Module API Error:', errorData);
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
    let token = authService.getAuthToken(); // Use let as it might be updated
    console.log('[Debug] Auth Token for Progress (Initial):', token);
    if (!token) {
        // This case should ideally not happen if login flow is correct,
        // but if it does, refresh might not be possible or sensible.
        throw new Error('User not authenticated. Cannot fetch module progress.');
    }

    const requestUrl = `${API_BASE_URL}/${moduleId}/progress/`;
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };

    try {
        const response = await fetch(requestUrl, requestOptions);
        return await handleResponse(response);
    } catch (error) {
        if (error.isAuthError && error.statusCode === 401) { // Typically 401 for expired token
            console.log('Auth error detected (401), attempting token refresh for getModuleProgress...');
            try {
                await authService.refreshToken();
                token = authService.getAuthToken(); // Get the new token
                console.log('[Debug] Auth Token for Progress (After Refresh):', token);
                if (!token) {
                    authService.logout(); // Logout if refresh succeeded but no token found
                    throw new Error('Token refresh seemed to succeed but no new token found. Logging out.');
                }

                // Update Authorization header for the retry
                requestOptions.headers['Authorization'] = `Bearer ${token}`;

                console.log('Token refreshed, retrying original request for getModuleProgress...');
                const retryResponse = await fetch(requestUrl, requestOptions);
                return await handleResponse(retryResponse);
            } catch (refreshError) {
                console.error('Token refresh failed for getModuleProgress:', refreshError);
                authService.logout(); // Logout on refresh failure
                // It might be better to throw the refreshError to indicate refresh failed
                // or the original error if refreshError is too generic.
                throw new Error(`Token refresh failed: ${refreshError.message}. Original error: ${error.message}`);
            }
        }
        throw error; // Re-throw original error if not auth error or not a 401, or if retry failed
    }
};

// Mark a specific task within a module as completed for the current user
const markTaskAsCompleted = async (moduleId, taskId, status = 'completed') => {
    let token = authService.getAuthToken(); // Use let
    console.log('[Debug] Auth Token for Mark Task (Initial):', token);
    if (!token) {
        throw new Error('User not authenticated. Cannot save module progress.');
    }

    const requestUrl = `${API_BASE_URL}/progress/`; // POST to the general progress creation endpoint
    const requestBody = {
        module_id: moduleId,
        task_id: taskId,
        status: status,
    };
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
    };

    try {
        const response = await fetch(requestUrl, requestOptions);
        return await handleResponse(response);
    } catch (error) {
        if (error.isAuthError && error.statusCode === 401) { // Typically 401
            console.log('Auth error detected (401), attempting token refresh for markTaskAsCompleted...');
            try {
                await authService.refreshToken();
                token = authService.getAuthToken(); // Get the new token
                console.log('[Debug] Auth Token for Mark Task (After Refresh):', token);
                 if (!token) {
                    authService.logout();
                    throw new Error('Token refresh seemed to succeed but no new token found. Logging out.');
                }

                requestOptions.headers['Authorization'] = `Bearer ${token}`;

                console.log('Token refreshed, retrying original request for markTaskAsCompleted...');
                const retryResponse = await fetch(requestUrl, requestOptions);
                return await handleResponse(retryResponse);
            } catch (refreshError) {
                console.error('Token refresh failed for markTaskAsCompleted:', refreshError);
                authService.logout();
                throw new Error(`Token refresh failed: ${refreshError.message}. Original error: ${error.message}`);
            }
        }
        throw error;
    }
};

// Function to get AI explanation for proverb mistakes
const getAiProverbExplanation = async (blockContext, userAnswers, correctAnswers, userQuery = '') => {
    let token = authService.getAuthToken();
    if (!token) {
        // This error should ideally be caught by UI logic preventing call if not logged in
        // or if token is known to be missing.
        throw new Error('User not authenticated. Cannot fetch AI explanation.');
    }

    const requestUrl = `${API_BASE_URL}/ai/explain-proverb/`; // Note: API_BASE_URL is '/api/modules'
    const requestBody = {
        block_context: blockContext,
        user_answers: userAnswers,
        correct_answers: correctAnswers,
        user_query: userQuery,
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
    };

    try {
        const response = await fetch(requestUrl, requestOptions);
        // Assuming handleResponse is suitable for this too, or create a specific one if needed.
        // handleResponse already includes logic for 401/403 and general errors.
        return await handleResponse(response);
    } catch (error) {
        // Token refresh logic similar to getModuleProgress could be added here if desired,
        // but for simplicity in this step, we'll rely on handleResponse's existing behavior
        // and the primary token being valid. If a 401 occurs, handleResponse might throw
        // an error that the calling component needs to catch.
        // For now, let's assume a 401 from here means the token is truly invalid and refresh
        // should have happened earlier or the user needs to re-login.
        console.error('Error in getAiProverbExplanation:', error);
        throw error; // Re-throw to be handled by the calling component
    }
};

export default {
    getModuleProgress,
    markTaskAsCompleted,
    getAiProverbExplanation,
    getAiDebateDiscussion, // Added new function here
};

// Function to get AI feedback for debate discussions
async function getAiDebateDiscussion(block_context, user_answers, user_query = '') {
    let token = authService.getAuthToken();
    if (!token) {
        throw new Error('User not authenticated. Cannot fetch AI debate discussion.');
    }

    const requestUrl = `${API_BASE_URL}/ai-debate-discussion/`; // Ensure this matches your Django URL
    const requestBody = {
        block_context: block_context,
        user_answers: user_answers, // This will be the user's arguments/thoughts
        user_query: user_query,     // For follow-up questions/comments
        interaction_type: 'discuss_open_ended', // Hardcoded for this type of interaction
        // 'correct_answers' is not typically needed for debates, so it's omitted
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
    };

    try {
        const response = await fetch(requestUrl, requestOptions);
        return await handleResponse(response); // Reusing the existing robust handler
    } catch (error) {
        // Similar to getAiProverbExplanation, detailed refresh logic could be added
        // but for now, relying on handleResponse and higher-level error handling.
        console.error('Error in getAiDebateDiscussion:', error);
        throw error;
    }
}
