import { useState, type CSSProperties } from 'react'
import { ArrowUpRight, Check, Sparkles } from 'lucide-react'
import { interfaceVariables, type InterfaceSettings } from './interfaceModel'
import type { WorkbenchCopy } from './workbenchCopy'
import styles from './preview.module.css'

export default function InterfacePreview({
  settings,
  copy,
  customIcon,
  customBackground,
}: {
  settings: InterfaceSettings
  copy: WorkbenchCopy
  customIcon?: string | null
  customBackground?: string | null
}) {
  const [started, setStarted] = useState(false)
  return (
    <div className={styles.previewShell}>
      <div className={styles.chrome}>
        <span />
        <span />
        <span />
        <strong>{copy.live}</strong>
      </div>
      <section
        className={styles.preview}
        aria-label={copy.preview}
        style={interfaceVariables(settings) as CSSProperties}
        data-wireframe={settings.wireframe}
      >
        <div
          className={styles.visual}
          aria-hidden="true"
          style={
            customBackground
              ? {
                  backgroundImage: `url("${customBackground}")`,
                  backgroundSize: 'cover',
                }
              : undefined
          }
        >
          <div className={styles.orbit} />
          <div className={styles.orbitInner} />
          {customIcon ? (
            <img src={customIcon} alt="" className={styles.customIcon} />
          ) : (
            <Sparkles size={55} strokeWidth={1.5} />
          )}
          <span className={styles.visualLabel}>01 / 03</span>
        </div>
        <div className={styles.content}>
          <p className={styles.eyebrow}>{copy.previewTag}</p>
          <h3>{copy.previewTitle}</h3>
          <p className={styles.description}>{copy.previewText}</p>
          <ul>
            {copy.features.map((feature) => (
              <li key={feature}>
                <Check size={14} aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <button
            className={styles.action}
            type="button"
            disabled={started}
            onClick={() => setStarted(true)}
          >
            {started ? copy.done : copy.action}
            {started ? (
              <Check size={18} aria-hidden="true" />
            ) : (
              <ArrowUpRight size={18} aria-hidden="true" />
            )}
          </button>
          <div className={styles.feedback} role="status">
            {started && (
              <>
                <p>{copy.feedback}</p>
                <button type="button" onClick={() => setStarted(false)}>
                  {copy.again}
                </button>
              </>
            )}
          </div>
        </div>
      </section>
      {settings.wireframe && (
        <p className={styles.structureNote}>{copy.structureNote}</p>
      )}
    </div>
  )
}
