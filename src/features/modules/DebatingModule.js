import React from 'react';

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

const AgreeDisagreeTask = ({ taskData, t, color }) => (
    <TaskCard title={t[taskData.titleKey]} description={t[taskData.descriptionKey]}>
        <div className="space-y-6">
            {taskData.statements.map(stmt => (
                <div key={stmt.id}>
                    <p className="font-medium text-sm">{t[stmt.textKey]}</p>
                    <div className="mt-2">
                        <label className="mr-4 text-sm"><input type="radio" name={stmt.id} className="mr-1"/> {t.agree}</label>
                        <label className="text-sm"><input type="radio" name={stmt.id} className="mr-1"/> {t.disagree}</label>
                    </div>
                    <textarea rows="2" className="mt-2 w-full p-2 border rounded-md text-sm" placeholder={t.explanationPlaceholder}></textarea>
                </div>
            ))}
        </div>
        <SubmitButton color={color}>{t.submitBtn}</SubmitButton>
    </TaskCard>
);

const ProblemSolutionTask = ({ taskData, t, color }) => (
    <TaskCard title={t[taskData.titleKey]} description={t[taskData.descriptionKey]}>
        <div className="space-y-4">
            {taskData.prompts.map(prompt => (
                 <div key={prompt.id}>
                    <label htmlFor={prompt.id} className="block text-sm font-medium text-gray-700">{t[prompt.labelKey]}</label>
                    <input type="text" id={prompt.id} className="mt-1 w-full border rounded p-2 text-sm" placeholder={t.yourSolutionPlaceholder} />
                </div>
            ))}
        </div>
        <SubmitButton color={color}>{t.submitBtn}</SubmitButton>
    </TaskCard>
);

const CaseStudyTask = ({ taskData, t, color }) => (
     <TaskCard title={t[taskData.titleKey]} description={t[taskData.descriptionKey]}>
        <div className="space-y-6">
            {taskData.cases.map(caseItem => (
                <div key={caseItem.id}>
                    <h4 className="font-semibold text-gray-700">{t[caseItem.titleKey]}</h4>
                    <p className="text-sm text-gray-600 my-2">{t[caseItem.descKey]}</p>
                    {caseItem.prompts.map(prompt => (
                        <div key={prompt.labelKey} className="mt-2">
                            <label className="block text-sm font-medium text-gray-700">{t[prompt.labelKey]}</label>
                            <textarea rows="3" className="mt-1 w-full p-2 border rounded-md text-sm" placeholder={t.yourThoughtsPlaceholder}></textarea>
                        </div>
                    ))}
                </div>
            ))}
        </div>
        <SubmitButton color={color}>{t.submitBtn}</SubmitButton>
     </TaskCard>
);

const AdvancedSelectAndWriteTask = ({ taskData, t, color }) => (
    <TaskCard title={t[taskData.titleKey]} description={t[taskData.descriptionKey]}>
        <label htmlFor={taskData.selectId} className="block text-sm font-medium text-gray-700">{t[taskData.selectLabelKey]}</label>
        <select id={taskData.selectId} className="mt-1 w-full border rounded p-2 text-sm">
            <option>{t.selectOptionDefault}</option>
            {taskData.options.map(opt => <option key={opt.value} value={opt.value}>{t[opt.textKey]}</option>)}
        </select>
        {taskData.prompts.map(prompt => (
            <div key={prompt.labelKey} className="mt-4">
                <label className="block text-sm font-medium text-gray-700">{t[prompt.labelKey]}</label>
                <textarea rows="8" className="mt-1 w-full border rounded p-2 text-sm" placeholder={t[prompt.placeholderKey]}></textarea>
            </div>
        ))}
        <SubmitButton color={color}>{t.submitBtn}</SubmitButton>
    </TaskCard>
);
const CrossCulturalComparisonTask = ({ taskData, t, color }) => (
     <TaskCard title={t[taskData.titleKey]} description={t[taskData.descriptionKey]}>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">{t.chooseIssueToCompare}</label>
                <select className="mt-1 w-full border rounded p-2 text-sm">
                    <option>{t.selectOptionDefault}</option>
                    {taskData.options.map(opt => <option key={opt.value} value={opt.value}>{t[opt.textKey]}</option>)}
                </select>
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700">{t.countryToCompare}</label>
                <input type="text" className="mt-1 w-full border rounded p-2 text-sm" placeholder={t.countryToComparePlaceholder} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">{t.yourFindingsAndAnalysis}</label>
                <textarea rows="8" className="mt-1 w-full border rounded p-2 text-sm" placeholder={t.yourAnalysisPlaceholder}></textarea>
            </div>
        </div>
        <SubmitButton color={color}>{t.submitBtn}</SubmitButton>
     </TaskCard>
);

// --- Main Module Component ---
const DebatingModule = () => {
    const language = localStorage.getItem('logiclingua-lang') || 'ru';

    const t = {
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
                <AgreeDisagreeTask taskData={beginnerTasks.agreeDisagree} t={t} color="indigo" />
                <TaskCard title={t.debatingBTask2Title} description={t.debatingBTask2Desc}>
                    <p className="font-medium mb-2">{t.topicsLabel}</p>
                    <ul className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                       {beginnerTasks.twoSides.topics.map(topicKey => <li key={topicKey}>{t[topicKey]}</li>)}
                    </ul>
                </TaskCard>
                <ProblemSolutionTask taskData={beginnerTasks.problemSolution} t={t} color="indigo" />
            </LevelSection>

            <LevelSection title={t.intermediateLevel} colorClass="text-green-700">
                 <TaskCard title={t.debatingITask1Title} description={t.debatingITask1Desc}>
                    <p className="font-medium mb-2">{t.topicsLabel}</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                       {intermediateTasks.miniDebates.topics.map(topicKey => <li key={topicKey}>{t[topicKey]}</li>)}
                    </ul>
                </TaskCard>
                <CaseStudyTask taskData={intermediateTasks.caseStudy} t={t} color="green" />
                <TaskCard title={t.debatingITask3Title} description={t.debatingITask3Desc}>
                    {intermediateTasks.ethicalDilemmas.dilemmas.map(dilemma => (
                         <div key={dilemma.id} className="mt-4">
                            <p className="font-medium text-sm">{t[dilemma.textKey]}</p>
                            <textarea rows="3" className="mt-1 w-full p-2 border rounded-md text-sm" placeholder={t.yourThoughtsPlaceholder}></textarea>
                        </div>
                    ))}
                     <SubmitButton color="green">{t.submitBtn}</SubmitButton>
                </TaskCard>
            </LevelSection>
            
            <LevelSection title={t.advancedLevel} colorClass="text-red-700">
                <TaskCard title={t.debatingATask1Title} description={t.debatingATask1Desc}>
                     <p className="font-medium mb-2">{t.topicsLabel}</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                       {advancedTasks.parliamentaryDebate.motions.map(motionKey => <li key={motionKey}>{t[motionKey]}</li>)}
                    </ul>
                </TaskCard>
                <AdvancedSelectAndWriteTask taskData={advancedTasks.policyProposal} t={t} color="red" />
                <AdvancedSelectAndWriteTask taskData={advancedTasks.controversialDebate} t={t} color="red" />
                <CrossCulturalComparisonTask taskData={advancedTasks.crossCultural} t={t} color="red" />
            </LevelSection>
        </div>
    );
};

export default DebatingModule;
