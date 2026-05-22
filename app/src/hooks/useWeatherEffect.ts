import { useEffect, useRef, useCallback } from 'react';
import type { WeatherType } from '../types/weather';

export const useWeatherEffect = (weather: WeatherType, canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const animationRef = useRef<number>();
  const particlesRef = useRef<{ x: number; y: number; speed: number; size: number; opacity: number; angle?: number }[]>([]);

  const createParticles = useCallback((canvas: HTMLCanvasElement) => {
    const count = weather === 'rainy' || weather === 'stormy' ? 150 : weather === 'snowy' ? 100 : weather === 'sunny' ? 5 : 8;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: weather === 'rainy' || weather === 'stormy' ? 8 + Math.random() * 8 : weather === 'snowy' ? 1 + Math.random() * 2 : weather === 'sunny' ? 0.2 + Math.random() * 0.3 : 0.3 + Math.random() * 0.5,
      size: weather === 'rainy' || weather === 'stormy' ? 1 + Math.random() * 2 : weather === 'snowy' ? 2 + Math.random() * 4 : weather === 'sunny' ? 60 + Math.random() * 80 : 50 + Math.random() * 100,
      opacity: weather === 'rainy' || weather === 'stormy' ? 0.3 + Math.random() * 0.5 : weather === 'snowy' ? 0.5 + Math.random() * 0.5 : 0.1 + Math.random() * 0.3,
      angle: Math.random() * Math.PI * 2
    }));
  }, [weather]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const particles = particlesRef.current;

    if (weather === 'rainy' || weather === 'stormy') {
      particles.forEach(p => {
        ctx!.beginPath();
        ctx!.strokeStyle = `rgba(147, 197, 253, ${p.opacity})`;
        ctx!.lineWidth = p.size * 0.5;
        ctx!.moveTo(p.x, p.y);
        ctx!.lineTo(p.x - 5, p.y + 15);
        ctx!.stroke();
        p.y += p.speed;
        p.x += Math.sin(p.y * 0.02) * 0.5;
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
      });
    } else if (weather === 'snowy') {
      particles.forEach(p => {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx!.shadowBlur = 10;
        ctx!.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx!.fill();
        ctx!.shadowBlur = 0;
        p.y += p.speed;
        p.x += Math.sin(p.y * 0.02) * 0.8 + Math.cos(p.y * 0.01) * 0.3;
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
      });
    } else if (weather === 'sunny') {
      const sunX = canvas.width * 0.2, sunY = canvas.height * 0.25, sunSize = 100;
      const gradient = ctx!.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunSize);
      gradient.addColorStop(0, 'rgba(255, 200, 50, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 180, 50, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 150, 50, 0)');
      ctx!.fillStyle = gradient;
      ctx!.fillRect(sunX - sunSize, sunY - sunSize, sunSize * 2, sunSize * 2);
      particles.forEach(p => {
        const time = Date.now() * 0.001;
        const rayLength = p.size * 1.5;
        const angle = (p.angle || 0) + time * 0.1;
        ctx!.beginPath();
        ctx!.strokeStyle = `rgba(255, 220, 100, ${p.opacity})`;
        ctx!.lineWidth = 3;
        ctx!.moveTo(sunX + Math.cos(angle) * p.size * 0.8, sunY + Math.sin(angle) * p.size * 0.8);
        ctx!.lineTo(sunX + Math.cos(angle) * (p.size * 0.8 + rayLength), sunY + Math.sin(angle) * (p.size * 0.8 + rayLength));
        ctx!.stroke();
      });
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [weather, canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; createParticles(canvas); };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();
    return () => { window.removeEventListener('resize', resizeCanvas); if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [weather, createParticles, animate, canvasRef]);
};