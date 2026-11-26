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

  const total =
    state.mode === 'focus' ? state.focusDuration : state.breakDuration
  const progress = total > 0 ? 1 - state.timeLeft / total : 0
  const [minutes, seconds] = formatTime(state.timeLeft).split(':')

  return (
    <div className={styles.timerDisplay} data-mode={state.mode}>
      <div className={styles.timerMode}>
        <span className={styles.modeDot} data-running={state.isRunning} />
        <Typography variant="h4" className={styles.modeLabel}>
          {getModeLabel(state.mode)}
        </Typography>
        <span className={styles.statusText}>
          {state.isRunning ? 'Em andamento' : 'Pausado'}
        </span>
      </div>

      <div className={styles.timerTime} role="timer" aria-live="off">
        <Typography variant="h1" className={styles.timeDisplay}>
          <span>{minutes}</span>
          <span className={styles.colon}>:</span>
          <span>{seconds}</span>
        </Typography>
      </div>

      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label="Progresso do bloco atual"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <span
          className={styles.progressFill}
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  )
}

export default TimerDisplay
