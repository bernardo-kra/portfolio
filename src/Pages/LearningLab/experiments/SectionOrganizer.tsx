import { ArrowUp, ArrowDown, GripVertical, Plus, X } from 'lucide-react'
import { defaultSections, type SectionKind } from './builderModel'
import type { BuilderCopy } from './builderCopy'
import styles from './builder.module.css'

export default function SectionOrganizer({
  sections,
  copy,
  move,
  remove,
  add,
}: {
  sections: SectionKind[]
  copy: BuilderCopy
  move: (from: number, to: number) => void
  remove: (kind: SectionKind) => void
  add: (kind: SectionKind) => void
}) {
  return (
    <div className={styles.organizer}>
      <h4>{copy.blocks}</h4>
      <ol>
        {sections.map((kind, index) => (
          <li
            key={kind}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData('text/plain', String(index))
              event.dataTransfer.effectAllowed = 'move'
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              move(Number(event.dataTransfer.getData('text/plain')), index)
            }}
          >
            <GripVertical size={15} aria-hidden="true" />
            <span>{copy.sections[kind]}</span>
            <button
              type="button"
              disabled={index === 0}
              aria-label={`${copy.up}: ${copy.sections[kind]}`}
              onClick={() => move(index, index - 1)}
            >
              <ArrowUp size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={index === sections.length - 1}
              aria-label={`${copy.down}: ${copy.sections[kind]}`}
              onClick={() => move(index, index + 1)}
            >
              <ArrowDown size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={`${copy.remove}: ${copy.sections[kind]}`}
              onClick={() => remove(kind)}
            >
              <X size={15} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
      <div className={styles.additions}>
        {defaultSections
          .filter((kind) => !sections.includes(kind))
          .map((kind) => (
            <button type="button" key={kind} onClick={() => add(kind)}>
              <Plus size={14} aria-hidden="true" />
              {copy.add} {copy.sections[kind]}
            </button>
          ))}
      </div>
      <p>{copy.hint}</p>
    </div>
  )
}
