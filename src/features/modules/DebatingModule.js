import React, { useState, useEffect, useCallback } from 'react';
import moduleService from '../../services/moduleService';
import AiChatWindow from '../../components/common/AiChatWindow';
import { useAuth } from '../../contexts/AuthContext'; // Assuming path

// --- Reusable UI Components ---

const LevelSection = ({ title, colorClass, children }) => (
    <section className="mb-12">
        <h2 className={`text-2xl md:text-3xl font-bold ${colorClass} mb-6 border-b-2 pb-3 ${colorClass.replace('text-', 'border-')}`}>{title}</h2>
        <div className="space-y-8">{children}</div>
    </section>
);

const TaskCard = ({ title, description, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        {description && <div className="text-sm text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: description }}></div>}
        {children}
    </div>
);

const SubmitButton = ({ onClick, color = 'indigo', children }) => {
    const colorClasses = {
        indigo: 'bg-indigo-500 hover:bg-indigo-600',
        green: 'bg-green-500 hover:bg-green-600',
        red: 'bg-red-500 hover:bg-red-600',
    };
    return (
        <button onClick={onClick} className={`mt-4 text-white px-4 py-2 rounded-md text-sm font-medium ${colorClasses[color]}`}>
            {children}
        </button>
    );
};

// --- Task-Specific Components ---

// Part 1: Refactor AgreeDisagreeTask Component
const AgreeDisagreeTask = ({ taskData, t, taskKey, answers, onAnswerChange, disabled }) => (
    <div className="space-y-6">
        {taskData.statements.map(stmt => (
            <div key={stmt.id}>
                <p className="font-medium text-sm">{t[stmt.textKey]}</p>
                <div className="mt-2">
                    <label className="mr-4 text-sm">
                        <input
                            type="radio"
                            name={`${taskKey}_${stmt.id}_choice`}
                            value="agree"
                            className="mr-1"
                            onChange={(e) => onAnswerChange(taskKey, `${stmt.id}_choice`, e.target.value)}
                            checked={answers[taskKey]?.[`${stmt.id}_choice`] === 'agree'}
                            disabled={disabled}
                        />
                        {t.agree}
                    </label>
                    <label className="text-sm">
                        <input
                            type="radio"
                            name={`${taskKey}_${stmt.id}_choice`}
                            value="disagree"
                            className="mr-1"
                            onChange={(e) => onAnswerChange(taskKey, `${stmt.id}_choice`, e.target.value)}
                            checked={answers[taskKey]?.[`${stmt.id}_choice`] === 'disagree'}
                            disabled={disabled}
                        />
                        {t.disagree}
                    </label>
                </div>
                <textarea
                    rows="2"
                    className="mt-2 w-full p-2 border rounded-md text-sm"
                    placeholder={t.explanationPlaceholder}
                    onChange={(e) => onAnswerChange(taskKey, `${stmt.id}_explanation`, e.target.value)}
                    value={answers[taskKey]?.[`${stmt.id}_explanation`] || ''}
                    disabled={disabled}
                ></textarea>
            </div>
        ))}
    </div>
);

// const ProblemSolutionTask = ({ taskData, t, color, taskKey, answers, onAnswerChange, onSubmit, disabled, children }) => (
//     <TaskCard title={t[taskData.titleKey]} description={t[taskData.descriptionKey]}>
//         <div className="space-y-4">
//             {taskData.prompts.map(prompt => (
//                  <div key={prompt.id}>
//                     <label htmlFor={prompt.id} className="block text-sm font-medium text-gray-700">{t[prompt.labelKey]}</label>
//                     <input
//                         type="text"
//                         id={prompt.id}
//                         className="mt-1 w-full border rounded p-2 text-sm"
//                         placeholder={t.yourSolutionPlaceholder}
//                         value={answers[taskKey]?.[prompt.id] || ''}
//                         onChange={(e) => onAnswerChange(taskKey, prompt.id, e.target.value)}
//                         disabled={disabled}
//                     />
//                 </div>
//             ))}
//         </div>
//         <div>
//             <SubmitButton color={color} onClick={onSubmit} disabled={disabled}>
//                 {t.submitBtn}
//             </SubmitButton>
//         </div>
//         {children}
//     </TaskCard>
// );

// Part 1: Refactor CaseStudyTask Component
// Modified ProblemSolutionTask to accept and display feedbackMessage
const ProblemSolutionTask = ({ taskData, t, color, taskKey, answers, onAnswerChange, onSubmit, disabled, children, feedbackMessage }) => (
    <TaskCard title={t[taskData.titleKey]} description={t[taskData.descriptionKey]}>
        <div className="space-y-4">
            {taskData.prompts.map(prompt => (
                 <div key={prompt.id}>
                    <label htmlFor={prompt.id} className="block text-sm font-medium text-gray-700">{t[prompt.labelKey]}</label>
                    <input
                        type="text"
                        id={prompt.id}
                        className="mt-1 w-full border rounded p-2 text-sm"
                        placeholder={t.yourSolutionPlaceholder}
                        value={answers[taskKey]?.[prompt.id] || ''}
                        onChange={(e) => onAnswerChange(taskKey, prompt.id, e.target.value)}
                        disabled={disabled}
                    />
                </div>
            ))}
        </div>
        <div className="flex items-center mt-4"> {/* Added flex container */}
            <SubmitButton color={color} onClick={onSubmit} disabled={disabled}>
                {t.submitBtn}
            </SubmitButton>
            {feedbackMessage && <span className="ml-3 text-sm text-green-600">{feedbackMessage}</span>}
        </div>
        {children}
    </TaskCard>
);

const CaseStudyTask = ({ taskData, t, taskKey, answers, onAnswerChange, disabled }) => (
    <div className="space-y-6">
        {taskData.cases.map(caseItem => (
            <div key={caseItem.id}>
                <h4 className="font-semibold text-gray-700">{t[caseItem.titleKey]}</h4>
                <p className="text-sm text-gray-600 my-2">{t[caseItem.descKey]}</p>
                {caseItem.prompts.map(prompt => {
                    const itemKey = `${caseItem.id}_${prompt.labelKey.replace(/\s+/g, '_')}`;
                    return (
                        <div key={prompt.labelKey} className="mt-2">
                            <label className="block text-sm font-medium text-gray-700">{t[prompt.labelKey]}</label>
                            <textarea
                                rows="3"
                                className="mt-1 w-full p-2 border rounded-md text-sm"
                                placeholder={t.yourThoughtsPlaceholder}
                                value={answers[taskKey]?.[itemKey] || ''}
                                onChange={(e) => onAnswerChange(taskKey, itemKey, e.target.value)}
                                disabled={disabled}
                            ></textarea>
                        </div>
                    );
                })}
            </div>
        ))}
    </div>
);

// Part 1: Refactor AdvancedSelectAndWriteTask Component
const AdvancedSelectAndWriteTask = ({ taskData, t, taskKey, answers, onAnswerChange, disabled, selectItemKey, textareaItemKey }) => {
    // Assuming taskData.prompts[0] is the relevant prompt for the textarea
    const prompt = taskData.prompts[0];

    return (
        <>
            <label htmlFor={taskData.selectId || taskKey + "_select"} className="block text-sm font-medium text-gray-700">{t[taskData.selectLabelKey]}</label>
            <select
                id={taskData.selectId || taskKey + "_select"}
                className="mt-1 w-full border rounded p-2 text-sm"
                value={answers[taskKey]?.[selectItemKey] || ''}
                onChange={(e) => onAnswerChange(taskKey, selectItemKey, e.target.value)}
                disabled={disabled}
            >
                <option value="">{t.selectOptionDefault}</option>
                {taskData.options.map(opt => <option key={opt.value} value={opt.value}>{t[opt.textKey]}</option>)}
            </select>

            {prompt && ( // Check if prompt exists
                <div key={prompt.labelKey} className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">{t[prompt.labelKey]}</label>
                    <textarea
                        rows="8"
                        className="mt-1 w-full border rounded p-2 text-sm"
                        placeholder={t[prompt.placeholderKey]}
                        value={answers[taskKey]?.[textareaItemKey] || ''}
                        onChange={(e) => onAnswerChange(taskKey, textareaItemKey, e.target.value)}
                        disabled={disabled}
                    ></textarea>
                </div>
            )}
        </>
    );
};

const CrossCulturalComparisonTask = ({ taskData, t, color, taskKey, answers, onAnswerChange, onSubmit, disabled, feedbackMessage }) => (
     <TaskCard title={t[taskData.titleKey]} description={t[taskData.descriptionKey]}>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">{t.chooseIssueToCompare}</label>
                <select
                    className="mt-1 w-full border rounded p-2 text-sm"
                    value={answers[taskKey]?.['aTask4_selectedIssue'] || ''}
                    onChange={(e) => onAnswerChange(taskKey, 'aTask4_selectedIssue', e.target.value)}
                    disabled={disabled}
                >
                    <option value="">{t.selectOptionDefault}</option>
                    {taskData.options.map(opt => <option key={opt.value} value={opt.value}>{t[opt.textKey]}</option>)}
                </select>
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700">{t.countryToCompare}</label>
                <input
                    type="text"
                    className="mt-1 w-full border rounded p-2 text-sm"
                    placeholder={t.countryToComparePlaceholder}
                    value={answers[taskKey]?.['aTask4_countryToCompare'] || ''}
                    onChange={(e) => onAnswerChange(taskKey, 'aTask4_countryToCompare', e.target.value)}
                    disabled={disabled}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">{t.yourFindingsAndAnalysis}</label>
                <textarea
                    rows="8"
                    className="mt-1 w-full border rounded p-2 text-sm"
                    placeholder={t.yourAnalysisPlaceholder}
                    value={answers[taskKey]?.['aTask4_analysisText'] || ''}
                    onChange={(e) => onAnswerChange(taskKey, 'aTask4_analysisText', e.target.value)}
                    disabled={disabled}
                ></textarea>
            </div>
        </div>
        <div className="flex items-center mt-4">
            <SubmitButton color={color} onClick={onSubmit} disabled={disabled}>
                {t.submitBtn}
            </SubmitButton>
            {feedbackMessage && <span className="ml-3 text-sm text-green-600">{feedbackMessage}</span>}
        </div>
     </TaskCard>
);

// --- Main Module Component ---
const DebatingModule = () => {
    const [language, setLanguage] = useState(localStorage.getItem('logiclingua-lang') || 'ru');
    const [answers, setAnswers] = useState({});
    const [showAiButtons, setShowAiButtons] = useState({});
    const [activeChatTaskKey, setActiveChatTaskKey] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [currentErrors, setCurrentErrors] = useState({}); // For displaying errors
    const [saveFeedback, setSaveFeedback] = useState({}); // To show "Saved!" message

    // Define discussion task keys for this module
    const discussionTaskKeys = ['bTask1', 'bTask3', 'iTask2', 'iTask3', 'aTask2', 'aTask3', 'aTask4'];
    const { isAuthenticated } = useAuth(); // Assuming useAuth is available like in FactOpinionModule

    useEffect(() => {
        const storedLang = localStorage.getItem('logiclingua-lang') || 'ru';
        setLanguage(storedLang);
        // document.documentElement.lang = storedLang;
        // document.title = t.pageTitle; // Assuming t is available or set another way

        const loadAnswers = async () => {
            // For now, skipping isAuthenticated check for loading answers from localStorage,
            // as it's local. If backend integration is added, this will be important.
            const loadedAnswers = {};
            for (const taskKey of discussionTaskKeys) {
                try {
                    const savedTaskAnswers = await moduleService.getTaskAnswers('debating', taskKey);
                    if (savedTaskAnswers) {
                        loadedAnswers[taskKey] = savedTaskAnswers;
                    }
                } catch (err) {
                    console.error(`Failed to fetch saved answers for ${taskKey} in debating module:`, err);
                }
            }
            if (Object.keys(loadedAnswers).length > 0) {
                setAnswers(prev => ({ ...prev, ...loadedAnswers }));
            }
        };
        loadAnswers();

    }, []); // Effect for language and initial answer loading. Re-evaluate dependencies if needed.


    const t = { // Assuming t object is relatively static or derived correctly based on language state elsewhere if this component re-renders often.
        ru: { 
            pageTitle: "Обсуждение социальных вопросов в Узбекистане", 
            beginnerLevel: "Начальный уровень – Выражение мнения",
            intermediateLevel: "Средний уровень – Структурированные аргументы",
            advancedLevel: "Продвинутый уровень – Сложные дебаты",
            agree: "Согласен", disagree: "Не согласен", submitBtn: "Отправить", 
            explanationPlaceholder: "Объяснение...", 
            yourSolutionPlaceholder: "Ваше решение...", 
            yourThoughtsPlaceholder: "Ваши мысли и аргументы...", 
            selectOptionDefault: "Выберите...",
            // Beginner
            debatingBTask1Title: "1. Согласен или не согласен — простые утверждения",
            debatingBTask1Desc: "Прочитайте следующие утверждения. Вы согласны или не согласны? Объясните почему в 1-2 предложениях.",
            debatingBTask1Stmt1: "Высшее образование должно быть бесплатным для всех студентов в Узбекистане.",
            debatingBTask1Stmt2: "Каждый должен учить английский, чтобы иметь лучшее будущее в Узбекистане.",
            debatingBTask1Stmt3: "Социальные сети более вредны, чем полезны для молодежи.",
            debatingBTask1Stmt4: "Женщинам важнее оставаться дома и заботиться о детях, чем работать.",
            debatingBTask1Stmt5: "Туризм – это будущее экономики Узбекистана.",
            debatingBTask2Title: "2. Двустороннее обсуждение (работа в паре)",
            debatingBTask2Desc: "Работайте с партнером. Один человек поддержит идею, а другой выступит против. Используйте простые фразы, например:<ul class='list-disc list-inside text-sm text-gray-500 mt-2 pl-4'><li>\"Я думаю, это правда, потому что...\"</li><li>\"Я не согласен, потому что...\"</li><li>\"По моему мнению...\"</li></ul>",
            topicsLabel: "Темы:",
            debatingBTask2Topic1: "Онлайн-образование лучше традиционного.",
            debatingBTask2Topic2: "Общественный транспорт должен быть бесплатным в больших городах.",
            debatingBTask2Topic3: "Узбекистан должен больше сосредоточиться на развитии технологий, чем на сельском хозяйстве.",
            debatingBTask3Title: "3. Обсуждение проблемы и решения",
            debatingBTask3Desc: "Выберите социальную проблему в Узбекистане и придумайте простое решение.<br><i>Пример: Проблема: Пробки на дорогах Ташкента. Решение: Построить больше станций метро.</i>",
            yourSolutionLabel: "Теперь придумайте решение для:",
            debatingBTask3Problem1: "1. Нехватка рабочих мест для молодежи.",
            debatingBTask3Problem2: "2. Слишком много пластиковых отходов в городах.",
            debatingBTask3Problem3: "3. Дорогое жилье для молодых семей.",
            // Intermediate
            debatingITask1Title: "1. Мини-дебаты (Групповая работа)",
            debatingITask1Desc: "Сформируйте две группы. Одна группа поддерживает утверждение, другая выступает против него. Каждая группа должна подготовить три аргумента и один контраргумент.",
            debatingITask1Topic1: "Правительство Узбекистана должно ограничить количество автомобилей в больших городах.",
            debatingITask1Topic2: "Студенты должны в обязательном порядке учиться за границей в течение одного года.",
            debatingITask2Title: "2. Обсуждение примеров из практики (Кейс-стади)",
            debatingITask2Desc: "Прочитайте следующие примеры из практики и обсудите наилучшее решение.",
            debatingITask2Case1Title: "Кейс 1:",
            debatingITask2Case1Desc: "Узбекский студент хочет учиться за границей, но его родители считают, что он должен остаться и помогать семейному бизнесу.",
            whatShouldHeDo: "Что ему делать?",
            argumentsBothSides: "Какие аргументы могут поддержать обе стороны?",
            debatingITask3Title: "3. Этические дилеммы",
            debatingITask3Desc: "Прочитайте каждую этическую ситуацию и выберите, что важнее. Обоснуйте свое решение тремя причинами.",
            debatingITask3Dilemma1: "1. Если студент списывает на экзамене, но помогает своей семье финансово, должен ли он быть наказан?",
            // Advanced
            debatingATask1Title: "1. Парламентские дебаты",
            debatingATask1Desc: "Разделитесь на две команды. Одна команда поддерживает политику, другая выступает против нее. Каждый оратор должен выступить с 1-минутной речью, за которой последует опровержение (ответ).",
            debatingATask1Motion1: "Узбекистан должен ввести четырехдневную рабочую неделю.",
            debatingATask1Motion2: "Голосование должно быть обязательным для всех граждан Узбекистана.",
            debatingATask1Motion3: "Традиционные узбекские семейные ценности важнее западных влияний.",
            debatingATask1Motion4: "Правительство должно контролировать цены на жилье и аренду.",
            // Task 2
            debatingATask2Title: "2. Предложение по политике",
            debatingATask2Desc: "Представьте, что вы советник правительства. Выберите одну проблему и создайте предложение по политике, которое включает: проблему, на кого она влияет, как правительство может ее решить, возможные проблемы. Представьте свою политику за 3-5 минут.",
            chooseIssue: "Выберите проблему:",
            debatingATask2Issue1: "Загрязнение воздуха в Ташкенте",
            debatingATask2Issue2: "Нехватка высокооплачиваемых рабочих мест для выпускников вузов",
            debatingATask2Issue3: "Защита узбекских культурных традиций от глобализации",
            yourPolicyProposal: "Ваше предложение по политике:",
            yourPolicyProposalPlaceholder: "Опишите проблему, затронутых лиц, решение и проблемы...",
            // Task 3
            debatingATask3Title: "3. Дебаты на спорные темы",
            debatingATask3Desc: "Каждый студент выбирает тему и пишет убедительную речь (200–300 слов), защищая одну сторону. Используйте статистику, реальные примеры и логические рассуждения.",
            chooseTopic: "Выберите тему:",
            debatingATask3Topic1: "Должен ли Узбекистан разрешить криптовалюту?",
            debatingATask3Topic2: "Должен ли английский язык стать официальным языком в Узбекистане?",
            debatingATask3Topic3: "Должны ли узбекские студенты проходить обязательную военную службу?",
            debatingATask3Topic4: "Необходима ли цензура для защиты узбекских культурных ценностей?",
            yourSpeech: "Ваша убедительная речь:",
            yourSpeechPlaceholder: "Ваша речь (200-300 слов)...",
             // Task 4
            debatingATask4Title: "4. Межкультурное сравнение",
            debatingATask4Desc: "Исследуйте и сравните, как Узбекистан и другая страна решают одну из этих проблем. Представьте свои выводы и обсудите, какая система лучше и почему.",
            chooseIssueToCompare: "Выберите проблему для сравнения:",
            debatingATask4Issue1: "Система образования",
            debatingATask4Issue2: "Права женщин",
            debatingATask4Issue3: "Государственная поддержка малого бизнеса",
            debatingATask4Issue4: "Экологическая политика",
            countryToCompare: "Страна для сравнения:",
            countryToComparePlaceholder: "Введите название страны...",
            yourFindingsAndAnalysis: "Ваши выводы и анализ:",
            yourAnalysisPlaceholder: "Опишите сравнение, выводы и почему одна система может быть лучше..."
        },
        en: {
            pageTitle: "Logiclingua - Debating",
                navAllModules: "All Modules",
                navDebating: "Debating",
                navAccount: "Personal Account",
                navLogin: "Login",
                mainTitle: "Debating Social Issues in Uzbekistan",
                beginnerLevel: "Beginner Level – Expressing Opinions on Social Issues",
                debatingBTask1Title: "1. Agree or Disagree – Simple Statements",
                debatingBTask1Desc: "Read the following statements. Do you agree or disagree? Explain why in 1-2 sentences.",
                debatingBTask1Stmt1: "Higher education should be free for all students in Uzbekistan.",
                debatingBTask1Stmt2: "Everyone should learn English to have a better future in Uzbekistan.",
                debatingBTask1Stmt3: "Social media is more harmful than beneficial for young people.",
                debatingBTask1Stmt4: "It is more important for women to stay at home and take care of children than to work.",
                debatingBTask1Stmt5: "Tourism is the future of Uzbekistan’s economy.",
                agree: "Agree",
                disagree: "Disagree",
                submitBtn: "Submit",
                debatingBTask2Title: "2. Two-Sides Discussion (Pair Work)",
                debatingBTask2Desc: "Work with a partner. One person will support the idea, and the other will oppose it. Use simple phrases like:",
                debatingBTask2Phrase1: "\"I think this is true because...\"",
                debatingBTask2Phrase2: "\"I don’t agree because...\"",
                debatingBTask2Phrase3: "\"In my opinion...\"",
                topicsLabel: "Topics:",
                debatingBTask2Topic1: "\"Online education is better than traditional education.\"",
                debatingBTask2Topic2: "\"Public transport should be free in big cities.\"",
                debatingBTask2Topic3: "\"Uzbekistan should focus more on developing technology than agriculture.\"",
                debatingBTask3Title: "3. Problem & Solution Discussion",
                debatingBTask3Desc: "Choose a social problem in Uzbekistan and think of a simple solution.",
                debatingBTask3Example: "Example:<br>Problem: Traffic congestion in Tashkent.<br>Solution: Build more metro stations.",
                yourSolutionLabel: "Now, think of a solution for:",
                debatingBTask3Problem1: "1. Lack of jobs for young people.",
                debatingBTask3Problem2: "2. Too much plastic waste in cities.",
                debatingBTask3Problem3: "3. Expensive housing for young families.",
                intermediateLevel: "Intermediate Level – Structured Arguments and Counterarguments",
                debatingITask1Title: "1. Mini-Debates (Group Work)",
                debatingITask1Desc: "Form two groups. One group supports the statement, the other opposes it. Each group must prepare three arguments and one counterargument (a response to the opposing side).",
                debatingITask1Topic1: "\"The Uzbek government should limit the number of cars in big cities.\"",
                debatingITask1Topic2: "\"It should be mandatory for students to study abroad for one year.\"",
                debatingITask1Topic3: "\"Foreign companies should be allowed to buy land in Uzbekistan.\"",
                debatingITask1Topic4: "\"The government should increase taxes on fast food restaurants.\"",
                debatingITask2Title: "2. Case Study Discussion",
                debatingITask2Desc: "Read the following case studies and discuss the best solution.",
                debatingITask2Case1Title: "Case 1:",
                debatingITask2Case1Desc: "An Uzbek student wants to study abroad, but his parents believe he should stay and help the family business.",
                whatShouldHeDo: "What should he do?",
                argumentsBothSides: "What arguments can support both sides?",
                debatingITask2Case2Title: "Case 2:",
                debatingITask2Case2Desc: "A small village in Uzbekistan is losing young people because they move to big cities for work.",
                howToMakeVillagesAttractive: "How can the government make villages more attractive to live in?",
                debatingITask2Case3Title: "Case 3:",
                debatingITask2Case3Desc: "Many students in Uzbekistan spend too much time on social media instead of studying.",
                shouldSchoolsLimitPhones: "Should schools limit phone usage?",
                debatingITask3Title: "3. Ethical Dilemmas",
                debatingITask3Desc: "Read each ethical situation and choose what is more important. Defend your decision with three reasons.",
                debatingITask3Dilemma1: "1. If a student cheats on an exam but helps his family financially, should he be punished?",
                debatingITask3Dilemma2: "2. If a person finds money on the street, should they keep it or try to return it?",
                debatingITask3Dilemma3: "3. Should the government spend more money on modernizing cities or helping rural areas?",
                advancedLevel: "Advanced Level – Complex Social Issues & Persuasive Debating",
                debatingATask1Title: "1. Parliamentary Debate",
                debatingATask1Desc: "Divide into two teams. One team supports the policy, the other opposes it. Each speaker must give a 1-minute speech, followed by a rebuttal (response).",
                debatingATask1Motion1: "\"Uzbekistan should introduce a four-day workweek.\"",
                debatingATask1Motion2: "\"Voting should be mandatory for all Uzbek citizens.\"",
                debatingATask1Motion3: "\"Traditional Uzbek family values are more important than Western influences.\"",
                debatingATask1Motion4: "\"The government should control the prices of housing and rent.\"",
                debatingATask2Title: "2. Policy Proposal",
                debatingATask2Desc: "Imagine you are a government advisor. Choose one issue and create a policy proposal that includes: the problem, who it affects, how the government can solve it, possible challenges. Present your policy in 3-5 minutes.",
                chooseIssue: "Choose an issue:",
                selectOptionDefault: "Select...",
                debatingATask2Issue1: "Air pollution in Tashkent",
                debatingATask2Issue2: "Lack of high-paying jobs for university graduates",
                debatingATask2Issue3: "Protecting Uzbek cultural traditions from globalization",
                yourPolicyProposal: "Your policy proposal:",
                debatingATask3Title: "3. Debate on Controversial Topics",
                debatingATask3Desc: "Each student picks a topic and writes a persuasive speech (200–300 words) defending one side. Use statistics, real-life examples, and logical reasoning.",
                chooseTopic: "Choose a topic:",
                debatingATask3Topic1: "\"Should Uzbekistan allow cryptocurrency?\"",
                debatingATask3Topic2: "\"Should English become an official language in Uzbekistan?\"",
                debatingATask3Topic3: "\"Should Uzbek students be required to serve in the military?\"",
                debatingATask3Topic4: "\"Is censorship necessary to protect Uzbek cultural values?\"",
                yourSpeech: "Your persuasive speech:",
                debatingATask4Title: "4. Cross-Cultural Comparison",
                debatingATask4Desc: "Research and compare how Uzbekistan and another country handle one of these issues. Present your findings and discuss which system is better and why.",
                chooseIssueToCompare: "Choose an issue to compare:",
                debatingATask4Issue1: "Education system",
                debatingATask4Issue2: "Women’s rights",
                debatingATask4Issue3: "Government support for small businesses",
                debatingATask4Issue4: "Environmental policies",
                countryToCompare: "Country to compare with:",
                yourFindingsAndAnalysis: "Your findings and analysis:",
                footerRights: "&copy; 2025 Logiclingua. All rights reserved.",
                footerPrivacy: "Privacy Policy",
                footerTerms: "Terms of Use",
        }
    }[language];

    const handleAnswerChange = (taskKey, itemKey, value) => {
        setAnswers(prev => ({
            ...prev,
            [taskKey]: { ...prev[taskKey], [itemKey]: value }
        }));
        setShowAiButtons(prev => ({ ...prev, [taskKey]: false }));
        setCurrentErrors(prev => ({...prev, [taskKey]: null}));
    };

    const handleSubmit = (taskKey) => {
        setShowAiButtons(prev => ({ ...prev, [taskKey]: true }));
        setCurrentErrors(prev => ({...prev, [taskKey]: null}));

        if (discussionTaskKeys.includes(taskKey)) {
            const taskAnswersToSave = answers[taskKey];
            if (taskAnswersToSave && Object.keys(taskAnswersToSave).length > 0) {
                moduleService.saveTaskAnswers('debating', taskKey, taskAnswersToSave)
                    .then(() => {
                        setSaveFeedback(prev => ({ ...prev, [taskKey]: "Saved!" }));
                        setTimeout(() => {
                            setSaveFeedback(prev => ({ ...prev, [taskKey]: "" }));
                        }, 2000); // Clear feedback after 2 seconds
                    })
                    .catch(err => {
                        console.error(`Error saving answers for ${taskKey} in debating module:`, err);
                        setSaveFeedback(prev => ({ ...prev, [taskKey]: "Save failed." }));
                        setTimeout(() => {
                            setSaveFeedback(prev => ({ ...prev, [taskKey]: "" }));
                        }, 3000); // Clear feedback after 3 seconds
                    });
            } else {
                // If no answers to save, perhaps provide different feedback or none
                // For now, no feedback if nothing to save for this task.
            }
        }
        // Example: setResults(prev => ({ ...prev, [taskKey]: { type: 'submitted', message: t.submissionReceived || 'Your response has been recorded.' }}));
    };

    const getTaskDetailsForAI_Debate = (taskKey) => {
        const taskAnswers = answers[taskKey] || {};
        let taskBlockContext = `Context for ${taskKey}`;
        let userAnswersFormattedStrings = [];
        const taskSpecificAnswers = answers[taskKey] || {};

        if (taskKey === 'bTask1') {
            taskBlockContext = `Task: ${t.debatingBTask1Title}\nDescription: ${t.debatingBTask1Desc.replace(/<[^>]*>?/gm, '')}`;
            if (beginnerTasks && beginnerTasks.agreeDisagree && beginnerTasks.agreeDisagree.statements) {
                beginnerTasks.agreeDisagree.statements.forEach(stmt => {
                    const choice = taskSpecificAnswers[`${stmt.id}_choice`] || 'Not answered';
                    const explanation = taskSpecificAnswers[`${stmt.id}_explanation`] || 'No explanation';
                    userAnswersFormattedStrings.push(`Statement: ${t[stmt.textKey]}\nYour Choice: ${choice}\nYour Explanation: ${explanation}`);
                });
            }
            if (userAnswersFormattedStrings.length === 0) {
                userAnswersFormattedStrings.push("User has not provided any answers yet.");
            }
        } else if (taskKey === 'bTask3') {
            taskBlockContext = `Task: ${t.debatingBTask3Title}\nDescription: ${t.debatingBTask3Desc.replace(/<[^>]*>?/gm, '')}`;
            if (beginnerTasks && beginnerTasks.problemSolution && beginnerTasks.problemSolution.prompts) {
                beginnerTasks.problemSolution.prompts.forEach(prompt => {
                    const solution = taskSpecificAnswers[prompt.id] || 'No solution provided';
                    userAnswersFormattedStrings.push(`Problem: ${t[prompt.labelKey]}\nYour Solution: ${solution}`);
                });
            }
            if (userAnswersFormattedStrings.length === 0) {
                userAnswersFormattedStrings.push("User has not provided any solutions yet.");
            }
        } else if (taskKey === 'iTask2') {
            const caseContexts = intermediateTasks.caseStudy.cases.map(caseItem =>
                `Case: ${t[caseItem.titleKey]}\nDescription: ${t[caseItem.descKey.replace(/<[^>]*>?/gm, '')]}`
            ).join('\n\n');
            taskBlockContext = `Task: ${t.debatingITask2Title}\nDescription: ${t.debatingITask2Desc.replace(/<[^>]*>?/gm, '')}\n\n${caseContexts}`;

            if (intermediateTasks && intermediateTasks.caseStudy && intermediateTasks.caseStudy.cases) {
                intermediateTasks.caseStudy.cases.forEach(caseItem => {
                    caseItem.prompts.forEach(prompt => {
                        const itemKey = `${caseItem.id}_${prompt.labelKey.replace(/\s+/g, '_')}`;
                        const response = taskSpecificAnswers[itemKey] || 'No response';
                        userAnswersFormattedStrings.push(`Case: ${t[caseItem.titleKey]}\nPrompt: ${t[prompt.labelKey]}\nYour Response: ${response}`);
                    });
                });
            }
            if (userAnswersFormattedStrings.length === 0) {
                userAnswersFormattedStrings.push("User has not provided any answers yet.");
            }
        } else if (taskKey === 'iTask3') {
            const dilemmaTexts = intermediateTasks.ethicalDilemmas.dilemmas.map(d => t[d.textKey]).join('\n\n');
            taskBlockContext = `Task: ${t.debatingITask3Title}\nDescription: ${t.debatingITask3Desc.replace(/<[^>]*>?/gm, '')}\n\nDilemmas:\n${dilemmaTexts}`;

            if (intermediateTasks && intermediateTasks.ethicalDilemmas && intermediateTasks.ethicalDilemmas.dilemmas) {
                intermediateTasks.ethicalDilemmas.dilemmas.forEach(dilemma => {
                    const itemKey = `${dilemma.id}_thoughts`;
                    const response = taskSpecificAnswers[itemKey] || 'No thoughts provided';
                    userAnswersFormattedStrings.push(`Dilemma: ${t[dilemma.textKey]}\nYour Thoughts: ${response}`);
                });
            }
            if (userAnswersFormattedStrings.length === 0) {
                userAnswersFormattedStrings.push("User has not provided any thoughts yet.");
            }
        } else if (taskKey === 'aTask2') {
            const policyTaskData = advancedTasks.policyProposal;
            const issues = policyTaskData.options.map(opt => t[opt.textKey]).join(', ');
            taskBlockContext = `Task: ${t.debatingATask2Title}\nDescription: ${t.debatingATask2Desc.replace(/<[^>]*>?/gm, '')}\nAvailable issues: ${issues}`;

            const selectedIssueValue = taskSpecificAnswers['aTask2_selectedIssue'] || 'Not selected';
            const selectedIssueText = policyTaskData.options.find(opt => opt.value === selectedIssueValue)?.textKey
                                      ? t[policyTaskData.options.find(opt => opt.value === selectedIssueValue).textKey]
                                      : selectedIssueValue;
            const proposalText = taskSpecificAnswers['aTask2_policyProposalText'] || 'No proposal written.';
            const formatted = `Selected Issue: ${selectedIssueText}\nPolicy Proposal:\n${proposalText}`;
            userAnswersFormattedStrings.push(formatted);

            if (userAnswersFormattedStrings.length === 0 || proposalText === 'No proposal written.' && selectedIssueValue === 'Not selected') {
                 userAnswersFormattedStrings = ["User has not provided a complete response yet."];
            }
        } else if (taskKey === 'aTask3') {
            const debateTaskData = advancedTasks.controversialDebate;
            const topics = debateTaskData.options.map(opt => t[opt.textKey]).join(', ');
            taskBlockContext = `Task: ${t.debatingATask3Title}\nDescription: ${t.debatingATask3Desc.replace(/<[^>]*>?/gm, '')}\nAvailable topics: ${topics}`;

            const selectedTopicValue = taskSpecificAnswers['aTask3_selectedTopic'] || 'Not selected';
            const selectedTopicText = debateTaskData.options.find(opt => opt.value === selectedTopicValue)?.textKey
                                      ? t[debateTaskData.options.find(opt => opt.value === selectedTopicValue).textKey]
                                      : selectedTopicValue;
            const speechText = taskSpecificAnswers['aTask3_speechText'] || 'No speech written.';
            const formatted = `Selected Topic: ${selectedTopicText}\nPersuasive Speech:\n${speechText}`;
            userAnswersFormattedStrings.push(formatted);

            if (userAnswersFormattedStrings.length === 0 || speechText === 'No speech written.' && selectedTopicValue === 'Not selected') {
                userAnswersFormattedStrings = ["User has not provided a complete response yet."];
            }
        } else {
            // Generic formatting for other tasks if answers exist
            if (Object.keys(taskSpecificAnswers).length > 0) {
                userAnswersFormattedStrings = Object.entries(taskSpecificAnswers).map(([key, value]) => `${key}: ${String(value)}`);
            } else {
                userAnswersFormattedStrings.push("User has not provided an answer yet.");
            }
        }

        // Ensure user_answers is always an array of strings, even if it's just one formatted string.
        // For multiple entries like bTask1, we join them into one string.
        const finalFormattedAnswers = userAnswersFormattedStrings.length > 0 ? [userAnswersFormattedStrings.join('\n\n')] : ["User has not provided an answer yet."];

        return {
            block_context: taskBlockContext,
            user_answers: finalFormattedAnswers,
            interaction_type: 'discuss_open_ended'
        };
    };

    const handleAskAI_Debate = async (taskKey, userQuery = '') => {
        if (isAiLoading) return;
        setIsAiLoading(true);
        setActiveChatTaskKey(taskKey);
        setCurrentErrors(prev => ({...prev, [taskKey]: null}));
        const thinkingMsg = { sender: 'ai', text: 'Thinking...' };

        if (userQuery) {
            setChatMessages(prev => [
                ...prev,
                { "role" : 'user', "content": userQuery },
            ]);
        }

        try {
            const { block_context, user_answers, interaction_type } = getTaskDetailsForAI_Debate(taskKey);

            if (!block_context) {
                 console.error("Could not get task details for AI for taskKey:", taskKey); // Keep this error
                 setChatMessages(prev => [
                ...prev.filter(msg => msg["content"] !== 'Thinking...'),
                {"role": 'assistant', "content": "Sorry, I couldn't get the details for this task."}
            ]);
                setCurrentErrors(prev => ({...prev, [taskKey]: "Could not retrieve task details."}));
                setIsAiLoading(false);
                return;
            }
            // console.log("debating module block context", block_context); // Debug log
            // console.log("user answers",user_answers); // Debug log
            const response = await moduleService.getAiDebateDiscussion(block_context, user_answers, userQuery, chatMessages);
            setChatMessages(prev => [
                ...prev.filter(msg => msg["content"] !== 'Thinking...'),
                { "role": 'assistant', "content": response.explanation }
            ]);
        } catch (error) {
            console.error(`Error fetching AI debate discussion for ${taskKey}:`, error);
            const errorMsg = error.message || 'Failed to get AI response.';
            setChatMessages(prev => [
                ...prev.filter(msg => msg["content"] !== 'Thinking...'),
                { "role": 'assistant', "content": `Sorry, I encountered an error: ${error.message}` }
            ]);
            setCurrentErrors(prev => ({...prev, [taskKey]: errorMsg }));
        } finally {
            setIsAiLoading(false);
        }
    };

    // --- Data for all tasks ---
    const beginnerTasks = {
        agreeDisagree: { titleKey: 'debatingBTask1Title', descriptionKey: 'debatingBTask1Desc', statements: [
            {id: 'b1s1', textKey: 'debatingBTask1Stmt1'}, {id: 'b1s2', textKey: 'debatingBTask1Stmt2'}, {id: 'b1s3', textKey: 'debatingBTask1Stmt3'}, {id: 'b1s4', textKey: 'debatingBTask1Stmt4'}, {id: 'b1s5', textKey: 'debatingBTask1Stmt5'}
        ]},
        twoSides: { titleKey: 'debatingBTask2Title', descriptionKey: 'debatingBTask2Desc', topics: ['debatingBTask2Topic1', 'debatingBTask2Topic2', 'debatingBTask2Topic3'] },
        problemSolution: { titleKey: 'debatingBTask3Title', descriptionKey: 'debatingBTask3Desc', prompts: [
            {id: 'b3p1', labelKey: 'debatingBTask3Problem1'}, {id: 'b3p2', labelKey: 'debatingBTask3Problem2'}, {id: 'b3p3', labelKey: 'debatingBTask3Problem3'}
        ]}
    };

    const intermediateTasks = {
        miniDebates: { titleKey: 'debatingITask1Title', descriptionKey: 'debatingITask1Desc', topics: ['debatingITask1Topic1', 'debatingITask1Topic2']},
        caseStudy: { titleKey: 'debatingITask2Title', descriptionKey: 'debatingITask2Desc', cases: [
            {id: 'i2c1', titleKey: 'debatingITask2Case1Title', descKey: 'debatingITask2Case1Desc', prompts: [{labelKey: 'whatShouldHeDo'}, {labelKey: 'argumentsBothSides'}]},
        ]},
        ethicalDilemmas: { titleKey: 'debatingITask3Title', descriptionKey: 'debatingITask3Desc', dilemmas: [{id: 'i3d1', textKey: 'debatingITask3Dilemma1'}]}
    };
    
    const advancedTasks = {
        parliamentaryDebate: { titleKey: 'debatingATask1Title', descriptionKey: 'debatingATask1Desc', motions: ['debatingATask1Motion1', 'debatingATask1Motion2', 'debatingATask1Motion3', 'debatingATask1Motion4']},
        policyProposal: { titleKey: 'debatingATask2Title', descriptionKey: 'debatingATask2Desc', selectId: 'policy_issue', selectLabelKey: 'chooseIssue', options: [{value: 'air_pollution', textKey: 'debatingATask2Issue1'}, {value: 'youth_jobs', textKey: 'debatingATask2Issue2'}, {value: 'cultural_traditions', textKey: 'debatingATask2Issue3'}], prompts: [{labelKey: 'yourPolicyProposal', placeholderKey: 'yourPolicyProposalPlaceholder'}]},
        controversialDebate: { titleKey: 'debatingATask3Title', descriptionKey: 'debatingATask3Desc', selectId: 'controversial_topic', selectLabelKey: 'chooseTopic', options: [{value: 'crypto', textKey: 'debatingATask3Topic1'}, {value: 'english_official', textKey: 'debatingATask3Topic2'}, {value: 'military_service', textKey: 'debatingATask3Topic3'}, {value: 'censorship', textKey: 'debatingATask3Topic4'}], prompts: [{labelKey: 'yourSpeech', placeholderKey: 'yourSpeechPlaceholder'}]},
        crossCultural: { titleKey: 'debatingATask4Title', descriptionKey: 'debatingATask4Desc', options: [{value: 'education', textKey: 'debatingATask4Issue1'}, {value: 'womens_rights', textKey: 'debatingATask4Issue2'}, {value: 'small_business_support', textKey: 'debatingATask4Issue3'}, {value: 'environmental_policies', textKey: 'debatingATask4Issue4'}]}
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">{t.pageTitle}</h1>
            
            <LevelSection title={t.beginnerLevel} colorClass="text-indigo-700">
                {/* Part 3: Update DebatingModule JSX for AgreeDisagreeTask */}
                <TaskCard title={t.debatingBTask1Title} description={t.debatingBTask1Desc}>
                    <AgreeDisagreeTask
                        taskData={beginnerTasks.agreeDisagree}
                        t={t}
                        taskKey="bTask1"
                        answers={answers}
                        onAnswerChange={handleAnswerChange}
                        disabled={isAiLoading}
                    />
                    <div>
                        <SubmitButton onClick={() => handleSubmit('bTask1')} color="indigo" disabled={isAiLoading}>
                            {t.submitBtn}
                        </SubmitButton>
                        {saveFeedback['bTask1'] && <span className="ml-3 text-sm text-green-600">{saveFeedback['bTask1']}</span>}
                    </div>
                    {showAiButtons['bTask1'] && !currentErrors['bTask1'] && (
                        <div>
                            <button
                                onClick={() => {handleAskAI_Debate('bTask1'); setChatMessages([])}}
                                disabled={isAiLoading && activeChatTaskKey === 'bTask1'}
                                className="mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                            >
                                {t.discussAiBtn || 'Discuss with AI'}
                            </button>
                        </div>
                    )}
                    {currentErrors['bTask1'] && <p className="text-red-500 mt-2">{currentErrors['bTask1']}</p>}
                    {activeChatTaskKey === 'bTask1' && (
                        <div className="mt-4">
                            <AiChatWindow
                                messages={chatMessages}
                                isLoading={isAiLoading}
                                onSendMessage={(message) => handleAskAI_Debate('bTask1', message)}
                            />
                            <button
                                onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, ['bTask1']: null})); }}
                                className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                {t.closeAiChat || 'Close AI Chat'}
                            </button>
                        </div>
                    )}
                </TaskCard>

                <TaskCard title={t.debatingBTask2Title} description={t.debatingBTask2Desc}>
                    <p className="font-medium mb-2">{t.topicsLabel}</p>
                    <ul className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                       {beginnerTasks.twoSides.topics.map(topicKey => <li key={topicKey}>{t[topicKey]}</li>)}
                    </ul>
                </TaskCard>
                <ProblemSolutionTask
                    taskData={beginnerTasks.problemSolution}
                    t={t}
                    color="indigo"
                    taskKey="bTask3"
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                    onSubmit={() => handleSubmit('bTask3')}
                    disabled={isAiLoading}
                    feedbackMessage={saveFeedback['bTask3']}
                >
                    {/* AI Interaction UI for bTask3, to be passed as children */}
                    {showAiButtons['bTask3'] && !currentErrors['bTask3'] && (
                        <div> {/* Wrapper for Discuss with AI button */}
                            <button
                                onClick={() => {handleAskAI_Debate('bTask3'); setChatMessages([])}}
                                disabled={isAiLoading && activeChatTaskKey === 'bTask3'}
                                className="mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                            >
                                {t.discussAiBtn || 'Discuss with AI'}
                            </button>
                        </div>
                    )}
                    {currentErrors['bTask3'] && <p className="text-red-500 mt-2 text-sm">{currentErrors['bTask3']}</p>}
                    {activeChatTaskKey === 'bTask3' && (
                        <div className="mt-4">
                            <AiChatWindow
                                messages={chatMessages}
                                isLoading={isAiLoading}
                                onSendMessage={(message) => handleAskAI_Debate('bTask3', message)}
                            />
                            <button
                                onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, bTask3: null})); }}
                                className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                {t.closeAiChat || 'Close AI Chat'}
                            </button>
                        </div>
                    )}
                </ProblemSolutionTask>
            </LevelSection>

            <LevelSection title={t.intermediateLevel} colorClass="text-green-700">
                 <TaskCard title={t.debatingITask1Title} description={t.debatingITask1Desc}>
                    <p className="font-medium mb-2">{t.topicsLabel}</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                       {intermediateTasks.miniDebates.topics.map(topicKey => <li key={topicKey}>{t[topicKey]}</li>)}
                    </ul>
                </TaskCard>
                {/* Part 3: Update DebatingModule JSX for CaseStudyTask as iTask2 */}
                <TaskCard title={t.debatingITask2Title} description={t.debatingITask2Desc}>
                    <CaseStudyTask
                        taskData={intermediateTasks.caseStudy}
                        t={t}
                        taskKey="iTask2"
                        answers={answers}
                        onAnswerChange={handleAnswerChange}
                        disabled={isAiLoading}
                    />
                    <div>
                        <SubmitButton onClick={() => handleSubmit('iTask2')} color="green" disabled={isAiLoading}>
                            {t.submitBtn}
                        </SubmitButton>
                        {saveFeedback['iTask2'] && <span className="ml-3 text-sm text-green-600">{saveFeedback['iTask2']}</span>}
                    </div>
                    {showAiButtons['iTask2'] && !currentErrors['iTask2'] && (
                        <div>
                            <button
                                onClick={() => {handleAskAI_Debate('iTask2'); setChatMessages([])}}
                                disabled={isAiLoading && activeChatTaskKey === 'iTask2'}
                                className="mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                            >
                                {t.discussAiBtn || 'Discuss with AI'}
                            </button>
                        </div>
                    )}
                    {currentErrors['iTask2'] && <p className="text-red-500 mt-2">{currentErrors['iTask2']}</p>}
                    {activeChatTaskKey === 'iTask2' && (
                        <div className="mt-4">
                            <AiChatWindow
                                messages={chatMessages}
                                isLoading={isAiLoading}
                                onSendMessage={(message) => handleAskAI_Debate('iTask2', message)}
                            />
                            <button
                                onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, iTask2: null})); }}
                                className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                {t.closeAiChat || 'Close AI Chat'}
                            </button>
                        </div>
                    )}
                </TaskCard>
                <TaskCard title={t.debatingITask3Title} description={t.debatingITask3Desc}>
                    {intermediateTasks.ethicalDilemmas.dilemmas.map(dilemma => (
                         <div key={dilemma.id} className="mt-4">
                            <p className="font-medium text-sm">{t[dilemma.textKey]}</p>
                            <textarea
                                rows="3"
                                className="mt-1 w-full p-2 border rounded-md text-sm"
                                placeholder={t.yourThoughtsPlaceholder}
                                value={answers.iTask3?.[`${dilemma.id}_thoughts`] || ''}
                                onChange={(e) => handleAnswerChange('iTask3', `${dilemma.id}_thoughts`, e.target.value)}
                                disabled={isAiLoading}
                            ></textarea>
                        </div>
                    ))}
                    <div>
                        <SubmitButton onClick={() => handleSubmit('iTask3')} color="green" disabled={isAiLoading}>
                            {t.submitBtn}
                        </SubmitButton>
                        {saveFeedback['iTask3'] && <span className="ml-3 text-sm text-green-600">{saveFeedback['iTask3']}</span>}
                    </div>
                    {showAiButtons['iTask3'] && !currentErrors['iTask3'] && (
                        <div>
                            <button
                                onClick={() => {handleAskAI_Debate('iTask3'); setChatMessages([])}}
                                disabled={isAiLoading && activeChatTaskKey === 'iTask3'}
                                className="mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                            >
                                {t.discussAiBtn || 'Discuss with AI'}
                            </button>
                        </div>
                    )}
                    {currentErrors['iTask3'] && <p className="text-red-500 mt-2">{currentErrors['iTask3']}</p>}
                    {activeChatTaskKey === 'iTask3' && (
                        <div className="mt-4">
                            <AiChatWindow
                                messages={chatMessages}
                                isLoading={isAiLoading}
                                onSendMessage={(message) => handleAskAI_Debate('iTask3', message)}
                            />
                            <button
                                onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, iTask3: null})); }}
                                className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                {t.closeAiChat || 'Close AI Chat'}
                            </button>
                        </div>
                    )}
                </TaskCard>
            </LevelSection>
            
            <LevelSection title={t.advancedLevel} colorClass="text-red-700">
                <TaskCard title={t.debatingATask1Title} description={t.debatingATask1Desc}>
                     <p className="font-medium mb-2">{t.topicsLabel}</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                       {advancedTasks.parliamentaryDebate.motions.map(motionKey => <li key={motionKey}>{t[motionKey]}</li>)}
                    </ul>
                </TaskCard>
                {/* Part 3: Update DebatingModule JSX for Policy Proposal (aTask2) */}
                <TaskCard title={t.debatingATask2Title} description={t.debatingATask2Desc}>
                    <AdvancedSelectAndWriteTask
                        taskData={advancedTasks.policyProposal}
                        t={t}
                        taskKey="aTask2"
                        answers={answers}
                        onAnswerChange={handleAnswerChange}
                        disabled={isAiLoading}
                        selectItemKey="aTask2_selectedIssue"
                        textareaItemKey="aTask2_policyProposalText"
                    />
                    <div>
                        <SubmitButton onClick={() => handleSubmit('aTask2')} color="red" disabled={isAiLoading}>
                            {t.submitBtn}
                        </SubmitButton>
                        {saveFeedback['aTask2'] && <span className="ml-3 text-sm text-green-600">{saveFeedback['aTask2']}</span>}
                    </div>
                    {showAiButtons['aTask2'] && !currentErrors['aTask2'] && (
                        <div>
                            <button
                                onClick={() => {handleAskAI_Debate('aTask2'); setChatMessages([])}}
                                disabled={isAiLoading && activeChatTaskKey === 'aTask2'}
                                className="mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                            >
                                {t.discussAiBtn || 'Discuss with AI'}
                            </button>
                        </div>
                    )}
                    {currentErrors['aTask2'] && <p className="text-red-500 mt-2">{currentErrors['aTask2']}</p>}
                    {activeChatTaskKey === 'aTask2' && (
                        <div className="mt-4">
                            <AiChatWindow
                                messages={chatMessages}
                                isLoading={isAiLoading}
                                onSendMessage={(message) => handleAskAI_Debate('aTask2', message)}
                            />
                            <button
                                onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, aTask2: null})); }}
                                className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                {t.closeAiChat || 'Close AI Chat'}
                            </button>
                        </div>
                    )}
                </TaskCard>
                {/* Part 2: Update DebatingModule JSX for Controversial Debate (aTask3) */}
                <TaskCard title={t.debatingATask3Title} description={t.debatingATask3Desc}>
                    <AdvancedSelectAndWriteTask
                        taskData={advancedTasks.controversialDebate}
                        t={t}
                        taskKey="aTask3"
                        answers={answers}
                        onAnswerChange={handleAnswerChange}
                        disabled={isAiLoading}
                        selectItemKey="aTask3_selectedTopic"
                        textareaItemKey="aTask3_speechText"
                    />
                    <div>
                        <SubmitButton onClick={() => handleSubmit('aTask3')} color="red" disabled={isAiLoading}>
                            {t.submitBtn}
                        </SubmitButton>
                        {saveFeedback['aTask3'] && <span className="ml-3 text-sm text-green-600">{saveFeedback['aTask3']}</span>}
                    </div>
                    {showAiButtons['aTask3'] && !currentErrors['aTask3'] && (
                        <div>
                            <button
                                onClick={() => {handleAskAI_Debate('aTask3'); setChatMessages([])}}
                                disabled={isAiLoading && activeChatTaskKey === 'aTask3'}
                                className="mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                            >
                                {t.discussAiBtn || 'Discuss with AI'}
                            </button>
                        </div>
                    )}
                    {currentErrors['aTask3'] && <p className="text-red-500 mt-2">{currentErrors['aTask3']}</p>}
                    {activeChatTaskKey === 'aTask3' && (
                        <div className="mt-4">
                            <AiChatWindow
                                messages={chatMessages}
                                isLoading={isAiLoading}
                                onSendMessage={(message) => handleAskAI_Debate('aTask3', message)}
                            />
                            <button
                                onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); setCurrentErrors(prev => ({...prev, aTask3: null})); }}
                                className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                {t.closeAiChat || 'Close AI Chat'}
                            </button>
                        </div>
                    )}
                </TaskCard>
                <CrossCulturalComparisonTask
                    taskData={advancedTasks.crossCultural}
                    t={t}
                    color="red"
                    taskKey="aTask4"
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                    onSubmit={() => handleSubmit('aTask4')}
                    disabled={isAiLoading}
                    feedbackMessage={saveFeedback['aTask4']}
                />
            </LevelSection>
        </div>
    );
};

export default DebatingModule;
