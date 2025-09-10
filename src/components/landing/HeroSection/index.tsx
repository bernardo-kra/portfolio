import React from 'react'
import { Container, Section, Typography, Button } from '@components/common'
import styles from './styles.module.css'

const HeroSection: React.FC = () => {
  const handleCTAClick = () => {
    const contactSection = document.getElementById('contact-form')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Section className={styles.hero}>
      <Container className={styles.hero__container}>
        <div className={styles.hero__content}>
          <Typography 
            as="h1" 
            variant="h1" 
            className={styles.hero__title}
          >
            Transforme Sua Ideia em Realidade Digital
          </Typography>
          
          <Typography 
            as="p" 
            variant="body1" 
            className={styles.hero__subtitle}
          >
            Desenvolvemos soluções web modernas, responsivas e de alta performance 
            que impulsionam seu negócio e geram resultados reais.
          </Typography>

          <div className={styles.hero__cta}>
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleCTAClick}
              className={styles.hero__ctaPrimary}
            >
              Começar Agora
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.open('#portfolio', '_blank')}
              className={styles.hero__ctaSecondary}
            >
              Ver Portfólio
            </Button>
          </div>

          <div className={styles.hero__stats}>
            <div className={styles.hero__stat}>
              <Typography as="span" variant="h2" className={styles.hero__statNumber}>
                50+
              </Typography>
              <Typography as="span" variant="body2" className={styles.hero__statLabel}>
                Projetos Entregues
              </Typography>
            </div>
            
            <div className={styles.hero__stat}>
              <Typography as="span" variant="h2" className={styles.hero__statNumber}>
                100%
              </Typography>
              <Typography as="span" variant="body2" className={styles.hero__statLabel}>
                Clientes Satisfeitos
              </Typography>
            </div>
            
            <div className={styles.hero__stat}>
              <Typography as="span" variant="h2" className={styles.hero__statNumber}>
                24/7
              </Typography>
              <Typography as="span" variant="body2" className={styles.hero__statLabel}>
                Suporte Técnico
              </Typography>
            </div>
          </div>
        </div>

        <div className={styles.hero__visual}>
          <div className={styles.hero__codeBlock}>
            <div className={styles.hero__codeHeader}>
              <div className={styles.hero__codeDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className={styles.hero__codeTitle}>portfolio.js</span>
            </div>
            <div className={styles.hero__codeContent}>
              <pre>
{`const portfolio = {
  skills: ['React', 'TypeScript', 'Node.js'],
  experience: '5+ anos',
  projects: '50+ entregues',
  satisfaction: '100%'
}

const result = await buildYourDream(
  portfolio,
  { quality: 'premium', speed: 'fast' }
)

console.log('Sucesso! 🚀')`}
              </pre>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default HeroSection
