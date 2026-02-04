import React from 'react'
import styles from '../styles.module.css'

interface HeaderBarProps {
  brandText: string
  statusLabel: string
  isPortalOpen: boolean
}

const HeaderBar: React.FC<HeaderBarProps> = ({ brandText, statusLabel, isPortalOpen }) => {
  return (
    <div className={styles.headerRow}>
      <div className={styles.brand}>
        <span className={styles.brandMark} />
        <span className={styles.brandText}>{brandText}</span>
      </div>
      <div className={styles.statusPills}>
        <span
          className={[
            styles.statusDot,
            isPortalOpen ? styles.statusDotOpen : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
        <span>{statusLabel}</span>
      </div>
    </div>
  )
}

export default HeaderBar
