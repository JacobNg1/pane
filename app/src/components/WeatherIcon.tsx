import type { WeatherType } from '../types/weather';

interface WeatherIconProps {
  weather: WeatherType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WeatherIcon = ({ weather, size = 'lg', className = '' }: WeatherIconProps) => {
  const sizeClasses = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-20 h-20' };
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {weather === 'sunny' && <SunnyIcon />}
      {weather === 'cloudy' && <CloudyIcon />}
      {weather === 'rainy' && <RainyIcon />}
      {weather === 'stormy' && <StormyIcon />}
      {weather === 'snowy' && <SnowyIcon />}
      {weather === 'night' && <NightIcon />}
    </div>
  );
};

const SunnyIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
    <defs>
      <radialGradient id="sunBody" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#FFEB3B" /><stop offset="100%" stopColor="#FFA726" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="20" fill="url(#sunBody)" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <line key={i} x1="50" y1="50"
        x2={50 + Math.cos((angle * Math.PI) / 180) * 35}
        y2={50 + Math.sin((angle * Math.PI) / 180) * 35}
        stroke="#FFD54F" strokeWidth="4" strokeLinecap="round" />
    ))}
  </svg>
);

const CloudyIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E8EAF6" /><stop offset="100%" stopColor="#9FA8DA" />
      </linearGradient>
    </defs>
    <g className="animate-cloud-bounce">
      <ellipse cx="35" cy="60" rx="20" ry="15" fill="url(#cloudGrad)" />
      <ellipse cx="55" cy="50" rx="25" ry="20" fill="url(#cloudGrad)" />
      <ellipse cx="75" cy="60" rx="18" ry="13" fill="url(#cloudGrad)" />
      <ellipse cx="55" cy="65" rx="30" ry="15" fill="url(#cloudGrad)" />
    </g>
  </svg>
);

const RainyIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="rainCloud" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#78909C" /><stop offset="100%" stopColor="#546E7A" />
      </linearGradient>
    </defs>
    <g>
      <ellipse cx="35" cy="40" rx="18" ry="12" fill="url(#rainCloud)" />
      <ellipse cx="55" cy="32" rx="22" ry="16" fill="url(#rainCloud)" />
      <ellipse cx="72" cy="40" rx="15" ry="10" fill="url(#rainCloud)" />
    </g>
    <g className="animate-rain-fall">
      <line x1="30" y1="55" x2="25" y2="70" stroke="#64B5F6" strokeWidth="2" strokeLinecap="round" />
      <line x1="45" y1="58" x2="40" y2="78" stroke="#64B5F6" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="55" x2="55" y2="72" stroke="#64B5F6" strokeWidth="2" strokeLinecap="round" />
      <line x1="75" y1="58" x2="70" y2="75" stroke="#64B5F6" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

const SnowyIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="snowCloud" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E3F2FD" /><stop offset="100%" stopColor="#90CAF9" />
      </linearGradient>
    </defs>
    <g>
      <ellipse cx="35" cy="40" rx="18" ry="12" fill="url(#snowCloud)" />
      <ellipse cx="55" cy="32" rx="22" ry="16" fill="url(#snowCloud)" />
      <ellipse cx="72" cy="40" rx="15" ry="10" fill="url(#snowCloud)" />
    </g>
    <g className="animate-snow-fall">
      <circle cx="30" cy="60" r="3" fill="white" />
      <circle cx="45" cy="70" r="2" fill="white" />
      <circle cx="60" cy="65" r="3" fill="white" />
      <circle cx="75" cy="75" r="2" fill="white" />
    </g>
  </svg>
);

const StormyIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="stormCloud" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#37474F" /><stop offset="100%" stopColor="#212121" />
      </linearGradient>
    </defs>
    <g>
      <ellipse cx="35" cy="38" rx="20" ry="14" fill="url(#stormCloud)" />
      <ellipse cx="55" cy="30" rx="24" ry="18" fill="url(#stormCloud)" />
      <ellipse cx="75" cy="38" rx="17" ry="12" fill="url(#stormCloud)" />
    </g>
    <g className="animate-rain-fall">
      <line x1="30" y1="55" x2="25" y2="72" stroke="#90CAF9" strokeWidth="2" strokeLinecap="round" />
      <line x1="45" y1="58" x2="40" y2="78" stroke="#90CAF9" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="55" x2="55" y2="74" stroke="#90CAF9" strokeWidth="2" strokeLinecap="round" />
      <line x1="75" y1="58" x2="70" y2="77" stroke="#90CAF9" strokeWidth="2" strokeLinecap="round" />
    </g>
    <polygon points="48,48 42,62 50,62 46,78 58,58 50,58" fill="#FFD600" className="animate-pulse" />
  </svg>
);

const NightIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <radialGradient id="moonGrad" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#FFFDE7" /><stop offset="100%" stopColor="#FFD54F" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="25" fill="url(#moonGrad)" />
    <g opacity="0.3">
      <circle cx="40" cy="45" r="3" fill="#9E9E9E" />
      <circle cx="55" cy="55" r="4" fill="#9E9E9E" />
      <circle cx="60" cy="40" r="2" fill="#9E9E9E" />
    </g>
  </svg>
);