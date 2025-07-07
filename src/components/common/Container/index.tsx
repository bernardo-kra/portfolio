import styles from './styles.module.css';
import React from 'react';

type ContainerProps = {
    children: React.ReactNode;
    className?: string;
}

const Container = React.memo(function Container({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
});

export default Container;