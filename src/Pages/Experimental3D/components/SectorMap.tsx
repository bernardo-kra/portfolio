import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Check, Crosshair, Layers, Radio } from 'lucide-react'
import { sectors } from '../consoleState'
import type { SectorId, ConsoleState } from '../consoleState'
import { useI18n } from '@src/i18n'
import { consoleCopy } from '../copy'
import { cinematicCopy } from '../cinematicCopy'
import styles from '../styles.module.css'

type Props = {
  selected: SectorId
  captured: SectorId[]
  operation: ConsoleState['operation']
  motion: boolean
  quality: number
  onSelect: (id: SectorId) => void
}

const ticks = Array.from({ length: 48 }, (_, i) => {
  const angle = (i * Math.PI) / 24
  const inner = i % 4 === 0 ? 177 : 184
  return {
    x1: 400 + Math.cos(angle) * inner,
    y1: 240 + Math.sin(angle) * inner,
    x2: 400 + Math.cos(angle) * 190,
    y2: 240 + Math.sin(angle) * 190,
  }
})

export default function SectorMap({
  selected,
  captured,
  operation,
  motion,
  quality,
  onSelect,
}: Props) {
  const { lang } = useI18n()
  const copy = consoleCopy[lang]
  const cinema = cinematicCopy[lang]
  const [layer, setLayer] = useState<'city' | 'signals'>('city')
  const target = sectors.find((item) => item.id === selected)!
  const complete = captured.length === sectors.length
  return (
    <div className={styles.tactical}>
      <div className={styles.mapToolbar}>
        <span>
          <span className={styles.statusDot} />
          {motion ? cinema.radar : cinema.paused}
        </span>
        <div role="group" aria-label={cinema.layer}>
          <Layers size={13} aria-hidden="true" />
          <button
            aria-pressed={layer === 'city'}
            onClick={() => setLayer('city')}
          >
            {cinema.cityView}
          </button>
          <button
            aria-pressed={layer === 'signals'}
            onClick={() => setLayer('signals')}
          >
            {cinema.signalView}
          </button>
        </div>
      </div>
      <div
        className={styles.map}
        data-layer={layer}
        data-operation={operation?.kind ?? 'idle'}
        data-complete={complete}
      >
        <div className={styles.radarDisc} aria-hidden="true">
          <div className={styles.radarBeam} />
        </div>
        <svg
          className={styles.cartography}
          viewBox="0 0 800 480"
          role="img"
          aria-label={copy.mapLabel}
        >
          <g fill="none" stroke="currentColor" className={styles.cityLayer}>
            <path
              className={styles.shore}
              d="M0 155 125 155 125 190 225 190 225 135 365 135 365 90 465 90 465 150 585 150 585 205 690 205 690 155 800 155V0H0Z"
            />
            <path
              className={styles.shore}
              d="M0 395 150 395 150 365 315 365 315 415 450 415 450 355 545 355 545 390 705 390 705 340 800 340V480H0Z"
            />
            <path
              className={styles.piers}
              d="M140 190v95h35v-95m110-55v160h38V135m160 15v75h36v-75m89 55v115h35V205M180 365v-40h85v40m305 25v-34h84v34"
            />
            <g className={styles.buildings}>
              {Array.from({ length: 18 }, (_, index) => {
                const x = 26 + (index % 9) * 88
                const y = index < 9 ? 35 + (index % 3) * 12 : 420
                return (
                  <g key={index}>
                    <rect
                      x={x}
                      y={y}
                      width={30 + (index % 3) * 8}
                      height={25 + (index % 2) * 15}
                    />
                    <path
                      d={
                        'M' +
                        x +
                        ' ' +
                        y +
                        'l12 -9h30v25M' +
                        (x + 30) +
                        ' ' +
                        y +
                        'l12 -9'
                      }
                    />
                  </g>
                )
              })}
            </g>
            <path
              d="M0 105H92V83h95v48h108V94h89V68h156v67h100V102h160M0 447h370v-13h185v23h245"
              opacity=".4"
            />
            <path
              d="M196 198v70m-7-58h55m-39-12 36 55M671 227v76m-8-65h57m-48-11 38 50"
              stroke="var(--copper)"
            />
          </g>
          <g className={styles.scope} fill="none">
            <circle cx="400" cy="240" r="205" strokeDasharray="2 7" />
            <circle cx="400" cy="240" r="194" />
            <circle cx="400" cy="240" r="146" strokeDasharray="90 10 2 10" />
            <circle cx="400" cy="240" r="92" opacity=".5" />
            <circle cx="400" cy="240" r="36" opacity=".5" />
            <path d="M183 240h434M400 23v434" opacity=".35" />
            {ticks.map((tick, index) => (
              <line key={index} {...tick} />
            ))}
          </g>
          <path
            className={styles.route}
            d="M240 312 320 290 416 163 514 245 616 254"
            fill="none"
            strokeDasharray="5 8"
          />
          {complete && (
            <path
              className={styles.extractionRoute}
              d="M616 254 526 332 380 346 240 312"
              fill="none"
            />
          )}
          <g className={styles.targetLines} fill="none">
            <path
              d={'M' + target.x * 8 + ' 0V480M0 ' + target.y * 4.8 + 'H800'}
            />
            <path
              d={'M400 240L' + target.x * 8 + ' ' + target.y * 4.8}
              strokeDasharray="3 5"
            />
          </g>
          <g className={styles.mapText} fill="currentColor">
            <text x="24" y="25">
              NEON BAY / GRID 07
            </text>
            <text x="24" y="470">
              23° 08' N / 41° 07' E — FICTION
            </text>
            <text x="655" y="470">
              SCALE 1:2500
            </text>
            <text x="565" y="366">
              {copy.water}
            </text>
          </g>
        </svg>
        <div
          className={styles.reticle}
          style={
            { '--x': target.x + '%', '--y': target.y + '%' } as CSSProperties
          }
          aria-hidden="true"
        >
          <i />
          <i />
          <i />
          <i />
          <span className={styles.lockRing} />
        </div>
        {operation && (
          <div
            key={operation.id}
            className={styles.scanSweep}
            aria-hidden="true"
          />
        )}
        {sectors.map((sector) => (
          <button
            key={sector.id}
            className={styles.mapPoint}
            style={
              { '--x': sector.x + '%', '--y': sector.y + '%' } as CSSProperties
            }
            aria-pressed={selected === sector.id}
            aria-label={
              copy.sectors[sector.id].name +
              (captured.includes(sector.id) ? ' — ' + copy.captured : '')
            }
            onClick={() => onSelect(sector.id)}
          >
            {captured.includes(sector.id) ? (
              <Check size={17} aria-hidden="true" />
            ) : (
              <Crosshair size={17} aria-hidden="true" />
            )}
            <span>{sector.code}</span>
          </button>
        ))}
        <div className={styles.mapStamp} aria-hidden="true">
          <Radio size={15} />
          <span>
            {operation ? 'ACTIVE TRACE' : 'PASSIVE LISTEN'}
            <strong>
              {target.code} / {String(quality).padStart(3, '0')}%
            </strong>
          </span>
        </div>
      </div>
      <div className={styles.trackingStrip}>
        <span>
          {cinema.tracking} <strong>{target.code}</strong>
        </span>
        <span>
          {cinema.bearing}{' '}
          <strong>
            {target.x}° / {target.y}°
          </strong>
        </span>
        <span>
          {captured.length} / 03 <strong>{cinema.recovered}</strong>
        </span>
      </div>
    </div>
  )
}
