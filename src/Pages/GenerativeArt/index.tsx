import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pause, Play, Settings2, Maximize2, HelpCircle } from 'lucide-react'
import { useI18n } from '@src/i18n'
import PatternCanvas from '@components/generative/PatternCanvas'
import CosmicControlPanel from '@components/generative/CosmicControlPanel'
import type { CosmicSettings } from '@components/generative/PatternCanvas/InfiniteGenerator'
import styles from './styles.module.css'

const GenerativeArt = () => {
  const { lang } = useI18n()
  const pt = lang === 'pt'
  const [hideUI, setHideUI] = useState(false)
  const [paused, setPaused] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [showControlPanel, setShowControlPanel] = useState(false)
  const helpRef = useRef<HTMLDialogElement>(null)
  const [settings, setSettings] = useState<CosmicSettings>({
    starDensity: 0.8,
    nebulaDensity: 0.3,
    dustDensity: 0.4,
    asteroidDensity: 0.6,
    cometDensity: 0.4,
    timeSpeed: 1,
    colorPalette: 'nebula',
  })
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setHideUI(false)
        setShowControlPanel(false)
      }
    }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [])
  return (
    <main className={styles.observatory}>
      <div className={styles.canvas}>
        <PatternCanvas isPaused={paused} settings={settings} />
      </div>
      {!hideUI ? (
        <>
          <header className={styles.toolbar}>
            <Link to="/">← {pt ? 'Estudos' : 'Studies'}</Link>
            <div className={styles.actions}>
              <button onClick={() => setPaused(!paused)} aria-pressed={paused}>
                {paused ? (
                  <Play size={16} aria-hidden="true" />
                ) : (
                  <Pause size={16} aria-hidden="true" />
                )}
                {paused
                  ? pt
                    ? 'Retomar animação'
                    : 'Resume animation'
                  : pt
                    ? 'Pausar animação'
                    : 'Pause animation'}
              </button>
              <button
                onClick={() => setShowControlPanel(!showControlPanel)}
                aria-expanded={showControlPanel}
                aria-controls="cosmic-controls"
              >
                <Settings2 size={16} aria-hidden="true" />
                {pt ? 'Ajustar cena' : 'Adjust scene'}
              </button>
              <button
                onClick={() => {
                  setShowControlPanel(false)
                  setHideUI(true)
                }}
              >
                <Maximize2 size={16} aria-hidden="true" />
                {pt ? 'Modo imersivo' : 'Immersive mode'}
              </button>
              <button onClick={() => helpRef.current?.showModal()}>
                <HelpCircle size={16} aria-hidden="true" />
                {pt ? 'Como explorar' : 'How to explore'}
              </button>
            </div>
          </header>
          <div className={styles.intro}>
            <p>LAB / CANVAS</p>
            <h1>
              {pt ? 'Um universo feito de código.' : 'A universe made of code.'}
            </h1>
            <p>
              {pt
                ? 'Ajuste a paleta, a densidade e o ritmo. Observe como pequenas mudanças transformam a cena.'
                : 'Adjust the palette, density and pace. See how small changes transform the scene.'}
            </p>
          </div>
          <footer className={styles.footer}>
            <span>
              {pt
                ? 'Experimento visual · não é uma simulação científica'
                : 'Visual experiment · not a scientific simulation'}
            </span>
            <Link to="/portfolio">
              {pt ? 'Conheça quem criou' : 'Meet the creator'} ↗
            </Link>
          </footer>
        </>
      ) : (
        <button className={styles.restore} onClick={() => setHideUI(false)}>
          {pt ? 'Mostrar controles' : 'Show controls'} · Esc
        </button>
      )}
      {!hideUI && showControlPanel && (
        <CosmicControlPanel
          settings={settings}
          onSettingsChange={setSettings}
          isVisible
          onToggle={() => setShowControlPanel(false)}
        />
      )}
      <dialog
        ref={helpRef}
        className={styles.helpDialog}
        aria-labelledby="cosmos-help-title"
      >
        <h2 id="cosmos-help-title">
          {pt ? 'Explore no seu ritmo' : 'Explore at your own pace'}
        </h2>
        <ol>
          <li>
            {pt
              ? 'Em Ajustar cena, escolha uma paleta e altere a densidade dos elementos.'
              : 'In Adjust scene, choose a palette and change the element density.'}
          </li>
          <li>
            {pt
              ? 'Use Pausar animação para observar um quadro com calma.'
              : 'Use Pause animation to take a closer look at a frame.'}
          </li>
          <li>
            {pt
              ? 'O modo imersivo esconde os controles. Esc os traz de volta.'
              : 'Immersive mode hides the controls. Esc brings them back.'}
          </li>
        </ol>
        <form method="dialog">
          <button>{pt ? 'Entendi, explorar' : 'Got it, explore'}</button>
        </form>
      </dialog>
    </main>
  )
}
export default GenerativeArt
