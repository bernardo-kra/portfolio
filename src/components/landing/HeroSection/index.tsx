import { Link } from 'react-router-dom'
import { Container, Section, Typography } from '@components/common'
import styles from './styles.module.css'

const HeroSection = () => (
  <Section className={styles.hero}>
    <Container className={styles.hero__container}>
      <div className={styles.hero__content}>
        <p>LAB / ESTUDO DE LANDING PAGE</p>
        <Typography as="h1" variant="h1" className={styles.hero__title}>
          Uma boa interface transforma interesse em conversa.
        </Typography>
        <Typography as="p" variant="body1" className={styles.hero__subtitle}>
          Clareza na mensagem, cuidado na interação e um próximo passo fácil de
          encontrar. Um estudo de design e desenvolvimento por Bernardo
          Kraczkowski.
        </Typography>
        <div className={styles.hero__cta}>
          <a href="#contact-form" className={styles.hero__ctaPrimary}>
            Conversar sobre uma oportunidade →
          </a>
          <Link to="/portfolio" className={styles.hero__ctaSecondary}>
            Conhecer minha experiência
          </Link>
        </div>
        <div className={styles.hero__stats}>
          {['React + TypeScript', 'Layout responsivo', 'Contato direto'].map(
            (item) => (
              <span key={item}>{item}</span>
            )
          )}
        </div>
      </div>
      <div className={styles.hero__visual}>
        <div className={styles.hero__codeBlock}>
          <div className={styles.hero__codeHeader}>
            <span className={styles.hero__codeTitle}>
              DA PRIMEIRA IMPRESSÃO AO PRÓXIMO PASSO
            </span>
          </div>
          <div className={styles.hero__codeContent}>
            <p>01 / ENTENDER</p>
            <h2>Uma mensagem clara.</h2>
            <p>02 / CONHECER</p>
            <h2>Evidências do trabalho.</h2>
            <p>03 / CONVERSAR</p>
            <h2>Um contato sem barreiras.</h2>
          </div>
        </div>
      </div>
    </Container>
  </Section>
)
export default HeroSection
