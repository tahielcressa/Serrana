import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

const base = import.meta.env.BASE_URL

// GitHub Pages no resuelve el index.html para subrutas de un proyecto site.
// El 404.html del user site redirige acá con ?_redirect=/explore y lo restauramos
// para que React Router monte en la ruta correcta con la URL limpia.
const redirect = new URLSearchParams(window.location.search).get('_redirect')
if (redirect) {
  window.history.replaceState(null, '', base + redirect.replace(/^\/+/, ''))
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={base}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)