import { useState } from 'react'
import { Container, Section } from '@components/common'
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
    <Section className={styles.faq}>
      <Container className={styles.faq__container}>
        <div className={styles.faq__header}>
          <h2 className={styles.faq__title}>Antes de conversar</h2>
          <p className={styles.faq__subtitle}>
            O que você precisa saber sobre este estudo.
          </p>
        </div>
        <div className={styles.faq__list}>
          {faqs.map((faq, index) => (
            <div key={faq.question} className={styles.faq__item}>
              <h3>
                <button
                  type="button"
                  id={`faq-question-${index}`}
                  className={styles.faq__question}
                  aria-expanded={active === index}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setActive(active === index ? null : index)}
                >
                  <span className={styles.faq__questionText}>
                    {faq.question}
                  </span>
                  <span aria-hidden="true">{active === index ? '−' : '+'}</span>
                </button>
              </h3>
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                hidden={active !== index}
                className={`${styles.faq__answer} ${active === index ? styles.faq__answerActive : ''}`}
              >
                <p className={styles.faq__answerText}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
export default FAQSection
