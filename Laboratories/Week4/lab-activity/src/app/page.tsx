'use client'

import { useState } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'
import WeatherService from '@/services/WeatherService'
import { IWeatherData, WEATHER_CODES } from '@/types/weather'

export default function Home() {
  const [weatherService] = useState(() => new WeatherService())
  const [weatherData, setWeatherData] = useState<IWeatherData | null>(null)
  const [weatherHistory, setWeatherHistory] = useState<IWeatherData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await weatherService.getWeatherByCity(searchQuery)
      
      if (result.success && result.data) {
        setWeatherData(result.data)
        setWeatherHistory(prev => {
          const exists = prev.some(item => item.name === result.data!.name)
          if (!exists) {
            return [result.data!, ...prev.slice(0, 4)]         
          }
          return prev
        })
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWeatherSelect = (selectedWeather: IWeatherData) => {
    setWeatherData(selectedWeather)
    setError(null)
  }

  return (
    <Layout>
      <div className="search-section">
        <h1>Weather Search</h1>
        <p>Search for weather information in any city</p>
        
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter city name (e.g., London, New York, Tokyo)"
            className="search-input"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="search-button"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      {weatherData && (
        <div className="weather-details">
          <h2>Current Weather</h2>
          <div className="weather-card">
            <h3>{weatherData.name}, {weatherData.country}</h3>
            <p>Temperature: {Math.round(weatherData.current_weather.temperature)}°C</p>
            <p>Description: {WEATHER_CODES[weatherData.current_weather.weathercode]?.description || 'Unknown'} {WEATHER_CODES[weatherData.current_weather.weathercode]?.icon || '🌤️'}</p>
            <p>Wind Speed: {weatherData.current_weather.windspeed} km/h</p>
            <p>Wind Direction: {weatherData.current_weather.winddirection}°</p>
            <Link 
              href={`/forecast/${encodeURIComponent(weatherData.name)}`}
              className="search-button"
              style={{ display: 'inline-block', marginTop: '1rem' }}
            >
              View Detailed Forecast
            </Link>
          </div>
        </div>
      )}

      {weatherHistory.length > 0 && (
        <div className="weather-section">
          <h2>Recent Searches</h2>
          <div className="weather-grid">
            {weatherHistory.map((weather, index) => (
              <div
                key={`${weather.name}-${index}`}
                className="weather-card"
                onClick={() => handleWeatherSelect(weather)}
              >
                <h3>{weather.name}, {weather.country}</h3>
                <p>Temperature: {Math.round(weather.current_weather.temperature)}°C</p>
                <p>Description: {WEATHER_CODES[weather.current_weather.weathercode]?.description || 'Unknown'} {WEATHER_CODES[weather.current_weather.weathercode]?.icon || '🌤️'}</p>
                <Link 
                  href={`/forecast/${encodeURIComponent(weather.name)}`}
                  className="search-button"
                  style={{ display: 'inline-block', marginTop: '0.5rem' }}
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  )
}
