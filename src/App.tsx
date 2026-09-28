import { useEffect } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Explore from './pages/Explore'
import Property from './pages/Property'
import Trail from './pages/Trail'
import Experience from './pages/Experience'
import Placeholder from './pages/Placeholder'
import Owner from './pages/Owner'
import Admin from './pages/Admin'
import Login from './pages/Login'
import { RutaPrivada } from './components/AuthGuard'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
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
      <ScrollToTop />
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
    </div>
  )
}