import { useRef, useState, type PointerEvent, type KeyboardEvent } from 'react'
import { pixelColors, pixelLine, pixelSize } from './pixelModel'
import type { PixelCopy } from './pixelCopy'
import styles from './pixel.module.css'

export default function PixelCanvas({
  pixels,
  copy,
  paint,
  commit,
  allowDrag,
}: {
  pixels: number[]
  copy: PixelCopy
  paint: (index: number) => void
  commit: () => void
  allowDrag: boolean
}) {
  const [active, setActive] = useState(0)
  const grid = useRef<HTMLDivElement>(null)
  const cells = useRef<(HTMLButtonElement | null)[]>([])
  const drawing = useRef(false)
  const lastPoint = useRef<number | null>(null)
  function point(event: PointerEvent<HTMLDivElement>) {
    const rect = grid.current!.getBoundingClientRect()
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * pixelSize)
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * pixelSize)
    if (x < 0 || x >= pixelSize || y < 0 || y >= pixelSize) {
      lastPoint.current = null
      return
    }
    const next = y * pixelSize + x
    pixelLine(lastPoint.current ?? next, next).forEach(paint)
    lastPoint.current = next
  }
  function begin(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    drawing.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    point(event)
  }
  function finish() {
    drawing.current = false
    lastPoint.current = null
    commit()
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const delta: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: pixelSize,
      ArrowUp: -pixelSize,
    }
    if (!(event.key in delta)) return
    event.preventDefault()
    const next = (index + delta[event.key] + pixels.length) % pixels.length
    setActive(next)
    cells.current[next]?.focus()
  }
  return (
    <div
      ref={grid}
      className={styles.canvas}
      role="group"
      aria-label={copy.canvas}
      aria-describedby="pixel-keyboard-hint"
      onPointerDown={begin}
      onPointerMove={(event) => {
        if (drawing.current && allowDrag) point(event)
      }}
      onPointerUp={finish}
      onPointerCancel={finish}
      onLostPointerCapture={finish}
    >
      {pixels.map((color, index) => (
        <button
          key={index}
          type="button"
          ref={(element) => {
            cells.current[index] = element
          }}
          style={{ backgroundColor: pixelColors[color] }}
          tabIndex={index === active ? 0 : -1}
          onFocus={() => setActive(index)}
          onKeyDown={(event) => keyboard(event, index)}
          onClick={(event) => {
            if (event.detail === 0) {
              paint(index)
              commit()
            }
          }}
          aria-label={`${copy.row} ${Math.floor(index / pixelSize) + 1}, ${copy.column} ${(index % pixelSize) + 1}: ${copy.colors[color]}`}
        />
      ))}
    </div>
  )
}
