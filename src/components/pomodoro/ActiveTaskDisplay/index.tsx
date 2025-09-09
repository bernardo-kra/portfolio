import React from 'react'
import { Typography, Tag } from '@components/common'
import { Target, Clock } from 'lucide-react'
import { usePomodoro } from '@src/context/PomodoroContext'
import styles from './styles.module.css'

const ActiveTaskDisplay: React.FC = () => {
  const { state } = usePomodoro()
  const { activeTaskId, activeTaskName, isRunning, mode } = state

  if (!activeTaskId || !activeTaskName) {
    return (
      <div className={styles.activeTaskContainer}>
        <div className={styles.noTaskState}>
          <Target size={20} className={styles.noTaskIcon} />
          <Typography variant="body2" color="muted" align="center">
            Nenhuma tarefa selecionada
          </Typography>
          <Typography variant="caption" color="muted" align="center">
            Selecione uma tarefa para começar a trabalhar
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.activeTaskContainer}>
      <div className={styles.taskHeader}>
        <Target size={16} className={styles.taskIcon} />
        <Typography variant="body2" weight="semibold" color="brand">
          Tarefa Ativa
        </Typography>
      </div>
      
      <div className={styles.taskContent}>
        <Typography variant="h6" className={styles.taskName}>
          {activeTaskName}
        </Typography>
        
        <div className={styles.taskStatus}>
          <div className={styles.statusIndicator}>
            <Clock size={14} className={styles.statusIcon} />
            <Typography variant="caption" color="muted">
              {isRunning ? 'Trabalhando...' : 'Pausado'}
            </Typography>
          </div>
          
          <Tag 
            variant={mode === 'focus' ? 'brand' : 'success'} 
            size="sm"
            className={styles.modeTag}
          >
            {mode === 'focus' ? 'Foco' : 'Pausa'}
          </Tag>
        </div>
      </div>
    </div>
  )
}

export default ActiveTaskDisplay
