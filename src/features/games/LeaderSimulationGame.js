import React, { useState, useEffect, useCallback } from 'react';
import moduleService from '../../services/moduleService';
import AiChatWindow from '../../components/common/AiChatWindow';

// Translations and game data for the Leader Simulation game
const gameData = {
    ru: {
        pageTitle: "Игра: Симуляция \"Если бы я был лидером\"",
        gameTitle: "Игра: Симуляция \"Если бы я был лидером\"",
        gameInstructions: "Вам представлена сложная ситуация. Представьте, что вы отвечаете за принятие решений. Опишите вашу стратегию или план действий для разрешения этой проблемы.",
        scenarioTitle: "Сценарий: Водный Кризис",
        scenarioContent: "Ваш регион столкнулся с серьезной засухой второй год подряд. Уровень воды в главном водохранилище критически низок. Фермеры требуют воду для полива урожая хлопка, который является основой местной экономики. Городские жители жалуются на частые отключения воды. Соседний регион также претендует на воду из общей реки и угрожает перекрыть часть стока. Экологи бьют тревогу из-за угрозы экосистеме. Вам, как главе региона, нужно срочно разработать план действий.",
        inputLabel: "Ваша стратегия / План действий:",
        inputPlaceholder: "Опишите ваши шаги, приоритеты и ожидаемые результаты...",
        submitButton: "Представить План",
        feedbackMessage: "Ваш план принят к рассмотрению. Анализ последствий такого решения требует времени. Подумайте, какие краткосрочные и долгосрочные эффекты может иметь ваша стратегия?",
        discussWithAiButton: "Обсудить с ИИ",
        aiThinking: "ИИ думает...",
        closeAiChatButton: "Закрыть чат",
    },
    en: {
        pageTitle: "Game: \"If I Were a Leader\" Simulation",
        gameTitle: "Game: \"If I Were a Leader\" Simulation",
        gameInstructions: "You are presented with a complex situation. Imagine you are responsible for making decisions. Describe your strategy or action plan to resolve this problem.",
        scenarioTitle: "Scenario: Water Crisis",
        scenarioContent: "Your region has faced a severe drought for the second consecutive year. The water level in the main reservoir is critically low. Farmers demand water to irrigate cotton crops, the backbone of the local economy. City residents complain about frequent water shutoffs. A neighboring region also claims rights to water from the shared river and threatens to block part of the flow. Environmentalists are alarming about the threat to the ecosystem. As the regional leader, you urgently need to develop an action plan.",
        inputLabel: "Your Strategy / Action Plan:",
        inputPlaceholder: "Describe your steps, priorities, and expected outcomes...",
        submitButton: "Submit Plan",
        feedbackMessage: "Your plan has been submitted for consideration. Analyzing the consequences of such a decision takes time. Consider what short-term and long-term effects your strategy might have.",
        discussWithAiButton: "Discuss with AI",
        aiThinking: "AI Thinking...",
        closeAiChatButton: "Close AI Chat",
    }
};


