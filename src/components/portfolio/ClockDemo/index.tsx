import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import Container from '@components/common/Container'
import { clockCode, clockCSS } from './utils'
import { useI18n } from '@src/i18n'

const Clock: React.FC = () => {
  const { lang } = useI18n()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const seconds = time.getSeconds().toString().padStart(2, '0')

  return (
    <div className={styles.clock}>
      <div className={styles.clockTime}>
        {hours}:{minutes}:{seconds}
      </div>
      <div className={styles.clockDate}>
        {time.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
    </div>
  )
}

const CodeViewer: React.FC<{ codeType: 'tsx' | 'css' }> = ({ codeType }) => {
  return (
    <div className={styles.clockDemoCodeContainer}>
      <div className={styles.clockDemoCodeHeader}>
        <span className={styles.clockDemoLanguage}>
          {codeType === 'tsx' ? 'TSX' : 'CSS'}
        </span>
        <span className={styles.clockDemoFilename}>
          {codeType === 'tsx' ? 'Clock.tsx' : 'styles.module.css'}
        </span>
      </div>
      <pre className={styles.clockDemoCode}>
        <code className={styles.clockDemoCodeContent}>
          {codeType === 'tsx' ? clockCode : clockCSS}
        </code>
      </pre>
    </div>
  )
}

const ClockDemo: React.FC = () => {
  const { t } = useI18n()
  const [showCode, setShowCode] = useState(false)
  const [codeType, setCodeType] = useState<'tsx' | 'css'>('tsx')

  const toggleCode = () => {
    setShowCode(!showCode)
  }

  const toggleCodeType = () => {
    setCodeType(codeType === 'tsx' ? 'css' : 'tsx')
  }

  return (
    <Container>
      <section className={styles.clockDemoSection}>
        <h2 className={styles.clockDemoTitle}>
          {t.clockDemoTitle || 'Relógio em'} <span className={styles.clockDemoHighlight}>{t.clockDemoHighlight || 'Tempo Real'}</span>
        </h2>
        <p className={styles.clockDemoDescription}>
          {t.clockDemoDescription || 'Componente React funcional que atualiza a cada segundo usando useState e useEffect'}
        </p>
        
        <div className={styles.clockDemoControls}>
          <button 
            className={styles.clockDemoToggleBtn}
            onClick={toggleCode}
            aria-label={showCode ? (t.showClock || 'Mostrar relógio') : (t.showCode || 'Mostrar código')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            {showCode ? (t.viewClock || 'Ver Relógio') : (t.viewCode || 'Ver Código')}
          </button>
          
          {showCode && (
            <button 
              className={styles.clockDemoCodeTypeBtn}
              onClick={toggleCodeType}
            >
              {codeType === 'tsx' ? (t.viewCSS || 'Ver CSS') : (t.viewTSX || 'Ver TSX')}
            </button>
          )}
        </div>

        <div className={styles.clockDemoContainer}>
          {showCode ? (
            <CodeViewer codeType={codeType} />
          ) : (
            <Clock />
          )}
        </div>
      </section>
    </Container>
  )
}

export default ClockDemo 