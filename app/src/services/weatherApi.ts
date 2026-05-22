import type { WeatherData, ForecastDay, WeatherType } from '../types/weather';

const NOW_API = 'https://api.open-meteo.com/v1/forecast';
const GEOCODE_API = 'https://geocoding-api.open-meteo.com/v1/search';
const IP_GEO_API = 'https://ip-api.com/json/?fields=status,country,countryCode,city,lat,lon';

interface IpGeoResponse {
  status: string;
  country: string;
  countryCode: string;
  city: string;
  lat: number;
  lon: number;
}

interface OpenMeteoNowResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}

interface OpenMeteoForecastResponse {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

interface GeocodingResponse {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country: string;
  }>;
}

function mapWeatherCode(code: number): WeatherType {
  if (code === 0) return 'sunny';
  if (code >= 1 && code <= 3) return 'cloudy';
  if (code >= 45 && code <= 48) return 'cloudy';
  if (code >= 51 && code <= 67) return 'rainy';
  if (code >= 71 && code <= 77) return 'snowy';
  if (code >= 80 && code <= 82) return 'rainy';
  if (code >= 85 && code <= 86) return 'snowy';
  if (code >= 95 && code <= 99) return 'rainy';
  return 'sunny';
}

export async function fetchCurrentWeather(): Promise<WeatherData> {
  // Get user location by IP
  const ipGeoResponse = await fetch(IP_GEO_API);
  const ipGeoData: IpGeoResponse = await ipGeoResponse.json();

  if (ipGeoData.status !== 'success') {
    throw new Error('Failed to get location');
  }

  const { lat, lon, city, country } = ipGeoData;

  // Fetch current weather directly using coordinates
  const weatherParams = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    timezone: 'Asia/Shanghai',
  });

  const weatherResponse = await fetch(`${NOW_API}?${weatherParams}`);
  const weatherData: OpenMeteoNowResponse = await weatherResponse.json();

  return {
    location: `${city} · ${country}`,
    temperature: Math.round(weatherData.current.temperature_2m),
    weather: mapWeatherCode(weatherData.current.weather_code),
    humidity: Math.round(weatherData.current.relative_humidity_2m),
    windSpeed: Math.round(weatherData.current.wind_speed_10m),
    pressure: 1013,
    feelsLike: Math.round(weatherData.current.temperature_2m),
    uvIndex: 0,
    visibility: 10,
  };
}

export async function fetchForecast(): Promise<ForecastDay[]> {
  // Get user location by IP
  const ipGeoResponse = await fetch(IP_GEO_API);
  const ipGeoData: IpGeoResponse = await ipGeoResponse.json();

  if (ipGeoData.status !== 'success') {
    throw new Error('Failed to get location');
  }

  const { lat, lon } = ipGeoData;

  // Fetch 7-day forecast directly using coordinates
  const forecastParams = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'Asia/Shanghai',
  });

  const forecastResponse = await fetch(`${NOW_API}?${forecastParams}`);
  const forecastData: OpenMeteoForecastResponse = await forecastResponse.json();

  const dayMap: Record<string, string> = {
    '0': '今天',
    '1': '明天',
    '2': '后天',
  };

  return forecastData.daily.time.slice(0, 5).map((date, index) => ({
    day: dayMap[index] || new Date(date).toLocaleDateString('zh-CN', { weekday: 'short' }),
    date,
    high: Math.round(forecastData.daily.temperature_2m_max[index]),
    low: Math.round(forecastData.daily.temperature_2m_min[index]),
    weather: mapWeatherCode(forecastData.daily.weather_code[index]),
  }));
}
