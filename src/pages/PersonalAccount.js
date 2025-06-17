import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Placeholder for language and auth contexts
// import { useLanguage } from '../contexts/LanguageContext';
// import { useAuth } from '../contexts/AuthContext';

/**
 * A reusable card component for the dashboard layout.
 */
const DashboardCard = ({ children }) => (
  <div className="bg-white p-6 rounded-xl shadow-md h-full">
    {children}
  </div>
);

/**
 * A reusable progress bar component.
 */
const ProgressBar = ({ label, percentage, colorClass = 'bg-indigo-600' }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm font-medium text-gray-700">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

/**
 * A reusable badge component.
 */
const Badge = ({ icon, name, description, achieved = true }) => (
  <div className={`flex items-center p-3 rounded-lg ${achieved ? 'bg-gray-50' : 'bg-gray-200 opacity-60'}`}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${achieved ? 'bg-blue-500' : 'bg-gray-400'}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-800">{name}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </div>
);


/**
 * Personal Account page component.
 * This acts as the user's dashboard.
 */
const PersonalAccount = () => {
  const navigate = useNavigate();
  // Local state for language
  const language = localStorage.getItem('logiclingua-lang') || 'ru';

  // --- Protected Route Logic ---
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) {
      // If the user is not logged in, redirect them to the login page.
      navigate('/login');
    }
  }, [navigate]);
  // -----------------------------

  const translations = {
    ru: {
      welcomeUser: "Добро пожаловать, Dima!",
      dashboardSubtitle: "Ваш прогресс и достижения на Logiclingua.",
      editProfileLink: "Редактировать профиль",
      progressTitle: "Прогресс обучения",
      module1Title: "Анализ культурных пословиц",
      module3Title: "Факт или Мнение",
      module2Title: "Обсуждение социальных вопросов (Дебаты)",
      viewAllModulesLink: "Посмотреть все модули",
      recommendationsTitle: "Рекомендации от ИИ",
      recommendation1: "Попробуйте модуль \"Дебаты\", чтобы улучшить навыки аргументации.",
      recommendation2: "Сыграйте в \"Охоту на Логические Ошибки\" для практики выявления некорректных доводов.",
      recommendation3: "Изучите ресурсы по критическому мышлению в нашей библиотеке.",
      gamificationTitle: "Ваши Достижения",
      pointsLabel: "Баллы",
      levelLabel: "Уровень",
      badgesTitle: "Заработанные Значки",
      badgeCriticalThinker: "Критический мыслитель",
      badgeCriticalThinkerDesc: "Завершение основ анализа",
      badgeProblemSolver: "Решатель проблем",
      badgeProblemSolverDesc: "Успешное решение 5 кейсов",
      badgeChangemaker: "Создатель перемен",
      badgeLocked: "(Заблокировано)",
    },
    en: {
      welcomeUser: "Welcome, Dima!",
      dashboardSubtitle: "Your progress and achievements on Logiclingua.",
      editProfileLink: "Edit Profile",
      progressTitle: "Learning Progress",
      module1Title: "Analyzing Cultural Proverbs",
      module3Title: "Fact vs. Opinion",
      module2Title: "Debating Social Issues",
      viewAllModulesLink: "View All Modules",
      recommendationsTitle: "AI Recommendations",
      recommendation1: "Try the \"Debating\" module to improve your argumentation skills.",
      recommendation2: "Play the \"Logical Fallacy Hunt\" game to practice identifying flawed arguments.",
      recommendation3: "Explore critical thinking resources in our library.",
      gamificationTitle: "Your Achievements",
      pointsLabel: "Points",
      levelLabel: "Level",
      badgesTitle: "Earned Badges",
      badgeCriticalThinker: "Critical Thinker",
      badgeCriticalThinkerDesc: "Completed analysis basics",
      badgeProblemSolver: "Problem Solver",
      badgeProblemSolverDesc: "Successfully solved 5 case studies",
      badgeChangemaker: "Changemaker",
      badgeLocked: "(Locked)",
    }
  };

  const t = translations[language];

  // Mock data for the dashboard
  const userProgress = [
    { label: t.module1Title, percentage: 75, colorClass: 'bg-indigo-600' },
    { label: t.module3Title, percentage: 100, colorClass: 'bg-green-500' },
    { label: t.module2Title, percentage: 20, colorClass: 'bg-yellow-500' },
  ];

  const badges = [
    { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>, name: t.badgeCriticalThinker, description: t.badgeCriticalThinkerDesc, achieved: true },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, name: t.badgeProblemSolver, description: t.badgeProblemSolverDesc, achieved: true },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>, name: t.badgeChangemaker, description: t.badgeLocked, achieved: false },
  ]

  return (
    <>
      <div className="flex items-center mb-10">
        <div className="w-20 h-20 bg-indigo-200 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.welcomeUser}</h1>
          <p className="text-gray-600 mt-1">{t.dashboardSubtitle}</p>
        </div>
        <Link to="#" className="ml-auto text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          {t.editProfileLink}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <DashboardCard>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.progressTitle}</h2>
            <div className="space-y-4">
              {userProgress.map((item, index) => <ProgressBar key={index} {...item} />)}
            </div>
            <Link to="/modules" className="mt-6 inline-block text-indigo-600 hover:text-indigo-800 font-medium text-sm">
              {t.viewAllModulesLink} &rarr;
            </Link>
          </DashboardCard>

          <DashboardCard>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.recommendationsTitle}</h2>
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">💡 {t.recommendation1}</p>
              <p className="text-gray-600 text-sm">🎮 {t.recommendation2}</p>
              <p className="text-gray-600 text-sm">📚 {t.recommendation3}</p>
            </div>
          </DashboardCard>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <DashboardCard>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">{t.gamificationTitle}</h2>
            <div className="flex justify-around items-center">
              <div>
                <p className="text-sm text-gray-500">{t.pointsLabel}</p>
                <p className="text-3xl font-bold text-yellow-500">1250</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t.levelLabel}</p>
                <p className="text-3xl font-bold text-yellow-500">5</p>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.badgesTitle}</h2>
            <div className="space-y-3">
              {badges.map((badge, index) => <Badge key={index} {...badge} />)}
            </div>
          </DashboardCard>
        </div>
      </div>
    </>
  );
};

export default PersonalAccount;
