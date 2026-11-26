import React, { useState } from 'react'
import { Typography, Section, SectionHeading } from '@components/common'
import { useI18n } from '@src/i18n'
import { Plus } from 'lucide-react'
import styles from './styles.module.css'

interface Experience {
  id: string
  company: string
  location: string
  role: string
  period: string
  shortDescription: string
  fullDescription: string
  technologies: string[]
  achievements: string[]
  isCurrent?: boolean
}

const WorkExperienceTimeline: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { t } = useI18n()

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const experiences: Experience[] = t.workExperience.experiences.map(
    (exp, index) => ({
      ...exp,
      isCurrent: index === 0,
    })
  )

  return (
    <Section id="experiencia" spacing="lg">
      <SectionHeading
        index="01"
        eyebrow={t.experienceTitle}
        title={t.workExperience.title}
      />

      <ol className={styles.timeline}>
        {experiences.map((exp) => {
          const expanded = expandedId === exp.id
          const panelId = `experience-${exp.id}`
          return (
            <li
              key={exp.id}
              className={styles.row}
              data-expanded={expanded}
              data-current={exp.isCurrent}
            >
              <div className={styles.period}>
                {exp.isCurrent && (
                  <span className={styles.currentDot} aria-hidden="true" />
                )}
                {exp.period}
              </div>
              <div className={styles.main}>
                <Typography variant="h3" className={styles.role}>
                  {exp.role}
                </Typography>
                <p className={styles.company}>
                  {exp.company} · {exp.location}
                </p>
                <p className={styles.summary}>{exp.shortDescription}</p>
                <div className={styles.panel} id={panelId}>
                  <div className={styles.panelInner}>
                    <p className={styles.fullDescription}>
                      {exp.fullDescription}
                    </p>
                    <div className={styles.details}>
                      <div>
                        <p className={styles.detailTitle}>
                          {t.workExperience.technologiesTitle}
                        </p>
                        <div className={styles.technologies}>
                          {exp.technologies.map((tech) => (
                            <span key={tech}>{tech}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className={styles.detailTitle}>
                          {t.workExperience.achievementsTitle}
                        </p>
                        <ul className={styles.achievements}>
                          {exp.achievements.map((achievement) => (
                            <li key={achievement}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className={styles.toggle}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => toggleExpanded(exp.id)}
              >
                <span>
                  {expanded
                    ? t.workExperience.collapseButton
                    : t.workExperience.expandButton}
                </span>
                <Plus size={16} aria-hidden="true" />
              </button>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}

export default WorkExperienceTimeline
