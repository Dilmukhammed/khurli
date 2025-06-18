import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import moduleService from '../../services/moduleService'; // ASSUMED IMPORT
import AiChatWindow from '../../components/common/AiChatWindow'; // ASSUMED IMPORT

// Translations for the game component
const translations = {
    ru: {
        pageTitle: "Игра: Факт или Фейк?",
        gameTitle: "Игра: Факт или Фейк?",
        gameInstructions: "Прочитайте каждый заголовок и определите, является ли он \"Фактом\" (реальной, проверяемой новостью) или \"Фейком\" (вымышленной или ложной информацией).",
        optionFact: "Факт",
        optionFake: "Фейк",
        checkAnswersButton: "Проверить ответы",
        resultAllCorrect: "Отлично! Все ответы верны!",
        resultSomeIncorrect: "Некоторые ответы неверны. Попробуйте еще раз!",
        resultScore: "Ваш результат:",
        headline1_text: "Ученые обнаружили новый вид бабочек в горах Чимгана, способный менять цвет.",
        headline2_text: "В Ташкенте открылся первый ресторан, полностью обслуживаемый роботами.",
        headline3_text: "Узбекистан объявил о планах построить самый высокий небоскреб в Центральной Азии к 2030 году.",
        headline4_text: "Древний артефакт, найденный в Самарканде, доказывает контакт с внеземными цивилизациями.",
        headline5_text: "Национальная авиакомпания Uzbekistan Airways добавила три новых прямых рейса в города Европы в этом году.",
        askAiButton: "Спросить ИИ",
        aiThinking: "ИИ думает...",
        closeAiChatButton: "Закрыть чат",
    },
    en: {
        pageTitle: "Game: Fact or Fake?",
        gameTitle: "Game: Fact or Fake?",
        gameInstructions: "Read each headline and determine if it is a \"Fact\" (real, verifiable news) or \"Fake\" (fictional or false information).",
        optionFact: "Fact",
        optionFake: "Fake",
        checkAnswersButton: "Check Answers",
        resultAllCorrect: "Excellent! All answers are correct!",
        resultSomeIncorrect: "Some answers are incorrect. Try again!",
        resultScore: "Your score:",
        headline1_text: "Scientists discovered a new butterfly species in the Chimgan mountains capable of changing color.",
        headline2_text: "The first robot-only restaurant opened in Tashkent.",
        headline3_text: "Uzbekistan announced plans to build the tallest skyscraper in Central Asia by 2030.",
        headline4_text: "An ancient artifact found in Samarkand proves contact with extraterrestrial civilizations.",
        headline5_text: "The national airline Uzbekistan Airways added three new direct flights to European cities this year.",
        askAiButton: "Ask AI",
        aiThinking: "AI Thinking...",
        closeAiChatButton: "Close AI Chat",
    }
};

// Game data: Array of headline objects with their correct answers.
// 'real' for a true headline (Fact), 'fake' for a fictional one (Fake).
const gameHeadlines = [
    { id: 'headline1', correctAnswer: 'fake', text_key: 'headline1_text' },
    { id: 'headline2', correctAnswer: 'fake', text_key: 'headline2_text' },
    { id: 'headline3', correctAnswer: 'fake', text_key: 'headline3_text' },
    { id: 'headline4', correctAnswer: 'fake', text_key: 'headline4_text' },
    { id: 'headline5', correctAnswer: 'real', text_key: 'headline5_text' }
];

