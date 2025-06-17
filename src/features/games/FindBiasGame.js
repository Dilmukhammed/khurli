import React, { useState, useEffect } from 'react';

// Translations for the Find the Bias game
const translations = {
    ru: {
        pageTitle: "Игра: Найди Предвзятость!",
        gameTitle: "Игра: Найди Предвзятость!",
        gameInstructions: "Прочитайте каждый фрагмент текста и определите, является ли он \"Нейтральным\" (объективным, безэмоциональным) или \"Предвзятым\" (содержит мнение, эмоции или односторонний взгляд).",
        optionNeutral: "Нейтрально",
        optionBiased: "Предвзято",
        checkAnswersButton: "Проверить ответы",
        feedbackCorrect: "Верно!",
        feedbackIncorrect: "Неверно.",
        resultAllCorrect: "Великолепно! Вы отлично распознаете предвзятость!",
        resultSomeIncorrect: "Некоторые ответы неверны. Обратите внимание на выделенные фрагменты.",
        resultScore: "Ваш результат:",
        snippet1_text: "Новые экономические реформы правительства привели к росту ВВП на 5% в прошлом квартале.",
        snippet2_text: "Эти так называемые 'реформы' только ухудшили жизнь простых людей, обогатив чиновников.",
        snippet3_text: "Туризм в Узбекистане показывает стабильный рост, привлекая посетителей историческими достопримечательностями.",
        snippet4_text: "Только наивный турист поедет в Узбекистан, не зная о всех проблемах этого региона.",
        snippet5_text: "Компания X объявила о запуске нового смартфона с улучшенной камерой и батареей.",
        snippet6_text: "Невероятный новый смартфон от Компании X просто взорвет рынок! Конкуренты в панике!"
    },
    en: {
        pageTitle: "Game: Find the Bias!",
        gameTitle: "Game: Find the Bias!",
        gameInstructions: "Read each text snippet and determine if it is \"Neutral\" (objective, unemotional) or \"Biased\" (contains opinion, emotion, or a one-sided view).",
        optionNeutral: "Neutral",
        optionBiased: "Biased",
        checkAnswersButton: "Check Answers",
        feedbackCorrect: "Correct!",
        feedbackIncorrect: "Incorrect.",
        resultAllCorrect: "Excellent! You're great at spotting bias!",
        resultSomeIncorrect: "Some answers are incorrect. Pay attention to the highlighted snippets.",
        resultScore: "Your score:",
        snippet1_text: "The government's new economic reforms led to a 5% GDP growth last quarter.",
        snippet2_text: "These so-called 'reforms' have only worsened the lives of ordinary people while enriching officials.",
        snippet3_text: "Tourism in Uzbekistan shows steady growth, attracting visitors with historical sites.",
        snippet4_text: "Only a naive tourist would travel to Uzbekistan without knowing about all the problems in the region.",
        snippet5_text: "Company X announced the launch of a new smartphone with an improved camera and battery.",
        snippet6_text: "The incredible new smartphone from Company X will simply blow up the market! Competitors are panicking!"
    }
};

// Game data: Array of text snippets with their correct answers
const gameSnippets = [
    { id: 'snippet1', correctAnswer: 'neutral', text_key: 'snippet1_text' },
    { id: 'snippet2', correctAnswer: 'biased', text_key: 'snippet2_text' },
    { id: 'snippet3', correctAnswer: 'neutral', text_key: 'snippet3_text' },
    { id: 'snippet4', correctAnswer: 'biased', text_key: 'snippet4_text' },
    { id: 'snippet5', correctAnswer: 'neutral', text_key: 'snippet5_text' },
    { id: 'snippet6', correctAnswer: 'biased', text_key: 'snippet6_text' }
];

