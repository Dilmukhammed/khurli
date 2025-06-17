import React, { useState, useEffect } from 'react';

// Translations for the Moral Compass game
const translations = {
    ru: {
        pageTitle: "Игра: Моральный Компас",
        gameTitle: "Игра: Моральный Компас",
        gameInstructions: "Прочитайте каждую ситуацию (дилемму) и выберите вариант действий, который кажется вам наиболее правильным или приемлемым. Подумайте о последствиях каждого выбора.",
        completionMessage: "Вы рассмотрели все дилеммы. Подумайте над своим выбором и возможными последствиями.",
        dilemma1_text: "Вы нашли кошелек с крупной суммой денег и документами на улице. Рядом никого нет.",
        dilemma1_choice1: "Взять деньги себе, а кошелек с документами выбросить.",
        dilemma1_choice2: "Попытаться найти владельца через документы или социальные сети.",
        dilemma1_choice3: "Отнести кошелек в ближайшее отделение полиции.",
        dilemma1_reflection: "Какой принцип важнее: личная выгода или честность? Как бы вы хотели, чтобы поступили с вашим кошельком?",
        dilemma2_text: "Ваш друг просит вас солгать его родителям о том, где он был вчера вечером, чтобы избежать наказания.",
        dilemma2_choice1: "Согласиться солгать, чтобы помочь другу.",
        dilemma2_choice2: "Отказаться лгать, но предложить другу самому честно поговорить с родителями.",
        dilemma2_choice3: "Рассказать родителям друга правду.",
        dilemma2_reflection: "Что важнее: лояльность другу или честность? К каким последствиям может привести ложь?",
        dilemma3_text: "Вы видите, как ваш коллега использует ресурсы компании (например, принтер, бумагу) для своих личных нужд в больших количествах.",
        dilemma3_choice1: "Ничего не делать, это не ваше дело.",
        dilemma3_choice2: "Поговорить с коллегой наедине и попросить его прекратить.",
        dilemma3_choice3: "Сообщить об этом вашему руководителю.",
        dilemma3_reflection: "Каковы ваши обязательства перед компанией? Как ваш выбор повлияет на отношения с коллегой и рабочую атмосферу?",
        dilemma4_text: "ИИ-система ошибочно определяет вашего друга как участника правонарушения. У вас есть техническая возможность исправить ошибку в системе анонимно, но это может быть обнаружено.",
        dilemma4_choice1: "Не вмешиваться, так как это рискованно и не ваша ответственность.",
        dilemma4_choice2: "Попытаться исправить ошибку анонимно, рискуя последствиями.",
        dilemma4_choice3: "Сообщить об ошибке официально, даже если это займет время и может не помочь другу сразу.",
        dilemma4_reflection: "Насколько велик риск вмешательства? Что важнее: справедливость для друга или соблюдение правил и личная безопасность?"
    },
    en: {
        pageTitle: "Game: Moral Compass",
        gameTitle: "Game: Moral Compass",
        gameInstructions: "Read each situation (dilemma) and choose the course of action that seems most right or acceptable to you. Consider the consequences of each choice.",
        completionMessage: "You have considered all dilemmas. Reflect on your choices and their potential consequences.",
        dilemma1_text: "You find a wallet on the street with a large amount of money and ID cards. There's no one around.",
        dilemma1_choice1: "Take the money for yourself and discard the wallet with the documents.",
        dilemma1_choice2: "Try to find the owner through the documents or social media.",
        dilemma1_choice3: "Take the wallet to the nearest police station.",
        dilemma1_reflection: "Which principle is more important: personal gain or honesty? How would you want someone to act if it were your wallet?",
        dilemma2_text: "Your friend asks you to lie to their parents about where they were last night to avoid punishment.",
        dilemma2_choice1: "Agree to lie to help your friend.",
        dilemma2_choice2: "Refuse to lie, but suggest your friend talk honestly with their parents.",
        dilemma2_choice3: "Tell your friend's parents the truth.",
        dilemma2_reflection: "What is more important: loyalty to a friend or honesty? What consequences could the lie lead to?",
        dilemma3_text: "You see your colleague using company resources (like the printer, paper) for personal needs in large quantities.",
        dilemma3_choice1: "Do nothing, it's none of your business.",
        dilemma3_choice2: "Talk to the colleague privately and ask them to stop.",
        dilemma3_choice3: "Report it to your supervisor.",
        dilemma3_reflection: "What are your obligations to the company? How will your choice affect your relationship with the colleague and the work atmosphere?",
        dilemma4_text: "An AI system mistakenly identifies your friend as involved in a misdemeanor. You have the technical ability to anonymously correct the error in the system, but it might be detected.",
        dilemma4_choice1: "Don't interfere, as it's risky and not your responsibility.",
        dilemma4_choice2: "Try to correct the error anonymously, risking the consequences.",
        dilemma4_choice3: "Report the error officially, even if it takes time and might not help your friend immediately.",
        dilemma4_reflection: "How great is the risk of intervention? What is more important: justice for your friend or following the rules and personal safety?"
    }
};

