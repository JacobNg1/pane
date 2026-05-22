import type { WeatherData, ForecastDay, WeatherType } from '../types/weather';

const API_KEY = import.meta.env.VITE_QWEATHER_API_KEY;
const NOW_API = 'https://devapi.qweather.com/v7/weather/now';
const FORECAST_API = 'https://devapi.qweather.com/v7/weather/7d';

interface QWeatherNowResponse {
  code: string;
  now: {
    temp: string;
    feelsLike: string;
    humidity: string;
    windSpeed: string;
    pressure: string;
    vis: string;
    weather: string;
    windDir: string;
  };
  location: {
    name: string;
    id: string;
  };
}

interface QWeatherForecastResponse {
  code: string;
  daily: Array<{
    fxDate: string;
    tempMax: string;
    tempMin: string;
    textDay: string;
    textNight: string;
  }>;
  location: {
    name: string;
    id: string;
  };
}

function mapWeatherCode(code: string): WeatherType {
  const codeMap: Record<string, WeatherType> = {
    '100': 'sunny',
    '101': 'cloudy',
    '102': 'cloudy',
    '103': 'cloudy',
    '104': 'cloudy',
    '200': 'sunny',
    '201': 'cloudy',
    '202': 'cloudy',
    '203': 'cloudy',
    '204': 'cloudy',
    '205': 'sunny',
    '206': 'sunny',
    '207': 'sunny',
    '208': 'sunny',
    '209': 'sunny',
    '210': 'sunny',
    '211': 'sunny',
    '212': 'sunny',
    '213': 'sunny',
    '300': 'rainy',
    '301': 'rainy',
    '302': 'rainy',
    '303': 'rainy',
    '304': 'rainy',
    '305': 'rainy',
    '306': 'rainy',
    '307': 'rainy',
    '308': 'rainy',
    '309': 'rainy',
    '310': 'rainy',
    '311': 'rainy',
    '312': 'rainy',
    '313': 'rainy',
    '314': 'rainy',
    '315': 'rainy',
    '316': 'rainy',
    '317': 'rainy',
    '318': 'rainy',
    '350': 'rainy',
    '351': 'rainy',
    '399': 'rainy',
    '400': 'snowy',
    '401': 'snowy',
    '402': 'snowy',
    '403': 'snowy',
    '404': 'snowy',
    '405': 'snowy',
    '406': 'snowy',
    '407': 'snowy',
    '408': 'snowy',
    '409': 'snowy',
    '410': 'snowy',
    '499': 'snowy',
    '500': 'cloudy',
    '501': 'cloudy',
    '502': 'cloudy',
    '503': 'cloudy',
    '504': 'cloudy',
    '507': 'cloudy',
    '508': 'cloudy',
    '509': 'cloudy',
    '510': 'cloudy',
    '511': 'cloudy',
    '512': 'cloudy',
    '513': 'cloudy',
    '514': 'cloudy',
    '515': 'cloudy',
  };
  return codeMap[code] || 'sunny';
}

export async function fetchCurrentWeather(location: string = '101010100'): Promise<WeatherData> {
  const url = `${NOW_API}?location=${location}&key=${API_KEY}`;
  const response = await fetch(url);
  const data: QWeatherNowResponse = await response.json();

  if (data.code !== '200') {
    throw new Error(`API error: ${data.code}`);
  }

  return {
    location: data.location.name + ' · 中国',
    temperature: parseInt(data.now.temp),
    weather: mapWeatherCode(data.now.weather),
    humidity: parseInt(data.now.humidity),
    windSpeed: parseInt(data.now.windSpeed),
    pressure: parseInt(data.now.pressure),
    feelsLike: parseInt(data.now.feelsLike),
    uvIndex: 0,
    visibility: parseInt(data.now.vis),
  };
}

export async function fetchForecast(location: string = '101010100'): Promise<ForecastDay[]> {
  const url = `${FORECAST_API}?location=${location}&key=${API_KEY}`;
  const response = await fetch(url);
  const data: QWeatherForecastResponse = await response.json();

  if (data.code !== '200') {
    throw new Error(`API error: ${data.code}`);
  }

  const dayMap: Record<string, string> = {
    '0': '今天',
    '1': '明天',
    '2': '后天',
  };

  return data.daily.slice(0, 5).map((day, index) => ({
    day: dayMap[index] || new Date(day.fxDate).toLocaleDateString('zh-CN', { weekday: 'short' }),
    date: day.fxDate,
    high: parseInt(day.tempMax),
    low: parseInt(day.tempMin),
    weather: mapWeatherCode(day.textDay),
  }));
}
