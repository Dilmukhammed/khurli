import React, { useState, useEffect, useCallback } from 'react';
import moduleService from '../../services/moduleService';
import AiChatWindow from '../../components/common/AiChatWindow';
import { useAuth } from '../../contexts/AuthContext'; // Assuming path

// Translations object containing all the text for both languages.
// In a real application, this would likely be moved to a dedicated i18n library.
const translations = {
    ru: {
        pageTitle: "Факт или Мнение",
        mainTitle: "Факт или Мнение",
        beginnerLevel: "Начальный уровень – Определение и категоризация фактов и мнений",
        factBTask1Title: "1. Сортировка: Факт или Мнение",
        factBTask1Desc: "Прочитайте каждое предложение и решите, является ли оно фактом (✔️) или мнением (❌).",
        fact: "Факт",
        opinion: "Мнение",
        checkAnswersBtn: "Проверить ответы",
        submitBtn: "Отправить",
        askAiBtn: "Спросить ИИ", // Added
        closeAiChat: "Закрыть чат ИИ", // Added
        aiThinking: "ИИ думает...", // Added
        askAiInstruction: "Что бы вы хотели спросить по этому заданию?", // Added
        aiError: "Не удалось получить ответ от ИИ.", // Added
        allCorrectMessage: "Все ответы верны!",
        someIncorrectMessage: "Некоторые ответы неверны. Проверьте выделенные.",
        factBTask2Title: "2. Преобразование мнений в факты и наоборот",
        factBTask2Desc: "Перепишите следующие мнения как факты и наоборот. Примеры даны в учебном материале.",
        rewriteAsOpinion: "Перепишите как мнение:",
        rewriteAsFact: "Перепишите как факт:",
        placeholderRewriteOpinion: "Ваше мнение...",
        placeholderRewriteFact: "Ваш факт...",
        factBTask3Title: "3. Игра \"Это факт?\"",
        factBTask3Desc: "Прочитайте каждое утверждение. Определите, факт это или мнение.",
        intermediateLevel: "Средний уровень – Обоснование фактов и мнений",
        factITask1Title: "1. \"Почему это факт или мнение?\"",
        factITask1Desc: "Прочитайте каждое утверждение и объясните, почему это факт или мнение.",
        placeholderExplanation: "Объяснение...",
        factITask2Title: "2. Дебаты: Факт или Мнение",
        factITask2Desc: "Вам дано утверждение. Приведите аргументы, является ли оно фактом или мнением.",
        placeholderArguments: "Ваши аргументы...",
        advancedLevel: "Продвинутый уровень – Критическое мышление и оценка предвзятости",
        factATask1Title: "1. Анализ предвзятых утверждений",
        factATask1Desc: "Определите, являются ли утверждения нейтральными фактами или предвзятыми мнениями.",
        neutralFact: "Нейтральный факт",
        biasedOpinion: "Предвзятое мнение",
        factATask2Title: "2. Упражнение по проверке фактов",
        factATask2Desc: "Исследуйте и проверьте следующие утверждения. Укажите, верны ли они (✔️) или неверны (❌), и при необходимости предоставьте краткое пояснение или исправление.",
        true: "Верно",
        false: "Неверно",
        placeholderFactCheck: "Пояснение/Исправление (если неверно)...",
    },
    en: {
        pageTitle: "Fact or Opinion",
        mainTitle: "Fact or Opinion",
        beginnerLevel: "Beginner Level – Identifying and Categorizing Facts & Opinions",
        factBTask1Title: "1. Fact or Opinion Sorting",
        factBTask1Desc: "Read each sentence and decide whether it is a fact (✔️) or an opinion (❌).",
        fact: "Fact",
        opinion: "Opinion",
        checkAnswersBtn: "Check Answers",
        submitBtn: "Submit",
        askAiBtn: "Ask AI", // Added
        closeAiChat: "Close AI Chat", // Added
        aiThinking: "AI Thinking...", // Added
        askAiInstruction: "What would you like to ask about this task?", // Added
        aiError: "Failed to get AI response.", // Added
        allCorrectMessage: "All answers are correct!",
        someIncorrectMessage: "Some answers are incorrect. Check the highlighted ones.",
        factBTask2Title: "2. Changing Opinions into Facts & Vice Versa",
        factBTask2Desc: "Rewrite the following opinions as facts and vice versa. Examples are provided in the learning material.",
        rewriteAsOpinion: "Rewrite as an opinion:",
        rewriteAsFact: "Rewrite as a fact:",
        placeholderRewriteOpinion: "Your opinion...",
        placeholderRewriteFact: "Your fact...",
        factBTask3Title: "3. \"Is It a Fact?\" Game",
        factBTask3Desc: "Read each statement. Determine if it is a fact or an opinion.",
        intermediateLevel: "Intermediate Level – Justifying Facts and Opinions",
        factITask1Title: "1. \"Why is it a Fact or Opinion?\"",
        factITask1Desc: "Read each statement and explain why it is a fact or opinion.",
        placeholderExplanation: "Explanation...",
        factITask2Title: "2. Fact or Opinion Debate",
        factITask2Desc: "You are given a statement. Argue whether it is a fact or an opinion.",
        placeholderArguments: "Your arguments...",
        advancedLevel: "Advanced Level – Critical Thinking & Evaluating Bias",
        factATask1Title: "1. Analyzing Biased Statements",
        factATask1Desc: "Identify whether the statements are neutral facts or biased opinions.",
        neutralFact: "Neutral Fact",
        biasedOpinion: "Biased Opinion",
        factATask2Title: "2. Fact-Checking Exercise",
        factATask2Desc: "Research and fact-check the following statements. Indicate if they are true (✔️) or false (❌), and provide a brief explanation or correction if false.",
        true: "True",
        false: "False",
        placeholderFactCheck: "Explanation/Correction (if false)...",
    }
};

