import styles from './styles.module.css';
import React from 'react';

const Container = React.memo(function Container({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
});

export default Container;