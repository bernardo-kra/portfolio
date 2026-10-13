import { useState } from 'react'
import { Download, RotateCcw } from 'lucide-react'
import { useI18n } from '@src/i18n'
import { workbenchCopy } from './workbenchCopy'
import {
  contrastRatio,
  defaultSettings,
  downloadInterfaceCss,
  interfaceCss,
  palettes,
  type InterfaceSettings,
} from './interfaceModel'
import InterfacePreview from './InterfacePreview'
import styles from './workbench.module.css'
import shared from './styles.module.css'

function ChoiceGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: number
  onChange: (value: number) => void
}) {
  return (
    <fieldset className={styles.choiceGroup}>
      <legend>{label}</legend>
      <div>
        {options.map((option, index) => (
          <button
            type="button"
            key={option}
            aria-pressed={index === value}
            onClick={() => onChange(index)}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export default function InterfaceWorkbench({
  customIcon = null,
  customBackground = null,
  onClearArtwork,
}: {
  customIcon?: string | null
  customBackground?: string | null
  onClearArtwork?: () => void
}) {
  const { lang } = useI18n()
  const copy = workbenchCopy[lang]
  const [settings, setSettings] = useState(defaultSettings)
  const [message, setMessage] = useState<
    'changed' | 'resetStatus' | 'downloaded' | null
  >(null)
  const [revision, setRevision] = useState(0)
  const palette = palettes[settings.palette]
  const contrast = settings.wireframe
    ? contrastRatio('#ffffff', palette.ink)
    : contrastRatio(palette.accent, palette.label)
  function choose<K extends keyof InterfaceSettings>(
    key: K,
    value: InterfaceSettings[K]
  ) {
    setSettings((previous) => ({ ...previous, [key]: value }))
    setMessage('changed')
  }
  function reset() {
    setSettings(defaultSettings)
    onClearArtwork?.()
    setRevision((previous) => previous + 1)
    setMessage('resetStatus')
  }
  return (
    <section
      id="oficina"
      className={styles.workbench}
      aria-labelledby="workbench-title"
    >
      <div className={shared.container}>
        <div className={shared.sectionHeading}>
          <span className={`${shared.tag} ${shared.white}`}>{copy.tag}</span>
          <h2 id="workbench-title">{copy.title}</h2>
          <p>{copy.text}</p>
        </div>
        <div className={styles.layout}>
          <div className={styles.controls}>
            <ChoiceGroup
              label={copy.palette}
              options={copy.palettes}
              value={settings.palette}
              onChange={(value) => choose('palette', value)}
            />
            <ChoiceGroup
              label={copy.typography}
              options={copy.fonts}
              value={settings.font}
              onChange={(value) => choose('font', value)}
            />
            <ChoiceGroup
              label={copy.shape}
              options={copy.shapes}
              value={settings.shape}
              onChange={(value) => choose('shape', value)}
            />
            <ChoiceGroup
              label={copy.density}
              options={copy.densities}
              value={settings.density}
              onChange={(value) => choose('density', value)}
            />
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.wireframe}
                onChange={(event) => choose('wireframe', event.target.checked)}
              />
              {copy.wireframe}
            </label>
            <div className={styles.contrast}>
              <div>
                <span>{copy.contrast}</span>
                <strong>{contrast.toFixed(2)}:1</strong>
              </div>
              <p data-pass={contrast >= 4.5}>
                {contrast >= 4.5 ? copy.good : copy.limited}
              </p>
              <small>{copy.contrastNote}</small>
              <a
                href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                WCAG 2.2 ↗
              </a>
            </div>
            <div className={styles.actions}>
              <button type="button" onClick={reset}>
                <RotateCcw size={16} aria-hidden="true" />
                {copy.reset}
              </button>
              <button
                type="button"
                onClick={() => {
                  downloadInterfaceCss(settings)
                  setMessage('downloaded')
                }}
              >
                <Download size={16} aria-hidden="true" />
                {copy.export}
              </button>
            </div>
          </div>
          <div className={styles.result}>
            <InterfacePreview
              key={revision}
              settings={settings}
              copy={copy}
              customIcon={customIcon}
              customBackground={customBackground}
            />
            <details className={styles.tokens} open>
              <summary>{copy.tokens}</summary>
              <pre>
                <code>{interfaceCss(settings)}</code>
              </pre>
            </details>
          </div>
        </div>
        <p className={styles.status} role="status">
          {message ? copy[message] : '\u00a0'}
        </p>
      </div>
    </section>
  )
}
