import React, { useState, useEffect } from 'react';

// Translations object containing all the text for both languages.
// In a real application, this would likely be moved to a dedicated i18n library.
const translations = {
    ru: {
        pageTitle: "Факт или Мнение",
        mainTitle: "Факт или Мнение",
        beginnerLevel: "Начальный уровень – Определение и категоризация фактов и мнений",
        factBTask1Title: "1. Сортировка: Факт или Мнение",
        factBTask1Desc: "Прочитайте каждое предложение и решите, является ли оно фактом (✔️) или мнением (❌).",
        fact: "Факт",
        opinion: "Мнение",
        checkAnswersBtn: "Проверить ответы",
        submitBtn: "Отправить",
        allCorrectMessage: "Все ответы верны!",
        someIncorrectMessage: "Некоторые ответы неверны. Проверьте выделенные.",
        factBTask2Title: "2. Преобразование мнений в факты и наоборот",
        factBTask2Desc: "Перепишите следующие мнения как факты и наоборот. Примеры даны в учебном материале.",
        rewriteAsOpinion: "Перепишите как мнение:",
        rewriteAsFact: "Перепишите как факт:",
        placeholderRewriteOpinion: "Ваше мнение...",
        placeholderRewriteFact: "Ваш факт...",
        factBTask3Title: "3. Игра \"Это факт?\"",
        factBTask3Desc: "Прочитайте каждое утверждение. Определите, факт это или мнение.",
        intermediateLevel: "Средний уровень – Обоснование фактов и мнений",
        factITask1Title: "1. \"Почему это факт или мнение?\"",
        factITask1Desc: "Прочитайте каждое утверждение и объясните, почему это факт или мнение.",
        placeholderExplanation: "Объяснение...",
        factITask2Title: "2. Дебаты: Факт или Мнение",
        factITask2Desc: "Вам дано утверждение. Приведите аргументы, является ли оно фактом или мнением.",
        placeholderArguments: "Ваши аргументы...",
        advancedLevel: "Продвинутый уровень – Критическое мышление и оценка предвзятости",
        factATask1Title: "1. Анализ предвзятых утверждений",
        factATask1Desc: "Определите, являются ли утверждения нейтральными фактами или предвзятыми мнениями.",
        neutralFact: "Нейтральный факт",
        biasedOpinion: "Предвзятое мнение",
        factATask2Title: "2. Упражнение по проверке фактов",
        factATask2Desc: "Исследуйте и проверьте следующие утверждения. Укажите, верны ли они (✔️) или неверны (❌), и при необходимости предоставьте краткое пояснение или исправление.",
        true: "Верно",
        false: "Неверно",
        placeholderFactCheck: "Пояснение/Исправление (если неверно)...",
    },
    en: {
        pageTitle: "Fact or Opinion",
        mainTitle: "Fact or Opinion",
        beginnerLevel: "Beginner Level – Identifying and Categorizing Facts & Opinions",
        factBTask1Title: "1. Fact or Opinion Sorting",
        factBTask1Desc: "Read each sentence and decide whether it is a fact (✔️) or an opinion (❌).",
        fact: "Fact",
        opinion: "Opinion",
        checkAnswersBtn: "Check Answers",
        submitBtn: "Submit",
        allCorrectMessage: "All answers are correct!",
        someIncorrectMessage: "Some answers are incorrect. Check the highlighted ones.",
        factBTask2Title: "2. Changing Opinions into Facts & Vice Versa",
        factBTask2Desc: "Rewrite the following opinions as facts and vice versa. Examples are provided in the learning material.",
        rewriteAsOpinion: "Rewrite as an opinion:",
        rewriteAsFact: "Rewrite as a fact:",
        placeholderRewriteOpinion: "Your opinion...",
        placeholderRewriteFact: "Your fact...",
        factBTask3Title: "3. \"Is It a Fact?\" Game",
        factBTask3Desc: "Read each statement. Determine if it is a fact or an opinion.",
        intermediateLevel: "Intermediate Level – Justifying Facts and Opinions",
        factITask1Title: "1. \"Why is it a Fact or Opinion?\"",
        factITask1Desc: "Read each statement and explain why it is a fact or opinion.",
        placeholderExplanation: "Explanation...",
        factITask2Title: "2. Fact or Opinion Debate",
        factITask2Desc: "You are given a statement. Argue whether it is a fact or an opinion.",
        placeholderArguments: "Your arguments...",
        advancedLevel: "Advanced Level – Critical Thinking & Evaluating Bias",
        factATask1Title: "1. Analyzing Biased Statements",
        factATask1Desc: "Identify whether the statements are neutral facts or biased opinions.",
        neutralFact: "Neutral Fact",
        biasedOpinion: "Biased Opinion",
        factATask2Title: "2. Fact-Checking Exercise",
        factATask2Desc: "Research and fact-check the following statements. Indicate if they are true (✔️) or false (❌), and provide a brief explanation or correction if false.",
        true: "True",
        false: "False",
        placeholderFactCheck: "Explanation/Correction (if false)...",
    }
};

