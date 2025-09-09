import { useState, useEffect } from 'react'
import { Typography, Container, Section, HomeButton } from '@components/common'
import { useScrollToTop } from '@hooks/useScrollToTop'
import StarfieldBackground from '@theme/StarfieldBackground'
import DayBackground from '@theme/DayBackground'
import ThemeToggleButton from '@theme/ThemeToggleButton'
import BackgroundTransparencyToggle from '@theme/BackgroundTransparencyToggle'
import ScrollAnimation from '@theme/ScrollAnimation'
import { useTheme } from '@theme/ThemeContext/useTheme'
import { useBackgroundTransparency } from '@theme/BackgroundTransparencyContext'
import { PomodoroProvider } from '@src/context/PomodoroContext'
import {
  TimerDisplay,
  TimerControls,
  ControlsPanel,
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
  const { isTransparent, toggleTransparency } = useBackgroundTransparency()
  const [isMobile, setIsMobile] = useState(false)
  
  useScrollToTop()

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
      <HomeButton />
      
      {theme === 'dark' ? (
        isMobile ? <DarkBackground /> : <StarfieldBackground disableParallax={disableParallax} />
      ) : (
        <DayBackground />
      )}
      
      <div style={{ 
        position: 'fixed', 
        top: 10, 
        left: window.innerWidth > 768 ? 200 : 80, 
        zIndex: 10, 
        display: 'flex', 
        gap: '8px' 
      }}>
        <StarParallaxToggle
          value={disableParallax}
          onChange={setDisableParallax}
        />
        <BackgroundTransparencyToggle
          value={isTransparent}
          onChange={toggleTransparency}
        />

      </div>
      
      <ThemeToggleButton style={{ position: 'fixed', top: 10, right: 10, zIndex: 10 }} />
      
      <Container style={{ background: 'transparent', position: 'relative', zIndex: 2 }}>
        <div className={styles.pomodoroPage}>
          <ScrollAnimation animation="fade-in" delay={200}>
            <Section spacing="lg" className={styles.pomodoroHeader}>
              <Typography variant="h1" align="center" className={styles.pageTitle}>
                Pomodoro Timer
              </Typography>
              <Typography variant="body1" color="muted" align="center" className={styles.pageSubtitle}>
                Técnica de produtividade para gerenciar seu tempo de forma eficiente
              </Typography>
            </Section>
          </ScrollAnimation>

          <div className={styles.pomodoroGrid}>
            <ScrollAnimation animation="fade-in" delay={400}>
              <div className={styles.timerColumn}>
                <div className={styles.timerCard}>
                  <div className={styles.cardHeader}>
                    <Typography variant="h4" weight="semibold" className={styles.cardTitle}>
                      ⏱️ Timer Pomodoro
                    </Typography>
                  </div>
                  <TimerDisplay />
                  <TimerControls />
                </div>
              </div>
            </ScrollAnimation>

            <div className={styles.controlsCard}>
              <div className={styles.cardHeader}>
                <Typography variant="h4" weight="semibold" className={styles.cardTitle}>
                  ⚙️ Controles
                </Typography>
              </div>
              <ControlsPanel />
            </div>

            <ScrollAnimation animation="slide-left" delay={500}>
              <div className={styles.tasksColumn}>
                <div className={styles.cardHeader}>
                  <Typography variant="h4" weight="semibold" className={styles.cardTitle}>
                    📋 Tarefas
                  </Typography>
                </div>
                <TaskList />
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="slide-right" delay={600}>
              <div className={styles.statsColumn}>
                <div className={styles.cardHeader}>
                  <Typography variant="h4" weight="semibold" className={styles.cardTitle}>
                    📊 Estatísticas
                  </Typography>
                </div>
                <TimerStats />
                <CyclesHistory />
              </div>
            </ScrollAnimation>
          </div>
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