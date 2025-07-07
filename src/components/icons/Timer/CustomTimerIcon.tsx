import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

export type TimerEffect =
  | 'pointerRoll'
  | 'shakingClock'
  | 'clockBounce'
  | 'clockPulse'
  | 'pointerWiggle';

export const TIMER_EFFECTS: TimerEffect[] = [
  'pointerRoll',
  'shakingClock',
  'clockBounce',
  'clockPulse',
  'pointerWiggle',
];

interface CustomTimerIconProps {
  className?: string;
  size?: number;
  color?: string;
  effectClassName?: TimerEffect;
  clockHour?: number;
}

const CustomTimerIcon: React.FC<CustomTimerIconProps> = React.memo(({
  className = '',
  size = 64,
  color,
  effectClassName = 'pointerRoll',
  clockHour = 1,
}) => {
  const [iconColor, setIconColor] = useState('var(--color-primary)');

  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme');
    if (color) {
      setIconColor(color);
    } else if (theme === 'light') {
      setIconColor('var(--primary-dark)');
    } else {
      setIconColor('var(--color-primary)');
    }
  }, [color]);

  const clockEffects = ['shakingClock', 'clockBounce', 'clockPulse'] as const;
  const pointerEffects = ['pointerRoll', 'pointerWiggle'] as const;

  const safeHour = ((clockHour - 1) % 12) + 1;
  const topHour = 12;
  const angle = ((clockHour - topHour) * 30);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={iconColor}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={[
        styles.timerIcon,
        className,
        clockEffects.includes(effectClassName as any) ? styles[effectClassName] : ''
      ].join(' ')}
    >
      <circle cx="12" cy="13" r="8" />
      <rect
        x="11.5"
        y="7"
        width="1"
        height="6"
        rx="0.5"
        className={[
          styles.timerPointer,
          pointerEffects.includes(effectClassName as any) ? styles[effectClassName] : ''
        ].join(' ')}
        style={{ ['--pointer-angle' as any]: `${angle}deg` }}
      />
      <line x1="12" y1="1" x2="12" y2="4" />
      <line x1="4.93" y1="7.36" x2="7.36" y2="4.93" />
      <line x1="19.07" y1="7.36" x2="16.64" y2="4.93" />
    </svg>
  );
});

export default CustomTimerIcon; 