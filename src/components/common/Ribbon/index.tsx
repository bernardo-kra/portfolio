import { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useI18n } from '@src/i18n'
import styles from './styles.module.css'

interface RibbonProps {
  items: string[]
  label?: string
  tone?: 'amber' | 'violet' | 'mint'
}

const Ribbon = ({ items, label, tone = 'amber' }: RibbonProps) => {
  const [paused, setPaused] = useState(false)
  const { lang } = useI18n()
  const isPortuguese = lang === 'pt'
  if (!items.length) return null

  return (
    <section
      className={styles.ribbon}
      data-tone={tone}
      aria-label={label ?? (isPortuguese ? 'Destaques' : 'Highlights')}
    >
      <div className={styles.viewport}>
        <div className={styles.track} data-paused={paused}>
          {[false, true].map((duplicate) => (
            <ul
              className={styles.run}
              key={String(duplicate)}
              aria-hidden={duplicate || undefined}
            >
              {items.map((item, index) => (
                <li key={index}>
                  {item.replace(/\s*•$/, '')}
                  <span aria-hidden="true">✦</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <button
        type="button"
        className={styles.control}
        onClick={() => setPaused(!paused)}
        aria-pressed={paused}
        aria-label={
          isPortuguese ? 'Pausar faixa animada' : 'Pause animated ribbon'
        }
      >
        {paused ? (
          <Play size={14} aria-hidden="true" />
        ) : (
          <Pause size={14} aria-hidden="true" />
        )}
        <span>
          {paused
            ? isPortuguese
              ? 'Continuar'
              : 'Resume'
            : isPortuguese
              ? 'Pausar'
              : 'Pause'}
        </span>
      </button>
    </section>
  )
}
export default Ribbon