export default function FindBiasGame() {
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');
    const [userAnswers, setUserAnswers] = useState({});
    const [results, setResults] = useState({ feedback: '', score: null, details: {} });

    useEffect(() => {
        document.title = translations[lang].pageTitle;
        const handleStorageChange = (event) => {
            if (event.key === 'logiclingua-lang') {
                const newLang = event.newValue || 'ru';
                setLang(newLang);
                setUserAnswers({});
                setResults({ feedback: '', score: null, details: {} });
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [lang]);

    const handleAnswerChange = (snippetId, answer) => {
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [snippetId]: answer
        }));
    };

    const checkAnswers = () => {
        let correctCount = 0;
        const newResultDetails = {};

        gameSnippets.forEach(snippet => {
            if (userAnswers[snippet.id] === snippet.correctAnswer) {
                correctCount++;
                newResultDetails[snippet.id] = 'correct';
            } else {
                newResultDetails[snippet.id] = 'incorrect';
            }
        });

        const t = translations[lang];
        if (correctCount === gameSnippets.length) {
            setResults({
                feedback: t.resultAllCorrect,
                score: correctCount,
                details: newResultDetails
            });
        } else {
            setResults({
                feedback: `${t.resultScore} ${correctCount} / ${gameSnippets.length}. ${t.resultSomeIncorrect}`,
                score: correctCount,
                details: newResultDetails
            });
        }
    };

    const getSnippetClass = (snippetId) => {
        const result = results.details[snippetId];
        if (result === 'correct') {
            return 'border-l-4 border-green-500 bg-green-50';
        }
        if (result === 'incorrect') {
            return 'border-l-4 border-red-500 bg-red-50';
        }
        return 'border-l-4 border-transparent';
    };
    
    const getFeedbackText = (snippetId) => {
        const result = results.details[snippetId];
        const t = translations[lang];
        if (result === 'correct') {
            return { text: t.feedbackCorrect, className: 'text-green-600' };
        }
        if (result === 'incorrect') {
             return { text: t.feedbackIncorrect, className: 'text-red-600' };
        }
        return null;
    }

    const t = translations[lang];

    return (
        <main className="container mx-auto px-6 py-12 flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full">
                <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">{t.gameTitle}</h1>
                <p className="text-gray-600 mb-8 text-center">{t.gameInstructions}</p>

                <div id="snippets-container" className="space-y-6">
                    {gameSnippets.map((snippet, index) => {
                        const feedback = getFeedbackText(snippet.id);
                        return (
                             <div key={snippet.id} className={`p-6 rounded-lg transition-all ${getSnippetClass(snippet.id)}`}>
                                <p className="snippet-text text-base italic text-gray-700 mb-4 pl-4 border-l-2 border-gray-300">
                                    {`${index + 1}. "${t[snippet.text_key]}"`}
                                </p>
                                <div className="flex items-center justify-start space-x-6">
                                    <label className="radio-label cursor-pointer flex items-center">
                                        <input
                                            type="radio"
                                            name={snippet.id}
                                            value="neutral"
                                            checked={userAnswers[snippet.id] === 'neutral'}
                                            onChange={() => handleAnswerChange(snippet.id, 'neutral')}
                                            className="form-radio h-5 w-5 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="ml-2 text-gray-700">{t.optionNeutral}</span>
                                    </label>
                                    <label className="radio-label cursor-pointer flex items-center">
                                        <input
                                            type="radio"
                                            name={snippet.id}
                                            value="biased"
                                            checked={userAnswers[snippet.id] === 'biased'}
                                            onChange={() => handleAnswerChange(snippet.id, 'biased')}
                                            className="form-radio h-5 w-5 text-red-600 focus:ring-red-500"
                                        />
                                        <span className="ml-2 text-gray-700">{t.optionBiased}</span>
                                    </label>
                                </div>
                                {feedback && (
                                    <p className={`feedback-text mt-3 font-semibold ${feedback.className}`}>
                                        {feedback.text}
                                    </p>
                                )}
                            </div>
                        )
                    })}
                </div>

                <button
                    onClick={checkAnswers}
                    className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                    {t.checkAnswersButton}
                </button>

                 {results.feedback && (
                    <div className={`mt-6 text-center text-lg font-semibold ${results.score === gameSnippets.length ? 'text-green-600' : 'text-red-600'}`}>
                        {results.feedback}
                    </div>
                )}
            </div>
        </main>
    );
}
