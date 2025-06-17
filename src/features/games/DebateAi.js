import React, { useState, useEffect } from 'react';

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
    const [messages, setMessages] = useState([]);
    // State for the user's current input
    const [userInput, setUserInput] = useState('');
    // State to control if the user has submitted their argument
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Effect to initialize or reset the game on language change
    useEffect(() => {
        const t = gameData[lang];
        document.title = t.pageTitle;
        setMessages([
            { sender: 'ai', text: t.ai_argument, name: t.aiName }
        ]);
        setUserInput('');
        setHasSubmitted(false);

        const handleStorageChange = (event) => {
            if (event.key === 'logiclingua-lang') {
                setLang(event.newValue || 'ru');
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [lang]);

    const handleSubmitArgument = () => {
        if (userInput.trim() && !hasSubmitted) {
            const t = gameData[lang];
            // Add user's message
            setMessages(prev => [...prev, { sender: 'user', text: userInput, name: t.userName }]);
            setHasSubmitted(true);
            setUserInput('');

            // Simulate AI response after a delay
            setTimeout(() => {
                setMessages(prev => [...prev, { sender: 'ai', text: t.ai_response, name: t.aiName }]);
            }, 800);
        }
    };
    
    // Automatically scroll to the latest message
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

                <div id="chat-area" className="space-y-4 flex flex-col h-80 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-bubble py-3 px-4 rounded-xl max-w-[80%] mb-3 ${
                                msg.sender === 'ai'
                                ? 'bg-indigo-100 text-indigo-800 self-start rounded-bl-sm'
                                : 'bg-green-100 text-green-800 self-end rounded-br-sm'
                            }`}
                        >
                            <strong className="font-semibold">{msg.name}:</strong>
                            <p className="mt-1">{msg.text}</p>
                        </div>
                    ))}
                </div>

                {!hasSubmitted && (
                    <div id="user-input-area" className="mt-6">
                        <label htmlFor="user-argument-input" className="block text-sm font-medium text-gray-700 mb-1">{t.inputLabel}</label>
                        <textarea
                            id="user-argument-input"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-vertical text-sm focus:ring-yellow-500 focus:border-yellow-500"
                            placeholder={t.inputPlaceholder}
                        />
                        <button
                            onClick={handleSubmitArgument}
                            className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                        >
                            {t.submitButton}
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
