export const moduleDefinitions = [
  {
    id: 'cultural-proverbs',
    translationKey: 'module1Title', // Key for translated name in PersonalAccount's translations
    totalTasks: 10, // Example total tasks
    colorClass: 'bg-indigo-600',
  },
  {
    id: 'fact-opinion',
    translationKey: 'module3Title', // Key for translated name
    totalTasks: 15, // Example total tasks
    colorClass: 'bg-green-500',
  },
  {
    id: 'debating',
    translationKey: 'module2Title', // Key for translated name
    totalTasks: 8,  // Example total tasks
    colorClass: 'bg-yellow-500',
  },
  // Add other modules here if they should be displayed on the PersonalAccount page
];

// Function to get a definition by id, if needed elsewhere
export const getModuleDefinitionById = (id) => {
  return moduleDefinitions.find(module => module.id === id);
};
