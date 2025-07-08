import React, { useState, useEffect } from 'react';

// Translations for the Emoji Debate game
const translations = {
    ru: {
        pageTitle: "Игра: Эмодзи Дебаты",
        gameTitle: "Игра: Эмодзи Дебаты",
        gameInstructions: "Посмотрите на последовательность эмодзи. Как вы думаете, какую новость или ситуацию она описывает? Напишите свою интерпретацию в поле ниже.",
        interpretationLabel: "Ваша интерпретация:",
        interpretationPlaceholder: "Напишите, что, по вашему мнению, означают эти эмодзи...",
        submitButton: "Отправить интерпретацию", // Renamed from shareButton
        discussWithAiButton: "Обсудить с ИИ",
        aiThinking: "ИИ думает...",
        closeAiChatButton: "Закрыть чат",
    },
    en: {
        pageTitle: "Game: Emoji Debate",
        gameTitle: "Game: Emoji Debate",
        gameInstructions: "Look at the sequence of emojis. What news or situation do you think it describes? Write your interpretation in the field below.",
        interpretationLabel: "Your Interpretation:",
        interpretationPlaceholder: "Write what you think these emojis mean...",
        submitButton: "Submit Interpretation", // Renamed from shareButton
        discussWithAiButton: "Discuss with AI",
        aiThinking: "AI Thinking...",
        closeAiChatButton: "Close AI Chat",
    }
};

// Game data: Array of emoji story objects
const emojiStories = [
    { id: 'story1', sequence: '🚗 💨 📉 💰' },
    { id: 'story2', sequence: '🌍 🔥 ❓ 🤔' },
    { id: 'story3', sequence: '📱 ⬆️ 📈 🥳' },
    { id: 'story4', sequence: '⚽ 🏆 🇺🇿 🎉' },
    { id: 'story5', sequence: '🧑‍💻 ➡️ 🤖 🏭 😟' }
];

