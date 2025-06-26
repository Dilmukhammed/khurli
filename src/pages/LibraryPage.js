import React, { useState, useEffect } from 'react';

/**
 * Section Component
 * Renders a titled section with a grid of items (videos, books, or articles).
 * @param {string} title - The title of the section.
 * @param {Array} items - The array of items to display.
 * @param {string} itemType - The type of items ('video', 'book', 'article').
 * @param {string} placeholder - Text to show if there are no items.
 * @param {string} language - The current display language.
 * @param {object} translations - The translation object for UI strings (specifically for openPdf).
 */
const Section = ({ title, items, itemType, placeholder, language, translations }) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-300">{title}</h2>
      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
              {/* Top part of the card: title and media */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-700 mb-3 min-h-[3.5em]">
                  {item.title[language] || item.title['en']}
                </h3>
                {itemType === 'video' && item.youtubeId && (
                  <div className="aspect-video rounded-lg overflow-hidden"> {/* Modern aspect-ratio class */}
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
                  {translations.openPdf} {/* Using the passed translations object */}
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
  const [language, setLanguage] = useState('ru'); // Default language

  useEffect(() => {
    const storedLang = localStorage.getItem('logiclingua-lang');
    if (storedLang) {
      setLanguage(storedLang);
    }
  }, []);


  // Define translations
  const i18n = { // Renamed to avoid conflict with 'translations' prop name in Section
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
  const t = i18n[language] || i18n.en; // Fallback to English

  // Sample Data (This could come from an API in a real application)
  const sampleVideos = [
    { id: 'vid1', title: { en: 'Casually Explained: Critical Thinking', ru: 'Критическое мышление: Объяснение простыми словами' }, youtubeId: 'qMrnVkDH2Ak' },
    { id: 'vid2', title: { en: 'Critical thinking at the heart of Gen AI literacy', ru: 'Критическое мышление как ключевой навык для освоения генеративного ИИ' }, youtubeId: 'yr0-RLGZshg' },
    { id: 'vid3', title: { en: 'How to Improve Your Critical Thinking Skills', ru: 'Как улучшить свои навыки критического мышления' }, youtubeId: 'JOFrjc6u47U' },
    { id: 'vid4', title: { en: 'Five simple strategies to sharpen your critical thinking | BBC Ideas', ru: 'Пять простых стратегий для развития критического мышления | BBC Ideas' }, youtubeId: 'NHjgKe7JMNE' },
    { id: 'vid5', title: { en: 'A neuroscientist’s guide to reclaiming your brain | Nicole Vignola', ru: 'Руководство нейробиолога: Как вернуть контроль над своим мозгом | Николь Виньола' }, youtubeId: 'tcbxIoERm6w' },
  ];

  const sampleBooks = [
    // Using placeholder URLs for now, will be replaced by API data
    { id: 'book1', title: { en: 'The Art of Thinking Clearly', ru: 'Искусство ясно мыслить' }, pdfUrl: '#' },
    { id: 'book2', title: { en: 'Thinking, Fast and Slow', ru: 'Думай медленно... решай быстро' }, pdfUrl: '#' },
  ];

  const sampleArticles = [
    { id: 'art1', title: { en: 'How to Spot Fake News', ru: 'Как распознать фейковые новости' }, pdfUrl: '#' },
    { id: 'art2', title: { en: 'The Impact of Social Media on Information', ru: 'Влияние социальных сетей на информацию' }, pdfUrl: '#' },
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
            translations={t} // Pass the 't' object which contains 'openPdf'
          />
          <Section
            title={t.booksTitle}
            items={sampleBooks}
            itemType="book"
            placeholder={t.booksPlaceholder}
            language={language}
            translations={t} // Pass the 't' object
          />
          <Section
            title={t.articlesTitle}
            items={sampleArticles}
            itemType="article"
            placeholder={t.articlesPlaceholder}
            language={language}
            translations={t} // Pass the 't' object
          />
        </main>
      </div>
    </div>
  );
};

export default LibraryPage;
