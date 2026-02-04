import React from 'react'
import { Typography, Container } from '@components/common'
import styles from '../styles.module.css'

interface HeroSectionProps {
  title: string
  copy: string
  tags: string[]
  isPortalOpen: boolean
  mode: 'live' | 'inspect'
  power: number
  signal: 'green' | 'yellow' | 'red'
  onTogglePortal: () => void
  onToggleMode: () => void
  onPowerChange: (value: number) => void
  onSignalChange: (value: 'green' | 'yellow' | 'red') => void
  labels: {
    openPortal: string
    closePortal: string
    modeInspect: string
    modeLive: string
    panelTitle: string
    panelLive: string
    panelInspect: string
    statEnergy: string
    statDoor: string
    statDoorOpen: string
    statDoorLocked: string
    statSignals: string
    statSignalOk: string
    statSignalAlert: string
    statSignalRisk: string
    statControl: string
    statControlManual: string
    statControlAudit: string
    controlEnergy: string
    controlSignal: string
  }
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  copy,
  tags,
  isPortalOpen,
  mode,
  power,
  signal,
  onTogglePortal,
  onToggleMode,
  onPowerChange,
  onSignalChange,
  labels,
}) => {
  return (
    <Container className={styles.hero}>
      <div className={styles.heroLeft}>
        <Typography variant="h1" className={styles.heroTitle}>
          {title}
        </Typography>
        <Typography variant="body1" className={styles.heroCopy}>
          {copy}
        </Typography>
        <div className={styles.heroActions}>
          <button className={styles.primaryCta} onClick={onTogglePortal}>
            {isPortalOpen ? labels.closePortal : labels.openPortal}
          </button>
          <button className={styles.secondaryCta} onClick={onToggleMode}>
            {mode === 'live' ? labels.modeInspect : labels.modeLive}
          </button>
        </div>
        <div className={styles.tagRow}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.heroRight}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>{labels.panelTitle}</span>
          <span className={styles.panelStatus}>
            {mode === 'live' ? labels.panelLive : labels.panelInspect}
          </span>
        </div>
        <div className={styles.statGrid}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{labels.statEnergy}</span>
            <span className={styles.statValue}>{power}%</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{labels.statDoor}</span>
            <span className={styles.statValue}>
              {isPortalOpen ? labels.statDoorOpen : labels.statDoorLocked}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{labels.statSignals}</span>
            <span className={styles.statValue}>
              {signal === 'green'
                ? labels.statSignalOk
                : signal === 'yellow'
                ? labels.statSignalAlert
                : labels.statSignalRisk}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{labels.statControl}</span>
            <span className={styles.statValue}>
              {mode === 'live' ? labels.statControlManual : labels.statControlAudit}
            </span>
          </div>
        </div>
        <div className={styles.laneGrid}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className={styles.controlPanel}>
          <div className={styles.controlRow}>
            <span className={styles.controlLabel}>{labels.controlEnergy}</span>
            <input
              className={styles.powerSlider}
              type="range"
              min={20}
              max={100}
              value={power}
              onChange={(event) => onPowerChange(Number(event.target.value))}
            />
          </div>
          <div className={styles.controlRow}>
            <span className={styles.controlLabel}>{labels.controlSignal}</span>
            <div className={styles.signalButtons}>
              <button
                className={[
                  styles.signalButton,
                  styles.signalGreen,
                  signal === 'green' ? styles.signalActive : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onSignalChange('green')}
              />
              <button
                className={[
                  styles.signalButton,
                  styles.signalYellow,
                  signal === 'yellow' ? styles.signalActive : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onSignalChange('yellow')}
              />
              <button
                className={[
                  styles.signalButton,
                  styles.signalRed,
                  signal === 'red' ? styles.signalActive : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onSignalChange('red')}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default HeroSection
