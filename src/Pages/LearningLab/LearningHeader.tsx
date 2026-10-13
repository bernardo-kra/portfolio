import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Menu, X } from 'lucide-react'
import { useI18n } from '@src/i18n'
import type { LearningCopy } from './content'
import styles from './header.module.css'
import shared from './styles.module.css'

const anchors = ['proposta', 'experimentos', 'oficina', 'duvidas']

export default function LearningHeader({ copy }: { copy: LearningCopy }) {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      menuRef.current?.focus()
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [open])

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.back} aria-label={copy.back}>
        <ArrowLeft size={18} aria-hidden="true" /> LAB
      </Link>
      <button
        className={styles.menuButton}
        ref={menuRef}
        type="button"
        aria-label={open ? copy.closeMenu : copy.menu}
        aria-expanded={open}
        aria-controls="learning-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <nav
        id="learning-navigation"
        aria-label={copy.navigation}
        className={styles.nav}
        data-open={open}
      >
        {anchors.map((anchor, index) => (
          <a href={`#${anchor}`} key={anchor} onClick={() => setOpen(false)}>
            {copy.nav[index]}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className={styles.language}
        aria-label={
          lang === 'pt' ? 'Switch to English' : 'Mudar para português'
        }
        onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
      >
        {lang === 'pt' ? 'EN' : 'PT'}
      </button>
      <a
        className={`${shared.button} ${shared.red} ${styles.headerCta}`}
        href="#oficina"
      >
        {copy.try}
        <ArrowUpRight size={18} aria-hidden="true" />
      </a>
    </header>
  )
}
