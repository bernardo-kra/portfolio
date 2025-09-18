import React from 'react'
import { Typography, Section } from '@components/common'
import { useI18n } from '@src/i18n'
import { useAppConfig } from '@context/AppConfigContext'
import styles from './styles.module.css'

const Footer: React.FC = () => {
  const { t } = useI18n()
  const { config } = useAppConfig()
  const currentYear = new Date().getFullYear()

  return (
    <Section variant="footer" background="muted" spacing="lg" className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <Typography variant="h3" color="brand" className={styles.footerName}>
              Bernardo Kraczkowski
            </Typography>
            <Typography variant="body2" color="muted" className={styles.footerTagline}>
              {t.footerTagline}
            </Typography>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.footerSection}>
              <Typography variant="h4" size="sm" className={styles.footerTitle}>
                {t.footerQuickLinks}
              </Typography>
              <ul className={styles.footerList}>
                <li><a href="#sobre" className={styles.footerLink}>{t.aboutTitle}</a></li>
                <li><a href="#experiencia" className={styles.footerLink}>{t.experienceTitle}</a></li>
                <li><a href="#projetos" className={styles.footerLink}>{t.projectsTitle}</a></li>
                <li><a href="#contato" className={styles.footerLink}>{t.contactTitle}</a></li>
              </ul>
            </div>

            {config.ui.showContactMethods && (
              <div className={styles.footerSection}>
                <Typography variant="h4" size="sm" className={styles.footerTitle}>
                  {t.footerConnect}
                </Typography>
                <ul className={styles.footerList}>
                  <li>
                    <a href="https://github.com/bernardo-kra" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>GitHub</a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/in/bernardo-chimoka-853709170/" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>LinkedIn</a>
                  </li>
                  <li>
                    <a href="mailto:bernardo_kra@hotmail.com" className={styles.footerLink}>Email</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className={styles.footerBottom}>
          <Typography variant="caption" color="muted" className={styles.footerCopyright}>
            © {currentYear} Bernardo Kraczkowski. Todos os direitos reservados.
          </Typography>
          <div className={styles.footerTech}>
            <Typography variant="caption" color="muted" className={styles.footerBuiltWith}>
              {t.footerBuiltWith}
            </Typography>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default Footer 