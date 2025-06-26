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

  // Sample Data
  const sampleVideos = [
    { id: 'vid1', title: { en: 'Introduction to Critical Thinking', ru: 'Введение в критическое мышление' }, youtubeId: 'dQw4w9WgXcQ' },
    { id: 'vid2', title: { en: 'Understanding Media Bias', ru: 'Понимание предвзятости в СМИ' }, youtubeId: 'oHg5SJYRHA0' },
  ];

  const sampleBooks = [
    { id: 'book1', title: { en: 'The Art of Thinking Clearly', ru: 'Искусство ясно мыслить' }, pdfUrl: '#' },
    { id: 'book2', title: { en: 'Thinking, Fast and Slow', ru: 'Думай медленно... решай быстро' }, pdfUrl: '#' },
  ];

  const sampleArticles = [
    { id: 'art1', title: { en: 'How to Spot Fake News', ru: 'Как распознать фейковые новости' }, pdfUrl: '#' },
    { id: 'art2', title: { en: 'The Impact of Social Media on Information', ru: 'Влияние социальных сетей на информацию' }, pdfUrl: '#' },
  ];


  const Section = ({ title, items, itemType, placeholder }) => (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-300">{title}</h2>
      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-indigo-700 mb-3 min-h-[3em]">{item.title[language] || item.title['en']}</h3>
                {itemType === 'video' && item.youtubeId && (
                  <div className="aspect-w-16 aspect-h-9 rounded overflow-hidden">
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
              {(itemType === 'book' || itemType === 'article') && item.pdfUrl && (
                <a
                  href={item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-md text-center transition-colors"
                >
                  {language === 'ru' ? 'Открыть PDF' : 'Open PDF'}
                </a>
              )}
            </div>
          ))}
        </div>
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
              {(itemType === 'book' || itemType === 'article') && item.pdfUrl && (
                <a
                  href={item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-indigo-500 hover:text-indigo-700 underline"
                >
                  {language === 'ru' ? 'Открыть PDF' : 'Open PDF'}
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">{placeholder}</p>
      )}
    </section>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">{t.title}</h1>
      </header>

      <div className="space-y-10">
        <Section
          title={t.videosTitle}
          items={sampleVideos}
          itemType="video"
          placeholder={t.videosPlaceholder}
        />
        <Section
          title={t.booksTitle}
          items={sampleBooks}
          itemType="book"
          placeholder={t.booksPlaceholder}
        />
        <Section
          title={t.articlesTitle}
          items={sampleArticles}
          itemType="article"
          placeholder={t.articlesPlaceholder}
        />
      </div>
    </div>
  );
};

export default LibraryPage;
