import React from 'react';

const LibraryPage = () => {
  // Determine language from localStorage, defaulting to 'ru'
  const language = localStorage.getItem('logiclingua-lang') || 'ru';

  // Define translations
  const translations = {
    ru: {
      title: "Библиотека",
      videosTitle: "Видео",
      videosPlaceholder: "Видео пока не добавлены.",
      booksTitle: "Книги",
      booksPlaceholder: "Книги пока не добавлены.",
      articlesTitle: "Статьи",
      articlesPlaceholder: "Статьи пока не добавлены.",
    },
    en: {
      title: "Library",
      videosTitle: "Videos",
      videosPlaceholder: "No videos added yet.",
      booksTitle: "Books",
      booksPlaceholder: "No books added yet.",
      articlesTitle: "Articles",
      articlesPlaceholder: "No articles added yet.",
    }
  };

  // Select the correct translation based on the current language
  const t = translations[language] || translations.en; // Fallback to English

  const Section = ({ title, placeholder }) => (
    <section className="mb-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">{title}</h2>
      <p className="text-gray-600">{placeholder}</p>
      {/* Future content for this section will go here */}
    </section>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">{t.title}</h1>
      </header>

      <div className="space-y-10">
        <Section title={t.videosTitle} placeholder={t.videosPlaceholder} />
        <Section title={t.booksTitle} placeholder={t.booksPlaceholder} />
        <Section title={t.articlesTitle} placeholder={t.articlesPlaceholder} />
      </div>
    </div>
  );
};

export default LibraryPage;
