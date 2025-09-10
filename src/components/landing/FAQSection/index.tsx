import React, { useState } from 'react'
import { Container, Section, Typography } from '@components/common'
import styles from './styles.module.css'

const FAQSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "Quanto tempo leva para desenvolver um projeto?",
      answer: "O tempo varia conforme a complexidade do projeto. Sites institucionais simples levam de 2-4 semanas, enquanto e-commerces ou aplicações complexas podem levar de 6-12 semanas. Sempre fornecemos um cronograma detalhado antes de iniciar."
    },
    {
      question: "Vocês oferecem suporte após a entrega?",
      answer: "Sim! Oferecemos 3 meses de suporte gratuito após a entrega, incluindo correções de bugs e pequenos ajustes. Após esse período, temos planos de manutenção mensal com preços especiais para nossos clientes."
    },
    {
      question: "Os sites são responsivos e otimizados para SEO?",
      answer: "Absolutamente! Todos os nossos projetos são desenvolvidos com design responsivo (mobile-first) e incluem otimizações completas de SEO, performance e acessibilidade. Garantimos que seu site funcione perfeitamente em todos os dispositivos."
    },
    {
      question: "Posso acompanhar o progresso do desenvolvimento?",
      answer: "Sim! Utilizamos ferramentas de gestão de projeto onde você pode acompanhar o progresso em tempo real, ver atualizações diárias e comunicar-se diretamente com nossa equipe. Transparência total no processo."
    },
    {
      question: "Vocês trabalham com quais tecnologias?",
      answer: "Trabalhamos com as tecnologias mais modernas do mercado: React, Next.js, TypeScript, Node.js, Python, PHP, WordPress, e muito mais. Escolhemos a melhor stack para cada projeto específico."
    },
    {
      question: "Qual é o investimento para um projeto?",
      answer: "Os valores variam conforme a complexidade e funcionalidades. Sites institucionais começam a partir de R$ 2.500, e-commerces a partir de R$ 5.000, e aplicações customizadas a partir de R$ 8.000. Agende uma consulta gratuita para um orçamento personalizado."
    }
  ]

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <Section className={styles.faq}>
      <Container className={styles.faq__container}>
        <div className={styles.faq__header}>
          <Typography as="h2" variant="h2" className={styles.faq__title}>
            Perguntas Frequentes
          </Typography>
          <Typography as="p" variant="body1" className={styles.faq__subtitle}>
            Tire suas dúvidas sobre nossos serviços e processos
          </Typography>
        </div>

        <div className={styles.faq__list}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faq__item}>
              <button
                className={styles.faq__question}
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
              >
                <Typography as="span" variant="body1" className={styles.faq__questionText}>
                  {faq.question}
                </Typography>
                <span 
                  className={`${styles.faq__icon} ${activeIndex === index ? styles.faq__iconActive : ''}`}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <div 
                className={`${styles.faq__answer} ${activeIndex === index ? styles.faq__answerActive : ''}`}
              >
                <Typography as="p" variant="body2" className={styles.faq__answerText}>
                  {faq.answer}
                </Typography>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.faq__cta}>
          <Typography as="p" variant="body1" className={styles.faq__ctaText}>
            Ainda tem dúvidas? Entre em contato conosco!
          </Typography>
        </div>
      </Container>
    </Section>
  )
}

export default FAQSection
