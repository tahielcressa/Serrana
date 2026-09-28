import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { MenuIcon, CloseIcon, UserIcon } from './Icons'
import { ScrollProgress } from './Scroll'
import { salir } from '../data/auth'
import { useUsuario } from './AuthGuard'

const secciones = [
  { id: 'regiones', label: 'Regiones' },
  { id: 'trekkings', label: 'Trekkings' },
  { id: 'experiencias', label: 'Experiencias' },
  { id: 'alojamientos', label: 'Alojamientos' },
]

const iniciales = (nombre: string) =>
  nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const usuario = useUsuario()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const solid = scrolled || open

  // El ícono de perfil lleva directo a donde corresponde: si no hay
  // sesión, al login; si sos admin, a la administración; si sos
  // cliente, a tu panel.
  const destino = usuario ? (usuario.rol === 'admin' ? '/admin' : '/owner') : '/login'

  // Las secciones del home se scrollean pasando el destino por el
  // estado de la navegación (un hash rompería el HashRouter).
  const irASeccion = (id: string) => {
    setOpen(false)
    navigate('/', { state: { irA: id } })
  }

  return (
    <>
      <ScrollProgress />
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid ? 'border-b border-piedra-200 bg-cream/95 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
            <span
              className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${
                solid ? 'bg-cielo-950 text-cream' : 'bg-white/15 text-cream ring-1 ring-white/25'
              }`}
            >
              <svg viewBox="0 0 64 64" className="h-4 w-4" aria-hidden>
                <path d="M10 46 L24 20 L33 35 L39 26 L54 46 Z" fill="currentColor" />
                <circle cx="48" cy="15" r="4" fill="#faf7f1" />
              </svg>
            </span>
            <span
              className={`text-lg font-semibold tracking-tight ${
                solid ? 'text-cielo-950' : 'text-cream'
              }`}
            >
              Serrana
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink
              to="/explore"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                solid
                  ? 'text-piedra-700 hover:bg-piedra-100 hover:text-cielo-950'
                  : 'text-cream/90 hover:bg-white/10 hover:text-cream'
              }`}
            >
              Explorar
            </NavLink>
            {secciones.map((s) => (
              <button
                key={s.id}
                onClick={() => irASeccion(s.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  solid
                    ? 'text-piedra-700 hover:bg-piedra-100 hover:text-cielo-950'
                    : 'text-cream/90 hover:bg-white/10 hover:text-cream'
                }`}
              >
                {s.label}
              </button>
            ))}
            <button
              onClick={() => navigate(destino)}
              className={`ml-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                solid
                  ? 'bg-cielo-950 text-cream hover:bg-cielo-900'
                  : 'bg-white/15 text-cream ring-1 ring-white/30 hover:bg-cream hover:text-cielo-950'
              }`}
            >
              {usuario ? 'Mi panel' : 'Publicá tu espacio'}
            </button>
            <button
              onClick={() => navigate(destino)}
              aria-label="Mi cuenta"
              title={usuario ? `Mi cuenta (${usuario.nombre})` : 'Iniciar sesión'}
              className={`ml-1 grid h-9 w-9 place-items-center rounded-full text-xs font-bold transition-colors ${
                usuario
                  ? solid
                    ? 'bg-cielo-950 text-cream'
                    : 'bg-white/20 text-cream ring-1 ring-white/30'
                  : solid
                    ? 'text-piedra-700 hover:bg-piedra-100 hover:text-cielo-950'
                    : 'text-cream hover:bg-white/10'
              }`}
            >
              {usuario ? iniciales(usuario.nombre) : <UserIcon className="h-5 w-5" />}
            </button>
          </nav>

          <button
            className={`grid h-10 w-10 place-items-center md:hidden ${
              solid ? 'text-cielo-950' : 'text-cream'
            }`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {open && (
          <nav className="border-t border-piedra-200 bg-cream px-4 py-3 md:hidden">
            <div className="flex flex-col">
              <NavLink
                to="/explore"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-piedra-700 hover:bg-piedra-100"
                onClick={() => setOpen(false)}
              >
                Explorar
              </NavLink>
              {secciones.map((s) => (
                <button
                  key={s.id}
                  onClick={() => irASeccion(s.id)}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-piedra-700 hover:bg-piedra-100"
                >
                  {s.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setOpen(false)
                  navigate(destino)
                }}
                className="mt-2 rounded-lg bg-cielo-950 px-3 py-2.5 text-sm font-semibold text-cream"
              >
                {usuario ? 'Mi panel' : 'Iniciar sesión o crear cuenta'}
              </button>
              {usuario && (
                <button
                  onClick={() => {
                    setOpen(false)
                    salir()
                    navigate('/')
                  }}
                  className="mt-1 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-piedra-700 hover:bg-piedra-100"
                >
                  Salir de mi cuenta
                </button>
              )}
            </div>
          </nav>
        )}
      </header>
    </>
  )
}
