import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

// Placeholder for language context
// import { useLanguage } from '../contexts/LanguageContext';

const Register = () => {
  const [firstName, setFirstName] = useState(''); // Added
  const [lastName, setLastName] = useState(''); // Added
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [error, setError] = useState(''); // Error state will come from AuthContext

  const navigate = useNavigate();
  const { register, loading, error: authError } = useAuth(); // Get register function and states from AuthContext

  // Local state for language (remains for now)
  const language = localStorage.getItem('logiclingua-lang') || 'ru';
  const translations = {
    ru: {
      registerTitle: "Регистрация в Logiclingua",
      firstNameLabel: "Имя", // Added
      firstNamePlaceholder: "Введите ваше имя", // Added
      lastNameLabel: "Фамилия", // Added
      lastNamePlaceholder: "Введите вашу фамилию", // Added
      usernameLabel: "Имя пользователя",
      usernamePlaceholder: "Выберите имя пользователя",
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      passwordLabel: "Пароль",
      passwordPlaceholder: "Создайте пароль",
      confirmPasswordLabel: "Подтвердите пароль",
      confirmPasswordPlaceholder: "Повторите пароль",
      registerButton: "Зарегистрироваться",
      alreadyHaveAccountPrompt: "Уже есть аккаунт?",
      loginLink: "Войти",
      passwordMismatchError: "Пароли не совпадают!",
      registrationSuccess: "Регистрация прошла успешно! Пожалуйста, войдите.",
      // Terms and privacy links can be added if needed
    },
    en: {
      registerTitle: "Register for Logiclingua",
      firstNameLabel: "First Name", // Added
      firstNamePlaceholder: "Enter your first name", // Added
      lastNameLabel: "Last Name", // Added
      lastNamePlaceholder: "Enter your last name", // Added
      usernameLabel: "Username",
      usernamePlaceholder: "Choose a username",
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Create a password",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Repeat your password",
      registerButton: "Sign up",
      alreadyHaveAccountPrompt: "Already have an account?",
      loginLink: "Sign in",
      passwordMismatchError: "Passwords do not match!",
      registrationSuccess: "Registration successful! Please sign in.",
    }
  };
  const t = translations[language];
  const [formError, setFormError] = useState(''); // For client-side validation like password mismatch
  const [registrationMessage, setRegistrationMessage] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setRegistrationMessage('');

    if (password !== confirmPassword) {
      setFormError(t.passwordMismatchError);
      return;
    }

    try {
      await register(firstName, lastName, username, email, password, confirmPassword); // Use confirmPassword as password2. Added firstName, lastName
      setRegistrationMessage(t.registrationSuccess);
      // Clear form fields
      setFirstName(''); // Added
      setLastName(''); // Added
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // navigate('/login'); // Optionally navigate, or let user see success message
    } catch (err) {
      // AuthContext's error state (authError) will be updated by the context itself.
      // We can also set local formError if needed, or rely on authError.
      // The error from authService is re-thrown, so it's caught here.
      // authError will be displayed below. If err.message is more specific, use it.
      setFormError(err.message || 'Registration failed.');
      console.error('Registration handleSubmit error:', err);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">{t.registerTitle}</h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">{t.firstNameLabel}</label>
            <input type="text" name="firstName" id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   placeholder={t.firstNamePlaceholder} disabled={loading} />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">{t.lastNameLabel}</label>
            <input type="text" name="lastName" id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   placeholder={t.lastNamePlaceholder} disabled={loading} />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">{t.usernameLabel}</label>
            <input type="text" name="username" id="username" required value={username} onChange={(e) => setUsername(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   placeholder={t.usernamePlaceholder} disabled={loading} />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t.emailLabel}</label>
            <input type="email" name="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   placeholder={t.emailPlaceholder} disabled={loading} />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t.passwordLabel}</label>
            <input type="password" name="password" id="password" required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   placeholder={t.passwordPlaceholder} disabled={loading} />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">{t.confirmPasswordLabel}</label>
            <input type="password" name="confirm-password" id="confirm-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   placeholder={t.confirmPasswordPlaceholder} disabled={loading} />
          </div>

          {/* Display form-specific errors first, then auth errors */}
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          {authError && !formError && <p className="text-sm text-red-600">{authError}</p>}
          {registrationMessage && <p className="text-sm text-green-600">{registrationMessage}</p>}

          {/* Simplified terms agreement for now */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input id="terms" name="terms" type="checkbox" required
                     className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" disabled={loading} />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                I agree to the terms and policy.
              </label>
            </div>
          </div>

          <div>
            <button type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 disabled:opacity-50"
                    disabled={loading}>
              {loading ? 'Signing up...' : t.registerButton}
            </button>
          </div>
        </div>
      </form>
      
      {/* Social signup and login link can remain as is for now */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-300"></div></div>
        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">or</span></div>
      </div>
      <div>
        <a href="#" className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          <span className="sr-only">Sign up with Google</span>
          <svg className="w-5 h-5" /* ... SVG path ... */ fill="currentColor" viewBox="0 0 488 512"><path d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 256S109.8 0 244 0c73 0 135.7 29.1 181.9 75.4l-74.8 67.9C324.1 116.7 287.4 96 244 96c-88.6 0-160.1 71.1-160.1 160.1 0 89.1 71.5 160.1 160.1 160.1 73.1 0 122.9-30.9 150.8-58.1 19.9-19.5 32.8-46.7 37.9-80.4H244V261.8h244z"></path></svg>
          <span className="ml-2">Sign up with Google</span>
        </a>
      </div>
      <p className="mt-6 text-center text-sm text-gray-600">
        {t.alreadyHaveAccountPrompt}{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          {t.loginLink}
        </Link>
      </p>
    </div>
  );
};

export default Register;
