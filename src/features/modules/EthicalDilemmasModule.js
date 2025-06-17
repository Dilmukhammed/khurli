import React, { useState, useEffect } from 'react';

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
        problemsBTask3Title: "2. Поддержание чистоты в городе",
        problemsBTask3Desc: "Многие люди бросают мусор на улицах вместо того, чтобы использовать урны.",
        problemsBTask3Q1: "Как мы можем побудить людей выбрасывать мусор в урны? Разработайте плакат или слоган для чистого города.",
        placeholderYourIdeas: "Ваши идеи...",
        problemSolvingILevel: "Средний уровень – Решение проблем местного сообщества",
        problemsITask1Title: "1. Загрязнение воздуха в городах",
        problemsITask1Desc: "В Ташкенте и других крупных городах плохое качество воздуха из-за транспорта и заводов.",
        problemsITask1Q1: "Каковы основные причины загрязнения воздуха в Узбекистане? Предложите три решения для снижения загрязнения.",
        placeholderYourSolutions: "Ваши решения...",
        problemsITask3Title: "2. Безработица среди молодежи",
        problemsITask3Desc: "Многие молодые люди испытывают трудности с поиском работы после окончания университета.",
        problemsITask3Q1: "Какие навыки должны освоить студенты, чтобы получить лучшую работу? Должно ли правительство помогать выпускникам в поиске работы?",
        problemSolvingALevel: "Продвинутый уровень – Решение сложных проблем и дебаты",
        problemsATask1Title: "1. Водный кризис в Центральной Азии",
        problemsATask1Desc: "Узбекистан делит реки с другими странами, но существуют конфликты по поводу использования воды.",
        problemsATask1Q1: "Как Узбекистан может вести переговоры с соседями для справедливого распределения воды? Следует ли стране строить больше водохранилищ?",
        placeholderYourStrategies: "Ваши стратегии...",
        problemsATask4Title: "2. Устойчивое сельское хозяйство и производство хлопка",
        problemsATask4Desc: "Узбекистан экспортирует много хлопка, но это требует большого количества воды.",
        problemsATask4Q1: "Как Узбекистан может выращивать хлопок с меньшим расходом воды? Следует ли фермерам переключаться на другие культуры?",
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
    }
};

// Reusable component for open-ended question cards.
const TaskCard = ({ title, description, questions }) => (
    <div className="task-card bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <h4 className="text-lg font-semibold mb-2 text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="space-y-4">
            {questions.map((q, index) => (
                <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{q.label}</label>
                    <textarea 
                        rows={q.rows || 2} 
                        className="w-full border rounded-md p-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" 
                        placeholder={q.placeholder}
                    />
                </div>
            ))}
        </div>
    </div>
);

