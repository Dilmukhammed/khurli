import React, { useState, useEffect, useCallback } from 'react';

// --- Translations Object ---
// This contains all the text content for both Russian and English.
const translations = {
    ru: {
        pageTitle: "Logiclingua - Анализ культурных пословиц",
        navModules: "Анализ культурных пословиц",
        navAllModules: "Все модули",
        navAccount: "Личный кабинет",
        navLogin: "Войти",
        mainTitle: "Анализ культурных пословиц",
        beginnerLevel: "Начальный уровень",
        intermediateLevel: "Средний уровень",
        advancedLevel: "Продвинутый уровень",
        beginnerTask1Title: "1. Сопоставление узбекских и английских пословиц",
        beginnerTask1Desc: "Сопоставьте каждую узбекскую пословицу с её ближайшим английским эквивалентом, выбрав букву из списка.",
        tableUzbekProverb: "Узбекская пословица",
        tableEnglishProverb: "Английская пословица",
        tableMatchSelect: "Выберите соответствие",
        selectOptionDefault: "Выберите...",
        checkAnswersBtn: "Проверить ответы",
        askAiBtn: "Спросить ИИ",
        allCorrectMessage: "Все ответы верны!",
        someIncorrectMessage: "Некоторые ответы неверны. Проверьте выделенные.",
        submissionReceived: "Ваши ответы были отправлены.",
        beginnerTask2Title: "2. Выберите лучшее значение",
        beginnerTask2Desc: "Прочтите пословицу и выберите правильное значение.",
        beginnerTask2Q1A: "a) Друг хорош только тогда, когда дарит подарки.",
        beginnerTask2Q1B: "b) Настоящий друг — это тот, кто помогает тебе в беде.",
        beginnerTask2Q1C: "c) Нужно дружить только с богатыми людьми.",
        beginnerTask2Q2A: "a) Тяжелый труд приносит успех.",
        beginnerTask2Q2B: "b) Людям не следует слишком много работать.",
        beginnerTask2Q2C: "c) Счастье приходит от безделья.",
        beginnerTask2Q3A: "a) Золото лучше терпения.",
        beginnerTask2Q3B: "b) Быть терпеливым очень ценно.",
        beginnerTask2Q3C: "c) Люди, у которых есть золото, самые счастливые.",
        beginnerTask3Title: "3. Заполните пропущенное слово",
        beginnerTask3Desc: "Завершите пословицу, используя правильное слово.",
        beginnerTask4Title: "4. Personal Reflection – Sentence Completion",
        beginnerTask4Desc: "Complete the sentences with your own ideas.",
        beginnerTask5Title: "5. Ролевая игра с пословицами",
        beginnerTask5Desc: "Работайте в парах. Один студент описывает проблему, а другой отвечает пословицей, дающей совет.",
        beginnerTask5Example: "Пример:<br>Студент А: \"Я провалил тест по английскому. Я больше не хочу учиться.\"<br>Студент Б: \"Без труда не вытащишь и рыбку из пруда (No pain, no gain). Если будешь усердно работать, ты станешь лучше!\"",
        beginnerTask5Situations: "Другие ситуации:",
        beginnerTask5Sit1: "Студент нервничает из-за разговора на английском.",
        beginnerTask5Sit2: "Человек хочет разбогатеть, но не хочет работать.",
        beginnerTask5Sit3: "Кто-то злится и хочет принять быстрое решение.",
        beginnerTask5Sit4: "Человек что-то потерял, но все еще надеется найти.",
        beginnerTask5Sit5: "Друг забыл подготовиться к важному экзамену.",
        intermediateTask1Title: "1. Сопоставление пословиц с ситуациями",
        intermediateTask1Desc: "Сопоставьте каждую пословицу с наилучшей ситуацией, выбрав букву из списка.",
        tableProverb: "Пословица",
        tableSituation: "Ситуация",
        intermediateTask1SitA: "a) Вы усердно учите английский, хотя это трудно",
        intermediateTask1SitB: "b) Вы упустили возможность, потому что слишком медленно решали",
        intermediateTask1SitC: "c) Вы думали, что смена работы будет лучше, но новая работа оказалась хуже",
        intermediateTask1SitD: "d) Ваш лучший друг помог вам, когда у вас были финансовые проблемы.",
        intermediateTask1SitE: "e) Вы покупаете машину и спрашиваете мнения многих людей, прежде чем принять решение.",
        intermediateTask2Title: "2. Объясните пословицу своими словами",
        intermediateTask2Desc: "Прочтите пословицы и напишите, что, по вашему мнению, они означают.",
        whatDoesItMean: "Что это значит?",
        whyIsImportant: "Почему это важно?",
        whatLesson: "Какой урок это преподает?",
        intermediateTask3Title: "3. Сравните узбекские и английские пословицы",
        intermediateTask3Desc: "Прочтите узбекские пословицы и найдите английскую пословицу с похожим значением. Затем объясните, есть ли культурное различие.",
        tableEnglishEquivalent: "Английский эквивалент",
        tableCulturalDifference: "Культурное различие (Объяснение)",
        intermediateTask3Diff1: "Дружба в Узбекистане часто очень крепкая, и люди помогают даже дальним родственникам. В западных культурах дружба может быть более независимой.",
        intermediateTask3Eng2: "Не тот счастлив, кто нашел золото, а тот, кто нашел друга",
        intermediateTask3Eng3: "Знание ценнее золота",
        intermediateTask4Title: "4. Дебаты: Согласны или не согласны?",
        intermediateTask4Desc: "Прочтите пословицы. Вы согласны или не согласны? Объясните почему (минимум два предложения).",
        agree: "Согласен",
        disagree: "Не согласен",
        intermediateTask5Title: "5. Применение в реальной жизни – Написание истории",
        intermediateTask5Desc: "Выберите одну из пословиц ниже и напишите короткую личную историю (5–7 предложений), где эта пословица оказалась верной в вашей жизни.",
        chooseOneProverb: "Выберите одну пословицу:",
        intermediateTask5Prov1: "\"Mehnat qilmagan – rohat topmas.\" (Без труда не вытащишь и рыбку из пруда.)",
        intermediateTask5Prov2: "\"Ko‘p bilan maslahat qil, lekin o‘zing qaror qil.\" (Слушай советы многих, но решай сам.)",
        intermediateTask5Prov3: "\"Daryodan o‘tib, eshakni urma.\" (Перейдя реку, не бей осла.)",
        advancedTask1Title: "1. Проанализируйте более глубокий смысл",
        advancedTask1Desc: "Выберите одну пословицу и проанализируйте ее, используя следующие вопросы:",
        advancedTask1Q1: "Каково буквальное значение пословицы?",
        advancedTask1Q2: "Каков скрытый смысл пословицы?",
        advancedTask1Q3: "Применима ли эта пословица к современной жизни? Приведите пример.",
        advancedTask1Q4: "Согласны ли вы с этой пословицей? Почему?",
        chooseOne: "Выберите одну:",
        advancedTask1Option1: "1. \"Aql bilan ish ko‘rmagan – oxirida pushaymon bo‘lur.\" (Тот, кто не действует с мудростью, в конце пожалеет.)",
        advancedTask1Option2: "2. \"Yaxshi so‘z – jon ozig‘i.\" (Доброе слово – пища для души.)",
        advancedTask1Option3: "3. \"Arslonning iniga bosh suqqan – jonidan umid uzgan.\" (Тот, кто сует голову в логово льва, уже распрощался с жизнью.)",
        advancedTask2Title: "2. Культурное размышление: узбекские пословицы против других культур",
        advancedTask2Desc: "Выберите одну узбекскую пословицу и сравните ее с похожей поговоркой из другой культуры. Найдите пословицу из английского, русского или другого языка с похожим значением. Сравните, как ценности обеих культур отражены в пословицах.",
        advancedTask2Example: "Пример:<br>Узбекская пословица: \"Mehnat qilmagan – rohat topmas.\" (Без труда нет и плода.)<br>Английский эквивалент: \"Hard work pays off.\" (Тяжелый труд окупается.)<br>Анализ: В узбекской культуре эта пословица часто используется в контексте сельского хозяйства и торговли, где физический труд ведет к успеху. В англоязычных странах она больше связана с образованием и карьерным ростом.",
        advancedTask2Option1: "1. \"Til – odamning ko‘zgusi.\" (Язык – зеркало человека.)",
        advancedTask2Option2: "2. \"O‘tin yondirmasang, kul bo‘lmaydi.\" (Если не жечь дрова, золы не будет.)",
        advancedTask2Option3: "3. \"Bir bolaga yetti mahalla ota-ona.\" (У ребенка семь махаллей – родители.)",
        similarProverbLabel: "Похожая пословица (другая культура):",
        analysisLabel: "Ваш анализ:",
        advancedTask3Title: "3. Дебаты: всегда ли пословицы правдивы?",
        advancedTask3Desc: "Прочитайте следующие пословицы и приведите доводы за или против них. Приведите примеры, подтверждающие ваши доводы (минимум три сильных аргумента).",
        advancedTask3Prov1Quote: "Слушай советы многих, но решай сам.",
        advancedTask3Prov1Agree: "Согласен: Множество мнений ведет к лучшим решениям.",
        advancedTask3Prov1Disagree: "Не согласен: Слишком много советов может вызвать путаницу и нерешительность.",
        advancedTask3Prov2Quote: "Счастье не в деньгах.",
        advancedTask3Prov2Agree: "Согласен: Многие счастливые люди имеют мало денег.",
        advancedTask3Prov2Disagree: "Не согласен: Финансовая стабильность улучшает благосостояние.",
        advancedTask3Prov3Quote: "Из огня да в полымя.",
        advancedTask3Prov3Agree: "Согласен: Иногда попытка решить проблему усугубляет ситуацию.",
        advancedTask3Prov3Disagree: "Не согласен: Перемены всегда приносят новые возможности.",
        advancedTask4Title: "4. Пословицы в литературе и СМИ",
        advancedTask4Desc: "Найдите роман, фильм или историческое событие, где можно применить послание узбекской пословицы.",
        advancedTask4Example: "Пример:<br>Пословица: \"Mehnat qilmagan – rohat topmas.\" (Без труда нет и плода.)<br>Фильм: \"В погоне за счастьем\" (2006) – Главный герой усердно работает, несмотря на трудности, чтобы достичь своей цели.<br>Анализ: Этот фильм показывает, что решимость и усилия ведут к успеху.",
        advancedTask4Option1: "1. \"Bir bolaga yetti mahalla ota-ona.\" (У ребенка семь махаллей – родители.)",
        advancedTask4Option2: "2. \"Arslonning iniga bosh suqqan – jonidan umid uzgan.\" (Тот, кто сует голову в логово льва, уже распрощался с жизнью.)",
        advancedTask4Option3: "3. \"Yaxshi do‘st – qiyin kunda bilinadi.\" (Настоящий друг познается в беде.)",
        mediaTitleLabel: "Название романа/фильма/события:",
        advancedTask5Title: "5. Написание формального эссе с использованием пословиц",
        advancedTask5Desc: "Напишите эссе на 300 слов на одну из следующих тем, включив в свои рассуждения как минимум две пословицы.",
        chooseTopic: "Выберите тему:",
        advancedTask5Topic1: "1. Роль усердного труда в достижении успеха (Используйте \"Mehnat qilmagan – rohat topmas.\")",
        advancedTask5Topic2: "2. Важность дружбы и сообщества (Используйте \"Yaxshi do‘st – qiyin kunda bilinadi.\")",
        advancedTask5Topic3: "3. Принятие решений и мудрость (Используйте \"Ko‘p bilan maslahat qil, lekin o‘zing qaror qil.\")",
        submitBtn: "Отправить",
        footerRights: "&copy; 2025 Logiclingua. Все права защищены.",
        footerPrivacy: "Политика конфиденциальности",
        footerTerms: "Условия использования",
    },
    en: {
        pageTitle: "Logiclingua - Learning Modules",
        navModules: "Learning Modules",
        navAllModules: "All Modules",
        navAccount: "Personal Account",
        navLogin: "Login",
        mainTitle: "Learning Modules",
        proverbsTitle: "Analyzing Cultural Proverbs",
        beginnerLevel: "Beginner Level",
        intermediateLevel: "Intermediate Level",
        advancedLevel: "Advanced Level",
        beginnerTask1Title: "1. Matching Uzbek and English Proverbs",
        beginnerTask1Desc: "Match each Uzbek proverb with its closest English equivalent by selecting a letter from the list.",
        tableUzbekProverb: "Uzbek Proverb",
        tableEnglishProverb: "English proverb",
        tableMatchSelect: "Select Match",
        selectOptionDefault: "Select...",
        checkAnswersBtn: "Check Answers",
        askAiBtn: "Ask AI",
        allCorrectMessage: "All answers are correct!",
        someIncorrectMessage: "Some answers are incorrect. Check the highlighted ones.",
        submissionReceived: "Your answers have been submitted.",
        beginnerTask2Title: "2. Choose the Best Meaning",
        beginnerTask2Desc: "Read the proverb and choose the correct meaning.",
        beginnerTask2Q1A: "a) A friend is only good when they give you gifts.",
        beginnerTask2Q1B: "b) A real friend is someone who helps you when you are in trouble.",
        beginnerTask2Q1C: "c) You should only be friends with rich people.",
        beginnerTask2Q2A: "a) Hard work brings success.",
        beginnerTask2Q2B: "b) People should not work too much.",
        beginnerTask2Q2C: "c) Happiness comes from doing nothing.",
        beginnerTask2Q3A: "a) Gold is better than patience.",
        beginnerTask2Q3B: "b) Being patient is very valuable.",
        beginnerTask2Q3C: "c) People who have gold are the happiest.",
        beginnerTask3Title: "3. Fill in the Missing Word",
        beginnerTask3Desc: "Complete the proverb using the correct word.",
        beginnerTask4Title: "4. Personal Reflection – Sentence Completion",
        beginnerTask4Desc: "Complete the sentences with your own ideas.",
        beginnerTask5Title: "5. Role-Playing Proverbs",
        beginnerTask5Desc: "Work in pairs. One student gives a problem, and the other student responds with a proverb that gives advice.",
        beginnerTask5Example: "Example:<br>Student A: \"I failed my English test. I don’t want to study anymore.\"<br>Student B: \"No pain, no gain. If you work hard, you will improve!\"",
        beginnerTask5Situations: "Other Situations:",
        beginnerTask5Sit1: "A student is nervous about speaking English.",
        beginnerTask5Sit2: "A person wants to become rich but doesn’t want to work.",
        beginnerTask5Sit3: "Someone is angry and wants to make a quick decision.",
        beginnerTask5Sit4: "A person lost something but still hopes to find it.",
        beginnerTask5Sit5: "A friend forgot to prepare for an important exam.",
        intermediateTask1Title: "1. Matching Proverbs with Situations",
        intermediateTask1Desc: "Match each proverb with the best situation by selecting a letter from the list.",
        tableProverb: "Proverb",
        tableSituation: "Situation",
        intermediateTask1SitA: "a) You are working hard to learn English, even though it is difficult",
        intermediateTask1SitB: "b) You missed an opportunity because you were too slow to decide",
        intermediateTask1SitC: "c) You thought changing jobs would be better but your new job is worse",
        intermediateTask1SitD: "d) Your best friend helped you when you had financial problems.",
        intermediateTask1SitE: "e) You are buying a car and asking many people for their opinions before deciding.",
        intermediateTask2Title: "2. Explain the Proverb in Your Own Words",
        intermediateTask2Desc: "Read the proverbs and write what you think they mean.",
        whatDoesItMean: "What does it mean?",
        whyIsImportant: "Why is this important?",
        whatLesson: "What lesson does this teach?",
        intermediateTask3Title: "3. Compare Uzbek and English Proverbs",
        intermediateTask3Desc: "Read the Uzbek proverbs and find an English proverb with a similar meaning. Then, explain if there is a cultural difference.",
        tableEnglishEquivalent: "English Equivalent",
        tableCulturalDifference: "Cultural Difference (Explanation)",
        intermediateTask3Diff1: "Friendship in Uzbekistan is often very strong, and people help even distant relatives. In western cultures, friendships can be more independent",
        intermediateTask3Eng2: "Not the one who finds gold is lucky, but the one who finds a friend",
        intermediateTask3Eng3: "Knowledge is more valuable than gold",
        intermediateTask4Title: "4. Debate: Do You Agree or Disagree?",
        intermediateTask4Desc: "Read the proverbs. Do you agree or disagree? Explain why (at least two sentences).",
        agree: "Agree",
        disagree: "Disagree",
        intermediateTask5Title: "5. Real-Life Application – Story Writing",
        intermediateTask5Desc: "Choose one of the proverbs below and write a short personal story (5–7 sentences) where this proverb was true in your life.",
        chooseOneProverb: "Choose one proverb:",
        intermediateTask5Prov1: "\"Mehnat qilmagan – rohat topmas.\" (No pain, no gain.)",
        intermediateTask5Prov2: "\"Ko‘p bilan maslahat qil, lekin o‘zing qaror qil.\" (Take advice from many, but make your own decision.)",
        intermediateTask5Prov3: "\"Daryodan o‘tib, eshakni urma.\" (Don’t beat the donkey after crossing the river.)",
        advancedTask1Title: "1. Analyze the Deeper Meaning",
        advancedTask1Desc: "Choose one proverb and analyze it using the following questions:",
        advancedTask1Q1: "What is the literal meaning of the proverb?",
        advancedTask1Q2: "What is the hidden message behind the proverb?",
        advancedTask1Q3: "Can this proverb be applied to modern life? Give an example.",
        advancedTask1Q4: "Do you agree or disagree with this proverb? Why?",
        chooseOne: "Choose one:",
        advancedTask1Option1: "1. \"He who does not act with wisdom will regret it in the end.\" (Aql bilan ish ko‘rmagan – oxirida pushaymon bo‘lur.)",
        advancedTask1Option2: "2. \"A kind word is food for the soul.\" (Yaxshi so‘z – jon ozig‘i.)",
        advancedTask1Option3: "3. \"One who sticks his head into a lion’s den has already given up on his life.\" (Arslonning iniga bosh suqqan – jonidan umid uzgan.)",
        advancedTask2Title: "2. Cultural Reflection: Uzbek Proverbs vs. Other Cultures",
        advancedTask2Desc: "Choose one Uzbek proverb and compare it to a similar saying from another culture. Find a proverb from English, Russian, or another language that has a similar meaning. Compare how the values in both cultures are reflected in the proverbs.",
        advancedTask2Example: "Example:<br>Uzbek Proverb: \"Mehnat qilmagan – rohat topmas.\" (No pain, no gain.)<br>English Equivalent: \"Hard work pays off.\"<br>Analysis: In Uzbek culture, this proverb is often used in the context of agriculture and trade, where physical labor leads to success. In English-speaking countries, it is more connected to education and career growth.",
        advancedTask2Option1: "1. \"Language is a person’s mirror.\" (Til – odamning ko‘zgusi.)",
        advancedTask2Option2: "2. \"If you don’t burn wood, there will be no ash.\" (O‘tin yondirmasang, kul bo‘lmaydi.)",
        advancedTask2Option3: "3. \"A child has seven neighborhoods as parents.\" (Bir bolaga yetti mahalla ota-ona.)",
        similarProverbLabel: "Similar proverb (other culture):",
        analysisLabel: "Your analysis:",
        advancedTask3Title: "3. Debate: Are Proverbs Always True?",
        advancedTask3Desc: "Read the following proverbs and argue for or against them. Provide examples to support your arguments (at least three strong arguments).",
        advancedTask3Prov1Quote: "Take advice from many, but make your own decision.",
        advancedTask3Prov1Agree: "Agree: Listening to multiple opinions leads to better choices.",
        advancedTask3Prov1Disagree: "Disagree: Too much advice can cause confusion and hesitation.",
        advancedTask3Prov2Quote: "Happiness is not in money.",
        advancedTask3Prov2Agree: "Agree: Many happy people have little money.",
        advancedTask3Prov2Disagree: "Disagree: Financial stability improves well-being.",
        advancedTask3Prov3Quote: "Out of the frying pan, into the fire.",
        advancedTask3Prov3Agree: "Agree: Sometimes trying to solve a problem makes things worse.",
        advancedTask3Prov3Disagree: "Disagree: Change always brings new opportunities.",
        advancedTask4Title: "4. Proverbs in Literature and Media",
        advancedTask4Desc: "Find a novel, movie, or historical event where the message of an Uzbek proverb can be applied.",
        advancedTask4Example: "Example:<br>Proverb: \"Mehnat qilmagan – rohat topmas.\" (No pain, no gain.)<br>Movie: The Pursuit of Happyness (2006) – The protagonist works hard despite hardships to achieve his goal.<br>Analysis: This film shows that determination and effort lead to success.",
        advancedTask4Option1: "1. \"A child has seven neighborhoods as parents.\" (Bir bolaga yetti mahalla ota-ona.)",
        advancedTask4Option2: "2. \"One who sticks his head into a lion’s den has already given up on his life.\" (Arslonning iniga bosh suqqan – jonidan umid uzgan.)",
        advancedTask4Option3: "3. \"A friend in need is a friend indeed.\" (Yaxshi do‘st – qiyin kunda bilinadi.)",
        mediaTitleLabel: "Title of novel/movie/event:",
        advancedTask5Title: "5. Writing a Formal Essay Using Proverbs",
        advancedTask5Desc: "Write a 300-word essay on one of the following topics, incorporating at least two proverbs into your argument.",
        chooseTopic: "Choose a topic:",
        advancedTask5Topic1: "1. The Role of Hard Work in Achieving Success (Use \"Mehnat qilmagan – rohat topmas.\")",
        advancedTask5Topic2: "2. The Importance of Friendship and Community (Use \"Yaxshi do‘st – qiyin kunda bilinadi.\")",
        advancedTask5Topic3: "3. Decision-Making and Wisdom (Use \"Ko‘p bilan maslahat qil, lekin o‘zing qaror qil.\")",
        submitBtn: "Submit",
        footerRights: "&copy; 2025 Logiclingua. All rights reserved.",
        footerPrivacy: "Privacy Policy",
        footerTerms: "Terms of Use",
    }
};

