import type { WeatherType } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { weatherLabels } from '../types/weather';

export const ForecastCard = ({ forecasts }: { forecasts: { day: string; high: number; low: number; weather: WeatherType }[] }) => (
  <div className="relative z-10 w-full max-w-md mx-auto px-4 mt-6">
    <div className="backdrop-blur-xl bg-white/20 rounded-2xl p-6 shadow-xl border border-white/30">
      <h2 className="text-white text-lg font-semibold mb-4 drop-shadow-lg">天气预报</h2>
      <div className="grid grid-cols-5 gap-2">
        {forecasts.map((f, i) => (
          <div key={i} className="backdrop-blur bg-white/15 rounded-xl py-3 px-2 text-center border border-white/20 hover:bg-white/25 transition-all hover:-translate-y-1 cursor-default">
            <div className="text-white/80 text-xs mb-2">{f.day}</div>
            <div className="flex justify-center mb-2"><WeatherIcon weather={f.weather} size="sm" /></div>
            <div className="text-white font-semibold text-sm">{f.high}°</div>
            <div className="text-white/60 text-xs">{f.low}°</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);