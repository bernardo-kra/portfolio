import { useState } from 'react'
import { Download, RotateCcw } from 'lucide-react'
import { useI18n } from '@src/i18n'
import { builderCopy } from './builderCopy'
import {
  buildPage,
  defaultSections,
  moveSection,
  type PageComposition,
} from './builderModel'
import type { LabArtwork } from './artwork'
import { saveExperiment } from './downloadExperiment'
import PagePreview from './PagePreview'
import SectionOrganizer from './SectionOrganizer'
import common from './studio.module.css'
import styles from './builder.module.css'
import shared from '../styles.module.css'

export default function PageBuilder({
  artwork,
  onExplore,
}: {
  artwork: LabArtwork
  onExplore: () => void
}) {
  const { lang } = useI18n()
  const t = builderCopy[lang]
  const [fields, setFields] = useState(['', '', ''])
  const [sections, setSections] = useState(defaultSections)
  const [palette, setPalette] = useState(0)
  const [width, setWidth] = useState(480)
  const [status, setStatus] = useState<
    'exported' | 'reordered' | 'edited' | 'restored' | null
  >(null)
  const values = fields.map((value, index) => value.trim() || t.defaults[index])
  const composition: PageComposition = {
    title: values[0],
    text: values[1],
    action: values[2],
    sections,
    palette,
    artwork,
    lang,
  }
  function move(from: number, to: number) {
    setSections(moveSection(sections, from, to))
    setStatus('reordered')
  }
  function reset() {
    setFields(['', '', ''])
    setSections(defaultSections)
    setPalette(0)
    setWidth(480)
    setStatus('restored')
  }
  return (
    <div>
      <div className={styles.intro}>
        <span className={common.kicker}>{t.tag}</span>
        <h3>{t.title}</h3>
        <p>{t.text}</p>
      </div>
      <div className={styles.builderLayout}>
        <div className={common.controls}>
          <div className={styles.fields}>
            {t.fields.map((label, index) => (
              <label key={label}>
                {label}
                <input
                  type="text"
                  value={fields[index]}
                  placeholder={t.defaults[index]}
                  maxLength={index === 1 ? 240 : 80}
                  onChange={(event) => {
                    setFields(
                      fields.map((value, position) =>
                        position === index ? event.target.value : value
                      )
                    )
                    setStatus('edited')
                  }}
                />
              </label>
            ))}
          </div>
          <fieldset>
            <legend>{t.palette}</legend>
            {t.palettes.map((label, index) => (
              <button
                type="button"
                key={label}
                aria-pressed={palette === index}
                onClick={() => {
                  setPalette(index)
                  setStatus('edited')
                }}
              >
                {label}
              </button>
            ))}
          </fieldset>
          <SectionOrganizer
            sections={sections}
            copy={t}
            move={move}
            remove={(kind) => {
              setSections(sections.filter((section) => section !== kind))
              setStatus('edited')
            }}
            add={(kind) => {
              setSections([...sections, kind])
              setStatus('edited')
            }}
          />
          <label className={common.slider}>
            {t.viewport}
            <output>{width} px</output>
            <input
              type="range"
              min="280"
              max="650"
              step="10"
              value={width}
              onChange={(event) => setWidth(Number(event.target.value))}
            />
          </label>
          <button
            type="button"
            className={`${shared.button} ${shared.red}`}
            disabled={!sections.length}
            onClick={() => {
              saveExperiment(
                buildPage(composition),
                'minha-interface.html',
                'text/html'
              )
              setStatus('exported')
              onExplore()
            }}
          >
            <Download size={17} aria-hidden="true" />
            {t.export}
          </button>
          <p className={common.hint}>{t.exportHint}</p>
          <button type="button" className={common.textButton} onClick={reset}>
            <RotateCcw size={16} aria-hidden="true" />
            {t.reset}
          </button>
        </div>
        <div>
          {sections.length ? (
            <PagePreview
              composition={composition}
              width={width}
              label={t.preview}
            />
          ) : (
            <p className={styles.empty}>{t.empty}</p>
          )}
        </div>
      </div>
      <p role="status" className={common.status}>
        {status && t[status]}
      </p>
    </div>
  )
}
