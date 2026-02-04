import React from 'react'
import styles from '../styles.module.css'

interface RibbonProps {
  items: string[]
}

const Ribbon: React.FC<RibbonProps> = ({ items }) => {
  return (
    <div className={styles.ribbon}>
      <div className={styles.ribbonTrack}>
        <div className={styles.ribbonRun}>
          {items.map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
        <div className={styles.ribbonRun} aria-hidden="true">
          {items.map((item, index) => (
            <span key={`dup-${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Ribbon
