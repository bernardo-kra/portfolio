import styles from './styles.module.css'

/** Editorial spread with margin guides and spacing callouts. */
export function SpaceNoteArt() {
  return (
    <svg
      className={styles.noteSvg}
      viewBox="0 0 340 200"
      role="presentation"
      focusable="false"
    >
      <rect width="340" height="200" fill="#f3f1ea" />
      {/* baseline grid */}
      {Array.from({ length: 11 }, (_, i) => (
        <line
          key={i}
          x1="0"
          x2="340"
          y1={16 + i * 17}
          y2={16 + i * 17}
          stroke="#18251c"
          strokeOpacity=".05"
        />
      ))}
      {/* page */}
      <g className={styles.artPage}>
        <rect
          x="58"
          y="22"
          width="224"
          height="156"
          rx="3"
          fill="#fffefa"
          stroke="#18251c"
          strokeOpacity=".12"
        />
        <rect
          x="80"
          y="40"
          width="180"
          height="120"
          fill="none"
          stroke="#267b48"
          strokeOpacity=".45"
          strokeDasharray="3 3"
        />
        <rect x="80" y="40" width="58" height="4" fill="#18251c" />
        <rect x="80" y="50" width="92" height="4" fill="#18251c" />
        <g fill="#18251c" fillOpacity=".22">
          <rect x="80" y="122" width="60" height="2.4" />
          <rect x="80" y="128" width="54" height="2.4" />
          <rect x="80" y="134" width="58" height="2.4" />
          <rect x="80" y="140" width="40" height="2.4" />
        </g>
        <text
          x="260"
          y="160"
          textAnchor="end"
          className={styles.artMark}
          fill="#267b48"
        >
          f.
        </text>
      </g>
      {/* spacing callouts */}
      <g
        className={styles.artCallout}
        stroke="#267b48"
        fill="#267b48"
        fontSize="8"
      >
        <line x1="150" y1="64" x2="150" y2="114" />
        <line x1="146" y1="64" x2="154" y2="64" />
        <line x1="146" y1="114" x2="154" y2="114" />
        <text x="157" y="92" stroke="none" fontFamily="ui-monospace,monospace">
          48
        </text>
        <line x1="58" y1="186" x2="80" y2="186" />
        <line x1="58" y1="182" x2="58" y2="190" />
        <line x1="80" y1="182" x2="80" y2="190" />
        <text x="84" y="189" stroke="none" fontFamily="ui-monospace,monospace">
          24
        </text>
      </g>
    </svg>
  )
}

/** The same content reflowing from three columns to a reading sequence. */
export function LayoutNoteArt() {
  return (
    <svg
      className={styles.noteSvg}
      viewBox="0 0 340 200"
      role="presentation"
      focusable="false"
    >
      <rect width="340" height="200" fill="#d6eadc" />
      {/* desktop window */}
      <g className={styles.artDesktop}>
        <rect x="22" y="34" width="192" height="132" rx="6" fill="#fffefa" />
        <rect
          x="22"
          y="34"
          width="192"
          height="14"
          rx="6"
          fill="#18251c"
          fillOpacity=".06"
        />
        <g fill="#18251c" fillOpacity=".25">
          <circle cx="31" cy="41" r="2" />
          <circle cx="38" cy="41" r="2" />
          <circle cx="45" cy="41" r="2" />
        </g>
        <rect x="34" y="58" width="96" height="5" fill="#18251c" />
        <rect x="34" y="78" width="52" height="58" rx="2" fill="#267b48" />
        <rect
          x="92"
          y="78"
          width="52"
          height="58"
          rx="2"
          fill="#267b48"
          fillOpacity=".35"
        />
        <rect
          x="150"
          y="78"
          width="52"
          height="58"
          rx="2"
          fill="#267b48"
          fillOpacity=".15"
        />
        <rect x="34" y="146" width="40" height="8" rx="4" fill="#18251c" />
      </g>
      {/* arrow */}
      <path
        className={styles.artArrow}
        d="M224 100 h22 m-6 -5 l6 5 l-6 5"
        fill="none"
        stroke="#18251c"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* phone */}
      <g className={styles.artPhone}>
        <rect x="258" y="22" width="62" height="156" rx="10" fill="#18251c" />
        <rect x="262" y="30" width="54" height="140" rx="6" fill="#fffefa" />
        <rect x="268" y="38" width="34" height="3.5" fill="#18251c" />
        <rect x="268" y="48" width="42" height="26" rx="2" fill="#267b48" />
        <rect
          x="268"
          y="80"
          width="42"
          height="26"
          rx="2"
          fill="#267b48"
          fillOpacity=".35"
        />
        <rect
          x="268"
          y="112"
          width="42"
          height="26"
          rx="2"
          fill="#267b48"
          fillOpacity=".15"
        />
        <rect x="268" y="146" width="42" height="9" rx="4.5" fill="#18251c" />
      </g>
    </svg>
  )
}
