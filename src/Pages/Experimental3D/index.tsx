import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '@src/i18n'
import type { Lang } from '@src/i18n'
import styles from './styles.module.css'
import HeaderBar from './components/HeaderBar'
import HeroSection from './components/HeroSection'
import DeckGrid from './components/DeckGrid'
import Ribbon from './components/Ribbon'

const Experimental3D: React.FC = () => {
  const navigate = useNavigate()
  const { lang, setLang, t } = useI18n()
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isPortalOpen, setIsPortalOpen] = useState(false)
  const [mode, setMode] = useState<'live' | 'inspect'>('live')
  const [power, setPower] = useState(84)
  const [signal, setSignal] = useState<'green' | 'yellow' | 'red'>('green')

  const handleSetLang = (l: Lang) => setLang(l)

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    const handleMove = (event: MouseEvent) => {
      const rect = overlay.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      overlay.style.setProperty('--mx', `${x}`)
      overlay.style.setProperty('--my', `${y}`)
    }

    const handleLeave = () => {
      overlay.style.setProperty('--mx', '0.5')
      overlay.style.setProperty('--my', '0.5')
    }

    overlay.addEventListener('mousemove', handleMove)
    overlay.addEventListener('mouseleave', handleLeave)

    return () => {
      overlay.removeEventListener('mousemove', handleMove)
      overlay.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <div
      className={[
        styles.experimental3D,
        isPortalOpen ? styles.portalOpen : '',
        mode === 'inspect' ? styles.inspectMode : '',
        signal === 'green'
          ? styles.signalGreenMode
          : signal === 'yellow'
          ? styles.signalYellowMode
          : styles.signalRedMode,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.themeControls}>
        <button
          className={styles.languageToggle}
          onClick={() => handleSetLang(lang === 'pt' ? 'en' : 'pt')}
          aria-label="Change language"
        >
          {lang === 'pt' ? 'EN' : 'PT'}
        </button>
        <button
          className={styles.backButton}
          onClick={() => navigate('/')}
          aria-label="Back to home"
        >
          &lt;
        </button>
      </div>

      <video className={styles.videoBackground} autoPlay loop muted playsInline>
        <source src="/130502-747461498.mp4" type="video/mp4" />
      </video>

      <div
        className={styles.overlay}
        ref={overlayRef}
        style={{ ['--power' as never]: (power / 100).toString() }}
      >
        <div className={styles.atmoLayer} aria-hidden="true">
          <div className={styles.atmoHaze} />
          <div className={styles.atmoBeam} />
          <div className={styles.atmoBeamWide} />
          <div className={styles.atmoGrid} />
          <div className={styles.atmoParticles} />
        </div>

        <HeaderBar
          brandText={t.experimental3d?.brandText ?? 'NEON BAY / DOCK 07'}
          statusLabel={
            isPortalOpen
              ? t.experimental3d?.status?.portalOpen ?? 'Portal aberto'
              : t.experimental3d?.status?.hangarActive ?? 'Hangar ativo'
          }
          isPortalOpen={isPortalOpen}
        />

        <HeroSection
          title={t.experimental3d?.hero?.title ?? 'Controle de acesso para o piso luminoso.'}
          copy={
            t.experimental3d?.hero?.copy ??
            'Um painel inspirado na baia industrial do video: luzes de sinalizacao no chao, metal frio e anuncios de status em tempo real. Clique nos controles para energizar, alternar modo e testar sinais do dock.'
          }
          tags={[
            t.experimental3d?.tags?.[0] ?? 'Luzes neon',
            t.experimental3d?.tags?.[1] ?? 'Metal escuro',
            t.experimental3d?.tags?.[2] ?? 'Ambiente subterraneo',
          ]}
          isPortalOpen={isPortalOpen}
          mode={mode}
          power={power}
          signal={signal}
          onTogglePortal={() => setIsPortalOpen((prev) => !prev)}
          onToggleMode={() => setMode((prev) => (prev === 'live' ? 'inspect' : 'live'))}
          onPowerChange={(value) => setPower(value)}
          onSignalChange={(value) => setSignal(value)}
          labels={{
            openPortal: t.experimental3d?.buttons?.openPortal ?? 'Abrir portal',
            closePortal: t.experimental3d?.buttons?.closePortal ?? 'Fechar portal',
            modeInspect: t.experimental3d?.buttons?.modeInspect ?? 'Modo inspecao',
            modeLive: t.experimental3d?.buttons?.modeLive ?? 'Modo live',
            panelTitle: t.experimental3d?.panel?.title ?? 'Status da baia',
            panelLive: t.experimental3d?.panel?.live ?? 'Operacional',
            panelInspect: t.experimental3d?.panel?.inspect ?? 'Inspecao',
            statEnergy: t.experimental3d?.stats?.energy ?? 'Energia',
            statDoor: t.experimental3d?.stats?.door ?? 'Porta',
            statDoorOpen: t.experimental3d?.stats?.doorOpen ?? 'Aberta',
            statDoorLocked: t.experimental3d?.stats?.doorLocked ?? 'Travada',
            statSignals: t.experimental3d?.stats?.signals ?? 'Sinais',
            statSignalOk: t.experimental3d?.stats?.signalOk ?? 'OK',
            statSignalAlert: t.experimental3d?.stats?.signalAlert ?? 'Alerta',
            statSignalRisk: t.experimental3d?.stats?.signalRisk ?? 'Risco',
            statControl: t.experimental3d?.stats?.control ?? 'Controle',
            statControlManual: t.experimental3d?.stats?.controlManual ?? 'Manual',
            statControlAudit: t.experimental3d?.stats?.controlAudit ?? 'Auditoria',
            controlEnergy: t.experimental3d?.controls?.energy ?? 'Energia',
            controlSignal: t.experimental3d?.controls?.signal ?? 'Sinal',
          }}
        />

        <DeckGrid
          cards={[
            {
              title: t.experimental3dCards?.runway?.title ?? 'Pista luminosa',
              text:
                t.experimental3dCards?.runway?.text ??
                'Sequencia de luzes amarelas e vermelhas para guiar a entrada.',
              foot: t.experimental3dCards?.runway?.foot ?? 'Canal 01',
            },
            {
              title: t.experimental3dCards?.terminal?.title ?? 'Terminal retro',
              text:
                t.experimental3dCards?.terminal?.text ??
                'Estacao de controle com brilho verde e interface compacta.',
              foot: t.experimental3dCards?.terminal?.foot ?? 'Console 4B',
            },
            {
              title: t.experimental3dCards?.alerts?.title ?? 'Alertas ativos',
              text:
                t.experimental3dCards?.alerts?.text ??
                'Tubos vermelhos e sinais piscando para indicar riscos.',
              foot: t.experimental3dCards?.alerts?.foot ?? 'Nivel medio',
            },
          ]}
        />

        <Ribbon
          items={[
            t.experimental3dRibbon?.[0] ?? 'PISO ATIVO •',
            t.experimental3dRibbon?.[1] ?? 'LUZES DE GUIA •',
            t.experimental3dRibbon?.[2] ?? 'DOCK 07 LIBERADO •',
            t.experimental3dRibbon?.[3] ?? 'METAL INDUSTRIAL •',
            t.experimental3dRibbon?.[4] ?? 'PORTAL EM ESPERA •',
            t.experimental3dRibbon?.[5] ?? 'ACESSO CONTROLADO •',
          ]}
        />
      </div>
    </div>
  )
}

export default Experimental3D
