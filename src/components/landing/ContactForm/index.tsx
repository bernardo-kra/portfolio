import { useState, type FormEvent } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { profile } from '@src/config/profile'
import CopyEmailButton from '@components/common/CopyEmailButton'
import shared from '../shared.module.css'
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
    <section
      className={`${shared.section} ${styles.contact}`}
      id="contact-form"
      aria-labelledby="contact-title"
    >
      <div className={shared.inner}>
        <p className={shared.eyebrow} data-index="(06)">
          Contato
        </p>
        <h2 id="contact-title" className={styles.contact__title}>
          Vamos conversar sobre a próxima{' '}
          <span className={shared.serif}>oportunidade</span>?
        </h2>

        <div className={styles.contact__grid}>
          <div className={styles.contact__aside}>
            <p className={shared.lede}>
              Conte o contexto da vaga ou do projeto. Sem cadastro e sem etapas
              desnecessárias.
            </p>
            <ul className={styles.contact__direct}>
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className={shared.focusRing}
                >
                  {profile.email}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={shared.focusRing}
                >
                  Prefiro conversar pelo LinkedIn
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </li>
            </ul>
            <div className={styles.contact__copy}>
              <CopyEmailButton language="pt" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.contact__form}>
            <div className={styles.contact__row}>
              <div className={styles.contact__field}>
                <label htmlFor="contact-name">Seu nome *</label>
                <input
                  id="contact-name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              <div className={styles.contact__field}>
                <label htmlFor="contact-email">Email para resposta *</label>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={200}
                />
              </div>
            </div>
            <div className={styles.contact__field}>
              <label htmlFor="contact-message">Sobre a oportunidade *</label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={10}
                maxLength={2000}
                rows={4}
                placeholder="Empresa, contexto e como posso contribuir..."
              />
            </div>

            <div className={styles.contact__submitRow}>
              <p id="contact-note" className={styles.contact__note}>
                Ao continuar, seu aplicativo de email será aberto com um
                rascunho. O envio é confirmado por você no aplicativo.
              </p>
              <button
                type="submit"
                className={`${styles.contact__submit} ${shared.focusRing}`}
                aria-describedby="contact-note"
              >
                Preparar email
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
            <p role="status" className={styles.contact__status}>
              {prepared
                ? 'Rascunho preparado. Revise e envie no seu aplicativo de email. Se ele não abriu, use o endereço ou o LinkedIn ao lado. Seus textos continuam neste formulário.'
                : ''}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ContactForm
