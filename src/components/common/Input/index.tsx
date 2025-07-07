import React from 'react';
import styles from './styles.module.css';

export type InputAs = 'input' | 'textarea' | 'select';
export type InputProps<T extends InputAs = 'input'> = {
  label: string;
  as?: T;
} & React.ComponentPropsWithoutRef<T>;

const Input = React.memo(function Input<T extends InputAs = 'input'>({ label, as, id, className, ...props }: InputProps<T>) {
  const Element = (as || 'input') as React.ElementType;
  const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <label htmlFor={inputId} className={styles.inputLabel}>
      <span className={styles.inputLabelText}>{label}</span>
      <Element id={inputId} className={[styles.inputField, className].filter(Boolean).join(' ')} {...props} />
    </label>
  );
});

export default Input; 