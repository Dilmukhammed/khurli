import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
// To navigate programmatically after login/logout
// import { useNavigate } from 'react-router-dom'; // Cannot use hooks directly in context file at module scope

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Initially true to check token status
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check for existing token on initial load
        const initializeAuth = async () => {
            setLoading(true);
            const token = authService.getAuthToken();
            if (token) {
                // Ideally, you'd validate the token here with a backend /me endpoint
                // For now, if token exists, assume user is logged in.
                // You might want to decode the token to get user info if it's a JWT and not opaque
                // For simplicity, we'll just set a placeholder user or handle this in login
                // For a more robust app, fetch user details from a '/api/users/me' endpoint
                try {
                    // Attempt to refresh token to ensure validity and get fresh user data if needed
                    // This also handles the case where the access token is expired but refresh is valid
                    await authService.refreshToken(); // This will update localStorage
                    const refreshedToken = authService.getAuthToken();
                    if (refreshedToken) {
                        setUser({ token: refreshedToken }); // Or decode token for user details
                        setIsAuthenticated(true);
                    } else {
                        // Refresh failed or no token after refresh
                        authService.logout(); // Clean up tokens
                        setIsAuthenticated(false);
                        setUser(null);
                    }
                } catch (err) {
                    console.warn("Initial token refresh failed or no token:", err.message);
                    authService.logout(); // Clean up if token is invalid
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.login(username, password);
            setUser({ token: data.access }); // Or decode token for user details
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
            // Optionally, log the user in directly after registration
            // For now, let's require them to login separately.
            setLoading(false);
            return data;
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
            setLoading(false);
            throw err;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
        // navigate('/login'); // Programmatic navigation after logout
    };

    // Function to attempt token refresh, can be called by API interceptors or components
    const attemptRefreshToken = async () => {
        try {
            await authService.refreshToken();
            const refreshedToken = authService.getAuthToken();
            if (refreshedToken) {
                 setUser({ token: refreshedToken });
                 setIsAuthenticated(true);
                 return true;
            }
            // if no refreshed token, logout
            logout();
            return false;
        } catch (error) {
            console.error("Attempt refresh token failed in context:", error);
            logout(); // Force logout if refresh fails
            return false;
        }
    };


    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, error, login, register, logout, attemptRefreshToken }}>
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
