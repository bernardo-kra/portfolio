import React, { useState } from 'react'
import { Typography, Section, Button } from '@components/common'
import { useI18n } from '@src/i18n'
import { ChevronDown, ChevronUp } from 'lucide-react'
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

  const experiences: Experience[] = t.workExperience.experiences.map((exp, index) => ({
    ...exp,
    isCurrent: index === 0
  }))

  return (
    <Section id="experiencia" spacing="lg">
      <Typography variant="h2" className={styles.timelineTitle}>
        {t.workExperience.title.split(' ').map((word, index) => 
          index === 1 ? (
            <Typography key={index} as="span" color="brand" className={styles.highlight}>
              {word}
            </Typography>
          ) : (
            <span key={index}>{word} </span>
          )
        )}
      </Typography>
      
      <div className={styles.timelineContainer}>
        {experiences.map((exp, idx) => (
          <div 
            className={`${styles.timelineRow} ${expandedId === exp.id ? styles.expanded : ''}`} 
            key={exp.id}
            style={{ animationDelay: `${idx * 0.2}s` }}
          >
            <div className={styles.timelineLeft}>
              <Typography variant="h4" weight="semibold" className={styles.timelineCompany}>
                {exp.company}, {exp.location}
              </Typography>
              <Typography variant="caption" color="muted" className={styles.timelinePeriod}>
                {exp.period}
              </Typography>
            </div>
            
            <div className={styles.timelineCenter}>
              <div 
                className={`${styles.timelineDot} ${idx % 2 === 0 ? styles.timelineDotOrange : styles.timelineDotDark}`}
                onClick={() => toggleExpanded(exp.id)}
              >
                {exp.isCurrent && <div className={styles.currentIndicator} />}
              </div>
              {idx < experiences.length - 1 && (
                <div className={styles.timelineLine} />
              )}
            </div>
            
            <div className={styles.timelineRight}>
              <Typography variant="h5" weight="semibold" className={styles.timelineRole}>
                {exp.role}
              </Typography>
              <Typography variant="body2" color="muted" className={styles.timelineDesc}>
                {exp.shortDescription}
              </Typography>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpanded(exp.id)}
                className={styles.expandButton}
              >
                {expandedId === exp.id ? (
                  <>
                    <ChevronUp size={16} />
                    {t.workExperience.collapseButton}
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    {t.workExperience.expandButton}
                  </>
                )}
              </Button>
            </div>
            
            <div className={`${styles.expandedContent} ${expandedId === exp.id ? styles.expanded : ''}`}>
              <Typography variant="body1" className={styles.fullDescription}>
                {exp.fullDescription}
              </Typography>
              
              <div className={styles.expandedGrid}>
                <div className={styles.technologiesSection}>
                  <Typography variant="overline" color="brand" className={styles.sectionTitle}>
                    {t.workExperience.technologiesTitle}
                  </Typography>
                  <div className={styles.technologiesList}>
                    {exp.technologies.map((tech) => (
                      <span key={tech} className={styles.technologyTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className={styles.achievementsSection}>
                  <Typography variant="overline" color="brand" className={styles.sectionTitle}>
                    {t.workExperience.achievementsTitle}
                  </Typography>
                  <ul className={styles.achievementsList}>
                    {exp.achievements.map((achievement, index) => (
                      <li key={index} className={styles.achievementItem}>
                        <Typography variant="body2">
                          {achievement}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

export default WorkExperienceTimeline
