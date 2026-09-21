import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  PenTool,
  Monitor,
  Search,
  Layers,
  Check,
  MoveUpRight,
} from 'lucide-react'
import { profile } from '@src/config/profile'
import CopyEmailButton from '@components/common/CopyEmailButton'
import styles from './styles.module.css'

const works = [
  {
    id: 'verde',
    name: 'Verde, por natureza.',
    category: 'Identidade',
    type: 'plant',
    label: 'VERDE / BRAND CONCEPT',
    text: 'Uma identidade botânica com espaço para respirar. O estudo combina fotografia de produto, tons naturais e tipografia de alto contraste.',
    alt: 'Planta verde em um vaso branco sobre fundo claro',
  },
  {
    id: 'forma',
    name: 'Menos ruído. Mais forma.',
    category: 'Identidade',
    type: 'brand',
    label: 'FORMA / VISUAL SYSTEM',
    text: 'Um sistema visual construído com tipografia, círculos e uma paleta curta. A proposta é manter a marca reconhecível sem depender de efeitos pesados.',
    alt: '',
  },
  {
    id: 'studio',
    name: 'Um espaço para criar.',
    category: 'Digital',
    type: 'team',
    label: 'STUDIO / EDITORIAL',
    text: 'Uma direção editorial para um estúdio criativo. Fotografias amplas, títulos diretos e leitura em camadas aproximam pessoas e conteúdo.',
    alt: 'Pessoas colaborando em uma mesa com notebooks',
  },
  {
    id: 'flow',
    name: 'Seu próximo passo, claro.',
    category: 'Digital',
    type: 'interface',
    label: 'FLOW / WEB CONCEPT',
    text: 'Um exercício de hierarquia para uma interface digital. A ação principal fica em evidência e a informação secundária aparece no ritmo da leitura.',
    alt: '',
  },
]
type Work = (typeof works)[number]

