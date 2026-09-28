import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App'

// HashRouter: GitHub Pages no sirve el index.html para rutas profundas de un
// proyecto site (el 404.html no se aplica), y con hash el servidor nunca
// necesita resolver la ruta. Ej: /Serrana/#/explore
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)