// --- CSS Styles ---
const GlobalStyles = () => (
    <style>{`
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6; /* bg-gray-100 */
            color: #1f2937; /* text-gray-800 */
        }
        .task-card {
            transition: box-shadow 0.3s ease;
        }
        .task-card:hover {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        #language-selector {
            appearance: none;
            background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
            background-repeat: no-repeat;
            background-position: right 0.5rem center;
            background-size: 0.65em auto;
            padding-right: 2rem;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
            table-layout: fixed;
        }
        th, td {
            border: 1px solid #e5e7eb;
            padding: 0.75rem;
            text-align: left;
            vertical-align: top;
            word-wrap: break-word;
        }
        th {
            background-color: #f3f4f6;
            font-weight: 600;
        }
        td select, .task-card select {
           min-width: 100px;
           padding: 0.5rem;
           border-radius: 0.375rem;
           border: 1px solid #d1d5db;
           background-color: #fff;
        }
        .choice-button {
            display: block;
            width: 100%;
            text-align: left;
            padding: 0.75rem 1rem;
            margin-bottom: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            background-color: #ffffff;
            cursor: pointer;
            transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .choice-button:hover {
            background-color: #f9fafb;
            border-color: #9ca3af;
        }
        .choice-button.selected {
             background-color: #e0e7ff;
             border-color: #a5b4fc;
             font-weight: 500;
        }
        .choice-button.correct-answer, .correct-answer {
             border-color: #16a34a !important;
             background-color: #d1fae5 !important;
        }
        .choice-button.incorrect-answer, .incorrect-answer {
             border-color: #dc2626 !important;
             background-color: #fee2e2 !important;
         }
        .radio-label {
            display: inline-flex;
            align-items: center;
            margin-right: 1rem;
            cursor: pointer;
            padding: 0.5rem 0;
        }
        .radio-input {
            margin-right: 0.5rem;
        }
        .level-section {
            margin-bottom: 3rem;
            padding: 1.5rem;
            background-color: #ffffff;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
        .result-message {
            margin-top: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
        }
        .result-message.correct {
            color: #16a34a;
        }
        .result-message.incorrect, .result-message.submitted {
            color: #1d4ed8; /* blue-700 for submitted */
        }
        .result-message.incorrect {
             color: #dc2626;
        }
        textarea {
            resize: vertical;
        }
    `}</style>
);


