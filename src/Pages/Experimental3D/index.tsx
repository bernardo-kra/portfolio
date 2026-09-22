import { useEffect, useReducer, useRef, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  Compass,
  Crosshair,
  Maximize2,
  Pause,
  Play,
  Radio,
  RotateCcw,
  ScanLine,
  Settings2,
  Terminal,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { useI18n } from '@src/i18n'
import { profile } from '@src/config/profile'
import SectorMap from './components/SectorMap'
import SignalScope from './components/SignalScope'
import {
  consoleReducer,
  createConsoleState,
  sectors,
  signalQuality,
} from './consoleState'
import type { SectorId } from './consoleState'
import { parseCommand } from './commands'
import { consoleCopy } from './copy'
import { cinematicCopy } from './cinematicCopy'
import { useConsoleAudio } from './useConsoleAudio'
import styles from './styles.module.css'

type Feedback =
  | 'invalid'
  | 'busy'
  | 'needScan'
  | 'needSignal'
  | 'already'
  | 'started'
  | 'accepted'
  | 'cancelled'
  | 'commandHint'

export default function Experimental3D() {
  const { lang, setLang } = useI18n()
  const copy = consoleCopy[lang]
  const cinema = cinematicCopy[lang]
  const [state, dispatch] = useReducer(
    consoleReducer,
    undefined,
    createConsoleState
  )
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [effectsEnabled, setEffectsEnabled] = useState(true)
  const [visible, setVisible] = useState(() => !document.hidden)
  const [immersive, setImmersive] = useState(false)
  const [command, setCommand] = useState('')
  const [feedback, setFeedback] = useState<Feedback>('commandHint')
  const frequencyRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLParagraphElement>(null)
  const operationId = useRef(0)
  const commandOrigin = useRef(false)
  const audio = useConsoleAudio()

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReducedMotion(preference.matches)
    const syncVisibility = () => setVisible(!document.hidden)
    preference.addEventListener('change', syncMotion)
    document.addEventListener('visibilitychange', syncVisibility)
    return () => {
      preference.removeEventListener('change', syncMotion)
      document.removeEventListener('visibilitychange', syncVisibility)
    }
  }, [])

  const sector = sectors.find((item) => item.id === state.selected)!
  const details = copy.sectors[state.selected]
  const scanned = state.scanned.includes(state.selected)
  const captured = state.captured.includes(state.selected)
  const quality = scanned ? signalQuality(state.frequency, sector.frequency) : 0
  const aligned = scanned && quality >= 84
  const complete = state.captured.length === sectors.length
  const nextSector = sectors.find((item) => !state.captured.includes(item.id))
  const latest = state.events[0]
  const operation = state.operation
  const motion = effectsEnabled && !reducedMotion && visible
  const phaseLabels =
    operation?.kind === 'capture' ? cinema.capturePhases : cinema.scanPhases

  useEffect(() => {
    if (!operation || !visible) return
    if (!effectsEnabled || reducedMotion) {
      dispatch({ type: 'finish', id: operation.id })
      return
    }
    const timer = window.setTimeout(
      () =>
        dispatch({ type: 'advance', id: operation.id, stage: operation.stage }),
      650
    )
    return () => window.clearTimeout(timer)
  }, [operation, visible, effectsEnabled, reducedMotion])

  useEffect(() => {
    if (commandOrigin.current) return
    const target =
      latest.kind === 'capture'
        ? messageRef.current
        : latest.kind === 'scan' || latest.kind === 'assist'
          ? frequencyRef.current
          : null
    target?.focus({ preventScroll: true })
    if (latest.kind === 'capture')
      target?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
  }, [latest])

  const selectSector = (id: SectorId) => {
    commandOrigin.current = false
    audio.play('select')
    dispatch({ type: 'select', sector: id })
  }
  const begin = (kind: 'scan' | 'capture'): Feedback => {
    if (operation) return 'busy'
    if ((kind === 'scan' && scanned) || (kind === 'capture' && captured))
      return 'already'
    if (kind === 'capture' && !scanned) return 'needScan'
    if (kind === 'capture' && !aligned) return 'needSignal'
    operationId.current += 1
    dispatch({ type: 'begin', kind, id: operationId.current })
    audio.play(kind)
    return 'started'
  }
  const execute = (event: FormEvent) => {
    event.preventDefault()
    commandOrigin.current = true
    const parsed = parseCommand(command)
    if (!parsed) {
      setFeedback('invalid')
      return
    }
    if (
      operation &&
      !['cancel', 'reset', 'help', 'target'].includes(parsed.type)
    ) {
      setFeedback('busy')
      return
    }
    setCommand('')
    setFeedback('accepted')
    switch (parsed.type) {
      case 'help':
        setFeedback('commandHint')
        break
      case 'scan':
        setFeedback(begin('scan'))
        break
      case 'intercept':
        setFeedback(begin('capture'))
        break
      case 'tune':
        dispatch({ type: 'tune', frequency: parsed.frequency })
        break
      case 'assist':
        if (!scanned) setFeedback('needScan')
        else dispatch({ type: 'assist' })
        break
      case 'target':
        dispatch({ type: 'select', sector: parsed.sector })
        break
      case 'cancel':
        dispatch({ type: 'cancel' })
        setFeedback('cancelled')
        break
      case 'reset':
        dispatch({ type: 'reset' })
        break
    }
  }
  const step = captured
    ? copy.stepDone
    : !scanned
      ? copy.stepScan
      : aligned
        ? copy.stepRead
        : copy.stepTune
  const hint = captured
    ? copy.doneHint
    : !scanned
      ? copy.scanHint
      : aligned
        ? copy.readHint
        : copy.tuneHint

  return (
    <main
      className={styles.console}
      data-motion={motion ? 'on' : 'off'}
      data-immersive={immersive}
      data-busy={operation?.kind ?? 'idle'}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setImmersive(false)
      }}
    >
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link to="/" className={styles.back}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span>{copy.back}</span>
          </Link>
          <div className={styles.brand}>
            <Compass size={30} aria-hidden="true" />
            <span>
              NEON BAY<small>SIGNAL INTELLIGENCE / VII</small>
            </span>
          </div>
          <div className={styles.headerActions}>
            <button
              aria-label={
                cinema.motion + ': ' + (motion ? cinema.off : cinema.on)
              }
              title={reducedMotion ? cinema.motionPreference : cinema.motion}
              aria-pressed={effectsEnabled && !reducedMotion}
              disabled={reducedMotion}
              onClick={() => setEffectsEnabled((value) => !value)}
            >
              {motion ? (
                <Pause size={16} aria-hidden="true" />
              ) : (
                <Play size={16} aria-hidden="true" />
              )}
            </button>
            <button
              aria-label={
                cinema.sound + ': ' + (audio.enabled ? cinema.on : cinema.off)
              }
              title={audio.available ? cinema.sound : cinema.unavailable}
              aria-pressed={audio.enabled}
              disabled={!audio.available}
              onClick={() => void audio.toggle()}
            >
              {audio.enabled ? (
                <Volume2 size={16} aria-hidden="true" />
              ) : (
                <VolumeX size={16} aria-hidden="true" />
              )}
            </button>
            <button
              aria-label={immersive ? cinema.exitFocus : cinema.focus}
              title={immersive ? cinema.exitFocus : cinema.focus}
              aria-pressed={immersive}
              onClick={() => setImmersive((value) => !value)}
            >
              {immersive ? (
                <X size={16} aria-hidden="true" />
              ) : (
                <Maximize2 size={16} aria-hidden="true" />
              )}
            </button>
            <button
              onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
              aria-label={copy.language}
            >
              {lang === 'pt' ? 'EN' : 'PT'}
            </button>
          </div>
        </header>
        <section className={styles.intro} aria-labelledby="neon-title">
          <div>
            <p className={styles.eyebrow}>{cinema.classification}</p>
            <h1 id="neon-title">
              {cinema.operation}
              <span aria-hidden="true">_</span>
            </h1>
            <p className={styles.introCopy}>{cinema.subtitle}</p>
          </div>
          <div className={styles.operationBadge}>
            <span className={styles.statusDot} />
            {copy.simulation}
            <strong>NB—007</strong>
            <span>STEAM / SIGNAL / SECRETS</span>
          </div>
        </section>
        <div className={styles.workspace}>
          <section className={styles.mapPanel} aria-labelledby="map-title">
            <div className={styles.panelHeading}>
              <h2 id="map-title">
                <Crosshair size={16} aria-hidden="true" />
                {cinema.network}
              </h2>
              <span>TACTICAL VIEW / 01</span>
            </div>
            <SectorMap
              selected={state.selected}
              captured={state.captured}
              operation={operation}
              motion={motion}
              quality={quality}
              onSelect={selectSector}
            />
            <div
              className={styles.sectors}
              role="group"
              aria-label={copy.sector}
            >
              {sectors.map((item, index) => (
                <button
                  key={item.id}
                  className={styles.sectorButton}
                  aria-pressed={state.selected === item.id}
                  onClick={() => selectSector(item.id)}
                >
                  <span className={styles.sectorNumber}>
                    {state.captured.includes(item.id) ? (
                      <Check size={17} aria-label={copy.captured} />
                    ) : (
                      '0' + (index + 1)
                    )}
                  </span>
                  <span>
                    <strong>{copy.sectors[item.id].name}</strong>
                    <small>{copy.sectors[item.id].type}</small>
                  </span>
                  <ChevronRight size={13} aria-hidden="true" />
                </button>
              ))}
            </div>
            <div
              className={styles.sequence}
              aria-live="polite"
              aria-atomic="true"
            >
              <div>
                <span className={styles.eyebrow}>
                  {operation ? cinema.sequence : cinema.tracking}
                </span>
                <strong>
                  {operation
                    ? phaseLabels[operation.stage]
                    : complete
                      ? cinema.extraction
                      : details.name}
                </strong>
              </div>
              {operation ? (
                <>
                  <span className={styles.sequenceCount}>
                    0{operation.stage + 1}
                    <small> / 03</small>
                  </span>
                  <progress
                    max={3}
                    value={operation.stage + 1}
                    aria-label={cinema.sequence}
                  />
                  <div className={styles.sequenceActions}>
                    <button onClick={() => dispatch({ type: 'cancel' })}>
                      {cinema.cancel}
                    </button>
                    <button
                      onClick={() =>
                        dispatch({ type: 'finish', id: operation.id })
                      }
                    >
                      {cinema.skip}
                      <ChevronRight size={14} aria-hidden="true" />
                    </button>
                  </div>
                </>
              ) : (
                <span className={styles.sequenceCode}>
                  {captured
                    ? 'ARCHIVED'
                    : scanned
                      ? 'CHANNEL LOCK'
                      : 'AWAITING SCAN'}
                </span>
              )}
            </div>
          </section>
          <section className={styles.receiver} aria-labelledby="receiver-title">
            <div className={styles.panelHeading}>
              <h2 id="receiver-title">
                <Radio size={16} aria-hidden="true" />
                {copy.receiver}
              </h2>
              <span>{sector.code}</span>
            </div>
            <div className={styles.receiverBody}>
              <div className={styles.receiverTitle}>
                <div>
                  <p className={styles.eyebrow}>{details.type}</p>
                  <h3>{details.name}</h3>
                </div>
                <span
                  className={styles.brassDial}
                  style={
                    {
                      '--angle': (state.frequency - 80) * 6 - 120 + 'deg',
                    } as CSSProperties
                  }
                  aria-hidden="true"
                >
                  <i />
                </span>
              </div>
              <div className={styles.readout}>
                <label htmlFor="neon-frequency">{copy.frequency}</label>
                <div>
                  <output htmlFor="neon-frequency">
                    {state.frequency.toFixed(1)}
                  </output>
                  <span>MHz</span>
                  <small>{scanned ? quality + '% LOCK' : 'NO LOCK'}</small>
                </div>
                <div className={styles.dial} aria-hidden="true">
                  <span
                    style={{ left: ((state.frequency - 80) / 40) * 100 + '%' }}
                  />
                </div>
              </div>
              <input
                id="neon-frequency"
                ref={frequencyRef}
                className={styles.frequency}
                type="range"
                min="80"
                max="120"
                step="1"
                value={state.frequency}
                disabled={!!operation}
                aria-valuetext={state.frequency + ' MHz'}
                aria-describedby="tune-help"
                onChange={(event) =>
                  dispatch({
                    type: 'tune',
                    frequency: Number(event.target.value),
                  })
                }
              />
              <div className={styles.rangeLabels} aria-hidden="true">
                <span>80.0 MHz</span>
                <span>120.0 MHz</span>
              </div>
              <div className={styles.spectrum}>
                <div>
                  <span>{cinema.spectrum}</span>
                  <strong>{scanned ? quality + '%' : '—'}</strong>
                </div>
                <SignalScope
                  quality={quality}
                  frequency={state.frequency}
                  label={cinema.waveform}
                />
              </div>
              <p id="tune-help" className={styles.tuneHelp}>
                {scanned
                  ? cinema.channel +
                    ': ' +
                    sector.frequency +
                    ' MHz · ' +
                    (aligned ? copy.locked : copy.tuneHint)
                  : copy.scanHint}
              </p>
              <div className={styles.receiverActions}>
                {captured ? (
                  <div className={styles.captured}>
                    <Check size={18} aria-hidden="true" />
                    {copy.captured}
                  </div>
                ) : (
                  <button
                    className={styles.primary}
                    disabled={!!operation || (scanned && !aligned)}
                    onClick={() => {
                      commandOrigin.current = false
                      begin(scanned ? 'capture' : 'scan')
                    }}
                  >
                    {scanned ? (
                      <Radio size={18} aria-hidden="true" />
                    ) : (
                      <ScanLine size={18} aria-hidden="true" />
                    )}
                    {operation
                      ? phaseLabels[operation.stage]
                      : scanned
                        ? copy.capture
                        : copy.scan}
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                )}
                {scanned && !captured && !aligned && (
                  <button
                    className={styles.assist}
                    disabled={!!operation}
                    onClick={() => {
                      commandOrigin.current = false
                      dispatch({ type: 'assist' })
                    }}
                  >
                    <Settings2 size={15} aria-hidden="true" />
                    {copy.assist}
                  </button>
                )}
                {captured && nextSector && (
                  <button
                    className={styles.assist}
                    onClick={() => selectSector(nextSector.id)}
                  >
                    {copy.next}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
              <p className={styles.description}>{details.text}</p>
            </div>
          </section>
        </div>
        <section className={styles.mission} aria-labelledby="mission-title">
          <div className={styles.missionMark} aria-hidden="true">
            {complete ? <Check size={25} /> : '0' + (state.captured.length + 1)}
          </div>
          <div>
            <p className={styles.eyebrow}>{copy.briefing}</p>
            <h2 id="mission-title">{complete ? copy.complete : step}</h2>
            <p>{complete ? copy.completeHint : hint}</p>
          </div>
          <div className={styles.progress}>
            <span>{copy.progress}</span>
            <strong>
              {state.captured.length}
              <small> / 03</small>
            </strong>
            <progress
              max={3}
              value={state.captured.length}
              aria-label={copy.progress}
            />
          </div>
        </section>
        <div className={styles.bottomGrid}>
          <section
            className={styles.dossier}
            aria-labelledby="dossier-title"
            data-decoded={captured}
          >
            <div className={styles.panelHeading}>
              <h2 id="dossier-title">{cinema.transmission}</h2>
              <span>{sector.code} / ENIGMA</span>
            </div>
            <div className={styles.dossierBody}>
              <div className={styles.cipher} aria-hidden="true">
                {Array.from({ length: 12 }, (_, i) => (
                  <span
                    key={i}
                    data-decoded={
                      captured ||
                      (operation?.kind === 'capture' &&
                        i < (operation.stage + 1) * 4)
                    }
                  >
                    {captured ||
                    (operation?.kind === 'capture' &&
                      i < (operation.stage + 1) * 4)
                      ? ['DOCK', 'STEAM', 'BRASS', 'NIGHT'][i % 4]
                      : ['7F2A', '■Δ07', '0X9F', 'Σ4B1', 'C8E3', '4D∷2'][
                          (i + sectors.indexOf(sector)) % 6
                        ]}
                  </span>
                ))}
              </div>
              <p className={styles.eyebrow}>
                {captured ? details.clue : cinema.waiting}
              </p>
              <p
                ref={messageRef}
                tabIndex={-1}
                className={captured ? styles.message : styles.empty}
              >
                {captured ? details.message : copy.empty}
              </p>
              {captured && (
                <span className={styles.decodedStamp}>
                  <Check size={13} aria-hidden="true" />
                  {cinema.decoded}
                </span>
              )}
            </div>
          </section>
          <section className={styles.log} aria-labelledby="log-title">
            <div className={styles.panelHeading}>
              <h2 id="log-title">
                <Terminal size={15} aria-hidden="true" />
                {copy.log}
              </h2>
              <span>LOCAL / CLI</span>
            </div>
            <ol>
              {state.events.map((event) => (
                <li key={event.sequence}>
                  <span>{String(event.sequence).padStart(2, '0')}</span>
                  <span>
                    {copy.events[event.kind]}
                    <small>{copy.sectors[event.sector].name}</small>
                  </span>
                  <Check size={12} aria-hidden="true" />
                </li>
              ))}
            </ol>
            <form className={styles.commandForm} onSubmit={execute}>
              <label htmlFor="neon-command">
                NB:~$
                <span className={styles.announcement}>{cinema.command}</span>
              </label>
              <input
                id="neon-command"
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                placeholder="help"
                maxLength={80}
                autoComplete="off"
                spellCheck={false}
                autoCapitalize="none"
                aria-describedby="command-feedback"
              />
              <button type="submit" aria-label={cinema.send}>
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </form>
            <p
              className={styles.commandFeedback}
              id="command-feedback"
              role="status"
            >
              {cinema[feedback]}
            </p>
          </section>
        </div>
        <div className={styles.utilities}>
          <details className={styles.help}>
            <summary>{copy.help}</summary>
            <p>
              {copy.helpText} {cinema.commandHint}
            </p>
          </details>
          <button
            className={styles.reset}
            onClick={() => {
              commandOrigin.current = false
              dispatch({ type: 'reset' })
              setFeedback('commandHint')
            }}
            title={copy.resetHint}
          >
            <RotateCcw size={14} aria-hidden="true" />
            {copy.reset}
          </button>
        </div>
        <p
          className={styles.announcement}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {copy.events[latest.kind]}: {copy.sectors[latest.sector].name}.
          {latest.kind === 'scan' ? ' ' + sector.frequency + ' MHz.' : ''}
          {latest.kind === 'capture' ? ' ' + details.message : ''}
          {complete ? ' ' + copy.complete : ''}
        </p>
        <footer className={styles.footer}>
          <p>{copy.footer}</p>
          <div>
            <Link to="/">
              {copy.explore}
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            <a
              href={profile.github + '/portfolio'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.source}
            </a>
          </div>
        </footer>
      </div>
    </main>
  )
}
