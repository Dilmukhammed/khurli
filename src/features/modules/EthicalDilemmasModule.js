import React, { useState, useEffect, useCallback } from 'react';
import moduleService from '../../services/moduleService'; // Assuming correct path
import AiChatWindow from '../../components/common/AiChatWindow'; // Assuming correct path

// Translations object for the Ethical Dilemmas & Problem Solving module.
const translations = {
    ru: {
        pageTitle: "Этические дилеммы и Решение проблем",
        mainTitle: "Этические дилеммы и Решение проблем",
        part1Title: "Часть 1: Этические дилеммы в области ИИ, онлайн-дезинформации и использования технологий",
        beginnerLevel: "Начальный уровень – Понимание цифровой этики",
        ethicsBTask1Title: "1. Фейковые или реальные новости?",
        ethicsBTask1Desc: "Вы видите шокирующую новость в социальных сетях. У нее нет официального источника, но все ею делятся.",
        ethicsBTask1Q1: "Как вы можете проверить, правдива ли она?",
        ethicsBTask1Q2: "Что следует сделать, прежде чем делиться?",
        placeholderYourThoughts: "Ваши мысли...",
        ethicsBTask2Title: "2. Чат-боты ИИ дают неверную информацию",
        ethicsBTask2Desc: "Чат-бот дает неверный совет по здоровью. Друг верит ему и следует неправильному лечению.",
        ethicsBTask2Q1: "Следует ли людям доверять ИИ в медицинских советах?",
        ethicsBTask2Q2: "Что нам делать, когда ИИ дает неверные ответы?",
        ethicsBTask3Title: "3. Конфиденциальность в интернете и обмен паролями",
        ethicsBTask3Desc: "Ваш лучший друг просит ваш пароль от социальной сети. Он обещает, что не сделает ничего плохого.",
        ethicsBTask3Q1: "Следует ли вам поделиться им? Почему или почему нет?",
        placeholderYourReasoning: "Ваше обоснование...",
        submitBtn: "Отправить ответы",
        intermediateLevel: "Средний уровень – Анализ этического воздействия технологий",
        ethicsITask1Title: "1. ИИ против человеческих рабочих мест",
        ethicsITask1Desc: "Компания заменяет людей-работников на ИИ. Бизнес зарабатывает больше денег, но многие люди теряют работу.",
        ethicsITask1Q1: "Это справедливо? Должны ли компании быть вынуждены сохранять людей-работников?",
        placeholderYourArguments: "Ваши аргументы...",
        ethicsITask2Title: "2. Дипфейк-видео и дезинформация",
        ethicsITask2Desc: "Вы видите фейковое видео политика, говорящего то, чего он никогда не говорил. Многие люди верят этому.",
        ethicsITask2Q1: "Как мы можем обнаружить дипфейки? Должно ли распространение фейковых видео быть незаконным?",
        placeholderYourProposals: "Ваши предложения...",
        advancedLevel: "Продвинутый уровень – Обсуждение сложных вопросов цифровой этики",
        ethicsATask1Title: "1. ИИ заменяет учителей – хорошо или плохо?",
        ethicsATask1Desc: "Новый ИИ-ассистент может оценивать экзамены, проводить уроки и отвечать на вопросы. Некоторые школы увольняют учителей-людей, чтобы сэкономить деньги.",
        ethicsATask1Q1: "Должен ли ИИ заменять учителей? Почему или почему нет? Каковы пределы ИИ в образовании?",
        placeholderYourDetailedAnalysis: "Ваш детальный анализ...",
        ethicsATask2Title: "2. ИИ создает фейковые новости – кто несет ответственность?",
        ethicsATask2Desc: "ИИ пишет реалистичные, но фейковые новостные статьи. Журналист публикует их как настоящие.",
        ethicsATask2Q1: "Кто виноват: ИИ, журналист или общественность? Должны ли компании-разработчики ИИ контролировать, что создает их технология?",
        part2Title: "Часть 2: Решение реальных проблем в Узбекистане",
        problemSolvingBLevel: "Начальный уровень – Решение повседневных проблем",
        problemsBTask1Title: "1. Безопасность дорожного движения",
        problemsBTask1Desc: "Дороги в Узбекистане могут быть переполнены, и водители часто не соблюдают правила.",
        problemsBTask1Q1: "Как мы можем сделать дороги безопаснее для пешеходов и водителей? Предложите три простых правила для улучшения дорожного движения.",
        placeholderYourSuggestions: "Ваши предложения...",
        problemsBTask3Title: "2. Поддержание чистоты в городе", // Note: This was BTask3, implies BTask2 might be missing or was intentionally skipped.
        problemsBTask3Desc: "Многие люди бросают мусор на улицах вместо того, чтобы использовать урны.",
        problemsBTask3Q1: "Как мы можем побудить людей выбрасывать мусор в урны? Разработайте плакат или слоган для чистого города.",
        placeholderYourIdeas: "Ваши идеи...",
        problemSolvingILevel: "Средний уровень – Решение проблем местного сообщества",
        problemsITask1Title: "1. Загрязнение воздуха в городах",
        problemsITask1Desc: "В Ташкенте и других крупных городах плохое качество воздуха из-за транспорта и заводов.",
        problemsITask1Q1: "Каковы основные причины загрязнения воздуха в Узбекистане? Предложите три решения для снижения загрязнения.",
        placeholderYourSolutions: "Ваши решения...",
        problemsITask3Title: "2. Безработица среди молодежи", // Note: This was ITask3
        problemsITask3Desc: "Многие молодые люди испытывают трудности с поиском работы после окончания университета.",
        problemsITask3Q1: "Какие навыки должны освоить студенты, чтобы получить лучшую работу? Должно ли правительство помогать выпускникам в поиске работы?",
        problemSolvingALevel: "Продвинутый уровень – Решение сложных проблем и дебаты",
        problemsATask1Title: "1. Водный кризис в Центральной Азии",
        problemsATask1Desc: "Узбекистан делит реки с другими странами, но существуют конфликты по поводу использования воды.",
        problemsATask1Q1: "Как Узбекистан может вести переговоры с соседями для справедливого распределения воды? Следует ли стране строить больше водохранилищ?",
        placeholderYourStrategies: "Ваши стратегии...",
        problemsATask4Title: "2. Устойчивое сельское хозяйство и производство хлопка", // Note: This was ATask4
        problemsATask4Desc: "Узбекистан экспортирует много хлопка, но это требует большого количества воды.",
        problemsATask4Q1: "Как Узбекистан может выращивать хлопок с меньшим расходом воды? Следует ли фермерам переключаться на другие культуры?",
        discussAiBtn: "Обсудить с ИИ",
        aiThinking: "ИИ думает...",
        closeAiChat: "Закрыть чат",
    },
    en: {
        pageTitle: "Ethical Dilemmas & Problem Solving",
        mainTitle: "Ethical Dilemmas and Problem Solving",
        part1Title: "Part 1: Ethical Dilemmas in AI, Online Misinformation, and Technology Use",
        beginnerLevel: "Beginner Level – Understanding Digital Ethics",
        ethicsBTask1Title: "1. Fake News or Real News?",
        ethicsBTask1Desc: "You see a shocking news story on social media. It has no official source, but everyone is sharing it.",
        ethicsBTask1Q1: "How can you check if it’s true?",
        ethicsBTask1Q2: "What should you do before sharing?",
        placeholderYourThoughts: "Your thoughts...",
        ethicsBTask2Title: "2. AI Chatbots Giving Wrong Information",
        ethicsBTask2Desc: "A chatbot gives incorrect advice about health. A friend believes it and follows the wrong treatment.",
        ethicsBTask2Q1: "Should people trust AI for medical advice?",
        ethicsBTask2Q2: "What should we do when AI gives wrong answers?",
        ethicsBTask3Title: "3. Online Privacy & Password Sharing",
        ethicsBTask3Desc: "Your best friend asks for your social media password. They promise they won’t do anything bad.",
        ethicsBTask3Q1: "Should you share it? Why or why not?",
        placeholderYourReasoning: "Your reasoning...",
        submitBtn: "Submit Answers",
        intermediateLevel: "Intermediate Level – Analyzing the Ethical Impact of Technology",
        ethicsITask1Title: "1. AI vs. Human Jobs",
        ethicsITask1Desc: "A company replaces human workers with AI. The business makes more money, but many people lose jobs.",
        ethicsITask1Q1: "Is this fair? Should companies be forced to keep human workers?",
        placeholderYourArguments: "Your arguments...",
        ethicsITask2Title: "2. Deepfake Videos & Misinformation",
        ethicsITask2Desc: "You see a fake video of a politician saying something they never said. Many people believe it.",
        ethicsITask2Q1: "How can we detect deepfakes? Should sharing fake videos be illegal?",
        placeholderYourProposals: "Your proposals...",
        advancedLevel: "Advanced Level – Debating Complex Digital Ethics Issues",
        ethicsATask1Title: "1. AI Replacing Teachers – Good or Bad?",
        ethicsATask1Desc: "A new AI teaching assistant can grade exams, give lessons, and answer questions. Some schools fire human teachers to save money.",
        ethicsATask1Q1: "Should AI replace teachers? Why or why not? What are the limits of AI in education?",
        placeholderYourDetailedAnalysis: "Your detailed analysis...",
        ethicsATask2Title: "2. AI Creating Fake News – Who is Responsible?",
        ethicsATask2Desc: "AI writes realistic but fake news articles. A journalist publishes them as real.",
        ethicsATask2Q1: "Who is to blame: the AI, the journalist, or the public? Should AI companies control what their technology creates?",
        part2Title: "Part 2: Solving Real-Life Problems in Uzbekistan",
        problemSolvingBLevel: "Beginner Level – Everyday Problem-Solving",
        problemsBTask1Title: "1. Traffic & Road Safety",
        problemsBTask1Desc: "Roads in Uzbekistan can be crowded, and drivers often don’t follow rules.",
        problemsBTask1Q1: "How can we make roads safer for pedestrians and drivers? Suggest three simple rules for better traffic.",
        placeholderYourSuggestions: "Your suggestions...",
        problemsBTask3Title: "2. Keeping the City Clean",
        problemsBTask3Desc: "Many people throw trash on the streets instead of using bins.",
        problemsBTask3Q1: "How can we encourage people to throw trash in bins? Design a poster or slogan for a clean city.",
        placeholderYourIdeas: "Your ideas...",
        problemSolvingILevel: "Intermediate Level – Solving Local Community Problems",
        problemsITask1Title: "1. Air Pollution in Cities",
        problemsITask1Desc: "Tashkent and other big cities have bad air quality due to traffic and factories.",
        problemsITask1Q1: "What are the main causes of air pollution in Uzbekistan? Suggest three solutions to reduce pollution.",
        placeholderYourSolutions: "Your solutions...",
        problemsITask3Title: "2. Youth Unemployment",
        problemsITask3Desc: "Many young people struggle to find jobs after university.",
        problemsITask3Q1: "What skills should students learn to get better jobs? Should the government help graduates find jobs?",
        problemSolvingALevel: "Advanced Level – Complex Problem-Solving & Debates",
        problemsATask1Title: "1. Water Crisis in Central Asia",
        problemsATask1Desc: "Uzbekistan shares rivers with other countries, but there is conflict over water use.",
        problemsATask1Q1: "How can Uzbekistan negotiate with neighbors to share water fairly? Should the country build more water reservoirs?",
        placeholderYourStrategies: "Your strategies...",
        problemsATask4Title: "2. Sustainable Agriculture & Cotton Production",
        problemsATask4Desc: "Uzbekistan exports a lot of cotton, but it uses a lot of water.",
        problemsATask4Q1: "How can Uzbekistan grow cotton with less water? Should farmers switch to different crops?",
        discussAiBtn: "Discuss with AI",
        aiThinking: "AI Thinking...",
        closeAiChat: "Close AI Chat",
    }
};

