import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from '@src/App.tsx'
import Container from '@components/common/Container';
import Pomodoro from '@pages/Pomodoro';
import { ThemeProvider } from '@theme/ThemeContext';
import TransitionThemeEffect from '@theme/TransitionThemeEffect';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <TransitionThemeEffect />
  <StrictMode>
      <BrowserRouter basename="/portfolio">
      <Routes> 
          <Route path="/" element={<App />} />
        <Route path="/custom" element={<Container>Conteúdo customizado!</Container>} />
        <Route path="/pomodoro" element={<Pomodoro />} />
      </Routes>
    </BrowserRouter>
    </StrictMode>
  </ThemeProvider>,
)
