import { useState, type FormEvent } from 'react'
import { Container, Section } from '@components/common'
import { profile } from '@src/config/profile'
import CopyEmailButton from '@components/common/CopyEmailButton'
import styles from './styles.module.css'

const ContactForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [prepared, setPrepared] = useState(false)
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const subject = encodeURIComponent(
      `Contato pelo portfólio — ${name.trim()}`
    )
    const body = encodeURIComponent(
      `Nome: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`
    )
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setPrepared(true)
  }
  return (
    <Section className={styles.contact} id="contact-form">
      <Container className={styles.contact__container}>
        <div className={styles.contact__header}>
          <h2 className={styles.contact__title}>
            Vamos conversar sobre a próxima oportunidade?
          </h2>
          <p className={styles.contact__subtitle}>
            Conte o contexto da vaga ou do projeto. Sem cadastro e sem etapas
            desnecessárias.
          </p>
        </div>
        <div className={styles.contact__formWrapper}>
          <form onSubmit={handleSubmit} className={styles.contact__form}>
            <p id="contact-note">
              Ao continuar, seu aplicativo de email será aberto com um rascunho.
              O envio é confirmado por você no aplicativo.
            </p>
            <div className={styles.contact__formGrid}>
              <div className={styles.contact__formGroup}>
                <label htmlFor="contact-name" className={styles.contact__label}>
                  Seu nome *
                </label>
                <input
                  id="contact-name"
                  className={styles.contact__input}
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              <div className={styles.contact__formGroup}>
                <label
                  htmlFor="contact-email"
                  className={styles.contact__label}
                >
                  Email para resposta *
                </label>
                <input
                  id="contact-email"
                  className={styles.contact__input}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={200}
                />
              </div>
            </div>
            <div className={styles.contact__formGroup}>
              <label
                htmlFor="contact-message"
                className={styles.contact__label}
              >
                Sobre a oportunidade *
              </label>
              <textarea
                id="contact-message"
                className={styles.contact__textarea}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={10}
                maxLength={2000}
                rows={5}
                placeholder="Empresa, contexto e como posso contribuir..."
              />
            </div>
            <button
              type="submit"
              className={styles.contact__submitButton}
              aria-describedby="contact-note"
            >
              Preparar email →
            </button>
            <p role="status">
              {prepared
                ? 'Rascunho preparado. Revise e envie no seu aplicativo de email. Se ele não abriu, use o endereço ou o LinkedIn abaixo. Seus textos continuam neste formulário.'
                : ''}
            </p>
            <div className={styles.directLinks}>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                Prefiro conversar pelo LinkedIn ↗
              </a>
            </div>
            <CopyEmailButton language="pt" />
          </form>
        </div>
      </Container>
    </Section>
  )
}
export default ContactForm
