import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Placeholder for language and auth contexts
// import { useLanguage } from '../contexts/LanguageContext';
// import { useAuth } from '../contexts/AuthContext';

/**
 * Login page component for the Logiclingua platform.
 * Provides a form for users to sign in.
 */
const Login = () => {
  // Local state for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Hook for programmatic navigation
  const navigate = useNavigate();
  
  // Placeholder for a real authentication hook/context
  // const { login } = useAuth(); 

  // Local state for language. Later, this will come from a global context.
  const language = localStorage.getItem('logiclingua-lang') || 'ru';

  const translations = {
    ru: {
      loginTitle: "Вход в Logiclingua",
      emailLabel: "Email или Имя пользователя",
      emailPlaceholder: "your@email.com или username",
      passwordLabel: "Пароль",
      passwordPlaceholder: "Ваш пароль",
      rememberMeLabel: "Запомнить меня",
      forgotPasswordLink: "Забыли пароль?",
      loginButton: "Войти",
      orSignInWith: "или войти с помощью",
      signInWithGoogle: "Войти через Google",
      noAccountPrompt: "Нет аккаунта?",
      registerLink: "Зарегистрироваться",
    },
    en: {
      loginTitle: "Login to Logiclingua",
      emailLabel: "Email or Username",
      emailPlaceholder: "your@email.com or username",
      passwordLabel: "Password",
      passwordPlaceholder: "Your password",
      rememberMeLabel: "Remember me",
      forgotPasswordLink: "Forgot your password?",
      loginButton: "Sign in",
      orSignInWith: "or sign in with",
      signInWithGoogle: "Sign in with Google",
      noAccountPrompt: "Don't have an account?",
      registerLink: "Sign up",
    }
  };

  const t = translations[language];
  
  /**
   * Handles the form submission for logging in.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // --- Temporary Login Simulation ---
    // In a real application, you would call an authentication service here.
    // e.g., await login(email, password);
    console.log('Attempting login with:', { email, password });
    
    // For now, we'll just simulate a successful login.
    localStorage.setItem('userLoggedIn', 'true');
    
    // Redirect to the personal account page after successful "login".
    navigate('/account');
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">{t.loginTitle}</h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t.emailLabel}
            </label>
            <input
              type="text"
              name="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={t.emailPlaceholder}
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
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
            >
              {t.loginButton}
            </button>
          </div>
        </div>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">{t.orSignInWith}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <a href="#" className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span className="sr-only">{t.signInWithGoogle}</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 256S109.8 0 244 0c73 0 135.7 29.1 181.9 75.4l-74.8 67.9C324.1 116.7 287.4 96 244 96c-88.6 0-160.1 71.1-160.1 160.1 0 89.1 71.5 160.1 160.1 160.1 73.1 0 122.9-30.9 150.8-58.1 19.9-19.5 32.8-46.7 37.9-80.4H244V261.8h244z"/>
            </svg>
            <span className="ml-2">{t.signInWithGoogle}</span>
          </a>
        </div>
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

