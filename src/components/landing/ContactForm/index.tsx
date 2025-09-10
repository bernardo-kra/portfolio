import React, { useState } from 'react'
import { Container, Section, Typography, Button, Input } from '@components/common'
import styles from './styles.module.css'

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    budget: '',
    timeline: '',
    acceptTerms: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simular envio do formulário
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aqui você integraria com seu serviço de e-mail (Mailchimp, Sendinblue, etc.)
      console.log('Dados do formulário:', formData)
      
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        budget: '',
        timeline: '',
        acceptTerms: false
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Section className={styles.contact} id="contact-form">
      <Container className={styles.contact__container}>
        <div className={styles.contact__header}>
          <Typography as="h2" variant="h2" className={styles.contact__title}>
            Pronto para Transformar Sua Ideia?
          </Typography>
          <Typography as="p" variant="body1" className={styles.contact__subtitle}>
            Preencha o formulário abaixo e receba uma proposta personalizada em até 24 horas
          </Typography>
        </div>

        <div className={styles.contact__formWrapper}>
          <form onSubmit={handleSubmit} className={styles.contact__form}>
            <div className={styles.contact__formGrid}>
              <div className={styles.contact__formGroup}>
                <label htmlFor="name" className={styles.contact__label}>
                  Nome Completo *
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={styles.contact__input}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className={styles.contact__formGroup}>
                <label htmlFor="email" className={styles.contact__label}>
                  E-mail *
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={styles.contact__input}
                  placeholder="seu@email.com"
                />
              </div>

              <div className={styles.contact__formGroup}>
                <label htmlFor="phone" className={styles.contact__label}>
                  Telefone
                </label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.contact__input}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className={styles.contact__formGroup}>
                <label htmlFor="company" className={styles.contact__label}>
                  Empresa
                </label>
                <Input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className={styles.contact__input}
                  placeholder="Nome da sua empresa"
                />
              </div>

              <div className={styles.contact__formGroup}>
                <label htmlFor="budget" className={styles.contact__label}>
                  Orçamento Aproximado
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className={styles.contact__select}
                >
                  <option value="">Selecione uma faixa</option>
                  <option value="2-5k">R$ 2.000 - R$ 5.000</option>
                  <option value="5-10k">R$ 5.000 - R$ 10.000</option>
                  <option value="10-20k">R$ 10.000 - R$ 20.000</option>
                  <option value="20k+">Acima de R$ 20.000</option>
                </select>
              </div>

              <div className={styles.contact__formGroup}>
                <label htmlFor="timeline" className={styles.contact__label}>
                  Prazo Desejado
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className={styles.contact__select}
                >
                  <option value="">Selecione um prazo</option>
                  <option value="1-month">1 mês</option>
                  <option value="2-3-months">2-3 meses</option>
                  <option value="3-6-months">3-6 meses</option>
                  <option value="6-months+">Mais de 6 meses</option>
                </select>
              </div>
            </div>

            <div className={styles.contact__formGroup}>
              <label htmlFor="message" className={styles.contact__label}>
                Descreva seu projeto *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                className={styles.contact__textarea}
                placeholder="Conte-nos sobre sua ideia, objetivos e funcionalidades desejadas..."
                rows={5}
              />
            </div>

            <div className={styles.contact__checkbox}>
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                required
                className={styles.contact__checkboxInput}
              />
              <label htmlFor="acceptTerms" className={styles.contact__checkboxLabel}>
                Aceito receber comunicações sobre o projeto e concordo com a{' '}
                <a href="#privacy" className={styles.contact__link}>
                  Política de Privacidade
                </a>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className={styles.contact__submitButton}
            >
              {isSubmitting ? 'Enviando...' : 'Solicitar Proposta Gratuita'}
            </Button>

            {submitStatus === 'success' && (
              <div className={styles.contact__messageSuccess}>
                ✅ Obrigado! Recebemos sua mensagem e entraremos em contato em até 24 horas.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className={styles.contact__messageError}>
                ❌ Ops! Ocorreu um erro ao enviar sua mensagem. Tente novamente ou entre em contato diretamente.
              </div>
            )}
          </form>
        </div>
      </Container>
    </Section>
  )
}

export default ContactForm
