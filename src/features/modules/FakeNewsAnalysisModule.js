import React, { useState, useEffect, useCallback } from 'react';
import moduleService from '../../services/moduleService'; // Import moduleService
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import AiChatWindow from '../../components/common/AiChatWindow'; // Import AiChatWindow

// Translations object for the Fake News Analysis module.
const translations = {
    ru: {
        pageTitle: "Анализ фейковых новостей",
        mainTitle: "Анализ фейковых новостей и Медиаграмотность",
        beginnerLevel: "Начальный уровень – Обнаружение фейковых новостей",
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
    questions, lang, title, description, options, checkBtnText, allCorrectMsg, someIncorrectMsg,
    taskKey, // New prop
    moduleId, // New prop
    isCompleted, // New prop: boolean
    onTaskCompleted, // New prop: function(taskKey)
    onAskAi, // New prop: function(taskKey, contextData)
    // showAiButtonInitially = false, // Optional: if AI button should show before check
    mainIsAiLoading, // New prop: boolean, global AI loading state
    activeAiTaskKeyInParent // New prop: string, taskKey of currently active AI chat in parent
}) => {
    const [currentAnswers, setCurrentAnswers] = useState({}); // Renamed to avoid conflict if lifting state later
    const [currentResults, setCurrentResults] = useState({}); // Renamed
    const [currentFeedback, setCurrentFeedback] = useState(''); // Renamed
    const [showOwnAiButton, setShowOwnAiButton] = useState(false); // To show AI button after check

    const handleAnswerChange = (questionId, answer) => {
        if (isCompleted) return; // Don't allow changes if task is completed
        setCurrentAnswers(prev => ({ ...prev, [questionId]: answer }));
        // Clear feedback when an answer changes, so user knows they need to re-check
        setCurrentFeedback('');
        setShowOwnAiButton(false); // Hide AI button until re-checked
        setCurrentResults({}); // Clear previous validation highlights
    };

    const checkCurrentAnswers = () => {
        if (isCompleted) return;

        const newResults = {};
        let allCorrect = true;
        let anyAnswered = false;

        questions.forEach(q => {
            if (currentAnswers[q.id]) {
                anyAnswered = true;
                if (currentAnswers[q.id] === q.answer) {
                    newResults[q.id] = 'correct';
                } else {
                    newResults[q.id] = 'incorrect';
                    allCorrect = false;
                }
            } else {
                allCorrect = false; // Missing answer means not all correct
            }
        });

        setCurrentResults(newResults);
        setShowOwnAiButton(true); // Show AI button after checking

        if (!anyAnswered && questions.length > 0) {
            setCurrentFeedback(''); // Or a message like "Please answer the questions."
        } else if (allCorrect) {
            setCurrentFeedback(allCorrectMsg);
            if (onTaskCompleted && !isCompleted) { // Call onTaskCompleted only if not already marked completed
                onTaskCompleted(taskKey);
            }
        } else {
            setCurrentFeedback(someIncorrectMsg);
        }
    };

    const handleAskAiClick = () => {
        if (onAskAi) {
            const contextData = {
                questionsData: questions.map(q => ({ id: q.id, text: q[lang], options: options })),
                userAnswersData: currentAnswers,
                correctAnswersData: questions.reduce((acc, q) => { acc[q.id] = q.answer; return acc; }, {}),
                isSelfCheckCorrect: currentFeedback === allCorrectMsg, // Pass if user's self-check was all correct
                overallFeedback: currentFeedback // Pass the feedback message
            };
            onAskAi(taskKey, contextData);
        }
    };
    
    const getResultClass = (isCorrect) => {
        if (isCorrect === 'correct') return 'text-green-600 font-bold';
        if (isCorrect === 'incorrect') return 'text-red-600 font-bold';
        return 'font-medium';
    };

    const getFeedbackClass = () => {
        if(currentFeedback === allCorrectMsg) return 'text-green-600';
        if(currentFeedback === someIncorrectMsg) return 'text-red-600';
        return '';
    };

    const isButtonDisabled = isCompleted || (mainIsAiLoading && activeAiTaskKeyInParent !== taskKey);

    return (
        <div className="mb-8 p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="mb-4 text-sm text-gray-600">{description}</p>
            <div className="space-y-6">
                {questions.map((q) => (
                     <div key={q.id} className={`p-2 rounded-md ${currentResults[q.id] ? (currentResults[q.id] === 'correct' ? 'bg-green-50' : 'bg-red-50') : ''}`}>
                        <p className={`headline-text ${getResultClass(currentResults[q.id])}`}>{q[lang]}</p>
                        <div className="mt-2">
                            {Object.entries(options).map(([value, labelKey]) => (
                                <label key={value} className="radio-label mr-4 inline-flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`headline_${taskKey}_${q.id}_type`} // Ensure unique name for radio group per task instance
                                        value={value}
                                        checked={currentAnswers[q.id] === value}
                                        onChange={() => handleAnswerChange(q.id, value)}
                                        disabled={isButtonDisabled}
                                        className="radio-input mr-2 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span>{translations[lang][labelKey]}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex items-center space-x-3"> {/* Flex container for buttons */}
                <button
                    onClick={checkCurrentAnswers}
                    disabled={isButtonDisabled}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {checkBtnText}
                </button>
                {showOwnAiButton && onAskAi && (
                    <button
                        onClick={handleAskAiClick}
                        disabled={isButtonDisabled}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 disabled:opacity-50"
                    >
                        {mainIsAiLoading && activeAiTaskKeyInParent === taskKey ? (translations[lang].aiThinking || 'AI Thinking...') : (translations[lang].askAiBtn || 'Ask AI')}
                    </button>
                )}
            </div>
            {currentFeedback && (
                <div className={`result-message mt-3 text-sm font-medium ${getFeedbackClass()}`}>
                    {currentFeedback}
                </div>
            )}
        </div>
    );
};

export default function FakeNewsAnalysisModule() {
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');
    const [answers, setAnswers] = useState({}); // State for user answers
    const { isAuthenticated } = useAuth(); // Auth context

    // State for AI Chat
    const [activeChatTaskKey, setActiveChatTaskKey] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [currentAiError, setCurrentAiError] = useState({}); // Separate error state for AI
    const [showAiButtons, setShowAiButtons] = useState({}); // Controls visibility of AI buttons
    const [saveFeedback, setSaveFeedback] = useState({}); // For "Saved!" messages

    // Task IDs for savable inputs
    const savableTaskIds = {
        intermediateFactCheck: 'intermediate_fact_check',
        advancedHeadlineCreation: 'advanced_headline_creation'
    };
    // Task ID for the beginner completable task
    const beginnerTask1Key = 'beginner_spotting_fakenews';

    const [completedTasks, setCompletedTasks] = useState({}); // State for task completion

    useEffect(() => {
        document.title = translations[lang].pageTitle;
        
        const handleStorageChange = (event) => {
            if (event.key === 'logiclingua-lang') {
                setLang(event.newValue || 'ru');
            }
        };
        window.addEventListener('storage', handleStorageChange);

        // Load saved answers when component mounts or user/lang changes
        const loadInitialData = async () => { // Renamed from loadAnswers for clarity
            console.log('[FakeNewsAnalysisModule] loadInitialData triggered. isAuthenticated:', isAuthenticated);
            if (isAuthenticated) {
                const loadedTextAnswers = {}; // For text based answers
                const initialCompletedStatuses = {}; // For completion statuses

                try {
                    // Load completion statuses (including for beginner task)
                    console.log('[FakeNewsAnalysisModule] Fetching module progress...');
                    const progressData = await moduleService.getModuleProgress('fake-news-analysis');
                    console.log('[FakeNewsAnalysisModule] Raw progressData from service:', progressData);
                    if (progressData && Array.isArray(progressData)) {
                        progressData.forEach(item => {
                            if (item.status === 'completed') {
                                initialCompletedStatuses[item.task_id] = true;
                            }
                        });
                    }
                    console.log('[FakeNewsAnalysisModule] Parsed initialCompletedStatuses:', initialCompletedStatuses);
                    setCompletedTasks(initialCompletedStatuses);

                    // Load text answers for savable tasks
                    console.log(`[FakeNewsAnalysisModule] Fetching answers for task: ${savableTaskIds.intermediateFactCheck}`);
                    const intermediateAnswers = await moduleService.getTaskAnswers('fake-news-analysis', savableTaskIds.intermediateFactCheck);
                    console.log(`[FakeNewsAnalysisModule] Raw intermediateAnswers for ${savableTaskIds.intermediateFactCheck}:`, intermediateAnswers);
                    if (intermediateAnswers) {
                        loadedTextAnswers[savableTaskIds.intermediateFactCheck] = intermediateAnswers;
                    }

                    console.log(`[FakeNewsAnalysisModule] Fetching answers for task: ${savableTaskIds.advancedHeadlineCreation}`);
                    const advancedAnswers = await moduleService.getTaskAnswers('fake-news-analysis', savableTaskIds.advancedHeadlineCreation);
                    console.log(`[FakeNewsAnalysisModule] Raw advancedAnswers for ${savableTaskIds.advancedHeadlineCreation}:`, advancedAnswers);
                    if (advancedAnswers) {
                        loadedTextAnswers[savableTaskIds.advancedHeadlineCreation] = advancedAnswers;
                    }

                    console.log('[FakeNewsAnalysisModule] Parsed loadedTextAnswers:', loadedTextAnswers);
                    if (Object.keys(loadedTextAnswers).length > 0) {
                        setAnswers(prev => ({ ...prev, ...loadedTextAnswers }));
                    } else {
                        setAnswers(prev => ({...prev})); // Ensure re-render even if empty, though not strictly necessary if initial is {}
                    }

                } catch (error) {
                    console.error("[FakeNewsAnalysisModule] Error loading initial data:", error);
                }
            } else {
                console.log('[FakeNewsAnalysisModule] User not authenticated, clearing answers and completed tasks.');
                setAnswers({}); // Clear answers if not authenticated
                setCompletedTasks({}); // Clear completed tasks if not authenticated
            }
        };
        loadInitialData();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [lang, isAuthenticated]); // Updated Dependencies: lang and isAuthenticated are the primary triggers.

    // useEffect to log state changes for debugging
    useEffect(() => {
        console.log('[FakeNewsAnalysisModule] answers state updated:', answers);
    }, [answers]);

    useEffect(() => {
        console.log('[FakeNewsAnalysisModule] completedTasks state updated:', completedTasks);
    }, [completedTasks]);

    const t = translations[lang];

    const handleAnswerChange = useCallback((taskId, itemKey, value) => {
        setAnswers(prev => ({
            ...prev,
            [taskId]: {
                ...prev[taskId],
                [itemKey]: value
            }
        }));
    }, []);

    // Placeholder for handleSubmit, will be implemented in "Save Logic" step
    const handleSubmit = useCallback(async (taskId) => {
        if (!isAuthenticated) {
            alert("Please log in to save your progress.");
            return;
        }
        const answersToSave = answers[taskId];
        if (answersToSave && Object.keys(answersToSave).length > 0) {
            try {
                await moduleService.saveTaskAnswers('fake-news-analysis', taskId, answersToSave);
                console.log(`Answers for ${taskId} saved successfully.`);
                setSaveFeedback(prev => ({ ...prev, [taskId]: "Saved!" }));
                setShowAiButtons(prev => ({ ...prev, [taskId]: true })); // Show AI button
                setTimeout(() => {
                    setSaveFeedback(prev => ({ ...prev, [taskId]: "" }));
                }, 3000);

                // If the task is one of the text-based ones, also mark it as completed.
                if (taskId === savableTaskIds.intermediateFactCheck || taskId === savableTaskIds.advancedHeadlineCreation) {
                    try {
                        await moduleService.markTaskAsCompleted('fake-news-analysis', taskId);
                        setCompletedTasks(prev => ({ ...prev, [taskId]: true }));
                        console.log(`Task ${taskId} also marked as completed after saving answers.`);
                    } catch (completionError) {
                        console.error(`Error marking text task ${taskId} as completed after saving answers:`, completionError);
                        // Optionally, inform user that completion status might not have updated
                    }
                }
            } catch (error) {
                console.error(`Error saving answers for ${taskId}:`, error);
                setSaveFeedback(prev => ({ ...prev, [taskId]: "Save failed. Please try again." }));
                setTimeout(() => {
                    setSaveFeedback(prev => ({ ...prev, [taskId]: "" }));
                }, 4000);
            }
        }
    }, [answers, isAuthenticated, savableTaskIds]); // Added savableTaskIds to dependencies

    const handleTaskCompleted = useCallback(async (taskKey) => {
        if (!isAuthenticated) {
            console.warn("User not authenticated. Cannot mark task as completed.");
            return;
        }
        try {
            await moduleService.markTaskAsCompleted('fake-news-analysis', taskKey);
            setCompletedTasks(prev => ({ ...prev, [taskKey]: true }));
            setShowAiButtons(prev => ({ ...prev, [taskKey]: true })); // Show AI button once task is completed
            console.log(`Task ${taskKey} marked as completed.`);
        } catch (error) {
            console.error(`Error marking task ${taskKey} as completed:`, error);
        }
    }, [isAuthenticated]);

    const getTaskDetailsForAI_FakeNews = useCallback((taskKey) => {
        const taskAnswers = answers[taskKey] || {}; // User's free-text answers for savable tasks
        let block_context = "";
        let user_inputs = [];
        let correct_answers_data = [];
        let interaction_type = 'discuss_open_ended'; // Default

        if (taskKey === beginnerTask1Key) { // Beginner Task 1 (Headline Classifier)
            interaction_type = 'explain_mistakes'; // Or a more specific one if AI supports it well
            block_context = `${t.fakeNewsBTask1Title}\n${t.fakeNewsBTask1Desc}\n\nHeadlines:\n${beginnerTask1Data.map(q => `${q.id}. ${q[lang]}`).join('\n')}`;

            // The 'answers' for HeadlineClassifierTask are managed internally by it.
            // We need to receive them when 'onAskAi' is called from HeadlineClassifierTask.
            // The `onAskAi` in `HeadlineClassifierTask` calls parent's `handleAskAI_FakeNews`
            // which then calls this `getTaskDetailsForAI_FakeNews`.
            // The `contextData` from `HeadlineClassifierTask.handleAskAiClick` needs to be made available here.
            // This suggests `getTaskDetailsForAI_FakeNews` might need to accept this `contextData` or
            // `handleAskAI_FakeNews` should pass it directly to `moduleService.getGenericAiInteraction`.

            // For now, let's assume `handleAskAI_FakeNews` will be adapted to pass `contextData`
            // directly if `taskKey` is `beginnerTask1Key`.
            // So, this function might not need to do much for `beginnerTask1Key` if `handleAskAI_FakeNews` handles it.
            // OR, `handleAskAI_FakeNews` passes `contextData.userAnswersData` etc. to this function.

            // Let's assume `handleAskAI_FakeNews` will pass `additionalContextData` for this case.
            // This function will be called by `handleAskAI_FakeNews` which receives context from child.
            // We will modify `handleAskAI_FakeNews` to pass this child context.
            // For now, this function will just set up the basic block_context.
            // The actual user_inputs and correct_answers_data for beginnerTask1Key will be
            // constructed in handleAskAI_FakeNews from data passed by HeadlineClassifierTask.
            // This is a bit of a workaround because getTaskDetailsForAI_FakeNews primarily uses 'answers' state.

        } else if (taskKey === savableTaskIds.intermediateFactCheck) {
            block_context = `${t.fakeNewsITask1Title}\n${t.fakeNewsITask1Desc}\n\nHeadline 1 (RU): "Новый закон в Узбекистане требует от всех студентов изучать корейский язык"\nHeadline 1 (EN): "New Law in Uzbekistan Requires All Students to Learn Korean"\n\nHeadline 2 (RU): "Ташкент стал первым городом, запретившим смартфоны"\nHeadline 2 (EN): "Tashkent Becomes the First City to Ban Smartphones"`;
            user_inputs.push(`Explanation for Headline 1: ${taskAnswers.headline1_explanation || '(Not answered)'}`);
            user_inputs.push(`Explanation for Headline 2: ${taskAnswers.headline2_explanation || '(Not answered)'}`);
        } else if (taskKey === savableTaskIds.advancedHeadlineCreation) {
            block_context = `${t.fakeNewsATask1Title}\n${t.fakeNewsATask1Desc}`;
            user_inputs.push(`User's believable fake headline: ${taskAnswers.believable_headline || '(Not provided)'}`);
            user_inputs.push(`User's exaggerated fake headline: ${taskAnswers.exaggerated_headline || '(Not provided)'}`);
        } else {
            block_context = `Discussion for task: ${taskKey}`;
            user_inputs.push(`Current answers: ${JSON.stringify(taskAnswers)}`);
        }

        return {
            module_id: 'fake-news-analysis',
            task_id: taskKey,
            interaction_type,
            block_context,
            user_inputs,
            correct_answers_data, // Will be empty for discussion, populated in handleAskAI for beginnerTask1
        };
    }, [answers, lang, t, savableTaskIds, beginnerTask1Key]); // Added beginnerTask1Key

    const handleAskAI_FakeNews = useCallback(async (taskKey, queryOrContextData = '', isContextData = false) => {
        if (isAiLoading && activeChatTaskKey === taskKey) return; // Prevent multiple calls if already loading for this task
        setIsAiLoading(true);
        setActiveChatTaskKey(taskKey);
        setCurrentAiError(prev => ({ ...prev, [taskKey]: null }));

        let newChatMessagesHistory = [...chatMessages];
        let userQueryForAPI = '';

        if (isContextData) { // Initial call from a task button (e.g., HeadlineClassifierTask)
            // queryOrContextData is contextData from child
            // For initial calls, especially from HeadlineClassifierTask, start with fresh chat for this task's context.
            newChatMessagesHistory = []; // Reset messages for a new AI session for this task
        } else { // Follow-up query from AiChatWindow for the activeChatTaskKey
            userQueryForAPI = queryOrContextData; // This is the actual user text query
            if (userQueryForAPI) { // Add user's new query to chat display
                newChatMessagesHistory = [...newChatMessagesHistory, { role: 'user', content: userQueryForAPI }];
            }
        }
        setChatMessages(newChatMessagesHistory); // Update displayed chat immediately with user's new query if any

        const thinkingMsg = { role: 'assistant', content: t.aiThinking || 'AI Thinking...' };
        setChatMessages(prev => [...prev, thinkingMsg]); // Add thinking message

        try {
            let aiRequestData;

            if (taskKey === beginnerTask1Key && isContextData) {
                const contextDataFromChild = queryOrContextData;
                const optionsString = contextDataFromChild.questionsData[0]?.options ?
                                      Object.values(contextDataFromChild.questionsData[0].options)
                                            .map(optKey => t[optKey] || optKey)
                                            .join(', ')
                                      : 'Fact, Opinion';

                aiRequestData = {
                    module_id: 'fake-news-analysis',
                    task_id: taskKey,
                    interaction_type: 'explain_mistakes',
                    block_context: `${t.fakeNewsBTask1Title}\n${t.fakeNewsBTask1Desc}\n\nHeadlines:\n${contextDataFromChild.questionsData.map(q => `${q.id}. ${q.text}`).join('\n')}\nOptions available: ${optionsString}`,
                    user_inputs: contextDataFromChild.questionsData.map(q_data => {
                        const userAnswerValue = contextDataFromChild.userAnswersData[q_data.id];
                        const userAnswerDisplay = userAnswerValue ? (t[contextDataFromChild.questionsData[0].options[userAnswerValue]] || userAnswerValue) : 'Not answered';
                        return `For headline "${q_data.text.substring(0,30)}...": Your answer was '${userAnswerDisplay}'.`;
                    }),
                    correct_answers_data: contextDataFromChild.questionsData.map(q_data => {
                        const correctAnswerValue = contextDataFromChild.correctAnswersData[q_data.id];
                        const correctAnswerDisplay = correctAnswerValue ? (t[contextDataFromChild.questionsData[0].options[correctAnswerValue]] || correctAnswerValue) : 'N/A';
                        return `For headline "${q_data.text.substring(0,30)}...": The correct classification is '${correctAnswerDisplay}'.`;
                    }),
                    userQuery: '', // No specific user text query for this initial AI explanation from button
                    chatMessages: [] // Start fresh backend chat history for this specific interaction
                };
            } else {
                // For other tasks (intermediate, advanced) initial call, or any follow-up query
                aiRequestData = getTaskDetailsForAI_FakeNews(taskKey); // Gets base context from main 'answers' state
                aiRequestData.userQuery = userQueryForAPI; // This will be empty if isContextData was true for non-beginner
                aiRequestData.chatMessages = newChatMessagesHistory.filter(msg => msg.content !== thinkingMsg.content);
            }

            const response = await moduleService.getGenericAiInteraction(aiRequestData);

            setChatMessages(prev => [
                ...prev.filter(msg => msg.content !== thinkingMsg.content), // Remove "Thinking..."
                { role: 'assistant', content: response.explanation }
            ]);
        } catch (error) {
            console.error(`Error fetching AI response for ${taskKey} in FakeNewsAnalysisModule:`, error);
            const errorMsg = error.message || (t.aiError || 'Failed to get AI response.');
            setChatMessages(prev => [
                ...prev.filter(msg => msg.content !== thinkingMsg.content), // Remove "Thinking..."
                { role: 'assistant', content: `Sorry, I encountered an error: ${errorMsg}` }
            ]);
            setCurrentAiError(prev => ({ ...prev, [taskKey]: errorMsg }));
        } finally {
            setIsAiLoading(false);
        }
    }, [isAiLoading, chatMessages, getTaskDetailsForAI_FakeNews, t]);


    return (
        <div className="bg-gray-100 text-gray-800 font-sans">
            <main className="container mx-auto px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{t.mainTitle}</h1>

                {/* Beginner Level Section */}
                <section className="level-section mb-12 p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-6 border-b pb-3">{t.beginnerLevel}</h2>
                    <HeadlineClassifierTask
                        taskKey={beginnerTask1Key}
                        moduleId="fake-news-analysis"
                        questions={beginnerTask1Data}
                        lang={lang}
                        title={t.fakeNewsBTask1Title}
                        description={t.fakeNewsBTask1Desc}
                        options={{ believable_false: 'believableFalse', exaggerated_fake: 'exaggeratedFake' }}
                        checkBtnText={t.checkAnswersBtn}
                        allCorrectMsg={t.allCorrectMessage}
                        someIncorrectMsg={t.someIncorrectMessage}
                        isCompleted={!!completedTasks[beginnerTask1Key]}
                        onTaskCompleted={handleTaskCompleted}
                        onAskAi={handleAskAI_FakeNews}
                        showAiButton={showAiButtons[beginnerTask1Key]}
                        mainIsAiLoading={isAiLoading}
                        activeAiTaskKeyInParent={activeChatTaskKey}
                    />
                    {/* AI Chat Window for Beginner Task 1 */}
                    {activeChatTaskKey === beginnerTask1Key && (
                        <div className="mt-4">
                            <AiChatWindow
                                messages={chatMessages}
                                isLoading={isAiLoading}
                                onSendMessage={(message) => handleAskAI_FakeNews(beginnerTask1Key, message)}
                            />
                            <button
                                onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentAiError(prev => ({...prev, [beginnerTask1Key]: null})); }}
                                className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                {translations[lang].closeAiChat || 'Close AI Chat'}
                            </button>
                        </div>
                    )}
                     <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-lg font-semibold mb-2">{t.discussionQuestionsTitle}</h4>
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
                        <h3 className="text-xl font-semibold mb-3">{t.fakeNewsITask1Title}</h3>
                        <p className="mb-4 text-sm text-gray-600">{t.fakeNewsITask1Desc}</p>
                        <div className="space-y-6">
                            <div>
                                <p className="font-medium">{lang === 'ru' ? 'Заголовок 1: "Новый закон в Узбекистане требует от всех студентов изучать корейский язык"' : 'Headline 1: "New Law in Uzbekistan Requires All Students to Learn Korean"'}</p>
                                <textarea
                                    className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-green-500 focus:border-green-500"
                                    rows="3"
                                    placeholder={t.placeholderExplanation}
                                    value={answers[savableTaskIds.intermediateFactCheck]?.headline1_explanation || ''}
                                    onChange={(e) => handleAnswerChange(savableTaskIds.intermediateFactCheck, 'headline1_explanation', e.target.value)}
                                ></textarea>
                            </div>
                            <div>
                                <p className="font-medium">{lang === 'ru' ? 'Заголовок 2: "Ташкент стал первым городом, запретившим смартфоны"' : 'Headline 2: "Tashkent Becomes the First City to Ban Smartphones"'}</p>
                                <textarea
                                    className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-green-500 focus:border-green-500"
                                    rows="3"
                                    placeholder={t.placeholderExplanation}
                                    value={answers[savableTaskIds.intermediateFactCheck]?.headline2_explanation || ''}
                                    onChange={(e) => handleAnswerChange(savableTaskIds.intermediateFactCheck, 'headline2_explanation', e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <div className="mt-6"> {/* Wrapper for buttons and feedback */}
                            <button onClick={() => handleSubmit(savableTaskIds.intermediateFactCheck)} className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">{t.submitBtn}</button>
                            {saveFeedback[savableTaskIds.intermediateFactCheck] && <span className={`ml-3 text-sm ${saveFeedback[savableTaskIds.intermediateFactCheck] === "Saved!" ? "text-green-600" : "text-red-600"}`}>{saveFeedback[savableTaskIds.intermediateFactCheck]}</span>}
                        </div>
                        {showAiButtons[savableTaskIds.intermediateFactCheck] && ( // Show AI button if enabled for the task
                            <div className="mt-2"> {/* AI Button on new line */}
                                <button
                                    onClick={() => { setChatMessages([]); handleAskAI_FakeNews(savableTaskIds.intermediateFactCheck); }}
                                    disabled={isAiLoading && activeChatTaskKey === savableTaskIds.intermediateFactCheck}
                                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                >
                                    {isAiLoading && activeChatTaskKey === savableTaskIds.intermediateFactCheck ? (t.aiThinking || 'AI Thinking...') : (translations[lang].discussAiBtn || 'Discuss with AI')}
                                </button>
                            </div>
                        )}
                        {currentAiError[savableTaskIds.intermediateFactCheck] && <p className="text-red-500 mt-2 text-sm">{currentAiError[savableTaskIds.intermediateFactCheck]}</p>}
                        {activeChatTaskKey === savableTaskIds.intermediateFactCheck && (
                            <div className="mt-4">
                                <AiChatWindow
                                    messages={chatMessages}
                                    isLoading={isAiLoading}
                                    onSendMessage={(message) => handleAskAI_FakeNews(savableTaskIds.intermediateFactCheck, message)}
                                />
                                <button
                                    onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentAiError(prev => ({...prev, [savableTaskIds.intermediateFactCheck]: null})); }}
                                    className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    {translations[lang].closeAiChat || 'Close AI Chat'}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-lg font-semibold mb-2">{t.followUpActivitiesTitle}</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                            <li>{t.fakeNewsITask1FollowUp1}</li>
                            <li>{t.fakeNewsITask1FollowUp2}</li>
                            <li>{t.fakeNewsITask1FollowUp3}</li>
                        </ul>
                    </div>
                </section>

                {/* Advanced Level Section */}
                <section className="level-section p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-red-700 mb-6 border-b pb-3">{t.advancedLevel}</h2>
                    <div className="p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-3">{t.fakeNewsATask1Title}</h3>
                        <p className="mb-4 text-sm text-gray-600">{t.fakeNewsATask1Desc}</p>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="believable_fake_headline" className="block text-sm font-medium text-gray-700">{t.believableFakeHeadlineLabel}</label>
                                <input
                                    type="text"
                                    id="believable_fake_headline"
                                    className="mt-1 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-red-500 focus:border-red-500"
                                    placeholder={t.placeholderBelievableFake}
                                    value={answers[savableTaskIds.advancedHeadlineCreation]?.believable_headline || ''}
                                    onChange={(e) => handleAnswerChange(savableTaskIds.advancedHeadlineCreation, 'believable_headline', e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="exaggerated_fake_headline" className="block text-sm font-medium text-gray-700">{t.exaggeratedFakeHeadlineLabel}</label>
                                <input
                                    type="text"
                                    id="exaggerated_fake_headline"
                                    className="mt-1 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-red-500 focus:border-red-500"
                                    placeholder={t.placeholderExaggeratedFake}
                                    value={answers[savableTaskIds.advancedHeadlineCreation]?.exaggerated_headline || ''}
                                    onChange={(e) => handleAnswerChange(savableTaskIds.advancedHeadlineCreation, 'exaggerated_headline', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-6"> {/* Wrapper for buttons and feedback */}
                            <button onClick={() => handleSubmit(savableTaskIds.advancedHeadlineCreation)} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">{t.submitBtn}</button>
                            {saveFeedback[savableTaskIds.advancedHeadlineCreation] && <span className={`ml-3 text-sm ${saveFeedback[savableTaskIds.advancedHeadlineCreation] === "Saved!" ? "text-green-600" : "text-red-600"}`}>{saveFeedback[savableTaskIds.advancedHeadlineCreation]}</span>}
                        </div>
                        {showAiButtons[savableTaskIds.advancedHeadlineCreation] && ( // Show AI button if enabled for the task
                            <div className="mt-2"> {/* AI Button on new line */}
                                <button
                                    onClick={() => { setChatMessages([]); handleAskAI_FakeNews(savableTaskIds.advancedHeadlineCreation); }}
                                    disabled={isAiLoading && activeChatTaskKey === savableTaskIds.advancedHeadlineCreation}
                                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                >
                                    {isAiLoading && activeChatTaskKey === savableTaskIds.advancedHeadlineCreation ? (t.aiThinking || 'AI Thinking...') : (translations[lang].discussAiBtn || 'Discuss with AI')}
                                </button>
                            </div>
                        )}
                        {currentAiError[savableTaskIds.advancedHeadlineCreation] && <p className="text-red-500 mt-2 text-sm">{currentAiError[savableTaskIds.advancedHeadlineCreation]}</p>}
                        {activeChatTaskKey === savableTaskIds.advancedHeadlineCreation && (
                            <div className="mt-4">
                                <AiChatWindow
                                    messages={chatMessages}
                                    isLoading={isAiLoading}
                                    onSendMessage={(message) => handleAskAI_FakeNews(savableTaskIds.advancedHeadlineCreation, message)}
                                />
                                <button
                                    onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentAiError(prev => ({...prev, [savableTaskIds.advancedHeadlineCreation]: null})); }}
                                    className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    {translations[lang].closeAiChat || 'Close AI Chat'}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-lg font-semibold mb-2">{t.followUpQuestionsTitle}</h4>
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
