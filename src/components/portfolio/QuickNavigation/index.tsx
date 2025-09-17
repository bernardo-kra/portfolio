import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const QuickNavigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('sobre');
  const [isVisible, setIsVisible] = useState(false);

  const sections = [
    { id: 'sobre', label: 'Sobre', icon: '👤' },
    { id: 'experiencia', label: 'Experiência', icon: '💼' },
    { id: 'educacao', label: 'Educação', icon: '🎓' },
    { id: 'contato', label: 'Contato', icon: '📧' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }

      // Show/hide based on scroll position
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <nav className={styles.quickNav}>
      <div className={styles.quickNavContent}>
        {sections.map((section) => (
          <button
            key={section.id}
            className={`${styles.quickNavItem} ${
              activeSection === section.id ? styles.active : ''
            }`}
            onClick={() => scrollToSection(section.id)}
            title={section.label}
          >
            <span className={styles.icon}>{section.icon}</span>
            <span className={styles.label}>{section.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default QuickNavigation;




