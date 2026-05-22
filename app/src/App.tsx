import { useState } from 'react';
import type { WeatherType, WeatherData } from './types/weather';
import { WeatherBackground } from './components/WeatherBackground';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { WeatherToggle } from './components/WeatherToggle';
import './index.css';

const mockWeatherData: Record<WeatherType, WeatherData> = {
  sunny: { location: '北京 · 中国', temperature: 28, weather: 'sunny', humidity: 45, windSpeed: 12, pressure: 1013, feelsLike: 30, uvIndex: 8, visibility: 15 },
  cloudy: { location: '北京 · 中国', temperature: 22, weather: 'cloudy', humidity: 65, windSpeed: 18, pressure: 1010, feelsLike: 21, uvIndex: 3, visibility: 10 },
  rainy: { location: '北京 · 中国', temperature: 18, weather: 'rainy', humidity: 85, windSpeed: 25, pressure: 1005, feelsLike: 16, uvIndex: 1, visibility: 5 },
  snowy: { location: '北京 · 中国', temperature: -3, weather: 'snowy', humidity: 78, windSpeed: 15, pressure: 1018, feelsLike: -8, uvIndex: 2, visibility: 3 },
  night: { location: '北京 · 中国', temperature: 15, weather: 'night', humidity: 55, windSpeed: 8, pressure: 1015, feelsLike: 14, uvIndex: 0, visibility: 12 }
};

const mockForecast = [
  { day: '今天', high: 28, low: 18, weather: 'sunny' as WeatherType },
  { day: '明天', high: 24, low: 16, weather: 'cloudy' as WeatherType },
  { day: '周三', high: 20, low: 14, weather: 'rainy' as WeatherType },
  { day: '周四', high: 18, low: 10, weather: 'rainy' as WeatherType },
  { day: '周五', high: 22, low: 12, weather: 'cloudy' as WeatherType }
];

export default function App() {
  const [weather, setWeather] = useState<WeatherType>('sunny');
  return (
    <div className="min-h-screen overflow-hidden">
      <WeatherBackground weather={weather} />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pb-32 pt-12">
        <WeatherCard data={mockWeatherData[weather]} />
        <ForecastCard forecasts={mockForecast} />
        <WeatherToggle current={weather} onChange={setWeather} />
      </div>
    </div>
  );
}