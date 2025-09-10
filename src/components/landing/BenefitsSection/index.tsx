import React from 'react'
import { Container, Section, Typography } from '@components/common'
import styles from './styles.module.css'

const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: '⚡',
      title: 'Performance Otimizada',
      description: 'Sites carregam em menos de 3 segundos com otimizações avançadas de performance e SEO.'
    },
    {
      icon: '📱',
      title: 'Design Responsivo',
      description: 'Interface perfeita em todos os dispositivos, do mobile ao desktop, garantindo a melhor experiência.'
    },
    {
      icon: '🔒',
      title: 'Segurança Avançada',
      description: 'Implementamos as melhores práticas de segurança para proteger seus dados e usuários.'
    },
    {
      icon: '🚀',
      title: 'Deploy Automático',
      description: 'Sistema de deploy contínuo que garante atualizações rápidas e sem downtime.'
    },
    {
      icon: '📊',
      title: 'Analytics Integrado',
      description: 'Métricas detalhadas para acompanhar o desempenho e otimizar conversões.'
    },
    {
      icon: '🛠️',
      title: 'Manutenção Contínua',
      description: 'Suporte técnico 24/7 e atualizações regulares para manter tudo funcionando perfeitamente.'
    }
  ]

  return (
    <Section className={styles.benefits}>
      <Container className={styles.benefits__container}>
        <div className={styles.benefits__header}>
          <Typography as="h2" variant="h2" className={styles.benefits__title}>
            Por Que Escolher Nossos Serviços?
          </Typography>
          <Typography as="p" variant="body1" className={styles.benefits__subtitle}>
            Oferecemos soluções completas que combinam tecnologia de ponta com design excepcional
          </Typography>
        </div>

        <div className={styles.benefits__grid}>
          {benefits.map((benefit, index) => (
            <div key={index} className={styles.benefits__card}>
              <div className={styles.benefits__icon}>
                {benefit.icon}
              </div>
              <Typography as="h3" variant="h3" className={styles.benefits__cardTitle}>
                {benefit.title}
              </Typography>
              <Typography as="p" variant="body2" className={styles.benefits__cardDescription}>
                {benefit.description}
              </Typography>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export default BenefitsSection
