'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Layout from '@/components/Layout'
import WeatherService from '@/services/WeatherService'
import { IWeatherData, WEATHER_CODES } from '@/types/weather'

export default function ForecastPage() {
  const params = useParams()
  const city = params.city as string
  const [weatherService] = useState(() => new WeatherService())
  const [weatherData, setWeatherData] = useState<IWeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) return

      setIsLoading(true)
      setError(null)

      try {
        const result = await weatherService.getWeatherByCity(city)
        
        if (result.success && result.data) {
          setWeatherData(result.data)
        } else {
          setError(result.message)
        }
      } catch (err) {
        setError('An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeather()
  }, [city, weatherService])

  if (isLoading) {
    return (
      <Layout>
        <div className="loading">Loading weather data for {city}...</div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="error">Error: {error}</div>
      </Layout>
    )
  }

  if (!weatherData) {
    return (
      <Layout>
        <div className="error">No weather data found for {city}</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="weather-details">
        <h1>Weather Forecast for {weatherData.name}</h1>
        
        <div className="weather-details-content">
          <div>
            <div className="weather-details-image" style={{ 
              fontSize: '8rem', 
              textAlign: 'center', 
              padding: '2rem',
              background: 'var(--background-color)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              {WEATHER_CODES[weatherData.current_weather.weathercode]?.icon || '🌤️'}
            </div>
          </div>
          
          <div>
            <h2 className="weather-details-title">
              {weatherData.name}, {weatherData.country}
            </h2>
            
            <div className="weather-details-description">
              <h3>Current Conditions</h3>
              <p>{WEATHER_CODES[weatherData.current_weather.weathercode]?.description || 'Unknown'}</p>
              <p>Temperature: {Math.round(weatherData.current_weather.temperature)}°C</p>
              <p>Min/Max Today: {Math.round(weatherData.daily.temperature_2m_min[0])}°C / {Math.round(weatherData.daily.temperature_2m_max[0])}°C</p>
            </div>

            <div className="weather-details-meta">
              <h3>Additional Information</h3>
              <p>Wind Speed: {weatherData.current_weather.windspeed} km/h</p>
              <p>Wind Direction: {weatherData.current_weather.winddirection}°</p>
              <p>Sunrise: {weatherData.daily.sunrise[0]}</p>
              <p>Sunset: {weatherData.daily.sunset[0]}</p>
              <p>Timezone: {weatherData.timezone}</p>
              <p>Elevation: {weatherData.elevation}m</p>
            </div>

            <div className="weather-details-meta">
              <h3>7-Day Forecast</h3>
              {weatherData.daily.time.slice(0, 7).map((date, index) => (
                <div key={date} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <span>{new Date(date).toLocaleDateString()}</span>
                  <span>
                    {WEATHER_CODES[weatherData.daily.weathercode[index]]?.icon || '🌤️'} 
                    {Math.round(weatherData.daily.temperature_2m_min[index])}° / {Math.round(weatherData.daily.temperature_2m_max[index])}°
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
