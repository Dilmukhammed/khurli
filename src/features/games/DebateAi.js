import React, { useState, useEffect, useCallback } from 'react';
import moduleService from '../../services/moduleService'; // Import moduleService
import AiChatWindow from '../../components/common/AiChatWindow'; // Import AiChatWindow

// Translations and game data for the Debate with AI game
const gameData = {
    ru: {
        pageTitle: "Игра: Дебаты с ИИ",
        gameTitle: "Игра: Дебаты с ИИ",
        gameInstructions: "ИИ представит аргумент по заданной теме. Ваша задача — написать убедительный контраргумент.",
        debateTopicTitle: "Тема Дебатов:",
        aiName: "ИИ",
        userName: "Вы",
        inputLabel: "Ваш контраргумент:",
        inputPlaceholder: "Введите ваш ответ здесь...",
        submitButton: "Отправить аргумент",
        topic: "Онлайн-образование полностью заменит традиционное обучение в университетах в ближайшие 10 лет.",
        ai_argument: "Онлайн-образование более гибкое, доступное и часто дешевле. С развитием технологий виртуальной реальности и интерактивных платформ оно сможет обеспечить даже более качественный опыт, чем очное обучение.",
        ai_response: "Спасибо за ваш аргумент. Вы поднимаете важные вопросы о ценности личного взаимодействия и практического опыта. Действительно, полное замещение маловероятно, но гибридные модели могут стать доминирующими.",
        discussWithAiButton: "Обсудить с ИИ",
        aiThinking: "ИИ думает...",
        closeAiChatButton: "Закрыть чат",
    },
    en: {
        pageTitle: "Game: Debate with AI",
        gameTitle: "Game: Debate with AI",
        gameInstructions: "The AI will present an argument on a given topic. Your task is to write a convincing counter-argument.",
        debateTopicTitle: "Debate Topic:",
        aiName: "AI",
        userName: "You",
        inputLabel: "Your Counter-Argument:",
        inputPlaceholder: "Enter your response here...",
        submitButton: "Submit Argument",
        topic: "Online education will completely replace traditional university learning in the next 10 years.",
        ai_argument: "Online education is more flexible, accessible, and often cheaper. With advancements in VR and interactive platforms, it can provide an even better experience than in-person learning.",
        ai_response: "Thank you for your argument. You raise important points about the value of personal interaction and practical experience. Indeed, complete replacement is unlikely, but hybrid models may become dominant.",
        discussWithAiButton: "Discuss with AI",
        aiThinking: "AI Thinking...",
        closeAiChatButton: "Close AI Chat",
    }
};

