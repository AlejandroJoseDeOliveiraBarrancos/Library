import { IWeatherData, IWeatherResult, IWeatherService } from '../types/IWeather';

export class WeatherService implements IWeatherService {
  private readonly API_KEY = 'demo'; 
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  private createResult(success: boolean, data?: IWeatherData, message: string = ''): IWeatherResult {
    return { success, data, message };
  }

  private async fetchWeatherData(url: string): Promise<IWeatherResult> {
    try {
      const mockWeatherData: IWeatherData = {
        coord: { lon: -74.006, lat: 40.7143 },
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d'
          }
        ],
        base: 'stations',
        main: {
          temp: 22.5,
          feels_like: 24.1,
          temp_min: 20.0,
          temp_max: 25.0,
          pressure: 1013,
          humidity: 65
        },
        visibility: 10000,
        wind: {
          speed: 3.6,
          deg: 230
        },
        clouds: {
          all: 0
        },
        dt: Math.floor(Date.now() / 1000),
        sys: {
          type: 1,
          id: 4610,
          country: 'US',
          sunrise: Math.floor(Date.now() / 1000) - 3600,
          sunset: Math.floor(Date.now() / 1000) + 3600
        },
        timezone: -14400,
        id: 5128581,
        name: 'New York',
        cod: 200
      };

      await new Promise(resolve => setTimeout(resolve, 1000));

      return this.createResult(true, mockWeatherData, 'Weather data retrieved successfully');
    } catch (error) {
      return this.createResult(false, undefined, `Failed to fetch weather data: ${(error as Error).message}`);
    }
  }

  public async getWeatherByCity(city: string): Promise<IWeatherResult> {
    if (!city || city.trim() === '') {
      return this.createResult(false, undefined, 'City name cannot be empty');
    }

    const url = `${this.BASE_URL}?q=${encodeURIComponent(city.trim())}&appid=${this.API_KEY}&units=metric`;
    return this.fetchWeatherData(url);
  }

  public async getWeatherByCoords(lat: number, lon: number): Promise<IWeatherResult> {
    if (isNaN(lat) || isNaN(lon)) {
      return this.createResult(false, undefined, 'Invalid coordinates provided');
    }

    const url = `${this.BASE_URL}?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`;
    return this.fetchWeatherData(url);
  }
}

export default WeatherService;
