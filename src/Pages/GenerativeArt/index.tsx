import React, { useState } from 'react'
import styles from './styles.module.css'
import PatternCanvas from '../../components/generative/PatternCanvas'
import CosmicControlPanel from '../../components/generative/CosmicControlPanel'
import { HomeButton } from '../../components/common'
import { useScrollToTop } from '@hooks/useScrollToTop'
import type { CosmicSettings } from '../../components/generative/PatternCanvas/types'

const GenerativeArt: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false)
  const [hideUI, setHideUI] = useState(false)
  const [pauseGeneration, setPauseGeneration] = useState(true)
  const [showControlPanel, setShowControlPanel] = useState(false)
  const [cosmicSettings, setCosmicSettings] = useState<CosmicSettings>({
    starDensity: 0.8,
    nebulaDensity: 0.3,
    dustDensity: 0.4,
    asteroidDensity: 0.6,
    cometDensity: 0.4,
    timeSpeed: 1.0,
    colorPalette: 'nebula'
  })

  useScrollToTop()

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowInfo(false)
    }
  }

  return (
    <div className={styles.generativeArt}>
      <div className={styles.backgroundPattern}></div>

      {!hideUI && (
        <>
          <HomeButton />

          <button
            className={styles.infoButton}
            onClick={() => setShowInfo(!showInfo)}
            title="Explorar os mistérios do cosmos digital"
          >
            🔭 Observar
          </button>

          <button
            className={styles.hideUIButton}
            onClick={() => setHideUI(true)}
            title="Modo observação profunda do espaço"
          >
            🌌 Deep Space
          </button>

          <button
            className={styles.pauseButton}
            onClick={() => setPauseGeneration(!pauseGeneration)}
            title={pauseGeneration ? "Ativar geração de formas cósmicas" : "Mostrar apenas eventos espaciais"}
          >
            {pauseGeneration ? '🌌 Formas' : '🌠 Espaço'}
          </button>

          <button
            className={styles.controlButton}
            onClick={() => setShowControlPanel(!showControlPanel)}
            title="Abrir painel de controle cósmico"
          >
            ⚙️ Controles
          </button>
        </>
      )}

      {hideUI && (
        <button
          className={styles.showUIButton}
          onClick={() => setHideUI(false)}
          title="Mostrar painel de controle da estação espacial"
        >
          🛰️
        </button>
      )}

      {!hideUI && (
        <div className={styles.header}>
          <h1 className={styles.title}>Digital Cosmos Observatory</h1>
          <p className={styles.subtitle}>
            Simulação cósmica em tempo real com eventos astronômicos procedurais
          </p>
        </div>
      )}

      <div className={styles.canvasSection}>
        <PatternCanvas pauseGeneration={pauseGeneration} settings={cosmicSettings} />
      </div>

      <CosmicControlPanel
        settings={cosmicSettings}
        onSettingsChange={setCosmicSettings}
        isVisible={showControlPanel}
        onToggle={() => setShowControlPanel(!showControlPanel)}
      />

      {showInfo && (
        <div className={styles.infoModal} onClick={handleModalClick}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setShowInfo(false)}
            >
              ✕
            </button>

            <h2 className={styles.modalTitle}>🔭 Observatório Cósmico Digital</h2>

            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>🌌 Fenômenos Astronômicos</h3>
              <ul className={styles.eventList}>
                <li><strong>💥 Supernovas (0.01% chance)</strong> - explosões estelares com ondas de choque</li>
                <li><strong>☄️ Chuvas de Meteoros (0.08% chance)</strong> - detritos espaciais incandescentes</li>
                <li><strong>🌞 Erupções Solares (0.03% chance)</strong> - jatos de plasma estelar</li>
                <li><strong>🌈 Auroras Boreais (0.05% chance)</strong> - interações magnéticas atmosféricas</li>
                <li><strong>🛰️ Satélites (0.1% chance)</strong> - objetos artificiais em órbita</li>
                <li><strong>☄️ Cometas (0.02% chance)</strong> - corpos gelados com caudas luminosas</li>
              </ul>
            </div>


            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>🌊 Ondas Gravitacionais</h3>
              <ul className={styles.eventList}>
                <li><strong>Distorções Espaciais</strong> - ondas se propagam pelo cosmos</li>
                <li><strong>Efeitos Visuais</strong> - anéis concêntricos com distorções</li>
                <li><strong>Impacto Físico</strong> - empurra objetos e altera trajetórias</li>
                <li><strong>Origem Cósmica</strong> - geradas por eventos extremos</li>
              </ul>
            </div>

            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>🎆 Partículas Cósmicas</h3>
              <p className={styles.description}>
                Ambiente espacial completo com <strong>PARTÍCULAS AMBIENTAIS REALISTAS</strong> que simulam o cosmos:
              </p>
              <ul className={styles.eventList}>
                <li><strong>✨ Poeira Cósmica</strong> - partículas microscópicas flutuantes</li>
                <li><strong>🌌 Nebulosas</strong> - nuvens de gás e poeira interestelar</li>
                <li><strong>⭐ Campo Estelar</strong> - distribuição realística de estrelas</li>
                <li><strong>🌀 Matéria Escura</strong> - componente invisível do cosmos</li>
              </ul>
            </div>

            <div className={styles.dnaDisplay}>
              <p>🧬 Cada elemento possui DNA único: <code>A∞G◊T※C⚡</code></p>
            </div>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Criado por <span className={styles.authorName}>Bernardo Kraczkowski</span>
        </p>
      </footer>
    </div>
  )
}

export default GenerativeArt