export default function LeaderSimulationGame() {
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');
    const [strategy, setStrategy] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
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
                // Reset game state on language change
                setStrategy('');
                setIsSubmitted(false);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [lang]);
    
    const handleSubmit = () => {
        if (strategy.trim()) {
            setIsSubmitted(true);
            setShowMainAiButton(true); // Show AI button
            setActiveChat(false);      // Ensure chat is closed initially
            setChatMessages([]);       // Clear previous messages
            setCurrentError('');       // Clear previous errors
        } else {
            // Optional: Add a more user-friendly alert, e.g., a temporary message on the screen
            alert(lang === 'ru' ? 'Пожалуйста, опишите ваш план.' : 'Please describe your plan.');
        }
    };

    const getTaskDetailsForAI_LeaderSimulation = useCallback(() => {
        const t = gameData[lang];
        const contextParts = [
            `Game: ${t.gameTitle}`,
            `Instructions: ${t.gameInstructions}`,
            `Scenario Title: ${t.scenarioTitle}`,
            `Scenario Content: "${t.scenarioContent}"`,
            `User's Submitted Strategy: "${strategy}"`,
            `Initial Feedback to User: "${t.feedbackMessage}"`
        ];

        return {
            block_context: contextParts.join('\n\n'), // Using double newline for better readability in AI prompt
            user_inputs: [ `User's Strategy: ${strategy}` ], // AI might benefit from seeing the strategy as a distinct user input
            // TODO: Change this back to 'discuss_game_leader_simulation' once backend supports it.
            interaction_type: 'discuss_game_find_bias'
        };
    }, [lang, strategy]); // gameData is external, strategy and lang are dependencies. Removed gameData as it's not reactive.

    const handleAskAI_LeaderSimulation = useCallback(async (userQuery = '') => {
        if (isAiLoading) return;
        setIsAiLoading(true);
        setActiveChat(true);
        setCurrentError('');
        const t = gameData[lang];

        try {
            const { block_context, user_inputs, interaction_type } = getTaskDetailsForAI_LeaderSimulation();

            if (userQuery) {
                setChatMessages(prev => [...prev, { "role": 'user', "content": userQuery }]);
            }

            const response = await moduleService.getGenericAiInteraction({
                module_id: 'game-leader-simulation',
                task_id: 'strategy_discussion',
                interaction_type,
                block_context,
                user_inputs,
                userQuery,
                chatMessages,
            });

            setChatMessages(prev => [
                ...prev.filter(msg => msg.content !== (t.aiThinking || 'Thinking...')),
                { "role": 'assistant', "content": response.explanation }
            ]);
        } catch (error) {
            console.error('Error fetching AI for LeaderSimulationGame:', error);
            const errorMsg = error.message || 'Failed to get AI response.';
            setChatMessages(prev => [
                ...prev.filter(msg => msg.content !== (t.aiThinking || 'Thinking...')),
                { "role": 'assistant', "content": `Sorry, I encountered an error: ${errorMsg}` }
            ]);
            setCurrentError(errorMsg);
            // Potentially set showMainAiButton to false if the initial AI call fails critically,
            // or handle error display more gracefully within the chat or below the button.
            // For now, error is shown in chat, and button remains.
        } finally {
            setIsAiLoading(false);
        }
    }, [isAiLoading, getTaskDetailsForAI_LeaderSimulation, lang, chatMessages]);

    const t = gameData[lang];

    return (
        <main className="container mx-auto px-6 py-12 flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl w-full">
                <h1 className="text-3xl font-bold text-teal-700 mb-4 text-center">{t.gameTitle}</h1>
                <p className="text-gray-600 mb-6 text-center">{t.gameInstructions}</p>

                <div className="scenario-box bg-yellow-50 border border-yellow-300 p-6 rounded-lg mb-6 text-yellow-800">
                    <h2 className="text-xl font-semibold mb-3 text-yellow-900">{t.scenarioTitle}</h2>
                    <p className="leading-relaxed">{t.scenarioContent}</p>
                </div>

                <div id="user-input-area" className="mt-6">
                    <label htmlFor="user-strategy-input" className="block text-sm font-medium text-gray-700 mb-2">{t.inputLabel}</label>
                    <textarea
                        id="user-strategy-input"
                        value={strategy}
                        onChange={(e) => setStrategy(e.target.value)}
                        disabled={isSubmitted}
                        className="strategy-input w-full min-h-[200px] p-3 border border-gray-300 rounded-md resize-vertical text-sm focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder={t.inputPlaceholder}
                    />
                    {!isSubmitted && (
                        <button
                            onClick={handleSubmit}
                            className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                        >
                            {t.submitButton}
                        </button>
                    )}
                </div>

                {isSubmitted && (
                     <div id="feedback-area" className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 rounded">
                        <p>{t.feedbackMessage}</p>
                    </div>
                )}

                {/* AI Discussion Button - shows after initial submission and if no critical error on first AI load attempt */}
                {showMainAiButton && !currentError && (
                    <div className="mt-6">
                        <button
                            onClick={() => handleAskAI_LeaderSimulation()} // Initial call to AI, no userQuery needed
                            disabled={isAiLoading}
                            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                        >
                            {t.discussWithAiButton}
                        </button>
                    </div>
                )}

                {/* Display error if AI button was meant to show but an error occurred (and chat isn't active) */}
                {showMainAiButton && currentError && !activeChat && (
                     <p className="mt-4 text-center text-red-600">{currentError}</p>
                )}

                {/* AI Chat Window */}
                {activeChat && (
                    <div className="mt-6 p-4 border-t border-gray-200">
                        <AiChatWindow
                            messages={chatMessages}
                            isLoading={isAiLoading}
                            onSendMessage={(message) => handleAskAI_LeaderSimulation(message)}
                        />
                        {/* Display error within chat window if it occurs during an active chat */}
                        {currentError && <p className="mt-2 text-sm text-red-500">{`Error: ${currentError}`}</p>}
                        <button
                            onClick={() => {
                                setActiveChat(false);
                                // Decide on clearing chat/error:
                                setChatMessages([]);
                                setCurrentError('');
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