// Data for the interactive tasks
const beginnerTask1Data = [
    { id: 'b1_1', ru: "1. Ташкент - столица Узбекистана.", en: "1. Tashkent is the capital of Uzbekistan.", answer: 'fact' },
    { id: 'b1_2', ru: "2. Узбекский флаг имеет три цвета: синий, белый и зеленый.", en: "2. The Uzbek flag has three colors: blue, white, and green.", answer: 'fact' },
    { id: 'b1_3', ru: "3. Самарканд - самый красивый город в мире.", en: "3. Samarkand is the most beautiful city in the world.", answer: 'opinion' },
    { id: 'b1_4', ru: "4. Узбекский плов вкуснее любого другого плова.", en: "4. Uzbek plov is tastier than any other type of plov.", answer: 'opinion' },
    { id: 'b1_5', ru: "5. Амир Темур был важной исторической фигурой в Узбекистане.", en: "5. Amir Timur was an important historical figure in Uzbekistan.", answer: 'fact' },
    { id: 'b1_6', ru: "6. Чимганские горы идеально подходят для катания на лыжах.", en: "6. Chimgan mountains are perfect for skiing.", answer: 'opinion' },
    { id: 'b1_7', ru: "7. Узбекский сум - официальная валюта Узбекистана.", en: "7. Uzbek sum is the official currency of Uzbekistan.", answer: 'fact' },
    { id: 'b1_8', ru: "8. Бухара старше Ташкента.", en: "8. Bukhara is older than Tashkent.", answer: 'fact' },
    { id: 'b1_9', ru: "9. Все в Узбекистане любят чай.", en: "9. Everyone in Uzbekistan loves tea.", answer: 'opinion' },
    { id: 'b1_10', ru: "10. Лучшее время для посещения Узбекистана - весна.", en: "10. The best time to visit Uzbekistan is in the spring.", answer: 'opinion' },
];

const beginnerTask3Data = [
    { id: 'b3_1', ru: "1. Узбекский алфавит состоит из 29 букв.", en: "1. The Uzbek alphabet has 29 letters.", answer: 'fact' },
    { id: 'b3_2', ru: "2. Зимы в Узбекистане слишком холодные.", en: "2. Uzbekistan’s winters are too cold.", answer: 'opinion' },
    { id: 'b3_3', ru: "3. Аральское море сокращается на протяжении десятилетий.", en: "3. The Aral Sea has been shrinking for decades.", answer: 'fact' },
    { id: 'b3_4', ru: "4. Узбекистан стал независимым в 1991 году.", en: "4. Uzbekistan became independent in 1991.", answer: 'fact' },
];

const advancedTask1Data = [
    { id: 'a1_1', ru: "1. Правительство Узбекистана провело новые экономические реформы.", en: "1. The Uzbek government introduced new economic reforms.", answer: 'neutral' },
    { id: 'a1_2', ru: "2. Новые реформы правительства делают Узбекистан богаче.", en: "2. The government’s new reforms are making Uzbekistan richer.", answer: 'biased' },
    { id: 'a1_3', ru: "3. Узбекская традиционная одежда элегантнее западной.", en: "3. Uzbek traditional clothing is more elegant than Western clothing.", answer: 'biased' },
];


