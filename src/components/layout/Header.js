import React, { useState } from 'react'; // Removed useEffect as it's handled by AuthContext
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import { useLanguage } from '../../contexts/LanguageContext'; // Assuming this context exists and works

const Header = () => {
  const { isAuthenticated, logout, loading: authLoading } = useAuth(); // Get auth state and functions
  const navigate = useNavigate();
  const location = useLocation();

  // Language state - assuming useLanguage context handles its own state and translations
  // If useLanguage is not fully implemented, this might need adjustment
  const { language, setLanguage, translations } = useLanguage();

  // Fallback translations if LanguageContext is not providing them
  const defaultTranslations = {
    ru: {
      navAllModules: "Все модули",
      navGamesHub: "Центр Игр",
      navAccount: "Личный кабинет",
      navLogin: "Войти",
      navRegister: "Регистрация",
      navLogout: "Выйти",
    },
    en: {
      navAllModules: "All Modules",
      navGamesHub: "Games Hub",
      navAccount: "Personal Account",
      navLogin: "Login",
      navRegister: "Register",
      navLogout: "Logout",
    }
  };
  const t = translations && translations[language] ? translations[language] : defaultTranslations[language] || defaultTranslations['en'];


  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    if (setLanguage) {
      setLanguage(newLang); // From LanguageContext
    }
    // The LanguageContext should handle persistence and propagation.
    // window.location.reload(); // Avoid reload if context handles it
  };

  const handleLogout = () => {
    logout(); // Call logout from AuthContext
    navigate('/login'); // Redirect to login page
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

  // Do not render header content if auth is still loading, or handle appropriately
  if (authLoading) {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-indigo-600">Logiclingua</Link>
                <div>Loading...</div>
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
          
          {isAuthenticated && ( // Use isAuthenticated from AuthContext
            <NavLink to="/account">{t.navAccount}</NavLink>
          )}

          <div className="relative ml-4">
            <select 
              id="language-selector" 
              value={language} // from LanguageContext
              onChange={handleLanguageChange}
              className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
              style={{ appearance: 'none', backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '0.65em auto', paddingRight: '2rem' }}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>

          {isAuthenticated ? ( // Use isAuthenticated from AuthContext
            <button
              onClick={handleLogout} // Use updated handleLogout
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
