import React, { useState, useEffect, useCallback } from 'react';
import moduleService from '../../services/moduleService';
import AiChatWindow from '../../components/common/AiChatWindow';
import { useAuth } from '../../contexts/AuthContext'; // Assuming path

// Translations object
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
        askAiBtn: "Спросить ИИ",
        closeAiChat: "Закрыть чат ИИ",
        aiThinking: "ИИ думает...",
        askAiInstruction: "Что бы вы хотели спросить по этому заданию?",
        aiError: "Не удалось получить ответ от ИИ.",
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
        completedText: "Выполнено",
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
        askAiBtn: "Ask AI",
        closeAiChat: "Close AI Chat",
        aiThinking: "AI Thinking...",
        askAiInstruction: "What would you like to ask about this task?",
        aiError: "Failed to get AI response.",
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
        completedText: "Completed",
    }
};

// Task Data
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

// MultipleChoiceTask Component
const MultipleChoiceTask = ({ taskKey, questions, lang, title, description, options, checkBtnText, allCorrectMsg, someIncorrectMsg, isCompleted = false, onAnswersChecked, onAskAi, showAskAiButton, isMainAiLoading, activeAiTaskKey }) => {
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState({});
    const [feedback, setFeedback] = useState('');
    const currentTranslations = translations[lang] || translations.en;


    const handleAnswerChange = (questionId, answer) => {
        if (isCompleted) return;
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleCheckAnswersInternal = () => {
        if (isCompleted) return;
        const newResults = {};
        let allCorrect = true;
        let anyAnswered = false;
        questions.forEach(q => {
            if (answers[q.id]) {
                anyAnswered = true;
                if (answers[q.id] === q.answer) newResults[q.id] = 'correct';
                else { newResults[q.id] = 'incorrect'; allCorrect = false; }
            } else allCorrect = false;
        });
        setResults(newResults);
        if (!anyAnswered) setFeedback('');
        else if (allCorrect) setFeedback(allCorrectMsg);
        else setFeedback(someIncorrectMsg);
        if (onAnswersChecked) onAnswersChecked(taskKey, { questionsData: questions, userAnswers: answers, validationResults: newResults, optionsData: options, allCorrect: allCorrect });
    };

    const getResultClass = (isCorrect) => isCorrect === 'correct' ? 'text-green-600 font-bold' : (isCorrect === 'incorrect' ? 'text-red-600 font-bold' : '');
    const getFeedbackClass = () => feedback === allCorrectMsg ? 'text-green-600' : (feedback === someIncorrectMsg ? 'text-red-600' : '');

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
                                    <input type="radio" name={`${taskKey}-${q.id}`} value={value} checked={answers[q.id] === value} onChange={() => handleAnswerChange(q.id, value)}
                                        disabled={isCompleted || (isMainAiLoading && activeAiTaskKey === taskKey)}
                                        className="radio-input mr-2 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed" />
                                    <span>{currentTranslations[labelKey]}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <button onClick={handleCheckAnswersInternal} disabled={isCompleted || (isMainAiLoading && activeAiTaskKey === taskKey)}
                    className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    {checkBtnText}
                </button>
            </div>
            {feedback && <div className={`result-message mt-3 text-sm font-medium ${getFeedbackClass()}`}>{feedback}</div>}
            {showAskAiButton && (
                <div>
                    <button onClick={() => onAskAi(taskKey, "", { questionsData: questions, userAnswers: answers, optionsData: options })}
                        disabled={(isMainAiLoading && activeAiTaskKey === taskKey)}
                        className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300  disabled:opacity-50 disabled:cursor-not-allowed">
                        {currentTranslations.askAiBtn || 'Ask AI'}
                    </button>
                </div>
            )}
        </div>
    );
};

