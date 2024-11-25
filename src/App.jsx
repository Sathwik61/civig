import React, { useState, useEffect } from 'react';
import AppRouter from './router/AppRouter';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for the user's preference
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save the user's preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Pass the toggle function and darkMode state as props to AppRouter if needed */}
      <AppRouter toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
    </div>
  );
};

export default App;
