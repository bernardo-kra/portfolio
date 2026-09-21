import { Container, Section, Typography } from '@components/common'
import styles from './styles.module.css'
const benefits = [
  {
    icon: '01',
    title: 'Mensagem com foco',
    description:
      'Título, contexto e ação principal organizados para facilitar a leitura.',
  },
  {
    icon: '02',
    title: 'Espaço para o conteúdo',
    description:
      'Hierarquia visual e espaçamento que ajudam a comparar informações.',
  },
  {
    icon: '03',
    title: 'Navegação compreensível',
    description:
      'Links com destinos claros e ações que podem ser alcançadas pelo teclado.',
  },
  {
    icon: '04',
    title: 'Componentes reutilizáveis',
    description:
      'React, TypeScript e CSS Modules para evoluir a interface com consistência.',
  },
  {
    icon: '05',
    title: 'Contato sem cadastro',
    description: 'Currículo, LinkedIn e email disponíveis sem criar uma conta.',
  },
  {
    icon: '06',
    title: 'Código para explorar',
    description:
      'Um projeto aberto a estudo: você pode conferir a implementação no GitHub.',
  },
]
const BenefitsSection = () => (
  <Section className={styles.benefits}>
    <Container className={styles.benefits__container}>
      <div className={styles.benefits__header}>
        <Typography as="h2" variant="h2" className={styles.benefits__title}>
          O cuidado está nos detalhes.
        </Typography>
        <p className={styles.benefits__subtitle}>
          As escolhas por trás desta experiência.
        </p>
      </div>
      <div className={styles.benefits__grid}>
        {benefits.map((item) => (
          <article key={item.title} className={styles.benefits__card}>
            <span className={styles.benefits__icon}>{item.icon}</span>
            <h3 className={styles.benefits__cardTitle}>{item.title}</h3>
            <p className={styles.benefits__cardDescription}>
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </Container>
  </Section>
)
export default BenefitsSection
