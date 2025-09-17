import './components/theme/background-transparency.css'
import './components/theme/no-text-selection.css'
import './components/theme/animations.css'
import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from '@src/App'
import Container from '@components/common/Container'
import Pomodoro from '@pages/Pomodoro'
import Portfolio from '@pages/Portfolio'
import GenerativeArt from '@pages/GenerativeArt'
import LandingPage from '@pages/LandingPage'
import AdminChat from '@pages/AdminChat'
import { ThemeProvider } from '@theme/ThemeContext'
import { BackgroundTransparencyProvider } from '@theme/BackgroundTransparencyContext'
import { AppConfigProvider } from '@context'

import TransitionThemeEffect from '@theme/TransitionThemeEffect'
import { I18nProvider } from '@src/i18n'
import Analytics from '@components/Analytics'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppConfigProvider>
      <ThemeProvider>
        <BackgroundTransparencyProvider>
          <TransitionThemeEffect />
          <I18nProvider>
            <BrowserRouter basename="/portfolio">
              <Analytics />
              <Routes> 
                <Route path="/" element={<App />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/custom" element={<Container>Conteúdo customizado!</Container>} />
                <Route path="/pomodoro" element={<Pomodoro />} />
                <Route path="/generative" element={<GenerativeArt />} />
                <Route path="/admin/chat" element={<AdminChat />} />
              </Routes>
            </BrowserRouter>
          </I18nProvider>
        </BackgroundTransparencyProvider>
      </ThemeProvider>
    </AppConfigProvider>
  </StrictMode>,
)
