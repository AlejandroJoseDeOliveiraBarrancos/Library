import React from 'react';
import { IWeatherData } from '../types/IWeather';

interface WeatherCardProps {
  weatherData: IWeatherData;
  onSelect: (weatherData: IWeatherData) => void;
  isSelected?: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ 
  weatherData, 
  onSelect, 
  isSelected = false 
}) => {
  const weather = weatherData.weather[0];
  const main = weatherData.main;

  return (
    <div 
      className={`weather-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(weatherData)}
    >
      <div className="weather-card-header">
        <div className="weather-card-location">
          <h4>{weatherData.name}</h4>
          <p>{weatherData.sys.country}</p>
        </div>
        <div className="weather-card-icon">
          <img 
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
            alt={weather.description}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </div>

      <div className="weather-card-main">
        <div className="weather-card-temp">
          <span className="temp-value">{Math.round(main.temp)}</span>
          <span className="temp-unit">°C</span>
        </div>
        <div className="weather-card-desc">
          <p>{weather.description}</p>
        </div>
      </div>

      <div className="weather-card-details">
        <div className="detail-row">
          <span>Feels like: {Math.round(main.feels_like)}°</span>
        </div>
        <div className="detail-row">
          <span>Humidity: {main.humidity}%</span>
        </div>
        <div className="detail-row">
          <span>Wind: {weatherData.wind.speed} m/s</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
