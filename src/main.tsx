import { lazy, StrictMode, Suspense } from 'react'
import './components/theme/background-transparency.css'
import './components/theme/no-text-selection.css'
import './components/theme/animations.css'
import './index.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from '@src/App'
import Container from '@components/common/Container'
import { ThemeProvider } from '@theme/ThemeContext'
import { BackgroundTransparencyProvider } from '@theme/BackgroundTransparencyContext'
import { AppConfigProvider } from '@context'

import TransitionThemeEffect from '@theme/TransitionThemeEffect'
import { I18nProvider } from '@src/i18n'
import Analytics from '@components/Analytics'

const Portfolio = lazy(() => import('@pages/Portfolio'))
const LandingPage = lazy(() => import('@pages/LandingPage'))
const Pomodoro = lazy(() => import('@pages/Pomodoro'))
const GenerativeArt = lazy(() => import('@pages/GenerativeArt'))
const Experimental3D = lazy(() => import('@pages/Experimental3D'))
const AdminChat = lazy(() => import('@pages/AdminChat'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppConfigProvider>
      <ThemeProvider>
        <BackgroundTransparencyProvider>
          <TransitionThemeEffect />
          <I18nProvider>
            <BrowserRouter>
              <Analytics />
              <Suspense fallback={null}>
                <Routes>
                  <Route path="/" element={<App />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/landing" element={<LandingPage />} />
                  <Route
                    path="/custom"
                    element={<Container>Conteúdo customizado!</Container>}
                  />
                  <Route path="/pomodoro" element={<Pomodoro />} />
                  <Route path="/generative" element={<GenerativeArt />} />
                  <Route path="/experimental3d" element={<Experimental3D />} />
                  <Route path="/admin/chat" element={<AdminChat />} />
                  <Route path="*" element={<App />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </I18nProvider>
        </BackgroundTransparencyProvider>
      </ThemeProvider>
    </AppConfigProvider>
  </StrictMode>
)
