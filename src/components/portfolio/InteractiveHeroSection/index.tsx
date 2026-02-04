import React, { useState, useEffect, useRef } from 'react';
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
  const [typedText, setTypedText] = useState('');
  const [suffixText, setSuffixText] = useState('');
  const [phase, setPhase] = useState<'type' | 'pause' | 'smile' | 'emoji' | 'delete'>('type');
  const [suffixMode, setSuffixMode] = useState<'none' | 'emoji' | 'react' | 'glitch'>('none');
  const plannedSuffixRef = useRef<'none' | 'emoji' | 'react' | 'glitch'>('none');
  const cycleRef = useRef(0);
  const lastEmojiRef = useRef<string | null>(null);
  const glitchRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollText, setShowScrollText] = useState(true);
  const [badgeSetIndex, setBadgeSetIndex] = useState(0);
  const [isBadgeFading, setIsBadgeFading] = useState(false);
  const { config } = useAppConfig();

  const roles = t.heroRoles ?? [
    'Desenvolvedor Frontend',
    'React Specialist',
    'TypeScript Expert',
    'UI/UX Enthusiast',
    'Full Stack Developer',
  ];

  const emojis = ['🙂', '😊', '😄', '😉'];
  const reactIcon = '⚛︎';
  const glitchChars = ['�', '▒', '░'];
  const badgeSets = t.heroBadgeSets ?? [
    ['React', 'TypeScript', 'Node.js'],
    ['Next.js', 'UI', 'Performance'],
    ['Design Systems', 'A11y', 'DX'],
    ['Testing', 'State', 'SEO'],
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIsBadgeFading(true);
      window.setTimeout(() => {
        setBadgeSetIndex((prev) => (prev + 1) % badgeSets.length);
        setIsBadgeFading(false);
      }, 250);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [badgeSets.length]);

  useEffect(() => {
    const currentWord = roles[currentRole];
    const smileChars = [' ', ':', ' ', ')'];
    let timeout = 140;

    if (phase === 'pause') timeout = 800;
    if (phase === 'emoji') timeout = 700;
    if (phase === 'delete') timeout = suffixText.length > 0 ? 70 : 60;

    const handler = window.setTimeout(() => {
      if (phase === 'type') {
        const nextText = currentWord.slice(0, typedText.length + 1);
        setTypedText(nextText);
        if (nextText.length === currentWord.length) {
          const roll = Math.random();
          if (glitchRef.current) {
            plannedSuffixRef.current = 'glitch';
          } else if (roll < 0.12) {
            plannedSuffixRef.current = 'react';
          } else if (roll < 0.32) {
            plannedSuffixRef.current = 'emoji';
          } else {
            plannedSuffixRef.current = 'none';
          }
          setPhase('pause');
        }
        return;
      }

      if (phase === 'pause') {
        if (plannedSuffixRef.current === 'emoji') {
          setPhase('smile');
        } else if (plannedSuffixRef.current === 'react') {
          setSuffixMode('react');
          setSuffixText(` ${reactIcon}`);
          setPhase('delete');
        } else if (plannedSuffixRef.current === 'glitch') {
          setSuffixMode('glitch');
          setSuffixText(` ${glitchChars[Math.floor(Math.random() * glitchChars.length)]}`);
          setPhase('delete');
        } else {
          setSuffixMode('none');
          setSuffixText('');
          setPhase('delete');
        }
        return;
      }

      if (phase === 'smile') {
        const nextSuffix = smileChars.slice(0, suffixText.length + 1).join('');
        setSuffixText(nextSuffix);
        if (nextSuffix.length === smileChars.length) {
          setPhase('emoji');
        }
        return;
      }

      if (phase === 'emoji') {
        setSuffixMode('emoji');
        const available = emojis.filter((e) => e !== lastEmojiRef.current);
        const nextEmoji = available[Math.floor(Math.random() * available.length)];
        lastEmojiRef.current = nextEmoji;
        setSuffixText(` ${nextEmoji}`);
        setPhase('delete');
        return;
      }

      if (phase === 'delete') {
        if (suffixText.length > 0) {
          setSuffixText(suffixText.slice(0, -1));
          return;
        }
        const nextText = currentWord.slice(0, Math.max(typedText.length - 1, 0));
        setTypedText(nextText);
        if (nextText.length === 0) {
          const nextRole = (currentRole + 1) % roles.length;
          if (nextRole === 0) {
            cycleRef.current += 1;
            glitchRef.current = cycleRef.current % 10 === 0;
          }
          setCurrentRole(nextRole);
          setSuffixMode('none');
          setPhase('type');
        }
      }
    }, timeout);

    return () => window.clearTimeout(handler);
  }, [typedText, suffixText, phase, currentRole, roles]);

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
                <div className={styles.badge}>
                  <span className={`${styles.badgeText} ${isBadgeFading ? styles.badgeFading : ''}`}>
                    {badgeSets[badgeSetIndex][0]}
                  </span>
                </div>
                <div className={styles.badge}>
                  <span className={`${styles.badgeText} ${isBadgeFading ? styles.badgeFading : ''}`}>
                    {badgeSets[badgeSetIndex][1]}
                  </span>
                </div>
                <div className={styles.badge}>
                  <span className={`${styles.badgeText} ${isBadgeFading ? styles.badgeFading : ''}`}>
                    {badgeSets[badgeSetIndex][2]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.greeting}>
              <span className={styles.wave}>👋</span>
              <span>{t.greeting || 'Olá, eu sou'}</span>
            </div>

            <Typography variant="h1" className={styles.heroTitle}>
              {t.heroTitle || t.name || 'Bernardo Kraczkowski'}
            </Typography>

            <div className={styles.roleContainer}>
              <Typography variant="body1" className={styles.roleText}>
                {t.heroSubtitle || t.role || 'Desenvolvedor Frontend'}
              </Typography>
              <div className={styles.typingAnimation}>
                <span className={styles.typingText}>{typedText}</span>
                <span className={styles.typingSuffix}>{suffixText}</span>
                <span className={styles.cursor}>|</span>
              </div>
            </div>

            <Typography variant="body1" className={styles.heroDescription}>
              {t.heroDescription ||
                'Especialista em React, TypeScript e desenvolvimento web moderno. Criando experiências digitais incríveis com foco em performance e usabilidade.'}
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
                  {t.githubLabel || 'GitHub'}
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <span className={styles.socialIcon}>💼</span>
                  {t.linkedinLabel || 'LinkedIn'}
                </a>
                <a href="mailto:contato@email.com" className={styles.socialLink}>
                  <span className={styles.socialIcon}>✉️</span>
                  {t.emailLabel || 'Email'}
                </a>
              </div>
            )}
          </div>
        </div>

        {showScrollText && (
          <div className={styles.scrollIndicator}>
            <div className={styles.scrollText}>{t.scrollDown || 'Role para baixo'}</div>
            <div className={styles.scrollArrow}>↓</div>
          </div>
        )}
      </section>
    </Container>
  );
};

export default InteractiveHeroSection;
