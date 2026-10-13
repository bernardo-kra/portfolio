import { useState, useSyncExternalStore, type CSSProperties } from 'react'
import { Play, Download, Sparkles } from 'lucide-react'
import { useI18n } from '@src/i18n'
import { motionCopy } from './motionCopy'
import { motionCss, motionCurves, motionNames } from './motionModel'
import { saveExperiment } from './downloadExperiment'
import styles from './motion.module.css'
import shared from '../styles.module.css'

function subscribeMotion(listener: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', listener)
  return () => query.removeEventListener('change', listener)
}
const readMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function MotionLab({ onExplore }: { onExplore: () => void }) {
  const { lang } = useI18n()
  const copy = motionCopy[lang]
  const [mode, setMode] = useState(0)
  const [curve, setCurve] = useState(1)
  const [duration, setDuration] = useState(700)
  const [revision, setRevision] = useState(0)
  const [saved, setSaved] = useState(false)
  const reduced = useSyncExternalStore(subscribeMotion, readMotion, () => false)
  return (
    <div className={styles.lab}>
      <div className={styles.controls}>
        <span className={styles.kicker}>02 / MOTION LAB</span>
        <h3>{copy.title}</h3>
        <p>{copy.text}</p>
        <fieldset>
          <legend>{copy.mode}</legend>
          {copy.modes.map((name, index) => (
            <button
              type="button"
              key={name}
              aria-pressed={index === mode}
              onClick={() => {
                setMode(index)
                setRevision(0)
                setSaved(false)
              }}
            >
              {name}
            </button>
          ))}
        </fieldset>
        <fieldset>
          <legend>{copy.curve}</legend>
          {copy.curves.map((name, index) => (
            <button
              type="button"
              key={name}
              aria-pressed={index === curve}
              onClick={() => {
                setCurve(index)
                setRevision(0)
                setSaved(false)
              }}
            >
              {name}
            </button>
          ))}
        </fieldset>
        <label className={styles.slider}>
          {copy.duration}
          <output>{duration} ms</output>
          <input
            type="range"
            min="200"
            max="1800"
            step="100"
            value={duration}
            onChange={(event) => {
              setDuration(Number(event.target.value))
              setRevision(0)
              setSaved(false)
            }}
          />
        </label>
        <button
          type="button"
          className={`${shared.button} ${shared.red}`}
          onClick={() => {
            setRevision((value) => value + 1)
            setSaved(false)
            onExplore()
          }}
        >
          <Play size={18} aria-hidden="true" />
          {copy.play}
        </button>
        <p className={styles.hint}>{reduced ? copy.reduced : copy.hint}</p>
      </div>
      <div className={styles.result}>
        <div className={styles.stage} role="img" aria-label={copy.stage}>
          <div className={styles.track} aria-hidden="true" />
          <div
            key={`${mode}-${revision}`}
            className={styles.actor}
            data-mode={motionNames[mode]}
            data-playing={revision > 0}
            data-reduced={reduced && revision > 0}
            style={
              {
                '--duration': `${duration}ms`,
                '--curve': motionCurves[curve],
              } as CSSProperties
            }
            aria-hidden="true"
          >
            <Sparkles size={30} />
          </div>
          <span className={styles.stageLabel} aria-hidden="true">
            {duration} ms / {copy.curves[curve]}
          </span>
        </div>
        <p className={styles.observation}>{copy.observations[curve]}</p>
        <details className={styles.code}>
          <summary>CSS</summary>
          <pre>
            <code>{motionCss(mode, curve, duration)}</code>
          </pre>
        </details>
        <button
          type="button"
          className={styles.download}
          onClick={() => {
            saveExperiment(
              motionCss(mode, curve, duration),
              'movimento.css',
              'text/css'
            )
            setSaved(true)
          }}
        >
          <Download size={16} aria-hidden="true" />
          {copy.save}
        </button>
        <p role="status" className={styles.status}>
          {saved ? copy.saved : revision > 0 && copy.status}
        </p>
      </div>
    </div>
  )
}
