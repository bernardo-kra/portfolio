import React from 'react'
import { Typography, Section } from '@components/common'
import { useI18n } from '@src/i18n'
import styles from './styles.module.css'

const ContactDisabled: React.FC = () => {
  const { t } = useI18n()

  return (
    <Section id="contato" spacing="lg">
      <div className={styles.disabledContainer}>
        <div className={styles.disabledIcon}>
          <span className={styles.icon}>📧</span>
        </div>
        
        <Typography variant="h3" align="center" className={styles.disabledTitle}>
          {t.contactDisabledTitle}
        </Typography>
        
        <Typography variant="body1" color="muted" align="center" className={styles.disabledMessage}>
          {t.contactDisabledMessage}
        </Typography>
        
        <div className={styles.disabledNote}>
          <Typography variant="body2" color="muted" align="center" className={styles.noteText}>
            {t.contactDisabledNote}
          </Typography>
        </div>
      </div>
    </Section>
  )
}

export default ContactDisabled