const AgencyStudio = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState('Todos')
  const [selected, setSelected] = useState<Work | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const workTriggerRef = useRef<HTMLButtonElement | null>(null)
  const visibleWorks = works.filter(
    (work) => filter === 'Todos' || work.category === filter
  )

  useEffect(() => {
    if (selected && !dialogRef.current?.open) dialogRef.current?.showModal()
  }, [selected])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeWork = () => {
    setSelected(null)
    workTriggerRef.current?.focus()
  }

  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#forma-content">
        Pular para o conteúdo
      </a>
      <div className={styles.labBar}>
        <Link to="/#estudos">
          <ArrowLeft size={14} aria-hidden="true" /> Laboratório de estudos
        </Link>
        <span>Estudo 06 — agência criativa</span>
      </div>
      <main id="forma-content">
        <div className={styles.heroWrap} id="inicio">
          <header className={styles.header}>
            <a
              className={styles.logo}
              href="#inicio"
              aria-label="Forma, início"
            >
              f<span>o</span>rma<span className={styles.logoDot}>.</span>
            </a>
            <button
              ref={menuButtonRef}
              className={styles.menuButton}
              aria-expanded={menuOpen}
              aria-controls="forma-nav"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {menuOpen ? (
                <X aria-hidden="true" />
              ) : (
                <Menu aria-hidden="true" />
              )}
            </button>
            <nav
              id="forma-nav"
              className={styles.nav}
              data-open={menuOpen}
              aria-label="Navegação do estúdio"
              onClick={() => setMenuOpen(false)}
            >
              <a href="#servicos">O que fazemos</a>
              <a href="#estudio">O estúdio</a>
              <a href="#trabalhos">Trabalhos</a>
              <a href="#notas">Notas</a>
              <a href="#conversa" className={styles.navContact}>
                Vamos conversar <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </nav>
          </header>
          <section className={styles.hero} aria-labelledby="forma-title">
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span className={styles.statusDot} /> IDEIAS BOAS MERECEM GANHAR
                FORMA
              </p>
              <h1 id="forma-title">
                Criatividade que
                <br />
                faz <span>sentido.</span>
              </h1>
              <p className={styles.lead}>
                Estratégia, design e experiências digitais.
                <br />
                Uma nova perspectiva para marcas que querem sair do lugar.
              </p>
              <a className={styles.primary} href="#trabalhos">
                Explore os trabalhos{' '}
                <ArrowUpRight size={19} aria-hidden="true" />
              </a>
              <div className={styles.heroNote}>
                <span aria-hidden="true">✳</span>
                <p>
                  Do primeiro rabisco
                  <br />
                  <strong>à próxima grande ideia.</strong>
                </p>
              </div>
            </div>
            <div className={styles.heroArt}>
              <div className={styles.orbit} aria-hidden="true" />
              <img
                src="/images/forma/studio.webp"
                width="960"
                height="640"
                fetchPriority="high"
                alt="Profissional em um ambiente criativo com um notebook"
              />
              <div className={styles.artStamp} aria-hidden="true">
                <span>design com</span>
                <strong>propósito.</strong>
                <ArrowUpRight size={26} />
              </div>
              <span className={styles.spark} aria-hidden="true">
                ✳
              </span>
            </div>
          </section>
          <div className={styles.heroBottom}>
            <span>ESTRATÉGIA + DESIGN + TECNOLOGIA</span>
            <a href="#servicos">Desça para descobrir ↓</a>
          </div>
        </div>

        <section
          className={styles.section}
          id="servicos"
          aria-labelledby="services-title"
        >
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>O QUE FAZEMOS</p>
            <h2 id="services-title">
              Boas ideias.
              <br />
              Melhores experiências.
            </h2>
            <p>Do conceito à interação, cada detalhe tem um porquê.</p>
          </div>
          <div className={styles.serviceGrid}>
            <article className={styles.serviceCard}>
              <span className={styles.number}>01 /</span>
              <PenTool size={35} strokeWidth={1.4} aria-hidden="true" />
              <h3>
                Identidade que
                <br />
                não passa despercebida.
              </h3>
              <p>
                Uma linguagem visual coerente para transformar personalidade em
                reconhecimento.
              </p>
              <a href="#trabalhos" onClick={() => setFilter('Identidade')}>
                Explorar identidade <ArrowRight size={18} aria-hidden="true" />
              </a>
            </article>
            <article className={styles.serviceCard}>
              <span className={styles.number}>02 /</span>
              <Monitor size={35} strokeWidth={1.4} aria-hidden="true" />
              <h3>
                Digital que funciona.
                <br />E dá gosto de usar.
              </h3>
              <p>
                Interfaces que conectam conteúdo, intenção e uma navegação sem
                complicação.
              </p>
              <a href="#trabalhos" onClick={() => setFilter('Digital')}>
                Explorar digital <ArrowRight size={18} aria-hidden="true" />
              </a>
            </article>
          </div>
          <div className={styles.principles}>
            {[
              {
                Icon: Search,
                title: 'Entender primeiro',
                text: 'Perguntas certas antes das primeiras respostas.',
              },
              {
                Icon: Layers,
                title: 'Conectar as peças',
                text: 'Estratégia e estética falando a mesma língua.',
              },
              {
                Icon: MoveUpRight,
                title: 'Evoluir sempre',
                text: 'Testar, aprender e refinar a experiência.',
              },
            ].map(({ Icon, title, text }) => (
              <div key={title}>
                <Icon size={31} strokeWidth={1.5} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className={styles.workSection}
          id="trabalhos"
          aria-labelledby="work-title"
        >
          <div className={styles.section}>
            <div className={styles.workHeading}>
              <div>
                <p className={styles.eyebrow}>UM POUCO DO UNIVERSO FORMA</p>
                <h2 id="work-title">Ideias em movimento.</h2>
              </div>
              <p>
                Explorações visuais e marcas conceituais.
                <br />
                Nada de clientes ou resultados inventados.
              </p>
            </div>
            <div
              className={styles.filters}
              role="group"
              aria-label="Filtrar estudos visuais"
            >
              {['Todos', 'Identidade', 'Digital'].map((category) => (
                <button
                  key={category}
                  aria-pressed={filter === category}
                  onClick={() => setFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <p className={styles.srOnly} role="status">
              {visibleWorks.length} estudos exibidos
            </p>
            <div className={styles.workGrid}>
              {visibleWorks.map((work) => (
                <button
                  className={styles.workCard}
                  key={work.id}
                  onClick={(event) => {
                    workTriggerRef.current = event.currentTarget
                    setSelected(work)
                  }}
                  aria-haspopup="dialog"
                >
                  <div className={styles.workVisual} data-kind={work.type}>
                    {work.type === 'plant' || work.type === 'team' ? (
                      <img
                        src={'/images/forma/' + work.type + '.webp'}
                        width={work.type === 'plant' ? 720 : 960}
                        height={work.type === 'plant' ? 480 : 640}
                        loading="lazy"
                        decoding="async"
                        alt={work.alt}
                      />
                    ) : work.type === 'brand' ? (
                      <div className={styles.brandMock} aria-hidden="true">
                        <span>f.</span>
                        <p>
                          MAKE ROOM
                          <br />
                          FOR GOOD IDEAS.
                        </p>
                      </div>
                    ) : (
                      <div className={styles.webMock} aria-hidden="true">
                        <span>
                          flow® <small>um novo ritmo.</small>
                        </span>
                        <strong>
                          Crie espaço
                          <br />
                          para o que
                          <br />
                          <em>importa.</em>
                        </strong>
                        <span className={styles.mockButton}>
                          Comece por aqui ↗
                        </span>
                      </div>
                    )}
                    <span className={styles.workArrow}>
                      <ArrowUpRight size={23} aria-hidden="true" />
                    </span>
                  </div>
                  <span className={styles.workInfo}>
                    <span>
                      <small>{work.label}</small>
                      <strong>{work.name}</strong>
                    </span>
                    <span>{work.category}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section
          className={styles.section}
          id="estudio"
          aria-labelledby="studio-title"
        >
          <div className={styles.split}>
            <div className={styles.studioPhoto}>
              <img
                src="/images/forma/team.webp"
                width="960"
                height="640"
                loading="lazy"
                decoding="async"
                alt="Grupo colaborando em uma mesa de trabalho, fotografia ilustrativa"
              />
              <span aria-hidden="true">
                juntos, as ideias
                <br />
                <strong>vão mais longe.</strong>
              </span>
            </div>
            <div className={styles.splitCopy}>
              <p className={styles.eyebrow}>SOBRE ESTE ESTÚDIO</p>
              <h2 id="studio-title">
                Feito de ideias.
                <br />
                Pensado para pessoas.
              </h2>
              <p>
                Forma é uma agência conceitual criada no meu laboratório de
                estudos. Um exercício de direção visual, desenvolvimento
                frontend e atenção à experiência.
              </p>
              <p>
                O objetivo? Transformar uma referência em uma interface de
                verdade: clara, adaptável e agradável de explorar.
              </p>
              <ul className={styles.checks}>
                <li>
                  <Check size={17} /> Layout que acompanha o tamanho da tela
                </li>
                <li>
                  <Check size={17} /> Interações com propósito
                </li>
                <li>
                  <Check size={17} /> Design leve, sem bibliotecas de animação
                </li>
              </ul>
              <Link className={styles.textLink} to="/portfolio">
                Conheça quem criou <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.callout} aria-labelledby="callout-title">
          <div>
            <p className={styles.eyebrow}>DO RASCUNHO AO DIGITAL</p>
            <h2 id="callout-title">
              Vamos dar forma
              <br />à próxima ideia?
            </h2>
            <a className={styles.primary} href="#conversa">
              Comece uma conversa <ArrowUpRight size={19} aria-hidden="true" />
            </a>
          </div>
          <span aria-hidden="true">f.</span>
        </section>

        <section
          className={styles.section}
          id="processo"
          aria-labelledby="process-title"
        >
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>UM PROCESSO, SEM MISTÉRIO</p>
            <h2 id="process-title">Intenção em cada etapa.</h2>
            <p>Uma boa interface começa bem antes do código.</p>
          </div>
          <ol className={styles.process}>
            {[
              [
                'Escutar',
                'Entender o contexto, as pessoas e o que precisa ficar mais simples.',
              ],
              [
                'Explorar',
                'Organizar referências, testar composições e encontrar uma direção.',
              ],
              [
                'Construir',
                'Conectar visual e interação com componentes reutilizáveis.',
              ],
              [
                'Refinar',
                'Revisar conteúdo, acessibilidade e comportamento entre telas.',
              ],
            ].map(([title, text], index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className={styles.notesSection}
          id="notas"
          aria-labelledby="notes-title"
        >
          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>CADERNO ABERTO</p>
              <h2 id="notes-title">Detalhes que fazem diferença.</h2>
              <p>Notas de construção deste experimento.</p>
            </div>
            <div className={styles.notesGrid}>
              <article>
                <img
                  src="/images/forma/plant.webp"
                  width="720"
                  height="480"
                  loading="lazy"
                  decoding="async"
                  alt="Composição minimalista com planta e espaço em branco"
                />
                <p className={styles.eyebrow}>DESIGN / COMPOSIÇÃO</p>
                <h3>Espaço em branco também comunica.</h3>
                <details>
                  <summary>
                    Ler a nota <ArrowRight size={17} aria-hidden="true" />
                  </summary>
                  <p>
                    Respiro visual ajuda a separar assuntos e deixa as decisões
                    mais claras. Neste layout, títulos, imagens e ações têm
                    ritmos diferentes, sem disputar atenção o tempo todo.
                  </p>
                </details>
              </article>
              <article>
                <img
                  src="/images/forma/team.webp"
                  width="960"
                  height="640"
                  loading="lazy"
                  decoding="async"
                  alt="Mesa com pessoas trabalhando e trocando ideias"
                />
                <p className={styles.eyebrow}>FRONTEND / EXPERIÊNCIA</p>
                <h3>O layout muda. A intenção continua.</h3>
                <details>
                  <summary>
                    Ler a nota <ArrowRight size={17} aria-hidden="true" />
                  </summary>
                  <p>
                    No celular, as colunas viram uma sequência de leitura.
                    Menus, filtros e botões continuam acessíveis pelo toque e
                    pelo teclado. As imagens têm dimensões reservadas para
                    evitar saltos durante o carregamento.
                  </p>
                </details>
              </article>
            </div>
          </div>
        </section>

        <section
          className={styles.contact}
          id="conversa"
          aria-labelledby="contact-title"
        >
          <div>
            <p className={styles.eyebrow}>GOSTOU DO QUE VIU?</p>
            <h2 id="contact-title">
              A próxima conversa
              <br />
              pode começar aqui.
            </h2>
            <p>
              Este é um estudo de Bernardo Kraczkowski.
              <br />
              Para falar sobre oportunidades, use um dos canais abaixo.
            </p>
            <div className={styles.contactActions}>
              <a
                className={styles.primary}
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                Conversar no LinkedIn{' '}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a className={styles.textLink} href={'mailto:' + profile.email}>
                Prefiro email <ArrowRight size={18} aria-hidden="true" />
              </a>
              <CopyEmailButton language="pt" />
            </div>
          </div>
          <span className={styles.contactMark} aria-hidden="true">
            ✳
          </span>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div>
            <a href="#inicio" className={styles.logo}>
              forma.
            </a>
            <p>
              Um novo olhar.
              <br />
              Um estudo de cada vez.
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            <Link to="/#estudos">Laboratório de estudos</Link>
            <Link to="/portfolio">Portfólio do autor</Link>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
          </div>
          <div>
            <h3>Sobre o projeto</h3>
            <p>React · TypeScript · CSS Modules</p>
            <p>
              Marca e trabalhos conceituais.
              <br />
              Fotografias ilustrativas do Unsplash.
            </p>
            <a href="/images/forma/CREDITS.md">Créditos das fotografias ↗</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>Forma — um experimento de design & código.</span>
          <a href="#inicio">Voltar ao topo ↑</a>
        </div>
      </footer>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="forma-work-title"
        onClose={closeWork}
      >
        <form method="dialog">
          <button aria-label="Fechar detalhes do estudo">
            <X size={22} aria-hidden="true" />
          </button>
        </form>
        {selected && (
          <>
            <p className={styles.eyebrow}>{selected.label}</p>
            <h2 id="forma-work-title">{selected.name}</h2>
            <p>{selected.text}</p>
            <p className={styles.dialogNote}>
              Conceito visual criado para este estudo. Não representa um
              cliente, serviço contratado ou resultado comercial.
            </p>
            <a
              className={styles.textLink}
              href={profile.github + '/portfolio'}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explorar o código <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </>
        )}
      </dialog>
    </div>
  )
}
export default AgencyStudio
