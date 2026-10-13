import { useReducer, useState } from 'react'
import { ArrowUpRight, Download, Undo2, Redo2 } from 'lucide-react'
import { useI18n } from '@src/i18n'
import { pixelCopy, type PixelCopy } from './pixelCopy'
import {
  downloadPixelArt,
  pixelColors,
  pixelPreset,
  pixelReducer,
  pixelSize,
  pixelSvg,
  type PixelTool,
} from './pixelModel'
import PixelCanvas from './PixelCanvas'
import styles from './pixel.module.css'
import shared from '../styles.module.css'

const tools: PixelTool[] = ['pen', 'erase', 'fill']
function PixelPalette({
  color,
  copy,
  onChange,
}: {
  color: number
  copy: PixelCopy
  onChange: (color: number) => void
}) {
  return (
    <div className={styles.palette} role="group" aria-label={copy.palette}>
      {pixelColors.map((value, index) => (
        <button
          key={value}
          type="button"
          style={{ backgroundColor: value }}
          aria-label={copy.colors[index]}
          aria-pressed={color === index}
          onClick={() => onChange(index)}
        />
      ))}
    </div>
  )
}

export default function PixelStudio({
  onUseIcon,
  onExplore,
}: {
  onUseIcon: (icon: string) => void
  onExplore: () => void
}) {
  const { lang } = useI18n()
  const copy = pixelCopy[lang]
  const [state, dispatch] = useReducer(pixelReducer, {
    pixels: pixelPreset(0),
    past: [],
    future: [],
    stroke: null,
  })
  const [color, setColor] = useState(2)
  const [tool, setTool] = useState<PixelTool>('pen')
  const [mirror, setMirror] = useState(false)
  const [message, setMessage] = useState<'saved' | 'applied' | null>(null)
  function paint(index: number) {
    dispatch({ type: 'paint', index, color, tool, mirror })
    setMessage(null)
  }
  function apply() {
    onUseIcon(
      `data:image/svg+xml,${encodeURIComponent(pixelSvg(state.pixels))}`
    )
    setMessage('applied')
    onExplore()
    document
      .getElementById('oficina')
      ?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }
  return (
    <div className={styles.studio}>
      <div className={styles.instructions}>
        <span className={styles.kicker}>01 / PIXEL STUDIO</span>
        <h3>{copy.title}</h3>
        <p>{copy.text}</p>
        <fieldset className={styles.tools}>
          <legend>{copy.toolLabel}</legend>
          {tools.map((value, index) => (
            <button
              type="button"
              key={value}
              aria-pressed={tool === value}
              onClick={() => setTool(value)}
            >
              {copy.tools[index]}
            </button>
          ))}
        </fieldset>
        <PixelPalette color={color} copy={copy} onChange={setColor} />
        <label className={styles.symmetry}>
          <input
            type="checkbox"
            checked={mirror}
            onChange={(event) => setMirror(event.target.checked)}
          />
          {copy.symmetry}
        </label>
        <fieldset className={styles.presets}>
          <legend>{copy.presetLabel}</legend>
          {copy.presets.map((label, index) => (
            <button
              type="button"
              key={label}
              onClick={() => {
                dispatch({ type: 'replace', pixels: pixelPreset(index) })
                setMessage(null)
              }}
            >
              {label}
            </button>
          ))}
        </fieldset>
        <p className={styles.hint} id="pixel-keyboard-hint">
          {copy.hint}
        </p>
        <button
          type="button"
          className={`${shared.button} ${shared.red}`}
          onClick={apply}
        >
          {copy.use}
          <ArrowUpRight size={18} aria-hidden="true" />
        </button>
      </div>
      <div className={styles.editor}>
        <div className={styles.editorBar}>
          <span>12 × 12 / ICON BUILDER</span>
          <span aria-hidden="true">● ● ●</span>
        </div>
        <PixelCanvas
          pixels={state.pixels}
          copy={copy}
          paint={paint}
          allowDrag={tool !== 'fill'}
          commit={() => dispatch({ type: 'commit' })}
        />
        <div className={styles.actions}>
          <button
            type="button"
            disabled={!state.past.length}
            onClick={() => dispatch({ type: 'undo' })}
          >
            <Undo2 size={16} aria-hidden="true" />
            {copy.undo}
          </button>
          <button
            type="button"
            disabled={!state.future.length}
            onClick={() => dispatch({ type: 'redo' })}
          >
            <Redo2 size={16} aria-hidden="true" />
            {copy.redo}
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch({
                type: 'replace',
                pixels: Array<number>(pixelSize ** 2).fill(0),
              })
              setMessage(null)
            }}
          >
            {copy.clear}
          </button>
          <button
            type="button"
            onClick={() => {
              downloadPixelArt(state.pixels)
              setMessage('saved')
              onExplore()
            }}
          >
            <Download size={16} aria-hidden="true" />
            {copy.save}
          </button>
        </div>
        <p className={styles.status} role="status">
          {message
            ? copy[message]
            : `${state.pixels.filter(Boolean).length} / ${pixelSize ** 2} ${copy.painted}`}
        </p>
      </div>
    </div>
  )
}
