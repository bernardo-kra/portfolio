import React from 'react'
import { Typography, Card } from '@components/common'
import { Clock, Target, Coffee } from 'lucide-react'
import { usePomodoro } from '@components/context/PomodoroContext'
import styles from './styles.module.css'

const CyclesHistory: React.FC = () => {
  const { state } = usePomodoro()

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min`
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(date)
  }

  const getModeIcon = (mode: string) => {
    return mode === 'focus' ? <Target size={16} /> : <Coffee size={16} />
  }

  const getModeLabel = (mode: string): string => {
    return mode === 'focus' ? 'Foco' : 'Pausa'
  }

  const getModeColor = (mode: string): string => {
    return mode === 'focus' ? 'var(--brand-orange)' : 'var(--success)'
  }

  if (state.cycles.length === 0) {
    return (
      <div className={styles.cyclesHistory}>
        <Typography variant="h3" className={styles.historyTitle}>
          Histórico de Ciclos
        </Typography>
        <div className={styles.emptyState}>
          <Clock size={48} className={styles.emptyIcon} />
          <Typography variant="body1" color="muted" className={styles.emptyText}>
            Nenhum ciclo concluído ainda
          </Typography>
          <Typography variant="body2" color="muted" className={styles.emptySubtext}>
            Complete seu primeiro ciclo de foco para ver o histórico aqui
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.cyclesHistory}>
      <Typography variant="h3" className={styles.historyTitle}>
        Histórico de Ciclos
      </Typography>
      
      <div className={styles.cyclesList}>
        {state.cycles.slice(0, 10).map((cycle) => (
          <Card
            key={cycle.id}
            variant="default"
            className={styles.cycleCard}
            style={{ 
              borderLeft: `4px solid ${getModeColor(cycle.mode)}` 
            }}
          >
            <div className={styles.cycleHeader}>
              <div className={styles.cycleIcon}>
                {getModeIcon(cycle.mode)}
              </div>
              <div className={styles.cycleInfo}>
                <Typography variant="h5" weight="semibold" className={styles.cycleMode}>
                  {getModeLabel(cycle.mode)} Concluído
                </Typography>
                <Typography variant="body2" color="muted" className={styles.cycleTime}>
                  {formatDate(cycle.completedAt)}
                </Typography>
                {cycle.taskName && (
                  <Typography variant="caption" color="brand" className={styles.taskInfo}>
                    📋 {cycle.taskName}
                  </Typography>
                )}
              </div>
              <div className={styles.cycleDuration}>
                <Typography variant="caption" color="brand" weight="semibold">
                  {formatDuration(cycle.duration)}
                </Typography>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {state.cycles.length > 10 && (
        <div className={styles.moreCycles}>
          <Typography variant="body2" color="muted" className={styles.moreText}>
            +{state.cycles.length - 10} ciclos anteriores
          </Typography>
        </div>
      )}
    </div>
  )
}

export default CyclesHistory