// --- Main App Component ---
const CulturalProverbsModule = () => {
    // --- State Management ---
    const [language, setLanguage] = useState('ru');
    const [answers, setAnswers] = useState({});
    const [validation, setValidation] = useState({});
    const [results, setResults] = useState({});
    const [showAiButtons, setShowAiButtons] = useState({});

    // --- Language Translation Logic ---
    useEffect(() => {
        const storedLang = localStorage.getItem('logiclingua-lang') || 'ru';
        setLanguage(storedLang);
        document.documentElement.lang = storedLang;
        document.title = translations[storedLang].pageTitle;
    }, []);

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        localStorage.setItem('logiclingua-lang', newLang);
        document.documentElement.lang = newLang;
        document.title = translations[newLang].pageTitle;
    };

    const t = useCallback((key) => {
        // Fallback logic to prevent crash if a key is missing in one language
        return translations[language]?.[key] || translations['en'][key] || key;
    }, [language]);

    // --- Helper function for dynamic class names ---
    const getValidationClass = (taskKey, itemKey) => {
        const status = validation[taskKey]?.[itemKey];
        if (status === 'correct') return 'correct-answer';
        if (status === 'incorrect') return 'incorrect-answer';
        return '';
    };

    const getChoiceButtonClass = (taskKey, questionKey, choiceValue) => {
        const baseClass = "choice-button";
        const isSelected = answers[taskKey]?.[questionKey] === choiceValue;
        const validationStatus = validation[taskKey]?.[questionKey];
        
        let classes = [baseClass];
        if (isSelected) classes.push('selected');
        if (isSelected && validationStatus === 'correct') classes.push('correct-answer');
        if (isSelected && validationStatus === 'incorrect') classes.push('incorrect-answer');
        
        return classes.join(' ');
    };
    
    // --- Generic Answer Handling ---
    const handleAnswerChange = (taskKey, itemKey, value) => {
        setAnswers(prev => ({
            ...prev,
            [taskKey]: {
                ...prev[taskKey],
                [itemKey]: value
            }
        }));
        // Reset results and AI button for the task when an answer changes
        setResults(prev => {
            const newResults = {...prev};
            delete newResults[taskKey];
            return newResults;
        });
        setShowAiButtons(prev => ({ ...prev, [taskKey]: false }));
    };

    // --- Generic "Submit" handler for open-ended questions ---
    const handleSubmit = (taskKey) => {
         setResults(prev => ({
            ...prev,
            [taskKey]: { type: 'submitted', message: t('submissionReceived') }
        }));
    };

    // --- Task Checking Logic ---
    const checkAnswers = (taskKey, correctAnswers) => {
        const userAnswers = answers[taskKey] || {};
        let newValidation = {};
        let allCorrect = true;
        let anyAnswered = false;

        Object.keys(correctAnswers).forEach(key => {
            if (userAnswers[key] !== undefined && userAnswers[key] !== '') {
                anyAnswered = true;
                if (String(userAnswers[key]).trim().toLowerCase() === String(correctAnswers[key])) {
                    newValidation[key] = 'correct';
                } else {
                    newValidation[key] = 'incorrect';
                    allCorrect = false;
                }
            } else {
                allCorrect = false;
            }
        });

        setValidation(prev => ({ ...prev, [taskKey]: newValidation }));

        if (!anyAnswered) return;

        if (allCorrect) {
            setResults(prev => ({ ...prev, [taskKey]: { type: 'correct', message: t('allCorrectMessage') } }));
            setShowAiButtons(prev => ({ ...prev, [taskKey]: false }));
        } else {
            setResults(prev => ({ ...prev, [taskKey]: { type: 'incorrect', message: t('someIncorrectMessage') } }));
            setShowAiButtons(prev => ({ ...prev, [taskKey]: true }));
        }
    };

    // --- Specific Task Checkers ---
    const checkBeginnerTask1 = () => checkAnswers('beginnerTask1', { q1: 'a', q2: 'b', q3: 'c', q4: 'd', q5: 'e' });
    const checkBeginnerTask2 = () => checkAnswers('beginnerTask2', { q1: 'b', q2: 'a', q3: 'b' });
    const checkBeginnerTask3 = () => checkAnswers('beginnerTask3', { q1: 'indeed', q2: 'gain', q3: 'fire', q4: 'nest', q5: 'virtue' });
    const checkIntermediateTask1 = () => checkAnswers('intermediateTask1', { q1: 'd', q2: 'a', q3: 'c', q4: 'e', q5: 'b' });

    
    const handleAskAI = (taskTitleKey) => {
        const taskTitle = t(taskTitleKey);
        const message = language === 'ru'
            ? `Функция "Спросить ИИ" для задания "${taskTitle}" еще не реализована.`
            : `The "Ask AI" feature for the task "${taskTitle}" is not yet implemented.`;
        alert(message);
    };


    // --- JSX Render ---
    return (
        <React.Fragment>
            <GlobalStyles />
            <div className="bg-gray-100 text-gray-800">
                <main className="container mx-auto px-6 py-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{t('mainTitle')}</h1>

                    <section className="mb-12">
                        {/* ======================================= */}
                        {/* =========== BEGINNER LEVEL ============ */}
                        {/* ======================================= */}
                        <div className="level-section">
                            <h3 className="text-xl font-bold text-indigo-700 mb-4">{t('beginnerLevel')}</h3>
                            
                            {/* Task 1 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('beginnerTask1Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('beginnerTask1Desc')}</p>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{t('tableUzbekProverb')}</th>
                                            <th>{t('tableEnglishProverb')}</th>
                                            <th>{t('tableMatchSelect')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { key: 'q1', uz: "1. Yaxshi do'st - qiyin kunda bilinadi", en: "a) A friend in need is a friend indeed"},
                                            { key: 'q2', uz: "2. Sabrlik - oltin", en: "b) Patience is a virtue"},
                                            { key: 'q3', uz: "3. Mehnat qilmagan - rohat topmas", en: "c) No pain - no gain"},
                                            { key: 'q4', uz: "4. Kichik daryolar katta daryolarga qo'shiladi", en: "d) Little by little, the bird builds its nest"},
                                            { key: 'q5', uz: "5. Yomg'irdan qochib, do'lga tutilma", en: "e) Out of the frying pan, into the fire"},
                                        ].map(item => (
                                        <tr key={item.key}>
                                            <td>{item.uz}</td>
                                            <td>{item.en}</td>
                                            <td>
                                                <select
                                                    value={answers.beginnerTask1?.[item.key] || ''}
                                                    onChange={(e) => handleAnswerChange('beginnerTask1', item.key, e.target.value)}
                                                    className={getValidationClass('beginnerTask1', item.key)}
                                                >
                                                    <option value="">{t('selectOptionDefault')}</option>
                                                    {['a', 'b', 'c', 'd', 'e'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button onClick={checkBeginnerTask1} className="check-button mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('checkAnswersBtn')}</button>
                                {results.beginnerTask1 && <div className={`result-message ${results.beginnerTask1.type}`}>{results.beginnerTask1.message}</div>}
                                {showAiButtons.beginnerTask1 && <button onClick={() => handleAskAI('beginnerTask1Title')} className="ask-ai-button mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('askAiBtn')}</button>}
                            </div>

                            {/* Task 2 */}
                             <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('beginnerTask2Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('beginnerTask2Desc')}</p>
                                {[
                                    { key: 'q1', proverb: '1. "Yaxshi do‘st – qiyin kunda bilinadi."', choices: [{val: 'a', textKey: 'beginnerTask2Q1A'}, {val: 'b', textKey: 'beginnerTask2Q1B'}, {val: 'c', textKey: 'beginnerTask2Q1C'}] },
                                    { key: 'q2', proverb: '2. "Mehnat qilmagan – rohat topmas."', choices: [{val: 'a', textKey: 'beginnerTask2Q2A'}, {val: 'b', textKey: 'beginnerTask2Q2B'}, {val: 'c', textKey: 'beginnerTask2Q2C'}] },
                                    { key: 'q3', proverb: '3. "Sabrlik – oltin."', choices: [{val: 'a', textKey: 'beginnerTask2Q3A'}, {val: 'b', textKey: 'beginnerTask2Q3B'}, {val: 'c', textKey: 'beginnerTask2Q3C'}] },
                                ].map(q => (
                                    <div key={q.key} className="mb-4">
                                        <p className="font-medium">{q.proverb}</p>
                                        {q.choices.map(choice => (
                                            <button 
                                                key={choice.val}
                                                onClick={() => handleAnswerChange('beginnerTask2', q.key, choice.val)}
                                                className={getChoiceButtonClass('beginnerTask2', q.key, choice.val)}
                                            >
                                                {t(choice.textKey)}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                                <button onClick={checkBeginnerTask2} className="check-button mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('checkAnswersBtn')}</button>
                                {results.beginnerTask2 && <div className={`result-message ${results.beginnerTask2.type}`}>{results.beginnerTask2.message}</div>}
                                {showAiButtons.beginnerTask2 && <button onClick={() => handleAskAI('beginnerTask2Title')} className="ask-ai-button mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('askAiBtn')}</button>}
                            </div>

                             {/* Task 3 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('beginnerTask3Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('beginnerTask3Desc')}</p>
                                <ol className="list-decimal list-inside space-y-2">
                                    {[
                                        { key: 'q1', text: '"A friend in need is a friend ___." (indeed, always, never)'},
                                        { key: 'q2', text: '"No pain, no ___." (gain, rain, train)'},
                                        { key: 'q3', text: '"Out of the frying pan, into the ___." (fire, ice, water)'},
                                        { key: 'q4', text: '"Little by little, the bird builds its ___." (nest, house, tree)'},
                                        { key: 'q5', text: '"Patience is a ___." (virtue, mistake, problem)'},
                                    ].map(item => (
                                    <li key={item.key}>
                                        {item.text}
                                        <input 
                                            type="text" 
                                            className={`border rounded px-2 py-1 ml-2 ${getValidationClass('beginnerTask3', item.key)}`}
                                            onChange={(e) => handleAnswerChange('beginnerTask3', item.key, e.target.value)}
                                        />
                                    </li>
                                    ))}
                                </ol>
                                <button onClick={checkBeginnerTask3} className="check-button mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('checkAnswersBtn')}</button>
                                {results.beginnerTask3 && <div className={`result-message ${results.beginnerTask3.type}`}>{results.beginnerTask3.message}</div>}
                                {showAiButtons.beginnerTask3 && <button onClick={() => handleAskAI('beginnerTask3Title')} className="ask-ai-button mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('askAiBtn')}</button>}
                            </div>

                            {/* Task 4 */}
                             <div className="mb-6 p-4 border rounded-md task-card bg-white force-english">
                                <h4 className="font-semibold mb-2">{t('beginnerTask4Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('beginnerTask4Desc')}</p>
                                <ol className="list-decimal list-inside space-y-3">
                                    <li><span>A true friend is someone who</span> <input type="text" className="border rounded px-2 py-1 ml-2 w-full md:w-3/4"/></li>
                                    <li><span>If you want to succeed in life, you should</span> <input type="text" className="border rounded px-2 py-1 ml-2 w-full md:w-3/4"/></li>
                                    <li><span>When I have a problem, I usually</span> <input type="text" className="border rounded px-2 py-1 ml-2 w-full md:w-3/4"/></li>
                                    <li><span>In Uzbekistan, people believe that patience is important because</span> <input type="text" className="border rounded px-2 py-1 ml-2 w-full md:w-3/4"/></li>
                                    <li><span>A proverb I like is</span> <input type="text" className="border rounded px-2 py-1 ml-2 w-1/2"/>, <span>because</span> <input type="text" className="border rounded px-2 py-1 ml-2 w-full md:w-3/4"/></li>
                                </ol>
                                <button onClick={() => handleSubmit('beginnerTask4')} className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('submitBtn')}</button>
                                {results.beginnerTask4 && <div className={`result-message ${results.beginnerTask4.type}`}>{results.beginnerTask4.message}</div>}
                            </div>
                            
                            {/* Task 5 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('beginnerTask5Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('beginnerTask5Desc')}</p>
                                <p className="italic text-sm text-gray-500 mb-2" dangerouslySetInnerHTML={{ __html: t('beginnerTask5Example') }} />
                                <p className="font-medium mb-2">{t('beginnerTask5Situations')}</p>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    <li>{t('beginnerTask5Sit1')}</li>
                                    <li>{t('beginnerTask5Sit2')}</li>
                                    <li>{t('beginnerTask5Sit3')}</li>
                                    <li>{t('beginnerTask5Sit4')}</li>
                                    <li>{t('beginnerTask5Sit5')}</li>
                                </ul>
                            </div>

                        </div>

                        {/* ======================================= */}
                        {/* ========= INTERMEDIATE LEVEL ========== */}
                        {/* ======================================= */}
                        <div className="level-section">
                             <h3 className="text-xl font-bold text-green-700 mb-4">{t('intermediateLevel')}</h3>

                             {/* Task 1 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('intermediateTask1Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('intermediateTask1Desc')}</p>
                                <table className="w-full border-collapse mt-4 table-fixed">
                                    <thead>
                                        <tr>
                                            <th className="border p-3 text-left bg-gray-100 font-semibold w-1/3">{t('tableProverb')}</th>
                                            <th className="border p-3 text-left bg-gray-100 font-semibold w-1/3">{t('tableSituation')}</th>
                                            <th className="border p-3 text-left bg-gray-100 font-semibold w-1/4">{t('tableMatchSelect')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { key: 'q1', proverb: "1. Yaxshi do'st - qiyin kunda bilinadi. (A friend in need is a friend indeed)", situation: t('intermediateTask1SitD') },
                                            { key: 'q2', proverb: "2. Mehnat qilmagan - rohat topmas (No pain, no gain)", situation: t('intermediateTask1SitA') },
                                            { key: 'q3', proverb: "3. Yomg'irdan qochib, do'lga tutilma. (Out of the frying pan, into the fire)", situation: t('intermediateTask1SitC') },
                                            { key: 'q4', proverb: "4. Ko'p bilan maslahat qil, lekin o'zing qaror qil. (Take advice from many, but make your own decision)", situation: t('intermediateTask1SitE') },
                                            { key: 'q5', proverb: "5. Tez harkat qilmagan, peshonasini uradi. (He who hesitates, regrets)", situation: t('intermediateTask1SitB') },
                                        ].map(item => (
                                            <tr key={item.key}>
                                                <td className="border p-3 align-top break-words">{item.proverb}</td>
                                                <td className="border p-3 align-top break-words">{item.situation}</td>
                                                <td className="border p-3 align-top">
                                                    <select
                                                        value={answers.intermediateTask1?.[item.key] || ''}
                                                        onChange={(e) => handleAnswerChange('intermediateTask1', item.key, e.target.value)}
                                                        className={`w-full p-2 rounded-md border bg-white ${getValidationClass('intermediateTask1', item.key)}`}
                                                    >
                                                        <option value="">{t('selectOptionDefault')}</option>
                                                        {['a', 'b', 'c', 'd', 'e'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button onClick={checkIntermediateTask1} className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('checkAnswersBtn')}</button>
                                {results.intermediateTask1 && <div className={`result-message ${results.intermediateTask1.type}`}>{results.intermediateTask1.message}</div>}
                                {showAiButtons.intermediateTask1 && <button onClick={() => handleAskAI('intermediateTask1Title')} className="ask-ai-button mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('askAiBtn')}</button>}
                            </div>

                            {/* Task 2 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('intermediateTask2Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('intermediateTask2Desc')}</p>
                                {[
                                    { key: 'q1', proverb: '1. "Ko‘p bilan maslahat qil, lekin o‘zing qaror qil." (Take advice from many, but make your own decision.)', label: t('whatDoesItMean') },
                                    { key: 'q2', proverb: '2. "Yaxshi so‘z – jon ozig‘i." (A kind word is food for the soul.)', label: t('whyIsImportant') },
                                    { key: 'q3', proverb: '3. "Daryodan o‘tib, eshakni urma." (Don’t beat the donkey after crossing the river.)', label: t('whatLesson') },
                                ].map(item => (
                                    <div key={item.key} className="mb-4">
                                        <p className="font-medium">{item.proverb}</p>
                                        <label className="block text-sm font-medium text-gray-700 mt-1">{item.label}</label>
                                        <textarea className="border rounded px-2 py-1 w-full h-16 mt-1" placeholder="..."></textarea>
                                    </div>
                                ))}
                                <button onClick={() => handleSubmit('intermediateTask2')} className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('submitBtn')}</button>
                                {results.intermediateTask2 && <div className={`result-message ${results.intermediateTask2.type}`}>{results.intermediateTask2.message}</div>}
                            </div>

                            {/* Task 3 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('intermediateTask3Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('intermediateTask3Desc')}</p>
                                <table className="w-full border-collapse mt-4 table-fixed">
                                    <thead>
                                        <tr>
                                            <th className="border p-3 text-left bg-gray-100 font-semibold w-1/3">{t('tableUzbekProverb')}</th>
                                            <th className="border p-3 text-left bg-gray-100 font-semibold w-1/3">{t('tableEnglishEquivalent')}</th>
                                            <th className="border p-3 text-left bg-gray-100 font-semibold w-1/3">{t('tableCulturalDifference')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border p-3 align-top break-words">1. Yaxshi do'st - qiyin kunda bilinadi.</td>
                                            <td className="border p-3 align-top break-words">A friend in need is a friend indeed</td>
                                            <td className="border p-3 align-top break-words">{t('intermediateTask3Diff1')}</td>
                                        </tr>
                                        <tr>
                                            <td className="border p-3 align-top break-words">2. Oltin topgan emas, do'st topgan baxtli.</td>
                                            <td className="border p-3 align-top break-words">{t('intermediateTask3Eng2')}</td>
                                            <td className="border p-3 align-top"><textarea className="border rounded px-2 py-1 w-full h-20" placeholder="..."></textarea></td>
                                        </tr>
                                        <tr>
                                            <td className="border p-3 align-top break-words">3. Ilm - oltindan qadrli.</td>
                                            <td className="border p-3 align-top break-words">{t('intermediateTask3Eng3')}</td>
                                            <td className="border p-3 align-top"><textarea className="border rounded px-2 py-1 w-full h-20" placeholder="..."></textarea></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button onClick={() => handleSubmit('intermediateTask3')} className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('submitBtn')}</button>
                                {results.intermediateTask3 && <div className={`result-message ${results.intermediateTask3.type}`}>{results.intermediateTask3.message}</div>}
                            </div>

                            {/* Task 4 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('intermediateTask4Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('intermediateTask4Desc')}</p>
                                {[
                                    { key: 'q1', proverb: '1. "Sabrlik – oltin." (Patience is gold.)' },
                                    { key: 'q2', proverb: '2. "Tez harakat qilmagan, peshonasini uradi." (He who hesitates, regrets.)' },
                                    { key: 'q3', proverb: '3. "Yomg‘irdan qochib, do‘lga tutilma." (Out of the frying pan, into the fire.)' },
                                ].map(q => (
                                    <div key={q.key} className="mb-4">
                                        <p className="font-medium">{q.proverb}</p>
                                        <div className="mt-1">
                                            <label className="radio-label">
                                                <input type="radio" name={`debate${q.key}`} value="agree" className="radio-input" />
                                                <span>{t('agree')}</span>
                                            </label>
                                            <label className="radio-label">
                                                <input type="radio" name={`debate${q.key}`} value="disagree" className="radio-input" />
                                                <span>{t('disagree')}</span>
                                            </label>
                                        </div>
                                        <textarea className="border rounded px-2 py-1 w-full h-16 mt-2" placeholder={language === 'ru' ? 'Объяснение...' : 'Explanation...'}></textarea>
                                    </div>
                                ))}
                                <button onClick={() => handleSubmit('intermediateTask4')} className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('submitBtn')}</button>
                                {results.intermediateTask4 && <div className={`result-message ${results.intermediateTask4.type}`}>{results.intermediateTask4.message}</div>}
                            </div>

                            {/* Task 5 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('intermediateTask5Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('intermediateTask5Desc')}</p>
                                <p className="font-medium mb-2">{t('chooseOneProverb')}</p>
                                <ul className="list-disc list-inside text-sm text-gray-600 mb-3">
                                    <li>{t('intermediateTask5Prov1')}</li>
                                    <li>{t('intermediateTask5Prov2')}</li>
                                    <li>{t('intermediateTask5Prov3')}</li>
                                </ul>
                                <textarea className="border rounded px-2 py-1 w-full h-32" placeholder={language === 'ru' ? 'Ваша история...' : 'Your story...'}></textarea>
                                <button onClick={() => handleSubmit('intermediateTask5')} className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('submitBtn')}</button>
                                {results.intermediateTask5 && <div className={`result-message ${results.intermediateTask5.type}`}>{results.intermediateTask5.message}</div>}
                            </div>

                        </div>

                        {/* ======================================= */}
                        {/* =========== ADVANCED LEVEL ============ */}
                        {/* ======================================= */}
                        <div className="level-section">
                            <h3 className="text-xl font-bold text-red-700 mb-4">{t('advancedLevel')}</h3>
                            
                            {/* Task 1 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('advancedTask1Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('advancedTask1Desc')}</p>
                                <ul className="list-disc list-inside mb-3 text-sm text-gray-600">
                                    <li>{t('advancedTask1Q1')}</li>
                                    <li>{t('advancedTask1Q2')}</li>
                                    <li>{t('advancedTask1Q3')}</li>
                                    <li>{t('advancedTask1Q4')}</li>
                                </ul>
                                <p className="font-medium mb-2">{t('chooseOne')}</p>
                                <select className="border rounded px-2 py-1 mb-3 w-full bg-white">
                                    <option value="1">{t('advancedTask1Option1')}</option>
                                    <option value="2">{t('advancedTask1Option2')}</option>
                                    <option value="3">{t('advancedTask1Option3')}</option>
                                </select>
                                <textarea className="border rounded px-2 py-1 w-full h-32 mt-1" placeholder={t('analysisLabel')}></textarea>
                                <button onClick={() => handleSubmit('advancedTask1')} className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('submitBtn')}</button>
                                {results.advancedTask1 && <div className={`result-message ${results.advancedTask1.type}`}>{results.advancedTask1.message}</div>}
                            </div>

                            {/* Task 2 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('advancedTask2Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('advancedTask2Desc')}</p>
                                <p className="italic text-sm text-gray-500 mb-2" dangerouslySetInnerHTML={{ __html: t('advancedTask2Example') }} />
                                <p className="font-medium mb-2">{t('chooseOne')}</p>
                                <select className="border rounded px-2 py-1 mb-3 w-full bg-white">
                                    <option value="">{t('selectOptionDefault')}</option>
                                    <option value="1">{t('advancedTask2Option1')}</option>
                                    <option value="2">{t('advancedTask2Option2')}</option>
                                    <option value="3">{t('advancedTask2Option3')}</option>
                                </select>
                                <label className="block text-sm font-medium text-gray-700 mt-2">{t('similarProverbLabel')}</label>
                                <input type="text" className="border rounded px-2 py-1 w-full mt-1" placeholder={language === 'ru' ? 'Введите похожую пословицу...' : 'Enter similar proverb...'} />
                                <label className="block text-sm font-medium text-gray-700 mt-2">{t('analysisLabel')}</label>
                                <textarea className="border rounded px-2 py-1 w-full h-32 mt-1" placeholder={language === 'ru' ? 'Сравните культурные ценности...' : 'Compare cultural values...'}></textarea>
                                <button onClick={() => handleSubmit('advancedTask2')} className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('submitBtn')}</button>
                                {results.advancedTask2 && <div className={`result-message ${results.advancedTask2.type}`}>{results.advancedTask2.message}</div>}
                            </div>

                            {/* Task 3 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('advancedTask3Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('advancedTask3Desc')}</p>
                                {[
                                    { key: 'q1', quote: 'advancedTask3Prov1Quote', agree: 'advancedTask3Prov1Agree', disagree: 'advancedTask3Prov1Disagree' },
                                    { key: 'q2', quote: 'advancedTask3Prov2Quote', agree: 'advancedTask3Prov2Agree', disagree: 'advancedTask3Prov2Disagree' },
                                    { key: 'q3', quote: 'advancedTask3Prov3Quote', agree: 'advancedTask3Prov3Agree', disagree: 'advancedTask3Prov3Disagree' },
                                ].map(item => (
                                    <div key={item.key} className="mb-4">
                                        <p className="font-medium">"{t(item.quote)}"</p>
                                        <p className="text-xs text-gray-500 mb-1">{t(item.agree)}</p>
                                        <p className="text-xs text-gray-500 mb-1">{t(item.disagree)}</p>
                                        <textarea className="border rounded px-2 py-1 w-full h-24 mt-2" placeholder={language === 'ru' ? 'Ваши аргументы...' : 'Your arguments...'}></textarea>
                                    </div>
                                ))}
                                <button onClick={() => handleSubmit('advancedTask3')} className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('submitBtn')}</button>
                                {results.advancedTask3 && <div className={`result-message ${results.advancedTask3.type}`}>{results.advancedTask3.message}</div>}
                            </div>

                            {/* Task 4 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('advancedTask4Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('advancedTask4Desc')}</p>
                                <p className="italic text-sm text-gray-500 mb-2" dangerouslySetInnerHTML={{ __html: t('advancedTask4Example') }} />
                                <p className="font-medium mb-2">{t('chooseOne')}</p>
                                <select className="border rounded px-2 py-1 mb-3 w-full bg-white">
                                    <option value="">{t('selectOptionDefault')}</option>
                                    <option value="1">{t('advancedTask4Option1')}</option>
                                    <option value="2">{t('advancedTask4Option2')}</option>
                                    <option value="3">{t('advancedTask4Option3')}</option>
                                </select>
                                <label className="block text-sm font-medium text-gray-700 mt-2">{t('mediaTitleLabel')}</label>
                                <input type="text" className="border rounded px-2 py-1 w-full mt-1" placeholder={language === 'ru' ? 'Введите название...' : 'Enter title...'} />
                                <label className="block text-sm font-medium text-gray-700 mt-2">{t('analysisLabel')}</label>
                                <textarea className="border rounded px-2 py-1 w-full h-32 mt-1" placeholder={language === 'ru' ? 'Как пословица применима...' : 'How the proverb applies...'}></textarea>
                                <button onClick={() => handleSubmit('advancedTask4')} className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('submitBtn')}</button>
                                {results.advancedTask4 && <div className={`result-message ${results.advancedTask4.type}`}>{results.advancedTask4.message}</div>}
                            </div>

                            {/* Task 5 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('advancedTask5Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('advancedTask5Desc')}</p>
                                <p className="font-medium mb-2">{t('chooseTopic')}</p>
                                <div className="space-y-2 mb-3">
                                    {[
                                        { value: '1', textKey: 'advancedTask5Topic1' },
                                        { value: '2', textKey: 'advancedTask5Topic2' },
                                        { value: '3', textKey: 'advancedTask5Topic3' },
                                    ].map(topic => (
                                    <div key={topic.value}>
                                        <label className="radio-label">
                                            <input type="radio" name="essayTopic" value={topic.value} className="radio-input"/>
                                            <span>{t(topic.textKey)}</span>
                                        </label>
                                    </div>
                                    ))}
                                </div>
                                <textarea className="border rounded px-2 py-1 w-full h-64" placeholder={language === 'ru' ? 'Ваше эссе (примерно 300 слов)...' : 'Your essay (approx. 300 words)...'}></textarea>
                                <button onClick={() => handleSubmit('advancedTask5')} className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">{t('submitBtn')}</button>
                                {results.advancedTask5 && <div className={`result-message ${results.advancedTask5.type}`}>{results.advancedTask5.message}</div>}
                            </div>

                        </div>

                    </section>
                </main>

            </div>
        </React.Fragment>
    );
};

export default CulturalProverbsModule;
