import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.tsx'
import Container from './components/Container';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes> 
        <Route path="/portfolio" element={<App />} />
        <Route path="/custom" element={<Container>Conteúdo customizado!</Container>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