// Game data: Array of dilemma objects
const gameDilemmas = [
    { id: 'dilemma1', text_key: 'dilemma1_text', choices: ['dilemma1_choice1', 'dilemma1_choice2', 'dilemma1_choice3'], reflection_key: 'dilemma1_reflection' },
    { id: 'dilemma2', text_key: 'dilemma2_text', choices: ['dilemma2_choice1', 'dilemma2_choice2', 'dilemma2_choice3'], reflection_key: 'dilemma2_reflection' },
    { id: 'dilemma3', text_key: 'dilemma3_text', choices: ['dilemma3_choice1', 'dilemma3_choice2', 'dilemma3_choice3'], reflection_key: 'dilemma3_reflection' },
    { id: 'dilemma4', text_key: 'dilemma4_text', choices: ['dilemma4_choice1', 'dilemma4_choice2', 'dilemma4_choice3'], reflection_key: 'dilemma4_reflection' }
];

export default function MoralCompassGame() {
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');
    // State to store the user's choices, e.g., { dilemma1: 0, dilemma2: 2 }
    const [userChoices, setUserChoices] = useState({});

    useEffect(() => {
        document.title = translations[lang].pageTitle;
        const handleStorageChange = (event) => {
            if (event.key === 'logiclingua-lang') {
                const newLang = event.newValue || 'ru';
                setLang(newLang);
                // Reset game state on language change
                setUserChoices({});
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [lang]);

    const handleChoice = (dilemmaId, choiceIndex) => {
        // Only allow a choice to be made once per dilemma
        if (userChoices[dilemmaId] === undefined) {
            setUserChoices(prevChoices => ({
                ...prevChoices,
                [dilemmaId]: choiceIndex
            }));
        }
    };

    const allDilemmasAnswered = Object.keys(userChoices).length === gameDilemmas.length;
    const t = translations[lang];

    return (
        <main className="container mx-auto px-6 py-12 flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full">
                <h1 className="text-3xl font-bold text-pink-700 mb-4 text-center">{t.gameTitle}</h1>
                <p className="text-gray-600 mb-8 text-center">{t.gameInstructions}</p>

                <div id="dilemmas-container" className="space-y-8">
                    {gameDilemmas.map((dilemma, index) => {
                        const isAnswered = userChoices[dilemma.id] !== undefined;
                        return (
                            <div key={dilemma.id} className="dilemma-card bg-white p-6 rounded-lg shadow-sm">
                                <p className="dilemma-text text-lg text-gray-800">
                                    {`${index + 1}. ${t[dilemma.text_key]}`}
                                </p>
                                <div className="choices-container space-y-2">
                                    {dilemma.choices.map((choiceKey, choiceIndex) => (
                                        <button
                                            key={choiceIndex}
                                            onClick={() => handleChoice(dilemma.id, choiceIndex)}
                                            disabled={isAnswered}
                                            className={`choice-button w-full text-left py-3 px-4 border rounded-md transition-all duration-200
                                                ${isAnswered ? 'cursor-not-allowed' : 'hover:bg-gray-100 hover:border-gray-400'}
                                                ${userChoices[dilemma.id] === choiceIndex ? 'bg-indigo-100 border-indigo-300 font-semibold' : 'bg-gray-50 border-gray-300'}`
                                            }
                                        >
                                            {t[choiceKey]}
                                        </button>
                                    ))}
                                </div>
                                {isAnswered && (
                                     <div className="reflection-prompt mt-4 p-4 bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 rounded">
                                        <p className="font-semibold">{t[dilemma.reflection_key]}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {allDilemmasAnswered && (
                    <p className="mt-8 text-center text-gray-600 italic font-semibold">
                        {t.completionMessage}
                    </p>
                )}
            </div>
        </main>
    );
}