// Removed TaskCard component definition as it will be replaced by renderTask logic

export default function EthicalDilemmasModule() {
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');
    const [answers, setAnswers] = useState({});
    const [showAiButtons, setShowAiButtons] = useState({});
    const [activeChatTaskKey, setActiveChatTaskKey] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [currentErrors, setCurrentErrors] = useState({});

    useEffect(() => {
        document.title = translations[lang].pageTitle;
        const handleStorageChange = (event) => {
            if (event.key === 'logiclingua-lang') {
                setLang(event.newValue || 'ru');
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [lang]);

    const t = translations[lang];

    const handleAnswerChange = useCallback((taskKey, questionIdentifier, value) => {
        setAnswers(prev => ({
            ...prev,
            [taskKey]: {
                ...prev[taskKey],
                [questionIdentifier]: value
            }
        }));
        setShowAiButtons(prev => ({ ...prev, [taskKey]: false }));
        setCurrentErrors(prev => ({ ...prev, [taskKey]: null }));
    }, []);

    const handleSubmit = useCallback((taskKey) => {
        setShowAiButtons(prev => ({ ...prev, [taskKey]: true }));
        setCurrentErrors(prev => ({ ...prev, [taskKey]: null }));
    }, []);

    // Task Data (with taskKey and question keys added)
    const beginnerEthicsTasks = [
        { taskKey: 'ethicsBTask1', titleKey: 'ethicsBTask1Title', descriptionKey: 'ethicsBTask1Desc', questions: [
            { key: 'q1', labelKey: 'ethicsBTask1Q1', placeholderKey: 'placeholderYourThoughts' },
            { key: 'q2', labelKey: 'ethicsBTask1Q2', placeholderKey: 'placeholderYourThoughts' }
        ]},
        { taskKey: 'ethicsBTask2', titleKey: 'ethicsBTask2Title', descriptionKey: 'ethicsBTask2Desc', questions: [
            { key: 'q1', labelKey: 'ethicsBTask2Q1', placeholderKey: 'placeholderYourThoughts' },
            { key: 'q2', labelKey: 'ethicsBTask2Q2', placeholderKey: 'placeholderYourThoughts' }
        ]},
        { taskKey: 'ethicsBTask3', titleKey: 'ethicsBTask3Title', descriptionKey: 'ethicsBTask3Desc', questions: [
            { key: 'q1', labelKey: 'ethicsBTask3Q1', placeholderKey: 'placeholderYourReasoning' }
        ]},
    ];
    
    const intermediateEthicsTasks = [
        { taskKey: 'ethicsITask1', titleKey: 'ethicsITask1Title', descriptionKey: 'ethicsITask1Desc', questions: [
            { key: 'q1', labelKey: 'ethicsITask1Q1', rows: 3, placeholderKey: 'placeholderYourArguments' }
        ]},
        { taskKey: 'ethicsITask2', titleKey: 'ethicsITask2Title', descriptionKey: 'ethicsITask2Desc', questions: [
            { key: 'q1', labelKey: 'ethicsITask2Q1', rows: 3, placeholderKey: 'placeholderYourProposals' }
        ]},
    ];

    const advancedEthicsTasks = [
        { taskKey: 'ethicsATask1', titleKey: 'ethicsATask1Title', descriptionKey: 'ethicsATask1Desc', questions: [
            { key: 'q1', labelKey: 'ethicsATask1Q1', rows: 4, placeholderKey: 'placeholderYourDetailedAnalysis' }
        ]},
        { taskKey: 'ethicsATask2', titleKey: 'ethicsATask2Title', descriptionKey: 'ethicsATask2Desc', questions: [
            { key: 'q1', labelKey: 'ethicsATask2Q1', rows: 4, placeholderKey: 'placeholderYourDetailedAnalysis' }
        ]},
    ];

    const beginnerProblemsTasks = [
        { taskKey: 'problemsBTask1', titleKey: 'problemsBTask1Title', descriptionKey: 'problemsBTask1Desc', questions: [
            { key: 'q1', labelKey: 'problemsBTask1Q1', rows: 3, placeholderKey: 'placeholderYourSuggestions' }
        ]},
        { taskKey: 'problemsBTask3', titleKey: 'problemsBTask3Title', descriptionKey: 'problemsBTask3Desc', questions: [ // Assuming BTask3 based on original data
            { key: 'q1', labelKey: 'problemsBTask3Q1', rows: 3, placeholderKey: 'placeholderYourIdeas' }
        ]},
    ];

    const intermediateProblemsTasks = [
        { taskKey: 'problemsITask1', titleKey: 'problemsITask1Title', descriptionKey: 'problemsITask1Desc', questions: [
            { key: 'q1', labelKey: 'problemsITask1Q1', rows: 3, placeholderKey: 'placeholderYourSolutions' }
        ]},
        { taskKey: 'problemsITask3', titleKey: 'problemsITask3Title', descriptionKey: 'problemsITask3Desc', questions: [ // Assuming ITask3
            { key: 'q1', labelKey: 'problemsITask3Q1', rows: 3, placeholderKey: 'placeholderYourSolutions' }
        ]},
    ];
    
    const advancedProblemsTasks = [
        { taskKey: 'problemsATask1', titleKey: 'problemsATask1Title', descriptionKey: 'problemsATask1Desc', questions: [
            { key: 'q1', labelKey: 'problemsATask1Q1', rows: 4, placeholderKey: 'placeholderYourStrategies' }
        ]},
        { taskKey: 'problemsATask4', titleKey: 'problemsATask4Title', descriptionKey: 'problemsATask4Desc', questions: [ // Assuming ATask4
            { key: 'q1', labelKey: 'problemsATask4Q1', rows: 4, placeholderKey: 'placeholderYourStrategies' }
        ]},
    ];

    const getTaskDetailsForAI_EthicalDilemmas = useCallback((taskKey) => {
        const taskDataArrays = [
            ...beginnerEthicsTasks, ...intermediateEthicsTasks, ...advancedEthicsTasks,
            ...beginnerProblemsTasks, ...intermediateProblemsTasks, ...advancedProblemsTasks
        ];
        const currentTaskData = taskDataArrays.find(task => task.taskKey === taskKey);
        if (!currentTaskData) return { block_context: 'Unknown task', user_answers: ['No data for this task.'] };

        let taskBlockContext = `Task: ${t[currentTaskData.titleKey]}
Description: ${t[currentTaskData.descriptionKey].replace(/<[^>]*>?/gm, '')}`;
        let userAnswersFormatted = [];

        if (currentTaskData.questions) {
            currentTaskData.questions.forEach((q, index) => {
                const questionKey = q.key || `q${index}`;
                const answer = answers[taskKey]?.[questionKey] || 'No answer provided.';
                userAnswersFormatted.push(`Question: ${t[q.labelKey] || q.labelKey}
Your Answer: ${answer}`); // Used q.labelKey directly as it's a key
            });
        }

        if (userAnswersFormatted.length === 0) {
            userAnswersFormatted.push("User has not provided any specific inputs for this task yet.");
        }

        return {
            block_context: taskBlockContext,
            user_answers: [userAnswersFormatted.join('\n\n')],
            interaction_type: 'discuss_open_ended'
        };
    }, [answers, t, beginnerEthicsTasks, intermediateEthicsTasks, advancedEthicsTasks, beginnerProblemsTasks, intermediateProblemsTasks, advancedProblemsTasks]);

    const handleAskAI_EthicalDilemmas = useCallback(async (taskKey, userQuery = '') => {
        if (isAiLoading) return;
        setIsAiLoading(true);
        setActiveChatTaskKey(taskKey);
        setCurrentErrors(prev => ({ ...prev, [taskKey]: null }));
        const thinkingMsg = { sender: 'ai', text: t.aiThinking || 'Thinking...' };

        if (userQuery) {
            setChatMessages(prev => [...prev, { sender: 'user', text: userQuery }, thinkingMsg]);
        } else {
            setChatMessages([thinkingMsg]);
        }

        try {
            const { block_context, user_answers, interaction_type } = getTaskDetailsForAI_EthicalDilemmas(taskKey);
            const response = await moduleService.getAiDebateDiscussion(block_context, user_answers, userQuery);

            setChatMessages(prev => [
                ...prev.filter(msg => msg.text !== (t.aiThinking || 'Thinking...')),
                { sender: 'ai', text: response.explanation }
            ]);
        } catch (error) {
            console.error(`Error fetching AI discussion for ${taskKey}:`, error);
            const errorMsg = error.message || 'Failed to get AI response.';
            setChatMessages(prev => [
                ...prev.filter(msg => msg.text !== (t.aiThinking || 'Thinking...')),
                { sender: 'ai', text: `Sorry, I encountered an error: ${errorMsg}` }
            ]);
            setCurrentErrors(prev => ({ ...prev, [taskKey]: errorMsg }));
        } finally {
            setIsAiLoading(false);
        }
    }, [isAiLoading, getTaskDetailsForAI_EthicalDilemmas, t]);


    const renderTask = (task, level) => {
        let buttonColorClasses = 'bg-gray-500 hover:bg-gray-600'; // Default/fallback
        if (level === 'beginner') {
            buttonColorClasses = 'bg-indigo-500 hover:bg-indigo-600';
        } else if (level === 'intermediate') {
            buttonColorClasses = 'bg-green-500 hover:bg-green-600';
        } else if (level === 'advanced') {
            buttonColorClasses = 'bg-red-500 hover:bg-red-600';
        }

        return (
            <div key={task.taskKey} className="task-card bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-lg font-semibold mb-2 text-gray-800">{t[task.titleKey]}</h4>
                <p className="text-sm text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: t[task.descriptionKey] }}></p>
            <div className="space-y-4">
                {task.questions.map((q, qIndex) => {
                    const questionKey = q.key || `q${qIndex}`;
                    return (
                        <div key={questionKey}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t[q.labelKey] || q.labelKey}</label> {/* Use q.labelKey */}
                            <textarea
                                rows={q.rows || 3}
                                className="w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder={t[q.placeholderKey] || q.placeholderKey} // Use q.placeholderKey
                                value={answers[task.taskKey]?.[questionKey] || ''}
                                onChange={(e) => handleAnswerChange(task.taskKey, questionKey, e.target.value)}
                                disabled={isAiLoading}
                            />
                        </div>
                    );
                })}
            </div>
            <div>
                <button
                    onClick={() => handleSubmit(task.taskKey)}
                    disabled={isAiLoading}
                    className={`mt-4 ${buttonColorClasses} text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300`}
                >
                    {"Submit"}
                </button>
            </div>
            {showAiButtons[task.taskKey] && !currentErrors[task.taskKey] && (
                <div>
                    <button
                        onClick={() => handleAskAI_EthicalDilemmas(task.taskKey)}
                        disabled={isAiLoading && activeChatTaskKey === task.taskKey}
                        className="mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                    >
                        {t.discussAiBtn || "Discuss with AI"}
                    </button>
                </div>
            )}
            {currentErrors[task.taskKey] && <p className="text-red-500 mt-2 text-sm">{currentErrors[task.taskKey]}</p>}
            {activeChatTaskKey === task.taskKey && (
                <div className="mt-4">
                    <AiChatWindow
                        messages={chatMessages}
                        isLoading={isAiLoading}
                        onSendMessage={(message) => handleAskAI_EthicalDilemmas(task.taskKey, message)}
                    />
                    <button
                        onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, [task.taskKey]: null})); }}
                        className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                        {t.closeAiChat || "Close AI Chat"}
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-gray-100 text-gray-800 font-sans">
            <main className="container mx-auto px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">{t.mainTitle}</h1>

                {/* Part 1: Ethical Dilemmas */}
                <section className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 border-b-2 border-indigo-500 pb-3">{t.part1Title}</h2>
                    
                    <div className="level-section bg-white p-6 rounded-lg shadow mb-12">
                        <h3 className="text-xl font-bold text-indigo-700 mb-6">{t.beginnerLevel}</h3>
                        <div className="space-y-8">
                            {beginnerEthicsTasks.map(task => renderTask(task, 'beginner'))}
                        </div>
                        {/* Removed per-level submit button */}
                    </div>

                    <div className="level-section bg-white p-6 rounded-lg shadow mb-12">
                        <h3 className="text-xl font-bold text-green-700 mb-6">{t.intermediateLevel}</h3>
                        <div className="space-y-8">
                           {intermediateEthicsTasks.map(task => renderTask(task, 'intermediate'))}
                        </div>
                        {/* Removed per-level submit button */}
                    </div>

                    <div className="level-section bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold text-red-700 mb-6">{t.advancedLevel}</h3>
                        <div className="space-y-8">
                            {advancedEthicsTasks.map(task => renderTask(task, 'advanced'))}
                        </div>
                        {/* Removed per-level submit button */}
                    </div>
                </section>

                {/* Part 2: Problem Solving */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 border-b-2 border-purple-500 pb-3">{t.part2Title}</h2>

                     <div className="level-section bg-white p-6 rounded-lg shadow mb-12">
                        <h3 className="text-xl font-bold text-indigo-700 mb-6">{t.problemSolvingBLevel}</h3>
                        <div className="space-y-8">
                            {beginnerProblemsTasks.map(task => renderTask(task, 'beginner'))}
                        </div>
                        {/* Removed per-level submit button */}
                    </div>

                    <div className="level-section bg-white p-6 rounded-lg shadow mb-12">
                        <h3 className="text-xl font-bold text-green-700 mb-6">{t.problemSolvingILevel}</h3>
                        <div className="space-y-8">
                           {intermediateProblemsTasks.map(task => renderTask(task, 'intermediate'))}
                        </div>
                        {/* Removed per-level submit button */}
                    </div>

                    <div className="level-section bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold text-red-700 mb-6">{t.problemSolvingALevel}</h3>
                        <div className="space-y-8">
                            {advancedProblemsTasks.map(task => renderTask(task, 'advanced'))}
                        </div>
                        {/* Removed per-level submit button */}
                    </div>
                </section>
            </main>
        </div>
    );
}
