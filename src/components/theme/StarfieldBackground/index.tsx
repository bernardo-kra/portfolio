import React, { useRef, useEffect } from 'react';
import styles from './styles.module.css';

// Configurações do campo de estrelas
const STAR_COUNT = 180;
const getStarColors = () => [
  getComputedStyle(document.documentElement).getPropertyValue('--text-default').trim() || '#fff',
  getComputedStyle(document.documentElement).getPropertyValue('--gray-200').trim() || '#bfcfff',
  getComputedStyle(document.documentElement).getPropertyValue('--gray-300').trim() || '#e6e9ff',
  getComputedStyle(document.documentElement).getPropertyValue('--gray-400').trim() || '#cfd8ff',
];
const STAR_MIN_RADIUS = 0.5;
const STAR_MAX_RADIUS = 1.8;
const STAR_MIN_SPEED = 0.02;
const STAR_MAX_SPEED = 0.15;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

interface StarfieldBackgroundProps {
  disableParallax?: boolean;
}

const StarfieldBackground: React.FC<StarfieldBackgroundProps> = React.memo(({ disableParallax = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const stars = useRef<any[]>([]);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  // Inicializa estrelas
  const createStars = (w: number, h: number) => {
    stars.current = Array.from({ length: STAR_COUNT }, () => {
      const depth = randomBetween(0.2, 1);
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: randomBetween(STAR_MIN_RADIUS, STAR_MAX_RADIUS) * depth,
        speed: randomBetween(STAR_MIN_SPEED, STAR_MAX_SPEED) * depth,
        color: getStarColors()[Math.floor(Math.random() * getStarColors().length)],
        depth,
      };
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    createStars(width, height);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      createStars(width, height);
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (disableParallax) return;
      mouse.current.x = e.clientX / width;
      mouse.current.y = e.clientY / height;
    };
    window.addEventListener('mousemove', handleMouseMove);

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const star of stars.current) {
        // Paralaxe: move as estrelas conforme o mouse
        const parallaxX = (mouse.current.x - 0.5) * 80 * (1 - star.depth);
        const parallaxY = (mouse.current.y - 0.5) * 40 * (1 - star.depth);
        let x = star.x + (disableParallax ? 0 : parallaxX);
        let y = star.y + (disableParallax ? 0 : parallaxY);
        // Desenha estrela
        ctx.beginPath();
        ctx.arc(x, y, star.r, 0, 2 * Math.PI);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = 0.7 + 0.3 * star.depth;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 8 * star.depth;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        // Move estrela
        star.x += star.speed * star.depth;
        if (star.x > width + 10) star.x = -10;
      }
      animationRef.current = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [disableParallax]);

  return (
    <canvas
      ref={canvasRef}
      className={[
        styles.starfieldCanvas,
        disableParallax ? styles.starfieldNoParallax : ''
      ].join(' ')}
      aria-hidden="true"
    />
  );
});

export default StarfieldBackground; 