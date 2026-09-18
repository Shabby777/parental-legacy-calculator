import React from 'react';

export default function ThemeToggle({ isDark, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label="Toggle theme"
    >
      <span className="text-xl leading-none">
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}

