import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const initializeAuth = () => { // Removed async as refreshToken is not called here
            setLoading(true);
            const token = authService.getAuthToken(); // This gets accessToken
            if (token) {
                // If a token exists, we'll assume the user is authenticated for now.
                // The token's validity will be checked when an API call is made.
                // A more robust solution would be to verify the token with a backend /me endpoint here
                // or decode it if it contains necessary, non-sensitive user info and expiry.
                setUser({ token }); // Store the token or decoded user info
                setIsAuthenticated(true);
            }
            setLoading(false);
        };
        initializeAuth();
    }, []); // Runs once on AuthProvider mount

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.login(username, password);
            // authService.login already stores tokens in localStorage
            setUser({ token: data.access });
            setIsAuthenticated(true);
            setLoading(false);
            return data;
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
            throw err;
        }
    };

    const register = async (username, email, password, password2) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.register(username, email, password, password2);
            setLoading(false);
            return data;
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
            setLoading(false);
            throw err;
        }
    };

    const logout = () => {
        authService.logout(); // Clears tokens from localStorage
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
        // Navigation to /login should be handled by components using this context or ProtectedRoute
    };

    // Function to attempt token refresh.
    // This would typically be called by an API interceptor when a 401 is received.
    const attemptRefreshToken = async () => {
        try {
            const data = await authService.refreshToken(); // authService handles localStorage updates
            if (data && data.access) {
                 setUser({ token: data.access });
                 setIsAuthenticated(true);
                 return true; // Token refreshed successfully
            }
            // If refresh didn't yield an access token for some reason
            logout(); // Force logout
            return false;
        } catch (error) {
            console.error("Attempt refresh token failed in context:", error);
            logout(); // Force logout if refresh fails
            return false;
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        attemptRefreshToken, // Expose this for manual calls or future interceptors
        setError // Allow components to clear errors or set custom ones
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