// Data for the interactive tasks
const beginnerTask1Data = [
    { id: 'b1_1', ru: "1. Ташкент - столица Узбекистана.", en: "1. Tashkent is the capital of Uzbekistan.", answer: 'fact' },
    { id: 'b1_2', ru: "2. Узбекский флаг имеет три цвета: синий, белый и зеленый.", en: "2. The Uzbek flag has three colors: blue, white, and green.", answer: 'fact' },
    { id: 'b1_3', ru: "3. Самарканд - самый красивый город в мире.", en: "3. Samarkand is the most beautiful city in the world.", answer: 'opinion' },
    { id: 'b1_4', ru: "4. Узбекский плов вкуснее любого другого плова.", en: "4. Uzbek plov is tastier than any other type of plov.", answer: 'opinion' },
    { id: 'b1_5', ru: "5. Амир Темур был важной исторической фигурой в Узбекистане.", en: "5. Amir Timur was an important historical figure in Uzbekistan.", answer: 'fact' },
    { id: 'b1_6', ru: "6. Чимганские горы идеально подходят для катания на лыжах.", en: "6. Chimgan mountains are perfect for skiing.", answer: 'opinion' },
    { id: 'b1_7', ru: "7. Узбекский сум - официальная валюта Узбекистана.", en: "7. Uzbek sum is the official currency of Uzbekistan.", answer: 'fact' },
    { id: 'b1_8', ru: "8. Бухара старше Ташкента.", en: "8. Bukhara is older than Tashkent.", answer: 'fact' },
    { id: 'b1_9', ru: "9. Все в Узбекистане любят чай.", en: "9. Everyone in Uzbekistan loves tea.", answer: 'opinion' },
    { id: 'b1_10', ru: "10. Лучшее время для посещения Узбекистана - весна.", en: "10. The best time to visit Uzbekistan is in the spring.", answer: 'opinion' },
];

const beginnerTask3Data = [
    { id: 'b3_1', ru: "1. Узбекский алфавит состоит из 29 букв.", en: "1. The Uzbek alphabet has 29 letters.", answer: 'fact' },
    { id: 'b3_2', ru: "2. Зимы в Узбекистане слишком холодные.", en: "2. Uzbekistan’s winters are too cold.", answer: 'opinion' },
    { id: 'b3_3', ru: "3. Аральское море сокращается на протяжении десятилетий.", en: "3. The Aral Sea has been shrinking for decades.", answer: 'fact' },
    { id: 'b3_4', ru: "4. Узбекистан стал независимым в 1991 году.", en: "4. Uzbekistan became independent in 1991.", answer: 'fact' },
];

const advancedTask1Data = [
    { id: 'a1_1', ru: "1. Правительство Узбекистана провело новые экономические реформы.", en: "1. The Uzbek government introduced new economic reforms.", answer: 'neutral' },
    { id: 'a1_2', ru: "2. Новые реформы правительства делают Узбекистан богаче.", en: "2. The government’s new reforms are making Uzbekistan richer.", answer: 'biased' },
    { id: 'a1_3', ru: "3. Узбекская традиционная одежда элегантнее западной.", en: "3. Uzbek traditional clothing is more elegant than Western clothing.", answer: 'biased' },
];


