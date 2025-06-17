import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

// Placeholder for language context
// import { useLanguage } from '../contexts/LanguageContext';

const Login = () => {
  const [username, setUsername] = useState(''); // Changed from email to username
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error: authError, isAuthenticated } = useAuth();

  // Local state for language (remains for now)
  const language = localStorage.getItem('logiclingua-lang') || 'ru';
  const translations = {
    ru: {
      loginTitle: "Вход в Logiclingua",
      usernameLabel: "Имя пользователя", // Updated label for clarity, though input can be username
      usernamePlaceholder: "Введите ваше имя пользователя",
      passwordLabel: "Пароль",
      passwordPlaceholder: "Ваш пароль",
      rememberMeLabel: "Запомнить меня",
      forgotPasswordLink: "Забыли пароль?",
      loginButton: "Войти",
      orSignInWith: "или войти с помощью",
      signInWithGoogle: "Войти через Google",
      noAccountPrompt: "Нет аккаунта?",
      registerLink: "Зарегистрироваться",
      loginFailed: "Не удалось войти. Проверьте имя пользователя и пароль."
    },
    en: {
      loginTitle: "Login to Logiclingua",
      usernameLabel: "Username", // Updated label
      usernamePlaceholder: "Enter your username",
      passwordLabel: "Password",
      passwordPlaceholder: "Your password",
      rememberMeLabel: "Remember me",
      forgotPasswordLink: "Forgot your password?",
      loginButton: "Sign in",
      orSignInWith: "or sign in with",
      signInWithGoogle: "Sign in with Google",
      noAccountPrompt: "Don't have an account?",
      registerLink: "Sign up",
      loginFailed: "Login failed. Please check your username and password."
    }
  };
  const t = translations[language];
  const [formError, setFormError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/account'; // Redirect to previous page or account
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await login(username, password);
      // Navigation is handled by the useEffect hook above
    } catch (err) {
      // AuthContext's error state (authError) will be updated.
      // We can set a local formError if we want to display it differently or add more info.
      // Using a generic message here, authError from context will be displayed by default.
      setFormError(t.loginFailed);
      console.error('Login handleSubmit error:', err);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">{t.loginTitle}</h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              {t.usernameLabel}
            </label>
            <input
              type="text" // Keep as text, can be username
              name="username"
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={t.usernamePlaceholder}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t.passwordLabel}
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={t.passwordPlaceholder}
              disabled={loading}
            />
          </div>

          {/* Display form-specific errors or auth errors */}
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          {authError && !formError && <p className="text-sm text-red-600">{authError}</p>}


          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                {t.rememberMeLabel}
              </label>
            </div>
            <div className="text-sm">
              <Link to="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                {t.forgotPasswordLink}
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Signing in...' : t.loginButton}
            </button>
          </div>
        </div>
      </form>

      {/* Social sign in and register link can remain as is */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-300"></div></div>
        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">or</span></div>
      </div>
      <div>
        <a href="#" className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          <span className="sr-only">Sign in with Google</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 488 512"><path d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 256S109.8 0 244 0c73 0 135.7 29.1 181.9 75.4l-74.8 67.9C324.1 116.7 287.4 96 244 96c-88.6 0-160.1 71.1-160.1 160.1 0 89.1 71.5 160.1 160.1 160.1 73.1 0 122.9-30.9 150.8-58.1 19.9-19.5 32.8-46.7 37.9-80.4H244V261.8h244z"></path></svg>
          <span className="ml-2">Sign in with Google</span>
        </a>
      </div>
      <p className="mt-6 text-center text-sm text-gray-600">
        {t.noAccountPrompt}{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          {t.registerLink}
        </Link>
      </p>
    </div>
  );
};

export default Login;
