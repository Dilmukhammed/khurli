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
const register = async (firstName, lastName, username, email, password, password2) => { // Added firstName, lastName
    const response = await fetch(API_URL + 'register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            first_name: firstName, // Changed to first_name to match serializer
            last_name: lastName,   // Changed to last_name to match serializer
            username,
            email,
            password,
            password2
        }),
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

};
