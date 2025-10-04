import React, { memo } from 'react';
import { useThemeStore } from '../store';

const ThemeToggle = memo(() => {
  console.log('ThemeToggle rendered');
  
  const theme = useThemeStore(state => state.theme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);

  return (
    <button onClick={toggleTheme} className="theme-toggle">
      {theme === 'light' ? '🌙' : '☀️'} {theme}
    </button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;
