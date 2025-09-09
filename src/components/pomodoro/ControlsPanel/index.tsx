import React, { useState } from 'react'
import { Typography, Button, Card } from '@components/common'
import { Settings, Music, Volume2, Target } from 'lucide-react'
import TimerSettings from '../TimerSettings'
import LofiPlayer from '../LofiPlayer'
import MusicPlaylist from '../MusicPlaylist'
import ActiveTaskDisplay from '../ActiveTaskDisplay'
import styles from './styles.module.css'

const ControlsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'music' | 'settings' | 'task'>('music')

  return (
    <div className={styles.controlsPanel}>
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'music' ? styles.active : ''}`}
          onClick={() => setActiveTab('music')}
        >
          <Music size={16} />
          Música
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={16} />
          Configurações
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'task' ? styles.active : ''}`}
          onClick={() => setActiveTab('task')}
        >
          <Target size={16} />
          Tarefa Ativa
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'music' && (
          <div className={styles.musicSection}>
            <Typography variant="h5" weight="semibold" className={styles.sectionTitle}>
              Player de Música
            </Typography>
            <LofiPlayer />
            <MusicPlaylist />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={styles.settingsSection}>
            <Typography variant="h5" weight="semibold" className={styles.sectionTitle}>
              Configurações do Timer
            </Typography>
            <TimerSettings />
          </div>
        )}

        {activeTab === 'task' && (
          <div className={styles.taskSection}>
            <Typography variant="h5" weight="semibold" className={styles.sectionTitle}>
              Tarefa Ativa
            </Typography>
            <ActiveTaskDisplay />
          </div>
        )}
      </div>
    </div>
  )
}

export default ControlsPanel
