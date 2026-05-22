import type { WeatherType } from '../types/weather';
import { weatherLabels } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

const options: WeatherType[] = ['sunny', 'cloudy', 'rainy', 'stormy', 'snowy'];
const emojis: Record<WeatherType, string> = { sunny: '☀️', cloudy: '⛅', rainy: '🌧️', stormy: '⛈️', snowy: '❄️', night: '🌙' };

export const WeatherToggle = ({ current, onChange }: { current: WeatherType; onChange: (w: WeatherType) => void }) => (
  <div className="relative z-10 w-full max-w-md mx-auto px-4 mt-6">
    <div className="backdrop-blur-xl bg-white/20 rounded-2xl p-4 shadow-xl border border-white/30">
      <div className="flex justify-between gap-2">
        {options.map((w) => (
          <button key={w} onClick={() => onChange(w)}
            className={`flex-1 flex flex-col items-center py-3 px-2 rounded-xl transition-all duration-300 ${current === w ? 'bg-white/40 shadow-lg scale-105' : 'bg-white/10 hover:bg-white/25 hover:scale-105'}`}>
            <div className="mb-1">
              {current === w ? <WeatherIcon weather={w} size="md" /> : <span className="text-2xl">{emojis[w]}</span>}
            </div>
            <span className={`text-xs font-medium ${current === w ? 'text-white' : 'text-white/70'}`}>{weatherLabels[w]}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);