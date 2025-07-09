// frontend/src/apiConfig.js

export const API_BASE_URL = '/api'; // Or your full backend URL if different

export const API_ENDPOINTS = {
    accounts: {
        register: `${API_BASE_URL}/accounts/register/`,
        login: `${API_BASE_URL}/accounts/login/`,
        refreshToken: `${API_BASE_URL}/accounts/login/refresh/`,
        userDetails: `${API_BASE_URL}/accounts/user/`,
    },
    // Add other app endpoints here as needed
    // library: {
    //     books: `${API_BASE_URL}/library/books/`,
    // }
};
