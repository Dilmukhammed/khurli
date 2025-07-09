import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder for language context
// import { useLanguage } from '../contexts/LanguageContext';

/**
 * A reusable component for displaying a feature card on the home page.
 * @param {object} props - The props for the component.
 * @param {string} props.title - The title of the feature.
 * @param {string} props.description - The description of the feature.
 * @param {JSX.Element} props.icon - The SVG icon for the feature.
 * @param {string} props.linkTo - The path for the button link.
 * @param {string} props.linkText - The text for the button link.
 * @param {string} props.colorTheme - The color theme for the card (e.g., 'indigo', 'green').
 */
const FeatureCard = ({ title, description, icon, linkTo, linkText, colorTheme = 'indigo' }) => {
    const colorClasses = {
        indigo: {
            title: 'text-indigo-700',
            icon: 'text-indigo-500',
            button: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700',
        },
        green: {
            title: 'text-green-700',
            icon: 'text-green-500',
            button: 'bg-green-100 hover:bg-green-200 text-green-700',
        },
        // Add other color themes as needed
    };

    const theme = colorClasses[colorTheme] || colorClasses.indigo;

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between h-full feature-card">
            <div>
                <h3 className={`text-xl font-semibold ${theme.title} mb-3`}>{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
            </div>
            <div>
                <div className={`mt-4 pt-4 ${theme.icon}`}>{icon}</div>
                {linkTo && (
                    <Link to={linkTo} className={`mt-4 block w-full text-center px-6 py-2 rounded-md text-sm font-medium transition duration-300 ${theme.button}`}>
                        {linkText}
                    </Link>
                )}
            </div>
        </div>
    );
};


/**
 * The Home Page component for the Logiclingua platform.
 * Displays a welcome message, key features, and information about the platform.
 */
const HomePage = () => {
  // Local state for language. Later, this will come from a global context.
  const language = localStorage.getItem('logiclingua-lang') || 'ru';

  // In a real app, this would be in a dedicated i18n file.
   const translations = {
        ru: {
            welcomeTitle: "Добро пожаловать в Logiclingua!",
            welcomeSubtitle: "Ваш путь к эффективному обучению. Мы верим, что обучение должно быть увлекательным, интерактивным и доступным для всех.",
            welcomeButton: "Начать обучение",
            featuresTitle: "Ключевые компоненты платформы",
            featureModulesTitle: "Обучающие модули",
            featureModulesDesc: "Структурированные курсы с заданиями, лекциями и тестами. Отслеживайте свой прогресс.",
            goToModulesHub: "К модулям",
            featureGamesHubTitle: "Центр Игр",
            featureGamesHubDesc: "Интерактивные игры для отработки навыков критического мышления и медиаграмотности.",
            goToGamesHub: "К играм",
            aboutTitle: "О Платформе",
            aboutDesc: "Logiclingua — это комплексная цифровая экосистема обучения, разработанная для улучшения образования с помощью интерактивных модулей...",
            contactTitle: "Остались вопросы?",
            contactSubtitle: "Свяжитесь с нами для получения дополнительной информации.",
            contactButton: "Связаться с нами", // Changed from "Написать нам" to ensure it implies opening a page
        },
        en: {
            welcomeTitle: "Welcome to Logiclingua!",
            welcomeSubtitle: "Your path to effective learning. We believe learning should be engaging, interactive, and accessible to everyone.",
            welcomeButton: "Start Learning",
            featuresTitle: "Key Components of the Platform",
            featureModulesTitle: "Learning Modules",
            featureModulesDesc: "Structured courses with tasks, lectures, and assessments. Track your progress.",
            goToModulesHub: "Go to Modules",
            featureGamesHubTitle: "Games Hub",
            featureGamesHubDesc: "Interactive games to practice critical thinking and media literacy skills.",
            goToGamesHub: "Go to Games",
            aboutTitle: "About the Platform",
            aboutDesc: "Logiclingua is a comprehensive digital learning ecosystem designed to enhance education through interactive modules...",
            contactTitle: "Have Questions?",
            contactSubtitle: "Contact us for more information.",
            contactButton: "Contact Us", // This can remain "Contact Us"
        }
    };

  const t = translations[language];

  // Data for the feature cards
  const features = [
    {
      title: t.featureModulesTitle,
      description: t.featureModulesDesc,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
      linkTo: "/modules",
      linkText: t.goToModulesHub,
      colorTheme: 'indigo'
    },
    {
      title: t.featureGamesHubTitle,
      description: t.featureGamesHubDesc,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      linkTo: "/games",
      linkText: t.goToGamesHub,
      colorTheme: 'green'
    },
    // Add more features here if needed
  ];

  return (
    <>
      <section id="welcome" className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t.welcomeTitle}</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">{t.welcomeSubtitle}</p>
        <Link to="/modules" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md text-lg font-semibold transition duration-300">
          {t.welcomeButton}
        </Link>
      </section>

      <section id="features" className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t.featuresTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* We are only showing the first two main features on the home page for brevity */}
            {features.map((feature, index) => (
                <div key={index} className="lg:col-span-2">
                    <FeatureCard {...feature} />
                </div>
            ))}
        </div>
      </section>

      <section id="about" className="mb-16 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">{t.aboutTitle}</h2>
        <p className="text-gray-600 leading-relaxed text-center">{t.aboutDesc}</p>
      </section>

      <section id="contact" className="text-center bg-indigo-50 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.contactTitle}</h2>
        <p className="text-gray-600 mb-6">{t.contactSubtitle}</p>
        <Link to="/contact" className="bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-6 py-2 rounded-md text-lg font-semibold transition duration-300">
          {t.contactButton}
        </Link>
      </section>
    </>
  );
};

export default HomePage;
