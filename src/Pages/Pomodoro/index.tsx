import { useState, useEffect } from 'react'
import { Typography, Container, HomeButton } from '@components/common'
import StarfieldBackground from '@theme/StarfieldBackground'
import DayBackground from '@theme/DayBackground'
import ThemeToggleButton from '@theme/ThemeToggleButton'
import BackgroundTransparencyToggle from '@theme/BackgroundTransparencyToggle'
import { useTheme } from '@theme/ThemeContext/useTheme'
import { useBackgroundTransparency } from '@theme/BackgroundTransparencyContext'
import { PomodoroProvider } from '@src/context/PomodoroContext'
import {
  TimerDisplay,
  TimerControls,
  ControlsPanel,
  TaskList,
  TimerStats,
  CyclesHistory,
} from '@components/pomodoro'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './styles.module.css'
import StarParallaxToggle from '@theme/StarParallaxToggle'
import DarkBackground from '@theme/DarkBackground'
import StudyGuide from '@components/common/StudyGuide'
function renderPanelTitle(index: string, label: string) {
  return (
    <div className={styles.cardHeader}>
      <p className={styles.cardTitle}>
        <span>{index}</span>
        {label}
      </p>
    </div>
  )
}

function renderPomodoroGrid() {
  return (
    <>
      <section className={styles.timerStage} aria-label="Timer Pomodoro">
        <TimerDisplay />
        <TimerControls />
      </section>

      <div className={styles.pomodoroGrid}>
        <div className={styles.controlsCard}>
          {renderPanelTitle('01', 'Ambiente')}
          <ControlsPanel />
        </div>

        <div className={styles.tasksColumn}>
          <TaskList />
        </div>

        <div className={styles.statsColumn}>
          <TimerStats />
          <CyclesHistory />
        </div>
      </div>
    </>
  )
}

const STORAGE_KEY = 'starfield-disable-parallax'

const PomodoroContent: React.FC = () => {
  const [disableParallax, setDisableParallax] = useState(false)
  const { theme } = useTheme()
  const { isTransparent, toggleTransparency } = useBackgroundTransparency()
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
    <div
      style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}
    >
      <HomeButton />

      {theme === 'dark' ? (
        isMobile ? (
          <DarkBackground />
        ) : (
          <StarfieldBackground disableParallax={disableParallax} />
        )
      ) : (
        <DayBackground />
      )}

      <div
        style={{
          position: 'fixed',
          top: 10,
          left: isMobile ? 80 : 200,
          zIndex: 20,
          display: 'flex',
          gap: '8px',
        }}
      >
        <StarParallaxToggle
          value={disableParallax}
          onChange={setDisableParallax}
        />
        <BackgroundTransparencyToggle
          value={isTransparent}
          onChange={toggleTransparency}
        />
      </div>

      <ThemeToggleButton
        style={{ position: 'fixed', top: 10, right: 10, zIndex: 20 }}
      />

      <Container
        style={{ background: 'transparent', position: 'relative', zIndex: 2 }}
      >
        <div className={styles.pomodoroPage}>
          <header className={styles.pomodoroHeader}>
            <p className={styles.eyebrow}>Lab / Foco</p>
            <Typography variant="h1" className={styles.pageTitle}>
              Uma tarefa de cada vez.
            </Typography>
            <ol className={styles.quickStart}>
              <li>Escolha uma tarefa</li>
              <li>Inicie o timer</li>
              <li>Faça uma pausa</li>
            </ol>
          </header>
          {renderPomodoroGrid()}
          <StudyGuide study="pomodoro" />
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
