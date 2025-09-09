import React, { useState, useEffect, useRef } from 'react'
import { Typography, Button, Input, Card } from '@components/common'
import { Settings, Target, Coffee, X } from 'lucide-react'
import { usePomodoro } from '@src/context/PomodoroContext'
import styles from './styles.module.css'

const TimerSettings: React.FC = () => {
  const { state, setFocusDuration, setBreakDuration } = usePomodoro()
  const [isOpen, setIsOpen] = useState(false)
  const [focusMinutes, setFocusMinutes] = useState(Math.floor(state.focusDuration / 60))
  const [breakMinutes, setBreakMinutes] = useState(Math.floor(state.breakDuration / 60))
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setFocusMinutes(Math.floor(state.focusDuration / 60))
    setBreakMinutes(Math.floor(state.breakDuration / 60))
  }, [state.focusDuration, state.breakDuration])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleSave = () => {
    setFocusDuration(focusMinutes)
    setBreakDuration(breakMinutes)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setFocusMinutes(Math.floor(state.focusDuration / 60))
    setBreakMinutes(Math.floor(state.breakDuration / 60))
    setIsOpen(false)
  }

  const handleReset = () => {
    setFocusMinutes(25)
    setBreakMinutes(5)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={styles.settingsButton}
        icon={<Settings size={16} />}
      >
        Configurações
      </Button>

      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer} ref={modalRef}>
            <Card variant="elevated" className={styles.settingsCard}>
              <div className={styles.modalHeader}>
                <Typography variant="h4" className={styles.settingsTitle}>
                  Configurações do Timer
                </Typography>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className={styles.closeButton}
                  icon={<X size={20} />}
                  children={null}
                />
              </div>
              
              <div className={styles.settingsGrid}>
                <div className={styles.settingItem}>
                  <div className={styles.settingHeader}>
                    <Target size={20} className={styles.settingIcon} />
                    <Typography variant="h5" weight="semibold">
                      Duração do Foco
                    </Typography>
                  </div>
                  <Input
                    label="Minutos"
                    type="number"
                    min="1"
                    max="120"
                    value={focusMinutes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFocusMinutes(Number(e.target.value))}
                    className={styles.settingInput}
                  />
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingHeader}>
                    <Coffee size={20} className={styles.settingIcon} />
                    <Typography variant="h5" weight="semibold">
                      Duração da Pausa
                    </Typography>
                  </div>
                  <Input
                    label="Minutos"
                    type="number"
                    min="1"
                    max="60"
                    value={breakMinutes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBreakMinutes(Number(e.target.value))}
                    className={styles.settingInput}
                  />
                </div>
              </div>

              <div className={styles.settingsActions}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className={styles.resetButton}
                >
                  Padrão (25/5)
                </Button>
                
                <div className={styles.actionButtons}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}

export default TimerSettings
