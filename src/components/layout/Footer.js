import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { Link } from 'react-router-dom';

// Removed: import { useLanguage } from '../../contexts/LanguageContext';

const Footer = () => {
  // Local state for language, reverting useLanguage
  const [language, setLanguage] = useState(localStorage.getItem('logiclingua-lang') || 'en'); // Default to 'en'

  const translations = {
    ru: {
      footerRights: "© 2025 Logiclingua. Все права защищены.",
      footerPrivacy: "Политика конфиденциальности",
      footerTerms: "Условия использования",
    },
    en: {
      footerRights: "© 2025 Logiclingua. All rights reserved.",
      footerPrivacy: "Privacy Policy",
      footerTerms: "Terms of Use",
    }
  };

  // Fallback to 'en' if the stored language is not in translations
  const t = translations[language] || translations['en'];

  useEffect(() => {
    // Optional: could be used for other language-specific side effects if needed in future
    // For now, this just mirrors the setup in the fixed Header.js
  }, [language]);

  // Note: A language switcher is not typically in the footer.
  // If one were needed, handleLanguageChange from Header.js could be adapted.

  return (
    <footer className="bg-gray-800 text-white mt-auto"> {/* mt-auto helps ensure it's at the bottom if content is short */}
      <div className="container mx-auto px-6 py-8 text-center">
        <p dangerouslySetInnerHTML={{ __html: t.footerRights }} />
        <div className="mt-4">
          <Link to="/privacy-policy" className="text-gray-400 hover:text-white px-3">
            {t.footerPrivacy}
          </Link>
          <span className="text-gray-500">|</span>
          <Link to="/terms-of-use" className="text-gray-400 hover:text-white px-3">
            {t.footerTerms}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
