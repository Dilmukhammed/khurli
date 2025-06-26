import React from 'react';

const LibraryPage = () => {
  // Determine language from localStorage, defaulting to 'ru'
  const language = localStorage.getItem('logiclingua-lang') || 'ru';

  // Define translations
  const translations = {
    ru: {
      title: "Библиотека",
      comingSoon: "Скоро здесь будет ваша библиотека!",
    },
    en: {
      title: "Library",
      comingSoon: "Your library will be here soon!",
    }
  };

  // Select the correct translation based on the current language
  const t = translations[language] || translations.en; // Fallback to English

  return (
    <div className="container mx-auto px-6 py-12 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{t.title}</h1>
      <p className="text-lg text-gray-600">{t.comingSoon}</p>
    </div>
  );
};

export default LibraryPage;
