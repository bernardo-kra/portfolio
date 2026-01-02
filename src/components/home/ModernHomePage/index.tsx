import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Container, FadeInOnScroll } from '@components/common';
import { FloatingChatButton } from '@components/chat';
import styles from './styles.module.css';
import './global-fixes.css';

const ModernHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const projects = [
    {
      id: 'portfolio',
      title: 'Portfolio',
      subtitle: 'Meu trabalho',
      description: 'Conheça meus projetos, habilidades e experiência profissional',
      icon: '👨‍💻',
      color: 'var(--brand-orange)',
      route: '/portfolio',
      features: ['Projetos', 'Experiência', 'Habilidades', 'Contato']
    },
    {
      id: 'pomodoro',
      title: 'Pomodoro Timer',
      subtitle: 'Produtividade',
      description: 'Ferramenta de produtividade para gerenciar seu tempo',
      icon: '⏱️',
      color: '#10b981',
      route: '/pomodoro',
      features: ['Timer', 'Tarefas', 'Estatísticas', 'Música']
    },
    {
      id: 'generative',
      title: 'Generative Art',
      subtitle: 'Criatividade',
      description: 'Crie padrões únicos com algoritmos procedurais',
      icon: '🎨',
      color: '#8b5cf6',
      route: '/generative',
      features: ['Algoritmos', 'Padrões', 'Interatividade', 'Export']
    },
    {
      id: 'landing',
      title: 'Landing Page',
      subtitle: 'Conversão',
      description: 'Página de alta conversão com design moderno',
      icon: '🚀',
      color: '#f59e0b',
      route: '/landing',
      features: ['Design', 'Performance', 'SEO', 'Analytics']
    }
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground} />
        <Container className={styles.heroContainer}>
          <FadeInOnScroll delay={100}>
            <div className={styles.heroContent}>
              <div className={styles.greeting}>
                <span className={styles.wave}>👋</span>
                <span>Olá, eu sou</span>
              </div>
              
              <Typography variant="h1" className={styles.heroTitle}>
                Bernardo Kraczkowski
              </Typography>
              
              <Typography variant="h2" className={styles.heroSubtitle}>
                Desenvolvedor React focado em interfaces rápidas e envolventes
              </Typography>
              
              <Typography variant="body1" className={styles.heroDescription}>
                Transformo ideias em produtos digitais performáticos, acessíveis e fáceis de usar.
              </Typography>
              
              <div className={styles.timeDisplay}>
                <div className={styles.time}>{formatTime(currentTime)}</div>
                <div className={styles.date}>{formatDate(currentTime)}</div>
              </div>
            </div>
          </FadeInOnScroll>
        </Container>
      </section>

      {/* Projects Section */}
      <section className={styles.projectsSection}>
        <Container className={styles.projectsContainer}>
          <FadeInOnScroll delay={200}>
            <div className={styles.sectionHeader}>
              <Typography variant="h2" className={styles.sectionTitle}>
                Meus Projetos
              </Typography>
              <Typography variant="body1" color="muted" className={styles.sectionSubtitle}>
                Explore as diferentes áreas do meu trabalho
              </Typography>
            </div>
          </FadeInOnScroll>

          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <FadeInOnScroll key={project.id} delay={300 + (index * 100)}>
                <div
                  className={`${styles.projectCard} ${hoveredCard === project.id ? styles.hovered : ''}`}
                  onClick={() => navigate(project.route)}
                  onMouseEnter={() => setHoveredCard(project.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ '--project-color': project.color } as React.CSSProperties}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>{project.icon}</div>
                    <div className={styles.cardBadge}>{project.subtitle}</div>
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
                    <div className={styles.cardArrow}>
                      →
                    </div>
                  </div>
                  
                  <div className={styles.cardHoverEffect} />
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <Container className={styles.statsContainer}>
          <FadeInOnScroll delay={800}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>3+</div>
                <div className={styles.statLabel}>Anos de Experiência</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>50+</div>
                <div className={styles.statLabel}>Projetos Concluídos</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>10+</div>
                <div className={styles.statLabel}>Tecnologias</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>100%</div>
                <div className={styles.statLabel}>Satisfação</div>
              </div>
            </div>
          </FadeInOnScroll>
        </Container>
      </section>

      <section className={styles.ctaSection}>
        <Container className={styles.ctaContainer}>
          <FadeInOnScroll delay={1000}>
            <div className={styles.ctaContent}>
              <Typography variant="h2" className={styles.ctaTitle}>
                Pronto para começar?
              </Typography>
              <Typography variant="body1" color="muted" className={styles.ctaDescription}>
                Aceitando novos projetos • resposta média {'<'} 24h
              </Typography>
              <div className={styles.ctaButtons}>
                <button 
                  className={styles.primaryButton}
                  onClick={() => navigate('/portfolio')}
                  aria-label="Explorar portfólio"
                >
                  Explorar portfólio
                </button>
                <button 
                  className={styles.secondaryButton}
                  onClick={() => navigate('/landing')}
                  aria-label="Ver landing page"
                >
                  Ver landing
                </button>
                <a
                  className={styles.secondaryButton}
                  href="/bernardo-kra.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Baixar currículo em PDF"
                >
                  Baixar CV
                </a>
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

      <FloatingChatButton />
    </div>
  );
};

export default ModernHomePage;
