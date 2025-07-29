import React from 'react'
import { Typography, Tag } from '@components/common'
import { useI18n } from '@src/i18n'
import styles from './styles.module.css'

const AboutMe: React.FC = () => {
  const { t } = useI18n()

  return (
    <div className={styles.aboutmeSection}>
      <Typography variant="h2" className={styles.aboutmeTitle}>
        {t.aboutTitle}
      </Typography>
      <Typography variant="body1" color="muted" className={styles.aboutmeDesc}>
        {t.aboutDescriptionLong || t.aboutDescription}
      </Typography>
      <div className={styles.aboutmeSkills}>
        {t.skills.map((skill: string) => (
          <Tag
            key={skill}
            variant="brand"
            size="sm"
            className={styles.aboutmeSkill}
          >
            {skill}
          </Tag>
        ))}
      </div>
    </div>
  )
}

export default AboutMe