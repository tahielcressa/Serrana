import { useEffect } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import Landing from './pages/Landing'
import Explore from './pages/Explore'
import Property from './pages/Property'
import Trail from './pages/Trail'
import Experience from './pages/Experience'
import Placeholder from './pages/Placeholder'
import Owner from './pages/Owner'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Terminos from './pages/Terminos'
import Privacidad from './pages/Privacidad'
import PublicacionDetalle from './pages/PublicacionDetalle'
import { RutaPrivada } from './components/AuthGuard'

type EstadoScroll = { irA?: string } | null

/**
 * Al cambiar de ruta sube al inicio. Si la navegación trae un destino
 * (por ejemplo Regiones o Trekkings desde el navbar) scrollea suave
 * hasta esa sección, dejando el espacio del navbar fijo.
 */
function ScrollManager() {
  const { pathname, state } = useLocation()
  useEffect(() => {
    const destino = (state as EstadoScroll)?.irA
    if (destino) {
      const seccion = document.getElementById(destino)
      if (seccion) {
        seccion.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, state])
  return null
}

function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl">🏔️</p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-cielo-950">404</h1>
      <p className="mt-2 text-piedra-500">Esa ruta no existe en las sierras.</p>
      <Link to="/" className="mt-6 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-cream hover:bg-forest-800">
        Volver al inicio
      </Link>
    </main>
  )
}

export default function App() {
  return (
    <div className="flex min-h-svh flex-col bg-cream text-cielo-950">
      <ScrollManager />
      <Navbar />
      <div className="flex flex-1 flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/property/:id" element={<Property />} />
          <Route path="/trail/:id" element={<Trail />} />
          <Route path="/experience/:id" element={<Experience />} />
          <Route path="/favorites" element={<Placeholder page="favorites" />} />
          <Route path="/trips" element={<Placeholder page="trips" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/publicacion/:id" element={<PublicacionDetalle />} />
          <Route
            path="/owner"
            element={
              <RutaPrivada>
                <Owner />
              </RutaPrivada>
            }
          />
          <Route
            path="/admin"
            element={
              <RutaPrivada rol="admin">
                <Admin />
              </RutaPrivada>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <CookieBanner />
    </div>
  )
}