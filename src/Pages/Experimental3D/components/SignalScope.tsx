import styles from '../styles.module.css'

export default function SignalScope({
  quality,
  frequency,
  label,
}: {
  quality: number
  frequency: number
  label: string
}) {
  const points = Array.from({ length: 121 }, (_, index) => {
    const x = index * 3
    const carrier =
      Math.sin(index * 0.28 + frequency * 0.1) * (9 + quality * 0.15)
    const noise =
      Math.sin(index * 2.7) * Math.cos(index * 0.83) * (1 - quality / 100) * 20
    return x + ',' + (45 + carrier + noise).toFixed(1)
  }).join(' ')
  return (
    <svg
      className={styles.waveform}
      viewBox="0 0 360 90"
      role="img"
      aria-label={label}
    >
      <path
        d="M0 22H360M0 45H360M0 68H360M60 0V90M120 0V90M180 0V90M240 0V90M300 0V90"
        className={styles.waveGrid}
      />
      <g className={styles.waveTravel}>
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <polyline
          points={points}
          transform="translate(360)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </g>
      <path
        d="M180 0V90"
        stroke="currentColor"
        strokeDasharray="2 5"
        opacity=".35"
      />
    </svg>
  )
}
