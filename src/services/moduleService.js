import authService from './authService'; // To get the auth token

const API_BASE_URL = 'http://localhost:8000/api/modules'; // Base URL for module-related endpoints

// Function to handle API responses, similar to authService
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred while processing module data.' }));
        console.error('Module API Error:', errorData);
        let errorMessage = 'An error occurred with module data.';
        if (errorData) {
            if (errorData.detail) {
                 errorMessage = errorData.detail;
            } else if (errorData.message) {
                 errorMessage = errorData.message;
            } else if (typeof errorData === 'object' && Object.keys(errorData).length > 0) {
                errorMessage = Object.entries(errorData).map(([key, value]) => {
                    if (Array.isArray(value)) return `\${key}: \${value.join(' ')}`; // Corrected template literal
                    return `\${key}: \${value}`; // Corrected template literal
                }).join('; ');
            }
        }
        throw new Error(errorMessage);
    }
    // For 204 No Content, response.json() will fail.
    if (response.status === 204) {
        return null;
    }
    return response.json();
};

// Fetch all progress for a specific module for the current user
const getModuleProgress = async (moduleId) => {
    const token = authService.getAuthToken();
    if (!token) {
        throw new Error('User not authenticated. Cannot fetch module progress.');
    }

    const response = await fetch(`\${API_BASE_URL}/\${moduleId}/progress/`, { // Corrected template literal
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer \${token}`, // Corrected template literal
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

    const response = await fetch(`\${API_BASE_URL}/progress/`, { // Corrected template literal; POST to the general progress creation endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer \${token}`, // Corrected template literal
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
