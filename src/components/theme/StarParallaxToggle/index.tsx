import React from 'react';
import { MousePointer2, MousePointer } from 'lucide-react';
import styles from './styles.module.css';

interface StarParallaxToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

const StarParallaxToggle: React.FC<StarParallaxToggleProps> = React.memo(({ value, onChange, className, style }) => {
  return (
    <button
      className={styles.starParallaxToggle + (value ? ' ' + styles.starParallaxToggleActive : '') + (className ? ' ' + className : '')}
      style={style}
      onClick={() => onChange(!value)}
      aria-label={value ? 'Desativar paralaxe' : 'Ativar paralaxe'}
    >
      {value ? (
        <MousePointer size={16} color="var(--color-primary)" />
      ) : (
        <MousePointer2 size={16} color="var(--color-primary)" />
      )}
    </button>
  );
});

export default StarParallaxToggle; 