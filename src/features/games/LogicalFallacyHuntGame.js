import React, { useState, useEffect, useCallback } from 'react'; // Add useCallback
import moduleService from '../../services/moduleService'; // ASSUMED IMPORT
import AiChatWindow from '../../components/common/AiChatWindow'; // ASSUMED IMPORT

// Translations and game data for the Logical Fallacy Hunt game
const gameData = {
    ru: {
        pageTitle: "Игра: Охота на Логические Ошибки",
        gameTitle: "Игра: Охота на Логические Ошибки",
        gameInstructions: "Прочитайте каждый аргумент и определите, какая логическая ошибка в нем допущена. Выберите наиболее подходящий вариант.",
        checkAnswersButton: "Проверить ответы",
        feedbackCorrect: "Верно!",
        feedbackIncorrect: "Неверно.",
        feedbackExplanation: "Пояснение:",
        resultAllCorrect: "Превосходно! Вы мастерски находите логические ошибки!",
        resultSomeIncorrect: "Некоторые ошибки определены неверно. Посмотрите пояснения.",
        resultScore: "Ваш результат:",
        fallacy_ad_hominem: "Ad Hominem (Атака на личность)",
        fallacy_ad_hominem_desc: "Нападение на оппонента, а не на его аргумент.",
        fallacy_straw_man: "Straw Man (Соломенное чучело)",
        fallacy_straw_man_desc: "Искажение аргумента оппонента, чтобы его было легче атаковать.",
        fallacy_slippery_slope: "Slippery Slope (Скользкая дорожка)",
        fallacy_slippery_slope_desc: "Утверждение, что небольшое действие неизбежно приведет к цепи негативных последствий.",
        fallacy_hasty_generalization: "Hasty Generalization (Поспешное обобщение)",
        fallacy_hasty_generalization_desc: "Вывод, сделанный на основе недостаточного количества примеров.",
        fallacy_false_dilemma: "False Dilemma (Ложная дилемма)",
        fallacy_false_dilemma_desc: "Представление только двух вариантов, когда на самом деле их больше.",
        fallacy_appeal_to_emotion: "Appeal to Emotion (Апелляция к эмоциям)",
        fallacy_appeal_to_emotion_desc: "Манипулирование эмоциями вместо использования логического довода.",
        argument1_text: "Не слушайте его советы по экономике, он даже одевается безвкусно!",
        argument1_explanation: "Здесь атакуют внешний вид оппонента, а не его экономические аргументы.",
        argument2_text: "Сторонники ужесточения экологических норм просто хотят остановить весь промышленный прогресс и вернуть нас в каменный век!",
        argument2_explanation: "Позиция сторонников искажена и доведена до абсурда для легкой критики.",
        argument3_text: "Если мы разрешим студентам выбирать один факультатив свободно, скоро они вообще перестанут ходить на обязательные занятия!",
        argument3_explanation: "Предполагается цепь негативных событий без достаточных оснований.",
        argument4_text: "Я попробовал плов в одном ресторане Ташкента, и он был невкусный. Значит, весь узбекский плов плохой.",
        argument4_explanation: "Вывод обо всем плове сделан на основе одного неудачного опыта.",
        argument5_text: "Либо вы полностью поддерживаете новую реформу образования, либо вы против будущего нашей страны.",
        argument5_explanation: "Предлагается только два крайних варианта, игнорируя возможные промежуточные позиции или альтернативы.",
        argument6_text: "Подумайте о несчастных бездомных животных! Мы просто обязаны немедленно построить еще 10 приютов, иначе вы бессердечны!",
        argument6_explanation: "Аргумент давит на жалость, а не предлагает логическое обоснование необходимости именно 10 приютов немедленно.",
        askAiButton: "Спросить ИИ",
        aiThinking: "ИИ думает...",
        closeAiChatButton: "Закрыть чат",
    },
    en: {
        pageTitle: "Game: Logical Fallacy Hunt",
        gameTitle: "Game: Logical Fallacy Hunt",
        gameInstructions: "Read each argument and identify the logical fallacy committed. Choose the most appropriate option.",
        checkAnswersButton: "Check Answers",
        feedbackCorrect: "Correct!",
        feedbackIncorrect: "Incorrect.",
        feedbackExplanation: "Explanation:",
        resultAllCorrect: "Excellent! You're a master at spotting logical fallacies!",
        resultSomeIncorrect: "Some fallacies were identified incorrectly. Check the explanations.",
        resultScore: "Your score:",
        fallacy_ad_hominem: "Ad Hominem",
        fallacy_ad_hominem_desc: "Attacking the opponent instead of their argument.",
        fallacy_straw_man: "Straw Man",
        fallacy_straw_man_desc: "Misrepresenting an opponent's argument to make it easier to attack.",
        fallacy_slippery_slope: "Slippery Slope",
        fallacy_slippery_slope_desc: "Claiming a small action will inevitably lead to a chain of negative consequences.",
        fallacy_hasty_generalization: "Hasty Generalization",
        fallacy_hasty_generalization_desc: "Drawing a conclusion based on insufficient evidence or examples.",
        fallacy_false_dilemma: "False Dilemma",
        fallacy_false_dilemma_desc: "Presenting only two options when more exist.",
        fallacy_appeal_to_emotion: "Appeal to Emotion",
        fallacy_appeal_to_emotion_desc: "Manipulating emotions instead of using a valid logical argument.",
        argument1_text: "Don't listen to his economic advice, he dresses poorly!",
        argument1_explanation: "This attacks the opponent's appearance, not their economic arguments.",
        argument2_text: "Supporters of stricter environmental regulations just want to stop all industrial progress and send us back to the stone age!",
        argument2_explanation: "The supporters' position is misrepresented and exaggerated for easy criticism.",
        argument3_text: "If we allow students to choose one elective freely, soon they'll stop attending mandatory classes altogether!",
        argument3_explanation: "A chain of negative events is assumed without sufficient reasoning.",
        argument4_text: "I tried plov at one restaurant in Tashkent, and it was bad. Therefore, all Uzbek plov is bad.",
        argument4_explanation: "A conclusion about all plov is drawn from a single negative experience.",
        argument5_text: "Either you fully support the new education reform, or you are against the future of our country.",
        argument5_explanation: "Only two extreme options are presented, ignoring possible middle grounds or alternatives.",
        argument6_text: "Think of the poor homeless animals! We absolutely must build 10 more shelters immediately, or you are heartless!",
        argument6_explanation: "The argument appeals to pity rather than providing logical reasoning for needing exactly 10 shelters immediately.",
        askAiButton: "Ask AI",
        aiThinking: "AI Thinking...",
        closeAiChatButton: "Close AI Chat",
    }
};

