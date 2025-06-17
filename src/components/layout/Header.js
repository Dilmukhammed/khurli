import React, { useState, useEffect } from 'react'; // Added useEffect back
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Local state for language and translations, reverting useLanguage
  const [language, setLanguage] = useState(localStorage.getItem('logiclingua-lang') || 'en'); // Default to 'en'

  const translations = {
    ru: {
      navAllModules: "Все модули",
      navGamesHub: "Центр Игр",
      navAccount: "Личный кабинет",
      navLogin: "Войти",
      navRegister: "Регистрация",
      navLogout: "Выйти",
      loading: "Загрузка..."
    },
    en: {
      navAllModules: "All Modules",
      navGamesHub: "Games Hub",
      navAccount: "Personal Account",
      navLogin: "Login",
      navRegister: "Register",
      navLogout: "Logout",
      loading: "Loading..."
    }
  };

  const t = translations[language] || translations['en']; // Fallback to 'en' if language not found

  useEffect(() => {
    // This effect could be used to set document lang or other side effects if needed
    document.documentElement.lang = language;
  }, [language]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    localStorage.setItem('logiclingua-lang', newLang);
    // Simple reload to apply language change globally if other components also use localStorage
    // A more sophisticated solution would involve a proper context or state management
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        location.pathname === to 
        ? 'text-indigo-600 bg-indigo-50' 
        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  );

  if (authLoading) {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-indigo-600">Logiclingua</Link>
                <div>{t.loading}</div>
            </nav>
        </header>
    );
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          Logiclingua
        </Link>
        <div className="flex items-center space-x-2">
          <NavLink to="/modules">{t.navAllModules}</NavLink>
          <NavLink to="/games">{t.navGamesHub}</NavLink>
          
          {isAuthenticated && (
            <NavLink to="/account">{t.navAccount}</NavLink>
          )}

          <div className="relative ml-4">
            <select 
              id="language-selector" 
              value={language}
              onChange={handleLanguageChange}
              className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
              style={{ appearance: 'none', backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '0.65em auto', paddingRight: '2rem' }}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              {t.navLogout}
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                {t.navLogin}
              </Link>
              <Link
                to="/register"
                className="ml-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                {t.navRegister}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
