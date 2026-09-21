import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { Typography } from '@components/common'
import { Settings, Music, Target } from 'lucide-react'
import TimerSettings from '../TimerSettings'
import LofiPlayer from '../LofiPlayer'
import MusicPlaylist from '../MusicPlaylist'
import ActiveTaskDisplay from '../ActiveTaskDisplay'
import styles from './styles.module.css'

const tabs = [
  { id: 'music', label: 'Música', Icon: Music },
  { id: 'settings', label: 'Configurações', Icon: Settings },
  { id: 'task', label: 'Tarefa ativa', Icon: Target },
] as const

const ControlsPanel = () => {
  const [activeTab, setActiveTab] = useState<'music' | 'settings' | 'task'>(
    'music'
  )
  const prefix = useId()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((tab) => tab.id === activeTab)
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % tabs.length
        : event.key === 'ArrowLeft'
          ? (index + tabs.length - 1) % tabs.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? tabs.length - 1
              : -1
    if (next < 0) return
    event.preventDefault()
    setActiveTab(tabs[next].id)
    buttons.current[next]?.focus()
  }

  return (
    <div className={styles.controlsPanel}>
      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Controles do Pomodoro"
        onKeyDown={onKeyDown}
      >
        {tabs.map(({ id, label, Icon }, index) => (
          <button
            key={id}
            ref={(element) => {
              buttons.current[index] = element
            }}
            id={prefix + '-tab-' + id}
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={prefix + '-panel-' + id}
            tabIndex={activeTab === id ? 0 : -1}
            className={
              styles.tab + (activeTab === id ? ' ' + styles.active : '')
            }
            onClick={() => setActiveTab(id)}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
      {tabs.map(({ id }) => (
        <div
          key={id}
          id={prefix + '-panel-' + id}
          role="tabpanel"
          aria-labelledby={prefix + '-tab-' + id}
          hidden={activeTab !== id}
          tabIndex={0}
          className={styles.tabContent}
        >
          {activeTab === id && id === 'music' && (
            <div className={styles.musicSection}>
              <Typography
                variant="h5"
                weight="semibold"
                className={styles.sectionTitle}
              >
                Player de música
              </Typography>
              <LofiPlayer />
              <MusicPlaylist />
            </div>
          )}
          {activeTab === id && id === 'settings' && (
            <div className={styles.settingsSection}>
              <Typography
                variant="h5"
                weight="semibold"
                className={styles.sectionTitle}
              >
                Configurações do timer
              </Typography>
              <TimerSettings />
            </div>
          )}
          {activeTab === id && id === 'task' && (
            <div className={styles.taskSection}>
              <Typography
                variant="h5"
                weight="semibold"
                className={styles.sectionTitle}
              >
                Tarefa ativa
              </Typography>
              <ActiveTaskDisplay />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
export default ControlsPanel
