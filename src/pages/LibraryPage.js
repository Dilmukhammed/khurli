import React, { useState, useEffect } from 'react';

// Define the API base URL (make sure this matches your Django backend URL)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

/**
 * Section Component
 * Renders a titled section with a grid of items (videos, books, or articles).
 */
const Section = ({ title, items, itemType, placeholder, language, translations, isLoading, error }) => {
  if (isLoading) {
    placeholder = language === 'ru' ? 'Загрузка...' : 'Loading...';
  } else if (error) {
    placeholder = language === 'ru' ? `Ошибка: ${error}` : `Error: ${error}`;
  }


  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-300">{title}</h2>
      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-indigo-700 mb-3 min-h-[3.5em]">
                  {/* Assuming item.title is now a simple string from API, not an object */}
                  {item.title}
                </h3>
                {itemType === 'video' && item.youtubeId && (
                  <div className="aspect-video rounded-lg overflow-hidden">
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
              </div>
              {(itemType === 'book' || itemType === 'article') && item.file_url && (
                <a
                  href={item.file_url} // Use file_url from API
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-md text-center transition-colors duration-300"
                >
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
  const [language, setLanguage] = useState('ru');

  const [books, setBooks] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedLang = localStorage.getItem('logiclingua-lang');
    if (storedLang) {
      setLanguage(storedLang);
    }

    const fetchLibraryData = async () => {
      try {
        // Fetch Books
        setLoadingBooks(true);
        const booksResponse = await fetch(`${API_BASE_URL}/api/library/books/`);
        if (!booksResponse.ok) {
          throw new Error(`Failed to fetch books: ${booksResponse.statusText} (${booksResponse.status})`);
        }
        const booksData = await booksResponse.json();
        setBooks(booksData.results || booksData); // Handle pagination if DRF default is used
        setLoadingBooks(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoadingBooks(false);
      }

      try {
        // Fetch Articles
        setLoadingArticles(true);
        const articlesResponse = await fetch(`${API_BASE_URL}/api/library/articles/`);
        if (!articlesResponse.ok) {
          throw new Error(`Failed to fetch articles: ${articlesResponse.statusText} (${articlesResponse.status})`);
        }
        const articlesData = await articlesResponse.json();
        setArticles(articlesData.results || articlesData); // Handle pagination
        setLoadingArticles(false);
      } catch (err) {
        console.error(err);
        setError(err.message); // This might overwrite book error, consider separate error states or combining
        setLoadingArticles(false);
      }
    };

    fetchLibraryData();
  }, []); // Runs once on component mount

  const i18n = {
    ru: {
      title: "Библиотека",
      videosTitle: "Видео",
      videosPlaceholder: "Видео пока не добавлены.", // Videos still use sample data for now
      booksTitle: "Книги",
      booksPlaceholder: "Книги не найдены.",
      articlesTitle: "Статьи",
      articlesPlaceholder: "Статьи не найдены.",
      openPdf: "Открыть PDF",
      loading: "Загрузка...",
      fetchError: "Не удалось загрузить данные: ",
    },
    en: {
      title: "Library",
      videosTitle: "Videos",
      videosPlaceholder: "No videos added yet.", // Videos still use sample data
      booksTitle: "Books",
      booksPlaceholder: "No books found.",
      articlesTitle: "Articles",
      articlesPlaceholder: "No articles found.",
      openPdf: "Open PDF",
      loading: "Loading...",
      fetchError: "Failed to load data: ",
    }
  };

  const t = i18n[language] || i18n.en;

  // Sample Data for Videos (remains static for now)
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
          <div className="mb-8 p-4 text-center text-red-700 bg-red-100 rounded-md">
            {t.fetchError}{error}
          </div>
        )}

        <main className="space-y-16">
          {/* Videos section remains with sample data for now */}
          <Section
            title={t.videosTitle}
            items={sampleVideos.map(video => ({ // Adapt sample video titles to be simple strings for consistency
                ...video,
                title: video.title[language] || video.title['en']
            }))}
            itemType="video"
            placeholder={t.videosPlaceholder}
            language={language}
            translations={t}
            isLoading={false} // Videos are not loaded from API in this step
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
            error={error && loadingBooks ? error : null} // Show general error if books loading failed
          />
          <Section
            title={t.articlesTitle}
            items={articles}
            itemType="article"
            placeholder={t.articlesPlaceholder}
            language={language}
            translations={t}
            isLoading={loadingArticles}
            error={error && loadingArticles ? error : null} // Show general error if articles loading failed
          />
        </main>
      </div>
    </div>
  );
};

export default LibraryPage;
