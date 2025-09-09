import React, { useEffect, useRef } from 'react'
import { Button } from '@components/common'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { usePomodoro } from '@src/context/PomodoroContext'
import { toast } from 'react-toastify'
import styles from './styles.module.css'

const TimerControls: React.FC = () => {
  const { state, dispatch, startTimer, pauseTimer, resetTimer, skipTimer, setFocusDuration, setBreakDuration } = usePomodoro()
  const audioRef = useRef<HTMLAudioElement>(null)
  const notificationRef = useRef<string | number | null>(null)

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    const formatTime = (seconds: number): string => {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const getModeLabel = (mode: string): string => {
      return mode === 'focus' ? 'Foco' : 'Pausa'
    }

    if (state.isRunning) {
      document.title = `[⏳ ${formatTime(state.timeLeft)}] Pomodoro - ${getModeLabel(state.mode)}`
    } else {
      document.title = `Pomodoro Timer`
    }
  }, [state.timeLeft, state.isRunning, state.mode])

  const showNotification = (message: string, type: 'info' | 'success' = 'info') => {
    if (notificationRef.current) {
      toast.update(notificationRef.current, {
        render: message,
        type: type,
        isLoading: false,
        autoClose: 2000,
      })
    } else {
      notificationRef.current = toast[type](message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          notificationRef.current = null
        }
      })
    }
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault()
          if (state.isRunning) {
            pauseTimer()
          } else if (state.timeLeft > 0) {
            startTimer()
          }
          break
        case 'r':
          event.preventDefault()
          resetTimer()
          break
        case 's':
          event.preventDefault()
          skipTimer()
          break
        case 'arrowup':
          event.preventDefault()
          const currentDuration = state.mode === 'focus' ? state.focusDuration : state.breakDuration
          const newDuration = Math.min(currentDuration + 60, state.mode === 'focus' ? 7200 : 3600)
          if (state.mode === 'focus') {
            setFocusDuration(Math.floor(newDuration / 60))
          } else {
            setBreakDuration(Math.floor(newDuration / 60))
          }
          showNotification(`Duração do ${state.mode === 'focus' ? 'foco' : 'pausa'} aumentada para ${Math.floor(newDuration / 60)}min`)
          break
        case 'arrowdown':
          event.preventDefault()
          const currentDurationDown = state.mode === 'focus' ? state.focusDuration : state.breakDuration
          const newDurationDown = Math.max(currentDurationDown - 60, 60)
          if (state.mode === 'focus') {
            setFocusDuration(Math.floor(newDurationDown / 60))
          } else {
            setBreakDuration(Math.floor(newDurationDown / 60))
          }
          showNotification(`Duração do ${state.mode === 'focus' ? 'foco' : 'pausa'} diminuída para ${Math.floor(newDurationDown / 60)}min`)
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [state.isRunning, state.timeLeft, state.mode, state.focusDuration, state.breakDuration, startTimer, pauseTimer, resetTimer, skipTimer, setFocusDuration, setBreakDuration])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (state.isRunning && state.timeLeft > 0) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK' })
      }, 1000)
    } else if (state.timeLeft === 0 && state.isRunning) {
      dispatch({ type: 'SWITCH' })
      
              if (audioRef.current) {
        audioRef.current.play().catch(console.error)
      }
      
      const message = state.mode === 'focus' 
        ? '🎯 Tempo de foco concluído! Hora da pausa.' 
        : '☕ Pausa concluída! Hora de focar novamente.'
      
      toast.success(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

              if ('Notification' in window && Notification.permission === 'granted') {
        const notificationTitle = state.mode === 'focus' ? 'Hora da Pausa!' : 'Hora de Focar!'
        const notificationBody = state.mode === 'focus' 
          ? 'Parabéns! Você completou um ciclo de foco. Agora é hora de descansar.'
          : 'Pausa concluída! Vamos voltar ao foco e continuar produtivo.'
        
        new Notification(notificationTitle, {
          body: notificationBody,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'pomodoro-notification',
          requireInteraction: false,
          silent: false
        })
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [state.isRunning, state.timeLeft, state.mode, dispatch])

  const handleStart = () => {
    if (state.timeLeft > 0) {
      startTimer()
    }
  }

  const handlePause = () => {
    pauseTimer()
  }

  const handleReset = () => {
    resetTimer()
  }

  const handleSkip = () => {
    skipTimer()
  }

  return (
    <>
      <div className={styles.timerControls}>
        <div className={styles.controlsGrid}>
          {!state.isRunning ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleStart}
              className={styles.controlButton}
              icon={<Play size={20} />}
              disabled={state.timeLeft === 0}
            >
              Iniciar
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              onClick={handlePause}
              className={styles.controlButton}
              icon={<Pause size={20} />}
            >
              Pausar
            </Button>
          )}

          <Button
            variant="outline"
            size="lg"
            onClick={handleReset}
            className={styles.controlButton}
            icon={<RotateCcw size={20} />}
          >
            Resetar
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={handleSkip}
            className={styles.controlButton}
            icon={<SkipForward size={20} />}
          >
            Pular
          </Button>
        </div>

        {/* Keyboard shortcuts help */}
        <div className={styles.keyboardShortcuts}>
          <small>
            <strong>Atalhos:</strong> Espaço (Iniciar/Pausar) • R (Resetar) • S (Pular) • ↑/↓ (Ajustar tempo)
          </small>
        </div>
      </div>

      {/* Hidden audio element for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT" type="audio/wav" />
      </audio>
    </>
  )
}

export default TimerControls
