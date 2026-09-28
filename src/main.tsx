import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App'

// HashRouter: GitHub Pages no sirve el index.html para rutas profundas de un
// proyecto site (el 404.html no se aplica), y con hash el servidor nunca
// necesita resolver la ruta. Ej: /Serrana/#/explore

// Red de seguridad: si una foto no carga, se reemplaza por la ilustración local
// para que nunca se vea el ícono de imagen rota.
const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}img-fallback.svg`
document.addEventListener(
  'error',
  (event) => {
    const target = event.target
    if (target instanceof HTMLImageElement && !target.dataset.fallback) {
      target.dataset.fallback = 'true'
      target.src = FALLBACK_IMAGE
    }
  },
  true,
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)