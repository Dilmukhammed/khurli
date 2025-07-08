import React, { useState, useEffect, useCallback } from 'react';
import moduleService from '../../services/moduleService';
import AiChatWindow from '../../components/common/AiChatWindow';

// Translations and game data for the Misinformation Maze game
const gameData = {
    ru: {
        pageTitle: "Игра: Лабиринт Дезинформации",
        gameTitle: "Игра: Лабиринт Дезинформации",
        gameInstructions: "Внимательно прочитайте текст ниже. Затем оцените каждое утверждение как \"Верно\" или \"Ложно\", основываясь на тексте и ваших общих знаниях. Если утверждение ложно, укажите правильную информацию (если знаете).",
        articleTitle: "Новый Технопарк в Самарканде Обещает Революцию",
        articleContent: "Вчера в Самарканде, древней столице России, состоялось торжественное открытие крупнейшего в мире технопарка 'Silk Road Innovations'. На церемонии присутствовал президент Франции Эммануэль Макрон. Технопарк специализируется на разработке искусственного интеллекта для сельского хозяйства и планирует создать более 50 тысяч рабочих мест к концу года. Основным инвестором проекта выступила компания Google.",
        statementsTitle: "Утверждения для проверки:",
        optionTrue: "Верно",
        optionFalse: "Ложно",
        correctionPlaceholder: "Ваше исправление (если ложно)...",
        checkAnswersButton: "Проверить ответы",
        feedbackCorrect: "Верно!",
        feedbackIncorrect: "Ложно.",
        feedbackCorrectInfo: "Правильная информация:",
        resultAllCorrect: "Отлично! Вы успешно выбрались из лабиринта дезинформации!",
        resultSomeIncorrect: "Некоторые утверждения оценены неверно. Проверьте выделенные пункты.",
        resultScore: "Ваш результат:",
        statement1_text: "Технопарк 'Silk Road Innovations' открылся в Самарканде.",
        statement2_text: "Самарканд - древняя столица России.",
        statement2_correction: "Самарканд - древний город в Узбекистане, был столицей империи Тамерлана.",
        statement3_text: "На открытии присутствовал президент Франции.",
        statement3_correction: "В тексте упомянут президент Франции, но нет информации о его присутствии на открытии (это вымышленная деталь).",
        statement4_text: "Технопарк является крупнейшим в мире.",
        statement4_correction: "Утверждение о 'крупнейшем в мире' скорее всего является преувеличением, характерным для дезинформации.",
        statement5_text: "Основным инвестором проекта является Google.",
        statement5_correction: "Информация об инвесторе Google вымышлена для этого примера.",
        askAiButton: "Спросить ИИ",
        aiThinking: "ИИ думает...",
        closeAiChatButton: "Закрыть чат",
    },
    en: {
        pageTitle: "Game: Misinformation Maze",
        gameTitle: "Game: Misinformation Maze",
        gameInstructions: "Read the text below carefully. Then, evaluate each statement as \"True\" or \"False\" based on the text and your general knowledge. If a statement is false, provide the correct information (if you know it).",
        articleTitle: "New Tech Park in Samarkand Promises a Revolution",
        articleContent: "Yesterday in Samarkand, the ancient capital of Russia, the grand opening of the world's largest tech park 'Silk Road Innovations' took place. The ceremony was attended by French President Emmanuel Macron. The tech park specializes in developing artificial intelligence for agriculture and plans to create over 50,000 jobs by the end of the year. The main investor in the project was Google.",
        statementsTitle: "Statements to Check:",
        optionTrue: "True",
        optionFalse: "False",
        correctionPlaceholder: "Your correction (if false)...",
        checkAnswersButton: "Check Answers",
        feedbackCorrect: "Correct!",
        feedbackIncorrect: "False.",
        feedbackCorrectInfo: "Correct information:",
        resultAllCorrect: "Excellent! You have successfully navigated the misinformation maze!",
        resultSomeIncorrect: "Some statements were evaluated incorrectly. Check the highlighted items.",
        resultScore: "Your score:",
        statement1_text: "The 'Silk Road Innovations' tech park opened in Samarkand.",
        statement2_text: "Samarkand is the ancient capital of Russia.",
        statement2_correction: "Samarkand is an ancient city in Uzbekistan, it was the capital of Tamerlane's empire.",
        statement3_text: "The President of France attended the opening.",
        statement3_correction: "The text mentions the French President, but there's no information about his attendance at the opening (this is a fictional detail).",
        statement4_text: "The tech park is the largest in the world.",
        statement4_correction: "The claim of 'largest in the world' is likely an exaggeration typical of misinformation.",
        statement5_text: "The main investor in the project is Google.",
        statement5_correction: "The information about Google being the investor is fictional for this example.",
        askAiButton: "Ask AI",
        aiThinking: "AI Thinking...",
        closeAiChatButton: "Close AI Chat",
    }
};

