import React, { useState, useEffect } from 'react';

// Translations object for the Fake News Analysis module.
const translations = {
    ru: {
        pageTitle: "Анализ фейковых новостей",
        mainTitle: "Анализ фейковых новостей и Медиаграмотность",
        beginnerLevel: "Начальный уровень – Обнаружение фейковых новостей",
        fakeNewsBTask1Title: "1. Распознавание фейковых новостей",
        fakeNewsBTask1Desc: "Прочитайте два заголовка ниже. Один из них правдоподобный (но ложный), а другой преувеличенный (очевидно фейковый). Решите, какой из них какой.",
        believableFalse: "Правдоподобный (но ложный)",
        exaggeratedFake: "Преувеличенный (фейк)",
        checkAnswersBtn: "Проверить ответы",
        submitBtn: "Отправить",
        allCorrectMessage: "Все ответы верны!",
        someIncorrectMessage: "Некоторые ответы неверны. Проверьте выделенные.",
        discussionQuestionsTitle: "Вопросы для обсуждения:",
        fakeNewsBTask1Discuss1: "Какой заголовок звучит более реалистично?",
        fakeNewsBTask1Discuss2: "Какие детали делают второй заголовок очевидно фейковым?",
        fakeNewsBTask1Discuss3: "Какие вопросы следует задать, прежде чем верить новостям в интернете?",
        intermediateLevel: "Средний уровень – Проверка фактов в фейковых новостях",
        fakeNewsITask1Title: "1. Проверка фактов в фейковых новостях",
        fakeNewsITask1Desc: "Прочитайте два фейковых заголовка и объясните, почему каждый из них ложный. Используйте интернет для поиска реальной информации.",
        placeholderExplanation: "Ваше объяснение...",
        followUpActivitiesTitle: "Дополнительные задания:",
        fakeNewsITask1FollowUp1: "Найдите как минимум два источника, которые доказывают ложность этих заголовков.",
        fakeNewsITask1FollowUp2: "Какие ключевые слова вы бы использовали для проверки этих утверждений?",
        fakeNewsITask1FollowUp3: "Перепишите эти заголовки, чтобы они стали более правдивыми.",
        advancedLevel: "Продвинутый уровень – Создание и анализ фейковых новостей",
        fakeNewsATask1Title: "1. Создание и анализ фейковых новостей",
        fakeNewsATask1Desc: "Придумайте свой собственный правдоподобный фейковый заголовок и преувеличенный фейковый заголовок об Узбекистане. Затем поменяйтесь с партнером и обсудите, как выявить фейковые новости.",
        believableFakeHeadlineLabel: "Ваш правдоподобный фейковый заголовок:",
        placeholderBelievableFake: "Введите правдоподобный фейковый заголовок...",
        exaggeratedFakeHeadlineLabel: "Ваш преувеличенный фейковый заголовок:",
        placeholderExaggeratedFake: "Введите преувеличенный фейковый заголовок...",
        followUpQuestionsTitle: "Вопросы для обсуждения:",
        fakeNewsATask1FollowUp1: "Что делает фейковую новость правдоподобной?",
        fakeNewsATask1FollowUp2: "Как люди могут защитить себя от веры в фейковые новости?",
        fakeNewsATask1FollowUp3: "Каковы реальные последствия фейковых новостей?",
    },
    en: {
        pageTitle: "Fake News Analysis",
        mainTitle: "Fake News Analysis and Media Literacy",
        beginnerLevel: "Beginner Level – Spotting Fake News",
        fakeNewsBTask1Title: "1. Spotting Fake News",
        fakeNewsBTask1Desc: "Read the two headlines below. One is believable (but false), and the other is exaggerated (obviously fake). Decide which is which.",
        believableFalse: "Believable (but false)",
        exaggeratedFake: "Exaggerated (fake)",
        checkAnswersBtn: "Check Answers",
        submitBtn: "Submit",
        allCorrectMessage: "All answers are correct!",
        someIncorrectMessage: "Some answers are incorrect. Check the highlighted ones.",
        discussionQuestionsTitle: "Discussion Questions:",
        fakeNewsBTask1Discuss1: "Which headline sounds more realistic?",
        fakeNewsBTask1Discuss2: "What details make the second headline obviously fake?",
        fakeNewsBTask1Discuss3: "What questions should we ask before believing news online?",
        intermediateLevel: "Intermediate Level – Fact-Checking Fake News",
        fakeNewsITask1Title: "1. Fact-Checking Fake News",
        fakeNewsITask1Desc: "Read the two fake headlines and explain why each one is false. Research online to find real information.",
        placeholderExplanation: "Your explanation...",
        followUpActivitiesTitle: "Follow-up Activities:",
        fakeNewsITask1FollowUp1: "Find at least two sources that prove these headlines are false.",
        fakeNewsITask1FollowUp2: "What keywords should you use to fact-check these claims?",
        fakeNewsITask1FollowUp3: "Rewrite these headlines to make them more truthful.",
        advancedLevel: "Advanced Level – Creating and Analyzing Fake News",
        fakeNewsATask1Title: "1. Creating and Analyzing Fake News",
        fakeNewsATask1Desc: "Create your own believable fake headline and exaggerated fake headline about Uzbekistan. Then, swap with a partner and discuss how to identify fake news.",
        believableFakeHeadlineLabel: "Your believable fake headline:",
        placeholderBelievableFake: "Enter a believable fake headline...",
        exaggeratedFakeHeadlineLabel: "Your exaggerated fake headline:",
        placeholderExaggeratedFake: "Enter an exaggerated fake headline...",
        followUpQuestionsTitle: "Follow-up Questions:",
        fakeNewsATask1FollowUp1: "What makes a fake news story seem real?",
        fakeNewsATask1FollowUp2: "How can people protect themselves from believing fake news?",
        fakeNewsATask1FollowUp3: "What are some real-life consequences of fake news?",
    }
};

