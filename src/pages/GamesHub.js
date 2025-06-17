import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder for language context
// import { useLanguage } from '../contexts/LanguageContext';

/**
 * A reusable card component for displaying an interactive game.
 * @param {object} props - The props for the component.
 * @param {string} props.title - The title of the game.
 * @param {string} props.description - The description of the game.
 * @param {string} props.linkTo - The path for the button link.
 * @param {string} props.linkText - The text for the button link.
 * @param {JSX.Element} props.icon - The SVG icon for the game.
 * @param {string} props.colorTheme - The color theme for the card (e.g., 'blue', 'green').
 */
const GameCard = ({ title, description, linkTo, linkText, icon, colorTheme = 'gray' }) => {
    const colorClasses = {
        blue: { title: 'text-blue-700', button: 'bg-blue-500 hover:bg-blue-600', iconBg: 'bg-blue-500' },
        green: { title: 'text-green-700', button: 'bg-green-500 hover:bg-green-600', iconBg: 'bg-green-500' },
        pink: { title: 'text-pink-700', button: 'bg-pink-500 hover:bg-pink-600', iconBg: 'bg-pink-500' },
        orange: { title: 'text-orange-700', button: 'bg-orange-500 hover:bg-orange-600', iconBg: 'bg-orange-500' },
        yellow: { title: 'text-yellow-700', button: 'bg-yellow-500 hover:bg-yellow-600', iconBg: 'bg-yellow-500' },
        red: { title: 'text-red-700', button: 'bg-red-500 hover:bg-red-600', iconBg: 'bg-red-500' },
        purple: { title: 'text-purple-700', button: 'bg-purple-500 hover:bg-purple-600', iconBg: 'bg-purple-500' },
        cyan: { title: 'text-cyan-700', button: 'bg-cyan-500 hover:bg-cyan-600', iconBg: 'bg-cyan-500' },
        teal: { title: 'text-teal-700', button: 'bg-teal-500 hover:bg-teal-600', iconBg: 'bg-teal-500' },
    };

    const theme = colorClasses[colorTheme] || colorClasses.blue;

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between h-full module-card">
            <div>
                <div className={`w-14 h-14 rounded-md flex items-center justify-center text-white mb-3 ${theme.iconBg}`}>
                    {icon}
                </div>
                <h2 className={`text-xl font-semibold ${theme.title} mb-2`}>{title}</h2>
                <p className="text-gray-600 text-sm mb-4">{description}</p>
            </div>
            <Link to={linkTo} className={`mt-auto inline-block text-white text-center px-6 py-2 rounded-md text-sm font-medium transition duration-300 w-full ${theme.button}`}>
                {linkText}
            </Link>
        </div>
    );
};

/**
 * The Games Hub page component.
 * Displays a grid of available interactive games.
 */