// Game data: Array of statement objects
const gameStatements = [
    { id: 'statement1', text_key: 'statement1_text', correct: true },
    { id: 'statement2', text_key: 'statement2_text', correct: false, correction_key: 'statement2_correction' },
    { id: 'statement3', text_key: 'statement3_text', correct: false, correction_key: 'statement3_correction' },
    { id: 'statement4', text_key: 'statement4_text', correct: false, correction_key: 'statement4_correction' },
    { id: 'statement5', text_key: 'statement5_text', correct: false, correction_key: 'statement5_correction' }
];

export default function MisinformationMazeGame() {
    const [lang, setLang] = useState(localStorage.getItem('logiclingua-lang') || 'ru');
    const [userAnswers, setUserAnswers] = useState({});
    const [results, setResults] = useState({ feedback: '', score: null, details: {} });
    const [showMainAiButton, setShowMainAiButton] = useState(false);
    const [activeChat, setActiveChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [currentError, setCurrentError] = useState('');

    useEffect(() => {
        const t = gameData[lang];
        document.title = t.pageTitle;
        const handleStorageChange = (event) => {
            if (event.key === 'logiclingua-lang') {
                setLang(event.newValue || 'ru');
                setUserAnswers({});
                setResults({ feedback: '', score: null, details: {} });
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [lang]);

    const handleAnswerChange = (statementId, answer) => {
        setUserAnswers(prev => ({ ...prev, [statementId]: answer }));
    };

    const checkAnswers = () => {
        let correctCount = 0;
        const newResultDetails = {};
        gameStatements.forEach(stmt => {
            const userAnswer = userAnswers[stmt.id] === 'true';
            if (userAnswer === stmt.correct) {
                correctCount++;
                newResultDetails[stmt.id] = 'correct';
            } else {
                newResultDetails[stmt.id] = 'incorrect';
            }
        });

        const t = gameData[lang];
        if (correctCount === gameStatements.length) {
            setResults({ feedback: t.resultAllCorrect, score: correctCount, details: newResultDetails });
        } else {
            setResults({
                feedback: `${t.resultScore} ${correctCount} / ${gameStatements.length}. ${t.resultSomeIncorrect}`,
                score: correctCount,
                details: newResultDetails
            });
        }
        setShowMainAiButton(true);
        setActiveChat(false);
        setChatMessages([]);
        setCurrentError('');
    };

    const getTaskDetailsForAI_MisinformationMaze = useCallback(() => {
        const t = gameData[lang];
        const contextParts = [
            `Game: ${t.gameTitle}`,
            `Instructions: ${t.gameInstructions}`,
            `Article Title: ${t.articleTitle}`,
            `Article Content: "${t.articleContent}"`,
            "Statements presented to the user for verification:"
        ];
        gameStatements.forEach((stmt, index) => {
            contextParts.push(`${index + 1}. "${t[stmt.text_key]}"`);
        });

        const userAnswersFormatted = gameStatements.map((stmt, index) => {
            const userAnswerRaw = userAnswers[stmt.id];
            const userAnswerText = userAnswerRaw === 'true' ? t.optionTrue : (userAnswerRaw === 'false' ? t.optionFalse : 'Not answered');
            // Assuming user corrections are stored in a similar way to answers, e.g., userCorrections[stmt.id]
            // For now, let's assume corrections are not directly passed or are part of a general user query if they want to discuss a specific correction.
            // Or, if corrections are input directly in the UI and stored, they could be added here.
            // For this initial implementation, we'll focus on the true/false answers.
            const correctAnswerText = stmt.correct ? t.optionTrue : t.optionFalse;
            const isCorrect = (userAnswerRaw === 'true' && stmt.correct) || (userAnswerRaw === 'false' && !stmt.correct) ? 'Correct' : 'Incorrect';

            let statementDetail = `Statement ${index + 1} ("${t[stmt.text_key].substring(0, 50)}..."): You answered '${userAnswerText}'. Correct was '${correctAnswerText}'. (${isCorrect})`;
            if (userAnswerRaw === 'false' && userAnswers[`${stmt.id}_correction`]) { // Assuming correction is stored with id + "_correction"
                statementDetail += ` Your correction: "${userAnswers[`${stmt.id}_correction`]}"`;
            }
            return statementDetail;
        }).join('\n');

        let resultsSummary = "User has not checked answers yet.";
        if (results && results.feedback) {
            resultsSummary = `User's results: ${results.feedback}`;
        }

        return {
            block_context: contextParts.join('\n'),
            user_inputs: [userAnswersFormatted, `Results Summary: ${resultsSummary}`],
            // TODO: Change this back to 'discuss_game_misinformation_maze' once backend supports it.
            interaction_type: 'discuss_game_find_bias'
        };
    }, [lang, userAnswers, results]);

    const handleAskAI_MisinformationMaze = useCallback(async (userQuery = '') => {
        if (isAiLoading) return;
        setIsAiLoading(true);
        setActiveChat(true);
        setCurrentError('');
        const t = gameData[lang];
        
        try {
            const { block_context, user_inputs, interaction_type } = getTaskDetailsForAI_MisinformationMaze();

            // Filter out any existing "Thinking..." message before sending to API
            if (userQuery) { // ensure current userQuery is part of messagesForApi if not added before
                setChatMessages(prev => [...prev, { "role": 'user', "content": userQuery }]);
            }


            const response = await moduleService.getGenericAiInteraction({
                module_id: 'game-misinformation-maze', // Specific module ID for this game
                task_id: 'main_game', // Specific task ID
                interaction_type,
                block_context,
                user_inputs,
                userQuery, // Send the current user query separately as well
                chatMessages, // Send the filtered chat history
            });

            setChatMessages(prev => [
                ...prev.filter(msg => msg.content !== (t.aiThinking || 'Thinking...')),
                { "role": 'assistant', "content": response.explanation }
            ]);
        } catch (error) {
            console.error('Error fetching AI for MisinformationMazeGame:', error);
            const errorMsg = error.message || 'Failed to get AI response.';
            setChatMessages(prev => [
                ...prev.filter(msg => msg.content !== (t.aiThinking || 'Thinking...')),
                { "role": 'assistant', "content": `Sorry, I encountered an error: ${errorMsg}` }
            ]);
            setCurrentError(errorMsg);
        } finally {
            setIsAiLoading(false);
        }
    }, [isAiLoading, getTaskDetailsForAI_MisinformationMaze, lang, chatMessages]); // Added chatMessages to dependencies

    const t = gameData[lang];

    return (
        <main className="container mx-auto px-6 py-12 flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-red-700 mb-4 text-center">{t.gameTitle}</h1>
                <p className="text-gray-600 mb-6 text-center">{t.gameInstructions}</p>

                <div className="article-text bg-gray-50 border border-gray-200 p-4 rounded-md mb-6 leading-relaxed text-gray-700">
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">{t.articleTitle}</h2>
                    <p>{t.articleContent}</p>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">{t.statementsTitle}</h3>
                <div id="statements-container" className="space-y-4">
                    {gameStatements.map((stmt, index) => {
                        const result = results.details[stmt.id];
                        const isIncorrect = result === 'incorrect';
                        return (
                            <div key={stmt.id} className={`statement-card bg-white p-6 rounded-lg shadow-sm border-l-4 ${
                                result === 'correct' ? 'border-emerald-500' : isIncorrect ? 'border-red-500' : 'border-transparent'
                            }`}>
                                <p className="text-gray-800 mb-3">{`${index + 1}. ${t[stmt.text_key]}`}</p>
                                <div className="flex items-center space-x-4 mb-2">
                                    <label className="radio-label flex items-center">
                                        <input type="radio" name={stmt.id} value="true" onChange={() => handleAnswerChange(stmt.id, 'true')} className="form-radio h-4 w-4 text-emerald-600 focus:ring-emerald-500" />
                                        <span className="ml-2 text-sm">{t.optionTrue}</span>
                                    </label>
                                    <label className="radio-label flex items-center">
                                        <input type="radio" name={stmt.id} value="false" onChange={() => handleAnswerChange(stmt.id, 'false')} className="form-radio h-4 w-4 text-red-600 focus:ring-red-500" />
                                        <span className="ml-2 text-sm">{t.optionFalse}</span>
                                    </label>
                                </div>
                                {isIncorrect && (
                                    <>
                                        <input type="text" placeholder={t.correctionPlaceholder} className="correction-input w-full mt-2 p-2 border border-gray-300 rounded-md text-sm" />
                                        <div className="feedback-text text-red-600 text-sm mt-2 font-medium">
                                            {`${t.feedbackIncorrect} ${stmt.correction_key ? `${t.feedbackCorrectInfo} ${t[stmt.correction_key]}` : ''}`}
                                        </div>
                                    </>
                                )}
                                {result === 'correct' && (
                                     <div className="feedback-text text-emerald-600 text-sm mt-2 font-medium">
                                        {t.feedbackCorrect}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                <button onClick={checkAnswers} className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                    {t.checkAnswersButton}
                </button>

                {results.feedback && (
                    <div className={`mt-6 text-center text-lg font-semibold ${results.score === gameStatements.length ? 'text-emerald-600' : 'text-red-600'}`}>
                        {results.feedback}
                    </div>
                )}

                {showMainAiButton && !currentError && (
                    <div className="mt-4"> {/* Wrapper for Ask AI button */}
                        <button
                            onClick={() => handleAskAI_MisinformationMaze()} // Call with no initial query to get initial discussion
                            disabled={isAiLoading}
                            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                        >
                            {t.askAiButton}
                        </button>
                    </div>
                )}

                {/* Display currentError if it exists and chat is not active, or if AI button itself failed */}
                {currentError && !activeChat && (
                    <p className="mt-4 text-center text-red-600">{currentError}</p>
                )}

                {activeChat && (
                    <div className="mt-6 p-4 border-t border-gray-200">
                        <AiChatWindow
                            messages={chatMessages}
                            isLoading={isAiLoading}
                            onSendMessage={(message) => handleAskAI_MisinformationMaze(message)}
                        />
                        {/* Display error within chat window if it occurs during an active chat */}
                        {currentError && <p className="mt-2 text-sm text-red-500">{`Error: ${currentError}`}</p>}
                        <button
                            onClick={() => {
                                setActiveChat(false);
                                // Optionally clear chat messages and error when chat is closed:
                                // setChatMessages([]); // Decide if chat history should persist or clear
                                // setCurrentError(''); // Clear error when closing chat
                            }}
                            className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                        >
                            {t.closeAiChatButton}
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
