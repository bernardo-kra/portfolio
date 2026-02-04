import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Container, FadeInOnScroll } from '@components/common';
import { FloatingChatButton } from '@components/chat';
import ThemeToggleButton from '@components/theme/ThemeToggleButton';
import { useI18n } from '@src/i18n';
import { usePreviewFit } from '@hooks/usePreviewFit';
import styles from './styles.module.css';
import './global-fixes.css';

type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  features: string[];
  previewImage?: string;
  isFeatured?: boolean;
  featuredLabel?: string;
};

type ProjectCardProps = {
  project: Project;
  hoveredCard: string | null;
  setHoveredCard: (value: string | null) => void;
  onNavigate: (route: string) => void;
  index: number;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  hoveredCard,
  setHoveredCard,
  onNavigate,
  index,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const { fit, position } = usePreviewFit(project.previewImage, previewRef);

  return (
    <FadeInOnScroll delay={300 + index * 100}>
      <div
        className={[
          styles.projectCard,
          hoveredCard === project.id ? styles.hovered : '',
          project.isFeatured ? styles.projectCardFeatured : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => onNavigate(project.route)}
        onMouseEnter={() => setHoveredCard(project.id)}
        onMouseLeave={() => setHoveredCard(null)}
        style={
          {
            '--project-color': project.color,
            '--preview-image': project.previewImage ? `url(${project.previewImage})` : 'none',
            '--preview-fit': fit,
            '--preview-pos': position,
          } as React.CSSProperties
        }
      >
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>{project.icon}</div>
          <div className={styles.cardMeta}>
            {project.isFeatured && (
              <span className={styles.featuredBadge}>
                {project.featuredLabel ?? 'Recomendado'}
              </span>
            )}
            <div className={styles.cardBadge}>{project.subtitle}</div>
          </div>
        </div>

        <div className={styles.cardContent}>
          <Typography variant="h3" className={styles.cardTitle}>
            {project.title}
          </Typography>

          <Typography variant="body2" color="muted" className={styles.cardDescription}>
            {project.description}
          </Typography>

          <div className={styles.cardFeatures}>
            {project.features.map((feature, idx) => (
              <span key={idx} className={styles.featureTag}>
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.cardArrow}>→</div>
        </div>

        <div className={styles.previewLayer} aria-hidden="true">
          <div className={styles.previewLoader}>
            <span className={styles.loaderDot} />
            <span className={styles.loaderDot} />
            <span className={styles.loaderDot} />
            <span className={styles.previewText}>Carregando preview</span>
          </div>
          <div className={styles.previewImage} ref={previewRef} />
          {!project.previewImage && (
            <div className={styles.previewFallback}>Preview indisponivel</div>
          )}
        </div>

        <div className={styles.cardHoverEffect} />
      </div>
    </FadeInOnScroll>
  );
};

const ModernHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { lang, setLang, t } = useI18n();
  const homeRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const [lightEnabled, setLightEnabled] = useState(false);
  const [lightBlown, setLightBlown] = useState(false);
  const lastPointerRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const currentRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const home = homeRef.current;
    if (!home) return;

    const updateVars = () => {
      if (!home) return;
      const current = currentRef.current;
      const target = targetRef.current;
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      home.style.setProperty('--hx', `${current.x}`);
      home.style.setProperty('--hy', `${current.y}`);
      rafRef.current = window.requestAnimationFrame(updateVars);
    };

    rafRef.current = window.requestAnimationFrame(updateVars);

    const handleMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      const now = performance.now();
      const last = lastPointerRef.current;
      if (lightEnabled && last) {
        const dx = x - last.x;
        const dy = y - last.y;
        const dt = Math.max(now - last.t, 1);
        const speed = Math.hypot(dx, dy) / dt;
        if (speed > 0.006) {
          setLightEnabled(false);
          setLightBlown(true);
          lastPointerRef.current = null;
          return;
        }
      }

      targetRef.current = { x, y };
      lastPointerRef.current = { x, y, t: now };
    };

    const handleLeave = () => {
      targetRef.current = { x: 0.5, y: 0.5 };
      lastPointerRef.current = null;
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [lightEnabled]);

  const projects: Project[] = [
    {
      id: 'portfolio',
      title: t.portfolioTitle,
      subtitle: t.portfolioSubtitle,
      description: t.portfolioDescription,
      icon: 'DEV',
      color: 'var(--brand-orange)',
      route: '/portfolio',
      features: ['Projetos', 'Experiencia', 'Habilidades', 'Contato'],
      previewImage: '/preview-fullpage-portfolio.png',
      isFeatured: true,
      featuredLabel: 'Destaque',
    },
    {
      id: 'pomodoro',
      title: t.pomodoroTitle,
      subtitle: t.pomodoroSubtitle,
      description: t.pomodoroDescription,
      icon: 'TIME',
      color: '#10b981',
      route: '/pomodoro',
      features: ['Timer', 'Tarefas', 'Estatisticas', 'Musica'],
      previewImage: '/preview-fullpage-pomodoro.png',
    },
    {
      id: 'generative',
      title: t.generativeTitle,
      subtitle: t.generativeSubtitle,
      description: t.generativeDescription,
      icon: 'ART',
      color: '#8b5cf6',
      route: '/generative',
      features: ['Algoritmos', 'Padroes', 'Interatividade', 'Export'],
      previewImage: '/preview-fullpage-generative.png',
    },
    {
      id: 'landing',
      title: t.landingTitle,
      subtitle: t.landingSubtitle,
      description: t.landingDescription,
      icon: 'LAUNCH',
      color: '#f59e0b',
      route: '/landing',
      features: ['Design', 'Performance', 'SEO', 'Analytics'],
      previewImage: '/preview-fullpage-landing.png',
    },
    {
      id: 'experimental3d',
      title: 'Dock 07',
      subtitle: 'Experimento 3D',
      description: 'Interface cinematografica com luzes, camadas e interacao ao vivo.',
      icon: 'NEON',
      color: '#f97316',
      route: '/experimental3d',
      features: ['Luzes', 'Parallax', 'Atmosfera', 'Interacao'],
      previewImage: '/preview-fullpage-experimental3d.png',
    },
  ];

  return (
    <div
      className={[
        styles.homePage,
        lightEnabled ? styles.lightEnabled : styles.lightDisabled,
        lightBlown ? styles.lightBlown : '',
      ].join(' ')}
      ref={homeRef}
    >
      <div className={styles.ambientBackdrop} aria-hidden="true" />
      <div className={styles.cursorLight} aria-hidden="true" />
      {/* Theme Controls */}
      <div className={styles.themeControls}>
        <ThemeToggleButton />
        <button
          className={styles.languageToggle}
          onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
          aria-label="Change language"
        >
          {lang === 'pt' ? 'EN' : 'PT'}
        </button>
      </div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground} aria-hidden="true" />
        <Container className={styles.heroContainer}>
          <FadeInOnScroll delay={100}>
            <div className={styles.heroContent}>
              <div className={styles.heroText}>
                <div className={styles.greeting}>
                  <span className={styles.greetingLine} />
                  <span className={styles.greetingText}>{t.greeting}</span>
                </div>

                <Typography variant="h1" className={styles.heroTitle}>
                  {t.heroTitle}
                </Typography>

                <Typography variant="h2" className={styles.heroSubtitle}>
                  {t.heroSubtitle}
                </Typography>

                <Typography variant="body1" className={styles.heroDescription}>
                  {t.heroDescription}
                </Typography>

                <div className={styles.heroPrompt}>
                  <button
                    className={styles.heroExplore}
                    onClick={() => projectsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Explorar projetos
                  </button>
                  <span
                    className={styles.heroHint}
                    onMouseEnter={() => {
                      setLightEnabled(true);
                      setLightBlown(false);
                    }}
                  >
                    Passe o mouse para ativar a luz (movimento rapido apaga)
                  </span>
                </div>
              </div>

              <div className={styles.heroImage}></div>
            </div>
          </FadeInOnScroll>
        </Container>
      </section>

      {/* Projects Section */}
      <section className={styles.projectsSection} ref={projectsRef}>
        <Container className={styles.projectsContainer}>
          <FadeInOnScroll delay={200}>
            <div className={styles.sectionHeader}>
              <Typography variant="h2" className={styles.sectionTitle}>
                {t.myProjects}
              </Typography>
              <Typography variant="body1" color="muted" className={styles.sectionSubtitle}>
                {t.projectsSubtitle}
              </Typography>
              <div className={styles.sectionHint}>Comece pelo projeto em destaque</div>
            </div>
          </FadeInOnScroll>

          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                onNavigate={navigate}
                index={index}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className={styles.ctaSection}>
        <Container className={styles.ctaContainer}>
          <FadeInOnScroll delay={650}>
            <div className={styles.ctaCard}>
              <div className={styles.ctaGlow} aria-hidden="true" />
              <div className={styles.ctaContent}>
                <Typography variant="h2" className={styles.ctaTitle}>
                  Vamos transformar sua ideia em produto?
                </Typography>
                <Typography variant="body1" className={styles.ctaText}>
                  Me conte o contexto do seu projeto e eu retorno com um plano de execucao e
                  estimativa.
                </Typography>
                <div className={styles.ctaActions}>
                  <button
                    className={styles.ctaPrimary}
                    onClick={() => navigate('/portfolio')}
                  >
                    Quero um briefing
                  </button>
                  <button
                    className={styles.ctaSecondary}
                    onClick={() => navigate('/portfolio')}
                  >
                    Ver portfolio completo
                  </button>
                </div>
              </div>
              <div className={styles.ctaStats}>
                <div>
                  <span className={styles.ctaStatNumber}>5+</span>
                  <span className={styles.ctaStatLabel}>anos de experiencia</span>
                </div>
                <div>
                  <span className={styles.ctaStatNumber}>10+</span>
                  <span className={styles.ctaStatLabel}>projetos entregues</span>
                </div>
                <div>
                  <span className={styles.ctaStatNumber}>100%</span>
                  <span className={styles.ctaStatLabel}>foco em qualidade</span>
                </div>
              </div>
            </div>
          </FadeInOnScroll>
        </Container>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <Container className={styles.statsContainer}>
          <FadeInOnScroll delay={800}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>5+</div>
                <div className={styles.statLabel}>{t.experience}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>8+</div>
                <div className={styles.statLabel}>{t.projectsCompleted}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>10+</div>
                <div className={styles.statLabel}>{t.technologies}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>100%</div>
                <div className={styles.statLabel}>{t.satisfaction}</div>
              </div>
            </div>
          </FadeInOnScroll>
        </Container>
      </section>

      <section className={styles.statsSection}>
        <Container className={styles.statsContainer}>
          <FadeInOnScroll delay={1100}>
            <div className={styles.techChips}>
              <span className={styles.featureTag}>React</span>
              <span className={styles.featureTag}>Vite</span>
              <span className={styles.featureTag}>TypeScript</span>
              <span className={styles.featureTag}>Firebase</span>
              <span className={styles.featureTag}>Tailwind/CSS Modules</span>
              <span className={styles.featureTag}>CI/CD</span>
            </div>
          </FadeInOnScroll>
        </Container>
      </section>

      <div className={styles.footer}>
        <Typography variant="caption" color="muted" className={styles.copyright}>
          © {new Date().getFullYear()} Bernardo Kraczkowski. Todos os direitos reservados.
        </Typography>
      </div>

      <FloatingChatButton />
    </div>
  );
};

export default ModernHomePage;
