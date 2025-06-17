import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder for language context
// import { useLanguage } from '../contexts/LanguageContext';

/**
 * A reusable card component for displaying a learning module.
 * @param {object} props - The props for the component.
 * @param {string} props.title - The title of the module.
 * @param {string} props.description - The description of the module.
 * @param {string} props.linkTo - The path for the button link.
 * @param {string} props.linkText - The text for the button link.
 * @param {string} props.colorTheme - The color theme for the card (e.g., 'indigo', 'green').
 */
const ModuleCard = ({ title, description, linkTo, linkText, colorTheme = 'gray' }) => {
    const colorClasses = {
        indigo: 'text-indigo-700',
        green: 'text-green-700',
        yellow: 'text-yellow-700',
        purple: 'text-purple-700',
        pink: 'text-pink-700',
    };
    const buttonColorClasses = {
        indigo: 'bg-indigo-500 hover:bg-indigo-600',
        green: 'bg-green-500 hover:bg-green-600',
        yellow: 'bg-yellow-500 hover:bg-yellow-600',
        purple: 'bg-purple-500 hover:bg-purple-600',
        pink: 'bg-pink-500 hover:bg-pink-600',
    }

    const titleClass = colorClasses[colorTheme] || colorClasses.indigo;
    const buttonClass = buttonColorClasses[colorTheme] || buttonColorClasses.indigo;

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between h-full module-card">
            <div>
                <h2 className={`text-xl font-semibold ${titleClass} mb-3`}>{title}</h2>
                <p className="text-gray-600 text-sm mb-4">{description}</p>
            </div>
            <Link to={linkTo} className={`mt-4 inline-block ${buttonClass} text-white text-center px-6 py-2 rounded-md text-sm font-medium transition duration-300`}>
                {linkText}
            </Link>
        </div>
    );
};

/**
 * The Modules Hub page component.
 * Displays a grid of available learning modules.
 */
const ModulesHub = () => {
    // Local state for language.
    const language = localStorage.getItem('logiclingua-lang') || 'ru';

    const translations = {
        ru: {
            mainTitle: "Доступные учебные модули",
            goToModuleBtn: "Перейти к модулю",
            module1Title: "1. Анализ культурных пословиц",
            module1Desc: "Изучение и анализ узбекских и английских пословиц для понимания культурных нюансов и развития языковых навыков.",
            module2Title: "2. Обсуждение социальных вопросов (Дебаты)",
            module2Desc: "Развитие навыков критического мышления, аргументации и публичных выступлений через обсуждение актуальных социальных вопросов Узбекистана.",
            module3Title: "3. Факт или Мнение",
            module3Desc: "Обучение различению фактической информации от субъективных мнений для улучшения аналитических способностей.",
            module4Title: "4. Анализ фейковых новостей и Медиаграмотность",
            module4Desc: "Развитие навыков идентификации и анализа недостоверной информации в СМИ и интернете.",
            module5Title: "5. Этические дилеммы и Решение проблем",
            module5Desc: "Анализ этических ситуаций в контексте ИИ, технологий и повседневной жизни, а также поиск решений реальных проблем.",
        },
        en: {
            mainTitle: "Available Learning Modules",
            goToModuleBtn: "Go to Module",
            module1Title: "1. Analyzing Cultural Proverbs",
            module1Desc: "Study and analysis of Uzbek and English proverbs to understand cultural nuances and develop language skills.",
            module2Title: "2. Debating Social Issues",
            module2Desc: "Developing critical thinking, argumentation, and public speaking skills through discussion of current social issues in Uzbekistan.",
            module3Title: "3. Fact vs. Opinion",
            module3Desc: "Learning to distinguish factual information from subjective opinions to improve analytical skills.",
            module4Title: "4. Fake News Analysis and Media Literacy",
            module4Desc: "Developing skills to identify and analyze false information in media and the internet.",
            module5Title: "5. Ethical Dilemmas and Problem Solving",
            module5Desc: "Analysis of ethical situations in the context of AI, technology, and daily life, as well as finding solutions to real-world problems.",
        }
    };
    
    const t = translations[language];

    const modules = [
        { title: t.module1Title, description: t.module1Desc, linkTo: "/modules/cultural-proverbs", colorTheme: 'indigo' },
        { title: t.module2Title, description: t.module2Desc, linkTo: "/modules/debating", colorTheme: 'green' },
        { title: t.module3Title, description: t.module3Desc, linkTo: "/modules/fact-opinion", colorTheme: 'yellow' },
        { title: t.module4Title, description: t.module4Desc, linkTo: "/modules/fake-news", colorTheme: 'purple' },
        { title: t.module5Title, description: t.module5Desc, linkTo: "/modules/ethical-dilemmas", colorTheme: 'pink' },
    ];

    return (
        <>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
                {t.mainTitle}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {modules.map((mod, index) => (
                    <ModuleCard 
                        key={index}
                        title={mod.title}
                        description={mod.description}
                        linkTo={mod.linkTo}
                        linkText={t.goToModuleBtn}
                        colorTheme={mod.colorTheme}
                    />
                ))}
            </div>
        </>
    );
};

export default ModulesHub;
