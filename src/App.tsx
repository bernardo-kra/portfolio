import { useNavigate } from 'react-router-dom'
import { Typography, Section, Container } from '@components/common'
import reactLogo from '@assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const navigate = useNavigate()

  return (
    <div className="app">
      <Section variant="hero" className="appHeader">
        <Container className="logoContainer">
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer" className="logoLink">
            <img src={viteLogo} className="logo vite" alt="Vite logo" />
          </a>
          <Typography as="span" variant="h1" className="logoPlus">+</Typography>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="logoLink">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </Container>
        <Typography variant="h1" className="appTitle">
          Portfolio Developer
        </Typography>
        <Typography variant="body1" color="muted" className="appSubtitle">
          Desenvolvido com Vite + React + TypeScript
        </Typography>
      </Section>

      <main className="appMain">
        <Container className="mainContent">
          <Section spacing="lg" className="navigationSection">
            <Typography variant="h2" align="center" className="navigationTitle">
              Bem-vindo ao meu Portfolio
            </Typography>
            <Typography variant="body1" color="muted" align="center" className="navigationSubtitle">
              Explore as diferentes seções do meu trabalho
            </Typography>
            
            <Container className="navigationCards">
              <div className="navCard primary" onClick={() => navigate('/portfolio')}>
                <div className="navCardIcon">📁</div>
                <Typography variant="h3" className="navCardTitle">
                  Ver Portfólio
                </Typography>
                <Typography variant="body2" color="muted" className="navCardDescription">
                  Conheça meus projetos, habilidades e experiência profissional
                </Typography>
              </div>
              
              <div className="navCard secondary" onClick={() => navigate('/pomodoro')}>
                <div className="navCardIcon">⏱️</div>
                <Typography variant="h3" className="navCardTitle">
                  Pomodoro Timer
                </Typography>
                <Typography variant="body2" color="muted" className="navCardDescription">
                  Ferramenta de produtividade para gerenciar seu tempo
                </Typography>
              </div>

              <div className="navCard tertiary" onClick={() => navigate('/generative')}>
                <div className="navCardIcon">🎨</div>
                <Typography variant="h3" className="navCardTitle">
                  Generative Art
                </Typography>
                <Typography variant="body2" color="muted" className="navCardDescription">
                  Crie padrões únicos com algoritmos procedurais e matemática
                </Typography>
              </div>
            </Container>
          </Section>
        </Container>
      </main>

      <Section variant="footer" className="appFooter">
        <Typography variant="caption" color="muted" align="center">
          Clique nos logos do Vite e React para saber mais
        </Typography>
      </Section>
    </div>
  )
}

export default App