// Reusable component for multiple choice questions (Radio buttons)
const MultipleChoiceTask = ({ taskKey, questions, lang, title, description, options, checkBtnText, allCorrectMsg, someIncorrectMsg, isCompleted = false, onAnswersChecked, onAskAi, showAskAiButton, isMainAiLoading, activeAiTaskKey }) => {
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState({});
    const [feedback, setFeedback] = useState('');

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
        // Potentially clear feedback when answer changes, if desired
        // setFeedback('');
        // setResults(prev => ({ ...prev, [questionId]: undefined }));
    };

    const handleCheckAnswersInternal = () => {
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
                allCorrect = false;
            }
        });

        setResults(newResults);

        if (!anyAnswered) {
             setFeedback('');
        } else if (allCorrect) {
            setFeedback(allCorrectMsg);
        } else {
            setFeedback(someIncorrectMsg);
        }
        // Notify parent about the checked answers
        if (onAnswersChecked) {
            onAnswersChecked(taskKey, {
                questionsData: questions,
                userAnswers: answers,
                validationResults: newResults, // Use the just-calculated newResults
                optionsData: options,
                allCorrect: allCorrect // Add this line
            });
        }
    };

    const getResultClass = (isCorrect) => {
        if (isCorrect === 'correct') return 'text-green-600 font-bold';
        if (isCorrect === 'incorrect') return 'text-red-600 font-bold';
        return '';
    };
    
    const getFeedbackClass = () => {
        if(feedback === allCorrectMsg) return 'text-green-600';
        if(feedback === someIncorrectMsg) return 'text-red-600';
        return '';
    };

    return (
        <div className="mb-8 p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="mb-4 text-sm text-gray-600">{description}</p>
            <div className="space-y-4">
                {questions.map((q) => (
                    <div key={q.id} className={`p-2 rounded-md ${results[q.id] ? (results[q.id] === 'correct' ? 'bg-green-50' : 'bg-red-50') : ''}`}>
                        <p className={`statement-text ${getResultClass(results[q.id])}`}>{q[lang]}</p>
                        <div className="mt-2">
                            {Object.entries(options).map(([value, labelKey]) => (
                                <label key={value} className="radio-label mr-4 inline-flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`${taskKey}-${q.id}`}
                                        value={value}
                                        checked={answers[q.id] === value}
                                        onChange={() => handleAnswerChange(q.id, value)}
                                        disabled={isCompleted || (isMainAiLoading && activeAiTaskKey === taskKey)}
                                        className="radio-input mr-2 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span>{translations[lang][labelKey]}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <button
                    onClick={handleCheckAnswersInternal}
                    disabled={isCompleted}
                    className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {checkBtnText}
                </button>
            </div>
            {feedback && (
                <div className={`result-message mt-3 text-sm font-medium ${getFeedbackClass()}`}>
                    {feedback}
                </div>
            )}
            {showAskAiButton && (
                <div>
                    <button
                        onClick={() => onAskAi(taskKey, "" , {
                            questionsData: questions,
                        userAnswers: answers,
                        optionsData: options
                    })}
                        disabled={isMainAiLoading && activeAiTaskKey === taskKey}
                        className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                    >
                        {translations[lang].askAiBtn || 'Ask AI'}
                    </button>
                </div>
            )}
        </div>
    );
};


export default function FactOpinionModule() {
    // Read language from localStorage, defaulting to 'ru'.
    // This state will hold the language for the entire component.
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');

    // Effect to set document title based on language.
    // This runs once on mount and anytime 'lang' changes.
    useEffect(() => {
        document.title = translations[lang].pageTitle;
        
        // This function handles the storage event.
        // It allows the component to react if the language is changed in another tab.
        const handleStorageChange = (event) => {
            if (event.key === 'logiclingua-lang') {
                setLang(event.newValue || 'ru');
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Cleanup function to remove the event listener.
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [lang]);

    // Get the correct set of translations based on the current language.
    const t = translations[lang];

    const [answers, setAnswers] = useState({});
    const [showAiButtons, setShowAiButtons] = useState({});
    const [activeChatTaskKey, setActiveChatTaskKey] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [currentErrors, setCurrentErrors] = useState({});
    const [currentTaskAiContext, setCurrentTaskAiContext] = useState(null); // Added state
    const [completedTasks, setCompletedTasks] = useState({});
    const [progressLoading, setProgressLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    const isTaskCompleted = (taskKey) => !!completedTasks[taskKey];

    useEffect(() => {
        if (isAuthenticated) {
            setProgressLoading(true);
            moduleService.getModuleProgress('fact-opinion')
                .then(progressData => {
                    const initialCompleted = {};
                    if (progressData && Array.isArray(progressData)) {
                        progressData.forEach(item => {
                            if (item.status === 'completed') {
                                initialCompleted[item.task_id] = true;
                            }
                        });
                    }
                    setCompletedTasks(initialCompleted);
                })
                .catch(err => {
                    console.error("Failed to fetch module progress for fact-opinion:", err);
                    // setProgressError(err.message || "Could not load progress.");
                })
                .finally(() => {
                    setProgressLoading(false);
                });
        } else {
            setCompletedTasks({}); // Clear progress if not authenticated
            setProgressLoading(false);
        }
    }, [isAuthenticated]);

    const handleAnswerChangeFactOpinion = useCallback((taskKey, itemKey, value) => {
        setAnswers(prev => ({ ...prev, [taskKey]: { ...prev[taskKey], [itemKey]: value } }));
        setShowAiButtons(prev => ({ ...prev, [taskKey]: false }));
        setCurrentErrors(prev => ({ ...prev, [taskKey]: null }));
        setCurrentTaskAiContext(null); // Reset AI context when answer changes
    }, []);

    const handleSubmitFactOpinion = useCallback((taskKey, dataFromChild) => {
        setShowAiButtons(prev => ({ ...prev, [taskKey]: true }));
        setCurrentErrors(prev => ({ ...prev, [taskKey]: null }));

        if ((taskKey === 'bTask3' || taskKey === 'aTask1') && dataFromChild.allCorrect) {
            if (isAuthenticated && !isTaskCompleted(taskKey)) {
                moduleService.markTaskAsCompleted('fact-opinion', taskKey)
                    .then(() => {
                        setCompletedTasks(prev => ({ ...prev, [taskKey]: true }));
                        // Optional: setShowAiButtons(prev => ({ ...prev, [taskKey]: false }));
                    })
                    .catch(err => {
                        console.error(`Error saving progress for ${taskKey} (fact-opinion):`, err);
                        // Optionally set an error message to display to the user
                    });
            } else if (!isAuthenticated && dataFromChild.allCorrect) {
                // If not authenticated, still reflect completion visually for the session
                setCompletedTasks(prev => ({ ...prev, [taskKey]: true }));
                // Optional: setShowAiButtons(prev => ({ ...prev, [taskKey]: false }));
            }
        }
    }, [isAuthenticated, completedTasks]);

    const getTaskDetailsForAI_FactOpinion = useCallback((taskKey, additionalData = {}) => {
        // Initialize requestData structure for getGenericAiInteraction
        let requestData = {
            module_id: "fact-opinion",
            task_id: taskKey,
            interaction_type: 'general_query', // Default
            block_context: `Context for ${taskKey}`,       // Placeholder
            user_inputs: [],
            correct_answers_data: [],
            userQuery: '', // Will be filled by handleAskAiFactOpinion if it's a direct query
            chatMessages: []
        };

        const taskSpecificMainAnswers = answers[taskKey] || {};

        console.log(taskKey)
        console.log(additionalData)
        if (taskKey === 'bTask1' || taskKey === 'bTask3' || taskKey === 'aTask1') {
            if (additionalData && additionalData.questionsData) {
                const { questionsData, userAnswers: childAnswers, optionsData } = additionalData;

                let taskTitle = '';
                let taskDesc = '';
                if (taskKey === 'bTask1') {
                    taskTitle = t.factBTask1Title;
                    taskDesc = t.factBTask1Desc;
                } else if (taskKey === 'bTask3') {
                    taskTitle = t.factBTask3Title;
                    taskDesc = t.factBTask3Desc;
                } else { // aTask1
                    taskTitle = t.factATask1Title;
                    taskDesc = t.factATask1Desc;
                }

                let current_block_context_parts = [`Task: ${taskTitle}`, `Description: ${taskDesc.replace(/<[^>]*>?/gm, '')}`, "---"];
                let current_user_inputs = [];
                let current_correct_answers_data = [];

                questionsData.forEach(q_data => {
                    const questionText = q_data[lang]; // Get text in current language
                    const userAnswerValue = childAnswers[q_data.id];
                    const correctAnswerValue = q_data.answer;

                    const optionsString = Object.values(optionsData).map(optKey => t[optKey] || optKey).join(', '); // Use t[optKey] or optKey if not in translations
                    current_block_context_parts.push(`Question: ${questionText}\nOptions: ${optionsString}`);

                    const userAnswerDisplay = userAnswerValue ? (t[optionsData[userAnswerValue]] || optionsData[userAnswerValue]) : 'Not answered';
                    const correctAnswerDisplay = t[optionsData[correctAnswerValue]] || optionsData[correctAnswerValue];

                    current_user_inputs.push(`For question about "${questionText.substring(0, 35)}...": Your answer was '${userAnswerDisplay}'.`);
                    current_correct_answers_data.push(`For question about "${questionText.substring(0, 35)}...": The correct answer is '${correctAnswerDisplay}'.`);
                });

                requestData.block_context = current_block_context_parts.join('\n');
                requestData.user_inputs = current_user_inputs;
                requestData.correct_answers_data = current_correct_answers_data;
                requestData.interaction_type = 'explain_fact_opinion_choice';
            } else {
                // Fallback if additionalData is missing for these task types
                requestData.block_context = `Task: ${taskKey} - Awaiting full data from component. This usually means the 'Ask AI' button was clicked before 'Check Answers' or data is not being passed correctly.`;
                requestData.user_inputs = ["No answer data received from the component."];
                 // Try to get title/desc if taskKey known
                if (taskKey === 'bTask1') requestData.block_context = `${t.factBTask1Title}\n${t.factBTask1Desc}\nError: Missing detailed answer data.`;
                else if (taskKey === 'bTask3') requestData.block_context = `${t.factBTask3Title}\n${t.factBTask3Desc}\nError: Missing detailed answer data.`;
                else if (taskKey === 'aTask1') requestData.block_context = `${t.factATask1Title}\n${t.factATask1Desc}\nError: Missing detailed answer data.`;
            }
        } else if (taskKey === "bTask2") { // Renamed from factBTask2 for consistency with itemKeys
            requestData.interaction_type = 'feedback_on_rewrite';
            const taskSpecificAnswers = answers.bTask2 || {}; // Use answers.bTask2
            const originalStatements = [ // Define source of truth for statements
                { id: 'b2_op_uz_central_asia', type: 'fact', langText: {ru: "Факт: Узбекистан расположен в Центральной Азии.", en: "Fact: Uzbekistan is located in Central Asia."}, rewritePrompt: t.rewriteAsOpinion },
                { id: 'b2_op_navruz_march_21', type: 'fact', langText: {ru: "Факт: Навруз празднуется 21 марта.", en: "Fact: Navruz is celebrated on March 21st."}, rewritePrompt: t.rewriteAsOpinion },
                { id: 'b2_fact_uz_bread_better', type: 'opinion', langText: {ru: "Мнение: Узбекский хлеб лучше любого другого хлеба.", en: "Opinion: Uzbek bread is better than any other bread."}, rewritePrompt: t.rewriteAsFact },
                { id: 'b2_fact_samsa_best', type: 'opinion', langText: {ru: "Мнение: Лучшее узбекское блюдо - самса.", en: "Opinion: The best Uzbek dish is samsa."}, rewritePrompt: t.rewriteAsFact }
            ];

            let contextParts = [`Task: ${t.factBTask2Title}`, `Description: ${t.factBTask2Desc.replace(/<[^>]*>?/gm, '')}`, "---"];
            let userInputsFormatted = [];

            originalStatements.forEach(stmt => {
                const originalStatementText = stmt.langText[lang] || stmt.langText['en']; // Fallback to English
                const rewriteInstruction = stmt.rewritePrompt; // This is already translated via t.rewriteAsOpinion etc.
                const userAnswer = taskSpecificAnswers[stmt.id] || 'No rewrite provided.';

                contextParts.push(`Original Statement (${stmt.type}): "${originalStatementText}"\nInstruction: ${rewriteInstruction}`);
                userInputsFormatted.push(`For original "${originalStatementText.substring(0,30)}...": Your rewrite was: "${userAnswer}"`);
            });

            requestData.block_context = contextParts.join('\n\n');
            requestData.user_inputs = userInputsFormatted.length > 0 ? userInputsFormatted : ["No input provided for this task yet."];

        } else if (taskKey === 'iTask1') {
            requestData.interaction_type = 'feedback_on_justification';
            const taskSpecificAnswers = answers.iTask1 || {};
            const originalStatements_iTask1 = [
                { id: 'i1_bukhara_unesco_exp', langText: {ru: "Бухара является объектом Всемирного наследия ЮНЕСКО.", en: "Bukhara is a UNESCO World Heritage site."} },
                { id: 'i1_samarkand_khiva_exp', langText: {ru: "Самарканд красивее Хивы.", en: "Samarkand is more beautiful than Khiva."} },
                { id: 'i1_uz_population_exp', langText: {ru: "В Узбекистане проживает более 35 миллионов человек.", en: "Uzbekistan has more than 35 million people."} }
            ];

            let contextParts = [`Task: ${t.factITask1Title}`, `Description: ${t.factITask1Desc.replace(/<[^>]*>?/gm, '')}`, "---"];
            let userInputsFormatted = [];

            originalStatements_iTask1.forEach(stmt => {
                const originalStatementText = stmt.langText[lang] || stmt.langText['en']; // Fallback to English
                const userAnswer = taskSpecificAnswers[stmt.id] || 'No explanation provided.';

                contextParts.push(`Statement: "${originalStatementText}"`);
                userInputsFormatted.push(`For statement "${originalStatementText.substring(0,30)}...": Your explanation was: "${userAnswer}"`);
            });

            requestData.block_context = contextParts.join('\n\n');
            requestData.user_inputs = userInputsFormatted.length > 0 ? userInputsFormatted : ["No explanation provided."];

        } else if (taskKey === 'iTask2') {
            requestData.interaction_type = 'discuss_statement_nature';
            const taskSpecificAnswers = answers.iTask2 || {};
            const originalStatements_iTask2 = [
                 { id: 'i2_tashkent_dev_args', langText: {ru: "Утверждение: Ташкент - самый развитый город в Узбекистане.", en: "Statement: Tashkent is the most developed city in Uzbekistan."} },
                 { id: 'i2_english_success_args', langText: {ru: "Утверждение: Изучение английского языка необходимо для успеха в Узбекистане.", en: "Statement: Learning English is necessary for success in Uzbekistan."} }
            ];

            let contextParts = [`Task: ${t.factITask2Title}`, `Description: ${t.factITask2Desc.replace(/<[^>]*>?/gm, '')}`, "---"];
            let userInputsFormatted = [];

            originalStatements_iTask2.forEach(stmt => {
                const originalStatementText = stmt.langText[lang] || stmt.langText['en']; // Fallback to English
                const userAnswer = taskSpecificAnswers[stmt.id] || 'No arguments provided.';

                contextParts.push(`Statement for Debate: "${originalStatementText}"`);
                userInputsFormatted.push(`Regarding "\${originalStatementText.substring(0,30)}...": Your arguments were: "\${userAnswer}"`);
            });

            requestData.block_context = contextParts.join('\n\n');
            requestData.user_inputs = userInputsFormatted.length > 0 ? userInputsFormatted : ["No arguments provided."];

        } else if (taskKey === 'aTask2') {
            requestData.interaction_type = 'assist_fact_check';
            const taskSpecificAnswers = answers.aTask2 || {};
            const originalStatements_aTask2 = [
                { idPrefix: 'verify1', langText: {ru: "Узбекистан был частью Советского Союза до 1991 года.", en: "Uzbekistan was part of the Soviet Union before 1991."} },
                { idPrefix: 'verify2', langText: {ru: "Официальный язык Узбекистана - русский.", en: "The official language of Uzbekistan is Russian."} },
                { idPrefix: 'verify3', langText: {ru: "В Узбекистане находится самая большая пустыня в Центральной Азии.", en: "Uzbekistan has the largest desert in Central Asia."} }
            ];

            let contextParts = [`Task: ${t.factATask2Title}`, `Description: ${t.factATask2Desc.replace(/<[^>]*>?/gm, '')}`, "---"];
            let userInputsFormatted = [];

            originalStatements_aTask2.forEach(stmt => {
                const originalStatementText = stmt.langText[lang] || stmt.langText['en']; // Fallback to English
                const userChoice = taskSpecificAnswers[`${stmt.idPrefix}_choice`] || 'Not answered';
                const userExplanation = taskSpecificAnswers[`${stmt.idPrefix}_exp`] || 'No explanation.';

                contextParts.push(`Statement to Fact-Check: "${originalStatementText}"`);
                userInputsFormatted.push(`For statement "\${originalStatementText.substring(0,30)}...": Your assessment was '\${userChoice}'. Your explanation/correction: "\${userExplanation}"\ `);
            });

            requestData.block_context = contextParts.join('\n\n');
            requestData.user_inputs = userInputsFormatted.length > 0 ? userInputsFormatted : ["No input provided for this task."];
            // correct_answers_data is omitted as the task is about user research & AI assistance, not checking against predefined answers here.

        } else if (Object.keys(taskSpecificMainAnswers).length > 0) {
             // Generic handler for other tasks that might have answers directly in the 'answers' state
            // Ensure this doesn't accidentally catch tasks that should have more specific handling above
            // if their `additionalData` was missing.
            const titleKey = `${taskKey}Title`;
            const descKey = `${taskKey}Desc`;
            requestData.block_context = t[titleKey] ? `${t[titleKey]}\n${t[descKey] || ''}` : `Context for ${taskKey}`;
            requestData.user_inputs = Object.entries(taskSpecificMainAnswers).map(([key, value]) => `${key}: ${String(value)}`);
            // Determine interaction_type based on taskKey for other tasks if needed
            if (taskKey === 'factITask1') requestData.interaction_type = 'feedback_on_justification';
            else if (taskKey === 'factITask2') requestData.interaction_type = 'discuss_statement_nature';
            else if (taskKey === 'factATask2') requestData.interaction_type = 'assist_fact_check';

        }
        // else, it uses the default "No specific input provided..." from requestData initialization

        return requestData;
    }, [answers, t, lang]); // lang is needed for q_data[lang]

    const handleAskAiFactOpinion = useCallback(async (taskKey, userQuery = '', initialDataPayload = null) => {
        if (isAiLoading) return;
        setIsAiLoading(true);
        setActiveChatTaskKey(taskKey);
        setCurrentErrors(prev => ({ ...prev, [taskKey]: null }));

        const thinkingText = t.aiThinking || 'AI Thinking...';
        const aiErrorText = t.aiError || 'Failed to get AI response.';
        console.log(userQuery)
        console.log(taskKey)

        let dataForAiProcessing = initialDataPayload;
        if (userQuery) {
            // This is a follow-up query from the chat window, use existing context
            setChatMessages(prev => [
                ...prev,
                { "role" : 'user', "content": userQuery },
            ]);
        }

        try {
            // Construct the request for the generic service
            const requestDetails = getTaskDetailsForAI_FactOpinion(taskKey, dataForAiProcessing || {}); // Pass empty object if dataForAiProcessing is null

            // If it's a user query from chat, ensure it's part of the requestDetails
            if (userQuery) {
                requestDetails.userQuery = userQuery;
                requestDetails.chatMessages = chatMessages
            }
            console.log(requestDetails)
            // NEW CALL to the generic service
            const response = await moduleService.getGenericAiInteraction(requestDetails);

            setChatMessages(prev => [
                ...prev.filter(msg => msg["content"] !== 'Thinking...'),
                { "role": 'assistant', "content": response.explanation }
            ]);
        } catch (error)
 {
            console.error(`Error fetching AI Fact/Opinion for ${taskKey} via generic service:`, error);
            const errorMsg = error.message || aiErrorText;
            setChatMessages(prev => [
                ...prev.filter(msg => msg["content"] !== 'Thinking...'),
                {"role": 'assistant', "content": "Sorry, I couldn't get the details for this task."}
            ]);
            setCurrentErrors(prev => ({ ...prev, [taskKey]: errorMsg }));
        } finally {
            setIsAiLoading(false);
        }
    }, [isAiLoading, getTaskDetailsForAI_FactOpinion, t, currentTaskAiContext, setCurrentTaskAiContext]);


    return (
        <div className="bg-gray-100 text-gray-800 font-sans">
            <main className="container mx-auto px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{t.mainTitle}</h1>

                {/* Beginner Level Section */}
                <section className="level-section mb-12 p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-6 border-b pb-3">{t.beginnerLevel}</h2>

                    <MultipleChoiceTask
                        taskKey="bTask1" // Changed from taskId
                        title={t.factBTask1Title}
                        description={t.factBTask1Desc}
                        questions={beginnerTask1Data}
                        lang={lang}
                        options={{ fact: 'fact', opinion: 'opinion' }}
                        checkBtnText={t.checkAnswersBtn}
                        allCorrectMsg={t.allCorrectMessage}
                        someIncorrectMsg={t.someIncorrectMessage}
                        onAnswersChecked={handleSubmitFactOpinion} // Added
                        onAskAi={handleAskAiFactOpinion} // Added
                        showAskAiButton={showAiButtons['bTask1']} // Added
                        isMainAiLoading={isAiLoading} // Added
                        activeAiTaskKey={activeChatTaskKey} // Added
                    />
                    {currentErrors['bTask1'] && <p className="text-red-500 mt-2 text-sm">{currentErrors['bTask1']}</p>}
                    {activeChatTaskKey === 'bTask1' && (
                        <div className="mt-4">
                            <AiChatWindow
                                messages={chatMessages}
                                isLoading={isAiLoading}
                                onSendMessage={(message) => handleAskAiFactOpinion('bTask1', message)}
                            />
                            <button onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, bTask1: null})); }}
                                className="mt-2 text-sm text-gray-600 hover:text-gray-800">
                                {t.closeAiChat || 'Close AI Chat'}
                            </button>
                        </div>
                    )}

                    <div className="mb-8 p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-3">{t.factBTask2Title}</h3>
                        <p className="mb-4 text-sm text-gray-600">{t.factBTask2Desc}</p>
                        <div className="space-y-6">
                            {[
                                { itemKey: 'b2_op_uz_central_asia', originalTextKey: 'Fact: Uzbekistan is located in Central Asia.', originalTextRu: 'Факт: Узбекистан расположен в Центральной Азии.', rewritePromptKey: 'rewriteAsOpinion', placeholderKey: 'placeholderRewriteOpinion' },
                                { itemKey: 'b2_op_navruz_march_21', originalTextKey: 'Fact: Navruz is celebrated on March 21st.', originalTextRu: 'Факт: Навруз празднуется 21 марта.', rewritePromptKey: 'rewriteAsOpinion', placeholderKey: 'placeholderRewriteOpinion' },
                                { itemKey: 'b2_fact_uz_bread_better', originalTextKey: 'Opinion: Uzbek bread is better than any other bread.', originalTextRu: 'Мнение: Узбекский хлеб лучше любого другого хлеба.', rewritePromptKey: 'rewriteAsFact', placeholderKey: 'placeholderRewriteFact' },
                                { itemKey: 'b2_fact_samsa_best', originalTextKey: 'Opinion: The best Uzbek dish is samsa.', originalTextRu: 'Мнение: Лучшее узбекское блюдо - самса.', rewritePromptKey: 'rewriteAsFact', placeholderKey: 'placeholderRewriteFact' },
                            ].map((item, index) => (
                                <div key={item.itemKey}>
                                    <p className="font-medium">{index + 1}. {lang === 'ru' ? item.originalTextRu : item.originalTextKey}</p>
                                    <label className="block text-sm font-medium text-gray-700 mt-2">{t[item.rewritePromptKey]}</label>
                                    <input
                                        type="text"
                                        className="mt-1 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder={t[item.placeholderKey]}
                                        onChange={(e) => handleAnswerChangeFactOpinion('bTask2', item.itemKey, e.target.value)}
                                        value={answers.bTask2?.[item.itemKey] || ''}
                                        disabled={isAiLoading}
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <button
                                onClick={() => handleSubmitFactOpinion('bTask2')}
                                disabled={isAiLoading}
                                className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {t.submitBtn}
                            </button>
                        </div>
                        {showAiButtons['bTask2'] && !currentErrors['bTask2'] && (
                            <div>
                                <button
                                    onClick={() => {handleAskAiFactOpinion('bTask2');setChatMessages([])}}
                                    disabled={isAiLoading && activeChatTaskKey === 'bTask2'}
                                    className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                >
                                    {t.askAiBtn || 'Ask AI'}
                                </button>
                            </div>
                        )}
                        {currentErrors['bTask2'] && <p className="text-red-500 mt-2 text-sm">{currentErrors['bTask2']}</p>}
                        {activeChatTaskKey === 'bTask2' && (
                            <div className="mt-4">
                                <AiChatWindow
                                    messages={chatMessages}
                                    isLoading={isAiLoading}
                                    onSendMessage={(message) => handleAskAiFactOpinion('bTask2', message)}
                                />
                                <button onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, bTask2: null})); }}
                                    className="mt-2 text-sm text-gray-600 hover:text-gray-800">
                                    {t.closeAiChat || 'Close AI Chat'}
                                </button>
                            </div>
                        )}
                    </div>

                    <MultipleChoiceTask
                        taskKey="bTask3"
                        title={<>{t.factBTask3Title} {isTaskCompleted('bTask3') && !progressLoading && <span className='text-green-600 font-bold ml-2 text-sm'>({t.completedText || 'Completed'})</span>}</>}
                        description={t.factBTask3Desc}
                        questions={beginnerTask3Data}
                        lang={lang}
                        options={{ fact: 'fact', opinion: 'opinion' }}
                        checkBtnText={t.checkAnswersBtn}
                        allCorrectMsg={t.allCorrectMessage}
                        someIncorrectMsg={t.someIncorrectMessage}
                        onAnswersChecked={handleSubmitFactOpinion} // Added
                        isCompleted={isTaskCompleted('bTask3') || progressLoading}
                        onAskAi={handleAskAiFactOpinion} // Added
                        showAskAiButton={showAiButtons['bTask3']} // Added
                        isMainAiLoading={isAiLoading} // Added
                        activeAiTaskKey={activeChatTaskKey} // Added
                    />
                    {currentErrors['bTask3'] && <p className="text-red-500 mt-2 text-sm">{currentErrors['bTask3']}</p>}
                    {activeChatTaskKey === 'bTask3' && (
                        <div className="mt-4">
                            <AiChatWindow
                                messages={chatMessages}
                                isLoading={isAiLoading}
                                onSendMessage={(message) => handleAskAiFactOpinion('bTask3', message)}
                            />
                            <button onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, bTask3: null})); }}
                                className="mt-2 text-sm text-gray-600 hover:text-gray-800">
                                {t.closeAiChat || 'Close AI Chat'}
                            </button>
                        </div>
                    )}
                </section>

                {/* Intermediate Level Section */}
                <section className="level-section mb-12 p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-green-700 mb-6 border-b pb-3">{t.intermediateLevel}</h2>
                     <div className="mb-8 p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-3">{t.factITask1Title}</h3>
                        <p className="mb-4 text-sm text-gray-600">{t.factITask1Desc}</p>
                        <div className="space-y-6">
                            {[
                                { itemKey: 'i1_bukhara_unesco_exp', originalTextKey: 'Bukhara is a UNESCO World Heritage site.', originalTextRu: 'Бухара является объектом Всемирного наследия ЮНЕСКО.' },
                                { itemKey: 'i1_samarkand_khiva_exp', originalTextKey: 'Samarkand is more beautiful than Khiva.', originalTextRu: 'Самарканд красивее Хивы.' },
                                { itemKey: 'i1_uz_population_exp', originalTextKey: 'Uzbekistan has more than 35 million people.', originalTextRu: 'В Узбекистане проживает более 35 миллионов человек.' }
                            ].map((item, index) => (
                                <div key={item.itemKey}>
                                    <p className="font-medium">{index + 1}. {lang === 'ru' ? item.originalTextRu : item.originalTextKey}</p>
                                    <textarea
                                        className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-green-500 focus:border-green-500"
                                        rows="2"
                                        placeholder={t.placeholderExplanation}
                                        onChange={(e) => handleAnswerChangeFactOpinion('iTask1', item.itemKey, e.target.value)}
                                        value={answers.iTask1?.[item.itemKey] || ''}
                                        disabled={isAiLoading}
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <button
                                onClick={() => handleSubmitFactOpinion('iTask1')}
                                disabled={isAiLoading}
                                className="mt-6 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                {t.submitBtn}
                            </button>
                        </div>
                        {showAiButtons['iTask1'] && !currentErrors['iTask1'] && (
                            <div>
                                <button
                                    onClick={() => {handleAskAiFactOpinion('iTask1'); setChatMessages([])}}
                                    disabled={isAiLoading && activeChatTaskKey === 'iTask1'}
                                    className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                >
                                    {t.askAiBtn || 'Ask AI'}
                                </button>
                            </div>
                        )}
                        {currentErrors['iTask1'] && <p className="text-red-500 mt-2 text-sm">{currentErrors['iTask1']}</p>}
                        {activeChatTaskKey === 'iTask1' && (
                            <div className="mt-4">
                                <AiChatWindow
                                    messages={chatMessages}
                                        isLoading={isAiLoading}
                                        onSendMessage={(message) => handleAskAiFactOpinion('iTask1', message)}
                                    />
                                    <button onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, iTask1: null})); }}
                                        className="mt-2 text-sm text-gray-600 hover:text-gray-800">
                                        {t.closeAiChat || 'Close AI Chat'}
                                    </button>
                                </div>
                            )}
                    </div>

                    <div className="p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-3">{t.factITask2Title}</h3>
                        <p className="mb-4 text-sm text-gray-600">{t.factITask2Desc}</p>
                        <div className="space-y-6">
                            {[
                                { itemKey: 'i2_tashkent_dev_args', originalTextKey: 'Statement: Tashkent is the most developed city in Uzbekistan.', originalTextRu: 'Утверждение: Ташкент - самый развитый город в Узбекистане.' },
                                { itemKey: 'i2_english_success_args', originalTextKey: 'Statement: Learning English is necessary for success in Uzbekistan.', originalTextRu: 'Утверждение: Изучение английского языка необходимо для успеха в Узбекистане.' }
                            ].map((item, index) => (
                                <div key={item.itemKey}>
                                    <p className="font-medium">{lang === 'ru' ? item.originalTextRu : item.originalTextKey}</p>
                                    <textarea
                                        className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-green-500 focus:border-green-500"
                                        rows="3"
                                        placeholder={t.placeholderArguments}
                                        onChange={(e) => handleAnswerChangeFactOpinion('iTask2', item.itemKey, e.target.value)}
                                        value={answers.iTask2?.[item.itemKey] || ''}
                                        disabled={isAiLoading}
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <button
                                onClick={() => handleSubmitFactOpinion('iTask2')}
                                disabled={isAiLoading}
                                className="mt-6 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                {t.submitBtn}
                            </button>
                        </div>
                        {showAiButtons['iTask2'] && !currentErrors['iTask2'] && (
                            <div>
                                <button
                                    onClick={() => {handleAskAiFactOpinion('iTask2'); setChatMessages([])}}
                                    disabled={isAiLoading && activeChatTaskKey === 'iTask2'}
                                    className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                >
                                    {t.askAiBtn || 'Ask AI'}
                                </button>
                            </div>
                        )}
                        {currentErrors['iTask2'] && <p className="text-red-500 mt-2 text-sm">{currentErrors['iTask2']}</p>}
                        {activeChatTaskKey === 'iTask2' && (
                            <div className="mt-4">
                                <AiChatWindow
                                    messages={chatMessages}
                                        isLoading={isAiLoading}
                                        onSendMessage={(message) => handleAskAiFactOpinion('iTask2', message)}
                                    />
                                    <button onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, iTask2: null})); }}
                                        className="mt-2 text-sm text-gray-600 hover:text-gray-800">
                                        {t.closeAiChat || 'Close AI Chat'}
                                    </button>
                                </div>
                            )}
                    </div>
                </section>
                
                {/* Advanced Level Section */}
                <section className="level-section p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-red-700 mb-6 border-b pb-3">{t.advancedLevel}</h2>

                    <MultipleChoiceTask
                        taskKey="aTask1" // Changed from taskId
                        title={<>{t.factATask1Title} {isTaskCompleted('aTask1') && !progressLoading && <span className='text-green-600 font-bold ml-2 text-sm'>({t.completedText || 'Completed'})</span>}</>}
                        description={t.factATask1Desc}
                        questions={advancedTask1Data}
                        lang={lang}
                        options={{ neutral: 'neutralFact', biased: 'biasedOpinion' }}
                        checkBtnText={t.checkAnswersBtn}
                        allCorrectMsg={t.allCorrectMessage}
                        someIncorrectMsg={t.someIncorrectMessage}
                        onAnswersChecked={handleSubmitFactOpinion} // Added
                        isCompleted={isTaskCompleted('aTask1') || progressLoading}
                        onAskAi={handleAskAiFactOpinion} // Added
                        showAskAiButton={showAiButtons['aTask1']} // Added
                        isMainAiLoading={isAiLoading} // Added
                        activeAiTaskKey={activeChatTaskKey} // Added
                    />
                    {currentErrors['aTask1'] && <p className="text-red-500 mt-2 text-sm">{currentErrors['aTask1']}</p>}
                    {activeChatTaskKey === 'aTask1' && (
                        <div className="mt-4">
                            <AiChatWindow
                                messages={chatMessages}
                                isLoading={isAiLoading}
                                onSendMessage={(message) => handleAskAiFactOpinion('aTask1', message)}
                            />
                            <button onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, aTask1: null})); }}
                                className="mt-2 text-sm text-gray-600 hover:text-gray-800">
                                {t.closeAiChat || 'Close AI Chat'}
                            </button>
                        </div>
                    )}

                    <div className="p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-3">{t.factATask2Title}</h3>
                        <p className="mb-4 text-sm text-gray-600">{t.factATask2Desc}</p>
                        <div className="space-y-6">
                            {[
                                { idPrefix: 'verify1', textKey: 'Uzbekistan was part of the Soviet Union before 1991.', textRu: 'Узбекистан был частью Советского Союза до 1991 года.' },
                                { idPrefix: 'verify2', textKey: 'The official language of Uzbekistan is Russian.', textRu: 'Официальный язык Узбекистана - русский.' },
                                { idPrefix: 'verify3', textKey: 'Uzbekistan has the largest desert in Central Asia.', textRu: 'В Узбекистане находится самая большая пустыня в Центральной Азии.' }
                            ].map((item, index) => (
                                <div key={item.idPrefix}>
                                    <p className="font-medium">{index + 1}. {lang === 'ru' ? item.textRu : item.textKey}</p>
                                    <div className="mt-2">
                                        <label className="mr-4 inline-flex items-center">
                                            <input
                                                type="radio"
                                                name={`aTask2-${item.idPrefix}_choice`}
                                                value="true"
                                                checked={answers.aTask2?.[`${item.idPrefix}_choice`] === 'true'}
                                                onChange={(e) => handleAnswerChangeFactOpinion('aTask2', `${item.idPrefix}_choice`, e.target.value)}
                                                disabled={isAiLoading}
                                                className="mr-2 h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                                            />{t.true}
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name={`aTask2-${item.idPrefix}_choice`}
                                                value="false"
                                                checked={answers.aTask2?.[`${item.idPrefix}_choice`] === 'false'}
                                                onChange={(e) => handleAnswerChangeFactOpinion('aTask2', `${item.idPrefix}_choice`, e.target.value)}
                                                disabled={isAiLoading}
                                                className="mr-2 h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                                            />{t.false}
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-red-500 focus:border-red-500"
                                        placeholder={t.placeholderFactCheck}
                                        onChange={(e) => handleAnswerChangeFactOpinion('aTask2', `${item.idPrefix}_exp`, e.target.value)}
                                        value={answers.aTask2?.[`${item.idPrefix}_exp`] || ''}
                                        disabled={isAiLoading}
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <button
                                onClick={() => {handleSubmitFactOpinion('aTask2'); setChatMessages([])}}
                                disabled={isAiLoading}
                                className="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                {t.submitBtn}
                            </button>
                        </div>
                        {showAiButtons['aTask2'] && !currentErrors['aTask2'] && (
                            <div>
                                <button
                                    onClick={() => handleAskAiFactOpinion('aTask2')}
                                    disabled={isAiLoading && activeChatTaskKey === 'aTask2'}
                                    className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                >
                                    {t.askAiBtn || 'Ask AI'}
                                </button>
                            </div>
                        )}
                        {currentErrors['aTask2'] && <p className="text-red-500 mt-2 text-sm">{currentErrors['aTask2']}</p>}
                        {activeChatTaskKey === 'aTask2' && (
                            <div className="mt-4">
                                <AiChatWindow
                                    messages={chatMessages}
                                        isLoading={isAiLoading}
                                        onSendMessage={(message) => handleAskAiFactOpinion('aTask2', message)}
                                    />
                                    <button onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, aTask2: null})); }}
                                        className="mt-2 text-sm text-gray-600 hover:text-gray-800">
                                        {t.closeAiChat || 'Close AI Chat'}
                                    </button>
                                </div>
                            )}
                    </div>
                </section>
            </main>
        </div>
    );
}
