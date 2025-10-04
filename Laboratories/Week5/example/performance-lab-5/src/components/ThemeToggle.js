import React from 'react';

function ThemeToggle({ theme, toggleTheme }) {
  console.log('ThemeToggle rendered');

  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

export default ThemeToggle;
