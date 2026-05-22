export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'night';

export interface WeatherData {
  location: string;
  temperature: number;
  weather: WeatherType;
  humidity: number;
  windSpeed: number;
  pressure: number;
  feelsLike: number;
  uvIndex: number;
  visibility: number;
}

export interface ForecastDay {
  day: string;
  date: string;
  high: number;
  low: number;
  weather: WeatherType;
}

export const weatherColors: Record<WeatherType, { gradient: string; accent: string; text: string }> = {
  sunny: { gradient: 'from-sky-400 via-yellow-300 to-orange-200', accent: '#FFB347', text: '#8B4513' },
  cloudy: { gradient: 'from-gray-400 via-gray-500 to-gray-600', accent: '#B4C6E7', text: '#2C3E50' },
  rainy: { gradient: 'from-slate-700 via-slate-600 to-slate-800', accent: '#5B8FA8', text: '#E0E7EE' },
  snowy: { gradient: 'from-blue-100 via-blue-200 to-blue-300', accent: '#85C1E9', text: '#2E4A62' },
  night: { gradient: 'from-indigo-950 via-purple-900 to-indigo-900', accent: '#7B68EE', text: '#E8E6F0' }
};

export const weatherLabels: Record<WeatherType, string> = {
  sunny: '晴天', cloudy: '多云', rainy: '雨天', snowy: '雪天', night: '夜晚'
};