import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // To check if user is authenticated
import authService from '../services/authService'; // Import authService

const CompleteProfilePage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth(); // Get user to prefill email if desired, and check auth

    useEffect(() => {
        // Redirect to login if not authenticated and no user object (e.g. direct navigation to this page)
        // Or if user has already completed this step (how to check this? - future enhancement)
        if (!isAuthenticated) {
            // navigate('/login'); // Or handle as an error/message
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!firstName.trim() || !lastName.trim()) {
            setError('First name and last name are required.');
            setLoading(false);
            return;
        }
        if (age && (isNaN(parseInt(age, 10)) || parseInt(age, 10) <= 0 || parseInt(age, 10) > 150)) {
            setError('Please enter a valid age (must be a positive number).');
            setLoading(false);
            return;
        }

        console.log('Submitting profile:', { firstName, lastName, age: age ? parseInt(age, 10) : null });
        try {
            await authService.updateProfileDetails({
                first_name: firstName,
                last_name: lastName,
                age: age ? parseInt(age, 10) : null
            });
            // Optional: Update AuthContext if it stores these details
            // Example: user.firstName = firstName; (this depends on AuthContext structure)
            // authContext.setUser({...authContext.user, firstName, lastName }); // If context has a setUser

            navigate('/account'); // Or to homepage, or wherever appropriate after profile completion
        } catch (err) {
            setError(err.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Simple translations (can be expanded or moved to i18n system)
    const t = {
        title: "Complete Your Profile",
        subtitle: "Please provide a few more details to complete your registration.",
        firstNameLabel: "First Name",
        firstNamePlaceholder: "Enter your first name",
        lastNameLabel: "Last Name",
        lastNamePlaceholder: "Enter your last name",
        ageLabel: "Age (Optional)",
        agePlaceholder: "Enter your age",
        submitButton: "Save Profile",
        loadingButton: "Saving...",
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {t.title}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {t.subtitle}
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

                    <div>
                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                            {t.firstNameLabel}
                        </label>
                        <div className="mt-1">
                            <input
                                id="first-name"
                                name="first-name"
                                type="text"
                                autoComplete="given-name"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder={t.firstNamePlaceholder}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                            {t.lastNameLabel}
                        </label>
                        <div className="mt-1">
                            <input
                                id="last-name"
                                name="last-name"
                                type="text"
                                autoComplete="family-name"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder={t.lastNamePlaceholder}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                            {t.ageLabel}
                        </label>
                        <div className="mt-1">
                            <input
                                id="age"
                                name="age"
                                type="number"
                                autoComplete="age"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder={t.agePlaceholder}
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                min="1" // HTML5 validation
                                max="150" // HTML5 validation
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {loading ? t.loadingButton : t.submitButton}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfilePage;
