import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Will store the full user object
    const [loading, setLoading] = useState(true); // For initial auth state check (overall app loading)
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isProfileComplete, setIsProfileComplete] = useState(true); // Default to true, set to false if profile is incomplete
    const [isFetchingUser, setIsFetchingUser] = useState(false); // Specific loading state for user details fetch

    // Function to fetch user details from the backend
    const fetchUserDetails = async () => {
        const token = authService.getAuthToken();
        if (!token) {
            setUser(null);
            setIsAuthenticated(false);
            setIsProfileComplete(true);
            setLoading(false); // Initial loading check is done
            setIsFetchingUser(false);
            return null; // Explicitly return null or handle error
        }

        setIsFetchingUser(true);
        // setError(null); // Clear previous user-specific errors before fetching
        try {
            const response = await fetch('/api/accounts/user/', { // TODO: Centralize API URLs
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    const refreshed = await attemptRefreshToken(); // Try to refresh
                    if (refreshed) {
                        const newToken = authService.getAuthToken();
                        const retryResponse = await fetch('/api/accounts/user/', {
                             headers: { 'Authorization': `Bearer ${newToken}`, 'Content-Type': 'application/json'}
                        });
                        if (!retryResponse.ok) throw new Error('Failed to fetch user details after token refresh.');
                        const refreshedUserData = await retryResponse.json();
                        setUser(refreshedUserData);
                        setIsAuthenticated(true);
                        const complete = !!(refreshedUserData.first_name && refreshedUserData.first_name.trim() !== '' &&
                                            refreshedUserData.profile && refreshedUserData.profile.age !== null && refreshedUserData.profile.age !== undefined);
                        setIsProfileComplete(complete);
                        console.log("AuthContext: User details fetched after refresh, profile complete:", complete, refreshedUserData);
                        return refreshedUserData;
                    } else {
                        logout();
                        throw new Error('Session expired. Please log in again.');
                    }
                }
                throw new Error(`Failed to fetch user details. Status: ${response.status}`);
            }

            const userData = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
            const complete = !!(userData.first_name && userData.first_name.trim() !== '' &&
                                userData.profile && userData.profile.age !== null && userData.profile.age !== undefined);
            setIsProfileComplete(complete);
            console.log("AuthContext: User details fetched, profile complete:", complete, userData);
            return userData;
        } catch (err) {
            console.error("AuthContext: Error fetching user details:", err);
            // setError(err.message); // Consider if this top-level error should be set for this
            if (!err.message.includes("refresh failed")) {
                logout(); // Log out on critical fetch failure if not already handled by refresh failure
            }
            return null; // Return null on error
        } finally {
            setIsFetchingUser(false);
            setLoading(false); // Overall initial loading sequence is complete
        }
    };

    useEffect(() => {
        // On initial load, try to fetch user details if a token exists
        // setLoading(true) is already true by default
        fetchUserDetails(); // This will also set setLoading(false) in its finally block
    }, []); // Runs once on AuthProvider mount

    const login = async (username, password) => {
        // setLoading(true); // fetchUserDetails will handle the main loading state
        setIsFetchingUser(true); // Indicate login process specifically
        setError(null);
        try {
            await authService.login(username, password); // Stores tokens
            const loggedInUser = await fetchUserDetails(); // Fetches user, sets isAuthenticated, isProfileComplete, and also setLoading/isFetchingUser
            return loggedInUser; // Return the fetched user data
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
            // Ensure states are reset on login failure
            setUser(null);
            setIsAuthenticated(false);
            setIsProfileComplete(true);
            setIsFetchingUser(false);
            setLoading(false); // Ensure loading is false
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
        setError, // Allow components to clear errors or set custom ones
        isProfileComplete,
        refreshUser: fetchUserDetails, // Expose fetchUserDetails, perhaps named refreshUser
        isFetchingUser // Expose loading state for user fetch if needed by UI
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