const GamesHub = () => {
    const language = localStorage.getItem('logiclingua-lang') || 'ru';

    const translations = {
        ru: {
            mainTitle: "Центр Игр и Интерактивных Заданий",
            playButton: "Играть",
            gameFactOrFakeTitle: "Факт или Фейк?",
            gameFactOrFakeDesc: "Определяйте, какие новостные заголовки правдивы, а какие — вымысел.",
            gameFindBiasTitle: "Найди Предвзятость!",
            gameFindBiasDesc: "Анализируйте тексты и выявляйте предвзятые формулировки и скрытые мнения.",
            gameMoralCompassTitle: "Игра \"Моральный Компас\"",
            gameMoralCompassDesc: "Принимайте решения в этических дилеммах и анализируйте их последствия.",
            gameEmojiDebateTitle: "Эмодзи Дебаты",
            gameEmojiDebateDesc: "Интерпретируйте новостные сюжеты, представленные с помощью эмодзи, и обсуждайте их смысл.",
            gameDebateAiTitle: "Дебаты с ИИ",
            gameDebateAiDesc: "Практикуйтесь в аргументации с виртуальным оппонентом на различные темы.",
            gameMisinformationMazeTitle: "Лабиринт Дезинформации",
            gameMisinformationMazeDesc: "Находите и исправляйте ложные факты в статьях, чтобы выбраться из лабиринта.",
            gameLogicalFallacyHuntTitle: "Охота на Логические Ошибки",
            gameLogicalFallacyHuntDesc: "Находите логические несоответствия и ошибки в представленных аргументах.",
            gamePropagandaDetectorTitle: "Детектор Пропаганды",
            gamePropagandaDetectorDesc: "Анализируйте заявления и выявляйте техники, используемые в пропаганде.",
            gameLeaderSimTitle: "Симуляция \"Если бы я был лидером\"",
            gameLeaderSimDesc: "Принимайте решения в роли государственного деятеля в условиях кризисных ситуаций.",
        },
        en: {
            mainTitle: "Games and Interactive Tasks Hub",
            playButton: "Play",
            gameFactOrFakeTitle: "Fact or Fake?",
            gameFactOrFakeDesc: "Determine which news headlines are true and which are fiction.",
            gameFindBiasTitle: "Find the Bias!",
            gameFindBiasDesc: "Analyze texts and identify biased phrasings and hidden opinions.",
            gameMoralCompassTitle: "Moral Compass Game",
            gameMoralCompassDesc: "Make decisions in ethical dilemmas and analyze their consequences.",
            gameEmojiDebateTitle: "Emoji Debate",
            gameEmojiDebateDesc: "Interpret news stories presented with emojis and discuss their meaning.",
            gameDebateAiTitle: "Debate with AI",
            gameDebateAiDesc: "Practice argumentation with a virtual opponent on various topics.",
            gameMisinformationMazeTitle: "Misinformation Maze",
            gameMisinformationMazeDesc: "Find and correct false facts in articles to escape the maze.",
            gameLogicalFallacyHuntTitle: "Logical Fallacy Hunt",
            gameLogicalFallacyHuntDesc: "Find logical inconsistencies and errors in presented arguments.",
            gamePropagandaDetectorTitle: "Propaganda Detector",
            gamePropagandaDetectorDesc: "Analyze statements and identify techniques used in propaganda.",
            gameLeaderSimTitle: "\"If I Were a Leader\" Simulation",
            gameLeaderSimDesc: "Make decisions as a statesperson in crisis situations.",
        }
    };
    
    const t = translations[language];

    const games = [
        { title: t.gameFactOrFakeTitle, description: t.gameFactOrFakeDesc, linkTo: "/games/fact-or-fake", colorTheme: 'blue', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg> },
        { title: t.gameFindBiasTitle, description: t.gameFindBiasDesc, linkTo: "/games/find-bias", colorTheme: 'green', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg> },
        { title: t.gameMoralCompassTitle, description: t.gameMoralCompassDesc, linkTo: "/games/moral-compass", colorTheme: 'pink', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg> },
        { title: t.gameEmojiDebateTitle, description: t.gameEmojiDebateDesc, linkTo: "/games/emoji-debate", colorTheme: 'orange', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg> },
        { title: t.gameDebateAiTitle, description: t.gameDebateAiDesc, linkTo: "/games/debate-ai", colorTheme: 'yellow', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" /></svg> },
        { title: t.gameMisinformationMazeTitle, description: t.gameMisinformationMazeDesc, linkTo: "/games/misinformation-maze", colorTheme: 'red', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a18.373 18.373 0 010-5.19m0 5.19a18.373 18.373 0 00-5.84 7.38m5.84-7.38L18.14 12m-2.55 2.37A6 6 0 0112.73 8a5.96 5.96 0 014.24-1.76l.71.71m-4.95 4.95a7.5 7.5 0 010-10.6M12 12l.354-.354m-2.122 2.122l1.414-1.414M4.5 4.5l.707.707M18.14 12l-5.84-5.84" /></svg> },
        { title: t.gameLogicalFallacyHuntTitle, description: t.gameLogicalFallacyHuntDesc, linkTo: "/games/logical-fallacy-hunt", colorTheme: 'purple', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg> },
        { title: t.gamePropagandaDetectorTitle, description: t.gamePropagandaDetectorDesc, linkTo: "/games/propaganda-detector", colorTheme: 'cyan', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.11v1.093c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.78.93l-.15.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.149-.894c-.07-.424-.384-.764-.78-.93-.398-.164-.854-.142-1.204.108l-.738.527a1.125 1.125 0 01-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.738c.25-.35.273-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.11v-1.094c0-.55.398-1.019.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.93l.15-.893z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
        { title: t.gameLeaderSimTitle, description: t.gameLeaderSimDesc, linkTo: "/games/leader-simulation", colorTheme: 'teal', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg> },
    ];

    return (
        <>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
                {t.mainTitle}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {games.map((game, index) => (
                    <GameCard 
                        key={index}
                        {...game}
                        linkText={t.playButton}
                    />
                ))}
            </div>
        </>
    );
};

export default GamesHub;
