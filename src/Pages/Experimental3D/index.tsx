import { useEffect, useReducer, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Cpu,
  FileText,
  Folder,
  HardDrive,
  KeyRound,
  LockKeyhole,
  Network,
  Radio,
  RotateCcw,
  ShieldCheck,
  Terminal,
  Unplug,
  Zap,
} from 'lucide-react'
import { useI18n } from '@src/i18n'
import SignalConsole from './SignalConsole'
import {
  createMissionState,
  gateCodes,
  missionReducer,
  requiredRoutes,
} from './missionState'
import type { MissionFile } from './missionState'
import { missionCopy } from './missionCopy'
import GateCamera from './components/GateCamera'
import styles from './mission.module.css'

const files: { id: MissionFile; name: string; size: string; date: string }[] = [
  {
    id: 'manifest',
    name: 'CARGO_MANIFEST.log',
    size: '24.8 KB',
    date: '23:04:12',
  },
  {
    id: 'personnel',
    name: 'NIGHT_SHIFT.dat',
    size: '8.2 KB',
    date: '23:11:09',
  },
  {
    id: 'maintenance',
    name: 'RELAY_PROTOCOL.txt',
    size: '2.1 KB',
    date: '23:17:42',
  },
  { id: 'blacktide', name: 'BLACK_TIDE.nb', size: '77.0 KB', date: '23:59:07' },
]
const letters = ['A', 'B', 'C']

