import { useState, type CSSProperties } from 'react'
import { Sparkles } from 'lucide-react'
import { useI18n } from '@src/i18n'
import type { LabArtwork } from './artwork'
import { layersCopy } from './layersCopy'
import styles from './layers.module.css'
import common from './studio.module.css'

export default function LayerExplorer({
  artwork,
  onExplore,
}: {
  artwork: LabArtwork
  onExplore: () => void
}) {
  const { lang } = useI18n()
  const t = layersCopy[lang]
  const [exploded, setExploded] = useState(false)
  const [depth, setDepth] = useState(38)
  const [tilt, setTilt] = useState(48)
  const [selected, setSelected] = useState(0)
  return (
    <div className={common.twoColumns}>
      <div className={common.controls}>
        <span className={common.kicker}>{t.tag}</span>
        <h3>{t.title}</h3>
        <p>{t.text}</p>
        <fieldset>
          <legend>{t.select}</legend>
          {t.layers.map((label, index) => (
            <button
              type="button"
              key={label}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              {String(index + 1).padStart(2, '0')} / {label}
            </button>
          ))}
        </fieldset>
        <div className={styles.mode}>
          <button
            type="button"
            aria-pressed={!exploded}
            onClick={() => setExploded(false)}
          >
            {t.flat}
          </button>
          <button
            type="button"
            aria-pressed={exploded}
            onClick={() => {
              setExploded(true)
              onExplore()
            }}
          >
            {t.exploded}
          </button>
        </div>
        <label className={common.slider}>
          {t.depth}
          <output>{depth} px</output>
          <input
            type="range"
            min="15"
            max="65"
            value={depth}
            disabled={!exploded}
            onChange={(event) => setDepth(Number(event.target.value))}
          />
        </label>
        <label className={common.slider}>
          {t.tilt}
          <output>{tilt}°</output>
          <input
            type="range"
            min="20"
            max="65"
            value={tilt}
            disabled={!exploded}
            onChange={(event) => setTilt(Number(event.target.value))}
          />
        </label>
        <p className={common.hint}>{t.hint}</p>
      </div>
      <div>
        <div className={styles.viewport} role="img" aria-label={t.diagram}>
          <div
            className={styles.scene}
            data-exploded={exploded}
            style={
              {
                '--depth': `${exploded ? depth : 0}px`,
                '--tilt': `${tilt}deg`,
              } as CSSProperties
            }
            aria-hidden="true"
          >
            <div
              className={styles.layer}
              data-layer="0"
              data-selected={selected === 0}
              style={
                artwork.background
                  ? {
                      backgroundImage: `url("${artwork.background}")`,
                      backgroundSize: 'cover',
                    }
                  : undefined
              }
            />
            <div
              className={styles.layer}
              data-layer="1"
              data-selected={selected === 1}
            >
              <div className={styles.grid} />
            </div>
            <div
              className={styles.layer}
              data-layer="2"
              data-selected={selected === 2}
            >
              <div className={styles.content}>
                {artwork.icon ? (
                  <img src={artwork.icon} alt="" />
                ) : (
                  <Sparkles size={36} />
                )}
                <strong>{t.label}</strong>
                <i />
                <i />
              </div>
            </div>
            <div
              className={styles.layer}
              data-layer="3"
              data-selected={selected === 3}
            >
              <span className={styles.mockButton}>{t.action} ↗</span>
            </div>
          </div>
        </div>
        <div className={styles.description} role="status">
          <span>
            {t.inspected} / 0{selected + 1}
          </span>
          <h4>{t.layers[selected]}</h4>
          <p>{t.descriptions[selected]}</p>
        </div>
      </div>
    </div>
  )
}
