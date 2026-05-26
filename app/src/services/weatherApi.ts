import type { WeatherData, ForecastDay, WeatherType } from '../types/weather';

const QWEATHER_API_KEY = import.meta.env.VITE_QWEATHER_API_KEY || '';
const QWEATHER_GEO_API = 'https://geoapi.qweather.com/v2/city/lookup';
const QWEATHER_NOW_API = 'https://api.qweather.com/v7/weather/now';
const QWEATHER_FORECAST_API = 'https://api.qweather.com/v7/weather/7d';

interface Coordinates {
  lat: number;
  lon: number;
}

interface QWeatherCityResponse {
  code: string;
  location: Array<{
    name: string;
    id: string;
    lat: string;
    lon: string;
    adm2: string;
    adm1: string;
    country: string;
  }>;
}

interface QWeatherNowResponse {
  code: string;
  now: {
    temp: string;
    feelsLike: string;
    icon: string;
    text: string;
    wind360: string;
    windDir: string;
    windScale: string;
    windSpeed: string;
    humidity: string;
    precip: string;
    pressure: string;
    vis: string;
    cloud: string;
    dew: string;
  };
}

interface QWeatherForecastResponse {
  code: string;
  daily: Array<{
    fxDate: string;
    tempMax: string;
    tempMin: string;
    iconDay: string;
    textDay: string;
    iconNight: string;
    textNight: string;
    wind360Day: string;
    windDirDay: string;
    windScaleDay: string;
    windSpeedDay: string;
    wind360Night: string;
    windDirNight: string;
    windScaleNight: string;
    windSpeedNight: string;
    humidity: string;
    precip: string;
    pressure: string;
    vis: string;
    cloud: string;
    uvIndex: string;
  }>;
}

// 缓存位置信息
let cachedCoordinates: Coordinates | null = null;
let cachedCityName: string | null = null;

// 获取浏览器定位坐标
function getBrowserLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持地理定位'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`获取定位失败: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000, // 10分钟缓存
      }
    );
  });
}

// 通过 IP 获取定位坐标
async function getIpLocation(): Promise<Coordinates> {
  const res = await fetch('https://api.ip.sb/geoip');
  if (!res.ok) {
    throw new Error(`IP 定位失败: ${res.status}`);
  }
  const data = await res.json();
  return {
    lat: parseFloat(data.latitude),
    lon: parseFloat(data.longitude),
  };
}

// 获取位置坐标（优先使用缓存，浏览器定位失败则回退到 IP 定位）
async function getCoordinates(): Promise<Coordinates> {
  if (cachedCoordinates) {
    return cachedCoordinates;
  }

  try {
    const coords = await getBrowserLocation();
    cachedCoordinates = coords;
    return coords;
  } catch (error) {
    console.warn('浏览器定位失败，回退到 IP 定位:', error);
    const coords = await getIpLocation();
    cachedCoordinates = coords;
    return coords;
  }
}

// 根据坐标获取城市信息
async function getCityByCoordinates(coords: Coordinates): Promise<{ name: string; country: string }> {
  if (cachedCityName) {
    return { name: cachedCityName, country: '' };
  }

  const url = `${QWEATHER_GEO_API}?location=${coords.lon.toFixed(2)},${coords.lat.toFixed(2)}`;
  
  const res = await fetch(url, {
    headers: {
      'X-QW-Api-Key': QWEATHER_API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(`城市查询失败: ${res.status}`);
  }

  const data: QWeatherCityResponse = await res.json();
  
  if (data.code !== '200' || !data.location || data.location.length === 0) {
    throw new Error(`城市查询返回错误: ${data.code}`);
  }

  const location = data.location[0];
  cachedCityName = location.name;
  
  return {
    name: location.name,
    country: location.country,
  };
}

// 将和风天气图标/文本映射为 WeatherType
function mapQWeatherToType(icon: string, text: string): WeatherType {
  const iconNum = parseInt(icon, 10);
  
  // 晴
  if (iconNum >= 100 && iconNum <= 103) return 'sunny';
  // 多云/阴
  if (iconNum >= 150 && iconNum <= 154) return 'cloudy';
  if (iconNum >= 101 && iconNum <= 104) return 'cloudy';
  // 雨
  if ((iconNum >= 300 && iconNum <= 313) || (iconNum >= 350 && iconNum <= 353)) return 'rainy';
  // 雪
  if ((iconNum >= 400 && iconNum <= 407) || (iconNum >= 450 && iconNum <= 457)) return 'snowy';
  // 雷暴
  if (iconNum >= 302 && iconNum <= 305) return 'stormy';
  
  // 根据文本判断
  const textLower = text.toLowerCase();
  if (textLower.includes('晴')) return 'sunny';
  if (textLower.includes('多云') || textLower.includes('阴')) return 'cloudy';
  if (textLower.includes('雨')) {
    if (textLower.includes('雷') || textLower.includes('暴')) return 'stormy';
    return 'rainy';
  }
  if (textLower.includes('雪')) return 'snowy';
  
  return 'sunny';
}

// 获取当前天气
export async function fetchCurrentWeather(): Promise<WeatherData> {
  const coords = await getCoordinates();
  const cityInfo = await getCityByCoordinates(coords);
  
  const locationParam = `${coords.lon.toFixed(2)},${coords.lat.toFixed(2)}`;
  const url = `${QWEATHER_NOW_API}?location=${encodeURIComponent(locationParam)}`;
  
  const res = await fetch(url, {
    headers: {
      'X-QW-Api-Key': QWEATHER_API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(`获取当前天气失败: ${res.status}`);
  }

  const data: QWeatherNowResponse = await res.json();
  
  if (data.code !== '200' || !data.now) {
    throw new Error(`天气API返回错误: ${data.code}`);
  }

  const now = data.now;
  const weatherType = mapQWeatherToType(now.icon, now.text);

  return {
    location: cityInfo.name,
    temperature: parseInt(now.temp, 10),
    weather: weatherType,
    humidity: parseInt(now.humidity, 10),
    windSpeed: parseInt(now.windSpeed, 10),
    pressure: parseInt(now.pressure, 10),
    feelsLike: parseInt(now.feelsLike, 10),
    uvIndex: 0, // 当前天气API不返回UV指数
    visibility: parseInt(now.vis, 10),
  };
}

// 获取未来天气预报
export async function fetchForecast(): Promise<ForecastDay[]> {
  const coords = await getCoordinates();
  
  const locationParam = `${coords.lon.toFixed(2)},${coords.lat.toFixed(2)}`;
  const url = `${QWEATHER_FORECAST_API}?location=${encodeURIComponent(locationParam)}`;
  
  const res = await fetch(url, {
    headers: {
      'X-QW-Api-Key': QWEATHER_API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(`获取天气预报失败: ${res.status}`);
  }

  const data: QWeatherForecastResponse = await res.json();
  
  if (data.code !== '200' || !data.daily) {
    throw new Error(`天气预报API返回错误: ${data.code}`);
  }

  const dayMap: Record<string, string> = {
    '0': '今天',
    '1': '明天',
    '2': '后天',
  };

  return data.daily.slice(0, 5).map((day, index) => {
    const weather = mapQWeatherToType(day.iconDay, day.textDay);
    
    return {
      day: dayMap[index] || new Date(day.fxDate).toLocaleDateString('zh-CN', { weekday: 'short' }),
      date: day.fxDate,
      high: parseInt(day.tempMax, 10),
      low: parseInt(day.tempMin, 10),
      weather,
    };
  });
}
