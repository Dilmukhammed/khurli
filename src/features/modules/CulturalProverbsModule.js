import React, { useState, useEffect, useCallback } from 'react';
import moduleService from '../../services/moduleService'; // For progress tracking
import { useAuth } from '../../contexts/AuthContext'; // To check auth status
import AiChatWindow from '../../components/common/AiChatWindow';

// --- Translations Object ---
const translations = {
    ru: {
        pageTitle: "Logiclingua - Анализ культурных пословиц",
        navModules: "Анализ культурных пословиц",
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
        discussAiBtn: "Обсудить с ИИ",
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
        intermediateTask4Prov1: "1. \"Sabrlik – oltin.\" (Patience is gold.)",
        intermediateTask4Prov2: "2. \"Tez harakat qilmagan, peshonasini uradi.\" (He who hesitates, regrets.)",
        intermediateTask4Prov3: "3. \"Yomg‘irdan qochib, do‘lga tutilma.\" (Out of the frying pan, into the fire.)",
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
        completedText: "(Завершено)",
        loadingProgress: "Загрузка прогресса...",
        errorLoadingProgress: "Ошибка загрузки прогресса: ",
        errorSavingProgress: "Ошибка сохранения прогресса для ",
    },
    en: {
        pageTitle: "Logiclingua - Learning Modules",
        navModules: "Learning Modules",
        navAllModules: "All Modules",
        navAccount: "Personal Account",
        navLogin: "Login",
        mainTitle: "Analyzing Cultural Proverbs",
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
        discussAiBtn: "Discuss with AI",
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
        intermediateTask4Prov1: "1. \"Sabrlik – oltin.\" (Patience is gold.)",
        intermediateTask4Prov2: "2. \"Tez harakat qilmagan, peshonasini uradi.\" (He who hesitates, regrets.)",
        intermediateTask4Prov3: "3. \"Yomg‘irdan qochib, do‘lga tutilma.\" (Out of the frying pan, into the fire.)",
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
        completedText: "(Completed)",
        loadingProgress: "Loading progress...",
        errorLoadingProgress: "Error loading progress: ",
        errorSavingProgress: "Error saving progress for ",
    }
};

// --- CSS Styles (ensure this is complete from original) ---
const GlobalStyles = () => (
    <style>{`
        body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; color: #1f2937; }
        .task-card { transition: box-shadow 0.3s ease; }
        .task-card:hover { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); }
        #language-selector { appearance: none; background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 0.65em auto; padding-right: 2rem; }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; table-layout: fixed; }
        th, td { border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left; vertical-align: top; word-wrap: break-word; }
        th { background-color: #f3f4f6; font-weight: 600; }
        td select, .task-card select { min-width: 100px; padding: 0.5rem; border-radius: 0.375rem; border: 1px solid #d1d5db; background-color: #fff; }
        .choice-button { display: block; width: 100%; text-align: left; padding: 0.75rem 1rem; margin-bottom: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background-color: #ffffff; cursor: pointer; transition: background-color 0.2s ease, border-color 0.2s ease; }
        .choice-button:hover:not(:disabled) { background-color: #f9fafb; border-color: #9ca3af; }
        .choice-button.selected { background-color: #e0e7ff; border-color: #a5b4fc; font-weight: 500; }
        .choice-button.correct-answer, .correct-answer { border-color: #16a34a !important; background-color: #d1fae5 !important; }
        .choice-button.incorrect-answer, .incorrect-answer { border-color: #dc2626 !important; background-color: #fee2e2 !important; }
        .choice-button:disabled, select:disabled, input:disabled, textarea:disabled { opacity: 0.7; cursor: not-allowed; background-color: #f3f4f6; }
        button:disabled:not(.ask-ai-button) { opacity: 0.5; cursor: not-allowed; } /* General disabled style for check/submit buttons */
        .radio-label { display: inline-flex; align-items: center; margin-right: 1rem; cursor: pointer; padding: 0.5rem 0; }
        .radio-input { margin-right: 0.5rem; }
        .level-section { margin-bottom: 3rem; padding: 1.5rem; background-color: #ffffff; border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06); }
        .result-message { margin-top: 0.5rem; font-size: 0.875rem; font-weight: 500; }
        .result-message.correct { color: #16a34a; }
        .result-message.incorrect, .result-message.submitted { color: #1d4ed8; }
        .result-message.incorrect { color: #dc2626; }
        textarea { resize: vertical; border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.5rem; width: 100%;}
        .completed-text { color: #16a34a; font-weight: bold; margin-left: 8px; font-size: 0.9em;}
    `}</style>
);

