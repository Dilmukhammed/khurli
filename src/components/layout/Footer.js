import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder for language context/hook
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Footer component for the Logiclingua platform.
 * Contains copyright information and links to legal pages.
 */
const Footer = () => {
  // Local state for language. Later, this will come from a global context.
  const language = localStorage.getItem('logiclingua-lang') || 'ru';

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

  const t = translations[language];

  return (
    <footer className="bg-gray-800 text-white mt-auto">
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
