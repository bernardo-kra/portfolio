import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@components/common';
import AdvancedProfilePhoto from '../AdvancedProfilePhoto';
import CodeBackground from '../CodeBackground';
import { useAppConfig } from '@context/AppConfigContext';
import styles from './styles.module.css';
import Container from '@components/common/Container';
import bernardoPhoto from '/bernardo-kra.jpg';

interface InteractiveHeroSectionProps {
  t: {
    heroTitle?: string;
    name?: string;
    heroSubtitle?: string;
    role?: string;
    ctaButton?: string;
    secondaryButton?: string;
  };
}

const InteractiveHeroSection: React.FC<InteractiveHeroSectionProps> = ({ t }) => {
  const [currentRole, setCurrentRole] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollText, setShowScrollText] = useState(true);
  const { config } = useAppConfig();
  
  const roles = [
    'Desenvolvedor Frontend',
    'React Specialist',
    'TypeScript Expert',
    'UI/UX Enthusiast',
    'Full Stack Developer'
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 100) {
        setShowScrollText(false);
      } else {
        setShowScrollText(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Container className={styles.heroContainer}>
      <section className={styles.heroSection}>
        <CodeBackground className={styles.codeBackground} />
        
        <div className={`${styles.heroContent} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.heroLeft}>
            <div className={styles.profileContainer}>
              <AdvancedProfilePhoto 
                src={bernardoPhoto} 
                alt="Bernardo Kraczkowski - Desenvolvedor Frontend" 
                className={styles.profilePhoto}
              />
              <div className={styles.floatingBadges}>
                <div className={styles.badge}>React</div>
                <div className={styles.badge}>TypeScript</div>
                <div className={styles.badge}>Node.js</div>
              </div>
            </div>
          </div>
          
          <div className={styles.heroRight}>
            <div className={styles.greeting}>
              <span className={styles.wave}>👋</span>
              <span>Olá, eu sou</span>
            </div>
            
            <Typography variant="h1" className={styles.heroTitle}>
              {t.heroTitle || t.name || 'Bernardo Kraczkowski'}
            </Typography>
            
            <div className={styles.roleContainer}>
              <Typography variant="body1" className={styles.roleText}>
                {t.heroSubtitle || t.role || 'Desenvolvedor Frontend'}
              </Typography>
              <div className={styles.typingAnimation}>
                <span className={styles.typingText}>
                  {roles[currentRole]}
                </span>
                <span className={styles.cursor}>|</span>
              </div>
            </div>
            
            <Typography variant="body1" className={styles.heroDescription}>
              Especialista em React, TypeScript e desenvolvimento web moderno. 
              Criando experiências digitais incríveis com foco em performance e usabilidade.
            </Typography>
            
            <div className={styles.heroActions}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => scrollToSection('sobre')}
                className={styles.primaryButton}
                icon="🚀"
              >
                {t.ctaButton || 'Conheça meu trabalho'}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection('contato')}
                className={styles.secondaryButton}
                icon="📧"
              >
                {t.secondaryButton || 'Vamos conversar'}
              </Button>
            </div>
            
            {config.ui.showContactMethods && (
              <div className={styles.socialLinks}>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <span className={styles.socialIcon}>📱</span>
                  GitHub
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <span className={styles.socialIcon}>💼</span>
                  LinkedIn
                </a>
                <a href="mailto:contato@email.com" className={styles.socialLink}>
                  <span className={styles.socialIcon}>✉️</span>
                  Email
                </a>
              </div>
            )}
          </div>
        </div>
        
        {showScrollText && (
          <div className={styles.scrollIndicator}>
            <div className={styles.scrollText}>Role para baixo</div>
            <div className={styles.scrollArrow}>↓</div>
          </div>
        )}
      </section>
    </Container>
  );
};

export default InteractiveHeroSection;

