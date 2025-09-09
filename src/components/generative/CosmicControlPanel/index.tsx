import React, { useState } from 'react'
import styles from './styles.module.css'

interface CosmicSettings {
  starDensity: number
  nebulaDensity: number
  dustDensity: number
  asteroidDensity: number
  cometDensity: number
  timeSpeed: number
  colorPalette: string
}

interface CosmicControlPanelProps {
  settings: CosmicSettings
  onSettingsChange: (settings: CosmicSettings) => void
  isVisible: boolean
  onToggle: () => void
}

const CosmicControlPanel: React.FC<CosmicControlPanelProps> = ({
  settings,
  onSettingsChange,
  isVisible,
  onToggle
}) => {
  const [activeTab, setActiveTab] = useState<'density' | 'visual' | 'time'>('density')

  const colorPalettes = [
    { id: 'nebula', name: 'Nebulosa', colors: ['#ff6b9d', '#c44569', '#f8b500', '#4ecdc4'] },
    { id: 'aurora', name: 'Aurora', colors: ['#00d4aa', '#00a8cc', '#ff6b6b', '#4ecdc4'] },
    { id: 'supernova', name: 'Supernova', colors: ['#ff4757', '#ffa502', '#ff6348', '#ff7675'] },
    { id: 'cosmic', name: 'Cósmico', colors: ['#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'] },
    { id: 'galaxy', name: 'Galáxia', colors: ['#2d3436', '#636e72', '#74b9ff', '#0984e3'] },
    { id: 'stellar', name: 'Estelar', colors: ['#ffffff', '#f1c40f', '#e74c3c', '#9b59b6'] }
  ]

  const handleSliderChange = (key: keyof CosmicSettings, value: number) => {
    onSettingsChange({
      ...settings,
      [key]: value
    })
  }

  const handlePaletteChange = (paletteId: string) => {
    onSettingsChange({
      ...settings,
      colorPalette: paletteId
    })
  }

  const resetToDefaults = () => {
    onSettingsChange({
      starDensity: 0.8,
      nebulaDensity: 0.3,
      dustDensity: 0.4,
      asteroidDensity: 0.6,
      cometDensity: 0.4,
      timeSpeed: 1.0,
      colorPalette: 'nebula'
    })
  }

  if (!isVisible) {
    return (
      <button 
        className={styles.toggleButton}
        onClick={onToggle}
        title="Abrir painel de controle cósmico"
      >
        ⚙️
      </button>
    )
  }

  return (
    <div className={styles.controlPanel}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>🎛️ Controle Cósmico</h3>
        <button 
          className={styles.closeButton}
          onClick={onToggle}
          title="Fechar painel"
        >
          ✕
        </button>
      </div>

      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tab} ${activeTab === 'density' ? styles.active : ''}`}
          onClick={() => setActiveTab('density')}
        >
          🌟 Densidade
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'visual' ? styles.active : ''}`}
          onClick={() => setActiveTab('visual')}
        >
          🎨 Visual
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'time' ? styles.active : ''}`}
          onClick={() => setActiveTab('time')}
        >
          ⏰ Tempo
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'density' && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Densidade dos Elementos</h4>
            
            <div className={styles.sliderGroup}>
              <label className={styles.sliderLabel}>
                <span>⭐ Estrelas</span>
                <span className={styles.value}>{Math.round(settings.starDensity * 100)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.starDensity}
                onChange={(e) => handleSliderChange('starDensity', parseFloat(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <label className={styles.sliderLabel}>
                <span>🌌 Nebulosas</span>
                <span className={styles.value}>{Math.round(settings.nebulaDensity * 100)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.nebulaDensity}
                onChange={(e) => handleSliderChange('nebulaDensity', parseFloat(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <label className={styles.sliderLabel}>
                <span>✨ Poeira Cósmica</span>
                <span className={styles.value}>{Math.round(settings.dustDensity * 100)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.dustDensity}
                onChange={(e) => handleSliderChange('dustDensity', parseFloat(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <label className={styles.sliderLabel}>
                <span>🪨 Asteroides</span>
                <span className={styles.value}>{Math.round(settings.asteroidDensity * 100)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.asteroidDensity}
                onChange={(e) => handleSliderChange('asteroidDensity', parseFloat(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <label className={styles.sliderLabel}>
                <span>☄️ Cometas</span>
                <span className={styles.value}>{Math.round(settings.cometDensity * 100)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.cometDensity}
                onChange={(e) => handleSliderChange('cometDensity', parseFloat(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>
        )}

        {activeTab === 'visual' && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Paleta de Cores</h4>
            <div className={styles.paletteGrid}>
              {colorPalettes.map((palette) => (
                <button
                  key={palette.id}
                  className={`${styles.paletteButton} ${settings.colorPalette === palette.id ? styles.active : ''}`}
                  onClick={() => handlePaletteChange(palette.id)}
                  title={palette.name}
                >
                  <div className={styles.palettePreview}>
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className={styles.colorSwatch}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className={styles.paletteName}>{palette.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}


        {activeTab === 'time' && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Velocidade Temporal</h4>
            
            <div className={styles.sliderGroup}>
              <label className={styles.sliderLabel}>
                <span>⏱️ Velocidade</span>
                <span className={styles.value}>{settings.timeSpeed.toFixed(1)}x</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={settings.timeSpeed}
                onChange={(e) => handleSliderChange('timeSpeed', parseFloat(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.timePresets}>
              <button 
                className={styles.presetButton}
                onClick={() => handleSliderChange('timeSpeed', 0.1)}
              >
                🐌 Lento
              </button>
              <button 
                className={styles.presetButton}
                onClick={() => handleSliderChange('timeSpeed', 1.0)}
              >
                ⏯️ Normal
              </button>
              <button 
                className={styles.presetButton}
                onClick={() => handleSliderChange('timeSpeed', 3.0)}
              >
                ⚡ Rápido
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.panelFooter}>
        <button 
          className={styles.resetButton}
          onClick={resetToDefaults}
        >
          🔄 Resetar
        </button>
      </div>
    </div>
  )
}

export default CosmicControlPanel
