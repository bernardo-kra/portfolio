import React, { useRef, useEffect } from 'react';
import styles from './styles.module.css';

const DayBackground: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Nuvens simples animadas
    const clouds = Array.from({ length: 6 }, (__, idx) => ({
      x: Math.random() * width,
      y: 40 + Math.random() * (height * 0.4),
      speed: 0.2 + Math.random() * 0.15,
      size: 60 + Math.random() * 60,
      opacity: 0.3 + Math.random() * 0.3,
    }));

    function drawCloud(cx: number, cy: number, size: number, opacity: number) {
      if (!ctx) return;
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.4, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(cx + size * 0.3, cy - size * 0.4, size * 0.3, Math.PI * 1, Math.PI * 1.85);
      ctx.arc(cx + size * 0.7, cy - size * 0.2, size * 0.25, Math.PI * 1.37, Math.PI * 1.91);
      ctx.arc(cx + size * 0.9, cy, size * 0.3, Math.PI * 1.5, Math.PI * 0.5);
      ctx.closePath();
      const cloudColor = getComputedStyle(document.documentElement).getPropertyValue('--cloud-color').trim() || '#fff';
      const cloudShadow = getComputedStyle(document.documentElement).getPropertyValue('--cloud-shadow').trim() || '#fff';
      ctx.fillStyle = cloudColor;
      ctx.shadowColor = cloudShadow;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      // Gradiente de céu azul claro
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      const grad1 = getComputedStyle(document.documentElement).getPropertyValue('--day-gradient-1').trim() || '#b3e0ff';
      const grad2 = getComputedStyle(document.documentElement).getPropertyValue('--day-gradient-2').trim() || '#e6f7ff';
      grad.addColorStop(0, grad1);
      grad.addColorStop(1, grad2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      for (const cloud of clouds) {
        drawCloud(cloud.x, cloud.y, cloud.size, cloud.opacity);
        cloud.x += cloud.speed;
        if (cloud.x - cloud.size > width) cloud.x = -cloud.size;
      }
      requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles.dayBackgroundCanvas}
      aria-hidden="true"
    />
  );
});

export default DayBackground; 