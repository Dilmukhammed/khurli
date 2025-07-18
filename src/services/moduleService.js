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

// Function to get AI explanation (generic version for Fake News module, etc.)
const getAiExplanation = async (blockContext, userAnswers, correctAnswers = [], userQuery = '', chatMessages = [], interaction_type = "") => {
    let token = authService.getAuthToken();
    if (!token) {
        throw new Error('User not authenticated. Cannot fetch AI explanation.');
    }

    const requestUrl = `${API_BASE_URL}/ai/explain-general/`; // Endpoint for general explanations
    const requestBody = {
        block_context: blockContext,
        user_answers: userAnswers,
        correct_answers: correctAnswers,
        user_query: userQuery,
        chat_history: chatMessages,
        interaction_type: interaction_type
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
        // Token refresh logic could be added here if this endpoint requires it frequently.
        // For now, relying on handleResponse's existing behavior.
        console.error('Error in getAiExplanation:', error);
        throw error;
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
const getAiProverbExplanation = async (blockContext, userAnswers, correctAnswers = [], userQuery = '', chatMessages = [], interaction_type = "") => {
    let token = authService.getAuthToken();
    if (!token) {
        // This error should ideally be caught by UI logic preventing call if not logged in
        // or if token is known to be missing.
        throw new Error('User not authenticated. Cannot fetch AI explanation.');
    }
    console.log("line 195 block context", blockContext)
    console.log("useranswer", userAnswers)
    console.log("correct", correctAnswers)
    console.log("userquery", userQuery)
    console.log("chat messages", chatMessages)
    console.log("interaction", interaction_type)
    const requestUrl = `${API_BASE_URL}/ai/explain-proverb/`; // Note: API_BASE_URL is '/api/modules'
    const requestBody = {
        block_context: blockContext,
        user_answers: userAnswers,
        correct_answers: correctAnswers,
        user_query: userQuery,
        chat_history: chatMessages,
        interaction_type: interaction_type
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


// Function to get AI feedback for debate discussions
// Moved before export default
async function getAiDebateDiscussion(block_context, user_answers, userQuery = '', chatMessages = []) {
    let token = authService.getAuthToken();
    if (!token) {
        throw new Error('User not authenticated. Cannot fetch AI debate discussion.');
    }

    const requestUrl = `${API_BASE_URL}/ai-debate-discussion/`; // Ensure this matches your Django URL
    console.log("line 255 module service",block_context )
    console.log(user_answers)
    const requestBody = {
        block_context: block_context,
        user_answers: user_answers || [], // This will be the user's arguments/thoughts
        user_query: userQuery || " ",     // For follow-up questions/comments
        interaction_type: 'discuss_open_ended', // Hardcoded for this type of interaction
        chat_history: chatMessages || "",
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

// Function to get AI feedback for fact/opinion module
// Commented out as per plan, to be replaced by getGenericAiInteraction for this module.
// async function getAiFactOpinion(block_context, user_answers, correct_answers = [], user_query = '', interaction_type) {
//     let token = authService.getAuthToken();
//     if (!token) {
//         throw new Error('User not authenticated. Cannot fetch AI fact/opinion feedback.');
//     }
//
//     const requestUrl = `${API_BASE_URL}/ai-fact-opinion/`;
//     const requestBody = {
//         block_context: block_context,
//         user_answers: user_answers,
//         correct_answers: correct_answers,
//         user_query: user_query,
//         interaction_type: interaction_type,
//     };
//
//     const requestOptions = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(requestBody),
//     };
//
//     try {
//         const response = await fetch(requestUrl, requestOptions);
//         return await handleResponse(response);
//     } catch (error) {
//         console.error('Error in getAiFactOpinion:', error);
//         throw error;
//     }
// }

// Generic function to interact with the new AI endpoint
async function getGenericAiInteraction(requestData) {
    let token = authService.getAuthToken();
    if (!token) {
        throw new Error('User not authenticated. Cannot fetch generic AI interaction.');
    }

    const requestUrl = `${API_BASE_URL}/ai/generic-interaction/`;

    // Map frontend naming (user_inputs, correct_answers_data) to backend (user_answers, correct_answers)
    const body = {
        module_id: requestData.module_id,
        task_id: requestData.task_id, // Optional, include if provided
        interaction_type: requestData.interaction_type,
        block_context: requestData.block_context,
        user_answers: requestData.user_inputs || [], // Map to backend's expected key
        correct_answers: requestData.correct_answers_data || [], // Map to backend's expected key
        user_query: requestData.userQuery || '',
        chat_history: requestData.chatMessages || [],
    };
    console.log("MOdule service js BODY: ", body)

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    };

    try {
        const response = await fetch(requestUrl, requestOptions);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error in getGenericAiInteraction:', error);
        // Consider adding token refresh logic here if needed, similar to other service calls
        throw error;
    }
}

export default {
    getModuleProgress,
    markTaskAsCompleted,
    getAiProverbExplanation,
    getAiExplanation,
    // getAiFactOpinion, // Commented out as it's being replaced by generic interaction
    getAiDebateDiscussion, // Ensure this is moved before export and included
    getGenericAiInteraction,

    // Save answers for a specific task to the backend
    saveTaskAnswers: async (moduleId, taskId, answers) => {
        let token = authService.getAuthToken();
        if (!token) {
            // Consider if an error should be thrown or if an attempt to refresh should be made.
            // For simplicity, we'll throw an error, assuming UI checks for auth.
            throw new Error('User not authenticated. Cannot save task answers.');
        }

        const requestUrl = `${API_BASE_URL}/answers/`; // POST to the list endpoint
        const requestBody = {
            module_id: moduleId,
            task_id: taskId,
            answers: answers, // The answers object itself
        };
        const requestOptions = {
            method: 'POST', // POST will create or update due to serializer logic
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
        };

        try {
            const response = await fetch(requestUrl, requestOptions);
            return await handleResponse(response); // handleResponse will parse JSON and handle errors
        } catch (error) {
            if (error.isAuthError && error.statusCode === 401) {
                console.log('Auth error (401) in saveTaskAnswers, attempting token refresh...');
                try {
                    await authService.refreshToken();
                    token = authService.getAuthToken();
                    if (!token) {
                        authService.logout();
                        throw new Error('Token refresh succeeded but no new token. Logging out.');
                    }
                    requestOptions.headers['Authorization'] = `Bearer ${token}`;
                    const retryResponse = await fetch(requestUrl, requestOptions);
                    return await handleResponse(retryResponse);
                } catch (refreshError) {
                    console.error('Token refresh failed for saveTaskAnswers:', refreshError);
                    authService.logout();
                    throw new Error(`Token refresh failed: ${refreshError.message}. Original error: ${error.message}`);
                }
            }
            console.error(`Error saving task answers for ${moduleId}-${taskId} to backend:`, error);
            throw error; // Re-throw the error to be caught by the calling component
        }
    },

    // Get saved answers for a specific task from the backend
    getTaskAnswers: async (moduleId, taskId) => {
        let token = authService.getAuthToken();
        if (!token) {
            // As above, consider error handling or refresh.
            throw new Error('User not authenticated. Cannot fetch task answers.');
        }

        // Construct URL with query parameters
        const requestUrl = `${API_BASE_URL}/answers/?module_id=${encodeURIComponent(moduleId)}&task_id=${encodeURIComponent(taskId)}`;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        try {
            const response = await fetch(requestUrl, requestOptions);
            const responseData = await handleResponse(response); // Expects a list

            // The backend returns a list. If found, it's a list with one item.
            if (responseData && responseData.length > 0) {
                return responseData[0].answers; // Return the 'answers' object from the first item
            }
            return null; // No answers found for this module/task for the user
        } catch (error) {
            if (error.isAuthError && error.statusCode === 401) {
                console.log('Auth error (401) in getTaskAnswers, attempting token refresh...');
                try {
                    await authService.refreshToken();
                    token = authService.getAuthToken();
                    if (!token) {
                        authService.logout();
                        throw new Error('Token refresh succeeded but no new token. Logging out.');
                    }
                    requestOptions.headers['Authorization'] = `Bearer ${token}`;
                    const retryResponse = await fetch(requestUrl, requestOptions);
                    const retryData = await handleResponse(retryResponse);
                    if (retryData && retryData.length > 0) {
                        return retryData[0].answers;
                    }
                    return null;
                } catch (refreshError) {
                    console.error('Token refresh failed for getTaskAnswers:', refreshError);
                    authService.logout();
                    throw new Error(`Token refresh failed: ${refreshError.message}. Original error: ${error.message}`);
                }
            }
            console.error(`Error fetching task answers for ${moduleId}-${taskId} from backend:`, error);
            // It's important to decide how to handle "not found" vs. actual errors.
            // handleResponse throws for non-ok statuses. A 404 might be "normal" if no answers saved yet.
            // However, our current backend setup for list view with filters will return an empty list (200 OK) if not found.
            // So, an error here is likely a genuine server/network issue or an auth problem.
            throw error;
        }
    },

    getAiPersonalizedRecommendations: async () => {
        let token = authService.getAuthToken();
        if (!token) {
            throw new Error('User not authenticated. Cannot fetch AI personalized recommendations.');
        }

        const requestUrl = `${API_BASE_URL}/ai/personal-recommendations/`;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        try {
            const response = await fetch(requestUrl, requestOptions);
            return await handleResponse(response); // Expects { recommendations: ["Rec 1", "Rec 2"] }
        } catch (error) {
            if (error.isAuthError && error.statusCode === 401) {
                console.log('Auth error (401) in getAiPersonalizedRecommendations, attempting token refresh...');
                try {
                    await authService.refreshToken();
                    token = authService.getAuthToken();
                    if (!token) {
                        authService.logout();
                        throw new Error('Token refresh succeeded but no new token. Logging out.');
                    }
                    requestOptions.headers['Authorization'] = `Bearer ${token}`;
                    const retryResponse = await fetch(requestUrl, requestOptions);
                    return await handleResponse(retryResponse);
                } catch (refreshError) {
                    console.error('Token refresh failed for getAiPersonalizedRecommendations:', refreshError);
                    authService.logout();
                    throw new Error(`Token refresh failed: ${refreshError.message}. Original error: ${error.message}`);
                }
            }
            console.error('Error fetching AI personalized recommendations:', error);
            throw error;
        }
    },
};
