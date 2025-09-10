import React from 'react'
import { Container, Section, Typography, Link } from '@components/common'
import styles from './styles.module.css'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Section className={styles.footer}>
      <Container className={styles.footer__container}>
        <div className={styles.footer__content}>
          <div className={styles.footer__brand}>
            <Typography as="h3" variant="h3" className={styles.footer__logo}>
              Portfolio Dev
            </Typography>
            <Typography as="p" variant="body2" className={styles.footer__description}>
              Transformamos ideias em soluções digitais de alta performance. 
              Desenvolvimento web moderno, responsivo e otimizado para resultados.
            </Typography>
            <div className={styles.footer__social}>
              <a href="https://github.com/bernardo-kra" target="_blank" rel="noopener noreferrer" className={styles.footer__socialLink}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a href="https://linkedin.com/in/bernardo-kra" target="_blank" rel="noopener noreferrer" className={styles.footer__socialLink}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
              <a href="mailto:contato@portfoliodev.com" className={styles.footer__socialLink}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h20.728c.904 0 1.636.732 1.636 1.636zM12 14.182L21.818 7.09H2.182L12 14.182z"/>
                </svg>
                E-mail
              </a>
            </div>
          </div>

          <div className={styles.footer__links}>
            <div className={styles.footer__linkGroup}>
              <Typography as="h4" variant="h4" className={styles.footer__linkTitle}>
                Serviços
              </Typography>
              <ul className={styles.footer__linkList}>
                <li><Link href="#web-development" className={styles.footer__link}>Desenvolvimento Web</Link></li>
                <li><Link href="#mobile-apps" className={styles.footer__link}>Aplicativos Mobile</Link></li>
                <li><Link href="#ecommerce" className={styles.footer__link}>E-commerce</Link></li>
                <li><Link href="#seo" className={styles.footer__link}>SEO & Performance</Link></li>
                <li><Link href="#maintenance" className={styles.footer__link}>Manutenção</Link></li>
              </ul>
            </div>

            <div className={styles.footer__linkGroup}>
              <Typography as="h4" variant="h4" className={styles.footer__linkTitle}>
                Empresa
              </Typography>
              <ul className={styles.footer__linkList}>
                <li><Link href="#about" className={styles.footer__link}>Sobre Nós</Link></li>
                <li><Link href="#portfolio" className={styles.footer__link}>Portfólio</Link></li>
                <li><Link href="#blog" className={styles.footer__link}>Blog</Link></li>
                <li><Link href="#careers" className={styles.footer__link}>Carreiras</Link></li>
                <li><Link href="#contact" className={styles.footer__link}>Contato</Link></li>
              </ul>
            </div>

            <div className={styles.footer__linkGroup}>
              <Typography as="h4" variant="h4" className={styles.footer__linkTitle}>
                Suporte
              </Typography>
              <ul className={styles.footer__linkList}>
                <li><Link href="#help" className={styles.footer__link}>Central de Ajuda</Link></li>
                <li><Link href="#faq" className={styles.footer__link}>FAQ</Link></li>
                <li><Link href="#privacy" className={styles.footer__link}>Privacidade</Link></li>
                <li><Link href="#terms" className={styles.footer__link}>Termos de Uso</Link></li>
                <li><Link href="#cookies" className={styles.footer__link}>Cookies</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.footer__bottom}>
          <div className={styles.footer__bottomContent}>
            <Typography as="p" variant="caption" className={styles.footer__copyright}>
              © {currentYear} Portfolio Dev. Todos os direitos reservados.
            </Typography>
            <div className={styles.footer__bottomLinks}>
              <Link href="#privacy" className={styles.footer__bottomLink}>
                Política de Privacidade
              </Link>
              <Link href="#terms" className={styles.footer__bottomLink}>
                Termos de Serviço
              </Link>
              <Link href="#cookies" className={styles.footer__bottomLink}>
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default Footer
