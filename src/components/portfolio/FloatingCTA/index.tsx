import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const FloatingCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show CTA when user scrolls past 50% of the page
      setIsVisible(scrollPosition > documentHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contato');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <div className={`${styles.floatingCTA} ${isMinimized ? styles.minimized : ''}`}>
      <div className={styles.ctaContent}>
        <div className={styles.ctaText}>
          <span className={styles.ctaTitle}>Gostou do que viu?</span>
          <span className={styles.ctaSubtitle}>Vamos trabalhar juntos!</span>
        </div>
        
        <div className={styles.ctaActions}>
          <button 
            className={styles.primaryAction}
            onClick={scrollToContact}
          >
            <span className={styles.actionIcon}>💬</span>
            Conversar
          </button>
          
          <button 
            className={styles.secondaryAction}
            onClick={scrollToTop}
          >
            <span className={styles.actionIcon}>⬆️</span>
            Topo
          </button>
        </div>
      </div>
      
      <button 
        className={styles.minimizeButton}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        {isMinimized ? '💬' : '✕'}
      </button>
    </div>
  );
};

export default FloatingCTA;




