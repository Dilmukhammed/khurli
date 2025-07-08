import React, { useState, useEffect, useCallback } from 'react';
import AiChatWindow from '../../components/common/AiChatWindow';
import moduleService from '../../services/moduleService'; // Assuming this service is general enough

// Translations object for the Fake News Analysis module.
const translations = {
    ru: {
        pageTitle: "Анализ фейковых новостей",
        mainTitle: "Анализ фейковых новостей и Медиаграмотность",
        beginnerLevel: "Начальный уровень – Обнаружение фейковых новостей",
        askAiBtn: "Спросить ИИ",
        discussAiBtn: "Обсудить с ИИ",
        aiThinking: "ИИ думает...",
        closeAiChat: "Закрыть чат с ИИ",
        aiDiscussPrompt: "Давайте обсудим ваш ответ. Что бы вы хотели изучить подробнее?",
        submissionReceived: "Ответ получен.",
        aiErrorGetDetails: "Извините, не удалось получить детали для этого задания.",
        aiErrorEncountered: "Извините, произошла ошибка:",
        fakeNewsBTask1Title: "1. Распознавание фейковых новостей",
        fakeNewsBTask1Desc: "Прочитайте два заголовка ниже. Один из них правдоподобный (но ложный), а другой преувеличенный (очевидно фейковый). Решите, какой из них какой.",
        believableFalse: "Правдоподобный (но ложный)",
        exaggeratedFake: "Преувеличенный (фейк)",
        checkAnswersBtn: "Проверить ответы",
        submitBtn: "Отправить",
        allCorrectMessage: "Все ответы верны!",
        someIncorrectMessage: "Некоторые ответы неверны. Проверьте выделенные.",
        discussionQuestionsTitle: "Вопросы для обсуждения:",
        fakeNewsBTask1Discuss1: "Какой заголовок звучит более реалистично?",
        fakeNewsBTask1Discuss2: "Какие детали делают второй заголовок очевидно фейковым?",
        fakeNewsBTask1Discuss3: "Какие вопросы следует задать, прежде чем верить новостям в интернете?",
        intermediateLevel: "Средний уровень – Проверка фактов в фейковых новостях",
        fakeNewsITask1Title: "1. Проверка фактов в фейковых новостях",
        fakeNewsITask1Desc: "Прочитайте два фейковых заголовка и объясните, почему каждый из них ложный. Используйте интернет для поиска реальной информации.",
        placeholderExplanation: "Ваше объяснение...",
        followUpActivitiesTitle: "Дополнительные задания:",
        fakeNewsITask1FollowUp1: "Найдите как минимум два источника, которые доказывают ложность этих заголовков.",
        fakeNewsITask1FollowUp2: "Какие ключевые слова вы бы использовали для проверки этих утверждений?",
        fakeNewsITask1FollowUp3: "Перепишите эти заголовки, чтобы они стали более правдивыми.",
        advancedLevel: "Продвинутый уровень – Создание и анализ фейковых новостей",
        fakeNewsATask1Title: "1. Создание и анализ фейковых новостей",
        fakeNewsATask1Desc: "Придумайте свой собственный правдоподобный фейковый заголовок и преувеличенный фейковый заголовок об Узбекистане. Затем поменяйтесь с партнером и обсудите, как выявить фейковые новости.",
        believableFakeHeadlineLabel: "Ваш правдоподобный фейковый заголовок:",
        placeholderBelievableFake: "Введите правдоподобный фейковый заголовок...",
        exaggeratedFakeHeadlineLabel: "Ваш преувеличенный фейковый заголовок:",
        placeholderExaggeratedFake: "Введите преувеличенный фейковый заголовок...",
        followUpQuestionsTitle: "Вопросы для обсуждения:",
        fakeNewsATask1FollowUp1: "Что делает фейковую новость правдоподобной?",
        fakeNewsATask1FollowUp2: "Как люди могут защитить себя от веры в фейковые новости?",
        fakeNewsATask1FollowUp3: "Каковы реальные последствия фейковых новостей?",
    },
    en: {
        pageTitle: "Fake News Analysis",
        mainTitle: "Fake News Analysis and Media Literacy",
        beginnerLevel: "Beginner Level – Spotting Fake News",
        askAiBtn: "Ask AI",
        discussAiBtn: "Discuss with AI",
        aiThinking: "AI Thinking...",
        closeAiChat: "Close AI Chat",
        aiDiscussPrompt: "Let's discuss your response. What would you like to explore further?",
        submissionReceived: "Submission received.",
        aiErrorGetDetails: "Sorry, I couldn't get the details for this task.",
        aiErrorEncountered: "Sorry, I encountered an error:",
        fakeNewsBTask1Title: "1. Spotting Fake News",
        fakeNewsBTask1Desc: "Read the two headlines below. One is believable (but false), and the other is exaggerated (obviously fake). Decide which is which.",
        believableFalse: "Believable (but false)",
        exaggeratedFake: "Exaggerated (fake)",
        checkAnswersBtn: "Check Answers",
        submitBtn: "Submit",
        allCorrectMessage: "All answers are correct!",
        someIncorrectMessage: "Some answers are incorrect. Check the highlighted ones.",
        discussionQuestionsTitle: "Discussion Questions:",
        fakeNewsBTask1Discuss1: "Which headline sounds more realistic?",
        fakeNewsBTask1Discuss2: "What details make the second headline obviously fake?",
        fakeNewsBTask1Discuss3: "What questions should we ask before believing news online?",
        intermediateLevel: "Intermediate Level – Fact-Checking Fake News",
        fakeNewsITask1Title: "1. Fact-Checking Fake News",
        fakeNewsITask1Desc: "Read the two fake headlines and explain why each one is false. Research online to find real information.",
        placeholderExplanation: "Your explanation...",
        followUpActivitiesTitle: "Follow-up Activities:",
        fakeNewsITask1FollowUp1: "Find at least two sources that prove these headlines are false.",
        fakeNewsITask1FollowUp2: "What keywords should you use to fact-check these claims?",
        fakeNewsITask1FollowUp3: "Rewrite these headlines to make them more truthful.",
        advancedLevel: "Advanced Level – Creating and Analyzing Fake News",
        fakeNewsATask1Title: "1. Creating and Analyzing Fake News",
        fakeNewsATask1Desc: "Create your own believable fake headline and exaggerated fake headline about Uzbekistan. Then, swap with a partner and discuss how to identify fake news.",
        believableFakeHeadlineLabel: "Your believable fake headline:",
        placeholderBelievableFake: "Enter a believable fake headline...",
        exaggeratedFakeHeadlineLabel: "Your exaggerated fake headline:",
        placeholderExaggeratedFake: "Enter an exaggerated fake headline...",
        followUpQuestionsTitle: "Follow-up Questions:",
        fakeNewsATask1FollowUp1: "What makes a fake news story seem real?",
        fakeNewsATask1FollowUp2: "How can people protect themselves from believing fake news?",
        fakeNewsATask1FollowUp3: "What are some real-life consequences of fake news?",
    }
};

