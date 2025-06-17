import React, { useState, useEffect } from 'react';

// Translations and game data for the Propaganda Detector game
const gameData = {
    ru: {
        pageTitle: "Игра: Детектор Пропаганды",
        gameTitle: "Игра: Детектор Пропаганды",
        gameInstructions: "Прочитайте каждое заявление и определите, какая техника пропаганды используется. Выберите наиболее подходящий вариант.",
        checkAnswersButton: "Проверить ответы",
        feedbackCorrect: "Верно!",
        feedbackIncorrect: "Неверно.",
        feedbackExplanation: "Пояснение:",
        resultAllCorrect: "Отлично! Вы хорошо разбираетесь в техниках пропаганды!",
        resultSomeIncorrect: "Некоторые техники определены неверно. Изучите пояснения.",
        resultScore: "Ваш результат:",
        tech_glittering_generalities: "Сияющие обобщения",
        tech_glittering_generalities_desc: "Использование расплывчатых, позитивных терминов без конкретики.",
        tech_name_calling: "Навешивание ярлыков",
        tech_name_calling_desc: "Использование оскорбительных или негативных названий для дискредитации оппонента.",
        tech_bandwagon: "Эффект присоединения к большинству",
        tech_bandwagon_desc: "Убеждение присоединиться, потому что 'все так делают'.",
        tech_transfer: "Перенос",
        tech_transfer_desc: "Ассоциирование идеи или человека с чем-то уважаемым или презираемым.",
        tech_testimonial: "Свидетельство (Авторитет)",
        tech_testimonial_desc: "Использование известной личности для поддержки идеи, даже если она не эксперт.",
        tech_plain_folks: "Свой парень",
        tech_plain_folks_desc: "Представление себя как 'простого человека из народа'.",
        statement1_text: "Присоединяйтесь к миллионам довольных клиентов, которые уже выбрали наш продукт!",
        statement1_explanation: "Используется идея, что раз многие выбрали, то и вам стоит.",
        statement2_text: "Только некомпетентный человек может не согласиться с нашим планом развития.",
        statement2_explanation: "Оппонентов называют 'некомпетентными', не обсуждая суть плана.",
        statement3_text: "Наш кандидат борется за Свободу, Справедливость и Прогресс для каждого!",
        statement3_explanation: "Используются абстрактные позитивные слова без уточнения, что они значат.",
        statement4_text: "Этот известный актер полностью поддерживает нашего кандидата!",
        statement4_explanation: "Мнение актера используется для поддержки, хотя он может не разбираться в политике.",
        statement5_text: "Политика оппонента ассоциируется с предательством национальных интересов.",
        statement5_explanation: "Негативные ассоциации (предательство) переносятся на политику оппонента.",
        statement6_text: "Я такой же простой рабочий, как и вы, и я понимаю ваши проблемы.",
        statement6_explanation: "Политик пытается показать себя 'своим', чтобы вызвать доверие."
    },
    en: {
        pageTitle: "Game: Propaganda Detector",
        gameTitle: "Game: Propaganda Detector",
        gameInstructions: "Read each statement and identify the propaganda technique being used. Choose the most appropriate option.",
        checkAnswersButton: "Check Answers",
        feedbackCorrect: "Correct!",
        feedbackIncorrect: "Incorrect.",
        feedbackExplanation: "Explanation:",
        resultAllCorrect: "Excellent! You have a good grasp of propaganda techniques!",
        resultSomeIncorrect: "Some techniques were identified incorrectly. Review the explanations.",
        resultScore: "Your score:",
        tech_glittering_generalities: "Glittering Generalities",
        tech_glittering_generalities_desc: "Using vague, positive terms without specifics.",
        tech_name_calling: "Name-Calling",
        tech_name_calling_desc: "Using offensive or negative labels to discredit an opponent.",
        tech_bandwagon: "Bandwagon Effect",
        tech_bandwagon_desc: "Persuading people to join because 'everyone is doing it'.",
        tech_transfer: "Transfer",
        tech_transfer_desc: "Associating an idea or person with something respected or despised.",
        tech_testimonial: "Testimonial",
        tech_testimonial_desc: "Using a famous person to endorse an idea, even if they aren't an expert.",
        tech_plain_folks: "Plain Folks",
        tech_plain_folks_desc: "Presenting oneself as an 'ordinary person' of the people.",
        statement1_text: "Join the millions of satisfied customers who have already chosen our product!",
        statement1_explanation: "Uses the idea that since many have chosen it, you should too.",
        statement2_text: "Only an incompetent person could disagree with our development plan.",
        statement2_explanation: "Opponents are labeled 'incompetent' without discussing the plan's merits.",
        statement3_text: "Our candidate fights for Freedom, Justice, and Progress for everyone!",
        statement3_explanation: "Uses abstract positive words without defining what they mean.",
        statement4_text: "This famous actor fully supports our candidate!",
        statement4_explanation: "The actor's opinion is used for endorsement, though they may not be a political expert.",
        statement5_text: "The opponent's policy is associated with betraying national interests.",
        statement5_explanation: "Negative associations (betrayal) are transferred onto the opponent's policy.",
        statement6_text: "I'm just a simple worker like you, and I understand your problems.",
        statement6_explanation: "The politician tries to appear as 'one of the people' to gain trust."
    }
};

