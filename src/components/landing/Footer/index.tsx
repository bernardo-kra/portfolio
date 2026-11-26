import { Link } from 'react-router-dom'
import { profile } from '@src/config/profile'
import shared from '../shared.module.css'
import styles from './styles.module.css'

const link = `${styles.footer__link} ${shared.focusRing}`

const Footer = () => (
  <footer className={styles.footer}>
    <div className={shared.inner}>
      <div className={styles.footer__top}>
        <p className={styles.footer__description}>
          Desenvolvimento frontend, experiência profissional e curiosidade em
          prática.
        </p>
        <nav aria-label="Links do estudo" className={styles.footer__links}>
          <Link to="/portfolio" className={link}>
            Portfólio
          </Link>
          <Link to="/" className={link}>
            Todos os estudos
          </Link>
          <a
            href={profile.resumeUrl}
            download={profile.resumeFilename}
            className={link}
          >
            Currículo · PDF
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={link}
          >
            LinkedIn
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className={link}
          >
            GitHub
          </a>
        </nav>
      </div>

      <h2 className={styles.footer__wordmark}>
        Bernardo <span className={shared.serif}>Kraczkowski</span>
      </h2>

      <p className={styles.footer__legal}>
        <span>© {new Date().getFullYear()} Bernardo Kraczkowski</span>
        <span>Estudo de landing page</span>
      </p>
    </div>
  </footer>
)

export default Footer
