import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@theme/ThemeContext';
import styles from './styles.module.css';

const ANIMATION_DURATION = 2800;

const TransitionThemeEffect: React.FC = React.memo(() => {
  const { registerThemeTransitionCallback, theme } = useTheme();
  const [show, setShow] = useState(false);
  const [direction, setDirection] = useState<'to-dark' | 'to-light'>('to-dark');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!registerThemeTransitionCallback) return;
    registerThemeTransitionCallback((newTheme) => {
      setDirection(newTheme === 'dark' ? 'to-dark' : 'to-light');
      setShow(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setShow(false), ANIMATION_DURATION);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerThemeTransitionCallback]);

  return show ? (
    <div
      className={
        styles.transitionOverlay +
        ' ' +
        (direction === 'to-dark' ? styles.toDark : styles.toLight)
      }
      style={{ animationDuration: ANIMATION_DURATION + 'ms' }}
      aria-hidden="true"
    />
  ) : null;
});

export default TransitionThemeEffect; 