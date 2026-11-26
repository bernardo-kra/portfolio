import shared from '../shared.module.css'
import Reveal from '../Reveal'
import styles from './styles.module.css'

const benefits = [
  {
    title: 'Mensagem com foco',
    description:
      'Título, contexto e ação principal organizados para facilitar a leitura.',
  },
  {
    title: 'Espaço para o conteúdo',
    description:
      'Hierarquia visual e espaçamento que ajudam a comparar informações.',
  },
  {
    title: 'Navegação compreensível',
    description:
      'Links com destinos claros e ações que podem ser alcançadas pelo teclado.',
  },
  {
    title: 'Componentes reutilizáveis',
    description:
      'React, TypeScript e CSS Modules para evoluir a interface com consistência.',
  },
  {
    title: 'Contato sem cadastro',
    description: 'Currículo, LinkedIn e email disponíveis sem criar uma conta.',
  },
  {
    title: 'Código para explorar',
    description:
      'Um projeto aberto a estudo: você pode conferir a implementação no GitHub.',
  },
]

const BenefitsSection = () => (
  <section className={shared.section} aria-labelledby="benefits-title">
    <div className={shared.inner}>
      <header className={shared.head}>
        <p className={shared.eyebrow} data-index="(03)">
          Princípios
        </p>
        <div className={styles.benefits__intro}>
          <h2 id="benefits-title" className={shared.title}>
            O cuidado está nos <span className={shared.serif}>detalhes</span>.
          </h2>
          <p className={shared.lede}>As escolhas por trás desta experiência.</p>
        </div>
      </header>

      <ol className={styles.benefits__list}>
        {benefits.map((item, index) => (
          <li key={item.title}>
            <Reveal className={styles.benefits__row}>
              <span className={styles.benefits__index} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.benefits__title}>{item.title}</h3>
              <p className={styles.benefits__text}>{item.description}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  </section>
)

export default BenefitsSection