// Data for the interactive tasks
const beginnerTask1Data = [
    { id: 'h1', ru: "Заголовок 1: \"Узбекистан введет бесплатный общественный транспорт для всех жителей к 2026 году\"", en: "Headline 1: \"Uzbekistan to Introduce Free Public Transport for All Residents by 2026\"", answer: 'believable_false' },
    { id: 'h2', ru: "Заголовок 2: \"Инопланетяне приземлились в Бухаре и требуют попробовать плов\"", en: "Headline 2: \"Aliens Land in Bukhara and Demand to Try Plov\"", answer: 'exaggerated_fake' }
];

// Reusable component for the headline classification task
const HeadlineClassifierTask = ({ questions, lang, title, description, options, checkBtnText, allCorrectMsg, someIncorrectMsg }) => {
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState({});
    const [feedback, setFeedback] = useState('');

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const checkAnswers = () => {
        const newResults = {};
        let allCorrect = true;
        let anyAnswered = false;

        questions.forEach(q => {
            if (answers[q.id]) {
                anyAnswered = true;
                if (answers[q.id] === q.answer) {
                    newResults[q.id] = 'correct';
                } else {
                    newResults[q.id] = 'incorrect';
                    allCorrect = false;
                }
            } else {
                allCorrect = false;
            }
        });

        setResults(newResults);

        if (!anyAnswered) {
             setFeedback('');
        } else if (allCorrect) {
            setFeedback(allCorrectMsg);
        } else {
            setFeedback(someIncorrectMsg);
        }
    };
    
    const getResultClass = (isCorrect) => {
        if (isCorrect === 'correct') return 'text-green-600 font-bold';
        if (isCorrect === 'incorrect') return 'text-red-600 font-bold';
        return 'font-medium';
    };

    const getFeedbackClass = () => {
        if(feedback === allCorrectMsg) return 'text-green-600';
        if(feedback === someIncorrectMsg) return 'text-red-600';
        return '';
    };

    return (
        <div className="mb-8 p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="mb-4 text-sm text-gray-600">{description}</p>
            <div className="space-y-6">
                {questions.map((q) => (
                     <div key={q.id} className={`p-2 rounded-md ${results[q.id] ? (results[q.id] === 'correct' ? 'bg-green-50' : 'bg-red-50') : ''}`}>
                        <p className={`headline-text ${getResultClass(results[q.id])}`}>{q[lang]}</p>
                        <div className="mt-2">
                            {Object.entries(options).map(([value, labelKey]) => (
                                <label key={value} className="radio-label mr-4 inline-flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`headline_${q.id}_type`}
                                        value={value}
                                        checked={answers[q.id] === value}
                                        onChange={() => handleAnswerChange(q.id, value)}
                                        className="radio-input mr-2 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span>{translations[lang][labelKey]}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
             <button
                onClick={checkAnswers}
                className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {checkBtnText}
            </button>
            {feedback && (
                <div className={`result-message mt-3 text-sm font-medium ${getFeedbackClass()}`}>
                    {feedback}
                </div>
            )}
        </div>
    );
};

export default function FakeNewsAnalysisModule() {
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');

    useEffect(() => {
        document.title = translations[lang].pageTitle;
        
        const handleStorageChange = (event) => {
            if (event.key === 'logiclingua-lang') {
                setLang(event.newValue || 'ru');
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [lang]);

    const t = translations[lang];

    return (
        <div className="bg-gray-100 text-gray-800 font-sans">
            <main className="container mx-auto px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{t.mainTitle}</h1>

                {/* Beginner Level Section */}
                <section className="level-section mb-12 p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-6 border-b pb-3">{t.beginnerLevel}</h2>
                    <HeadlineClassifierTask
                        questions={beginnerTask1Data}
                        lang={lang}
                        title={t.fakeNewsBTask1Title}
                        description={t.fakeNewsBTask1Desc}
                        options={{ believable_false: 'believableFalse', exaggerated_fake: 'exaggeratedFake' }}
                        checkBtnText={t.checkAnswersBtn}
                        allCorrectMsg={t.allCorrectMessage}
                        someIncorrectMsg={t.someIncorrectMessage}
                    />
                     <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-lg font-semibold mb-2">{t.discussionQuestionsTitle}</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                            <li>{t.fakeNewsBTask1Discuss1}</li>
                            <li>{t.fakeNewsBTask1Discuss2}</li>
                            <li>{t.fakeNewsBTask1Discuss3}</li>
                        </ul>
                    </div>
                </section>

                {/* Intermediate Level Section */}
                <section className="level-section mb-12 p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-green-700 mb-6 border-b pb-3">{t.intermediateLevel}</h2>
                    <div className="mb-8 p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-3">{t.fakeNewsITask1Title}</h3>
                        <p className="mb-4 text-sm text-gray-600">{t.fakeNewsITask1Desc}</p>
                        <div className="space-y-6">
                            <div>
                                <p className="font-medium">{lang === 'ru' ? 'Заголовок 1: "Новый закон в Узбекистане требует от всех студентов изучать корейский язык"' : 'Headline 1: "New Law in Uzbekistan Requires All Students to Learn Korean"'}</p>
                                <textarea className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-green-500 focus:border-green-500" rows="3" placeholder={t.placeholderExplanation}></textarea>
                            </div>
                            <div>
                                <p className="font-medium">{lang === 'ru' ? 'Заголовок 2: "Ташкент стал первым городом, запретившим смартфоны"' : 'Headline 2: "Tashkent Becomes the First City to Ban Smartphones"'}</p>
                                <textarea className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-green-500 focus:border-green-500" rows="3" placeholder={t.placeholderExplanation}></textarea>
                            </div>
                        </div>
                         <button className="mt-6 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">{t.submitBtn}</button>
                    </div>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-lg font-semibold mb-2">{t.followUpActivitiesTitle}</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                            <li>{t.fakeNewsITask1FollowUp1}</li>
                            <li>{t.fakeNewsITask1FollowUp2}</li>
                            <li>{t.fakeNewsITask1FollowUp3}</li>
                        </ul>
                    </div>
                </section>

                {/* Advanced Level Section */}
                <section className="level-section p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-red-700 mb-6 border-b pb-3">{t.advancedLevel}</h2>
                    <div className="p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-3">{t.fakeNewsATask1Title}</h3>
                        <p className="mb-4 text-sm text-gray-600">{t.fakeNewsATask1Desc}</p>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="believable_fake_headline" className="block text-sm font-medium text-gray-700">{t.believableFakeHeadlineLabel}</label>
                                <input type="text" id="believable_fake_headline" className="mt-1 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-red-500 focus:border-red-500" placeholder={t.placeholderBelievableFake} />
                            </div>
                            <div>
                                <label htmlFor="exaggerated_fake_headline" className="block text-sm font-medium text-gray-700">{t.exaggeratedFakeHeadlineLabel}</label>
                                <input type="text" id="exaggerated_fake_headline" className="mt-1 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-red-500 focus:border-red-500" placeholder={t.placeholderExaggeratedFake} />
                            </div>
                        </div>
                        <button className="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">{t.submitBtn}</button>
                    </div>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-lg font-semibold mb-2">{t.followUpQuestionsTitle}</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                            <li>{t.fakeNewsATask1FollowUp1}</li>
                            <li>{t.fakeNewsATask1FollowUp2}</li>
                            <li>{t.fakeNewsATask1FollowUp3}</li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
}
