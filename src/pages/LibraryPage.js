import React, { useState, useEffect } from 'react';

// Define the API base URL (make sure this matches your Django backend URL)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

/**
 * Section Component
 * Renders a titled section with a grid of items (videos, books, or articles).
 */
const Section = ({ title, items, itemType, placeholder, language, translations, isLoading, error }) => {
  if (isLoading) {
    placeholder = language === 'ru' ? translations.loading : translations.loading;
  } else if (error) {
    placeholder = language === 'ru' ? `${translations.fetchError} ${error}` : `${translations.fetchError} ${error}`;
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-300">{title}</h2>
      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              {/* Image container for books and articles */}
              {(itemType === 'book' || itemType === 'article') && (
                item.cover_image_url ? (
                  <img
                    src={item.cover_image_url}
                    alt={`${item.title} cover`}
                    className="w-full h-48 object-cover rounded-t-lg" // Fixed height, object-cover
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      {translations.noCover}
                    </span>
                  </div>
                )
              )}

              {/* Video container */}
              {itemType === 'video' && item.youtubeId && (
                <div className="aspect-video rounded-t-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${item.youtubeId}`}
                    title={item.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              )}

              {/* Content below image/video */}
              <div className="p-4 flex flex-col flex-grow"> {/* main content area of the card */}
                <h3 className="text-lg font-semibold text-indigo-700 mb-3 min-h-[3.5em]"> {/* Title area, allow it to grow if text wraps */}
                  {item.title}
                </h3>
                {/* Button pushed to the bottom of the card */}
                {(itemType === 'book' || itemType === 'article') && item.file_url && (
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full mt-auto bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-md text-center transition-colors duration-300"
                  >
                    {translations.openPdf}
                  </a>
                )}
              </div>
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
  const [language, setLanguage] = useState('ru');

  const [books, setBooks] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [error, setError] = useState(null); // Shared error state for simplicity

  useEffect(() => {
    const storedLang = localStorage.getItem('logiclingua-lang');
    if (storedLang) {
      setLanguage(storedLang);
    }

    const fetchLibraryData = async () => {
      // Fetch Books
      try {
        setLoadingBooks(true);
        const booksResponse = await fetch(`${API_BASE_URL}/api/library/books/`);
        if (!booksResponse.ok) {
          throw new Error(`Failed to fetch books: ${booksResponse.statusText} (${booksResponse.status})`);
        }
        const booksData = await booksResponse.json();
        setBooks(booksData.results || booksData);
        setLoadingBooks(false);
      } catch (err) {
        console.error(err);
        setError(prevError => prevError ? `${prevError}\n${err.message}` : err.message);
        setLoadingBooks(false);
      }

      // Fetch Articles
      try {
        setLoadingArticles(true);
        const articlesResponse = await fetch(`${API_BASE_URL}/api/library/articles/`);
        if (!articlesResponse.ok) {
          throw new Error(`Failed to fetch articles: ${articlesResponse.statusText} (${articlesResponse.status})`);
        }
        const articlesData = await articlesResponse.json();
        setArticles(articlesData.results || articlesData);
        setLoadingArticles(false);
      } catch (err) {
        console.error(err);
        setError(prevError => prevError ? `${prevError}\n${err.message}` : err.message);
        setLoadingArticles(false);
      }
    };

    fetchLibraryData();
  }, []);

  const i18n = {
    ru: {
      title: "Библиотека",
      videosTitle: "Видео",
      videosPlaceholder: "Видео пока не добавлены.",
      booksTitle: "Книги",
      booksPlaceholder: "Книги не найдены.",
      articlesTitle: "Статьи",
      articlesPlaceholder: "Статьи не найдены.",
      openPdf: "Открыть PDF",
      loading: "Загрузка...",
      fetchError: "Ошибка загрузки:",
      noCover: "Нет обложки",
    },
    en: {
      title: "Library",
      videosTitle: "Videos",
      videosPlaceholder: "No videos added yet.",
      booksTitle: "Books",
      booksPlaceholder: "No books found.",
      articlesTitle: "Articles",
      articlesPlaceholder: "No articles found.",
      openPdf: "Open PDF",
      loading: "Loading...",
      fetchError: "Failed to load:",
      noCover: "No Cover",
    }
  };

  const t = i18n[language] || i18n.en;

  const sampleVideos = [
    { id: 'vid1', title: { en: 'Casually Explained: Critical Thinking', ru: 'Критическое мышление: Объяснение простыми словами' }, youtubeId: 'qMrnVkDH2Ak' },
    { id: 'vid2', title: { en: 'Critical thinking at the heart of Gen AI literacy', ru: 'Критическое мышление как ключевой навык для освоения генеративного ИИ' }, youtubeId: 'yr0-RLGZshg' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">{t.title}</h1>
        </header>

        {error && (
          <div className="mb-8 p-4 text-center text-red-700 bg-red-100 rounded-md whitespace-pre-line">
            {`${t.fetchError}\n${error}`}
          </div>
        )}

        <main className="space-y-16">
          <Section
            title={t.videosTitle}
            items={sampleVideos.map(video => ({
                ...video,
                title: video.title[language] || video.title['en']
            }))}
            itemType="video"
            placeholder={t.videosPlaceholder}
            language={language}
            translations={t}
            isLoading={false}
            error={null}
          />
          <Section
            title={t.booksTitle}
            items={books}
            itemType="book"
            placeholder={t.booksPlaceholder}
            language={language}
            translations={t}
            isLoading={loadingBooks}
            error={loadingBooks && error ? error : null}
          />
          <Section
            title={t.articlesTitle}
            items={articles}
            itemType="article"
            placeholder={t.articlesPlaceholder}
            language={language}
            translations={t}
            isLoading={loadingArticles}
            error={loadingArticles && error ? error : null}
          />
        </main>
      </div>
    </div>
  );
};

export default LibraryPage;
