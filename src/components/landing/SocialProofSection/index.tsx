import React from 'react'
import { Container, Section, Typography } from '@components/common'
import styles from './styles.module.css'

const SocialProofSection: React.FC = () => {
  const testimonials = [
    {
      text: "O trabalho foi excepcional! Nosso site teve um aumento de 300% nas conversões em apenas 3 meses. Recomendo fortemente!",
      author: "Maria Silva",
      role: "CEO, TechStart",
      avatar: "👩‍💼"
    },
    {
      text: "Profissionalismo e qualidade técnica impressionantes. Entregaram exatamente o que prometeram, no prazo e dentro do orçamento.",
      author: "João Santos",
      role: "Diretor, InovaçãoCorp",
      avatar: "👨‍💻"
    },
    {
      text: "Suporte técnico 24/7 e atualizações constantes. É raro encontrar uma equipe tão dedicada e competente no mercado.",
      author: "Ana Costa",
      role: "CTO, DigitalFlow",
      avatar: "👩‍🔬"
    }
  ]

  const stats = [
    { number: "50+", label: "Projetos Entregues" },
    { number: "100%", label: "Clientes Satisfeitos" },
    { number: "300%", label: "Aumento Médio em Conversões" },
    { number: "24/7", label: "Suporte Técnico" }
  ]

  return (
    <Section className={styles.socialProof}>
      <Container className={styles.socialProof__container}>
        <div className={styles.socialProof__header}>
          <Typography as="h2" variant="h2" className={styles.socialProof__title}>
            O Que Nossos Clientes Dizem
          </Typography>
          <Typography as="p" variant="body1" className={styles.socialProof__subtitle}>
            Resultados reais de projetos reais
          </Typography>
        </div>

        <div className={styles.socialProof__stats}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.socialProof__stat}>
              <Typography as="span" variant="h2" className={styles.socialProof__statNumber}>
                {stat.number}
              </Typography>
              <Typography as="span" variant="body2" className={styles.socialProof__statLabel}>
                {stat.label}
              </Typography>
            </div>
          ))}
        </div>

        <div className={styles.socialProof__testimonials}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.socialProof__testimonial}>
              <div className={styles.socialProof__testimonialContent}>
                <Typography as="p" variant="body1" className={styles.socialProof__testimonialText}>
                  "{testimonial.text}"
                </Typography>
                <div className={styles.socialProof__testimonialAuthor}>
                  <div className={styles.socialProof__avatar}>
                    {testimonial.avatar}
                  </div>
                  <div className={styles.socialProof__authorInfo}>
                    <Typography as="span" variant="body2" className={styles.socialProof__authorName}>
                      {testimonial.author}
                    </Typography>
                    <Typography as="span" variant="caption" className={styles.socialProof__authorRole}>
                      {testimonial.role}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.socialProof__clients}>
          <Typography as="p" variant="body2" className={styles.socialProof__clientsTitle}>
            Confiam em nós:
          </Typography>
          <div className={styles.socialProof__clientLogos}>
            <div className={styles.socialProof__clientLogo}>TechStart</div>
            <div className={styles.socialProof__clientLogo}>InovaçãoCorp</div>
            <div className={styles.socialProof__clientLogo}>DigitalFlow</div>
            <div className={styles.socialProof__clientLogo}>WebSolutions</div>
            <div className={styles.socialProof__clientLogo}>CloudTech</div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default SocialProofSection