const gameStatements = [
    { id: 'stmt1', text_key: 'statement1_text', correctAnswer: 'tech_bandwagon', explanation_key: 'statement1_explanation' },
    { id: 'stmt2', text_key: 'statement2_text', correctAnswer: 'tech_name_calling', explanation_key: 'statement2_explanation' },
    { id: 'stmt3', text_key: 'statement3_text', correctAnswer: 'tech_glittering_generalities', explanation_key: 'statement3_explanation' },
    { id: 'stmt4', text_key: 'statement4_text', correctAnswer: 'tech_testimonial', explanation_key: 'statement4_explanation' },
    { id: 'stmt5', text_key: 'statement5_text', correctAnswer: 'tech_transfer', explanation_key: 'statement5_explanation' },
    { id: 'stmt6', text_key: 'statement6_text', correctAnswer: 'tech_plain_folks', explanation_key: 'statement6_explanation' }
];

const allTechniques = [
    'tech_glittering_generalities', 'tech_name_calling', 'tech_bandwagon',
    'tech_transfer', 'tech_testimonial', 'tech_plain_folks'
];

export default function PropagandaDetectorGame() {
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');
    const [userAnswers, setUserAnswers] = useState({});
    const [results, setResults] = useState({ feedback: '', score: null, details: {} });

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

    const handleAnswerChange = (statementId, techniqueKey) => {
        setUserAnswers(prev => ({ ...prev, [statementId]: techniqueKey }));
    };

    const checkAnswers = () => {
        let correctCount = 0;
        const newResultDetails = {};
        gameStatements.forEach(stmt => {
            if (userAnswers[stmt.id] === stmt.correctAnswer) {
                correctCount++;
                newResultDetails[stmt.id] = 'correct';
            } else {
                newResultDetails[stmt.id] = 'incorrect';
            }
        });

        const t = gameData[lang];
        if (correctCount === gameStatements.length) {
            setResults({ feedback: t.resultAllCorrect, score: correctCount, details: newResultDetails });
        } else {
            setResults({
                feedback: `${t.resultScore} ${correctCount} / ${gameStatements.length}. ${t.resultSomeIncorrect}`,
                score: correctCount,
                details: newResultDetails
            });
        }
    };

    const t = gameData[lang];

    return (
        <main className="container mx-auto px-6 py-12 flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full">
                <h1 className="text-3xl font-bold text-cyan-700 mb-4 text-center">{t.gameTitle}</h1>
                <p className="text-gray-600 mb-8 text-center">{t.gameInstructions}</p>

                <div id="statements-container" className="space-y-8">
                    {gameStatements.map((stmt, index) => {
                        const result = results.details[stmt.id];
                        return (
                            <div key={stmt.id} className={`statement-card p-6 rounded-lg border-l-4 transition-all ${
                                result === 'correct' ? 'border-cyan-500' : result === 'incorrect' ? 'border-red-400' : 'border-transparent'
                            }`}>
                                <p className="statement-text text-base italic text-gray-700 mb-4 p-3 bg-gray-50 rounded border-l-3 border-gray-400">
                                    {`${index + 1}. "${t[stmt.text_key]}"`}
                                </p>
                                <div className="technique-options mt-4 space-y-2">
                                    {allTechniques.map(techKey => (
                                        <label key={techKey} className={`technique-option-label block p-3 border rounded-md cursor-pointer transition-all ${
                                            userAnswers[stmt.id] === techKey ? 'bg-cyan-100 border-cyan-400 font-medium' : 'hover:bg-cyan-50 hover:border-cyan-300'
                                        }`}>
                                            <input
                                                type="radio"
                                                name={stmt.id}
                                                value={techKey}
                                                checked={userAnswers[stmt.id] === techKey}
                                                onChange={() => handleAnswerChange(stmt.id, techKey)}
                                                className="mr-3 accent-cyan-600"
                                            />
                                            <span className="technique-name font-semibold text-gray-800">{t[techKey]}</span>
                                            <span className="technique-desc ml-2 text-gray-500 text-sm">{`(${t[techKey + '_desc']})`}</span>
                                        </label>
                                    ))}
                                </div>
                                {result && (
                                    <div className={`feedback-explanation mt-3 p-3 rounded-md text-sm ${
                                        result === 'correct' 
                                        ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500' 
                                        : 'bg-rose-50 text-rose-800 border-l-4 border-rose-500'
                                    }`}>
                                        <p><span className="font-bold">{result === 'correct' ? t.feedbackCorrect : t.feedbackIncorrect}</span> {t.feedbackExplanation} {t[stmt.explanation_key]}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                <button onClick={checkAnswers} className="mt-8 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50">
                    {t.checkAnswersButton}
                </button>

                {results.feedback && (
                    <div className={`mt-6 text-center text-lg font-semibold ${results.score === gameStatements.length ? 'text-emerald-600' : 'text-red-600'}`}>
                        {results.feedback}
                    </div>
                )}
            </div>
        </main>
    );
}
