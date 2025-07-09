const API_URL = 'http://localhost:8000/api/accounts/'; // Base URL for auth endpoints

// Function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
        console.error('API Error:', errorData);
        // Prefer specific error messages from backend if available
        let errorMessage = 'An error occurred.';
        if (errorData) {
            if (errorData.detail) { // Common for DRF errors
                 errorMessage = errorData.detail;
            } else if (errorData.message) {
                 errorMessage = errorData.message;
            } else if (typeof errorData === 'object' && Object.keys(errorData).length > 0) {
                // Try to concatenate messages from a dictionary of errors (e.g., serializer errors)
                errorMessage = Object.entries(errorData).map(([key, value]) => {
                    if (Array.isArray(value)) {
                        return `${key}: ${value.join(' ')}`;
                    }
                    return `${key}: ${value}`;
                }).join('; ');
            }
        }
        throw new Error(errorMessage);
    }
    return response.json();
};

// Register user
const register = async (username, email, password, password2) => {
    const response = await fetch(API_URL + 'register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, password2 }),
    });
    return handleResponse(response);
};

// Login user
const login = async (username, password) => {
    const response = await fetch(API_URL + 'login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
    const data = await handleResponse(response);
    if (data.access) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
    }
    return data;
};

// Logout user
const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Potentially call a backend endpoint to blacklist the token if implemented
};

// Refresh token
const refreshToken = async () => {
    const currentRefreshToken = localStorage.getItem('refreshToken');
    if (!currentRefreshToken) {
        throw new Error('No refresh token available.');
    }

    try {
        const response = await fetch(API_URL + 'login/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: currentRefreshToken }),
        });
        const data = await handleResponse(response);
        if (data.access) {
            localStorage.setItem('accessToken', data.access);
            // Sometimes a new refresh token is also issued
            if (data.refresh) {
                localStorage.setItem('refreshToken', data.refresh);
            }
        }
        return data;
    } catch (error) {
        console.error("Failed to refresh token:", error);
        // If refresh fails, log out the user
        logout();
        throw error; // Re-throw to be caught by AuthContext or caller
    }
};

// Get current user (example, if you store user details separately or have a /me endpoint)
// For now, just checks if a token exists
const getCurrentUser = () => {
    const token = localStorage.getItem('accessToken');
    // In a real app, you might want to decode the token to get user info (if not sensitive)
    // or have a /api/users/me/ endpoint to fetch user data
    return token ? { token } : null;
};

// Function to get the auth token (e.g., for use in other API calls)
const getAuthToken = () => {
    return localStorage.getItem('accessToken');
};


export default {
    register,
    login,
    logout,
    refreshToken,
    getCurrentUser,
    getAuthToken,

    updateProfileDetails: async (profileData) => {
        const token = getAuthToken();
        if (!token) {
            throw new Error('User not authenticated. Cannot update profile.');
        }

        const response = await fetch(API_URL + 'profile/update/', { // Assuming API_URL is 'http://localhost:8000/api/accounts/'
            method: 'PATCH', // Or PUT if you always send all fields
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(profileData), // profileData should be { first_name, last_name, age }
        });

        // The handleResponse function might need adjustment if the update endpoint
        // returns 204 No Content or a different success status without a full JSON body.
        // For now, assuming it returns a JSON response on success as well.
        // If it returns 204, handleResponse would need to accommodate that for non-error cases.
        if (response.status === 204) { // Handle 204 No Content explicitly if backend returns it
            return null; // Or { success: true }
        }
        return handleResponse(response); // Expects JSON response from backend
    }
};
