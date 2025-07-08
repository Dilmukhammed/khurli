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
    allCorrectMsg, someIncorrectMsg, taskKey,
    // Props from main module
    answers: mainAnswers,
    onAnswerChange,
    onCheckAnswers,
    t,
    // Results and validation are passed down to display status
    validation: mainValidation,
    results: mainResults
    // AI Chat window and its trigger button are now rendered in the main module
}) => {

    const handleLocalAnswerChange = (questionId, answer) => {
        onAnswerChange(taskKey, questionId, answer);
    };

    const getResultClassBasedOnValidation = (questionId) => {
        const validationStatus = mainValidation?.[questionId];
        if (validationStatus === 'correct') return 'text-green-600 font-bold';
        if (validationStatus === 'incorrect') return 'text-red-600 font-bold';
        return 'font-medium';
    };

    const getFeedbackClass = () => {
        const resultType = mainResults?.type;
        if(resultType === 'correct') return 'text-green-600';
        if(resultType === 'incorrect') return 'text-red-600';
        return '';
    };

    return (
        <div className="mb-8 p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="mb-4 text-sm text-gray-600">{description}</p>
            <div className="space-y-6">
                {questions.map((q) => (
                     <div key={q.id} className={`p-2 rounded-md ${mainValidation?.[q.id] ? (mainValidation[q.id] === 'correct' ? 'bg-green-50' : 'bg-red-50') : ''}`}>
                        <p className={`headline-text ${getResultClassBasedOnValidation(q.id)}`}>{q[lang]}</p>
                        <div className="mt-2">
                            {Object.entries(options).map(([value, labelKey]) => (
                                <label key={value} className="radio-label mr-4 inline-flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`headline_${taskKey}_${q.id}_type`}
                                        value={value}
                                        checked={mainAnswers?.[q.id] === value}
                                        onChange={() => handleLocalAnswerChange(q.id, value)}
                                        className="radio-input mr-2 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span>{t(labelKey)}</span>
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

    // States aligned with CulturalProverbsModule
    const [answers, setAnswers] = useState({}); // Centralized answers for all tasks
    const [validation, setValidation] = useState({}); // For tasks with checkable answers
    const [results, setResults] = useState({}); // Stores feedback messages for tasks
    const [showAiButtons, setShowAiButtons] = useState({}); // Controls AI button visibility per task

    // AI Chat states
    const [activeChatTaskKey, setActiveChatTaskKey] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const [saveFeedback, setSaveFeedback] = useState({}); // For "Saved!" messages on submit

    // Progress tracking (optional for now, but good for future alignment)
    // const [completedTasks, setCompletedTasks] = useState({});
    // const [progressLoading, setProgressLoading] = useState(true);
    // const [progressError, setProgressError] = useState(null);


    useEffect(() => {
        const storedLang = localStorage.getItem('logiclingua-lang') || 'ru';
        setLang(storedLang);
        document.documentElement.lang = storedLang;
        // Title will be set using t() once it's initialized
    }, []);

    useEffect(() => {
        document.title = t('pageTitle');
    }, [lang]);


    const t = useCallback((key) => {
        return translations[lang]?.[key] || translations['en'][key] || key;
    }, [lang]);

    // Generic answer handler for all tasks
    const handleAnswerChange = (taskKey, itemKey, value) => {
        // if (isTaskCompleted(taskKey) && !progressLoading) return; // If progress tracking is added

        setAnswers(prev => ({
            ...prev,
            [taskKey]: { ...prev[taskKey], [itemKey]: value }
        }));
        // Reset results and validation for the specific task if an answer changes
        setResults(prev => { const newResults = {...prev}; delete newResults[taskKey]; return newResults; });
        setValidation(prev => { const newValidation = {...prev}; delete newValidation[taskKey]; return newValidation; });
        setShowAiButtons(prev => ({ ...prev, [taskKey]: false })); // Hide AI button until next check/submit
    };

    // Generic submit handler for open-ended tasks (Intermediate, Advanced)
    const handleSubmit = (taskKey) => {
        setResults(prev => ({ ...prev, [taskKey]: { type: 'submitted', message: t('submissionReceived') }}));
        setShowAiButtons(prev => ({ ...prev, [taskKey]: true })); // Show AI button after submission

        const taskAnswersToSave = answers[taskKey];
        if (taskAnswersToSave && Object.keys(taskAnswersToSave).length > 0) {
            // Simulate saving, replace with actual moduleService.saveTaskAnswers if available and needed
            console.log(`Simulating save for ${taskKey}:`, taskAnswersToSave);
            setSaveFeedback(prev => ({ ...prev, [taskKey]: "Saved!" })); // Using generic "Saved!"
            setTimeout(() => {
                setSaveFeedback(prev => ({ ...prev, [taskKey]: "" }));
            }, 2000);
            // Example: moduleService.saveTaskAnswers('fake-news-analysis', taskKey, taskAnswersToSave)...
        }
    };


    // Helper to format key-value objects into an array of strings for AI
    const formatObjectToStringArray = (obj) => {
        if (!obj || typeof obj !== 'object') return [];
        return Object.entries(obj).map(([key, value]) => `${key}: ${String(value)}`);
    };

    // Adapted from CulturalProverbsModule's getTaskDetailsForAI
    // Renamed from getGenericAiPayload
    const getTaskDetailsForAI_FakeNews = (taskKey) => {
        const currentTaskAnswers = answers[taskKey] || {};
        let block_context = '';
        let user_answers_formatted = []; // Will be an array of strings
        let correct_answers_formatted = []; // Will be an array of strings
        let interaction_type = '';
        // const currentLang = lang; // lang is available in the closure

        if (taskKey === 'fakeNewsBeginnerTask1') {
            interaction_type = 'explain_mistakes_headlines'; // Or a more generic 'explain_mistakes' if backend handles specifics
            block_context = `${t('fakeNewsBTask1Title')}\n${t('fakeNewsBTask1Desc')}\n\nHeadlines:\n`;
            block_context += beginnerTask1Data.map(h => `- ${h[lang]}`).join("\n");

            // User answers from the main 'answers' state
            const userSelections = {};
            beginnerTask1Data.forEach(h => {
                userSelections[h.id] = currentTaskAnswers[h.id] || 'Not answered';
            });
            user_answers_formatted = formatObjectToStringArray(userSelections);

            const correctAnswers = {};
            beginnerTask1Data.forEach(h => { correctAnswers[h.id] = h.answer; });
            correct_answers_formatted = formatObjectToStringArray(correctAnswers);

        } else if (taskKey === 'fakeNewsIntermediateTask1') {
            interaction_type = 'discuss_open_ended_explanations'; // Or 'discuss_open_ended'
            block_context = `${t('fakeNewsITask1Title')}\n${t('fakeNewsITask1Desc')}\n\nHeadlines for explanation:\n`;
            block_context += `1. ${lang === 'ru' ? 'Новый закон в Узбекистане требует от всех студентов изучать корейский язык' : 'New Law in Uzbekistan Requires All Students to Learn Korean'}\n`;
            block_context += `2. ${lang === 'ru' ? 'Ташкент стал первым городом, запретившим смартфоны' : 'Tashkent Becomes the First City to Ban Smartphones'}`;
            block_context += `\n\nFollow-up questions to consider: ${t('fakeNewsITask1FollowUp1')}, ${t('fakeNewsITask1FollowUp2')}, ${t('fakeNewsITask1FollowUp3')}`;


            // User answers for explanations
            const explanations = {
                explanation_headline1: currentTaskAnswers?.h1_exp || '(Not answered)',
                explanation_headline2: currentTaskAnswers?.h2_exp || '(Not answered)'
            };
            user_answers_formatted = formatObjectToStringArray(explanations);
            // No specific "correct" answers for this discussion type, so correct_answers_formatted remains empty.

        } else if (taskKey === 'fakeNewsAdvancedTask1') {
            interaction_type = 'discuss_open_ended_creations'; // Or 'discuss_open_ended'
            block_context = `${t('fakeNewsATask1Title')}\n${t('fakeNewsATask1Desc')}`;
            block_context += `\n\nFollow-up questions to consider: ${t('fakeNewsATask1FollowUp1')}, ${t('fakeNewsATask1FollowUp2')}, ${t('fakeNewsATask1FollowUp3')}`;


            const creations = {
                user_believable_headline: currentTaskAnswers?.believable_headline || '(Not provided)',
                user_exaggerated_headline: currentTaskAnswers?.exaggerated_headline || '(Not provided)'
            };
            user_answers_formatted = formatObjectToStringArray(creations);
            // No specific "correct" answers for this discussion type.
        } else {
            console.warn(`Task ${taskKey} not configured for AI interaction in getTaskDetailsForAI_FakeNews.`);
            // Return a default structure or throw an error
            return {
                block_context: "Task not configured.",
                user_answers: [],
                correct_answers: [],
                interaction_type: "error"
            };
        }

        return {
            // module_id: 'fake-news-analysis', // This might be passed directly to the service call
            // task_id: taskKey, // Or a more specific ID if needed by backend
            block_context,
            user_answers: user_answers_formatted, // Ensure this is the key the service expects for user's answers
            correct_answers: correct_answers_formatted, // Ensure this is the key for correct answers
            interaction_type,
        };
    };

    const handleAskAI = async (taskKey, userQuery = '') => {
        if (isAiLoading && activeChatTaskKey === taskKey && userQuery === '') {
             console.log('AI is already loading for this task.');
             return;
        }

        setIsAiLoading(true);
        let currentMessages = chatMessages;

        if (!activeChatTaskKey || activeChatTaskKey !== taskKey ) {
            currentMessages = [];
        }

        if (userQuery) {
            const newUserMessage = { "role": 'user', "content": userQuery };
            currentMessages = [...currentMessages, newUserMessage];
        } else if (currentMessages.length === 0 && (taskKey === 'fakeNewsIntermediateTask1' || taskKey === 'fakeNewsAdvancedTask1')) {
             currentMessages = [{ "role": 'assistant', "content": t('aiDiscussPrompt') || "Let's discuss your response. What would you like to explore further?" }];
        }

        setChatMessages(currentMessages);
        setActiveChatTaskKey(taskKey);

        if (userQuery || currentMessages.length === 0 || (currentMessages.length > 0 && currentMessages[currentMessages.length -1].role === 'user') ) {
            if (currentMessages.length === 0 || currentMessages[currentMessages.length -1].content !== (t('aiThinking') || "Thinking...")) {
                 setChatMessages(prev => [...prev, { "role": 'assistant', "content": t('aiThinking') || "Thinking..." }]);
            }
        }

        const {
            block_context,
            user_answers: user_answers_for_ai, // Renaming to avoid conflict with component's 'answers' state
            correct_answers: correct_answers_for_ai,
            interaction_type
        } = getTaskDetailsForAI_FakeNews(taskKey);

        if (interaction_type === "error" || !block_context) {
            console.error("[FakeNewsAnalysisModule] Could not get valid task details for AI. taskKey:", taskKey);
            setChatMessages(prev => [
                ...prev.filter(msg => msg.content !== (t('aiThinking') || "Thinking...")),
                { "role": 'assistant', "content": t('aiErrorGetDetails') || "Sorry, I couldn't get the details for this task." }
            ]);
            setIsAiLoading(false);
            return;
        }

        try {
            const response = await moduleService.getGenericAiInteraction({
                ...payload, // Spread the payload from getGenericAiPayload
                userQuery: userQuery, // Pass userQuery separately as it's handled by handleAskAI
                chatMessages: currentMessages.filter(msg => msg.content !== (t('aiThinking') || "Thinking...")), // Send history
            });
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
                                    value={answers.fakeNewsIntermediateTask1?.h1_exp || ''}
                                    onChange={(e) => handleAnswerChange('fakeNewsIntermediateTask1', 'h1_exp', e.target.value)}
                                />
                            </div>
                            <div>
                                <p className="font-medium">{lang === 'ru' ? 'Заголовок 2: "Ташкент стал первым городом, запретившим смартфоны"' : 'Headline 2: "Tashkent Becomes the First City to Ban Smartphones"'}</p>
                                <textarea
                                    className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-green-500 focus:border-green-500"
                                    rows="3"
                                    placeholder={t('placeholderExplanation')}
                                    value={answers.fakeNewsIntermediateTask1?.h2_exp || ''}
                                    onChange={(e) => handleAnswerChange('fakeNewsIntermediateTask1', 'h2_exp', e.target.value)}
                                />
                            </div>
                        </div>
                         <button
                            onClick={() => handleSubmit('fakeNewsIntermediateTask1')}
                            className="mt-6 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                         >
                            {t('submitBtn')}
                        </button>
                        {saveFeedback['fakeNewsIntermediateTask1'] && <span className="ml-3 text-sm text-blue-600">{saveFeedback['fakeNewsIntermediateTask1']}</span>}

                        {showAiButtons['fakeNewsIntermediateTask1'] && (
                            <button
                                onClick={() => handleAskAI('fakeNewsIntermediateTask1')}
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
                                    onSendMessage={(message) => handleAskAI('fakeNewsIntermediateTask1', message)}
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
                                    value={answers.fakeNewsAdvancedTask1?.believable_headline || ''}
                                    onChange={(e) => handleAnswerChange('fakeNewsAdvancedTask1', 'believable_headline', e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="exaggerated_fake_headline" className="block text-sm font-medium text-gray-700">{t('exaggeratedFakeHeadlineLabel')}</label>
                                <input
                                    type="text"
                                    id="exaggerated_fake_headline"
                                    className="mt-1 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-red-500 focus:border-red-500"
                                    placeholder={t('placeholderExaggeratedFake')}
                                    value={answers.fakeNewsAdvancedTask1?.exaggerated_headline || ''}
                                    onChange={(e) => handleAnswerChange('fakeNewsAdvancedTask1', 'exaggerated_headline', e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => handleSubmit('fakeNewsAdvancedTask1')}
                            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            {t('submitBtn')}
                        </button>
                        {saveFeedback['fakeNewsAdvancedTask1'] && <span className="ml-3 text-sm text-blue-600">{saveFeedback['fakeNewsAdvancedTask1']}</span>}

                        {showAiButtons['fakeNewsAdvancedTask1'] && (
                            <button
                                onClick={() => handleAskAI('fakeNewsAdvancedTask1')}
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
                                    onSendMessage={(message) => handleAskAI('fakeNewsAdvancedTask1', message)}
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
