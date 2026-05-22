import { useEffect, useRef } from 'react';
import type { WeatherType } from '../types/weather';
import { useWeatherEffect } from '../hooks/useWeatherEffect';

const gradientClasses: Record<WeatherType, string> = {
  sunny: 'from-sky-400 via-yellow-300 to-orange-200',
  cloudy: 'from-gray-500 via-gray-400 to-gray-600',
  rainy: 'from-slate-800 via-slate-700 to-slate-900',
  stormy: 'from-gray-900 via-slate-800 to-gray-700',
  snowy: 'from-blue-200 via-blue-100 to-blue-300',
  night: 'from-indigo-950 via-purple-950 to-indigo-900'
};

export const WeatherBackground = ({ weather }: { weather: WeatherType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useWeatherEffect(weather, canvasRef);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br ${gradientClasses[weather]} transition-all duration-1000 ease-in-out`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {weather === 'cloudy' && <CloudLayer />}
      {weather === 'night' && <StarField />}
      {weather === 'night' && <Moon />}
      {weather === 'sunny' && <Sun />}
      {weather === 'rainy' && <RainOverlay />}
      {weather === 'stormy' && <RainOverlay />}
      {weather === 'snowy' && <SnowFog />}
      {weather === 'rainy' && <div className="absolute inset-0 bg-black/20" />}
      {weather === 'stormy' && <div className="absolute inset-0 bg-black/30" />}
      {weather === 'night' && <div className="absolute inset-0 bg-black/30" />}
    </div>
  );
};

const CloudLayer = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-10 animate-cloud-drift" style={{ left: '-20%', animationDuration: '45s' }}>
      <svg width="400" height="200" viewBox="0 0 400 200" className="opacity-40">
        <ellipse cx="100" cy="120" rx="80" ry="60" fill="white" /><ellipse cx="180" cy="100" rx="100" ry="80" fill="white" />
        <ellipse cx="280" cy="120" rx="70" ry="50" fill="white" /><ellipse cx="350" cy="140" rx="50" ry="40" fill="white" />
      </svg>
    </div>
    <div className="absolute top-32 animate-cloud-drift-reverse" style={{ left: '-30%', animationDuration: '60s', animationDelay: '-20s' }}>
      <svg width="500" height="250" viewBox="0 0 500 250" className="opacity-30">
        <ellipse cx="120" cy="150" rx="100" ry="70" fill="white" /><ellipse cx="220" cy="120" rx="120" ry="90" fill="white" />
        <ellipse cx="350" cy="140" rx="90" ry="60" fill="white" />
      </svg>
    </div>
  </div>
);

const StarField = () => (
  <div className="absolute inset-0">
    {Array.from({ length: 80 }, (_, i) => ({
      id: i, left: Math.random() * 100, top: Math.random() * 70, size: 1 + Math.random() * 2, delay: Math.random() * 3
    })).map(star => (
      <div key={star.id} className="absolute rounded-full bg-white animate-twinkle"
        style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, animationDelay: `${star.delay}s` }} />
    ))}
  </div>
);

const Moon = () => (
  <div className="absolute top-16 right-1/4">
    <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-lg">
      <defs><radialGradient id="moonGradient" cx="30%" cy="30%"><stop offset="0%" stopColor="#FFFACD" /><stop offset="100%" stopColor="#E6E6FA" /></radialGradient></defs>
      <circle cx="60" cy="60" r="50" fill="url(#moonGradient)" />
      <circle cx="45" cy="50" r="8" fill="#D4D4D4" opacity="0.3" /><circle cx="70" cy="65" r="12" fill="#D4D4D4" opacity="0.2" />
      <circle cx="55" cy="75" r="6" fill="#D4D4D4" opacity="0.25" />
    </svg>
  </div>
);

const Sun = () => (
  <div className="absolute top-8 left-1/4 animate-pulse-slow">
    <svg width="150" height="150" viewBox="0 0 150 150">
      <defs>
        <radialGradient id="sunGradient" cx="50%" cy="50%"><stop offset="0%" stopColor="#FFEB3B" /><stop offset="60%" stopColor="#FFA726" /><stop offset="100%" stopColor="#FF7043" /></radialGradient>
        <filter id="sunGlow"><feGaussianBlur stdDeviation="8" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <circle cx="75" cy="75" r="45" fill="url(#sunGradient)" filter="url(#sunGlow)" />
    </svg>
  </div>
);

const RainOverlay = () => <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-blue-950/30" />;
const SnowFog = () => <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-200/50 to-transparent" />;