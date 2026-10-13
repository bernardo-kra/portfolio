import { useState } from 'react'
import { Download, Shuffle, ArrowUpRight } from 'lucide-react'
import { useI18n } from '@src/i18n'
import { patternCopy } from './patternCopy'
import { defaultPattern, patternDataUrl, patternSvg } from './patternModel'
import { saveExperiment } from './downloadExperiment'
import styles from './studio.module.css'
import shared from '../styles.module.css'

export default function PatternStudio({
  onApply,
  onExplore,
}: {
  onApply: (background: string) => void
  onExplore: () => void
}) {
  const { lang } = useI18n()
  const t = patternCopy[lang]
  const [settings, setSettings] = useState(defaultPattern)
  const [status, setStatus] = useState<'applied' | 'saved' | null>(null)
  return (
    <div className={styles.twoColumns}>
      <div className={styles.controls}>
        <span className={styles.kicker}>{t.tag}</span>
        <h3>{t.title}</h3>
        <p>{t.text}</p>
        <fieldset>
          <legend>{t.shape}</legend>
          {t.shapes.map((label, mode) => (
            <button
              type="button"
              key={label}
              aria-pressed={settings.mode === mode}
              onClick={() => {
                setSettings({ ...settings, mode })
                setStatus(null)
              }}
            >
              {label}
            </button>
          ))}
        </fieldset>
        <fieldset>
          <legend>{t.palette}</legend>
          {t.palettes.map((label, palette) => (
            <button
              type="button"
              key={label}
              aria-pressed={settings.palette === palette}
              onClick={() => {
                setSettings({ ...settings, palette })
                setStatus(null)
              }}
            >
              {label}
            </button>
          ))}
        </fieldset>
        <label className={styles.slider}>
          {t.density}
          <output>
            {settings.density} × {settings.density}
          </output>
          <input
            type="range"
            min="3"
            max="12"
            value={settings.density}
            onChange={(event) => {
              setSettings({ ...settings, density: Number(event.target.value) })
              setStatus(null)
            }}
          />
        </label>
        <button
          type="button"
          className={styles.textButton}
          onClick={() => {
            setSettings({ ...settings, seed: settings.seed + 1 })
            setStatus(null)
          }}
        >
          <Shuffle size={17} aria-hidden="true" />
          {t.variation}
        </button>
        <p className={styles.hint}>{t.hint}</p>
        <button
          type="button"
          className={`${shared.button} ${shared.red}`}
          onClick={() => {
            onApply(patternDataUrl(settings))
            onExplore()
            setStatus('applied')
          }}
        >
          {t.use}
          <ArrowUpRight size={17} aria-hidden="true" />
        </button>
      </div>
      <div>
        <div className={styles.artboard}>
          <img src={patternDataUrl(settings)} alt={t.preview} />
          <span>
            {t.seed} / {String(settings.seed).padStart(3, '0')}
          </span>
        </div>
        <button
          type="button"
          className={styles.textButton}
          onClick={() => {
            saveExperiment(
              patternSvg(settings),
              'meu-fundo.svg',
              'image/svg+xml'
            )
            onExplore()
            setStatus('saved')
          }}
        >
          <Download size={17} aria-hidden="true" />
          {t.save}
        </button>
        <p className={styles.status} role="status">
          {status && t[status]}
        </p>
      </div>
    </div>
  )
}
