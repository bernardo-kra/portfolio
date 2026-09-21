import { Link } from 'react-router-dom'
import { Container, Section, Typography } from '@components/common'
import { profile } from '@src/config/profile'
import styles from './styles.module.css'
const SocialProofSection = () => (
  <Section className={styles.socialProof}>
    <Container className={styles.socialProof__container}>
      <div className={styles.socialProof__header}>
        <Typography as="h2" variant="h2" className={styles.socialProof__title}>
          Conheça o trabalho por trás da interface.
        </Typography>
        <p className={styles.socialProof__subtitle}>
          Trajetória, experimentos e código que você pode explorar.
        </p>
      </div>
      <div className={styles.socialProof__testimonials}>
        <article className={styles.socialProof__testimonial}>
          <h3>Experiência profissional</h3>
          <p>
            Desenvolvimento frontend, e-commerce e qualidade de software.
            Conheça os contextos em que trabalhei.
          </p>
          <Link to="/portfolio#experiencia">Ver trajetória →</Link>
        </article>
        <article className={styles.socialProof__testimonial}>
          <h3>Aprendizado em prática</h3>
          <p>
            Timer, canvas generativo e interfaces experimentais. Abra os estudos
            e teste as interações.
          </p>
          <Link to="/#estudos">Explorar estudos →</Link>
        </article>
        <article className={styles.socialProof__testimonial}>
          <h3>Implementação aberta</h3>
          <p>
            Veja os componentes, a organização do projeto e as decisões de
            implementação no repositório.
          </p>
          <a
            href={profile.github + '/portfolio'}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar código ↗
          </a>
        </article>
      </div>
    </Container>
  </Section>
)
export default SocialProofSection
