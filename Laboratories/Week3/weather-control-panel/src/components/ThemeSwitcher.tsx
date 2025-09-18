import React from 'react';
import { ITheme } from '../types/IWeather';

interface ThemeSwitcherProps {
  currentTheme: ITheme;
  onThemeChange: (theme: ITheme) => void;
  themes: ITheme[];
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  currentTheme, 
  onThemeChange, 
  themes 
}) => {
  return (
    <div className="theme-switcher">
      <div className="theme-switcher-label">
        <span className="theme-icon">🎨</span>
        <span>Theme</span>
      </div>
      <div className="theme-options">
        {themes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => onThemeChange(theme)}
            className={`theme-option ${currentTheme.name === theme.name ? 'active' : ''}`}
            style={{
              backgroundColor: theme.primary,
              color: theme.text,
              borderColor: currentTheme.name === theme.name ? theme.secondary : 'transparent'
            }}
            title={`Switch to ${theme.name} theme`}
          >
            <div className="theme-preview">
              <div 
                className="theme-preview-bg" 
                style={{ backgroundColor: theme.background }}
              ></div>
              <div 
                className="theme-preview-surface" 
                style={{ backgroundColor: theme.surface }}
              ></div>
            </div>
            <span className="theme-name">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
