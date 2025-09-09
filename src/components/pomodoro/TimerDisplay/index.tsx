import React from 'react'
import { Typography } from '@components/common'
import { usePomodoro } from '@src/context/PomodoroContext'
import styles from './styles.module.css'

const TimerDisplay: React.FC = () => {
  const { state } = usePomodoro()
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getModeLabel = (mode: string): string => {
    return mode === 'focus' ? 'Foco' : 'Pausa'
  }

  return (
    <div className={styles.timerDisplay}>
      <div className={styles.timerMode}>
        <Typography variant="h4" color="brand" className={styles.modeLabel}>
          {getModeLabel(state.mode)}
        </Typography>
      </div>
      
      <div className={styles.timerTime}>
        <Typography variant="h1" className={styles.timeDisplay}>
          {formatTime(state.timeLeft)}
        </Typography>
      </div>
      
      <div className={styles.timerStatus}>
        <Typography variant="body2" color="muted" className={styles.statusText}>
          {state.isRunning ? 'Executando...' : 'Pausado'}
        </Typography>
      </div>
    </div>
  )
}

export default TimerDisplay
