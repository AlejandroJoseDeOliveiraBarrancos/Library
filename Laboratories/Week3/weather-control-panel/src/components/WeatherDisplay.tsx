import React from 'react';
import { IWeatherData } from '../types/IWeather';

interface WeatherDisplayProps {
  weatherData: IWeatherData | null;
  isLoading: boolean;
  error: string | null;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ 
  weatherData, 
  isLoading, 
  error 
}) => {
  if (isLoading) {
    return (
      <div className="weather-display loading">
        <div className="loading-content">
          <div className="loading-spinner large"></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-display error">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="weather-display empty">
        <div className="empty-content">
          <div className="empty-icon">🌤️</div>
          <h3>Welcome to Weather Control Panel</h3>
          <p>Search for a city to get current weather information</p>
        </div>
      </div>
    );
  }

  const weather = weatherData.weather[0];
  const main = weatherData.main;
  const wind = weatherData.wind;
  const sys = weatherData.sys;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <div className="weather-display">
      <div className="weather-header">
        <div className="location">
          <h2>{weatherData.name}</h2>
          <p>{sys.country}</p>
        </div>
        <div className="weather-icon">
          <img 
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
            alt={weather.description}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </div>

      <div className="weather-main">
        <div className="temperature">
          <span className="temp-value">{Math.round(main.temp)}</span>
          <span className="temp-unit">°C</span>
        </div>
        <div className="weather-description">
          <h3>{weather.main}</h3>
          <p>{weather.description}</p>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <div className="detail-icon">🌡️</div>
          <div className="detail-content">
            <span className="detail-label">Feels like</span>
            <span className="detail-value">{Math.round(main.feels_like)}°C</span>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">📊</div>
          <div className="detail-content">
            <span className="detail-label">Min / Max</span>
            <span className="detail-value">
              {Math.round(main.temp_min)}° / {Math.round(main.temp_max)}°
            </span>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">💧</div>
          <div className="detail-content">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{main.humidity}%</span>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">🌬️</div>
          <div className="detail-content">
            <span className="detail-label">Wind</span>
            <span className="detail-value">
              {wind.speed} m/s {getWindDirection(wind.deg)}
            </span>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">🔍</div>
          <div className="detail-content">
            <span className="detail-label">Visibility</span>
            <span className="detail-value">{weatherData.visibility / 1000} km</span>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">☁️</div>
          <div className="detail-content">
            <span className="detail-label">Cloudiness</span>
            <span className="detail-value">{weatherData.clouds.all}%</span>
          </div>
        </div>
      </div>

      <div className="weather-footer">
        <div className="sun-times">
          <div className="sun-time">
            <span className="sun-icon">🌅</span>
            <span className="sun-label">Sunrise</span>
            <span className="sun-value">{formatTime(sys.sunrise)}</span>
          </div>
          <div className="sun-time">
            <span className="sun-icon">🌇</span>
            <span className="sun-label">Sunset</span>
            <span className="sun-value">{formatTime(sys.sunset)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
