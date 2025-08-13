import { useState, useEffect } from 'react'
import { Typography, Container, Section } from '@components/common'
import StarfieldBackground from '@theme/StarfieldBackground'
import DayBackground from '@theme/DayBackground'
import ThemeToggleButton from '@theme/ThemeToggleButton'
import { useTheme } from '@theme/ThemeContext/useTheme'
import { PomodoroProvider } from '@components/context/PomodoroContext'
import {
  TimerDisplay,
  TimerControls,
  TimerSettings,
  ActiveTaskDisplay,
  LofiPlayer,
  MusicPlaylist,
  TaskList,
  TimerStats,
  CyclesHistory
} from '@components/pomodoro'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './styles.module.css'
import StarParallaxToggle from '@theme/StarParallaxToggle'
import DarkBackground from '@theme/DarkBackground'

const STORAGE_KEY = 'starfield-disable-parallax'

const PomodoroContent: React.FC = () => {
  const [disableParallax, setDisableParallax] = useState(false)
  const { theme } = useTheme()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setDisableParallax(saved === 'true')
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(disableParallax))
  }, [disableParallax])

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {theme === 'dark' ? (
        isMobile ? <DarkBackground /> : <StarfieldBackground disableParallax={disableParallax} />
      ) : (
        <DayBackground />
      )}
      
      <StarParallaxToggle
        value={disableParallax}
        onChange={setDisableParallax}
        style={{ position: 'fixed', top: 10, left: 10, zIndex: 10 }}
      />
      <ThemeToggleButton style={{ position: 'fixed', top: 10, right: 10, zIndex: 10 }} />
      
      <Container>
        <div className={styles.pomodoroPage}>
          <Section spacing="xl" className={styles.pomodoroHeader}>
            <Typography variant="h1" align="center" className={styles.pageTitle}>
              Pomodoro Timer
            </Typography>
            <Typography variant="body1" color="muted" align="center" className={styles.pageSubtitle}>
              Técnica de produtividade para gerenciar seu tempo de forma eficiente
            </Typography>
          </Section>

          <Section spacing="xl" className={styles.pomodoroMain}>
            <div className={styles.timerSection}>
              <TimerDisplay />
              <ActiveTaskDisplay />
              <TimerControls />
              <LofiPlayer />
              <MusicPlaylist />
              <TimerSettings />
            </div>
          </Section>

          <Section spacing="xl" className={styles.pomodoroHistory}>
            <TaskList />
            <TimerStats />
            <CyclesHistory />
          </Section>
        </div>
      </Container>
      
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </div>
  )
}

const Pomodoro: React.FC = () => {
  return (
    <PomodoroProvider>
      <PomodoroContent />
    </PomodoroProvider>
  )
}

export default Pomodoro