// Data for the interactive tasks
const beginnerTask1Data = [
    { id: 'h1', ru: "Заголовок 1: \"Узбекистан введет бесплатный общественный транспорт для всех жителей к 2026 году\"", en: "Headline 1: \"Uzbekistan to Introduce Free Public Transport for All Residents by 2026\"", answer: 'believable_false' },
    { id: 'h2', ru: "Заголовок 2: \"Инопланетяне приземлились в Бухаре и требуют попробовать плов\"", en: "Headline 2: \"Aliens Land in Bukhara and Demand to Try Plov\"", answer: 'exaggerated_fake' }
];

// Reusable component for the headline classification task
const HeadlineClassifierTask = ({
    questions, lang, title, description, options, checkBtnText,
    allCorrectMsg, someIncorrectMsg, taskKey, onAskAI,
    showAiButtonForTask, isAiTaskLoading, activeAiTaskKey,
    chatMessagesForTask, onSendChatMessage, onCloseChat
}) => {
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState({});
    const [feedback, setFeedback] = useState('');
    // Internal state to show AI button only after an attempt or if results are present
    const [allowAiButtonDisplay, setAllowAiButtonDisplay] = useState(false);


    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
        // Reset feedback if answers change
        setFeedback('');
        setAllowAiButtonDisplay(false); // Hide AI button until next check
    };

    const checkAnswers = () => {
        const newResults = {};
        let allCorrect = true;
        let anyAnswered = false;

        questions.forEach(q => {
            if (answers[q.id]) {
                anyAnswered = true;
                if (answers[q.id] === q.answer) {
                    newResults[q.id] = 'correct';
                } else {
                    newResults[q.id] = 'incorrect';
                    allCorrect = false;
                }
            } else {
                allCorrect = false; // Missing answer means not all correct
            }
        });

        setResults(newResults);
        setAllowAiButtonDisplay(true); // Allow AI button to show after check

        if (!anyAnswered && questions.length > 0) {
            setFeedback(''); // Or some message like "Please answer the questions."
        } else if (allCorrect) {
            setFeedback(allCorrectMsg);
        } else {
            setFeedback(someIncorrectMsg);
        }
    };
    
    const getResultClass = (isCorrect) => {
        if (isCorrect === 'correct') return 'text-green-600 font-bold';
        if (isCorrect === 'incorrect') return 'text-red-600 font-bold';
        return 'font-medium';
    };

    const getFeedbackClass = () => {
        if(feedback === allCorrectMsg) return 'text-green-600';
        if(feedback === someIncorrectMsg) return 'text-red-600';
        return '';
    };

    const t = translations[lang]; // For Ask AI button text

    // Determine if the "Ask AI" button should be shown
    const shouldShowAskAiButton = allowAiButtonDisplay && feedback === someIncorrectMsg && showAiButtonForTask;

    return (
        <div className="mb-8 p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="mb-4 text-sm text-gray-600">{description}</p>
            <div className="space-y-6">
                {questions.map((q) => (
                     <div key={q.id} className={`p-2 rounded-md ${results[q.id] ? (results[q.id] === 'correct' ? 'bg-green-50' : 'bg-red-50') : ''}`}>
                        <p className={`headline-text ${getResultClass(results[q.id])}`}>{q[lang]}</p>
                        <div className="mt-2">
                            {Object.entries(options).map(([value, labelKey]) => (
                                <label key={value} className="radio-label mr-4 inline-flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`headline_${taskKey}_${q.id}_type`} // Make name unique per taskKey
                                        value={value}
                                        checked={answers[q.id] === value}
                                        onChange={() => handleAnswerChange(q.id, value)}
                                        className="radio-input mr-2 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span>{translations[lang][labelKey]}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
             <button
                onClick={checkAnswers}
                className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {checkBtnText}
            </button>
            {feedback && (
                <div className={`result-message mt-3 text-sm font-medium ${getFeedbackClass()}`}>
                    {feedback}
                </div>
            )}
            {shouldShowAskAiButton && (
                <button
                    onClick={() => onAskAI(taskKey, answers, results)}
                    className="ask-ai-button mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                    disabled={isAiTaskLoading}
                >
                    {isAiTaskLoading ? (translations[lang]?.aiThinking || 'AI Thinking...') : (translations[lang]?.askAiBtn || 'Ask AI')}
                </button>
            )}
            {activeAiTaskKey === taskKey && (
                <div className="mt-4">
                    <AiChatWindow
                        messages={chatMessagesForTask}
                        isLoading={isAiTaskLoading}
                        onSendMessage={(message) => onSendChatMessage(taskKey, message, answers, results)}
                    />
                    <button
                        onClick={() => onCloseChat()}
                        className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                        {translations[lang]?.closeAiChat || 'Close AI Chat'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default function FakeNewsAnalysisModule() {
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');
    const [activeChatTaskKey, setActiveChatTaskKey] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [showAiButtons, setShowAiButtons] = useState({});
    const [intermediateTask1Answers, setIntermediateTask1Answers] = useState({ h1_exp: '', h2_exp: '' });
    const [advancedTask1Answers, setAdvancedTask1Answers] = useState({ believable_headline: '', exaggerated_headline: '' });
    const [saveFeedback, setSaveFeedback] = useState({});


    useEffect(() => {
        document.title = t('pageTitle'); // Using t a bit earlier
        // Initialize showAiButtons for relevant tasks if needed, or handle dynamically
        // For now, HeadlineClassifierTask will control its own "Ask AI" button visibility based on its results
    }, [lang]);

    const currentTranslations = translations[lang] || translations['en'];
    const t = useCallback((key) => {
        return currentTranslations[key] || translations['en'][key] || key;
    }, [currentTranslations]);

    // Helper function to format answers for AI
    const formatAnswersForAI = (answerObject) => {
        if (!answerObject || typeof answerObject !== 'object') return [];
        return Object.entries(answerObject).map(([key, value]) => `${key}: ${String(value)}`);
    };

    const getFakeNewsTaskDetailsForAI = (taskKey, currentLang, taskAnswers, taskResults) => {
        let block_context = "";
        let user_answers_formatted = [];
        let correct_answers_formatted = [];
        let interaction_type = 'explain_mistakes'; // Default for classification

        if (taskKey === 'fakeNewsBeginnerTask1') {
            block_context = `${t('fakeNewsBTask1Title')}\n${t('fakeNewsBTask1Desc')}\n\n`;
            block_context += beginnerTask1Data.map(h => `${h[currentLang]} (Your answer: ${taskAnswers?.[h.id] || 'Not answered'}, Correct: ${h.answer})`).join("\n");

            user_answers_formatted = formatAnswersForAI(taskAnswers);
            const correctAnswers = {};
            beginnerTask1Data.forEach(h => correctAnswers[h.id] = h.answer);
            correct_answers_formatted = formatAnswersForAI(correctAnswers);
        } else if (taskKey === 'fakeNewsIntermediateTask1') {
            interaction_type = 'discuss_open_ended';
            block_context = `${t('fakeNewsITask1Title')}\n${t('fakeNewsITask1Desc')}\n\n`;
            block_context += `Headline 1: ${currentLang === 'ru' ? 'Новый закон в Узбекистане требует от всех студентов изучать корейский язык' : 'New Law in Uzbekistan Requires All Students to Learn Korean'}\n`;
            block_context += `Headline 2: ${currentLang === 'ru' ? 'Ташкент стал первым городом, запретившим смартфоны' : 'Tashkent Becomes the First City to Ban Smartphones'}\n\n`;

            user_answers_formatted = [
                `Explanation for Headline 1: ${taskAnswers?.h1_exp || '(Not answered)'}`,
                `Explanation for Headline 2: ${taskAnswers?.h2_exp || '(Not answered)'}`
            ];
            correct_answers_formatted = []; // No specific "correct" answers for discussion
        } else if (taskKey === 'fakeNewsAdvancedTask1') {
            interaction_type = 'discuss_open_ended';
            block_context = `${t('fakeNewsATask1Title')}\n${t('fakeNewsATask1Desc')}\n\n`;
            block_context += `${t('believableFakeHeadlineLabel')}\n${t('exaggeratedFakeHeadlineLabel')}\n\n`;

            user_answers_formatted = [
                `Believable Fake Headline: ${taskAnswers?.believable_headline || '(Not provided)'}`,
                `Exaggerated Fake Headline: ${taskAnswers?.exaggerated_headline || '(Not provided)'}`
            ];
            correct_answers_formatted = [];
        }
        // Add other taskKeys here as needed

        return {
            block_context,
            user_answers: user_answers_formatted,
            correct_answers: correct_answers_formatted,
            interaction_type,
        };
    };

    const handleIntermediateTask1Change = (headlineKey, value) => {
        setIntermediateTask1Answers(prev => ({ ...prev, [headlineKey]: value }));
        // If submission feedback was shown, clear it
        if (saveFeedback['fakeNewsIntermediateTask1']) {
            setSaveFeedback(prev => ({ ...prev, ['fakeNewsIntermediateTask1']: '' }));
        }
        // Optionally hide AI button until next submission
        // setShowAiButtons(prev => ({ ...prev, ['fakeNewsIntermediateTask1']: false }));
    };

    const handleSubmitIntermediateTask1 = () => {
        const taskKey = 'fakeNewsIntermediateTask1';
        // Here you would typically save the answers to a backend
        // For now, we'll just simulate it and show the discuss button
        console.log(`Submitting answers for ${taskKey}:`, intermediateTask1Answers);
        setSaveFeedback(prev => ({ ...prev, [taskKey]: t('submissionReceived') || "Submission received." }));
        setShowAiButtons(prev => ({ ...prev, [taskKey]: true }));

        // Example of saving if moduleService is set up for it:
        /*
        moduleService.saveTaskAnswers('fake-news-analysis', taskKey, intermediateTask1Answers)
            .then(() => {
                setSaveFeedback(prev => ({ ...prev, [taskKey]: t('answersSavedSuccess') || "Answers saved!" }));
                setShowAiButtons(prev => ({ ...prev, [taskKey]: true }));
                setTimeout(() => {
                    setSaveFeedback(prev => ({ ...prev, [taskKey]: "" }));
                }, 2000);
            })
            .catch(err => {
                console.error(`Error saving answers for ${taskKey}:`, err);
                setSaveFeedback(prev => ({ ...prev, [taskKey]: t('answersSavedError') || "Save failed." }));
            });
        */
    };

    const handleAdvancedTask1Change = (headlineKey, value) => {
        setAdvancedTask1Answers(prev => ({ ...prev, [headlineKey]: value }));
        if (saveFeedback['fakeNewsAdvancedTask1']) {
            setSaveFeedback(prev => ({ ...prev, ['fakeNewsAdvancedTask1']: '' }));
        }
    };

    const handleSubmitAdvancedTask1 = () => {
        const taskKey = 'fakeNewsAdvancedTask1';
        console.log(`Submitting answers for ${taskKey}:`, advancedTask1Answers);
        setSaveFeedback(prev => ({ ...prev, [taskKey]: t('submissionReceived') || "Submission received." }));
        setShowAiButtons(prev => ({ ...prev, [taskKey]: true }));
        // Add backend saving logic here if needed, similar to handleSubmitIntermediateTask1
    };

    const handleAskAI = async (taskKey, userQuery = '', currentTaskAnswers, currentTaskResults = {}) => {
        if (isAiLoading && activeChatTaskKey === taskKey && userQuery === '') {
             console.log('AI is already loading for this task.');
             return;
        }

        setIsAiLoading(true);
        let currentMessages = chatMessages;

        if (!activeChatTaskKey || activeChatTaskKey !== taskKey ) {
            currentMessages = []; // Start fresh for a new task or if chat wasn't active for this task
        }

        if (userQuery) {
            const newUserMessage = { "role": 'user', "content": userQuery };
            currentMessages = [...currentMessages, newUserMessage];
        } else if (currentMessages.length === 0 && (taskKey === 'fakeNewsIntermediateTask1' || taskKey === 'fakeNewsAdvancedTask1')) {
            // For discussion tasks, add a default prompt if no userQuery and messages are empty
             currentMessages = [{ "role": 'assistant', "content": t('aiDiscussPrompt') || "Let's discuss your response. What would you like to explore further?" }];
        }

        setChatMessages(currentMessages);
        setActiveChatTaskKey(taskKey);

        // Add "Thinking..." message
        if (userQuery || currentMessages.length === 0 || (currentMessages.length > 0 && currentMessages[currentMessages.length -1].role === 'user') ) {
            setChatMessages(prev => [...prev, { "role": 'assistant', "content": t('aiThinking') || "Thinking..." }]);
        }

        const { block_context, user_answers, correct_answers, interaction_type } = getFakeNewsTaskDetailsForAI(taskKey, lang, currentTaskAnswers, currentTaskResults);

        if (!block_context) {
            console.error("[FakeNewsAnalysisModule] Could not get task details for AI. taskKey:", taskKey);
            setChatMessages(prev => [
                ...prev.filter(msg => msg.content !== 'Thinking...'), // Ensure Thinking... is handled if used
                { "role": 'assistant', "content": t('aiErrorGetDetails') || "Sorry, I couldn't get the details for this task." }
            ]);
            setIsAiLoading(false);
            return;
        }

        // Add a thinking message if it's a new interaction or query
        if (userQuery || chatMessages.length === 0 ) {
             setChatMessages(prev => [...prev, { "role": 'assistant', "content": t('aiThinking') || "Thinking..." }]);
        }


        try {
            // Using a generic endpoint name from moduleService, assuming it's like getAiProverbExplanation
            const response = await moduleService.getAiExplanation( // Changed from getAiProverbExplanation
                block_context,
                user_answers,
                correct_answers,
                userQuery,
                currentMessages.filter(msg => msg.content !== (t('aiThinking') || "Thinking...")), // Send history without "Thinking..."
                interaction_type
            );
            setChatMessages(prev => [
                ...prev.filter(msg => msg.content !== (t('aiThinking') || "Thinking...")),
                { "role": 'assistant', "content": response.explanation }
            ]);
        } catch (error) {
            console.error('[FakeNewsAnalysisModule] Error fetching AI explanation:', error);
            setChatMessages(prev => [
                ...prev.filter(msg => msg.content !== (t('aiThinking') || "Thinking...")),
                { "role": 'assistant', "content": `${t('aiErrorEncountered') || 'Sorry, I encountered an error:'} ${error.message}` }
            ]);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleCloseChat = () => {
        setActiveChatTaskKey(null);
        setChatMessages([]);
    };


    return (
        <div className="bg-gray-100 text-gray-800 font-sans">
            {/* GlobalStyles can be added here if needed, similar to CulturalProverbsModule */}
            <main className="container mx-auto px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{t.mainTitle}</h1>

                {/* Beginner Level Section */}
                <section className="level-section mb-12 p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-6 border-b pb-3">{t.beginnerLevel}</h2>
                    <HeadlineClassifierTask
                        taskKey="fakeNewsBeginnerTask1"
                        questions={beginnerTask1Data}
                        lang={lang}
                        title={t('fakeNewsBTask1Title')}
                        description={t('fakeNewsBTask1Desc')}
                        options={{ believable_false: 'believableFalse', exaggerated_fake: 'exaggeratedFake' }}
                        checkBtnText={t('checkAnswersBtn')}
                        allCorrectMsg={t('allCorrectMessage')}
                        someIncorrectMsg={t('someIncorrectMessage')}
                        onAskAI={(taskKey, currentAnswers, currentResults) => handleAskAI(taskKey, '', currentAnswers, currentResults)}
                        showAiButtonForTask={true} // Initially true, HeadlineClassifierTask will manage based on results
                        isAiTaskLoading={isAiLoading && activeChatTaskKey === "fakeNewsBeginnerTask1"}
                        activeAiTaskKey={activeChatTaskKey}
                        chatMessagesForTask={activeChatTaskKey === "fakeNewsBeginnerTask1" ? chatMessages : []}
                        onSendChatMessage={(taskKey, message, currentAnswers, currentResults) => handleAskAI(taskKey, message, currentAnswers, currentResults)}
                        onCloseChat={handleCloseChat}
                    />
                     <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-lg font-semibold mb-2">{t('discussionQuestionsTitle')}</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                            <li>{t.fakeNewsBTask1Discuss1}</li>
                            <li>{t.fakeNewsBTask1Discuss2}</li>
                            <li>{t.fakeNewsBTask1Discuss3}</li>
                        </ul>
                    </div>
                </section>

                {/* Intermediate Level Section */}
                <section className="level-section mb-12 p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-green-700 mb-6 border-b pb-3">{t.intermediateLevel}</h2>
                    <div className="mb-8 p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-3">{t('fakeNewsITask1Title')}</h3>
                        <p className="mb-4 text-sm text-gray-600">{t('fakeNewsITask1Desc')}</p>
                        <div className="space-y-6">
                            <div>
                                <p className="font-medium">{lang === 'ru' ? 'Заголовок 1: "Новый закон в Узбекистане требует от всех студентов изучать корейский язык"' : 'Headline 1: "New Law in Uzbekistan Requires All Students to Learn Korean"'}</p>
                                <textarea
                                    className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-green-500 focus:border-green-500"
                                    rows="3"
                                    placeholder={t('placeholderExplanation')}
                                    value={intermediateTask1Answers.h1_exp}
                                    onChange={(e) => handleIntermediateTask1Change('h1_exp', e.target.value)}
                                />
                            </div>
                            <div>
                                <p className="font-medium">{lang === 'ru' ? 'Заголовок 2: "Ташкент стал первым городом, запретившим смартфоны"' : 'Headline 2: "Tashkent Becomes the First City to Ban Smartphones"'}</p>
                                <textarea
                                    className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-green-500 focus:border-green-500"
                                    rows="3"
                                    placeholder={t('placeholderExplanation')}
                                    value={intermediateTask1Answers.h2_exp}
                                    onChange={(e) => handleIntermediateTask1Change('h2_exp', e.target.value)}
                                />
                            </div>
                        </div>
                         <button
                            onClick={handleSubmitIntermediateTask1}
                            className="mt-6 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                         >
                            {t('submitBtn')}
                        </button>
                        {saveFeedback['fakeNewsIntermediateTask1'] && <span className="ml-3 text-sm text-blue-600">{saveFeedback['fakeNewsIntermediateTask1']}</span>}

                        {showAiButtons['fakeNewsIntermediateTask1'] && (
                            <button
                                onClick={() => handleAskAI('fakeNewsIntermediateTask1', '', intermediateTask1Answers, {})}
                                className="discuss-ai-button ml-2 mt-6 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                disabled={isAiLoading && activeChatTaskKey === 'fakeNewsIntermediateTask1'}
                            >
                                {isAiLoading && activeChatTaskKey === 'fakeNewsIntermediateTask1' ? (t('aiThinking') || 'AI Thinking...') : (t('discussAiBtn') || 'Discuss with AI')}
                            </button>
                        )}
                        {activeChatTaskKey === 'fakeNewsIntermediateTask1' && (
                            <div className="mt-4">
                                <AiChatWindow
                                    messages={chatMessages}
                                    isLoading={isAiLoading}
                                    onSendMessage={(message) => handleAskAI('fakeNewsIntermediateTask1', message, intermediateTask1Answers, {})}
                                />
                                <button
                                    onClick={handleCloseChat}
                                    className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    {t('closeAiChat') || 'Close AI Chat'}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-lg font-semibold mb-2">{t('followUpActivitiesTitle')}</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                            <li>{t.fakeNewsITask1FollowUp1}</li>
                            <li>{t.fakeNewsITask1FollowUp2}</li>
                            <li>{t.fakeNewsITask1FollowUp3}</li>
                        </ul>
                    </div>
                </section>

                {/* Advanced Level Section */}
                <section className="level-section p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-red-700 mb-6 border-b pb-3">{t('advancedLevel')}</h2>
                    <div className="p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-3">{t('fakeNewsATask1Title')}</h3>
                        <p className="mb-4 text-sm text-gray-600">{t('fakeNewsATask1Desc')}</p>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="believable_fake_headline" className="block text-sm font-medium text-gray-700">{t('believableFakeHeadlineLabel')}</label>
                                <input
                                    type="text"
                                    id="believable_fake_headline"
                                    className="mt-1 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-red-500 focus:border-red-500"
                                    placeholder={t('placeholderBelievableFake')}
                                    value={advancedTask1Answers.believable_headline}
                                    onChange={(e) => handleAdvancedTask1Change('believable_headline', e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="exaggerated_fake_headline" className="block text-sm font-medium text-gray-700">{t('exaggeratedFakeHeadlineLabel')}</label>
                                <input
                                    type="text"
                                    id="exaggerated_fake_headline"
                                    className="mt-1 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-red-500 focus:border-red-500"
                                    placeholder={t('placeholderExaggeratedFake')}
                                    value={advancedTask1Answers.exaggerated_headline}
                                    onChange={(e) => handleAdvancedTask1Change('exaggerated_headline', e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleSubmitAdvancedTask1}
                            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            {t('submitBtn')}
                        </button>
                        {saveFeedback['fakeNewsAdvancedTask1'] && <span className="ml-3 text-sm text-blue-600">{saveFeedback['fakeNewsAdvancedTask1']}</span>}

                        {showAiButtons['fakeNewsAdvancedTask1'] && (
                            <button
                                onClick={() => handleAskAI('fakeNewsAdvancedTask1', '', advancedTask1Answers, {})}
                                className="discuss-ai-button ml-2 mt-6 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                disabled={isAiLoading && activeChatTaskKey === 'fakeNewsAdvancedTask1'}
                            >
                                {isAiLoading && activeChatTaskKey === 'fakeNewsAdvancedTask1' ? (t('aiThinking') || 'AI Thinking...') : (t('discussAiBtn') || 'Discuss with AI')}
                            </button>
                        )}
                        {activeChatTaskKey === 'fakeNewsAdvancedTask1' && (
                            <div className="mt-4">
                                <AiChatWindow
                                    messages={chatMessages}
                                    isLoading={isAiLoading}
                                    onSendMessage={(message) => handleAskAI('fakeNewsAdvancedTask1', message, advancedTask1Answers, {})}
                                />
                                <button
                                    onClick={handleCloseChat}
                                    className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    {t('closeAiChat') || 'Close AI Chat'}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-lg font-semibold mb-2">{t('followUpQuestionsTitle')}</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                            <li>{t.fakeNewsATask1FollowUp1}</li>
                            <li>{t.fakeNewsATask1FollowUp2}</li>
                            <li>{t.fakeNewsATask1FollowUp3}</li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
}
