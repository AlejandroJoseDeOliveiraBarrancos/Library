import React, { useState, useEffect } from 'react';
import WeatherService from './services/WeatherService';
import { IWeatherData, ITheme } from './types/IWeather';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import ThemeSwitcher from './components/ThemeSwitcher';
import WeatherCard from './components/WeatherCard';
import './App.css';

function App() {
  const [weatherService] = useState(() => new WeatherService());
  const [weatherData, setWeatherData] = useState<IWeatherData | null>(null);
  const [weatherHistory, setWeatherHistory] = useState<IWeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const themes: ITheme[] = [
    {
      name: 'light',
      primary: '#667eea',
      secondary: '#764ba2',
      background: '#f5f7fa',
      surface: '#ffffff',
      text: '#333333',
      textSecondary: '#666666',
      border: '#e1e5e9',
      shadow: 'rgba(0, 0, 0, 0.1)'
    },
    {
      name: 'dark',
      primary: '#4f46e5',
      secondary: '#7c3aed',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      shadow: 'rgba(0, 0, 0, 0.3)'
    }
  ];

  const [currentTheme, setCurrentTheme] = useState<ITheme>(() => {
    const savedTheme = localStorage.getItem('weather-theme');
    return savedTheme ? JSON.parse(savedTheme) : themes[0];
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', currentTheme.primary);
    root.style.setProperty('--secondary-color', currentTheme.secondary);
    root.style.setProperty('--background-color', currentTheme.background);
    root.style.setProperty('--surface-color', currentTheme.surface);
    root.style.setProperty('--text-color', currentTheme.text);
    root.style.setProperty('--text-secondary-color', currentTheme.textSecondary);
    root.style.setProperty('--border-color', currentTheme.border);
    root.style.setProperty('--shadow-color', currentTheme.shadow);
        
    localStorage.setItem('weather-theme', JSON.stringify(currentTheme));
  }, [currentTheme]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await weatherService.getWeatherByCity(query);
      
      if (result.success && result.data) {
        setWeatherData(result.data);
        setWeatherHistory(prev => {
          const exists = prev.some(item => item.id === result.data!.id);
          if (!exists) {
            return [result.data!, ...prev.slice(0, 4)];         
          }
          return prev;
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = (theme: ITheme) => {
    setCurrentTheme(theme);
  };

  const handleWeatherSelect = (selectedWeather: IWeatherData) => {
    setWeatherData(selectedWeather);
    setError(null);
  };

  const clearHistory = () => {
    setWeatherHistory([]);
  };

  const clearCurrentWeather = () => {
    setWeatherData(null);
    setError(null);
  };

  return (
    <div className={`app ${currentTheme.name}`}>
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Weather Control Panel</h1>
            <p>Get real-time weather information for any city</p>
          </div>
          <ThemeSwitcher
            currentTheme={currentTheme}
            onThemeChange={handleThemeChange}
            themes={themes}
          />
        </div>
      </header>

      <main className="app-main">
        <div className="search-section">
          <SearchBar
            onSearch={handleSearch}
            isLoading={isLoading}
            placeholder="Enter city name (e.g., London, New York, Tokyo)"
          />
        </div>

        <div className="content-grid">
          <div className="weather-section">
            <div className="section-header">
              <h2>Current Weather</h2>
              {weatherData && (
                <button 
                  onClick={clearCurrentWeather}
                  className="clear-button"
                  title="Clear current weather"
                >
                  Clear
                </button>
              )}
            </div>
            <WeatherDisplay
              weatherData={weatherData}
              isLoading={isLoading}
              error={error}
            />
          </div>

          <div className="history-section">
            <div className="section-header">
              <h3>Recent Searches</h3>
              {weatherHistory.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="clear-button small"
                  title="Clear search history"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="weather-history">
              {weatherHistory.length === 0 ? (
                <div className="empty-history">
                  <p>No recent searches</p>
                  <p className="text-secondary">Search for cities to see them here</p>
                </div>
              ) : (
                <div className="weather-cards">
                  {weatherHistory.map((weather) => (
                    <WeatherCard
                      key={`${weather.id}-${weather.dt}`}
                      weatherData={weather}
                      onSelect={handleWeatherSelect}
                      isSelected={weatherData?.id === weather.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Weather data provided by OpenWeatherMap API</p>
        <p className="text-secondary">Built with React & TypeScript</p>
      </footer>
    </div>
  );
}

export default App;
