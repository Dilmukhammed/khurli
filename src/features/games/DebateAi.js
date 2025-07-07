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
        ai_response: "Спасибо за ваш аргумент. Вы поднимаете важные вопросы о ценности личного взаимодействия и практического опыта. Действительно, полное замещение маловероятно, но гибридные модели могут стать доминирующими."
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
        ai_response: "Thank you for your argument. You raise important points about the value of personal interaction and practical experience. Indeed, complete replacement is unlikely, but hybrid models may become dominant."
    }
};

export default function DebateAiGame() {
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');
    // State to manage the conversation messages
    const [messages, setMessages] = useState([]); // Will store { role: 'user'/'assistant', content: string }
    // State for the user's current input (for the initial argument)
    const [initialUserInput, setInitialUserInput] = useState('');
    // State to control if the user has submitted their initial argument
    const [hasSubmittedInitial, setHasSubmittedInitial] = useState(false);
    // AI Loading and error states
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');


    // Effect to initialize or reset the game on language change
    useEffect(() => {
        const t = gameData[lang];
        document.title = t.pageTitle;
        // Initialize messages with AI's first argument
        setMessages([
            { role: 'assistant', content: t.ai_argument } // name property removed, role/content used
        ]);
        setInitialUserInput('');
        setHasSubmittedInitial(false);
        setIsAiLoading(false);
        setAiError('');

        const handleStorageChange = (event) => {
            if (event.key === 'logiclingua-lang') {
                setLang(event.newValue || 'ru');
                // Optionally, reset messages and other states here if a full language switch should restart the game
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [lang]);

    const handleInitialSubmit = async () => {
        if (initialUserInput.trim() && !hasSubmittedInitial) {
            const t = gameData[lang];
            const userMessage = { role: 'user', content: initialUserInput };
            const currentChatHistory = [...messages, userMessage];
            setMessages(currentChatHistory);
            setHasSubmittedInitial(true); // Prevents resubmitting initial argument
            setInitialUserInput(''); // Clear the initial input textarea
            setIsAiLoading(true);
            setAiError('');

            try {
                const requestData = {
                    module_id: 'game-debate-ai',
                    task_id: 'main_debate_turn_1', // Task ID for the first turn
                    interaction_type: 'game_debate_ai_turn',
                    block_context: `${t.gameInstructions}\nTopic: ${t.topic}\nInitial AI Argument: ${t.ai_argument}`,
                    user_inputs: [initialUserInput], // User's first counter-argument
                    chat_history: currentChatHistory.slice(0, -1), // History before user's current message
                };
                const response = await moduleService.getGenericAiInteraction(requestData);
                setMessages(prev => [...prev, { role: 'assistant', content: response.explanation }]);
            } catch (error) {
                console.error("Error getting AI response for initial debate argument:", error);
                setAiError(error.message || "Failed to get AI response.");
                // Optionally add an error message to chat
                setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message || "Failed to get AI response."}` }]);
            } finally {
                setIsAiLoading(false);
            }
        }
    };

    const handleSendMessageToAI = async (userQuery) => {
        if (userQuery.trim() === '' || isAiLoading) return;

        const t = gameData[lang];
        const newUserMessage = { role: 'user', content: userQuery };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setIsAiLoading(true);
        setAiError('');

        try {
            const requestData = {
                module_id: 'game-debate-ai',
                task_id: 'main_debate_follow_up', // Task ID for follow-up turns
                interaction_type: 'game_debate_ai_turn',
                block_context: `${t.gameInstructions}\nTopic: ${t.topic}\nInitial AI Argument: ${t.ai_argument}`, // Context can be refined
                user_inputs: [userQuery], // Current user query
                chat_history: updatedMessages.slice(0, -1), // History before this new user query
            };
            const response = await moduleService.getGenericAiInteraction(requestData);
            setMessages(prev => [...prev, { role: 'assistant', content: response.explanation }]);
        } catch (error) {
            console.error("Error getting AI response for debate follow-up:", error);
            setAiError(error.message || "Failed to get AI response.");
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message || "Failed to get AI response."}` }]);
        } finally {
            setIsAiLoading(false);
        }
    };
    
    // Automatically scroll to the latest message (This useEffect can be removed if AiChatWindow handles its own scrolling)
    useEffect(() => {
        const chatArea = document.getElementById('chat-area');
        if (chatArea) {
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }, [messages]);

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

                {/* Display area for initial AI argument and user's first response before chat window takes over */}
                <div id="initial-exchange-area" className="space-y-4 flex flex-col mb-4">
                    {messages.slice(0, hasSubmittedInitial ? 2 : 1).map((msg, index) => (
                        <div
                            key={`initial-${index}`}
                            className={`chat-bubble py-3 px-4 rounded-xl max-w-[80%] ${
                                msg.role === 'assistant'
                                ? 'bg-indigo-100 text-indigo-800 self-start rounded-bl-sm'
                                : 'bg-green-100 text-green-800 self-end rounded-br-sm'
                            }`}
                        >
                            <strong className="font-semibold">{msg.role === 'assistant' ? t.aiName : t.userName}:</strong>
                            <p className="mt-1 whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    ))}
                </div>

                {aiError && <p className="text-red-500 text-sm text-center my-2">{aiError}</p>}

                {!hasSubmittedInitial ? (
                    <div id="user-initial-input-area" className="mt-6">
                        <label htmlFor="user-argument-input" className="block text-sm font-medium text-gray-700 mb-1">{t.inputLabel}</label>
                        <textarea
                            id="user-argument-input"
                            value={initialUserInput}
                            onChange={(e) => setInitialUserInput(e.target.value)}
                            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-vertical text-sm focus:ring-yellow-500 focus:border-yellow-500"
                            placeholder={t.inputPlaceholder}
                            disabled={isAiLoading}
                        />
                        <button
                            onClick={handleInitialSubmit}
                            className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-50"
                            disabled={isAiLoading || !initialUserInput.trim()}
                        >
                            {isAiLoading ? t.aiThinking : t.submitButton}
                        </button>
                    </div>
                ) : (
                    <div id="ai-chat-window-area" className="mt-6">
                        <AiChatWindow
                            messages={messages.slice(1)} // Pass history after AI's initial argument
                            isLoading={isAiLoading}
                            onSendMessage={handleSendMessageToAI}
                            // Optional: Pass custom translations if AiChatWindow supports them
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
