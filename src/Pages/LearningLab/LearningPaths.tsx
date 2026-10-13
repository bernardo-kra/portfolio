import { useState } from 'react'
import {
  ArrowUpRight,
  Type,
  Space,
  Palette,
  Shapes,
  Accessibility,
  MousePointer2,
} from 'lucide-react'
import type { LearningCopy } from './content'
import styles from './paths.module.css'
import shared from './styles.module.css'

const paths = [
  { id: 'color', category: 1, icon: Palette, color: 'blue' },
  { id: 'type', category: 1, icon: Type, color: 'yellow' },
  { id: 'space', category: 2, icon: Space, color: 'coral' },
  { id: 'shape', category: 2, icon: Shapes, color: 'mint' },
  { id: 'structure', category: 3, icon: Accessibility, color: 'yellow' },
  { id: 'feedback', category: 3, icon: MousePointer2, color: 'blue' },
]

function PathCard({ index, copy }: { index: number; copy: LearningCopy }) {
  const [expanded, setExpanded] = useState(false)
  const path = paths[index]
  const track = copy.tracks[index]
  const Icon = path.icon
  return (
    <article className={styles.card}>
      <div
        className={styles.cardVisual}
        data-color={path.color}
        aria-hidden="true"
      >
        <span className={styles.number}>0{index + 1}</span>
        <Icon className={styles.trackIcon} strokeWidth={1.7} />
        <span className={styles.visualStar}>✦</span>
        <span className={styles.visualCircle} />
      </div>
      <div className={styles.cardBody}>
        <p className={styles.category}>{copy.filters[path.category]}</p>
        <h3>{track.title}</h3>
        <p>{track.text}</p>
        <ul className={styles.trackTags}>
          {track.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <button
          className={styles.cardAction}
          type="button"
          aria-expanded={expanded}
          aria-controls={`challenge-${path.id}`}
          onClick={() => setExpanded(!expanded)}
        >
          {copy.trackAction}
          <ArrowUpRight size={20} aria-hidden="true" />
        </button>
        <div
          id={`challenge-${path.id}`}
          hidden={!expanded}
          className={styles.challenge}
        >
          <strong>{copy.challengeLabel}</strong>
          <p>{track.detail}</p>
        </div>
      </div>
    </article>
  )
}

export default function LearningPaths({ copy }: { copy: LearningCopy }) {
  const [filter, setFilter] = useState(0)
  return (
    <section
      id="trilhas"
      className={`${shared.container} ${styles.paths}`}
      aria-labelledby="paths-title"
    >
      <div className={shared.sectionHeading}>
        <span className={`${shared.tag} ${shared.white}`}>
          {copy.tracksTag}
        </span>
        <h2 id="paths-title">{copy.tracksTitle}</h2>
        <p>{copy.tracksText}</p>
      </div>
      <div className={styles.filters} role="group" aria-label={copy.nav[1]}>
        {copy.filters.map((label, index) => (
          <button
            type="button"
            key={label}
            aria-pressed={filter === index}
            onClick={() => setFilter(index)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.grid}>
        {paths.map(
          (path, index) =>
            (filter === 0 || path.category === filter) && (
              <PathCard key={path.id} index={index} copy={copy} />
            )
        )}
      </div>
    </section>
  )
}