export default function DebateAiGame() {
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');

    // User's single main counter-argument
    const [userCounterArgument, setUserCounterArgument] = useState('');
    // Has the user submitted their main counter-argument?
    const [isUserArgumentSubmitted, setIsUserArgumentSubmitted] = useState(false);

    // AI Discussion Chat States (post-submission)
    const [showDiscussAiButton, setShowDiscussAiButton] = useState(false);
    const [activeAiChat, setActiveAiChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);

    // General Loading and Error states (can be shared by initial submission if it involved AI, but here it's for the discussion part)
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');

    // Effect to initialize or reset the game on language change
    useEffect(() => {
        const t = gameData[lang];
        document.title = t.pageTitle;

        // Reset game state on language change
        setUserCounterArgument('');
        setIsUserArgumentSubmitted(false);
        setShowDiscussAiButton(false);
        setActiveAiChat(false);
        setChatMessages([]);
        setIsAiLoading(false);
        setAiError('');

        const handleStorageChange = (event) => {
            if (event.key === 'logiclingua-lang') {
                const newLang = event.newValue || 'ru';
                setLang(newLang);
                // Game state is reset above based on `lang` dependency
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [lang]);

    // Placeholder for new logic, to be filled in subsequent steps
    // const handleSubmitCounterArgument = () => { ... };
    // const getTaskDetailsForAI_DebateDiscussion = useCallback(() => { ... }, [lang, userCounterArgument]);
    // const handleAskAIDebateDiscussion = useCallback(async (userQuery = '') => { ... }, [isAiLoading, getTaskDetailsForAI_DebateDiscussion, lang, aiChatMessages]);

    const getTaskDetailsForAI_DebateDiscussion = useCallback(() => {
        const t = gameData[lang];
        const contextParts = [
            `Game: ${t.gameTitle}`,
            `Instructions: ${t.gameInstructions}`,
            `Debate Topic: ${t.topic}`,
            `AI's Initial Argument: "${t.ai_argument}"`,
            `User's Counter-Argument: "${userCounterArgument}"`
        ];

        return {
            block_context: contextParts.join('\n\n'),
            // user_inputs could be the user's counter-argument again, or just rely on block_context and chat history for discussion
            user_inputs: [`User's Counter-Argument: "${userCounterArgument}"`],
            // TODO: Backend should ideally support a specific type like 'discuss_debate_summary' for this phase.
            // Using 'discuss_open_ended' (original fallback for this game file) for now.
            interaction_type: 'discuss_open_ended'
        };
    }, [lang, userCounterArgument]); // Removed gameData from deps as it's not reactive state/prop

    const handleAskAIDebateDiscussion = useCallback(async (userQuery = '') => {
        if (isAiLoading) return;
        setIsAiLoading(true);
        setActiveAiChat(true);
        setAiError('');
        const t = gameData[lang]; // For "AI Thinking..." message
        

        try {
            const { block_context, user_inputs: initial_user_inputs, interaction_type } = getTaskDetailsForAI_DebateDiscussion();

            // Filter out "Thinking..." for API call
            if (userQuery) { // Ensure current userQuery is part of messagesForApi
                setChatMessages(prev => [...prev, { "role": 'user', "content": userQuery }]);
            }

            const response = await moduleService.getGenericAiInteraction({
                module_id: 'game-debate-ai',
                task_id: 'discuss_user_statement', // Task ID for this discussion phase
                interaction_type, // This will be 'discuss_debate_summary' or placeholder
                block_context,
                user_inputs: initial_user_inputs, // If userQuery is present, it's the main input, else use context from getTaskDetails
                userQuery, 
                chatMessages
            });

            setChatMessages(prev => [
                ...prev.filter(msg => msg.content !== (t.aiThinking || 'Thinking...')),
                { "role": 'assistant', "content": response.explanation }
            ]);

        } catch (error) {
            console.error('Error fetching AI for Debate Discussion:', error);
            const errorMsg = error.message || 'Failed to get AI response.';
            setChatMessages(prev => [
                ...prev.filter(msg => msg.content !== (t.aiThinking || 'Thinking...')),
                { "role": 'assistant', "content": `Sorry, I encountered an error: ${errorMsg}` }
            ]);
            setAiError(errorMsg);
        } finally {
            setIsAiLoading(false);
        }
    }, [isAiLoading, getTaskDetailsForAI_DebateDiscussion, lang, chatMessages, userCounterArgument]);


    const handleSubmitCounterArgument = () => {
        if (userCounterArgument.trim()) {
            setIsUserArgumentSubmitted(true);
            setShowDiscussAiButton(true);
            // Reset chat states for new discussion
            setActiveAiChat(false);
            setChatMessages([]);
            setAiError('');
        } else {
            // Consider using a more integrated notification system if available, instead of alert.
            // For now, alert is based on the previous structure.
            alert(gameData[lang].inputPlaceholder); // Access gameData directly as 't' might not be in scope here
        }
    };

    const t = gameData[lang];

    return (
        <main className="container mx-auto px-6 py-12 flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full">
                <h1 className="text-3xl font-bold text-yellow-700 mb-4 text-center">{t.gameTitle}</h1>
                <p className="text-gray-600 mb-6 text-center">{t.gameInstructions}</p>

                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{t.debateTopicTitle}</h2>
                    <p className="text-indigo-600 font-medium">{t.topic}</p>
                </div>

                {/* Display AI's initial argument */}
                <div className="mb-6 p-4 border border-indigo-200 rounded-lg bg-indigo-50">
                    <h3 className="text-md font-semibold text-indigo-700 mb-1">{t.aiName}'s Initial Argument:</h3>
                    <p className="text-indigo-800 whitespace-pre-wrap">{t.ai_argument}</p>
                </div>

                {aiError && !activeAiChat && <p className="text-red-500 text-sm text-center my-2">{aiError}</p>}

                {!isUserArgumentSubmitted ? (
                    <div id="user-counter-argument-area" className="mt-6">
                        <label htmlFor="user-counter-argument-input" className="block text-sm font-medium text-gray-700 mb-1">{t.inputLabel}</label>
                        <textarea
                            id="user-counter-argument-input"
                            value={userCounterArgument}
                            onChange={(e) => setUserCounterArgument(e.target.value)}
                            className="w-full min-h-[150px] p-3 border border-gray-300 rounded-md resize-vertical text-sm focus:ring-yellow-500 focus:border-yellow-500"
                            placeholder={t.inputPlaceholder}
                        />
                        <button
                            onClick={handleSubmitCounterArgument} // To be implemented fully in next step
                            className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-50"
                            disabled={!userCounterArgument.trim()}
                        >
                            {t.submitButton}
                        </button>
                    </div>
                ) : (
                    // This area will show the user's submitted argument and then the "Discuss with AI" button / AI Chat Window
                    <div className="mt-6">
                        <div className="mb-4 p-4 border border-green-200 rounded-lg bg-green-50">
                            <h3 className="text-md font-semibold text-green-700 mb-1">Your Counter-Argument:</h3>
                            <p className="text-green-800 whitespace-pre-wrap">{userCounterArgument}</p>
                        </div>

                        {/* "Discuss with AI" button appears if argument submitted, no active chat, and no critical error preventing discussion */}
                        {showDiscussAiButton && !activeAiChat && !aiError && (
                            <button
                                onClick={() => handleAskAIDebateDiscussion()} // Initial call to start discussion
                                disabled={isAiLoading}
                                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                            >
                                {t.discussWithAiButton}
                            </button>
                        )}
                        {/* Display general AI error if discussion button was shown but failed, and chat is not active */}
                        {showDiscussAiButton && aiError && !activeAiChat && (
                            <p className="mt-4 text-center text-red-600">{aiError}</p>
                        )}

                        {/* AI Chat Window for discussion phase */}
                        {activeAiChat && (
                            <div className="mt-6 p-4 border-t border-gray-200">
                                <AiChatWindow
                                    messages={chatMessages}
                                    isLoading={isAiLoading}
                                    onSendMessage={(message) => handleAskAIDebateDiscussion(message)}
                                />
                                {/* Display error within chat window if it occurs during an active chat */}
                                {aiError && <p className="mt-2 text-sm text-red-500">{`Error: ${aiError}`}</p>}
                                <button
                                    onClick={() => {
                                        setActiveAiChat(false);
                                        // Optionally clear chat messages and error when chat is closed:
                                        // setAiChatMessages([]);
                                        // setAiError('');
                                    }}
                                    className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                                >
                                    {t.closeAiChatButton}
                                </button>
                            </div>
                        )}
                    </div>
                )}
                 {/* Error display specifically for AI chat window issues, if any, can be placed inside the activeAiChat block later */}
            </div>
        </main>
    );
}