// Reusable component for multiple choice questions (Radio buttons)
const MultipleChoiceTask = ({ taskId, questions, lang, title, description, options, checkBtnText, allCorrectMsg, someIncorrectMsg }) => {
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
        return '';
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
            <div className="space-y-4">
                {questions.map((q) => (
                    <div key={q.id} className={`p-2 rounded-md ${results[q.id] ? (results[q.id] === 'correct' ? 'bg-green-50' : 'bg-red-50') : ''}`}>
                        <p className={`statement-text ${getResultClass(results[q.id])}`}>{q[lang]}</p>
                        <div className="mt-2">
                            {Object.entries(options).map(([value, labelKey]) => (
                                <label key={value} className="radio-label mr-4 inline-flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`${taskId}-${q.id}`}
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


export default function FactOpinionModule() {
    // Read language from localStorage, defaulting to 'ru'.
    // This state will hold the language for the entire component.
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');

    // Effect to set document title based on language.
    // This runs once on mount and anytime 'lang' changes.
    useEffect(() => {
        document.title = translations[lang].pageTitle;
        
        // This function handles the storage event.
        // It allows the component to react if the language is changed in another tab.
        const handleStorageChange = (event) => {
            if (event.key === 'logiclingua-lang') {
                setLang(event.newValue || 'ru');
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Cleanup function to remove the event listener.
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [lang]);

    // Get the correct set of translations based on the current language.
    const t = translations[lang];

    return (
        <div className="bg-gray-100 text-gray-800 font-sans">
            <main className="container mx-auto px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{t.mainTitle}</h1>

                {/* Beginner Level Section */}
                <section className="level-section mb-12 p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-6 border-b pb-3">{t.beginnerLevel}</h2>

                    <MultipleChoiceTask
                        taskId="beginner-1"
                        title={t.factBTask1Title}
                        description={t.factBTask1Desc}
                        questions={beginnerTask1Data}
                        lang={lang}
                        options={{ fact: 'fact', opinion: 'opinion' }}
                        checkBtnText={t.checkAnswersBtn}
                        allCorrectMsg={t.allCorrectMessage}
                        someIncorrectMsg={t.someIncorrectMessage}
                    />

                    <div className="mb-8 p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-3">{t.factBTask2Title}</h3>
                        <p className="mb-4 text-sm text-gray-600">{t.factBTask2Desc}</p>
                        <div className="space-y-6">
                            <div>
                                <p className="font-medium">1. {lang === 'ru' ? 'Факт: Узбекистан расположен в Центральной Азии.' : 'Fact: Uzbekistan is located in Central Asia.'}</p>
                                <label className="block text-sm font-medium text-gray-700 mt-2">{t.rewriteAsOpinion}</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" placeholder={t.placeholderRewriteOpinion} />
                            </div>
                            <div>
                                <p className="font-medium">2. {lang === 'ru' ? 'Факт: Навруз празднуется 21 марта.' : 'Fact: Navruz is celebrated on March 21st.'}</p>
                                <label className="block text-sm font-medium text-gray-700 mt-2">{t.rewriteAsOpinion}</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" placeholder={t.placeholderRewriteOpinion} />
                            </div>
                            <div>
                                <p className="font-medium">3. {lang === 'ru' ? 'Мнение: Узбекский хлеб лучше любого другого хлеба.' : 'Opinion: Uzbek bread is better than any other bread.'}</p>
                                <label className="block text-sm font-medium text-gray-700 mt-2">{t.rewriteAsFact}</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" placeholder={t.placeholderRewriteFact} />
                            </div>
                             <div>
                                <p className="font-medium">4. {lang === 'ru' ? 'Мнение: Лучшее узбекское блюдо - самса.' : 'Opinion: The best Uzbek dish is samsa.'}</p>
                                <label className="block text-sm font-medium text-gray-700 mt-2">{t.rewriteAsFact}</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" placeholder={t.placeholderRewriteFact} />
                            </div>
                        </div>
                        <button className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{t.submitBtn}</button>
                    </div>

                    <MultipleChoiceTask
                        taskId="beginner-3"
                        title={t.factBTask3Title}
                        description={t.factBTask3Desc}
                        questions={beginnerTask3Data}
                        lang={lang}
                        options={{ fact: 'fact', opinion: 'opinion' }}
                        checkBtnText={t.checkAnswersBtn}
                        allCorrectMsg={t.allCorrectMessage}
                        someIncorrectMsg={t.someIncorrectMessage}
                    />
                </section>

                {/* Intermediate Level Section */}
                <section className="level-section mb-12 p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-green-700 mb-6 border-b pb-3">{t.intermediateLevel}</h2>
                     <div className="mb-8 p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-3">{t.factITask1Title}</h3>
                        <p className="mb-4 text-sm text-gray-600">{t.factITask1Desc}</p>
                        <div className="space-y-6">
                            <div>
                                <p className="font-medium">1. {lang === 'ru' ? 'Бухара является объектом Всемирного наследия ЮНЕСКО.' : 'Bukhara is a UNESCO World Heritage site.'}</p>
                                <textarea className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-green-500 focus:border-green-500" rows="2" placeholder={t.placeholderExplanation}></textarea>
                            </div>
                            <div>
                                <p className="font-medium">2. {lang === 'ru' ? 'Самарканд красивее Хивы.' : 'Samarkand is more beautiful than Khiva.'}</p>
                                <textarea className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-green-500 focus:border-green-500" rows="2" placeholder={t.placeholderExplanation}></textarea>
                            </div>
                            <div>
                                <p className="font-medium">3. {lang === 'ru' ? 'В Узбекистане проживает более 35 миллионов человек.' : 'Uzbekistan has more than 35 million people.'}</p>
                                <textarea className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-green-500 focus:border-green-500" rows="2" placeholder={t.placeholderExplanation}></textarea>
                            </div>
                        </div>
                        <button className="mt-6 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">{t.submitBtn}</button>
                    </div>

                    <div className="p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-3">{t.factITask2Title}</h3>
                        <p className="mb-4 text-sm text-gray-600">{t.factITask2Desc}</p>
                        <div className="space-y-6">
                            <div>
                                <p className="font-medium">{lang === 'ru' ? 'Утверждение: Ташкент - самый развитый город в Узбекистане.' : 'Statement: Tashkent is the most developed city in Uzbekistan.'}</p>
                                <textarea className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-green-500 focus:border-green-500" rows="3" placeholder={t.placeholderArguments}></textarea>
                            </div>
                             <div>
                                <p className="font-medium">{lang === 'ru' ? 'Утверждение: Изучение английского языка необходимо для успеха в Узбекистане.' : 'Statement: Learning English is necessary for success in Uzbekistan.'}</p>
                                <textarea className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-green-500 focus:border-green-500" rows="3" placeholder={t.placeholderArguments}></textarea>
                            </div>
                        </div>
                         <button className="mt-6 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">{t.submitBtn}</button>
                    </div>
                </section>
                
                {/* Advanced Level Section */}
                <section className="level-section p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-red-700 mb-6 border-b pb-3">{t.advancedLevel}</h2>

                    <MultipleChoiceTask
                        taskId="advanced-1"
                        title={t.factATask1Title}
                        description={t.factATask1Desc}
                        questions={advancedTask1Data}
                        lang={lang}
                        options={{ neutral: 'neutralFact', biased: 'biasedOpinion' }}
                        checkBtnText={t.checkAnswersBtn}
                        allCorrectMsg={t.allCorrectMessage}
                        someIncorrectMsg={t.someIncorrectMessage}
                    />

                    <div className="p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-3">{t.factATask2Title}</h3>
                        <p className="mb-4 text-sm text-gray-600">{t.factATask2Desc}</p>
                        <div className="space-y-6">
                            <div>
                                <p className="font-medium">1. {lang === 'ru' ? 'Узбекистан был частью Советского Союза до 1991 года.' : 'Uzbekistan was part of the Soviet Union before 1991.'}</p>
                                <div className="mt-2">
                                    <label className="mr-4 inline-flex items-center"><input type="radio" name="verify1" className="mr-2 h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"/>{t.true}</label>
                                    <label className="inline-flex items-center"><input type="radio" name="verify1" className="mr-2 h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"/>{t.false}</label>
                                </div>
                                <input type="text" className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-red-500 focus:border-red-500" placeholder={t.placeholderFactCheck} />
                            </div>
                            <div>
                                <p className="font-medium">2. {lang === 'ru' ? 'Официальный язык Узбекистана - русский.' : 'The official language of Uzbekistan is Russian.'}</p>
                                <div className="mt-2">
                                    <label className="mr-4 inline-flex items-center"><input type="radio" name="verify2" className="mr-2 h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"/>{t.true}</label>
                                    <label className="inline-flex items-center"><input type="radio" name="verify2" className="mr-2 h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"/>{t.false}</label>
                                </div>
                                <input type="text" className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-red-500 focus:border-red-500" placeholder={t.placeholderFactCheck} />
                            </div>
                            <div>
                                <p className="font-medium">3. {lang === 'ru' ? 'В Узбекистане находится самая большая пустыня в Центральной Азии.' : 'Uzbekistan has the largest desert in Central Asia.'}</p>
                                <div className="mt-2">
                                    <label className="mr-4 inline-flex items-center"><input type="radio" name="verify3" className="mr-2 h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"/>{t.true}</label>
                                    <label className="inline-flex items-center"><input type="radio" name="verify3" className="mr-2 h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"/>{t.false}</label>
                                </div>
                                <input type="text" className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-red-500 focus:border-red-500" placeholder={t.placeholderFactCheck} />
                            </div>
                        </div>
                         <button className="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">{t.submitBtn}</button>
                    </div>
                </section>
            </main>
        </div>
    );
}