const gameArguments = [
    { id: 'arg1', text_key: 'argument1_text', correctAnswer: 'fallacy_ad_hominem', explanation_key: 'argument1_explanation' },
    { id: 'arg2', text_key: 'argument2_text', correctAnswer: 'fallacy_straw_man', explanation_key: 'argument2_explanation' },
    { id: 'arg3', text_key: 'argument3_text', correctAnswer: 'fallacy_slippery_slope', explanation_key: 'argument3_explanation' },
    { id: 'arg4', text_key: 'argument4_text', correctAnswer: 'fallacy_hasty_generalization', explanation_key: 'argument4_explanation' },
    { id: 'arg5', text_key: 'argument5_text', correctAnswer: 'fallacy_false_dilemma', explanation_key: 'argument5_explanation' },
    { id: 'arg6', text_key: 'argument6_text', correctAnswer: 'fallacy_appeal_to_emotion', explanation_key: 'argument6_explanation' }
];

const allFallacies = [
    'fallacy_ad_hominem', 'fallacy_straw_man', 'fallacy_slippery_slope',
    'fallacy_hasty_generalization', 'fallacy_false_dilemma', 'fallacy_appeal_to_emotion'
];

export default function LogicalFallacyHuntGame() {
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');
    const [userAnswers, setUserAnswers] = useState({});
    const [results, setResults] = useState({ feedback: '', score: null, details: {} });
    const [showMainAiButton, setShowMainAiButton] = useState(false);
    const [activeChat, setActiveChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [currentError, setCurrentError] = useState('');

    useEffect(() => {
        const t = gameData[lang];
        document.title = t.pageTitle;
        const handleStorageChange = (event) => {
            if (event.key === 'logiclingua-lang') {
                setLang(event.newValue || 'ru');
                setUserAnswers({});
                setResults({ feedback: '', score: null, details: {} });
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [lang]);

    const handleAnswerChange = (argumentId, fallacyKey) => {
        setUserAnswers(prev => ({ ...prev, [argumentId]: fallacyKey }));
    };

    const handleCheckAnswersAndEnableAI = () => {
        let correctCount = 0;
        const newResultDetails = {};
        gameArguments.forEach(arg => {
            if (userAnswers[arg.id] === arg.correctAnswer) {
                correctCount++;
                newResultDetails[arg.id] = 'correct';
            } else {
                newResultDetails[arg.id] = 'incorrect';
            }
        });

        const t = gameData[lang];
        if (correctCount === gameArguments.length) {
            setResults({ feedback: t.resultAllCorrect, score: correctCount, details: newResultDetails });
        } else {
            setResults({
                feedback: `${t.resultScore} ${correctCount} / ${gameArguments.length}. ${t.resultSomeIncorrect}`,
                score: correctCount,
                details: newResultDetails
            });
        }
        setShowMainAiButton(true);
        setActiveChat(false);
        setChatMessages([]);
        setCurrentError('');
    };

    const getTaskDetailsForAI_LogicalFallacy = useCallback(() => {
        const t = gameData[lang];
        const contextParts = [
            `Game: ${t.gameTitle}`,
            `Instructions: ${t.gameInstructions}`,
            "Arguments and Fallacies presented:"
        ];
        allFallacies.forEach(fallacyKey => {
            contextParts.push(`- ${t[fallacyKey]}: ${t[fallacyKey + '_desc']}`);
        });
        contextParts.push("\nUser's attempt:");

        const userAnswersFormatted = gameArguments.map((arg, index) => {
            const userAnswerKey = userAnswers[arg.id] || 'Not answered';
            const userAnswerText = userAnswerKey === 'Not answered' ? 'Not answered' : t[userAnswerKey];
            const correctAnswerText = t[arg.correctAnswer];
            const isCorrect = userAnswerKey === arg.correctAnswer ? 'Correct' : 'Incorrect';
            return `Argument ${index + 1} ("${t[arg.text_key].substring(0, 50)}..."):
You answered: '${userAnswerText}'
Correct fallacy: '${correctAnswerText}'
Your assessment: ${isCorrect}
Explanation: ${t[arg.explanation_key]}`;
        }).join('\n\n');

        let resultsSummary = "User has not checked answers yet.";
        if (results && results.feedback) {
            resultsSummary = `User's results: ${results.feedback}`;
        }

        return {
            block_context: contextParts.join('\n'),
            user_inputs: [userAnswersFormatted, `Results Summary: ${resultsSummary}`], // Key changed to user_inputs
            interaction_type: 'discuss_game_logical_fallacy'
        };
    }, [lang, userAnswers, results]);

    const handleAskAI_LogicalFallacy = useCallback(async (userQuery = '') => {
        if (isAiLoading) return;
        setIsAiLoading(true);
        setActiveChat(true);
        setCurrentError('');
        const t = gameData[lang];
        const thinkingMsg = { "role": 'assistant', "content": t.aiThinking || 'Thinking...' };

        if (userQuery) {
                setChatMessages(prev => [...prev, { "role": 'user', "content": userQuery }]);
            }

        try {
            const { block_context, user_inputs, interaction_type } = getTaskDetailsForAI_LogicalFallacy();

            const response = await moduleService.getGenericAiInteraction({
                module_id: 'game-logical-fallacy',
                task_id: 'main_game',
                interaction_type,
                block_context,
                user_inputs, // Ensure this key is user_inputs
                userQuery,
                chatMessages,
            });

            setChatMessages(prev => [
                ...prev.filter(msg => msg["content"] !== (t.aiThinking || 'Thinking...')),
                { "role": 'assistant', "content": response.explanation }
            ]);
        } catch (error) {
            console.error('Error fetching AI for LogicalFallacyHuntGame:', error);
            const errorMsg = error.message || 'Failed to get AI response.';
            setChatMessages(prev => [
                ...prev.filter(msg => msg["content"] !== (t.aiThinking || 'Thinking...')),
                { "role": 'assistant', "content": `Sorry, I encountered an error: ${errorMsg}` }
            ]);
            setCurrentError(errorMsg);
        } finally {
            setIsAiLoading(false);
        }
    }, [isAiLoading, getTaskDetailsForAI_LogicalFallacy, lang]);
    
    const t = gameData[lang];

    return (
        <main className="container mx-auto px-6 py-12 flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full">
                <h1 className="text-3xl font-bold text-purple-700 mb-4 text-center">{t.gameTitle}</h1>
                <p className="text-gray-600 mb-8 text-center">{t.gameInstructions}</p>

                <div id="arguments-container" className="space-y-8">
                    {gameArguments.map((arg, index) => {
                         const result = results.details[arg.id];
                        return (
                             <div key={arg.id} className={`argument-card p-6 rounded-lg border-l-4 transition-all ${
                                 result === 'correct' ? 'border-indigo-500' : result === 'incorrect' ? 'border-red-400' : 'border-transparent'
                             }`}>
                                <p className="argument-text text-base italic text-gray-700 mb-4 p-3 bg-gray-50 rounded border-l-3 border-gray-400">
                                    {`${index + 1}. "${t[arg.text_key]}"`}
                                </p>
                                <div className="fallacy-options mt-4 space-y-2">
                                    {allFallacies.map(fallacyKey => (
                                        <label key={fallacyKey} className={`fallacy-option-label block p-3 border rounded-md cursor-pointer transition-all ${
                                            userAnswers[arg.id] === fallacyKey ? 'bg-indigo-100 border-indigo-300 font-medium' : 'hover:bg-sky-50 hover:border-sky-300'
                                        }`}>
                                            <input
                                                type="radio"
                                                name={arg.id}
                                                value={fallacyKey}
                                                checked={userAnswers[arg.id] === fallacyKey}
                                                onChange={() => handleAnswerChange(arg.id, fallacyKey)}
                                                className="mr-3 accent-indigo-600"
                                            />
                                            <span className="fallacy-name font-semibold text-gray-800">{t[fallacyKey]}</span>
                                            <span className="fallacy-desc ml-2 text-gray-500 text-sm">{`(${t[fallacyKey + '_desc']})`}</span>
                                        </label>
                                    ))}
                                </div>
                                {result && (
                                    <div className={`feedback-explanation mt-3 p-3 rounded-md text-sm ${
                                        result === 'correct' 
                                        ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500' 
                                        : 'bg-rose-50 text-rose-800 border-l-4 border-rose-500'
                                    }`}>
                                        <p><span className="font-bold">{result === 'correct' ? t.feedbackCorrect : t.feedbackIncorrect}</span> {t.feedbackExplanation} {t[arg.explanation_key]}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                <div> {/* ADDED WRAPPER */}
                    <button
                        onClick={handleCheckAnswersAndEnableAI} // MODIFIED
                        className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                    >
                        {t.checkAnswersButton}
                    </button>
                </div>

                {results.feedback && (
                    <div className={`mt-6 text-center text-lg font-semibold ${results.score === gameArguments.length ? 'text-emerald-600' : 'text-red-600'}`}>
                        {results.feedback}
                    </div>
                )}

                {showMainAiButton && !currentError && (
                    <div> {/* Wrapper for Ask AI button */}
                        <button
                            onClick={() => handleAskAI_LogicalFallacy()}
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
                            onSendMessage={(message) => handleAskAI_LogicalFallacy(message)}
                        />
                        <button
                            onClick={() => {
                                setActiveChat(false);
                            }}
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