// Main Module Component
export default function FactOpinionModule() {
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');
    useEffect(() => {
        document.title = translations[lang].pageTitle;
        const handleStorageChange = (event) => { if (event.key === 'logiclingua-lang') setLang(event.newValue || 'ru'); };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [lang]);

    const t = translations[lang] || translations.en;

    const [answers, setAnswers] = useState({});
    const [showAiButtons, setShowAiButtons] = useState({});
    const [activeChatTaskKey, setActiveChatTaskKey] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [currentErrors, setCurrentErrors] = useState({});
    const [completedTasks, setCompletedTasks] = useState({});
    const [progressLoading, setProgressLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    const isTaskCompleted = useCallback((taskKey) => !!completedTasks[taskKey], [completedTasks]);

    useEffect(() => {
        if (isAuthenticated) {
            setProgressLoading(true);
            moduleService.getModuleProgress('fact-opinion')
                .then(progressData => {
                    const initialCompleted = {};
                    if (progressData && Array.isArray(progressData)) {
                        progressData.forEach(item => { if (item.status === 'completed') initialCompleted[item.task_id] = true; });
                    }
                    setCompletedTasks(initialCompleted);
                })
                .catch(err => console.error("Failed to fetch module progress for fact-opinion:", err))
                .finally(() => setProgressLoading(false));
        } else {
            setCompletedTasks({});
            setProgressLoading(false);
        }
    }, [isAuthenticated]);

    const handleAnswerChangeFactOpinion = useCallback((taskKey, itemKey, value) => {
        if (isTaskCompleted(taskKey) && !(taskKey === 'iTask2' && itemKey)) return; // Allow iTask2 (debate) to be modified even if "submitted" as it's not strictly locked
        setAnswers(prev => ({ ...prev, [taskKey]: { ...prev[taskKey], [itemKey]: value } }));
        setShowAiButtons(prev => ({ ...prev, [taskKey]: false }));
        setCurrentErrors(prev => ({ ...prev, [taskKey]: null }));
    }, [isTaskCompleted]);

    const handleSubmitFactOpinion = useCallback((taskKey, dataFromChild) => {
        if (isTaskCompleted(taskKey) && taskKey !== 'iTask2') return; // Prevent resubmission unless it's iTask2 (debate)

        setShowAiButtons(prev => ({ ...prev, [taskKey]: true }));
        setCurrentErrors(prev => ({ ...prev, [taskKey]: null }));

        let shouldMarkComplete = false;
        let isCorrectForMCQ = false;

        if (dataFromChild && dataFromChild.allCorrect !== undefined) {
            isCorrectForMCQ = dataFromChild.allCorrect;
        }

        if (taskKey === 'bTask1' || taskKey === 'bTask3' || taskKey === 'aTask1') {
            if (isCorrectForMCQ) shouldMarkComplete = true;
        } else if (taskKey === 'bTask2' || taskKey === 'iTask1' || taskKey === 'aTask2') {
            shouldMarkComplete = true; // Mark on submission
        }
        // iTask2 (Debate) is not marked complete this way.

        if (shouldMarkComplete && isAuthenticated && !isTaskCompleted(taskKey)) {
            moduleService.markTaskAsCompleted('fact-opinion', taskKey)
                .then(() => {
                    setCompletedTasks(prev => ({ ...prev, [taskKey]: true }));
                    console.log(`Task ${taskKey} marked as completed in backend.`);
                })
                .catch(err => console.error(`Error saving progress for ${taskKey} (fact-opinion):`, err));
        } else if (shouldMarkComplete && !isAuthenticated) {
            if (taskKey === 'bTask1' || taskKey === 'bTask3' || taskKey === 'aTask1') {
                 if (isCorrectForMCQ) setCompletedTasks(prev => ({ ...prev, [taskKey]: true }));
            } else if (taskKey === 'bTask2' || taskKey === 'iTask1' || taskKey === 'aTask2') {
                 setCompletedTasks(prev => ({ ...prev, [taskKey]: true }));
            }
        }
    }, [isAuthenticated, isTaskCompleted]);

    const getTaskDetailsForAI_FactOpinion = useCallback((taskKey, additionalData = {}) => {
        let requestData = { module_id: "fact-opinion", task_id: taskKey, interaction_type: 'general_query', block_context: `Context for ${taskKey}`, user_inputs: [], correct_answers_data: [], userQuery: '', chatMessages: [] };
        const taskSpecificMainAnswers = answers[taskKey] || {};
        if (taskKey === 'bTask1' || taskKey === 'bTask3' || taskKey === 'aTask1') {
            if (additionalData && additionalData.questionsData) {
                const { questionsData, userAnswers: childAnswers, optionsData } = additionalData;
                let taskTitle = '', taskDesc = '';
                if (taskKey === 'bTask1') { taskTitle = t.factBTask1Title; taskDesc = t.factBTask1Desc; }
                else if (taskKey === 'bTask3') { taskTitle = t.factBTask3Title; taskDesc = t.factBTask3Desc; }
                else { taskTitle = t.factATask1Title; taskDesc = t.factATask1Desc; }
                let current_block_context_parts = [`Task: ${taskTitle}`, `Description: ${taskDesc.replace(/<[^>]*>?/gm, '')}`, "---"];
                let current_user_inputs = [], current_correct_answers_data = [];
                questionsData.forEach(q_data => {
                    const questionText = q_data[lang], userAnswerValue = childAnswers[q_data.id], correctAnswerValue = q_data.answer;
                    const optionsString = Object.values(optionsData).map(optKey => t[optKey] || optKey).join(', ');
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
                requestData.block_context = `Task: ${taskKey} - Error: Missing detailed answer data.`;
                requestData.user_inputs = ["No answer data received."];
            }
        } else if (taskKey === "bTask2") {
            requestData.interaction_type = 'feedback_on_rewrite';
            const taskSpecificAnswers = answers.bTask2 || {};
            const originalStatements = [
                { id: 'b2_op_uz_central_asia', type: 'fact', langText: {ru: "Факт: Узбекистан расположен в Центральной Азии.", en: "Fact: Uzbekistan is located in Central Asia."}, rewritePrompt: t.rewriteAsOpinion },
                { id: 'b2_op_navruz_march_21', type: 'fact', langText: {ru: "Факт: Навруз празднуется 21 марта.", en: "Fact: Navruz is celebrated on March 21st."}, rewritePrompt: t.rewriteAsOpinion },
                { id: 'b2_fact_uz_bread_better', type: 'opinion', langText: {ru: "Мнение: Узбекский хлеб лучше любого другого хлеба.", en: "Opinion: Uzbek bread is better than any other bread."}, rewritePrompt: t.rewriteAsFact },
                { id: 'b2_fact_samsa_best', type: 'opinion', langText: {ru: "Мнение: Лучшее узбекское блюдо - самса.", en: "Opinion: The best Uzbek dish is samsa."}, rewritePrompt: t.rewriteAsFact }
            ];
            let contextParts = [`Task: ${t.factBTask2Title}`, `Description: ${t.factBTask2Desc.replace(/<[^>]*>?/gm, '')}`, "---"], userInputsFormatted = [];
            originalStatements.forEach(stmt => {
                const originalStatementText = stmt.langText[lang] || stmt.langText.en, rewriteInstruction = stmt.rewritePrompt, userAnswer = taskSpecificAnswers[stmt.id] || 'No rewrite provided.';
                contextParts.push(`Original Statement (${stmt.type}): "${originalStatementText}"\nInstruction: ${rewriteInstruction}`);
                userInputsFormatted.push(`For original "${originalStatementText.substring(0,30)}...": Your rewrite was: "${userAnswer}"`);
            });
            requestData.block_context = contextParts.join('\n\n');
            requestData.user_inputs = userInputsFormatted.length ? userInputsFormatted : ["No input."];
        } else if (taskKey === 'iTask1') {
            requestData.interaction_type = 'feedback_on_justification';
            const taskSpecificAnswers = answers.iTask1 || {};
            const originalStatements_iTask1 = [
                { id: 'i1_bukhara_unesco_exp', langText: {ru: "Бухара является объектом Всемирного наследия ЮНЕСКО.", en: "Bukhara is a UNESCO World Heritage site."} },
                { id: 'i1_samarkand_khiva_exp', langText: {ru: "Самарканд красивее Хивы.", en: "Samarkand is more beautiful than Khiva."} },
                { id: 'i1_uz_population_exp', langText: {ru: "В Узбекистане проживает более 35 миллионов человек.", en: "Uzbekistan has more than 35 million people."} }
            ];
            let contextParts = [`Task: ${t.factITask1Title}`, `Description: ${t.factITask1Desc.replace(/<[^>]*>?/gm, '')}`, "---"], userInputsFormatted = [];
            originalStatements_iTask1.forEach(stmt => {
                const originalStatementText = stmt.langText[lang] || stmt.langText.en, userAnswer = taskSpecificAnswers[stmt.id] || 'No explanation.';
                contextParts.push(`Statement: "${originalStatementText}"`);
                userInputsFormatted.push(`For statement "${originalStatementText.substring(0,30)}...": Your explanation: "${userAnswer}"`);
            });
            requestData.block_context = contextParts.join('\n\n');
            requestData.user_inputs = userInputsFormatted.length ? userInputsFormatted : ["No explanation."];
        } else if (taskKey === 'iTask2') {
            requestData.interaction_type = 'discuss_statement_nature';
            const taskSpecificAnswers = answers.iTask2 || {};
            const originalStatements_iTask2 = [
                 { id: 'i2_tashkent_dev_args', langText: {ru: "Утверждение: Ташкент - самый развитый город в Узбекистане.", en: "Statement: Tashkent is the most developed city in Uzbekistan."} },
                 { id: 'i2_english_success_args', langText: {ru: "Утверждение: Изучение английского языка необходимо для успеха в Узбекистане.", en: "Statement: Learning English is necessary for success in Uzbekistan."} }
            ];
            let contextParts = [`Task: ${t.factITask2Title}`, `Description: ${t.factITask2Desc.replace(/<[^>]*>?/gm, '')}`, "---"], userInputsFormatted = [];
            originalStatements_iTask2.forEach(stmt => {
                const originalStatementText = stmt.langText[lang] || stmt.langText.en, userAnswer = taskSpecificAnswers[stmt.id] || 'No arguments.';
                contextParts.push(`Statement for Debate: "${originalStatementText}"`);
                userInputsFormatted.push(`Regarding "${originalStatementText.substring(0,30)}...": Your arguments: "${userAnswer}"`);
            });
            requestData.block_context = contextParts.join('\n\n');
            requestData.user_inputs = userInputsFormatted.length ? userInputsFormatted : ["No arguments."];
        } else if (taskKey === 'aTask2') {
            requestData.interaction_type = 'assist_fact_check';
            const taskSpecificAnswers = answers.aTask2 || {};
            const originalStatements_aTask2 = [
                { idPrefix: 'verify1', langText: {ru: "Узбекистан был частью Советского Союза до 1991 года.", en: "Uzbekistan was part of the Soviet Union before 1991."} },
                { idPrefix: 'verify2', langText: {ru: "Официальный язык Узбекистана - русский.", en: "The official language of Uzbekistan is Russian."} },
                { idPrefix: 'verify3', langText: {ru: "В Узбекистане находится самая большая пустыня в Центральной Азии.", en: "Uzbekistan has the largest desert in Central Asia."} }
            ];
            let contextParts = [`Task: ${t.factATask2Title}`, `Description: ${t.factATask2Desc.replace(/<[^>]*>?/gm, '')}`, "---"], userInputsFormatted = [];
            originalStatements_aTask2.forEach(stmt => {
                const originalStatementText = stmt.langText[lang] || stmt.langText.en, userChoice = taskSpecificAnswers[`${stmt.idPrefix}_choice`] || 'Not answered', userExplanation = taskSpecificAnswers[`${stmt.idPrefix}_exp`] || 'No explanation.';
                contextParts.push(`Statement to Fact-Check: "${originalStatementText}"`);
                userInputsFormatted.push(`For "${originalStatementText.substring(0,30)}...": Assessment: '${userChoice}'. Explanation: "${userExplanation}"`);
            });
            requestData.block_context = contextParts.join('\n\n');
            requestData.user_inputs = userInputsFormatted.length ? userInputsFormatted : ["No input."];
        } else if (Object.keys(taskSpecificMainAnswers).length) {
            const titleKey = `${taskKey}Title`, descKey = `${taskKey}Desc`;
            requestData.block_context = t[titleKey] ? `${t[titleKey]}\n${t[descKey] || ''}` : `Context for ${taskKey}`;
            requestData.user_inputs = Object.entries(taskSpecificMainAnswers).map(([key, value]) => `${key}: ${String(value)}`);
            if (taskKey === 'factITask1') requestData.interaction_type = 'feedback_on_justification';
            else if (taskKey === 'factITask2') requestData.interaction_type = 'discuss_statement_nature';
            else if (taskKey === 'factATask2') requestData.interaction_type = 'assist_fact_check';
        }
        return requestData;
    }, [answers, t, lang]);

    const handleAskAiFactOpinion = useCallback(async (taskKey, userQuery = '', initialDataPayload = null) => {
        if (isAiLoading) return;
        setIsAiLoading(true);
        setActiveChatTaskKey(taskKey);
        setCurrentErrors(prev => ({ ...prev, [taskKey]: null }));
        const aiErrorText = t.aiError || 'Failed to get AI response.';
        if (userQuery) setChatMessages(prev => [...prev, { "role" : 'user', "content": userQuery }]);
        try {
            const requestDetails = getTaskDetailsForAI_FactOpinion(taskKey, initialDataPayload || {});
            if (userQuery) { requestDetails.userQuery = userQuery; requestDetails.chatMessages = chatMessages; }
            const response = await moduleService.getGenericAiInteraction(requestDetails);
            setChatMessages(prev => [...prev.filter(msg => msg.content !== (t.aiThinking || 'AI Thinking...')), { "role": 'assistant', "content": response.explanation }]);
        } catch (error) {
            console.error(`Error AI Fact/Opinion ${taskKey}:`, error);
            setChatMessages(prev => [...prev.filter(msg => msg.content !== (t.aiThinking || 'AI Thinking...')), {"role": 'assistant', "content": error.message || aiErrorText}]);
            setCurrentErrors(prev => ({ ...prev, [taskKey]: error.message || aiErrorText }));
        } finally {
            setIsAiLoading(false);
        }
    }, [isAiLoading, getTaskDetailsForAI_FactOpinion, t, chatMessages]); // Added chatMessages

    // Render logic
    return (
        <div className="bg-gray-100 text-gray-800 font-sans">
            <main className="container mx-auto px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{t.mainTitle}</h1>

                {/* Beginner Level Section */}
                <section className="level-section mb-12 p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-6 border-b pb-3">{t.beginnerLevel}</h2>
                    <MultipleChoiceTask taskKey="bTask1" title={<>{t.factBTask1Title} {isTaskCompleted('bTask1') && !progressLoading && <span className='text-green-500 font-semibold ml-2 text-sm'>({t.completedText})</span>}</>} description={t.factBTask1Desc} questions={beginnerTask1Data} lang={lang} options={{ fact: 'fact', opinion: 'opinion' }} checkBtnText={isTaskCompleted('bTask1') ? t.completedText : t.checkAnswersBtn} allCorrectMsg={t.allCorrectMessage} someIncorrectMsg={t.someIncorrectMessage} onAnswersChecked={handleSubmitFactOpinion} isCompleted={isTaskCompleted('bTask1') || progressLoading} onAskAi={handleAskAiFactOpinion} showAskAiButton={showAiButtons['bTask1'] && !isTaskCompleted('bTask1')} isMainAiLoading={isAiLoading} activeAiTaskKey={activeChatTaskKey} />
                    {currentErrors['bTask1'] && <p className="text-red-500 mt-2 text-sm">{currentErrors['bTask1']}</p>}
                    {activeChatTaskKey === 'bTask1' && !isTaskCompleted('bTask1') && (
                        <div className="mt-4">
                            <AiChatWindow messages={chatMessages} isLoading={isAiLoading} onSendMessage={(message) => handleAskAiFactOpinion('bTask1', message)} />
                            <button onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, bTask1: null})); }} className="mt-2 text-sm text-gray-600 hover:text-gray-800">{t.closeAiChat}</button>
                        </div>
                    )}

                    <div className="mb-8 p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-3">{t.factBTask2Title} {isTaskCompleted('bTask2') && !progressLoading && <span className='text-green-500 font-semibold ml-2 text-sm'>({t.completedText})</span>}</h3>
                        <p className="mb-4 text-sm text-gray-600">{t.factBTask2Desc}</p>
                        <div className="space-y-6">
                            {[{ itemKey: 'b2_op_uz_central_asia', originalTextKey: 'Fact: Uzbekistan is located in Central Asia.', originalTextRu: 'Факт: Узбекистан расположен в Центральной Азии.', rewritePromptKey: 'rewriteAsOpinion', placeholderKey: 'placeholderRewriteOpinion' }, { itemKey: 'b2_op_navruz_march_21', originalTextKey: 'Fact: Navruz is celebrated on March 21st.', originalTextRu: 'Факт: Навруз празднуется 21 марта.', rewritePromptKey: 'rewriteAsOpinion', placeholderKey: 'placeholderRewriteOpinion' }, { itemKey: 'b2_fact_uz_bread_better', originalTextKey: 'Opinion: Uzbek bread is better than any other bread.', originalTextRu: 'Мнение: Узбекский хлеб лучше любого другого хлеба.', rewritePromptKey: 'rewriteAsFact', placeholderKey: 'placeholderRewriteFact' }, { itemKey: 'b2_fact_samsa_best', originalTextKey: 'Opinion: The best Uzbek dish is samsa.', originalTextRu: 'Мнение: Лучшее узбекское блюдо - самса.', rewritePromptKey: 'rewriteAsFact', placeholderKey: 'placeholderRewriteFact' }].map((item, index) => (
                                <div key={item.itemKey}>
                                    <p className="font-medium">{index + 1}. {lang === 'ru' ? item.originalTextRu : item.originalTextKey}</p>
                                    <label className="block text-sm font-medium text-gray-700 mt-2">{t[item.rewritePromptKey]}</label>
                                    <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed" placeholder={t[item.placeholderKey]} onChange={(e) => handleAnswerChangeFactOpinion('bTask2', item.itemKey, e.target.value)} value={answers.bTask2?.[item.itemKey] || ''} disabled={isTaskCompleted('bTask2') || progressLoading || (isAiLoading && activeChatTaskKey === 'bTask2')} />
                                </div>
                            ))}
                        </div>
                        <div><button onClick={() => handleSubmitFactOpinion('bTask2')} disabled={isTaskCompleted('bTask2') || progressLoading || (isAiLoading && activeChatTaskKey === 'bTask2')} className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">{isTaskCompleted('bTask2') ? t.completedText : t.submitBtn}</button></div>
                        {showAiButtons['bTask2'] && !currentErrors['bTask2'] && !isTaskCompleted('bTask2') && (<div><button onClick={() => {handleAskAiFactOpinion('bTask2');setChatMessages([])}} disabled={isAiLoading && activeChatTaskKey === 'bTask2'} className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">{t.askAiBtn}</button></div>)}
                        {currentErrors['bTask2'] && <p className="text-red-500 mt-2 text-sm">{currentErrors['bTask2']}</p>}
                        {activeChatTaskKey === 'bTask2' && !isTaskCompleted('bTask2') && (<div className="mt-4"><AiChatWindow messages={chatMessages} isLoading={isAiLoading} onSendMessage={(message) => handleAskAiFactOpinion('bTask2', message)} /><button onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, bTask2: null})); }} className="mt-2 text-sm text-gray-600 hover:text-gray-800">{t.closeAiChat}</button></div>)}
                    </div>

                    <MultipleChoiceTask taskKey="bTask3" title={<>{t.factBTask3Title} {isTaskCompleted('bTask3') && !progressLoading && <span className='text-green-500 font-semibold ml-2 text-sm'>({t.completedText})</span>}</>} description={t.factBTask3Desc} questions={beginnerTask3Data} lang={lang} options={{ fact: 'fact', opinion: 'opinion' }} checkBtnText={isTaskCompleted('bTask3') ? t.completedText : t.checkAnswersBtn} allCorrectMsg={t.allCorrectMessage} someIncorrectMsg={t.someIncorrectMessage} onAnswersChecked={handleSubmitFactOpinion} isCompleted={isTaskCompleted('bTask3') || progressLoading} onAskAi={handleAskAiFactOpinion} showAskAiButton={showAiButtons['bTask3'] && !isTaskCompleted('bTask3')} isMainAiLoading={isAiLoading} activeAiTaskKey={activeChatTaskKey} />
                    {currentErrors['bTask3'] && <p className="text-red-500 mt-2 text-sm">{currentErrors['bTask3']}</p>}
                    {activeChatTaskKey === 'bTask3' && !isTaskCompleted('bTask3') && (<div className="mt-4"><AiChatWindow messages={chatMessages} isLoading={isAiLoading} onSendMessage={(message) => handleAskAiFactOpinion('bTask3', message)} /><button onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, bTask3: null})); }} className="mt-2 text-sm text-gray-600 hover:text-gray-800">{t.closeAiChat}</button></div>)}
                </section>

                <section className="level-section mb-12 p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-green-700 mb-6 border-b pb-3">{t.intermediateLevel}</h2>
                    <div className="mb-8 p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-3">{t.factITask1Title} {isTaskCompleted('iTask1') && !progressLoading && <span className='text-green-500 font-semibold ml-2 text-sm'>({t.completedText})</span>}</h3>
                        <p className="mb-4 text-sm text-gray-600">{t.factITask1Desc}</p>
                        <div className="space-y-6">
                            {[{ itemKey: 'i1_bukhara_unesco_exp', originalTextKey: 'Bukhara is a UNESCO World Heritage site.', originalTextRu: 'Бухара является объектом Всемирного наследия ЮНЕСКО.' }, { itemKey: 'i1_samarkand_khiva_exp', originalTextKey: 'Samarkand is more beautiful than Khiva.', originalTextRu: 'Самарканд красивее Хивы.' }, { itemKey: 'i1_uz_population_exp', originalTextKey: 'Uzbekistan has more than 35 million people.', originalTextRu: 'В Узбекистане проживает более 35 миллионов человек.' }].map((item, index) => (
                                <div key={item.itemKey}>
                                    <p className="font-medium">{index + 1}. {lang === 'ru' ? item.originalTextRu : item.originalTextKey}</p>
                                    <textarea className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed" rows="2" placeholder={t.placeholderExplanation} onChange={(e) => handleAnswerChangeFactOpinion('iTask1', item.itemKey, e.target.value)} value={answers.iTask1?.[item.itemKey] || ''} disabled={isTaskCompleted('iTask1') || progressLoading || (isAiLoading && activeChatTaskKey === 'iTask1')} />
                                </div>
                            ))}
                        </div>
                        <div><button onClick={() => handleSubmitFactOpinion('iTask1')} disabled={isTaskCompleted('iTask1') || progressLoading || (isAiLoading && activeChatTaskKey === 'iTask1')} className="mt-6 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">{isTaskCompleted('iTask1') ? t.completedText : t.submitBtn}</button></div>
                        {showAiButtons['iTask1'] && !currentErrors['iTask1'] && !isTaskCompleted('iTask1') && (<div><button onClick={() => {handleAskAiFactOpinion('iTask1'); setChatMessages([])}} disabled={isAiLoading && activeChatTaskKey === 'iTask1'} className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">{t.askAiBtn}</button></div>)}
                        {currentErrors['iTask1'] && <p className="text-red-500 mt-2 text-sm">{currentErrors['iTask1']}</p>}
                        {activeChatTaskKey === 'iTask1' && !isTaskCompleted('iTask1') && (<div className="mt-4"><AiChatWindow messages={chatMessages} isLoading={isAiLoading} onSendMessage={(message) => handleAskAiFactOpinion('iTask1', message)} /><button onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, iTask1: null})); }} className="mt-2 text-sm text-gray-600 hover:text-gray-800">{t.closeAiChat}</button></div>)}
                    </div>

                    <div className="p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-3">{t.factITask2Title}</h3> {/* iTask2 (Debate) not marked completed */}
                        <p className="mb-4 text-sm text-gray-600">{t.factITask2Desc}</p>
                        <div className="space-y-6">
                            {[{ itemKey: 'i2_tashkent_dev_args', originalTextKey: 'Statement: Tashkent is the most developed city in Uzbekistan.', originalTextRu: 'Утверждение: Ташкент - самый развитый город в Узбекистане.' }, { itemKey: 'i2_english_success_args', originalTextKey: 'Statement: Learning English is necessary for success in Uzbekistan.', originalTextRu: 'Утверждение: Изучение английского языка необходимо для успеха в Узбекистане.' }].map((item, index) => (
                                <div key={item.itemKey}>
                                    <p className="font-medium">{lang === 'ru' ? item.originalTextRu : item.originalTextKey}</p>
                                    <textarea className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100" rows="3" placeholder={t.placeholderArguments} onChange={(e) => handleAnswerChangeFactOpinion('iTask2', item.itemKey, e.target.value)} value={answers.iTask2?.[item.itemKey] || ''} disabled={progressLoading || (isAiLoading && activeChatTaskKey === 'iTask2')} />
                                </div>
                            ))}
                        </div>
                        <div><button onClick={() => handleSubmitFactOpinion('iTask2')} disabled={progressLoading || (isAiLoading && activeChatTaskKey === 'iTask2')} className="mt-6 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">{t.submitBtn}</button></div>
                        {showAiButtons['iTask2'] && !currentErrors['iTask2'] && (<div><button onClick={() => {handleAskAiFactOpinion('iTask2'); setChatMessages([])}} disabled={isAiLoading && activeChatTaskKey === 'iTask2'} className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">{t.askAiBtn}</button></div>)}
                        {currentErrors['iTask2'] && <p className="text-red-500 mt-2 text-sm">{currentErrors['iTask2']}</p>}
                        {activeChatTaskKey === 'iTask2' && (<div className="mt-4"><AiChatWindow messages={chatMessages} isLoading={isAiLoading} onSendMessage={(message) => handleAskAiFactOpinion('iTask2', message)} /><button onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, iTask2: null})); }} className="mt-2 text-sm text-gray-600 hover:text-gray-800">{t.closeAiChat}</button></div>)}
                    </div>
                </section>
                
                <section className="level-section p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-red-700 mb-6 border-b pb-3">{t.advancedLevel}</h2>
                    <MultipleChoiceTask taskKey="aTask1" title={<>{t.factATask1Title} {isTaskCompleted('aTask1') && !progressLoading && <span className='text-green-500 font-semibold ml-2 text-sm'>({t.completedText})</span>}</>} description={t.factATask1Desc} questions={advancedTask1Data} lang={lang} options={{ neutral: 'neutralFact', biased: 'biasedOpinion' }} checkBtnText={isTaskCompleted('aTask1') ? t.completedText : t.checkAnswersBtn} allCorrectMsg={t.allCorrectMessage} someIncorrectMsg={t.someIncorrectMessage} onAnswersChecked={handleSubmitFactOpinion} isCompleted={isTaskCompleted('aTask1') || progressLoading} onAskAi={handleAskAiFactOpinion} showAskAiButton={showAiButtons['aTask1'] && !isTaskCompleted('aTask1')} isMainAiLoading={isAiLoading} activeAiTaskKey={activeChatTaskKey} />
                    {currentErrors['aTask1'] && <p className="text-red-500 mt-2 text-sm">{currentErrors['aTask1']}</p>}
                    {activeChatTaskKey === 'aTask1' && !isTaskCompleted('aTask1') && (<div className="mt-4"><AiChatWindow messages={chatMessages} isLoading={isAiLoading} onSendMessage={(message) => handleAskAiFactOpinion('aTask1', message)} /><button onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, aTask1: null})); }} className="mt-2 text-sm text-gray-600 hover:text-gray-800">{t.closeAiChat}</button></div>)}

                    <div className="p-6 border rounded-lg task-card bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-3">{t.factATask2Title} {isTaskCompleted('aTask2') && !progressLoading && <span className='text-green-500 font-semibold ml-2 text-sm'>({t.completedText})</span>}</h3>
                        <p className="mb-4 text-sm text-gray-600">{t.factATask2Desc}</p>
                        <div className="space-y-6">
                            {[{ idPrefix: 'verify1', textKey: 'Uzbekistan was part of the Soviet Union before 1991.', textRu: 'Узбекистан был частью Советского Союза до 1991 года.' }, { idPrefix: 'verify2', textKey: 'The official language of Uzbekistan is Russian.', textRu: 'Официальный язык Узбекистана - русский.' }, { idPrefix: 'verify3', textKey: 'Uzbekistan has the largest desert in Central Asia.', textRu: 'В Узбекистане находится самая большая пустыня в Центральной Азии.' }].map((item, index) => (
                                <div key={item.idPrefix}>
                                    <p className="font-medium">{index + 1}. {lang === 'ru' ? item.textRu : item.textKey}</p>
                                    <div className="mt-2">
                                        <label className="mr-4 inline-flex items-center"><input type="radio" name={`aTask2-${item.idPrefix}_choice`} value="true" checked={answers.aTask2?.[`${item.idPrefix}_choice`] === 'true'} onChange={(e) => handleAnswerChangeFactOpinion('aTask2', `${item.idPrefix}_choice`, e.target.value)} disabled={isTaskCompleted('aTask2') || progressLoading || (isAiLoading && activeChatTaskKey === 'aTask2')} className="mr-2 h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed"/>{t.true}</label>
                                        <label className="inline-flex items-center"><input type="radio" name={`aTask2-${item.idPrefix}_choice`} value="false" checked={answers.aTask2?.[`${item.idPrefix}_choice`] === 'false'} onChange={(e) => handleAnswerChangeFactOpinion('aTask2', `${item.idPrefix}_choice`, e.target.value)} disabled={isTaskCompleted('aTask2') || progressLoading || (isAiLoading && activeChatTaskKey === 'aTask2')} className="mr-2 h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed"/>{t.false}</label>
                                    </div>
                                    <input type="text" className="mt-2 w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed" placeholder={t.placeholderFactCheck} onChange={(e) => handleAnswerChangeFactOpinion('aTask2', `${item.idPrefix}_exp`, e.target.value)} value={answers.aTask2?.[`${item.idPrefix}_exp`] || ''} disabled={isTaskCompleted('aTask2') || progressLoading || (isAiLoading && activeChatTaskKey === 'aTask2')} />
                                </div>
                            ))}
                        </div>
                        <div><button onClick={() => {handleSubmitFactOpinion('aTask2'); setChatMessages([])}} disabled={isTaskCompleted('aTask2') || progressLoading || (isAiLoading && activeChatTaskKey === 'aTask2')} className="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">{isTaskCompleted('aTask2') ? t.completedText : t.submitBtn}</button></div>
                        {showAiButtons['aTask2'] && !currentErrors['aTask2'] && !isTaskCompleted('aTask2') && (<div><button onClick={() => handleAskAiFactOpinion('aTask2')} disabled={isAiLoading && activeChatTaskKey === 'aTask2'} className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">{t.askAiBtn}</button></div>)}
                        {currentErrors['aTask2'] && <p className="text-red-500 mt-2 text-sm">{currentErrors['aTask2']}</p>}
                        {activeChatTaskKey === 'aTask2' && !isTaskCompleted('aTask2') && (<div className="mt-4"><AiChatWindow messages={chatMessages} isLoading={isAiLoading} onSendMessage={(message) => handleAskAiFactOpinion('aTask2', message)} /><button onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, aTask2: null})); }} className="mt-2 text-sm text-gray-600 hover:text-gray-800">{t.closeAiChat}</button></div>)}
                    </div>
                </section>
            </main>
        </div>
    );
}
