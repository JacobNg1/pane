import type { WeatherData, ForecastDay, WeatherType } from '../types/weather';

const NOW_API = 'https://api.open-meteo.com/v1/forecast';

interface IpLocation {
  lat: number;
  lon: number;
  city: string;
  country: string;
}

async function getIpLocation(): Promise<IpLocation> {
  // ip.sb returns reliable lat/lon; city may be English
  const res = await fetch('https://api.ip.sb/geoip');
  if (!res.ok) {
    throw new Error(`IP geolocation failed: ${res.status}`);
  }
  const data = await res.json();
  return {
    lat: parseFloat(data.latitude),
    lon: parseFloat(data.longitude),
    city: data.city || data.region || '未知城市',
    country: data.country || '',
  };
}

async function getChineseCityName(enCity: string): Promise<{ city: string; country: string }> {
  // Search by English city name but request Chinese language results
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(enCity)}&count=1&language=zh&format=json`
  );
  const data = await res.json();
  if (data.results && data.results.length > 0) {
    return {
      city: data.results[0].name || enCity,
      country: data.results[0].country || '',
    };
  }
  return { city: '', country: '' };
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

function mapWeatherCode(code: number): WeatherType {
  if (code === 0) return 'sunny';
  if (code >= 1 && code <= 3) return 'cloudy';
  if (code >= 45 && code <= 48) return 'cloudy';
  if (code >= 51 && code <= 67) return 'rainy';
  if (code >= 71 && code <= 77) return 'snowy';
  if (code >= 80 && code <= 82) return 'rainy';
  if (code >= 85 && code <= 86) return 'snowy';
  if (code >= 95 && code <= 99) return 'stormy';
  return 'sunny';
}

export async function fetchCurrentWeather(): Promise<WeatherData> {
  // Get location by IP
  const { lat, lon, city: enCity, country: enCountry } = await getIpLocation();

  // Try to get Chinese city name from English city name
  const zh = await getChineseCityName(enCity);
  const city = zh.city || enCity;
  const country = zh.country || enCountry;

  const locationName = `${city} · ${country}`;

  const weatherParams = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    timezone: 'auto',
  });

  const weatherResponse = await fetch(`${NOW_API}?${weatherParams}`);
  const weatherData: OpenMeteoNowResponse = await weatherResponse.json();
  if (!weatherData.current) {
    throw new Error(`Open-Meteo error: ${JSON.stringify(weatherData)}`);
  }

  return {
    location: locationName,
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
  // Get location by IP
  const { lat, lon } = await getIpLocation();

  const forecastParams = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
  });

  const forecastResponse = await fetch(`${NOW_API}?${forecastParams}`);
  const forecastData: OpenMeteoForecastResponse = await forecastResponse.json();
  if (!forecastData.daily) {
    throw new Error(`Open-Meteo forecast error: ${JSON.stringify(forecastData)}`);
  }

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