export default function Experimental3D() {
  const { lang, setLang } = useI18n()
  const copy = missionCopy[lang]
  const [mission, dispatch] = useReducer(
    missionReducer,
    undefined,
    createMissionState
  )
  const [code, setCode] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const extractionRef = useRef<HTMLButtonElement>(null)
  const previousPhase = useRef(mission.phase)
  const fileIndex = files.findIndex((file) => file.id === mission.file)
  const selectedFile = files[fileIndex]
  const linked = mission.routes.every(
    (value, index) => value === requiredRoutes[index]
  )
  const step =
    mission.phase === 'server' ? 0 : mission.phase === 'signal' ? 1 : 2

  useEffect(() => {
    if (previousPhase.current === mission.phase) return
    previousPhase.current = mission.phase
    headingRef.current?.focus({ preventScroll: true })
    headingRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }, [mission.phase])

  useEffect(() => {
    if (mission.gates === 3) extractionRef.current?.focus()
  }, [mission.gates])

  const restart = () => {
    setCode('')
    dispatch({ type: 'reset' })
  }

  return (
    <div className={styles.mission}>
      <div className={styles.frame}>
        <header className={styles.topbar}>
          <Link to="/" className={styles.back}>
            <ArrowLeft size={15} /> {copy.back}
          </Link>
          <span className={styles.wordmark}>
            <span className={styles.brandMark}>A</span> ASTERION{' '}
            <small>SYSTEMS</small>
          </span>
          <div className={styles.topActions}>
            <button onClick={restart} title={copy.replayHint}>
              <RotateCcw size={14} />
              <span>{copy.restart}</span>
            </button>
            <button
              onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
              aria-label={copy.language}
            >
              {lang === 'pt' ? 'EN' : 'PT'}
            </button>
          </div>
        </header>
        <div className={styles.sessionBar}>
          <span>
            <i className={styles.statusLight} /> {copy.simulation}
          </span>
          <span>
            {copy.session} / NB-{String(mission.attempt).padStart(3, '0')}
          </span>
        </div>
        <ol
          className={styles.steps}
          aria-label={lang === 'pt' ? 'Etapas da missão' : 'Mission stages'}
        >
          {copy.phases.map((label, index) => (
            <li
              key={label}
              data-active={step === index}
              data-done={step > index || mission.phase === 'complete'}
              aria-current={
                step === index && mission.phase !== 'complete'
                  ? 'step'
                  : undefined
              }
            >
              <span>
                {step > index || mission.phase === 'complete' ? (
                  <Check size={14} />
                ) : (
                  `0${index + 1}`
                )}
              </span>
              {label}
              <ChevronRight size={14} />
            </li>
          ))}
        </ol>
        {mission.phase === 'server' && (
          <main className={styles.stage}>
            <section className={styles.intro}>
              <div>
                <p className={styles.eyebrow}>{copy.eyebrow}</p>
                <h1 ref={headingRef} tabIndex={-1}>
                  {copy.title}
                </h1>
                <p className={styles.lead}>{copy.intro}</p>
              </div>
              <div className={styles.objective}>
                <span>{copy.objective}</span>
                <strong>{copy.objectiveText}</strong>
                <small>ASTERION / PRIVATE ARCHIVE / VOL. 07</small>
              </div>
            </section>
            <div className={styles.serverGrid}>
              <aside className={styles.sidebar}>
                <p className={styles.panelLabel}>
                  <HardDrive size={14} /> {copy.folders}
                </p>
                <div className={styles.volume}>
                  <Folder size={17} />
                  <span>
                    {copy.volume}
                    <small>/srv/asterion/operations</small>
                  </span>
                  <span>04</span>
                </div>
                <div className={styles.volumeMuted}>
                  <LockKeyhole size={15} /> {copy.archive}
                  <small>OFFLINE</small>
                </div>
                <div className={styles.storage}>
                  <span>
                    VOL_07 <strong>68%</strong>
                  </span>
                  <div>
                    <i />
                  </div>
                  <small>136 GB / 200 GB</small>
                </div>
                <div className={styles.rackHeader}>
                  <span>{copy.rack}</span>
                  <Cpu size={15} />
                </div>
                <div
                  className={styles.rack}
                  role="img"
                  aria-label={copy.rackLabel}
                >
                  {['PWR', 'CORE', 'ARCH', 'COMM', 'BACKUP'].map(
                    (label, index) => (
                      <div className={styles.rackUnit} key={label}>
                        <small>0{index + 1}</small>
                        <span>
                          {label}
                          <i />
                        </span>
                        <b />
                        <b />
                        <em />
                      </div>
                    )
                  )}
                </div>
                <div className={styles.telemetry}>
                  <span>{copy.telemetry}</span>
                  <dl>
                    <div>
                      <dt>{copy.latency}</dt>
                      <dd>
                        12 <small>ms</small>
                      </dd>
                    </div>
                    <div>
                      <dt>{copy.temp}</dt>
                      <dd>
                        32 <small>°C</small>
                      </dd>
                    </div>
                  </dl>
                </div>
              </aside>
              <section
                className={styles.archivePanel}
                aria-labelledby="archive-title"
              >
                <div className={styles.panelHeading}>
                  <h2 id="archive-title">
                    <Folder size={16} />
                    {copy.files}
                  </h2>
                  <span>04 OBJECTS</span>
                </div>
                <div className={styles.path}>
                  <span>ASTERION</span>
                  <ChevronRight size={12} />
                  <span>VOL_07</span>
                  <ChevronRight size={12} />
                  <strong>OPERATIONS</strong>
                </div>
                <div
                  className={styles.fileList}
                  role="group"
                  aria-label={copy.files}
                >
                  {files.map((file, index) => (
                    <button
                      className={styles.fileRow}
                      key={file.id}
                      aria-pressed={mission.file === file.id}
                      onClick={() => dispatch({ type: 'file', file: file.id })}
                    >
                      <span className={styles.fileIcon}>
                        {file.id === 'blacktide' ? (
                          <Radio size={21} />
                        ) : (
                          <FileText size={21} />
                        )}
                      </span>
                      <span className={styles.fileName}>
                        <strong>{file.name}</strong>
                        <small>{copy.fileNames[index]}</small>
                      </span>
                      <span className={styles.fileSize}>
                        {file.size}
                        <small>{file.date}</small>
                      </span>
                      <ChevronRight size={15} />
                    </button>
                  ))}
                </div>
                <p className={styles.fileHint}>{copy.inspectHint}</p>
                <div
                  className={styles.filePreview}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <div className={styles.previewHeading}>
                    <span>{copy.preview}</span>
                    <small>
                      {mission.file === 'blacktide' ? 'LEVEL 07' : 'INTERNAL'}
                    </small>
                  </div>
                  <p className={styles.eyebrow}>{copy.fileKinds[fileIndex]}</p>
                  <h3>{selectedFile.name}</h3>
                  <p className={styles.documentText}>
                    {copy.fileText[fileIndex]}
                  </p>
                  {mission.file === 'blacktide' ? (
                    <>
                      <span className={styles.connectionStatus}>
                        <i className={styles.statusLight} />
                        {copy.restricted}
                      </span>
                      <button
                        className={styles.primary}
                        onClick={() => dispatch({ type: 'connect' })}
                      >
                        {copy.connect}
                        <ArrowRight size={17} />
                      </button>
                    </>
                  ) : (
                    <span className={styles.readonly}>
                      <LockKeyhole size={13} />
                      {copy.readOnly}
                    </span>
                  )}
                  <div className={styles.documentSeal} aria-hidden="true">
                    A / VII
                  </div>
                </div>
              </section>
            </div>
            <section className={styles.sessionLog} aria-label={copy.log}>
              <Terminal size={16} />
              <span>{copy.log}</span>
              <ol>
                {copy.serverLogs
                  .slice(0, mission.file === 'blacktide' ? 3 : 2)
                  .map((line, index) => (
                    <li key={line}>
                      <span>0{index + 1}</span>
                      {line}
                      <Check size={12} />
                    </li>
                  ))}
              </ol>
            </section>
            <details className={styles.help}>
              <summary>{copy.help}</summary>
              <p>{copy.helpText}</p>
            </details>
          </main>
        )}
        {mission.phase === 'signal' && (
          <section className={styles.signalStage}>
            <div className={styles.signalBrief}>
              <Radio size={23} />
              <div>
                <p className={styles.eyebrow}>02 / SIGNAL INTELLIGENCE</p>
                <h1 tabIndex={-1} ref={headingRef}>
                  {copy.signalTitle}
                </h1>
                <p>{copy.signalText}</p>
              </div>
            </div>
            <SignalConsole
              key={mission.attempt}
              onContinue={(captured) => dispatch({ type: 'signals', captured })}
              onRestart={restart}
            />
          </section>
        )}
        {mission.phase === 'control' && (
          <main className={styles.stage}>
            <section className={styles.intro}>
              <div>
                <p className={styles.eyebrow}>{copy.controlEyebrow}</p>
                <h1 ref={headingRef} tabIndex={-1}>
                  {copy.controlTitle}
                </h1>
                <p className={styles.lead}>{copy.controlIntro}</p>
              </div>
              <div className={styles.objective}>
                <span>{copy.keyring}</span>
                <strong>
                  <KeyRound size={17} /> 088 / 104 / 116
                </strong>
                <small>DOCK · BOILER · TOWER</small>
              </div>
            </section>
            <div className={styles.controlGrid}>
              <section className={styles.visualPanel}>
                <div className={styles.panelHeading}>
                  <h2>
                    <ShieldCheck size={16} />
                    {copy.surveillance}
                  </h2>
                  <span
                    className={mission.isolated ? styles.green : styles.amber}
                  >
                    {mission.isolated ? copy.isolated : copy.live}
                  </span>
                </div>
                <GateCamera
                  gates={mission.gates}
                  isolated={mission.isolated}
                  label={copy.cameraLabel}
                  title={copy.camera}
                />
                <div className={styles.isolation}>
                  <p>
                    {mission.isolated
                      ? copy.isolatedText
                      : copy.feedback.isolate}
                  </p>
                  <button
                    className={styles.secondary}
                    disabled={mission.isolated}
                    onClick={() => dispatch({ type: 'isolate' })}
                  >
                    {mission.isolated ? (
                      <Check size={16} />
                    ) : (
                      <Unplug size={16} />
                    )}
                    {mission.isolated ? copy.isolated : copy.isolate}
                  </button>
                </div>
                <div className={styles.patchPanel}>
                  <div className={styles.panelHeading}>
                    <h2>
                      <Network size={16} />
                      {copy.patch}
                    </h2>
                    <span className={linked ? styles.green : styles.amber}>
                      {linked ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>
                  <p>{copy.patchHint}</p>
                  <div className={styles.patchMatrix}>
                    {mission.routes.map((destination, index) => (
                      <button
                        key={index}
                        disabled={mission.gates > 0}
                        onClick={() => dispatch({ type: 'route', index })}
                        aria-label={`${copy.relay} ${letters[index]}. ${copy.destination}: ${letters[destination]}`}
                        data-linked={destination === requiredRoutes[index]}
                      >
                        <small>
                          {copy.relay} 0{index + 1}
                        </small>
                        <span>
                          {letters[index]}
                          <span className={styles.wire} />
                          <Zap size={14} />
                          {letters[destination]}
                        </span>
                        <em>
                          {copy.destination} {letters[destination]} ↻
                        </em>
                      </button>
                    ))}
                  </div>
                  <span className={linked ? styles.green : styles.amber}>
                    {linked ? copy.linked : copy.unlinked}
                  </span>
                </div>
              </section>
              <section
                className={styles.accessPanel}
                aria-labelledby="access-title"
              >
                <div className={styles.panelHeading}>
                  <h2 id="access-title">
                    <LockKeyhole size={16} />
                    {copy.access}
                  </h2>
                  <span>{mission.gates} / 03</span>
                </div>
                <ol className={styles.gateList}>
                  {copy.gateNames.map((name, index) => (
                    <li
                      key={name}
                      data-open={mission.gates > index}
                      data-current={mission.gates === index}
                    >
                      <span>
                        {mission.gates > index ? (
                          <Check size={18} />
                        ) : (
                          <LockKeyhole size={18} />
                        )}
                      </span>
                      <div>
                        <small>GATE 0{index + 1}</small>
                        <strong>{name}</strong>
                      </div>
                      <em>{mission.gates > index ? copy.open : copy.locked}</em>
                    </li>
                  ))}
                </ol>
                <div className={styles.keyring}>
                  <h3>
                    <KeyRound size={14} />
                    {copy.keyring}
                  </h3>
                  {gateCodes.map((key, index) => (
                    <div key={key}>
                      <span>GATE 0{index + 1}</span>
                      <strong>{Number(key)} MHz</strong>
                      <code>{key}</code>
                    </div>
                  ))}
                  <p>{copy.keyHint}</p>
                </div>
                {mission.gates < 3 ? (
                  <form
                    className={styles.authorization}
                    onSubmit={(event) => {
                      event.preventDefault()
                      dispatch({ type: 'gate', code })
                      setCode('')
                    }}
                  >
                    <label htmlFor="gate-code">
                      {copy.code} / GATE 0{mission.gates + 1}
                    </label>
                    <div>
                      <KeyRound size={19} />
                      <input
                        id="gate-code"
                        value={code}
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={3}
                        placeholder="000"
                        onChange={(event) =>
                          setCode(event.target.value.replace(/\D/g, ''))
                        }
                        aria-describedby="gate-feedback gate-help"
                      />
                      <span>3 DIGITS</span>
                    </div>
                    <button
                      className={styles.primary}
                      type="submit"
                      disabled={code.length !== 3}
                    >
                      {copy.unlock}
                      <ArrowRight size={16} />
                    </button>
                    <p id="gate-help">{copy.gateHelp}</p>
                  </form>
                ) : (
                  <div className={styles.extraction}>
                    <ShieldCheck size={28} />
                    <p>{copy.extractionReady}</p>
                    <button
                      className={styles.primary}
                      onClick={() => dispatch({ type: 'extract' })}
                      ref={extractionRef}
                    >
                      {copy.extraction}
                      <ArrowRight size={17} />
                    </button>
                  </div>
                )}
                <p id="gate-feedback" className={styles.feedback} role="status">
                  {copy.feedback[mission.feedback]}
                </p>
              </section>
            </div>
          </main>
        )}
        {mission.phase === 'complete' && (
          <main className={styles.complete}>
            <div className={styles.completeEmblem}>
              <ShieldCheck size={48} />
              <span>NB / 007</span>
            </div>
            <p className={styles.eyebrow}>{copy.completeEyebrow}</p>
            <h1 ref={headingRef} tabIndex={-1}>
              {copy.completeTitle}
            </h1>
            <p className={styles.lead}>{copy.completeText}</p>
            <section className={styles.report} aria-label={copy.report}>
              {copy.reportItems.map((item, index) => (
                <div key={item}>
                  <Check size={17} />
                  <strong>{index === 0 ? '01' : '03'}</strong>
                  <span>{item}</span>
                </div>
              ))}
            </section>
            <button className={styles.primary} onClick={restart}>
              <RotateCcw size={17} />
              {copy.replay}
              <ArrowRight size={17} />
            </button>
            <p className={styles.replayHint}>{copy.replayHint}</p>
            <Link to="/">{copy.back} ↗</Link>
          </main>
        )}
        <footer className={styles.footer}>
          <span>{copy.footer}</span>
          <span>
            NB-OS 7.0 <i /> {copy.simulation}
          </span>
        </footer>
      </div>
    </div>
  )
}
