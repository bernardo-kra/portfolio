import React from 'react'
import { Typography, Card } from '@components/common'
import { Clock, Target, Coffee, TrendingUp } from 'lucide-react'
import { usePomodoro } from '@components/context/PomodoroContext'
import styles from './styles.module.css'

const TimerStats: React.FC = () => {
  const { state } = usePomodoro()

  const stats = React.useMemo(() => {
    const focusCycles = state.cycles.filter(cycle => cycle.mode === 'focus')
    const breakCycles = state.cycles.filter(cycle => cycle.mode === 'break')
    
    const totalFocusTime = focusCycles.reduce((total, cycle) => total + cycle.duration, 0)
    const totalBreakTime = breakCycles.reduce((total, cycle) => total + cycle.duration, 0)
    const totalTime = totalFocusTime + totalBreakTime
    
    const today = new Date()
    const todayCycles = state.cycles.filter(cycle => {
      const cycleDate = new Date(cycle.completedAt)
      return cycleDate.toDateString() === today.toDateString()
    })
    
    return {
      totalCycles: state.cycles.length,
      focusCycles: focusCycles.length,
      breakCycles: breakCycles.length,
      totalFocusTime: Math.floor(totalFocusTime / 60),
      totalBreakTime: Math.floor(totalBreakTime / 60),
      totalTime: Math.floor(totalTime / 60),
      todayCycles: todayCycles.length
    }
  }, [state.cycles])

  if (state.cycles.length === 0) {
    return null
  }

  return (
    <div className={styles.timerStats}>
      <Typography variant="h3" className={styles.statsTitle}>
        Estatísticas
      </Typography>
      
      <div className={styles.statsGrid}>
        <Card variant="default" className={styles.statCard}>
          <div className={styles.statIcon}>
            <Target size={24} />
          </div>
          <div className={styles.statContent}>
            <Typography variant="h4" weight="bold" className={styles.statValue}>
              {stats.focusCycles}
            </Typography>
            <Typography variant="body2" color="muted" className={styles.statLabel}>
              Ciclos de Foco
            </Typography>
          </div>
        </Card>

        <Card variant="default" className={styles.statCard}>
          <div className={styles.statIcon}>
            <Coffee size={24} />
          </div>
          <div className={styles.statContent}>
            <Typography variant="h4" weight="bold" className={styles.statValue}>
              {stats.breakCycles}
            </Typography>
            <Typography variant="body2" color="muted" className={styles.statLabel}>
              Ciclos de Pausa
            </Typography>
          </div>
        </Card>

        <Card variant="default" className={styles.statCard}>
          <div className={styles.statIcon}>
            <Clock size={24} />
          </div>
          <div className={styles.statContent}>
            <Typography variant="h4" weight="bold" className={styles.statValue}>
              {stats.totalFocusTime}min
            </Typography>
            <Typography variant="body2" color="muted" className={styles.statLabel}>
              Tempo Total de Foco
            </Typography>
          </div>
        </Card>

        <Card variant="default" className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statContent}>
            <Typography variant="h4" weight="bold" className={styles.statValue}>
              {stats.todayCycles}
            </Typography>
            <Typography variant="body2" color="muted" className={styles.statLabel}>
              Ciclos Hoje
            </Typography>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TimerStats
