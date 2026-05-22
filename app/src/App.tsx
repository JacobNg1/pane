import { useState, useEffect } from 'react';
import type { WeatherType, WeatherData, ForecastDay } from './types/weather';
import { WeatherBackground } from './components/WeatherBackground';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { WeatherToggle } from './components/WeatherToggle';
import { fetchCurrentWeather, fetchForecast } from './services/weatherApi';
import './index.css';

const mockWeatherData: Record<WeatherType, WeatherData> = {
  sunny: { location: '北京 · 中国', temperature: 28, weather: 'sunny', humidity: 45, windSpeed: 12, pressure: 1013, feelsLike: 30, uvIndex: 8, visibility: 15 },
  cloudy: { location: '北京 · 中国', temperature: 22, weather: 'cloudy', humidity: 65, windSpeed: 18, pressure: 1010, feelsLike: 21, uvIndex: 3, visibility: 10 },
  rainy: { location: '北京 · 中国', temperature: 18, weather: 'rainy', humidity: 85, windSpeed: 25, pressure: 1005, feelsLike: 16, uvIndex: 1, visibility: 5 },
  snowy: { location: '北京 · 中国', temperature: -3, weather: 'snowy', humidity: 78, windSpeed: 15, pressure: 1018, feelsLike: -8, uvIndex: 2, visibility: 3 },
  night: { location: '北京 · 中国', temperature: 15, weather: 'night', humidity: 55, windSpeed: 8, pressure: 1015, feelsLike: 14, uvIndex: 0, visibility: 12 }
};

const mockForecast: ForecastDay[] = [
  { day: '今天', date: '', high: 28, low: 18, weather: 'sunny' as WeatherType },
  { day: '明天', date: '', high: 24, low: 16, weather: 'cloudy' as WeatherType },
  { day: '周三', date: '', high: 20, low: 14, weather: 'rainy' as WeatherType },
  { day: '周四', date: '', high: 18, low: 10, weather: 'rainy' as WeatherType },
  { day: '周五', date: '', high: 22, low: 12, weather: 'cloudy' as WeatherType }
];

export default function App() {
  const [weather, setWeather] = useState<WeatherType>('sunny');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>(mockForecast);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWeather() {
      try {
        setLoading(true);
        setError(null);
        const [now, forecastData] = await Promise.all([
          fetchCurrentWeather(),
          fetchForecast()
        ]);
        setWeatherData(now);
        setForecast(forecastData);
        setWeather(now.weather);
      } catch (err) {
        console.error('Failed to fetch weather:', err);
        setError('获取天气数据失败');
        setWeatherData(mockWeatherData[weather]);
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      <WeatherBackground weather={weather} />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pb-32 pt-12">
        <WeatherCard data={weatherData || mockWeatherData[weather]} />
        <ForecastCard forecasts={forecast} />
        <WeatherToggle current={weather} onChange={setWeather} />
        {loading && <div className="text-white/60 text-sm mt-4">加载中...</div>}
        {error && <div className="text-red-300 text-sm mt-4">{error}</div>}
      </div>
    </div>
  );
}