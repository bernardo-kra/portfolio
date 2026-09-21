import { Link } from 'react-router-dom'
import { Container, Section } from '@components/common'
import { profile } from '@src/config/profile'
import styles from './styles.module.css'
const Footer = () => (
  <Section className={styles.footer}>
    <Container className={styles.footer__container}>
      <div className={styles.footer__content}>
        <div className={styles.footer__brand}>
          <h2 className={styles.footer__logo}>Bernardo Kraczkowski</h2>
          <p className={styles.footer__description}>
            Desenvolvimento frontend, experiência profissional e curiosidade em
            prática.
          </p>
        </div>
        <nav aria-label="Links do estudo" className={styles.footer__links}>
          <Link to="/portfolio" className={styles.footer__link}>
            Portfólio
          </Link>
          <Link to="/" className={styles.footer__link}>
            Todos os estudos
          </Link>
          <a
            href={profile.resumeUrl}
            download={profile.resumeFilename}
            className={styles.footer__link}
          >
            Currículo · PDF
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footer__link}
          >
            LinkedIn
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footer__link}
          >
            GitHub
          </a>
        </nav>
      </div>
      <p>
        © {new Date().getFullYear()} Bernardo Kraczkowski · Estudo de landing
        page
      </p>
    </Container>
  </Section>
)
export default Footer
