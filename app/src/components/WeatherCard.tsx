import type { WeatherData } from '../types/weather';
import { weatherLabels } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

export const WeatherCard = ({ data }: { data: WeatherData }) => {
  const today = new Date();
  const dateStr = today.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });

  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-4">
      <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-8 shadow-2xl border border-white/30">
        <div className="text-center mb-6">
          <h1 className="text-white text-2xl font-bold drop-shadow-lg">{data.location}</h1>
          <p className="text-white/80 text-sm mt-1">{dateStr}</p>
        </div>
        <div className="flex items-center justify-center gap-6 mb-2">
          <span className="text-white text-8xl font-bold tracking-tight drop-shadow-lg" style={{ fontFamily: "'Orbitron', monospace" }}>
            {data.temperature}
          </span>
          <span className="text-white text-3xl align-top">°</span>
          <div className="flex flex-col items-center">
            <WeatherIcon weather={data.weather} size="lg" className="drop-shadow-lg" />
            <span className="text-white/90 text-sm font-medium mt-1">{weatherLabels[data.weather]}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <StatItem icon="💧" label="湿度" value={`${data.humidity}%`} />
          <StatItem icon="💨" label="风速" value={`${data.windSpeed} km/h`} />
          <StatItem icon="🌡️" label="体感" value={`${data.feelsLike}°`} />
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="backdrop-blur bg-white/10 rounded-xl py-3 px-2 border border-white/20">
    <div className="text-xl mb-1">{icon}</div>
    <div className="text-white/70 text-xs">{label}</div>
    <div className="text-white font-semibold text-sm">{value}</div>
  </div>
);