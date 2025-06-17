import React, { useState, useEffect } from 'react';

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
    }
};


export default function LeaderSimulationGame() {
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');
    const [strategy, setStrategy] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

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
        } else {
            // Optional: Add a more user-friendly alert, e.g., a temporary message on the screen
            alert(lang === 'ru' ? 'Пожалуйста, опишите ваш план.' : 'Please describe your plan.');
        }
    };

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
            </div>
        </main>
    );
}
