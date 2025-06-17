import React, { useState, useEffect } from 'react';

// Translations for the Emoji Debate game
const translations = {
    ru: {
        pageTitle: "Игра: Эмодзи Дебаты",
        gameTitle: "Игра: Эмодзи Дебаты",
        gameInstructions: "Посмотрите на последовательность эмодзи. Как вы думаете, какую новость или ситуацию она описывает? Напишите свою интерпретацию в поле ниже.",
        interpretationLabel: "Ваша интерпретация:",
        interpretationPlaceholder: "Напишите, что, по вашему мнению, означают эти эмодзи...",
        shareButton: "Поделиться мнением",
    },
    en: {
        pageTitle: "Game: Emoji Debate",
        gameTitle: "Game: Emoji Debate",
        gameInstructions: "Look at the sequence of emojis. What news or situation do you think it describes? Write your interpretation in the field below.",
        interpretationLabel: "Your Interpretation:",
        interpretationPlaceholder: "Write what you think these emojis mean...",
        shareButton: "Share Opinion",
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
    // State to hold user's text interpretations
    const [interpretations, setInterpretations] = useState({});

    useEffect(() => {
        document.title = translations[lang].pageTitle;
        const handleStorageChange = (event) => {
            if (event.key === 'logiclingua-lang') {
                const newLang = event.newValue || 'ru';
                setLang(newLang);
                setInterpretations({}); // Reset interpretations on language change
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [lang]);
    
    const handleInterpretationChange = (storyId, text) => {
        setInterpretations(prev => ({
            ...prev,
            [storyId]: text
        }));
    };

    const t = translations[lang];

    return (
        <main className="container mx-auto px-6 py-12 flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full">
                <h1 className="text-3xl font-bold text-orange-700 mb-4 text-center">{t.gameTitle}</h1>
                <p className="text-gray-600 mb-8 text-center">{t.gameInstructions}</p>

                <div id="emoji-stories-container" className="space-y-8">
                    {emojiStories.map((story) => (
                        <div key={story.id} className="emoji-story-card bg-white p-6 rounded-lg shadow-sm">
                            <p className="emoji-sequence text-4xl text-center bg-gray-50 p-3 rounded-md mb-4" style={{ wordSpacing: '0.5em' }}>
                                {story.sequence}
                            </p>
                            <label 
                                htmlFor={`interpretation-${story.id}`} 
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                {t.interpretationLabel}
                            </label>
                            <textarea
                                id={`interpretation-${story.id}`}
                                value={interpretations[story.id] || ''}
                                onChange={(e) => handleInterpretationChange(story.id, e.target.value)}
                                className="interpretation-input w-full min-h-[80px] p-3 border border-gray-300 rounded-md resize-vertical text-sm focus:ring-orange-500 focus:border-orange-500"
                                placeholder={t.interpretationPlaceholder}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