export default function FactOrFakeGame() {
    // State to manage the current language, synced with localStorage
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');
    // State to store the user's answers for each headline
    const [userAnswers, setUserAnswers] = useState({});
    // State to store the results after checking answers
    const [results, setResults] = useState({ feedback: '', score: null, details: {} });
    const [showMainAiButton, setShowMainAiButton] = useState(false);
    const [activeChat, setActiveChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [currentError, setCurrentError] = useState('');

    // Effect to update component language if it changes in another tab
    useEffect(() => {
        document.title = translations[lang].pageTitle;
        const handleStorageChange = (event) => {
            if (event.key === 'logiclingua-lang') {
                const newLang = event.newValue || 'ru';
                setLang(newLang);
                // Reset game state on language change
                setUserAnswers({});
                setResults({ feedback: '', score: null, details: {} });
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [lang]);

    const handleAnswerChange = (headlineId, answer) => {
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [headlineId]: answer
        }));
    };

    const handleCheckAnswersAndEnableAI = () => {
        let correctCount = 0;
        const newResultDetails = {};

        gameHeadlines.forEach(headline => {
            if (userAnswers[headline.id] === headline.correctAnswer) {
                correctCount++;
                newResultDetails[headline.id] = 'correct';
            } else {
                newResultDetails[headline.id] = 'incorrect';
            }
        });

        const t = translations[lang];
        if (correctCount === gameHeadlines.length) {
            setResults({
                feedback: t.resultAllCorrect,
                score: correctCount,
                details: newResultDetails
            });
        } else {
            setResults({
                feedback: `${t.resultScore} ${correctCount} / ${gameHeadlines.length}. ${t.resultSomeIncorrect}`,
                score: correctCount,
                details: newResultDetails
            });
        }
        setShowMainAiButton(true);
        setActiveChat(false);
        setChatMessages([]);
        setCurrentError('');
    };

    const getTaskDetailsForAI_FactOrFake = useCallback(() => {
        const t = translations[lang];
        const contextParts = [
            `Game: ${t.gameTitle}`,
            `Instructions: ${t.gameInstructions}`,
            "Headlines presented to the user:"
        ];
        gameHeadlines.forEach((headline, index) => {
            contextParts.push(`${index + 1}. ${t[headline.text_key]}`);
        });

        const userAnswersFormatted = gameHeadlines.map((headline, index) => {
            const userAnswer = userAnswers[headline.id] || 'Not answered';
            const correctAnswer = headline.correctAnswer;
            const isCorrect = userAnswer === correctAnswer ? 'Correct' : 'Incorrect';
            return `Headline ${index + 1} ("${t[headline.text_key].substring(0, 30)}..."): You answered '${userAnswer}', Correct was '${correctAnswer}'. (${isCorrect})`;
        }).join('\n');

        let resultsSummary = "User has not checked answers yet.";
        if (results && results.feedback) {
            resultsSummary = `User's results: ${results.feedback}`;
        }

        return {
            block_context: contextParts.join('\n'),
            user_answers: [userAnswersFormatted, `Results Summary: ${resultsSummary}`],
            interaction_type: 'discuss_game_fact_or_fake'
        };
    }, [lang, userAnswers, results]);

    const handleAskAI_FactOrFake = useCallback(async (userQuery = '') => {
        if (isAiLoading) return;
        setIsAiLoading(true);
        setActiveChat(true);
        setCurrentError('');
        const t = translations[lang];
        const thinkingMsg = { sender: 'ai', text: t.aiThinking || 'Thinking...' };

        if (userQuery) {
            setChatMessages(prev => [...prev, { sender: 'user', text: userQuery }, thinkingMsg]);
        } else {
            setChatMessages([{ sender: 'ai', text: `You can ask about why certain headlines are facts or fakes, or discuss your results.` }, thinkingMsg]);
        }

        try {
            const { block_context, user_answers, interaction_type } = getTaskDetailsForAI_FactOrFake();

            const response = await moduleService.getGenericAiInteraction({
                module_id: 'game-fact-or-fake',
                task_id: 'main_game',
                interaction_type,
                block_context,
                user_answers,
                user_query
            });

            setChatMessages(prev => [
                ...prev.filter(msg => msg.text !== (t.aiThinking || 'Thinking...')),
                { sender: 'ai', text: response.explanation }
            ]);
        } catch (error) {
            console.error('Error fetching AI for FactOrFakeGame:', error);
            const errorMsg = error.message || 'Failed to get AI response.';
            setChatMessages(prev => [
                ...prev.filter(msg => msg.text !== (t.aiThinking || 'Thinking...')),
                { sender: 'ai', text: `Sorry, I encountered an error: ${errorMsg}` }
            ]);
            setCurrentError(errorMsg);
        } finally {
            setIsAiLoading(false);
        }
    }, [isAiLoading, getTaskDetailsForAI_FactOrFake, lang]);
    
    // Helper function to get the appropriate CSS class for a result
    const getResultClass = (headlineId) => {
        const result = results.details[headlineId];
        if (result === 'correct') {
            return 'border-green-500 bg-green-50';
        }
        if (result === 'incorrect') {
            return 'border-red-500 bg-red-50';
        }
        return 'border-gray-200';
    };

    const t = translations[lang];

    return (
        <main className="container mx-auto px-6 py-12 flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full">
                <h1 className="text-3xl font-bold text-indigo-700 mb-4 text-center">{t.gameTitle}</h1>
                <p className="text-gray-600 mb-8 text-center">{t.gameInstructions}</p>

                <div id="headlines-container" className="space-y-6">
                    {gameHeadlines.map((headline, index) => (
                        <div key={headline.id} className={`p-6 rounded-lg border-2 transition-all ${getResultClass(headline.id)}`}>
                            <p className="headline-text text-lg text-gray-800 mb-3">
                                {`${index + 1}. ${t[headline.text_key]}`}
                            </p>
                            <div className="flex items-center justify-start space-x-6">
                                <label className="radio-label cursor-pointer flex items-center">
                                    <input
                                        type="radio"
                                        name={headline.id}
                                        value="real"
                                        checked={userAnswers[headline.id] === 'real'}
                                        onChange={() => handleAnswerChange(headline.id, 'real')}
                                        className="form-radio h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-gray-700">{t.optionFact}</span>
                                </label>
                                <label className="radio-label cursor-pointer flex items-center">
                                    <input
                                        type="radio"
                                        name={headline.id}
                                        value="fake"
                                        checked={userAnswers[headline.id] === 'fake'}
                                        onChange={() => handleAnswerChange(headline.id, 'fake')}
                                        className="form-radio h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-gray-700">{t.optionFake}</span>
                                </label>
                                 {results.details[headline.id] === 'correct' && <span className="text-2xl">✔️</span>}
                                 {results.details[headline.id] === 'incorrect' && <span className="text-2xl">❌</span>}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleCheckAnswersAndEnableAI}
                    className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                    {t.checkAnswersButton}
                </button>

                {results.feedback && (
                    <div className={`mt-6 text-center text-lg font-semibold ${results.score === gameHeadlines.length ? 'text-green-600' : 'text-red-600'}`}>
                        {results.feedback}
                    </div>
                )}

                {showMainAiButton && !currentError && (
                    <div> {/* Wrapper for Ask AI button */}
                        <button
                            onClick={() => handleAskAI_FactOrFake()}
                            disabled={isAiLoading}
                            className="mt-4 w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                        >
                            {t.askAiButton}
                        </button>
                    </div>
                )}

                {currentError && <p className="mt-4 text-center text-red-600">{currentError}</p>}

                {activeChat && (
                    <div className="mt-6 p-4 border-t border-gray-200">
                        <AiChatWindow
                            messages={chatMessages}
                            isLoading={isAiLoading}
                            onSendMessage={(message) => handleAskAI_FactOrFake(message)}
                        />
                        <button
                            onClick={() => setActiveChat(false)}
                            className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                        >
                            {t.closeAiChatButton}
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
