import { useState } from 'react'
import { Plus } from 'lucide-react'
import shared from '../shared.module.css'
import styles from './styles.module.css'

const faqs = [
  {
    question: 'Esta página representa uma agência?',
    answer:
      'Não. É um estudo pessoal de landing page criado por Bernardo Kraczkowski para explorar comunicação, layout e interação.',
  },
  {
    question: 'Onde encontro sua experiência profissional?',
    answer:
      'No portfólio você encontra minha trajetória, tecnologias, formação e currículo para download.',
  },
  {
    question: 'Como funciona o contato?',
    answer:
      'O formulário prepara uma mensagem no seu aplicativo de email. Você revisa e confirma o envio lá. Também pode falar comigo pelo LinkedIn.',
  },
  {
    question: 'Posso explorar o código?',
    answer:
      'Sim. O repositório do portfólio está disponível no GitHub, com os componentes e estudos apresentados neste site.',
  },
]

const FAQSection = () => {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section className={shared.section} aria-labelledby="faq-title">
      <div className={`${shared.inner} ${styles.faq}`}>
        <div className={styles.faq__aside}>
          <p className={shared.eyebrow} data-index="(05)">
            Perguntas
          </p>
          <h2 id="faq-title" className={shared.title}>
            Antes de <span className={shared.serif}>conversar</span>.
          </h2>
          <p className={shared.lede}>
            O que você precisa saber sobre este estudo.
          </p>
        </div>

        <div className={styles.faq__list}>
          {faqs.map((faq, index) => {
            const open = active === index
            return (
              <div
                key={faq.question}
                className={styles.faq__item}
                data-open={open}
              >
                <h3 className={styles.faq__heading}>
                  <button
                    type="button"
                    id={`faq-question-${index}`}
                    className={`${styles.faq__question} ${shared.focusRing}`}
                    aria-expanded={open}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => setActive(open ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <Plus
                      size={22}
                      className={styles.faq__icon}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className={styles.faq__panel}
                >
                  <div className={styles.faq__panelInner}>
                    <p className={styles.faq__answer}>{faq.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
