import { useEffect, useRef, useState, type CSSProperties } from 'react'
import shared from '../shared.module.css'
import styles from './styles.module.css'

const steps = [
  {
    label: 'Entender',
    title: 'Uma mensagem clara.',
    text: 'O título diz o que é, o subtítulo diz para quem e a ação principal fica sempre à vista.',
  },
  {
    label: 'Conhecer',
    title: 'Evidências do trabalho.',
    text: 'Trajetória, estudos e código aberto no lugar de promessas e números sem fonte.',
  },
  {
    label: 'Conversar',
    title: 'Um contato sem barreiras.',
    text: 'Email, LinkedIn ou um rascunho pronto. Nenhum cadastro no caminho.',
  },
]

/** O passo ativo é o que cruza a faixa central da tela. */
function useActiveStep(count: number) {
  const refs = useRef<(HTMLLIElement | null)[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting)
        if (!hit) return
        setActive(Number((hit.target as HTMLElement).dataset.step))
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    refs.current
      .slice(0, count)
      .forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
  }, [count])

  return { refs, active }
}

const MethodSection = () => {
  const { refs, active } = useActiveStep(steps.length)
  const progress = {
    '--progress': (active + 1) / steps.length,
  } as CSSProperties

  return (
    <section className={shared.section} aria-labelledby="method-title">
      <div className={`${shared.inner} ${styles.method}`}>
        <div className={styles.method__aside}>
          <p className={shared.eyebrow} data-index="(02)">
            Método
          </p>
          <h2 id="method-title" className={shared.title}>
            Da primeira impressão ao{' '}
            <span className={shared.serif}>próximo passo</span>.
          </h2>
          <div
            className={styles.method__meter}
            style={progress}
            aria-hidden="true"
          >
            <span>0{active + 1}</span>
            <span className={styles.method__track} />
            <span>0{steps.length}</span>
          </div>
        </div>

        <ol className={styles.method__steps}>
          {steps.map((step, index) => (
            <li
              key={step.label}
              ref={(node) => {
                refs.current[index] = node
              }}
              data-step={index}
              data-active={index === active}
              className={styles.method__step}
            >
              <p className={styles.method__label}>
                0{index + 1} / {step.label}
              </p>
              <h3 className={styles.method__title}>{step.title}</h3>
              <p className={styles.method__text}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default MethodSection
