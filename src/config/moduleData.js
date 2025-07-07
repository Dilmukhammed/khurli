export const moduleDefinitions = [
  {
    id: 'cultural-proverbs',
    translationKey: 'module1Title', // Key for translated name in PersonalAccount's translations
    totalTasks: 14, // Adjusted: 4 completable + 10 discussion tasks
    colorClass: 'bg-indigo-600',
  },
  {
    id: 'fact-opinion',
    translationKey: 'module3Title', // Key for translated name
    totalTasks: 7, // Adjusted: bTask1, bTask3, aTask1 (completed) + bTask2, iTask1, iTask2, aTask2 (discussion)
    colorClass: 'bg-green-500',
  },
  {
    id: 'debating',
    translationKey: 'module2Title', // Key for translated name
    totalTasks: 7,  // Adjusted: bTask1, bTask3, iTask2, iTask3, aTask2, aTask3, aTask4 (all discussion)
    colorClass: 'bg-yellow-500',
  },
  // Add other modules here if they should be displayed on the PersonalAccount page
];

// Function to get a definition by id, if needed elsewhere
export const getModuleDefinitionById = (id) => {
  return moduleDefinitions.find(module => module.id === id);
};
