import { lazy, StrictMode, Suspense } from 'react'
import './components/theme/background-transparency.css'
import './components/theme/animations.css'
import './index.css'
import './components/theme/interaction-feedback.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from '@src/App'
import { ThemeProvider } from '@theme/ThemeContext'
import { BackgroundTransparencyProvider } from '@theme/BackgroundTransparencyContext'
import { AppConfigProvider } from '@context'

import TransitionThemeEffect from '@theme/TransitionThemeEffect'
import { I18nProvider } from '@src/i18n'
import Analytics from '@components/Analytics'
import RouteEffects from '@components/RouteEffects'
import RouteLoading from '@components/common/RouteLoading'

const Portfolio = lazy(() => import('@pages/Portfolio'))
const LandingPage = lazy(() => import('@pages/LandingPage'))
const Pomodoro = lazy(() => import('@pages/Pomodoro'))
const GenerativeArt = lazy(() => import('@pages/GenerativeArt'))
const Experimental3D = lazy(() => import('@pages/Experimental3D'))
const AdminChat = lazy(() => import('@pages/AdminChat'))
const NotFound = lazy(() => import('@pages/NotFound'))
const AgencyStudio = lazy(() => import('@pages/AgencyStudio'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppConfigProvider>
      <ThemeProvider>
        <BackgroundTransparencyProvider>
          <TransitionThemeEffect />
          <I18nProvider>
            <BrowserRouter>
              <Analytics />
              <Suspense fallback={<RouteLoading />}>
                <RouteEffects />
                <Routes>
                  <Route path="/" element={<App />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/agency" element={<AgencyStudio />} />
                  <Route path="/pomodoro" element={<Pomodoro />} />
                  <Route path="/generative" element={<GenerativeArt />} />
                  <Route path="/experimental3d" element={<Experimental3D />} />
                  <Route path="/admin/chat" element={<AdminChat />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </I18nProvider>
        </BackgroundTransparencyProvider>
      </ThemeProvider>
    </AppConfigProvider>
  </StrictMode>
)
