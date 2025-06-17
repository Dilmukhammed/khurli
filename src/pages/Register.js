import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Placeholder for language and auth contexts
// import { useLanguage } from '../contexts/LanguageContext';
// import { useAuth } from '../contexts/AuthContext';

/**
 * Register page component for the Logiclingua platform.
 * Provides a form for new users to create an account.
 */
const Register = () => {
  // State for form inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Local state for language
  const language = localStorage.getItem('logiclingua-lang') || 'ru';

  const translations = {
    ru: {
      registerTitle: "Регистрация в Logiclingua",
      usernameLabel: "Имя пользователя",
      usernamePlaceholder: "Выберите имя пользователя",
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      passwordLabel: "Пароль",
      passwordPlaceholder: "Создайте пароль (минимум 6 символов)",
      confirmPasswordLabel: "Подтвердите пароль",
      confirmPasswordPlaceholder: "Повторите пароль",
      agreeToTermsPrefix: "Я согласен с",
      termsLink: "Условиями использования",
      agreeToTermsSuffix: " и ",
      privacyLink: "Политикой конфиденциальности",
      registerButton: "Зарегистрироваться",
      orSignUpWith: "или зарегистрироваться с помощью",
      signUpWithGoogle: "Зарегистрироваться через Google",
      alreadyHaveAccountPrompt: "Уже есть аккаунт?",
      loginLink: "Войти",
      passwordMismatchError: "Пароли не совпадают!",
    },
    en: {
      registerTitle: "Register for Logiclingua",
      usernameLabel: "Username",
      usernamePlaceholder: "Choose a username",
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Create a password (min. 6 characters)",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Repeat your password",
      agreeToTermsPrefix: "I agree to the",
      termsLink: "Terms of Service",
      agreeToTermsSuffix: " and ",
      privacyLink: "Privacy Policy",
      registerButton: "Sign up",
      orSignUpWith: "or sign up with",
      signUpWithGoogle: "Sign up with Google",
      alreadyHaveAccountPrompt: "Already have an account?",
      loginLink: "Sign in",
      passwordMismatchError: "Passwords do not match!",
    }
  };

  const t = translations[language];

  /**
   * Handles the form submission for registration.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Basic validation
    if (password !== confirmPassword) {
      setError(t.passwordMismatchError);
      return;
    }
    
    // --- Temporary Registration Simulation ---
    // In a real app, you'd call a service to register the user.
    // e.g., await register(username, email, password);
    console.log('Registering user:', { username, email });

    // On successful registration, redirect to the login page.
    navigate('/login');
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">{t.registerTitle}</h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">{t.usernameLabel}</label>
            <input type="text" name="username" id="username" required value={username} onChange={(e) => setUsername(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   placeholder={t.usernamePlaceholder} />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t.emailLabel}</label>
            <input type="email" name="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   placeholder={t.emailPlaceholder} />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t.passwordLabel}</label>
            <input type="password" name="password" id="password" required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   placeholder={t.passwordPlaceholder} />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">{t.confirmPasswordLabel}</label>
            <input type="password" name="confirm-password" id="confirm-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   placeholder={t.confirmPasswordPlaceholder} />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input id="terms" name="terms" type="checkbox" required
                     className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                {t.agreeToTermsPrefix}{' '}
                <Link to="#" className="text-indigo-600 hover:text-indigo-500">{t.termsLink}</Link>
                {' '}{t.agreeToTermsSuffix}{' '}
                <Link to="#" className="text-indigo-600 hover:text-indigo-500">{t.privacyLink}</Link>.
              </label>
            </div>
          </div>

          <div>
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300">
              {t.registerButton}
            </button>
          </div>
        </div>
      </form>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-300"></div></div>
        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">{t.orSignUpWith}</span></div>
      </div>

      <div>
        <a href="#" className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          <span className="sr-only">{t.signUpWithGoogle}</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 256S109.8 0 244 0c73 0 135.7 29.1 181.9 75.4l-74.8 67.9C324.1 116.7 287.4 96 244 96c-88.6 0-160.1 71.1-160.1 160.1 0 89.1 71.5 160.1 160.1 160.1 73.1 0 122.9-30.9 150.8-58.1 19.9-19.5 32.8-46.7 37.9-80.4H244V261.8h244z"/>
          </svg>
          <span className="ml-2">{t.signUpWithGoogle}</span>
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
