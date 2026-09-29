import { useId } from 'react'
import styles from '../mission.module.css'

export default function GateCamera({
  gates,
  isolated,
  label,
  title,
}: {
  gates: number
  isolated: boolean
  label: string
  title: string
}) {
  const id = useId().replace(/:/g, '')
  return (
    <div className={styles.camera}>
      <span className={styles.cameraLabel}>{title}</span>
      <svg viewBox="0 0 700 340" role="img" aria-label={label}>
        <defs>
          <pattern
            id={`${id}-grid`}
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M28 0H0V28"
              fill="none"
              stroke="#203e3c"
              strokeWidth=".6"
            />
          </pattern>
          <linearGradient id={`${id}-haze`} x2="0" y2="1">
            <stop stopColor="#244540" />
            <stop offset="1" stopColor="#081519" />
          </linearGradient>
        </defs>
        <rect width="700" height="340" fill={`url(#${id}-haze)`} />
        <rect width="700" height="340" fill={`url(#${id}-grid)`} />
        <path
          d="M0 0L170 100H530L700 0M0 340L170 245H530L700 340M170 100V245M530 100V245M0 170H170M530 170H700"
          stroke="#4d7770"
          fill="none"
        />
        <path
          d="M0 70H115V110M700 70H585V110M0 280H110M700 280H590"
          stroke="#9c8459"
          fill="none"
          strokeWidth="4"
        />
        {[0, 1, 2].map((index) => (
          <g key={index} transform={`translate(${190 + index * 108}, 120)`}>
            <rect
              width="96"
              height="125"
              rx="2"
              fill="#061417"
              stroke={gates > index ? '#79e9be' : '#bd9a62'}
              strokeWidth="2"
            />
            <g className={styles.gateShutter} data-open={gates > index}>
              <rect x="4" y="4" width="88" height="117" fill="#233b3b" />
              {[20, 40, 60, 80, 100].map((y) => (
                <path key={y} d={`M8 ${y}H88`} stroke="#4d6962" />
              ))}
              <rect x="41" y="50" width="14" height="23" fill="#ba9860" />
            </g>
            <path
              d="M28 123V96H68V123"
              stroke={gates > index ? '#79e9be' : 'transparent'}
              fill="none"
            />
            <text
              x="48"
              y="-12"
              textAnchor="middle"
              fill="#bcd9cb"
              fontFamily="monospace"
              fontSize="11"
            >
              GATE 0{index + 1}
            </text>
            <circle
              cx="48"
              cy="147"
              r="4"
              fill={gates > index ? '#79e9be' : '#bd9a62'}
            />
          </g>
        ))}
        <path d="M80 305H620" stroke="#779f84" strokeDasharray="7 8" />
        <path d="M605 296L620 305L605 314" stroke="#79e9be" fill="none" />
        <text
          x="350"
          y="327"
          textAnchor="middle"
          fill="#82a69c"
          fontFamily="monospace"
          fontSize="10"
        >
          SERVICE CORRIDOR → DOCK 07
        </text>
      </svg>
      <span className={styles.cameraFoot}>
        CAM_07{' '}
        <span>{isolated ? 'LOCAL / MAINTENANCE' : 'REMOTE / MONITOR'}</span> 640
        × 320
      </span>
    </div>
  )
}