// --- Main App Component ---
const CulturalProverbsModule = () => {
    const [language, setLanguage] = useState('ru');
    const [answers, setAnswers] = useState({});
    const [validation, setValidation] = useState({});
    const [results, setResults] = useState({});
    const [showAiButtons, setShowAiButtons] = useState({});

    // State for AI Chat
    const [activeChatTaskKey, setActiveChatTaskKey] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const { isAuthenticated } = useAuth();
    const [completedTasks, setCompletedTasks] = useState({});
    const [progressLoading, setProgressLoading] = useState(true);
    const [progressError, setProgressError] = useState(null);

    useEffect(() => {
        const storedLang = localStorage.getItem('logiclingua-lang') || 'ru';
        setLanguage(storedLang);
        document.documentElement.lang = storedLang;
        document.title = translations[storedLang]?.pageTitle || translations['en'].pageTitle;
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            setProgressLoading(true);
            setProgressError(null); // Clear previous errors
            moduleService.getModuleProgress('cultural-proverbs')
                .then(progressData => {
                    const completed = {};
                    if (progressData && Array.isArray(progressData)) {
                        progressData.forEach(item => {
                            if (item.status === 'completed') {
                                completed[item.task_id] = 'completed';
                            }
                        });
                    }
                    setCompletedTasks(completed);
                })
                .catch(err => {
                    console.error("Failed to fetch module progress:", err);
                    setProgressError(err.message || "Could not load progress.");
                })
                .finally(() => {
                    setProgressLoading(false);
                });
        } else {
            setCompletedTasks({}); // Clear progress if not authenticated
            setProgressLoading(false);
        }
    }, [isAuthenticated]);

    const t = useCallback((key) => {
        return translations[language]?.[key] || translations['en'][key] || key;
    }, [language]);

    // Helper function to format answers for AI
    const formatAnswersForAI = (answerObject) => {
        if (!answerObject) return [];
        return Object.entries(answerObject).map(([key, value]) => `${key}: ${String(value)}`);
    };

    // Helper function to get task details for AI
    const getTaskDetailsForAI = (taskKey) => {
        const taskAnswers = answers[taskKey] || {};
        let taskCorrectAnswers = {}; // For explain_mistakes
        let taskBlockContext = t(`${taskKey}Title`) + "\n" + t(`${taskKey}Desc`);
        let interaction_type_to_send = 'explain_mistakes'; // Default

        if (taskKey === 'beginnerTask1') {
            interaction_type_to_send = 'explain_mistakes';
            taskCorrectAnswers = { q1: 'a', q2: 'b', q3: 'c', q4: 'd', q5: 'e' };
            const proverbs = [
                 { key: 'q1', uz: "1. Yaxshi do'st - qiyin kunda bilinadi", en: "a) A friend in need is a friend indeed"},
                 { key: 'q2', uz: "2. Sabrlik - oltin", en: "b) Patience is a virtue"},
                 { key: 'q3', uz: "3. Mehnat qilmagan - rohat topmas", en: "c) No pain - no gain"},
                 { key: 'q4', uz: "4. Kichik daryolar katta daryolarga qo'shiladi", en: "d) Little by little, the bird builds its nest"},
                 { key: 'q5', uz: "5. Yomg'irdan qochib, do'lga tutilma", en: "e) Out of the frying pan, into the fire"},
            ];
            taskBlockContext += "\n\nProverbs and Options:\n" + proverbs.map(p => `${p.uz} -> English Options: ${p.en.substring(0,1)}`).join("\n");
        } else if (taskKey === 'beginnerTask2') {
            interaction_type_to_send = 'explain_mistakes';
            taskCorrectAnswers = { q1: 'b', q2: 'a', q3: 'b' };
             const questions = [
                 { key: 'q1', proverb: '1. "Yaxshi do‘st – qiyin kunda bilinadi."' },
                 { key: 'q2', proverb: '2. "Mehnat qilmagan – rohat topmas."' },
                 { key: 'q3', proverb: '3. "Sabrlik – oltin."' },
             ];
             taskBlockContext += "\n\nProverbs:\n" + questions.map(q => q.proverb).join("\n");
        } else if (taskKey === 'beginnerTask3') {
            taskCorrectAnswers = { q1: 'indeed', q2: 'gain', q3: 'fire', q4: 'nest', q5: 'virtue' };
             const fillInProverbs = [
                 '"A friend in need is a friend ___." (indeed, always, never)',
                 '"No pain, no ___." (gain, rain, train)',
                 '"Out of the frying pan, into the ___." (fire, ice, water)',
                 '"Little by little, the bird builds its ___." (nest, house, tree)',
                 '"Patience is a ___." (virtue, mistake, problem)',
             ];
             taskBlockContext += "\n\nFill-in Proverbs (full list):\n" + fillInProverbs.join("\n");

        } else if (taskKey === 'intermediateTask1') {
            interaction_type_to_send = 'explain_mistakes';
            taskCorrectAnswers = { q1: 'd', q2: 'a', q3: 'c', q4: 'e', q5: 'b' };
            const proverbsAndSituations = [
              { proverb: "1. Yaxshi do'st - qiyin kunda bilinadi. (A friend in need is a friend indeed)", situationKey: 'intermediateTask1SitD' },
              { proverb: "2. Mehnat qilmagan - rohat topmas (No pain, no gain)", situationKey: 'intermediateTask1SitA' },
              { proverb: "3. Yomg'irdan qochib, do'lga tutilma. (Out of the frying pan, into the fire)", situationKey: 'intermediateTask1SitC' },
              { proverb: "4. Ko'p bilan maslahat qil, lekin o'zing qaror qil. (Take advice from many, but make your own decision)", situationKey: 'intermediateTask1SitE' },
              { proverb: "5. Tez harkat qilmagan, peshonasini uradi. (He who hesitates, regrets)", situationKey: 'intermediateTask1SitB' },
            ];
            taskBlockContext += "\n\nProverbs and Situations:\n" +
                proverbsAndSituations.map(item => `${item.proverb} -> Situation: ${t(item.situationKey)}`).join("\n");
        } else if (taskKey === 'intermediateTask2') {
            interaction_type_to_send = 'discuss_open_ended';
            taskCorrectAnswers = {}; // No specific "correct" answers for open discussion
            // Context includes title, description, and the proverbs to be discussed
            taskBlockContext = `${t('intermediateTask2Title')}\n${t('intermediateTask2Desc')}\n\nProverbs for discussion:\n1. Ko‘p bilan maslahat qil, lekin o‘zing qaror qil \n2. "Yaxshi so‘z – jon ozig‘i."}\n3. "Daryodan o‘tib, eshakni urma."}`;

            const userResponses = [
                `Response to proverb 1: ${answers.intermediateTask2?.i2_q1_response || '(Not answered)'}`,
                `Response to proverb 2: ${answers.intermediateTask2?.i2_q2_response || '(Not answered)'}`,
                `Response to proverb 3: ${answers.intermediateTask2?.i2_q3_response || '(Not answered)'}`
            ];
            const combinedUserAnswers = userResponses.join("\n\n");

            return { // Return early for this specific structure
                block_context: taskBlockContext,
                user_answers: [combinedUserAnswers], // Send as a list with one item
                correct_answers: [], // Empty list for discussions
                interaction_type: interaction_type_to_send,
            };
        } else if (taskKey === 'intermediateTask4') {
            interaction_type_to_send = 'discuss_open_ended';
            taskBlockContext = `${t('intermediateTask4Title')}\n${t('intermediateTask4Desc')}\n\nProverbs:\n- ${t('intermediateTask4Prov1')}\n- ${t('intermediateTask4Prov2')}\n- ${t('intermediateTask4Prov3')}`;

            const agree_disagree = [
                `1 Proverb: ${answers.intermediateTask4?.agree_disagree_q1 || '(Not selected)'}`,
                `2 Proverb: ${answers.intermediateTask4?.agree_disagree_q2 || '(Not selected)'}`,
                `3 Proverb: ${answers.intermediateTask4?.agree_disagree_q3 || '(Not selected)'}`
            ];
            const essayText = [ 
                `User explanation 1 proverb: ${answers.intermediateTask4?.q1 || '(Not written)'}`,
                `User explanation 2 proverb: ${answers.intermediateTask4?.q2 || '(Not written)'}`,
                `User explanation 3 proverb: ${answers.intermediateTask4?.q3 || '(Not written)'}`,
            ]
            const formattedUserAnswers = agree_disagree.join("\n\n")+ "\n" + essayText.join("\n\n");
            

            return {
                block_context: taskBlockContext,
                user_answers: [formattedUserAnswers],
                correct_answers: [],
                interaction_type: interaction_type_to_send,
            };
        } else if (taskKey === 'intermediateTask5') {
            interaction_type_to_send = 'discuss_open_ended';
            taskCorrectAnswers = {};
            taskBlockContext = `${t('intermediateTask5Title')}\n${t('intermediateTask5Desc')}\n\nProverbs to choose from:\n- ${t('intermediateTask5Prov1')}\n- ${t('intermediateTask5Prov2')}\n- ${t('intermediateTask5Prov3')}`;
            const userStory = answers.intermediateTask5?.i5_story || '(Not answered)';
            return { // Return early
                block_context: taskBlockContext,
                user_answers: [userStory],
                correct_answers: [],
                interaction_type: interaction_type_to_send,
            };
        } else if (taskKey === 'beginnerTask4') {
            interaction_type_to_send = 'discuss_open_ended';
            taskBlockContext = `${t('beginnerTask4Title')}\n${t('beginnerTask4Desc')}`;
            const completeSentence = [
                {sentence: "1. A true friend is someone who ____"},
                {sentence: "2. If you want to succeed in life, you should _____"},
                {sentence: "3. When I have a problem, I usually ____"},
                {sentence: "4. In Uzbekistan, people believe that patience is important because ____"},
                {sentence: "5. A proverb I like is ____ , because _____"}
            ]
            const userSentences = [];
            for (let i = 1; i <= 4; i++) { // Loop for s1 to s4
                const answer = answers.beginnerTask4?.[`s${i}`];
                if (answer) {
                    userSentences.push(`Sentence ${i}: ${answer}`);
                } else {
                    userSentences.push(`Sentence ${i}: (Not answered)`);
                }
            }
            // Handle s5_proverb and s5_reason separately
            const s5Proverb = answers.beginnerTask4?.s5_proverb;
            const s5Reason = answers.beginnerTask4?.s5_reason;
            let sentence5 = "Sentence 5 (Proverb): (Not answered)";
            if (s5Proverb) {
                sentence5 = `Sentence 5 (Proverb): ${s5Proverb}`;
            }
            if (s5Reason) {
                sentence5 += `, Reason: ${s5Reason}`;
            } else if (s5Proverb) {
                sentence5 += `, Reason: (Not answered)`;
            }
            userSentences.push(sentence5);
            taskBlockContext += "\n\nSentences:\n" +
                completeSentence.map(item => `${item.sentence}`).join("\n");

            const formatted_user_answers_string = userSentences.join("\n");
            return {
                block_context: taskBlockContext,
                user_answers: [formatted_user_answers_string],
                correct_answers: [],
                interaction_type: interaction_type_to_send,
            };
        } else if (taskKey === 'intermediateTask3') {
            interaction_type_to_send = 'discuss_open_ended';
            taskBlockContext = `${t('intermediateTask3Title')}\n${t('intermediateTask3Desc')}`;
            // Adding existing proverbs to context for clarity
            taskBlockContext += `\n\nProverbs for comparison:`;
            taskBlockContext += `\n1. Uzbek: "Yaxshi do'st - qiyin kunda bilinadi." -> English: "A friend in need is a friend indeed" (Cultural difference: ${t('intermediateTask3Diff1')})`;
            taskBlockContext += `\n2. Uzbek: "Oltin topgan emas, do'st topgan baxtli." -> English: "${t('intermediateTask3Eng2')}"`;
            taskBlockContext += `\n3. Uzbek: "Ilm - oltindan qadrli." -> English: "${t('intermediateTask3Eng3')}"`;

            const userResponses = [];
            const q2Diff = answers.intermediateTask3?.q2_diff;
            const q3Diff = answers.intermediateTask3?.q3_diff;

            userResponses.push(`Cultural difference explanation for proverb 2: ${q2Diff || '(Not answered)'}`);
            userResponses.push(`Cultural difference explanation for proverb 3: ${q3Diff || '(Not answered)'}`);

            const formatted_user_answers_string = userResponses.join("\n\n");
            return {
                block_context: taskBlockContext,
                user_answers: [formatted_user_answers_string],
                correct_answers: [],
                interaction_type: interaction_type_to_send,
            };
        } else if (taskKey === 'advancedTask1') {
            interaction_type_to_send = 'discuss_open_ended';
            taskBlockContext = `${t('advancedTask1Title')}\n${t('advancedTask1Desc')}\n\nQuestions:\n- ${t('advancedTask1Q1')}\n- ${t('advancedTask1Q2')}\n- ${t('advancedTask1Q3')}\n- ${t('advancedTask1Q4')}\n\nProverb Options:\n- ${t('advancedTask1Option1')}\n- ${t('advancedTask1Option2')}\n- ${t('advancedTask1Option3')}`;

            const selectedProverb = answers.advancedTask1?.selectedProverb || '(Not selected)';
            const analysis = answers.advancedTask1?.analysis || '(Not answered)';
            const formattedUserAnswers = `Selected Proverb: ${selectedProverb}\n\nAnalysis:\n${analysis}`;

            return {
                block_context: taskBlockContext,
                user_answers: [formattedUserAnswers],
                correct_answers: [],
                interaction_type: interaction_type_to_send,
            };
        } else if (taskKey === 'advancedTask2') {
            interaction_type_to_send = 'discuss_open_ended';
            taskBlockContext = `${t('advancedTask2Title')}\n${t('advancedTask2Desc')}\n\nProverb Options:\n- ${t('advancedTask2Option1')}\n- ${t('advancedTask2Option2')}\n- ${t('advancedTask2Option3')}\n\n${t('advancedTask2Example')}`;

            const selectedProverb = answers.advancedTask2?.selectedProverb || '(Not selected)';
            const similarProverb = answers.advancedTask2?.similarProverb || '(Not provided)';
            const analysis = answers.advancedTask2?.analysis || '(Not answered)';
            const formattedUserAnswers = `Selected Uzbek Proverb: ${selectedProverb}\nSimilar Proverb (Other Culture): ${similarProverb}\n\nAnalysis:\n${analysis}`;

            return {
                block_context: taskBlockContext,
                user_answers: [formattedUserAnswers],
                correct_answers: [],
                interaction_type: interaction_type_to_send,
            };
        } else if (taskKey === 'advancedTask3') {
            interaction_type_to_send = 'discuss_open_ended';
            taskBlockContext = `${t('advancedTask3Title')}\n${t('advancedTask3Desc')}\n\nProverbs for Debate:\n1. "${t('advancedTask3Prov1Quote')}" (Agree: ${t('advancedTask3Prov1Agree')}, Disagree: ${t('advancedTask3Prov1Disagree')})\n2. "${t('advancedTask3Prov2Quote')}" (Agree: ${t('advancedTask3Prov2Agree')}, Disagree: ${t('advancedTask3Prov2Disagree')})\n3. "${t('advancedTask3Prov3Quote')}" (Agree: ${t('advancedTask3Prov3Agree')}, Disagree: ${t('advancedTask3Prov3Disagree')})`;

            const debate1_args = answers.advancedTask3?.q1_debate_args || '(Not answered)';
            const debate2_args = answers.advancedTask3?.q2_debate_args || '(Not answered)';
            const debate3_args = answers.advancedTask3?.q3_debate_args || '(Not answered)';
            const formattedUserAnswers = `Debate on "${t('advancedTask3Prov1Quote')}":\n${debate1_args}\n\nDebate on "${t('advancedTask3Prov2Quote')}":\n${debate2_args}\n\nDebate on "${t('advancedTask3Prov3Quote')}":\n${debate3_args}`;

            return {
                block_context: taskBlockContext,
                user_answers: [formattedUserAnswers],
                correct_answers: [],
                interaction_type: interaction_type_to_send,
            };
        } else if (taskKey === 'advancedTask4') {
            interaction_type_to_send = 'discuss_open_ended';
            taskBlockContext = `${t('advancedTask4Title')}\n${t('advancedTask4Desc')}\n\nProverb Options:\n- ${t('advancedTask4Option1')}\n- ${t('advancedTask4Option2')}\n- ${t('advancedTask4Option3')}\n\n${t('advancedTask4Example')}`;

            const selectedProverb = answers.advancedTask4?.selectedProverb || '(Not selected)';
            const mediaTitle = answers.advancedTask4?.mediaTitle || '(Not provided)';
            const analysis = answers.advancedTask4?.analysis || '(Not answered)';
            const formattedUserAnswers = `Selected Proverb: ${selectedProverb}\nNovel/Movie/Event Title: ${mediaTitle}\n\nAnalysis:\n${analysis}`;

            return {
                block_context: taskBlockContext,
                user_answers: [formattedUserAnswers],
                correct_answers: [],
                interaction_type: interaction_type_to_send,
            };
        } else if (taskKey === 'advancedTask5') {
            interaction_type_to_send = 'discuss_open_ended';
            taskBlockContext = `${t('advancedTask5Title')}\n${t('advancedTask5Desc')}\n\nEssay Topics:\n- ${t('advancedTask5Topic1')}\n- ${t('advancedTask5Topic2')}\n- ${t('advancedTask5Topic3')}`;

            const selectedTopic = answers.advancedTask5?.selectedTopic || '(Not selected)';
            const essayText = answers.advancedTask5?.essayText || '(Not written)';
            const formattedUserAnswers = `Selected Topic: ${selectedTopic}\n\nEssay Text:\n${essayText}`;

            return {
                block_context: taskBlockContext,
                user_answers: [formattedUserAnswers],
                correct_answers: [],
                interaction_type: interaction_type_to_send,
            };
        } else {
            // Fallback for tasks not explicitly configured for AI or default to explain_mistakes if not caught above
             // For tasks that reach here, they are likely 'explain_mistakes' by default or unconfigured.
            // If taskCorrectAnswers remains empty and it's 'explain_mistakes', AI will just comment on user_answers.
            // This part could be enhanced if more tasks are strictly 'explain_mistakes' and need explicit setup.
            if (Object.keys(taskCorrectAnswers).length === 0 && interaction_type_to_send === 'explain_mistakes') {
                 console.warn(`Task ${taskKey} is 'explain_mistakes' but has no correct answers defined in getTaskDetailsForAI.`);
            }
        }

        return { // Default return structure, mainly for 'explain_mistakes'
            block_context: taskBlockContext,
            user_answers: formatAnswersForAI(taskAnswers),
            correct_answers: formatAnswersForAI(taskCorrectAnswers),
            interaction_type: interaction_type_to_send,
        };
    };

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
        // Only show validation colors if results for this task are present (meaning "Check Answers" was clicked)
        if (results[taskKey] && isSelected && validationStatus === 'correct') classes.push('correct-answer');
        if (results[taskKey] && isSelected && validationStatus === 'incorrect') classes.push('incorrect-answer');
        return classes.join(' ');
    };
    
    const handleAnswerChange = (taskKey, itemKey, value) => {
        if (isTaskCompleted(taskKey) && !progressLoading) return;

        setAnswers(prev => ({
            ...prev,
            [taskKey]: { ...prev[taskKey], [itemKey]: value }
        }));
        setResults(prev => { const newResults = {...prev}; delete newResults[taskKey]; return newResults; });
        setValidation(prev => { const newValidation = {...prev}; delete newValidation[taskKey]; return newValidation; });
        setShowAiButtons(prev => ({ ...prev, [taskKey]: false }));
    };

    const handleSubmit = (taskKey) => { // For open-ended tasks
         setResults(prev => ({ ...prev, [taskKey]: { type: 'submitted', message: t('submissionReceived') }}));
         setShowAiButtons(prev => ({ ...prev, [taskKey]: true })); // Explicitly show AI button
    };

    const isTaskCompleted = (taskKey) => completedTasks[taskKey] === 'completed';

    const checkAnswers = (taskKey, correctAnswers) => {
        if (isTaskCompleted(taskKey) || progressLoading) return;

        const userAnswers = answers[taskKey] || {};
        let newValidation = {};
        let allCorrect = true;
        let anyAnswered = false;

        Object.keys(correctAnswers).forEach(key => {
            if (userAnswers[key] !== undefined && String(userAnswers[key]).trim() !== '') {
                anyAnswered = true;
                if (String(userAnswers[key]).trim().toLowerCase() === String(correctAnswers[key])) {
                    newValidation[key] = 'correct';
                } else {
                    newValidation[key] = 'incorrect';
                    allCorrect = false;
                }
            } else {
                newValidation[key] = 'missing'; // Mark as missing if it's a required field
                allCorrect = false;
            }
        });

        setValidation(prev => ({ ...prev, [taskKey]: newValidation }));

        if (!anyAnswered && Object.keys(correctAnswers).length > 0) {
             setResults(prev => ({ ...prev, [taskKey]: { type: 'incorrect', message: t('someIncorrectMessage') } }));
             setShowAiButtons(prev => ({ ...prev, [taskKey]: true }));
             return;
        }

        if (allCorrect) {
            setResults(prev => ({ ...prev, [taskKey]: { type: 'correct', message: t('allCorrectMessage') } }));
            setShowAiButtons(prev => ({ ...prev, [taskKey]: false }));
            if (isAuthenticated) {
                moduleService.markTaskAsCompleted('cultural-proverbs', taskKey)
                    .then(() => {
                        console.log(`Task ${taskKey} marked as completed on backend.`);
                        setCompletedTasks(prev => ({ ...prev, [taskKey]: 'completed' }));
                    })
                    .catch(err => {
                        console.error(`Failed to mark task ${taskKey} as completed:`, err);
                        setProgressError(`${t('errorSavingProgress')}${taskKey}: ${err.message}`);
                    });
            }
        } else {
            setResults(prev => ({ ...prev, [taskKey]: { type: 'incorrect', message: t('someIncorrectMessage') } }));
            setShowAiButtons(prev => ({ ...prev, [taskKey]: true }));
        }
    };

    const checkBeginnerTask1 = () => checkAnswers('beginnerTask1', { q1: 'a', q2: 'b', q3: 'c', q4: 'd', q5: 'e' });
    const checkBeginnerTask2 = () => checkAnswers('beginnerTask2', { q1: 'b', q2: 'a', q3: 'b' });
    const checkBeginnerTask3 = () => checkAnswers('beginnerTask3', { q1: 'indeed', q2: 'gain', q3: 'fire', q4: 'nest', q5: 'virtue' });
    const checkIntermediateTask1 = () => checkAnswers('intermediateTask1', { q1: 'd', q2: 'a', q3: 'c', q4: 'e', q5: 'b' });
    
    const handleAskAI = async (taskKey, userQuery = '') => {
        console.log('[CulturalProverbsModule] handleAskAI called. taskKey:', taskKey, 'userQuery:', userQuery); // Log 1

        if (isAiLoading) {
            console.log('[CulturalProverbsModule] AI is already loading. Ignoring request.');
            return;
        }

        setIsAiLoading(true);
        setActiveChatTaskKey(taskKey);

        if (userQuery) {
            setChatMessages(prev => [
                ...prev,
                { "role" : 'user', "content": userQuery },
            ]);
        }

        const { block_context, user_answers, correct_answers, interaction_type } = getTaskDetailsForAI(taskKey);

        if (!block_context) {
            console.error("[CulturalProverbsModule] Could not get task details for AI. taskKey:", taskKey);
            setChatMessages(prev => [
                ...prev.filter(msg => msg["content"] !== 'Thinking...'),
                {"role": 'assistant', "content": "Sorry, I couldn't get the details for this task."}
            ]);
            setIsAiLoading(false);
            return;
        }

        console.log('[CulturalProverbsModule] Calling service with userQuery:', userQuery); // Log 2
        console.log('[CulturalProverbsModule] Context being sent:', { block_context, user_answers, correct_answers });


        try {
            const response = await moduleService.getAiProverbExplanation(
                block_context,
                user_answers,
                correct_answers,
                userQuery, // Ensure this is the potentially new userQuery
                chatMessages,
                interaction_type
            );
            setChatMessages(prev => [
                ...prev.filter(msg => msg["content"] !== 'Thinking...'),
                { "role": 'assistant', "content": response.explanation }
            ]);
        } catch (error) {
            console.error('[CulturalProverbsModule] Error fetching AI explanation:', error);
            setChatMessages(prev => [
                ...prev.filter(msg => msg["content"] !== 'Thinking...'),
                { "role": 'assistant', "content": `Sorry, I encountered an error: ${error.message}` }
            ]);
        } finally {
            setIsAiLoading(false);
        }
    };

    // --- JSX Render ---
    return (
        <React.Fragment>
            <GlobalStyles />
            <div className="bg-gray-100 text-gray-800">
                <main className="container mx-auto px-6 py-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{t('mainTitle')}</h1>

                    {progressLoading && <div className="text-center p-4 text-gray-600">{t('loadingProgress')}</div>}
                    {progressError && <div className="text-center p-4 text-red-500">{`${t('errorLoadingProgress')} ${progressError}`}</div>}


                    <section className="mb-12">
                        {/* ======================================= */}
                        {/* =========== BEGINNER LEVEL ============ */}
                        {/* ======================================= */}
                        <div className="level-section">
                            <h3 className="text-xl font-bold text-indigo-700 mb-4">{t('beginnerLevel')}</h3>
                            
                            {/* Task 1 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">
                                    {t('beginnerTask1Title')}
                                    {isTaskCompleted('beginnerTask1') && !progressLoading && <span className='completed-text'>{t('completedText')}</span>}
                                </h4>
                                <p className="mb-3 text-sm text-gray-600">{t('beginnerTask1Desc')}</p>
                                <table>
                                    <thead>
                                        <tr><th>{t('tableUzbekProverb')}</th><th>{t('tableEnglishProverb')}</th><th>{t('tableMatchSelect')}</th></tr>
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
                                            <td>{item.uz}</td><td>{item.en}</td>
                                            <td>
                                                <select
                                                    value={answers.beginnerTask1?.[item.key] || ''}
                                                    onChange={(e) => handleAnswerChange('beginnerTask1', item.key, e.target.value)}
                                                    className={getValidationClass('beginnerTask1', item.key)}
                                                    disabled={isTaskCompleted('beginnerTask1') || progressLoading}
                                                >
                                                    <option value="">{t('selectOptionDefault')}</option>
                                                    {['a', 'b', 'c', 'd', 'e'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button onClick={checkBeginnerTask1} className="check-button mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300" disabled={isTaskCompleted('beginnerTask1') || progressLoading}>{t('checkAnswersBtn')}</button>
                                {results.beginnerTask1 && <div className={`result-message ${results.beginnerTask1.type}`}>{results.beginnerTask1.message}</div>}
                                {showAiButtons.beginnerTask1 && !isTaskCompleted('beginnerTask1') &&
                                    <button
                                        onClick={() => handleAskAI('beginnerTask1')}
                                        className="ask-ai-button mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                        disabled={isAiLoading && activeChatTaskKey === 'beginnerTask1'}
                                    >
                                        {isAiLoading && activeChatTaskKey === 'beginnerTask1' ? 'AI Thinking...' : t('askAiBtn')}
                                    </button>
                                }
                                {activeChatTaskKey === 'beginnerTask1' && (
                                    <div className="mt-4"> {/* Wrapper for chat window */}
                                        <AiChatWindow
                                            messages={chatMessages}
                                            isLoading={isAiLoading}
                                            onSendMessage={(message) => handleAskAI('beginnerTask1', message)}
                                        />
                                        <button
                                            onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); }}
                                            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Close AI Chat
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Task 2 */}
                             <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">
                                    {t('beginnerTask2Title')}
                                    {isTaskCompleted('beginnerTask2') && !progressLoading && <span className='completed-text'>{t('completedText')}</span>}
                                </h4>
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
                                                disabled={isTaskCompleted('beginnerTask2') || progressLoading}
                                            >
                                                {t(choice.textKey)}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                                <button onClick={checkBeginnerTask2} className="check-button mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300" disabled={isTaskCompleted('beginnerTask2') || progressLoading}>{t('checkAnswersBtn')}</button>
                                {results.beginnerTask2 && <div className={`result-message ${results.beginnerTask2.type}`}>{results.beginnerTask2.message}</div>}
                                {showAiButtons.beginnerTask2 && !isTaskCompleted('beginnerTask2') &&
                                    <button
                                        onClick={() => {handleAskAI('beginnerTask2'); setChatMessages([])}}
                                        className="ask-ai-button mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                        disabled={isAiLoading && activeChatTaskKey === 'beginnerTask2'}
                                    >
                                        {isAiLoading && activeChatTaskKey === 'beginnerTask2' ? 'AI Thinking...' : t('askAiBtn')}
                                    </button>
                                }
                                {activeChatTaskKey === 'beginnerTask2' && (
                                    <div className="mt-4">
                                        <AiChatWindow
                                            messages={chatMessages}
                                            isLoading={isAiLoading}
                                            onSendMessage={(message) => handleAskAI('beginnerTask2', message)}
                                        />
                                        <button
                                            onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); }}
                                            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Close AI Chat
                                        </button>
                                    </div>
                                )}
                            </div>

                             {/* Task 3 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">
                                    {t('beginnerTask3Title')}
                                    {isTaskCompleted('beginnerTask3') && !progressLoading && <span className='completed-text'>{t('completedText')}</span>}
                                </h4>
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
                                            disabled={isTaskCompleted('beginnerTask3') || progressLoading}
                                        />
                                    </li>
                                    ))}
                                </ol>
                                <button onClick={checkBeginnerTask3} className="check-button mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300" disabled={isTaskCompleted('beginnerTask3') || progressLoading}>{t('checkAnswersBtn')}</button>
                                {results.beginnerTask3 && <div className={`result-message ${results.beginnerTask3.type}`}>{results.beginnerTask3.message}</div>}
                                {showAiButtons.beginnerTask3 && !isTaskCompleted('beginnerTask3') &&
                                    <button
                                        onClick={() => {handleAskAI('beginnerTask3'); setChatMessages([])}}
                                        className="ask-ai-button mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                        disabled={isAiLoading && activeChatTaskKey === 'beginnerTask3'}
                                    >
                                        {isAiLoading && activeChatTaskKey === 'beginnerTask3' ? 'AI Thinking...' : t('askAiBtn')}
                                    </button>
                                }
                                {activeChatTaskKey === 'beginnerTask3' && (
                                    <div className="mt-4">
                                        <AiChatWindow
                                            messages={chatMessages}
                                            isLoading={isAiLoading}
                                            onSendMessage={(message) => handleAskAI('beginnerTask3', message)}
                                        />
                                        <button
                                            onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); }}
                                            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Close AI Chat
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Task 4 (Open-ended, not saved as 'completed' in this iteration) */}
                             <div className="mb-6 p-4 border rounded-md task-card bg-white force-english">
                                <h4 className="font-semibold mb-2">
                                    {t('beginnerTask4Title')}
                                    {isTaskCompleted('beginnerTask4') && !progressLoading && <span className='completed-text'>{t('completedText')}</span>}
                                </h4>
                                <p className="mb-3 text-sm text-gray-600">{t('beginnerTask4Desc')}</p>
                                <ol className="list-decimal list-inside space-y-3">
                                    <li>
                                        <span>A true friend is someone who</span>
                                        <input
                                            type="text"
                                            className="border rounded px-2 py-1 ml-2 w-full md:w-3/4"
                                            value={answers.beginnerTask4?.s1 || ''}
                                            onChange={(e) => handleAnswerChange('beginnerTask4', 's1', e.target.value)}
                                            disabled={isTaskCompleted('beginnerTask4') || progressLoading}
                                        />
                                    </li>
                                    <li>
                                        <span>If you want to succeed in life, you should</span>
                                        <input
                                            type="text"
                                            className="border rounded px-2 py-1 ml-2 w-full md:w-3/4"
                                            value={answers.beginnerTask4?.s2 || ''}
                                            onChange={(e) => handleAnswerChange('beginnerTask4', 's2', e.target.value)}
                                            disabled={isTaskCompleted('beginnerTask4') || progressLoading}
                                        />
                                    </li>
                                    <li>
                                        <span>When I have a problem, I usually</span>
                                        <input
                                            type="text"
                                            className="border rounded px-2 py-1 ml-2 w-full md:w-3/4"
                                            value={answers.beginnerTask4?.s3 || ''}
                                            onChange={(e) => handleAnswerChange('beginnerTask4', 's3', e.target.value)}
                                            disabled={isTaskCompleted('beginnerTask4') || progressLoading}
                                        />
                                    </li>
                                    <li>
                                        <span>In Uzbekistan, people believe that patience is important because</span>
                                        <input
                                            type="text"
                                            className="border rounded px-2 py-1 ml-2 w-full md:w-3/4"
                                            value={answers.beginnerTask4?.s4 || ''}
                                            onChange={(e) => handleAnswerChange('beginnerTask4', 's4', e.target.value)}
                                            disabled={isTaskCompleted('beginnerTask4') || progressLoading}
                                        />
                                    </li>
                                    <li>
                                        <span>A proverb I like is</span>
                                        <input
                                            type="text"
                                            className="border rounded px-2 py-1 ml-2 w-1/2"
                                            value={answers.beginnerTask4?.s5_proverb || ''} // Changed key to be more specific
                                            onChange={(e) => handleAnswerChange('beginnerTask4', 's5_proverb', e.target.value)}
                                            disabled={isTaskCompleted('beginnerTask4') || progressLoading}
                                        />,
                                        <span> because</span>
                                        <input
                                            type="text"
                                            className="border rounded px-2 py-1 ml-2 w-full md:w-3/4"
                                            value={answers.beginnerTask4?.s5_reason || ''} // Changed key to be more specific
                                            onChange={(e) => handleAnswerChange('beginnerTask4', 's5_reason', e.target.value)}
                                            disabled={isTaskCompleted('beginnerTask4') || progressLoading}
                                        />
                                    </li>
                                </ol>
                                <button
                                    onClick={() => handleSubmit('beginnerTask4')}
                                    className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                    disabled={isTaskCompleted('beginnerTask4') || progressLoading}
                                >
                                    {t('submitBtn')}
                                </button>
                                {results.beginnerTask4 && <div className={`result-message ${results.beginnerTask4.type}`}>{results.beginnerTask4.message}</div>}
                                {showAiButtons.beginnerTask4 && !isTaskCompleted('beginnerTask4') &&
                                    <button
                                        onClick={() => {handleAskAI('beginnerTask4'); setChatMessages([])}}
                                        className="discuss-ai-button mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                        disabled={isAiLoading && activeChatTaskKey === 'beginnerTask4'}
                                    >
                                        {isAiLoading && activeChatTaskKey === 'beginnerTask4' ? 'AI Thinking...' : t('discussAiBtn')}
                                    </button>
                                }
                                {activeChatTaskKey === 'beginnerTask4' && (
                                    <div className="mt-4">
                                        <AiChatWindow
                                            messages={chatMessages}
                                            isLoading={isAiLoading}
                                            onSendMessage={(message) => handleAskAI('beginnerTask4', message)}
                                        />
                                        <button
                                            onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); }}
                                            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Close AI Chat
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            {/* Task 5 (Role-playing, not saved) */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('beginnerTask5Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('beginnerTask5Desc')}</p>
                                <p className="italic text-sm text-gray-500 mb-2" dangerouslySetInnerHTML={{ __html: t('beginnerTask5Example') }} />
                                <p className="font-medium mb-2">{t('beginnerTask5Situations')}</p>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    <li>{t('beginnerTask5Sit1')}</li><li>{t('beginnerTask5Sit2')}</li><li>{t('beginnerTask5Sit3')}</li><li>{t('beginnerTask5Sit4')}</li><li>{t('beginnerTask5Sit5')}</li>
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
                                <h4 className="font-semibold mb-2">
                                    {t('intermediateTask1Title')}
                                    {isTaskCompleted('intermediateTask1') && !progressLoading && <span className='completed-text'>{t('completedText')}</span>}
                                </h4>
                                <p className="mb-3 text-sm text-gray-600">{t('intermediateTask1Desc')}</p>
                                <table className="w-full border-collapse mt-4 table-fixed">
                                    <thead>
                                        <tr><th className="border p-3 text-left bg-gray-100 font-semibold w-1/3">{t('tableProverb')}</th><th className="border p-3 text-left bg-gray-100 font-semibold w-1/3">{t('tableSituation')}</th><th className="border p-3 text-left bg-gray-100 font-semibold w-1/4">{t('tableMatchSelect')}</th></tr>
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
                                                <td className="border p-3 align-top break-words">{item.proverb}</td><td className="border p-3 align-top break-words">{item.situation}</td>
                                                <td className="border p-3 align-top">
                                                    <select
                                                        value={answers.intermediateTask1?.[item.key] || ''}
                                                        onChange={(e) => handleAnswerChange('intermediateTask1', item.key, e.target.value)}
                                                        className={`w-full p-2 rounded-md border bg-white ${getValidationClass('intermediateTask1', item.key)}`}
                                                        disabled={isTaskCompleted('intermediateTask1') || progressLoading}
                                                    >
                                                        <option value="">{t('selectOptionDefault')}</option>
                                                        {['a', 'b', 'c', 'd', 'e'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button onClick={checkIntermediateTask1} className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300" disabled={isTaskCompleted('intermediateTask1') || progressLoading}>{t('checkAnswersBtn')}</button>
                                {results.intermediateTask1 && <div className={`result-message ${results.intermediateTask1.type}`}>{results.intermediateTask1.message}</div>}
                                {showAiButtons.intermediateTask1 && !isTaskCompleted('intermediateTask1') &&
                                    <button
                                        onClick={() => {handleAskAI('intermediateTask1'); setChatMessages([])}}
                                        className="ask-ai-button mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                        disabled={isAiLoading && activeChatTaskKey === 'intermediateTask1'}
                                    >
                                        {isAiLoading && activeChatTaskKey === 'intermediateTask1' ? 'AI Thinking...' : t('askAiBtn')}
                                    </button>
                                }
                                {activeChatTaskKey === 'intermediateTask1' && (
                                    <div className="mt-4">
                                        <AiChatWindow
                                            messages={chatMessages}
                                            isLoading={isAiLoading}
                                            onSendMessage={(message) => handleAskAI('intermediateTask1', message)}
                                        />
                                        <button
                                            onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); }}
                                            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Close AI Chat
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Task 2 (Open-ended) */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('intermediateTask2Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('intermediateTask2Desc')}</p>
                                {[
                                    // Intermediate Task 2: Textareas
                                        // Key for proverb text lookup, adjust if your translation keys are different
                                        // These are illustrative; actual keys might be more complex or direct text.
                                        // For this example, I'll assume the proverb text is part of the item object passed to map.
                                        // The prompt asks for t('intermediateTask2.q1.proverb') etc. which is not standard i18n.
                                        // I'll use the existing structure which seems to imply item.proverb is already translated or is the key.
                                        [
                                            { key: 'i2_q1', proverbKey: 'intermediateTask2.q1.proverb_placeholder', labelKey: 'whatDoesItMean', answerKey: 'i2_q1_response', originalProverbText: "1. \"Ko‘p bilan maslahat qil, lekin o‘zing qaror qil.\" (Take advice from many, but make your own decision.)" },
                                            { key: 'i2_q2', proverbKey: 'intermediateTask2.q2.proverb_placeholder', labelKey: 'whyIsImportant', answerKey: 'i2_q2_response', originalProverbText: "2. \"Yaxshi so‘z – jon ozig‘i.\" (A kind word is food for the soul.)" },
                                            { key: 'i2_q3', proverbKey: 'intermediateTask2.q3.proverb_placeholder', labelKey: 'whatLesson', answerKey: 'i2_q3_response', originalProverbText: "3. \"Daryodan o‘tib, eshakni urma.\" (Don’t beat the donkey after crossing the river.)" },
                                        ].map(item => (
                                            <div key={item.key} className="mb-4">
                                                <p className="font-medium">{item.originalProverbText}</p>
                                                <label className="block text-sm font-medium text-gray-700 mt-1">{t(item.labelKey)}</label>
                                                <textarea
                                                    className="border rounded px-2 py-1 w-full h-16 mt-1"
                                                    placeholder="..."
                                                    value={answers.intermediateTask2?.[item.answerKey] || ''}
                                                    onChange={(e) => handleAnswerChange('intermediateTask2', item.answerKey, e.target.value)}
                                                    disabled={isTaskCompleted('intermediateTask2') || progressLoading}
                                                />
                                            </div>
                                        ))]}
                                <button onClick={() => handleSubmit('intermediateTask2')} className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300" disabled={isTaskCompleted('intermediateTask2') || progressLoading}>{t('submitBtn')}</button>
                                {results.intermediateTask2 && <div className={`result-message ${results.intermediateTask2.type}`}>{results.intermediateTask2.message}</div>}
                                {showAiButtons.intermediateTask2 && !isTaskCompleted('intermediateTask2') &&
                                    <button
                                        onClick={() => {handleAskAI('intermediateTask2'); setChatMessages([])}}
                                        className="discuss-ai-button mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                        disabled={isAiLoading && activeChatTaskKey === 'intermediateTask2'}
                                    >
                                        {isAiLoading && activeChatTaskKey === 'intermediateTask2' ? 'AI Thinking...' : t('discussAiBtn')}
                                    </button>
                                }
                                {activeChatTaskKey === 'intermediateTask2' && (
                                    <div className="mt-4">
                                        <AiChatWindow
                                            messages={chatMessages}
                                            isLoading={isAiLoading}
                                            onSendMessage={(message) => handleAskAI('intermediateTask2', message)}
                                        />
                                        <button
                                            onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); }}
                                            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Close AI Chat
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Task 3 (Open-ended) */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">
                                    {t('intermediateTask3Title')}
                                    {isTaskCompleted('intermediateTask3') && !progressLoading && <span className='completed-text'>{t('completedText')}</span>}
                                </h4>
                                <p className="mb-3 text-sm text-gray-600">{t('intermediateTask3Desc')}</p>
                                <table className="w-full border-collapse mt-4 table-fixed">
                                    <thead><tr><th className="border p-3 text-left bg-gray-100 font-semibold w-1/3">{t('tableUzbekProverb')}</th><th className="border p-3 text-left bg-gray-100 font-semibold w-1/3">{t('tableEnglishEquivalent')}</th><th className="border p-3 text-left bg-gray-100 font-semibold w-1/3">{t('tableCulturalDifference')}</th></tr></thead>
                                    <tbody>
                                        <tr><td className="border p-3 align-top break-words">1. Yaxshi do'st - qiyin kunda bilinadi.</td><td className="border p-3 align-top break-words">A friend in need is a friend indeed</td><td className="border p-3 align-top break-words">{t('intermediateTask3Diff1')}</td></tr>
                                        <tr>
                                            <td className="border p-3 align-top break-words">2. Oltin topgan emas, do'st topgan baxtli.</td>
                                            <td className="border p-3 align-top break-words">{t('intermediateTask3Eng2')}</td>
                                            <td className="border p-3 align-top">
                                                <textarea
                                                    className="border rounded px-2 py-1 w-full h-20"
                                                    placeholder="..."
                                                    value={answers.intermediateTask3?.q2_diff || ''}
                                                    onChange={(e) => handleAnswerChange('intermediateTask3', 'q2_diff', e.target.value)}
                                                    disabled={isTaskCompleted('intermediateTask3') || progressLoading}
                                                ></textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border p-3 align-top break-words">3. Ilm - oltindan qadrli.</td>
                                            <td className="border p-3 align-top break-words">{t('intermediateTask3Eng3')}</td>
                                            <td className="border p-3 align-top">
                                                <textarea
                                                    className="border rounded px-2 py-1 w-full h-20"
                                                    placeholder="..."
                                                    value={answers.intermediateTask3?.q3_diff || ''}
                                                    onChange={(e) => handleAnswerChange('intermediateTask3', 'q3_diff', e.target.value)}
                                                    disabled={isTaskCompleted('intermediateTask3') || progressLoading}
                                                ></textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button
                                    onClick={() => handleSubmit('intermediateTask3')}
                                    className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                    disabled={isTaskCompleted('intermediateTask3') || progressLoading}
                                >
                                    {t('submitBtn')}
                                </button>
                                {results.intermediateTask3 && <div className={`result-message ${results.intermediateTask3.type}`}>{results.intermediateTask3.message}</div>}
                                {showAiButtons.intermediateTask3 && !isTaskCompleted('intermediateTask3') &&
                                    <button
                                        onClick={() => {handleAskAI('intermediateTask3'); setChatMessages([])}}
                                        className="discuss-ai-button mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                        disabled={isAiLoading && activeChatTaskKey === 'intermediateTask3'}
                                    >
                                        {isAiLoading && activeChatTaskKey === 'intermediateTask3' ? 'AI Thinking...' : t('discussAiBtn')}
                                    </button>
                                }
                                {activeChatTaskKey === 'intermediateTask3' && (
                                    <div className="mt-4">
                                        <AiChatWindow
                                            messages={chatMessages}
                                            isLoading={isAiLoading}
                                            onSendMessage={(message) => handleAskAI('intermediateTask3', message)}
                                        />
                                        <button
                                            onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); }}
                                            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Close AI Chat
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Task 4 (Open-ended) */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('intermediateTask4Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('intermediateTask4Desc')}</p>
                                <div key="q1" className="mb-4">
                                        <p className="font-medium">1. "Sabrlik – oltin." (Patience is gold.)</p>
                                        <div className="mt-1">
                                            <label className="radio-label">
                                                <input
                                                type="radio"
                                                name={`debateq1`}
                                                value="agree"
                                                className="radio-input"
                                                onChange={(e) => handleAnswerChange('intermediateTask4', 'agree_disagree_q1', e.target.value)}
                                            />
                                            <span>{t('agree')}</span>
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                type="radio"
                                                name={`debateq1`}
                                                value="disagree"
                                                className="radio-input"
                                                onChange={(e) => handleAnswerChange('intermediateTask4', 'agree_disagree_q1', e.target.value)}
                                            />
                                            <span>{t('disagree')}</span>
                                            </label>
                                        </div>
                                        <textarea  
                                        className="border rounded px-2 py-1 w-full h-16 mt-2"
                                        placeholder = {language === 'ru' ? 'Объяснение...' : 'Explanation...'}
                                        value={answers.intermediateTask4?.q1 || ''}
                                        onChange={(e) => handleAnswerChange('intermediateTask4', "q1", e.target.value)}
                                        disabled={isTaskCompleted('intermediateTask4') || progressLoading}
                                        ></textarea>
                                </div>
                                <div key="q2" className="mb-4">
                                        <p className="font-medium">2. "Tez harakat qilmagan, peshonasini uradi." (He who hesitates, regrets.)</p>
                                        <div className="mt-1">
                                            <label className="radio-label">
                                                <input
                                                type="radio"
                                                name={`debateq2`}
                                                value="agree"
                                                className="radio-input"
                                                onChange={(e) => handleAnswerChange('intermediateTask4', 'agree_disagree_q2', e.target.value)}
                                            />
                                            <span>{t('agree')}</span>
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                type="radio"
                                                name={`debateq2`}
                                                value="disagree"
                                                className="radio-input"
                                                onChange={(e) => handleAnswerChange('intermediateTask4', 'agree_disagree_q2', e.target.value)}
                                            />
                                            <span>{t('disagree')}</span>
                                            </label>
                                        </div>
                                        <textarea  
                                        className="border rounded px-2 py-1 w-full h-16 mt-2"
                                        placeholder = {language === 'ru' ? 'Объяснение...' : 'Explanation...'}
                                        value={answers.intermediateTask4?.q2 || ''}
                                        onChange={(e) => handleAnswerChange('intermediateTask4', "q2", e.target.value)}
                                        disabled={isTaskCompleted('intermediateTask4') || progressLoading}
                                        ></textarea>
                                </div>
                                <div key="q3" className="mb-4">
                                        <p className="font-medium">3. "Yomg‘irdan qochib, do‘lga tutilma." (Out of the frying pan, into the fire.)</p>
                                        <div className="mt-1">
                                            <label className="radio-label">
                                                <input
                                                type="radio"
                                                name={`debateq3`}
                                                value="agree"
                                                className="radio-input"
                                                onChange={(e) => handleAnswerChange('intermediateTask4', 'agree_disagree_q3', e.target.value)}
                                            />
                                            <span>{t('agree')}</span>
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                type="radio"
                                                name={`debateq3`}
                                                value="disagree"
                                                className="radio-input"
                                                onChange={(e) => handleAnswerChange('intermediateTask4', 'agree_disagree_q3', e.target.value)}
                                            />
                                            <span>{t('disagree')}</span>
                                            </label>
                                        </div>
                                        <textarea  
                                        className="border rounded px-2 py-1 w-full h-16 mt-2"
                                        placeholder = {language === 'ru' ? 'Объяснение...' : 'Explanation...'}
                                        value={answers.intermediateTask4?.q3 || ''}
                                        onChange={(e) => handleAnswerChange('intermediateTask4', "q3", e.target.value)}
                                        disabled={isTaskCompleted('intermediateTask4') || progressLoading}
                                        ></textarea>
                                </div>
                                <button onClick={() => handleSubmit('intermediateTask4')} className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300" disabled={isTaskCompleted('intermediateTask4') || progressLoading}>{t('submitBtn')}</button>
                                {results.intermediateTask4 && <div className={`result-message ${results.intermediateTask4.type}`}>{results.intermediateTask4.message}</div>}
                                {showAiButtons.intermediateTask4 && !isTaskCompleted('intermediateTask4') &&
                                    <button
                                        onClick={() => {handleAskAI('intermediateTask4'); setChatMessages([])}}
                                        className="discuss-ai-button mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                        disabled={isAiLoading && activeChatTaskKey === 'intermediateTask4'}
                                    >
                                        {isAiLoading && activeChatTaskKey === 'intermediateTask4' ? 'AI Thinking...' : t('discussAiBtn')}
                                    </button>
                                }
                                {activeChatTaskKey === 'intermediateTask4' && (
                                    <div className="mt-4">
                                        <AiChatWindow
                                            messages={chatMessages}
                                            isLoading={isAiLoading}
                                            onSendMessage={(message) => handleAskAI('intermediateTask4', message)}
                                        />
                                        <button
                                            onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); }}
                                            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Close AI Chat
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Task 5 (Open-ended) */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('intermediateTask5Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('intermediateTask5Desc')}</p>
                                <p className="font-medium mb-2">{t('chooseOneProverb')}</p>
                                <ul className="list-disc list-inside text-sm text-gray-600 mb-3">
                                    <li>{t('intermediateTask5Prov1')}</li><li>{t('intermediateTask5Prov2')}</li><li>{t('intermediateTask5Prov3')}</li>
                                </ul>
                                <textarea
                                    className="border rounded px-2 py-1 w-full h-32"
                                    placeholder={language === 'ru' ? 'Ваша история...' : 'Your story...'}
                                    value={answers.intermediateTask5?.i5_story || ''}
                                    onChange={(e) => handleAnswerChange('intermediateTask5', 'i5_story', e.target.value)}
                                    disabled={isTaskCompleted('intermediateTask5') || progressLoading}
                                />
                                <button onClick={() => handleSubmit('intermediateTask5')} className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300" disabled={isTaskCompleted('intermediateTask5') || progressLoading}>{t('submitBtn')}</button>
                                {results.intermediateTask5 && <div className={`result-message ${results.intermediateTask5.type}`}>{results.intermediateTask5.message}</div>}
                                {showAiButtons.intermediateTask5 && !isTaskCompleted('intermediateTask5') &&
                                    <button
                                        onClick={() => {handleAskAI('intermediateTask5'); setChatMessages([])}}
                                        className="discuss-ai-button mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                        disabled={isAiLoading && activeChatTaskKey === 'intermediateTask5'}
                                    >
                                        {isAiLoading && activeChatTaskKey === 'intermediateTask5' ? 'AI Thinking...' : t('discussAiBtn')}
                                    </button>
                                }
                                {activeChatTaskKey === 'intermediateTask5' && (
                                    <div className="mt-4">
                                        <AiChatWindow
                                            messages={chatMessages}
                                            isLoading={isAiLoading}
                                            onSendMessage={(message) => handleAskAI('intermediateTask5', message)}
                                        />
                                        <button
                                            onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); }}
                                            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Close AI Chat
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ======================================= */}
                        {/* =========== ADVANCED LEVEL ============ */}
                        {/* ======================================= */}
                        <div className="level-section">
                            <h3 className="text-xl font-bold text-red-700 mb-4">{t('advancedLevel')}</h3>

                            {/* Task 1 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">
                                    {t('advancedTask1Title')}
                                    {isTaskCompleted('advancedTask1') && !progressLoading && <span className='completed-text'>{t('completedText')}</span>}
                                </h4>
                                <p className="mb-3 text-sm text-gray-600">{t('advancedTask1Desc')}</p>
                                <ul className="list-disc list-inside mb-3 text-sm text-gray-600">
                                    <li>{t('advancedTask1Q1')}</li><li>{t('advancedTask1Q2')}</li><li>{t('advancedTask1Q3')}</li><li>{t('advancedTask1Q4')}</li>
                                </ul>
                                <p className="font-medium mb-2">{t('chooseOne')}</p>
                                <select
                                    className="border rounded px-2 py-1 mb-3 w-full bg-white"
                                    value={answers.advancedTask1?.selectedProverb || ''}
                                    onChange={(e) => handleAnswerChange('advancedTask1', 'selectedProverb', e.target.value)}
                                    disabled={isTaskCompleted('advancedTask1') || progressLoading}
                                >
                                    <option value="">{t('selectOptionDefault')}</option>
                                    <option value={t('advancedTask1Option1')}>{t('advancedTask1Option1')}</option>
                                    <option value={t('advancedTask1Option2')}>{t('advancedTask1Option2')}</option>
                                    <option value={t('advancedTask1Option3')}>{t('advancedTask1Option3')}</option>
                                </select>
                                <textarea
                                    className="border rounded px-2 py-1 w-full h-32 mt-1"
                                    placeholder={t('analysisLabel')}
                                    value={answers.advancedTask1?.analysis || ''}
                                    onChange={(e) => handleAnswerChange('advancedTask1', 'analysis', e.target.value)}
                                    disabled={isTaskCompleted('advancedTask1') || progressLoading}
                                ></textarea>
                                <button
                                    onClick={() => handleSubmit('advancedTask1')}
                                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                    disabled={isTaskCompleted('advancedTask1') || progressLoading}
                                >{t('submitBtn')}</button>
                                {results.advancedTask1 && <div className={`result-message ${results.advancedTask1.type}`}>{results.advancedTask1.message}</div>}
                                {showAiButtons.advancedTask1 && !isTaskCompleted('advancedTask1') &&
                                    <button
                                        onClick={() => {handleAskAI('advancedTask1'); setChatMessages([])}}
                                        className="discuss-ai-button mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                        disabled={isAiLoading && activeChatTaskKey === 'advancedTask1'}
                                    >
                                        {isAiLoading && activeChatTaskKey === 'advancedTask1' ? 'AI Thinking...' : t('discussAiBtn')}
                                    </button>
                                }
                                {activeChatTaskKey === 'advancedTask1' && (
                                    <div className="mt-4">
                                        <AiChatWindow
                                            messages={chatMessages}
                                            isLoading={isAiLoading}
                                            onSendMessage={(message) => handleAskAI('advancedTask1', message)}
                                        />
                                        <button
                                            onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); }}
                                            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Close AI Chat
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Task 2 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">
                                    {t('advancedTask2Title')}
                                    {isTaskCompleted('advancedTask2') && !progressLoading && <span className='completed-text'>{t('completedText')}</span>}
                                </h4>
                                <p className="mb-3 text-sm text-gray-600">{t('advancedTask2Desc')}</p>
                                <p className="italic text-sm text-gray-500 mb-2" dangerouslySetInnerHTML={{ __html: t('advancedTask2Example') }} />
                                <p className="font-medium mb-2">{t('chooseOne')}</p>
                                <select
                                    className="border rounded px-2 py-1 mb-3 w-full bg-white"
                                    value={answers.advancedTask2?.selectedProverb || ''}
                                    onChange={(e) => handleAnswerChange('advancedTask2', 'selectedProverb', e.target.value)}
                                    disabled={isTaskCompleted('advancedTask2') || progressLoading}
                                >
                                    <option value="">{t('selectOptionDefault')}</option>
                                    <option value={t('advancedTask2Option1')}>{t('advancedTask2Option1')}</option>
                                    <option value={t('advancedTask2Option2')}>{t('advancedTask2Option2')}</option>
                                    <option value={t('advancedTask2Option3')}>{t('advancedTask2Option3')}</option>
                                </select>
                                <label className="block text-sm font-medium text-gray-700 mt-2">{t('similarProverbLabel')}</label>
                                <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full mt-1"
                                    placeholder={language === 'ru' ? 'Введите похожую пословицу...' : 'Enter similar proverb...'}
                                    value={answers.advancedTask2?.similarProverb || ''}
                                    onChange={(e) => handleAnswerChange('advancedTask2', 'similarProverb', e.target.value)}
                                    disabled={isTaskCompleted('advancedTask2') || progressLoading}
                                />
                                <label className="block text-sm font-medium text-gray-700 mt-2">{t('analysisLabel')}</label>
                                <textarea
                                    className="border rounded px-2 py-1 w-full h-32 mt-1"
                                    placeholder={language === 'ru' ? 'Сравните культурные ценности...' : 'Compare cultural values...'}
                                    value={answers.advancedTask2?.analysis || ''}
                                    onChange={(e) => handleAnswerChange('advancedTask2', 'analysis', e.target.value)}
                                    disabled={isTaskCompleted('advancedTask2') || progressLoading}
                                ></textarea>
                                <button
                                    onClick={() => handleSubmit('advancedTask2')}
                                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                    disabled={isTaskCompleted('advancedTask2') || progressLoading}
                                >{t('submitBtn')}</button>
                                {results.advancedTask2 && <div className={`result-message ${results.advancedTask2.type}`}>{results.advancedTask2.message}</div>}
                                {showAiButtons.advancedTask2 && !isTaskCompleted('advancedTask2') &&
                                    <button
                                        onClick={() => {handleAskAI('advancedTask2'); setChatMessages([])}}
                                        className="discuss-ai-button mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                        disabled={isAiLoading && activeChatTaskKey === 'advancedTask2'}
                                    >
                                        {isAiLoading && activeChatTaskKey === 'advancedTask2' ? 'AI Thinking...' : t('discussAiBtn')}
                                    </button>
                                }
                                {activeChatTaskKey === 'advancedTask2' && (
                                    <div className="mt-4">
                                        <AiChatWindow
                                            messages={chatMessages}
                                            isLoading={isAiLoading}
                                            onSendMessage={(message) => handleAskAI('advancedTask2', message)}
                                        />
                                        <button
                                            onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); }}
                                            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Close AI Chat
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Task 3 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">
                                    {t('advancedTask3Title')}
                                    {isTaskCompleted('advancedTask3') && !progressLoading && <span className='completed-text'>{t('completedText')}</span>}
                                </h4>
                                <p className="mb-3 text-sm text-gray-600">{t('advancedTask3Desc')}</p>
                                {[
                                    { key: 'q1', answerKey: 'q1_debate_args', quoteKey: 'advancedTask3Prov1Quote', agreeKey: 'advancedTask3Prov1Agree', disagreeKey: 'advancedTask3Prov1Disagree' },
                                    { key: 'q2', answerKey: 'q2_debate_args', quoteKey: 'advancedTask3Prov2Quote', agreeKey: 'advancedTask3Prov2Agree', disagreeKey: 'advancedTask3Prov2Disagree' },
                                    { key: 'q3', answerKey: 'q3_debate_args', quoteKey: 'advancedTask3Prov3Quote', agreeKey: 'advancedTask3Prov3Agree', disagreeKey: 'advancedTask3Prov3Disagree' },
                                ].map(item => (
                                    <div key={item.key} className="mb-4">
                                        <p className="font-medium">"{t(item.quoteKey)}"</p>
                                        <p className="text-xs text-gray-500 mb-1">{t(item.agreeKey)}</p>
                                        <p className="text-xs text-gray-500 mb-1">{t(item.disagreeKey)}</p>
                                        <textarea
                                            className="border rounded px-2 py-1 w-full h-24 mt-2"
                                            placeholder={language === 'ru' ? 'Ваши аргументы...' : 'Your arguments...'}
                                            value={answers.advancedTask3?.[item.answerKey] || ''}
                                            onChange={(e) => handleAnswerChange('advancedTask3', item.answerKey, e.target.value)}
                                            disabled={isTaskCompleted('advancedTask3') || progressLoading}
                                        ></textarea>
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleSubmit('advancedTask3')}
                                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                    disabled={isTaskCompleted('advancedTask3') || progressLoading}
                                >{t('submitBtn')}</button>
                                {results.advancedTask3 && <div className={`result-message ${results.advancedTask3.type}`}>{results.advancedTask3.message}</div>}
                                {showAiButtons.advancedTask3 && !isTaskCompleted('advancedTask3') &&
                                    <button
                                        onClick={() => {handleAskAI('advancedTask3'); setChatMessages([])}}
                                        className="discuss-ai-button mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                        disabled={isAiLoading && activeChatTaskKey === 'advancedTask3'}
                                    >
                                        {isAiLoading && activeChatTaskKey === 'advancedTask3' ? 'AI Thinking...' : t('discussAiBtn')}
                                    </button>
                                }
                                {activeChatTaskKey === 'advancedTask3' && (
                                    <div className="mt-4">
                                        <AiChatWindow
                                            messages={chatMessages}
                                            isLoading={isAiLoading}
                                            onSendMessage={(message) => handleAskAI('advancedTask3', message)}
                                        />
                                        <button
                                            onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); }}
                                            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Close AI Chat
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Task 4 */}
                            <div className="mb-6 p-4 border rounded-md task-card bg-white">
                                <h4 className="font-semibold mb-2">{t('advancedTask4Title')}</h4>
                                <p className="mb-3 text-sm text-gray-600">{t('advancedTask4Desc')}</p>
                                <p className="italic text-sm text-gray-500 mb-2" dangerouslySetInnerHTML={{ __html: t('advancedTask4Example') }} />
                                <p className="font-medium mb-2">{t('chooseOne')}</p>
                                <select className="border rounded px-2 py-1 mb-3 w-full bg-white">
                                    <option value="">{t('selectOptionDefault')}</option><option value="1">{t('advancedTask4Option1')}</option><option value="2">{t('advancedTask4Option2')}</option><option value="3">{t('advancedTask4Option3')}</option>
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
                                <h4 className="font-semibold mb-2">
                                    {t('advancedTask5Title')}
                                    {isTaskCompleted('advancedTask5') && !progressLoading && <span className='completed-text'>{t('completedText')}</span>}
                                </h4>
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
                                            <input
                                                type="radio"
                                                name="essayTopic"
                                                value={topic.value}
                                                className="radio-input"
                                                onChange={(e) => handleAnswerChange('advancedTask5', 'selectedTopic', e.target.value)}
                                                checked={answers.advancedTask5?.selectedTopic === topic.value}
                                                disabled={isTaskCompleted('advancedTask5') || progressLoading}
                                            />
                                            <span>{t(topic.textKey)}</span>
                                        </label>
                                    </div>
                                    ))}
                                </div>
                                <textarea
                                    className="border rounded px-2 py-1 w-full h-64"
                                    placeholder={language === 'ru' ? 'Ваше эссе (примерно 300 слов)...' : 'Your essay (approx. 300 words)...'}
                                    value={answers.advancedTask5?.essayText || ''}
                                    onChange={(e) => handleAnswerChange('advancedTask5', 'essayText', e.target.value)}
                                    disabled={isTaskCompleted('advancedTask5') || progressLoading}
                                ></textarea>
                                <button
                                    onClick={() => handleSubmit('advancedTask5')}
                                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                    disabled={isTaskCompleted('advancedTask5') || progressLoading}
                                >{t('submitBtn')}</button>
                                {results.advancedTask5 && <div className={`result-message ${results.advancedTask5.type}`}>{results.advancedTask5.message}</div>}
                                {showAiButtons.advancedTask5 && !isTaskCompleted('advancedTask5') &&
                                    <button
                                        onClick={() => {handleAskAI('advancedTask5'); setChatMessages([])}}
                                        className="discuss-ai-button mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                        disabled={isAiLoading && activeChatTaskKey === 'advancedTask5'}
                                    >
                                        {isAiLoading && activeChatTaskKey === 'advancedTask5' ? 'AI Thinking...' : t('discussAiBtn')}
                                    </button>
                                }
                                {activeChatTaskKey === 'advancedTask5' && (
                                    <div className="mt-4">
                                        <AiChatWindow
                                            messages={chatMessages}
                                            isLoading={isAiLoading}
                                            onSendMessage={(message) => handleAskAI('advancedTask5', message)}
                                        />
                                        <button
                                            onClick={() => { setActiveChatTaskKey(null); setChatMessages([]); }}
                                            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Close AI Chat
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </React.Fragment>
    );
};

export default CulturalProverbsModule;