export default function EmojiDebateGame() {
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');

    // For single story display model
    const [currentEmojiStory, setCurrentEmojiStory] = useState(null);
    const [userInterpretation, setUserInterpretation] = useState('');
    const [isInterpretationSubmitted, setIsInterpretationSubmitted] = useState(false);

    // AI Discussion Chat States
    const [showDiscussAiButton, setShowDiscussAiButton] = useState(false);
    const [activeAiChat, setActiveAiChat] = useState(false);
    const [aiChatMessages, setAiChatMessages] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');


    useEffect(() => {
        document.title = translations[lang].pageTitle;
        if (emojiStories.length > 0) {
            setCurrentEmojiStory(emojiStories[0]);
        } else {
            setCurrentEmojiStory(null);
        }
        // Reset states on language change
        setUserInterpretation('');
        setIsInterpretationSubmitted(false);
        setShowDiscussAiButton(false);
        setActiveAiChat(false);
        setAiChatMessages([]);
        setIsAiLoading(false);
        setAiError('');

        const handleStorageChange = (event) => {
            if (event.key === 'logiclingua-lang') {
                const newLang = event.newValue || 'ru';
                setLang(newLang);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [lang]);

    const handleSubmitInterpretation = () => {
        if (userInterpretation.trim()) {
            setIsInterpretationSubmitted(true);
            setShowDiscussAiButton(true);
            setActiveAiChat(false);
            setAiChatMessages([]);
            setAiError('');
        } else {
            alert(translations[lang].interpretationPlaceholder); // Or a more specific message
        }
    };

    const getTaskDetailsForAI_EmojiDebateDiscussion = useCallback(() => {
        const t = translations[lang];
        if (!currentEmojiStory) return null; // Should not happen if button is only shown after story is loaded

        const contextParts = [
            `Game: ${t.gameTitle}`,
            `Instructions: ${t.gameInstructions}`,
            `Emoji Sequence: "${currentEmojiStory.sequence}"`,
            `User's Interpretation: "${userInterpretation}"`
        ];

        return {
            block_context: contextParts.join('\n\n'),
            user_inputs: [`User's Interpretation: "${userInterpretation}"`],
            // TODO: Backend should ideally support 'discuss_emoji_interpretation'. Using 'discuss_open_ended' as fallback.
            interaction_type: 'discuss_open_ended'
        };
    }, [lang, currentEmojiStory, userInterpretation]);

    const handleAskAI_EmojiDebateDiscussion = useCallback(async (userQuery = '') => {
        if (isAiLoading || !currentEmojiStory) return; // Ensure story is loaded

        const details = getTaskDetailsForAI_EmojiDebateDiscussion();
        if (!details) {
            setAiError("Could not prepare details for AI discussion.");
            return;
        }

        setIsAiLoading(true);
        setActiveAiChat(true);
        setAiError('');
        const t = translations[lang];
        const thinkingMsg = { "role": 'assistant', "content": t.aiThinking || 'Thinking...' };

        if (userQuery) {
            setAiChatMessages(prev => [...prev, { "role": 'user', "content": userQuery }]);
        }
        setAiChatMessages(prev => {
            if (prev.length === 0 || prev[prev.length - 1].content !== thinkingMsg.content) {
                return [...prev, thinkingMsg];
            }
            return prev;
        });

        try {
            const { block_context, user_inputs: initial_user_inputs, interaction_type } = details;

            const messagesForApi = aiChatMessages.filter(msg => msg.content !== (t.aiThinking || 'Thinking...'));
            if (userQuery) {
                messagesForApi.push({ "role": 'user', "content": userQuery });
            }

            const response = await moduleService.getGenericAiInteraction({
                module_id: 'game-emoji-debate',
                task_id: 'discuss_emoji_interpretation',
                interaction_type,
                block_context,
                user_inputs: userQuery ? [userQuery] : initial_user_inputs,
                chatMessages: messagesForApi,
            });

            setAiChatMessages(prev => [
                ...prev.filter(msg => msg.content !== (t.aiThinking || 'Thinking...')),
                { "role": 'assistant', "content": response.explanation }
            ]);

        } catch (error) {
            console.error('Error fetching AI for Emoji Debate Discussion:', error);
            const errorMsg = error.message || 'Failed to get AI response.';
            setAiChatMessages(prev => [
                ...prev.filter(msg => msg.content !== (t.aiThinking || 'Thinking...')),
                { "role": 'assistant', "content": `Sorry, I encountered an error: ${errorMsg}` }
            ]);
            setAiError(errorMsg);
        } finally {
            setIsAiLoading(false);
        }
    }, [isAiLoading, currentEmojiStory, aiChatMessages, getTaskDetailsForAI_EmojiDebateDiscussion, lang]); // Added lang

    const t = translations[lang];

    if (!currentEmojiStory) {
        // Handle case where no story is available (e.g., emojiStories is empty)
        return (
            <main className="container mx-auto px-6 py-12 flex justify-center items-center">
                <p>No emoji story available.</p> {/* Or a more user-friendly message/loader */}
            </main>
        );
    }

    return (
        <main className="container mx-auto px-6 py-12 flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full">
                <h1 className="text-3xl font-bold text-orange-700 mb-4 text-center">{t.gameTitle}</h1>
                <p className="text-gray-600 mb-8 text-center">{t.gameInstructions}</p>

                <div id="emoji-story-container" className="emoji-story-card bg-white p-6 rounded-lg shadow-sm">
                    <p className="emoji-sequence text-4xl text-center bg-gray-50 p-3 rounded-md mb-4" style={{ wordSpacing: '0.5em' }}>
                        {currentEmojiStory.sequence}
                    </p>

                    {!isInterpretationSubmitted ? (
                        <>
                            <label 
                                htmlFor="interpretation-input"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                {t.interpretationLabel}
                            </label>
                            <textarea
                                id="interpretation-input"
                                value={userInterpretation}
                                onChange={(e) => setUserInterpretation(e.target.value)}
                                className="interpretation-input w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-vertical text-sm focus:ring-orange-500 focus:border-orange-500"
                                placeholder={t.interpretationPlaceholder}
                                disabled={isInterpretationSubmitted}
                            />
                            <button
                                onClick={handleSubmitInterpretation}
                                className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50"
                                disabled={!userInterpretation.trim() || isInterpretationSubmitted}
                            >
                                {t.submitButton}
                            </button>
                        </>
                    ) : (
                        <div className="mt-4 p-4 border border-green-200 rounded-lg bg-green-50">
                            <h3 className="text-md font-semibold text-green-700 mb-1">Your Interpretation:</h3>
                            <p className="text-green-800 whitespace-pre-wrap">{userInterpretation}</p>
                        </div>
                    )}

                    {/* "Discuss with AI" Button & Chat Window */}
                    {isInterpretationSubmitted && (
                        <div className="mt-6">
                            {showDiscussAiButton && !activeAiChat && !aiError && (
                                <button
                                    onClick={() => handleAskAI_EmojiDebateDiscussion()}
                                    disabled={isAiLoading}
                                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                                >
                                    {t.discussWithAiButton}
                                </button>
                            )}
                            {/* Display error if discussion button was to show but failed */}
                            {showDiscussAiButton && aiError && !activeAiChat && (
                                <p className="mt-2 text-center text-red-600">{aiError}</p>
                            )}

                            {activeAiChat && (
                                <div className="mt-4 p-4 border-t border-gray-200">
                                    <AiChatWindow
                                        messages={aiChatMessages}
                                        isLoading={isAiLoading}
                                        onSendMessage={(message) => handleAskAI_EmojiDebateDiscussion(message)}
                                    />
                                    {aiError && <p className="mt-2 text-sm text-red-500">{`Error: ${aiError}`}</p>}
                                    <button
                                        onClick={() => {
                                            setActiveAiChat(false);
                                            // setAiError(''); // Optionally clear error when closing
                                        }}
                                        className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        {t.closeAiChatButton}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                 {/* General error display moved slightly or could be consolidated if only one error spot is needed */}
                 {/* {aiError && !activeAiChat && <p className="mt-4 text-center text-red-600">{aiError}</p>} */}
            </div>
        </main>
    );
}
