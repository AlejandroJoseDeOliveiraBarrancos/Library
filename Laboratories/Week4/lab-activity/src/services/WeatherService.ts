import { IWeatherData, IWeatherResult } from '@/types/weather'

class WeatherService {
  private baseUrl = 'https://api.open-meteo.com/v1/forecast'

  private async getCityCoordinates(city: string): Promise<{ lat: number; lon: number; name: string; country: string } | null> {
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`)
      const data = await response.json()
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        return {
          lat: result.latitude,
          lon: result.longitude,
          name: result.name,
          country: result.country
        }
      }
      return null
    } catch (error) {
      console.error('Geocoding error:', error)
      return null
    }
  }

  async getWeatherByCity(city: string): Promise<IWeatherResult> {
    try {
      const coords = await this.getCityCoordinates(city)
      if (!coords) {
        return { success: false, message: 'City not found' }
      }

      const url = `${this.baseUrl}?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m,winddirection_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
      const response = await fetch(url)
      
      if (!response.ok) {
        return { success: false, message: `HTTP error! status: ${response.status}` }
      }
      
      const data = await response.json()
      
      const weatherData: IWeatherData = {
        ...data,
        name: coords.name,
        country: coords.country
      }
      
      return { success: true, data: weatherData, message: 'Weather data retrieved successfully' }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }
    }
  }

  async getWeatherByCoords(lat: number, lon: number): Promise<IWeatherResult> {
    try {
      const url = `${this.baseUrl}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m,winddirection_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
      const response = await fetch(url)
      
      if (!response.ok) {
        return { success: false, message: `HTTP error! status: ${response.status}` }
      }
      
      const data = await response.json()
      
      const weatherData: IWeatherData = {
        ...data,
        name: `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
        country: 'Unknown'
      }
      
      return { success: true, data: weatherData, message: 'Weather data retrieved successfully' }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }
    }
  }
}

export default WeatherService

