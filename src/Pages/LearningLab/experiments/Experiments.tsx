import { useState } from 'react'
import { ArrowUpRight, RotateCcw } from 'lucide-react'
import { useI18n } from '@src/i18n'
import PixelStudio from './PixelStudio'
import MotionLab from './MotionLab'
import DesignChallenge from './DesignChallenge'
import PatternStudio from './PatternStudio'
import LayerExplorer from './LayerExplorer'
import PageBuilder from './PageBuilder'
import ExperimentTabs from './ExperimentTabs'
import { experimentCopy } from './experimentCopy'
import type { LabArtwork } from './artwork'
import styles from './experiments.module.css'
import shared from '../styles.module.css'

export default function Experiments({
  artwork,
  onUseIcon,
  onUseBackground,
  onResetArtwork,
}: {
  artwork: LabArtwork
  onUseIcon: (icon: string) => void
  onUseBackground: (background: string) => void
  onResetArtwork: () => void
}) {
  const { lang } = useI18n()
  const t = experimentCopy[lang]
  const [active, setActive] = useState(0)
  const [explored, setExplored] = useState<number[]>([])
  const [revision, setRevision] = useState(0)
  function mark(index: number) {
    setExplored((previous) =>
      previous.includes(index) ? previous : [...previous, index]
    )
  }
  const panels = [
    <PixelStudio
      key="pixels"
      onUseIcon={onUseIcon}
      onExplore={() => mark(0)}
    />,
    <MotionLab key="motion" onExplore={() => mark(1)} />,
    <DesignChallenge key="challenge" onExplore={() => mark(2)} />,
    <PatternStudio
      key="patterns"
      onApply={onUseBackground}
      onExplore={() => mark(3)}
    />,
    <LayerExplorer key="layers" artwork={artwork} onExplore={() => mark(4)} />,
    <PageBuilder key="builder" artwork={artwork} onExplore={() => mark(5)} />,
  ]
  return (
    <section
      id="experimentos"
      className={styles.experiments}
      aria-labelledby="experiments-title"
    >
      <div className={shared.container}>
        <div className={shared.sectionHeading}>
          <span className={shared.tag}>{t.tag}</span>
          <h2 id="experiments-title">{t.title}</h2>
          <p>{t.text}</p>
        </div>
        <ExperimentTabs
          active={active}
          explored={explored}
          copy={t}
          onSelect={setActive}
        />
        <div className={styles.projectTray}>
          <div>
            <span className={styles.projectLabel}>{t.project}</span>
            <div className={styles.assets}>
              <span data-ready={Boolean(artwork.icon)}>
                {artwork.icon && <img src={artwork.icon} alt="" />}
                {artwork.icon ? t.iconReady : t.iconEmpty}
              </span>
              <span data-ready={Boolean(artwork.background)}>
                {artwork.background && <img src={artwork.background} alt="" />}
                {artwork.background ? t.backgroundReady : t.backgroundEmpty}
              </span>
            </div>
          </div>
          <button type="button" onClick={() => setActive(5)}>
            {t.build}
            <ArrowUpRight size={17} aria-hidden="true" />
          </button>
        </div>
        <div className={styles.panels} key={revision}>
          {panels.map((panel, index) => (
            <div
              key={index}
              role="tabpanel"
              id={`experiment-panel-${index}`}
              aria-labelledby={`experiment-tab-${index}`}
              hidden={active !== index}
            >
              {panel}
            </div>
          ))}
        </div>
        <div className={styles.progress}>
          <p role="status">
            <strong>
              {explored.length} / {panels.length}
            </strong>{' '}
            {t.progress}
          </p>
          <button
            type="button"
            onClick={() => {
              setExplored([])
              setRevision(revision + 1)
              onResetArtwork()
            }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            {t.reset}
          </button>
        </div>
        {explored.length === panels.length && (
          <p className={styles.complete}>{t.complete}</p>
        )}
      </div>
    </section>
  )
}
