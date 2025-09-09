import React, { useState, useEffect } from 'react'
import { Typography, Button, Card, Checkbox } from '@components/common'
import { Music, Settings, X } from 'lucide-react'
import { usePomodoro } from '@src/context/PomodoroContext'
import styles from './styles.module.css'

const MusicSettings: React.FC = () => {
  const { state, setMusicSettings } = usePomodoro()
  const [localSettings, setLocalSettings] = useState(state.musicSettings)

  useEffect(() => {
    const savedSettings = localStorage.getItem('music-settings')
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setLocalSettings(prev => ({ ...prev, ...parsedSettings }))
      } catch (error) {
        console.error('Error loading music settings:', error)
      }
    }
  }, [])
  
  const currentTrack = state.musicSettings.tracks.find(track => track.id === state.musicSettings.currentTrackId)

  const handleSave = () => {
    setMusicSettings(localSettings)
    localStorage.setItem('music-settings', JSON.stringify(localSettings))
  }

  const handleReset = () => {
    const defaultSettings = {
      isEnabled: true,
      tracks: state.musicSettings.tracks,
      currentTrackId: state.musicSettings.currentTrackId,
      autoStopOnTimerEnd: true,
      autoPlayOnTimerStart: true,
      syncManualControls: true,
      changeMusicOnTimerEnd: false,
      backgroundMode: false,
      volume: 0.3,
      shuffleMode: false,
      repeatMode: 'none' as const
    }
    setLocalSettings(defaultSettings)
  }

  const updateLocalSetting = (key: keyof typeof localSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Card variant="outlined" className={styles.settingsCard}>
      <div className={styles.settingsHeader}>
        <div className={styles.headerTitle}>
          <Music size={16} className={styles.musicIcon} />
          <Typography variant="h6" weight="semibold">
            Configurações
          </Typography>
        </div>
      </div>

      <div className={styles.settingsContent}>
        {/* Current Track Info */}
        {currentTrack && (
          <div className={styles.currentTrackInfo}>
            <Typography variant="body2" weight="semibold">
              Música atual: {currentTrack.name}
            </Typography>
          </div>
        )}

        {/* Behavior Settings */}
        <div className={styles.settingGroup}>
          <Typography variant="body2" weight="semibold" className={styles.groupTitle}>
            Comportamento
          </Typography>
          
          <div className={styles.checkboxGroup}>
            <Checkbox
              label="Habilitar música"
              checked={localSettings.isEnabled}
              onChange={(checked) => updateLocalSetting('isEnabled', checked)}
            />
            <Checkbox
              label="Tocar ao iniciar timer"
              checked={localSettings.autoPlayOnTimerStart}
              onChange={(checked) => updateLocalSetting('autoPlayOnTimerStart', checked)}
            />
            <Checkbox
              label="Parar ao finalizar timer"
              checked={localSettings.autoStopOnTimerEnd}
              onChange={(checked) => updateLocalSetting('autoStopOnTimerEnd', checked)}
            />
            <Checkbox
              label="Sincronizar controles manuais"
              checked={localSettings.syncManualControls}
              onChange={(checked) => updateLocalSetting('syncManualControls', checked)}
            />
          </div>
        </div>
      </div>

      <div className={styles.settingsActions}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className={styles.resetButton}
        >
          Padrão
        </Button>
        
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
        >
          Salvar
        </Button>
      </div>
    </Card>
  )
}

export default MusicSettings
