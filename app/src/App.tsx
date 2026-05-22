import { useState, useEffect } from 'react';
import type { WeatherType, WeatherData, ForecastDay } from './types/weather';
import { WeatherBackground } from './components/WeatherBackground';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { WeatherToggle } from './components/WeatherToggle';
import { fetchCurrentWeather, fetchForecast } from './services/weatherApi';
import './index.css';

const loadingWeatherData: WeatherData = {
  location: '定位中...',
  temperature: 0,
  weather: 'sunny',
  humidity: 0,
  windSpeed: 0,
  pressure: 0,
  feelsLike: 0,
  uvIndex: 0,
  visibility: 0,
};

const loadingForecast: ForecastDay[] = [
  { day: '今天', date: '', high: 0, low: 0, weather: 'sunny' },
  { day: '明天', date: '', high: 0, low: 0, weather: 'cloudy' },
  { day: '后天', date: '', high: 0, low: 0, weather: 'rainy' },
  { day: '周四', date: '', high: 0, low: 0, weather: 'stormy' },
  { day: '周五', date: '', high: 0, low: 0, weather: 'snowy' },
];

export default function App() {
  const [weather, setWeather] = useState<WeatherType>('sunny');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>(loadingForecast);
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
        <WeatherCard data={weatherData || loadingWeatherData} />
        <ForecastCard forecasts={forecast.length > 0 ? forecast : loadingForecast} />
        <WeatherToggle current={weather} onChange={setWeather} />
        {loading && <div className="text-white/60 text-sm mt-4">加载中...</div>}
        {error && <div className="text-red-300 text-sm mt-4">{error}</div>}
        <div className="absolute bottom-4 text-white/40 text-xs">
          Made by <a href="https://github.com/JacobNg1" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/70 transition-colors">Jacob</a>
        </div>
      </div>
    </div>
  );
}