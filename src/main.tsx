import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from '@src/App'
import Container from '@components/common/Container'
import Pomodoro from '@pages/Pomodoro'
import Portfolio from '@pages/Portfolio'
import { ThemeProvider } from '@theme/ThemeContext'
import TransitionThemeEffect from '@theme/TransitionThemeEffect'
import { I18nProvider } from '@src/i18n'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <TransitionThemeEffect />
    <I18nProvider>
      <StrictMode>
        <BrowserRouter basename="/portfolio">
          <Routes> 
            <Route path="/" element={<App />} />
            <Route path="/custom" element={<Container>Conteúdo customizado!</Container>} />
            <Route path="/pomodoro" element={<Pomodoro />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </BrowserRouter>
      </StrictMode>
    </I18nProvider>
  </ThemeProvider>,
)
