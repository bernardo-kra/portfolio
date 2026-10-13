import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, RotateCcw } from 'lucide-react'
import { useI18n } from '@src/i18n'
import { challengeCopy, type ChallengeCopy } from './challengeCopy'
import styles from './challenge.module.css'
import shared from '../styles.module.css'

function Composition({
  question,
  option,
  copy,
}: {
  question: number
  option: number
  copy: ChallengeCopy
}) {
  return (
    <div
      className={styles.composition}
      data-question={question}
      data-option={option}
      aria-hidden="true"
    >
      <div className={styles.mockHeading} />
      <div className={styles.mockLine} />
      {question === 1 ? (
        <div className={styles.mockForm}>
          <span>{copy.label}</span>
          <div>{copy.field}</div>
        </div>
      ) : (
        <div className={styles.mockActions}>
          <span>
            {question === 2
              ? option === 1
                ? copy.after
                : copy.before
              : copy.action}
            {question === 2 && option === 1 && <Check size={14} />}
          </span>
          {question === 0 && (
            <>
              <span>{copy.other}</span>
              <span>···</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function DesignChallenge({
  onExplore,
}: {
  onExplore: () => void
}) {
  const { lang } = useI18n()
  const copy = challengeCopy[lang]
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const heading = useRef<HTMLHeadingElement>(null)
  const initial = useRef(true)
  useEffect(() => {
    if (initial.current) {
      initial.current = false
      return
    }
    heading.current?.focus({ preventScroll: true })
  }, [step])
  const question = copy.questions[Math.min(step, 2)]
  const selected = answers[step]
  function advance() {
    setStep(step + 1)
    if (step === 2) onExplore()
  }
  function restart() {
    setStep(0)
    setAnswers([])
  }
  if (step === 3)
    return (
      <div className={styles.finish}>
        <span className={styles.finishMark} aria-hidden="true">
          ✳
        </span>
        <h3 ref={heading} tabIndex={-1}>
          {copy.resultTitle}
        </h3>
        <p>
          <strong>
            {
              answers.filter(
                (answer, index) => answer === copy.questions[index].correct
              ).length
            }{' '}
            / 3
          </strong>{' '}
          {copy.resultText}
        </p>
        <p>{copy.resultHint}</p>
        <button type="button" className={shared.button} onClick={restart}>
          <RotateCcw size={17} aria-hidden="true" />
          {copy.restart}
        </button>
      </div>
    )
  return (
    <div className={styles.challenge}>
      <div className={styles.heading}>
        <span>03 / DESIGN DETECTIVE</span>
        <h3>{copy.title}</h3>
        <p>{copy.text}</p>
      </div>
      <div className={styles.questionHeader}>
        <span>
          {copy.progress} {step + 1} {copy.of} 3
        </span>
        <div aria-hidden="true">
          {copy.questions.map((_, index) => (
            <i key={index} data-active={index <= step} />
          ))}
        </div>
      </div>
      <h4 ref={heading} tabIndex={-1}>
        {question.title}
      </h4>
      <div className={styles.choices}>
        {question.options.map((option, index) => (
          <button
            type="button"
            key={option}
            aria-pressed={selected === index}
            disabled={selected !== undefined && selected !== index}
            onClick={() => {
              if (selected === undefined) setAnswers([...answers, index])
            }}
          >
            <span className={styles.optionLetter}>
              {index === 0 ? 'A' : 'B'}
            </span>
            <Composition question={step} option={index} copy={copy} />
            <span className={styles.optionText}>{option}</span>
          </button>
        ))}
      </div>
      <div className={styles.feedback} role="status">
        {selected === undefined ? (
          <p>{copy.choose}</p>
        ) : (
          <>
            <strong>
              {selected === question.correct ? copy.correct : copy.incorrect}
            </strong>
            <p>{question.explanation}</p>
          </>
        )}
      </div>
      {selected !== undefined && (
        <button
          type="button"
          className={`${shared.button} ${shared.red}`}
          onClick={advance}
        >
          {step === 2 ? copy.finish : copy.next}
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