export default function EthicalDilemmasModule() {
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');

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

    const beginnerEthicsTasks = [
        { title: t.ethicsBTask1Title, description: t.ethicsBTask1Desc, questions: [{ label: t.ethicsBTask1Q1, placeholder: t.placeholderYourThoughts }, { label: t.ethicsBTask1Q2, placeholder: t.placeholderYourThoughts }] },
        { title: t.ethicsBTask2Title, description: t.ethicsBTask2Desc, questions: [{ label: t.ethicsBTask2Q1, placeholder: t.placeholderYourThoughts }, { label: t.ethicsBTask2Q2, placeholder: t.placeholderYourThoughts }] },
        { title: t.ethicsBTask3Title, description: t.ethicsBTask3Desc, questions: [{ label: t.ethicsBTask3Q1, placeholder: t.placeholderYourReasoning }] },
    ];
    
    const intermediateEthicsTasks = [
        { title: t.ethicsITask1Title, description: t.ethicsITask1Desc, questions: [{ label: t.ethicsITask1Q1, rows: 3, placeholder: t.placeholderYourArguments }] },
        { title: t.ethicsITask2Title, description: t.ethicsITask2Desc, questions: [{ label: t.ethicsITask2Q1, rows: 3, placeholder: t.placeholderYourProposals }] },
    ];

    const advancedEthicsTasks = [
        { title: t.ethicsATask1Title, description: t.ethicsATask1Desc, questions: [{ label: t.ethicsATask1Q1, rows: 4, placeholder: t.placeholderYourDetailedAnalysis }] },
        { title: t.ethicsATask2Title, description: t.ethicsATask2Desc, questions: [{ label: t.ethicsATask2Q1, rows: 4, placeholder: t.placeholderYourDetailedAnalysis }] },
    ];

    const beginnerProblemsTasks = [
        { title: t.problemsBTask1Title, description: t.problemsBTask1Desc, questions: [{ label: t.problemsBTask1Q1, rows: 3, placeholder: t.placeholderYourSuggestions }] },
        { title: t.problemsBTask3Title, description: t.problemsBTask3Desc, questions: [{ label: t.problemsBTask3Q1, rows: 3, placeholder: t.placeholderYourIdeas }] },
    ];

    const intermediateProblemsTasks = [
        { title: t.problemsITask1Title, description: t.problemsITask1Desc, questions: [{ label: t.problemsITask1Q1, rows: 3, placeholder: t.placeholderYourSolutions }] },
        { title: t.problemsITask3Title, description: t.problemsITask3Desc, questions: [{ label: t.problemsITask3Q1, rows: 3, placeholder: t.placeholderYourSolutions }] },
    ];
    
    const advancedProblemsTasks = [
        { title: t.problemsATask1Title, description: t.problemsATask1Desc, questions: [{ label: t.problemsATask1Q1, rows: 4, placeholder: t.placeholderYourStrategies }] },
        { title: t.problemsATask4Title, description: t.problemsATask4Desc, questions: [{ label: t.problemsATask4Q1, rows: 4, placeholder: t.placeholderYourStrategies }] },
    ];


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
                            {beginnerEthicsTasks.map((task, i) => <TaskCard key={`b-eth-${i}`} {...task} />)}
                        </div>
                        <button className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300">{t.submitBtn}</button>
                    </div>

                    <div className="level-section bg-white p-6 rounded-lg shadow mb-12">
                        <h3 className="text-xl font-bold text-green-700 mb-6">{t.intermediateLevel}</h3>
                        <div className="space-y-8">
                           {intermediateEthicsTasks.map((task, i) => <TaskCard key={`i-eth-${i}`} {...task} />)}
                        </div>
                        <button className="mt-6 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300">{t.submitBtn}</button>
                    </div>

                    <div className="level-section bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold text-red-700 mb-6">{t.advancedLevel}</h3>
                        <div className="space-y-8">
                            {advancedEthicsTasks.map((task, i) => <TaskCard key={`a-eth-${i}`} {...task} />)}
                        </div>
                        <button className="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300">{t.submitBtn}</button>
                    </div>
                </section>

                {/* Part 2: Problem Solving */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 border-b-2 border-purple-500 pb-3">{t.part2Title}</h2>

                     <div className="level-section bg-white p-6 rounded-lg shadow mb-12">
                        <h3 className="text-xl font-bold text-indigo-700 mb-6">{t.problemSolvingBLevel}</h3>
                        <div className="space-y-8">
                            {beginnerProblemsTasks.map((task, i) => <TaskCard key={`b-prob-${i}`} {...task} />)}
                        </div>
                        <button className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300">{t.submitBtn}</button>
                    </div>

                    <div className="level-section bg-white p-6 rounded-lg shadow mb-12">
                        <h3 className="text-xl font-bold text-green-700 mb-6">{t.problemSolvingILevel}</h3>
                        <div className="space-y-8">
                           {intermediateProblemsTasks.map((task, i) => <TaskCard key={`i-prob-${i}`} {...task} />)}
                        </div>
                        <button className="mt-6 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300">{t.submitBtn}</button>
                    </div>

                    <div className="level-section bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold text-red-700 mb-6">{t.problemSolvingALevel}</h3>
                        <div className="space-y-8">
                            {advancedProblemsTasks.map((task, i) => <TaskCard key={`a-prob-${i}`} {...task} />)}
                        </div>
                        <button className="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-300">{t.submitBtn}</button>
                    </div>
                </section>
            </main>
        </div>
    );
}
