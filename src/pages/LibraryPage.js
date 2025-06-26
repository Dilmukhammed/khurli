import React, { useState, useEffect } from 'react';

/**
 * Section Component
 * Renders a titled section with a grid of items (videos, books, or articles).
 * @param {string} title - The title of the section.
 * @param {Array} items - The array of items to display.
 * @param {string} itemType - The type of items ('video', 'book', 'article').
 * @param {string} placeholder - Text to show if there are no items.
 * @param {string} language - The current display language.
 * @param {object} translations - The translation object for UI strings.
 */
const Section = ({ title, items, itemType, placeholder, language, translations }) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-300">{title}</h2>
      {items && items.length > 0 ? (
        // FIX: The entire mapping structure has been corrected to use a single, valid grid layout.
        // All invalid </li>, </ul>, duplicate blocks, and extra </div> tags have been removed.
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
              {/* Top part of the card: title and media */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-700 mb-3 min-h-[3.5em]">{item.title[language] || item.title['en']}</h3>
                {itemType === 'video' && item.youtubeId && (
                  // IMPROVEMENT: Replaced deprecated aspect-ratio classes with the modern 'aspect-video'.
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${item.youtubeId}`}
                      title={item.title[language] || item.title['en']}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                )}
              </div>

              {/* Bottom part of the card: action button */}
              {(itemType === 'book' || itemType === 'article') && item.pdfUrl && (
                <a
                  href={item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-md text-center transition-colors duration-300"
                >
                  {/* IMPROVEMENT: Using the translations object for a more scalable i18n approach. */}
                  {translations.openPdf}
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">{placeholder}</p>
      )}
    </section>
  );
};


const LibraryPage = () => {
  // Use state to hold the language, making the component reactive to changes.
  const [language, setLanguage] = useState('ru');

  // On component mount, get the language from localStorage.
  useEffect(() => {
    const storedLang = localStorage.getItem('logiclingua-lang');
    if (storedLang) {
      setLanguage(storedLang);
    }
  }, []); // Empty dependency array ensures this runs only once on mount.


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
      openPdf: "Открыть PDF",
    },
    en: {
      title: "Library",
      videosTitle: "Videos",
      videosPlaceholder: "No videos added yet.",
      booksTitle: "Books",
      booksPlaceholder: "No books added yet.",
      articlesTitle: "Articles",
      articlesPlaceholder: "No articles added yet.",
      openPdf: "Open PDF",
    }
  };

  // Select the correct translation object based on the current language
  const t = translations[language] || translations.en; // Fallback to English

  // Sample Data (This could come from an API in a real application)
  const sampleVideos = [
    { id: 'vid1', title: { en: 'Introduction to Critical Thinking', ru: 'Введение в критическое мышление' }, youtubeId: '6OLPL5p0fMg' },
    { id: 'vid2', title: { en: '5 Tips to Improve Your Critical Thinking', ru: '5 советов, как улучшить критическое мышление' }, youtubeId: 'J0yEAE5owWw' },
  ];

  const sampleBooks = [
    { id: 'book1', title: { en: 'The Art of Thinking Clearly', ru: 'Искусство ясно мыслить' }, pdfUrl: '/path/to/book1.pdf' },
    { id: 'book2', title: { en: 'Thinking, Fast and Slow', ru: 'Думай медленно... решай быстро' }, pdfUrl: '/path/to/book2.pdf' },
  ];

  const sampleArticles = [
    { id: 'art1', title: { en: 'How to Spot Fake News', ru: 'Как распознать фейковые новости' }, pdfUrl: '/path/to/article1.pdf' },
    { id: 'art2', title: { en: 'The Impact of Social Media on Information', ru: 'Влияние социальных сетей на информацию' }, pdfUrl: '/path/to/article2.pdf' },
  ];


  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">{t.title}</h1>
        </header>

        <main className="space-y-16">
          <Section
            title={t.videosTitle}
            items={sampleVideos}
            itemType="video"
            placeholder={t.videosPlaceholder}
            language={language}
            translations={t}
          />
          <Section
            title={t.booksTitle}
            items={sampleBooks}
            itemType="book"
            placeholder={t.booksPlaceholder}
            language={language}
            translations={t}
          />
          <Section
            title={t.articlesTitle}
            items={sampleArticles}
            itemType="article"
            placeholder={t.articlesPlaceholder}
            language={language}
            translations={t}
          />
        </main>
      </div>
    </div>
  );
};

export default LibraryPage;
