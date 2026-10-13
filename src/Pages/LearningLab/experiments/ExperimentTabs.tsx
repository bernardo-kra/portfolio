import { useRef, type KeyboardEvent } from 'react'
import {
  Grid2X2,
  MoveRight,
  ScanEye,
  Check,
  Wallpaper,
  Layers3,
  PanelsTopLeft,
} from 'lucide-react'
import type { ExperimentCopy } from './experimentCopy'
import styles from './experiments.module.css'

const icons = [Grid2X2, MoveRight, ScanEye, Wallpaper, Layers3, PanelsTopLeft]
export default function ExperimentTabs({
  active,
  explored,
  copy,
  onSelect,
}: {
  active: number
  explored: number[]
  copy: ExperimentCopy
  onSelect: (index: number) => void
}) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const count = copy.tabs.length
    const targets: Record<string, number> = {
      ArrowRight: (index + 1) % count,
      ArrowLeft: (index + count - 1) % count,
      Home: 0,
      End: count - 1,
    }
    if (!(event.key in targets)) return
    event.preventDefault()
    onSelect(targets[event.key])
    tabs.current[targets[event.key]]?.focus()
  }
  return (
    <div className={styles.tabs} role="tablist" aria-label={copy.tabsLabel}>
      {copy.tabs.map((label, index) => {
        const Icon = icons[index]
        return (
          <button
            type="button"
            role="tab"
            key={label}
            id={`experiment-tab-${index}`}
            aria-controls={`experiment-panel-${index}`}
            aria-selected={index === active}
            tabIndex={index === active ? 0 : -1}
            ref={(element) => {
              tabs.current[index] = element
            }}
            onClick={() => onSelect(index)}
            onKeyDown={(event) => navigate(event, index)}
          >
            <span className={styles.tabNumber} aria-hidden="true">
              0{index + 1}
            </span>
            <Icon size={22} aria-hidden="true" />
            <span className={styles.tabText}>
              <strong>{label}</strong>
              <small>{copy.descriptions[index]}</small>
            </span>
            {explored.includes(index) && (
              <Check size={17} aria-label={copy.done} />
            )}
          </button>
        )
      })}
    </div>
  )
}
