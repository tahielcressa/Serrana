import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { MenuIcon, CloseIcon, UserIcon, TentIcon, UsersIcon } from './Icons'
import { ScrollProgress } from './Scroll'

const links = [
  { to: '/explore', label: 'Explorar' },
  { to: '/#regiones', label: 'Regiones' },
  { to: '/#trekkings', label: 'Trekkings' },
]

// Las dos entradas que se abren desde el ícono de perfil.
const paneles = [
  {
    to: '/owner',
    label: 'Panel del cliente',
    desc: 'Cargar y seguir mis espacios y rutas',
    Icon: TentIcon,
  },
  {
    to: '/admin',
    label: 'Administración',
    desc: 'Ver solicitudes, cuentas y publicaciones',
    Icon: UsersIcon,
  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [cuenta, setCuenta] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const cuentaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Al cambiar de ruta se cierran los dos menús.
  useEffect(() => {
    setOpen(false)
    setCuenta(false)
  }, [pathname])

  // Cierra el menú de cuenta al hacer clic afuera o presionar Escape.
  useEffect(() => {
    if (!cuenta) return
    const onClick = (e: MouseEvent) => {
      if (cuentaRef.current && !cuentaRef.current.contains(e.target as Node)) setCuenta(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCuenta(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [cuenta])

  const solid = scrolled || open

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
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  solid
                    ? 'text-piedra-700 hover:bg-piedra-100 hover:text-cielo-950'
                    : 'text-cream/90 hover:bg-white/10 hover:text-cream'
                }`}
              >
                {l.label}
              </NavLink>
            ))}
            <button
              onClick={() => navigate('/owner')}
              className={`ml-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                solid
                  ? 'bg-cielo-950 text-cream hover:bg-cielo-900'
                  : 'bg-white/15 text-cream ring-1 ring-white/30 hover:bg-cream hover:text-cielo-950'
              }`}
            >
              Publicá tu espacio
            </button>
            <div className="relative ml-1" ref={cuentaRef}>
              <button
                onClick={() => setCuenta((v) => !v)}
                aria-label="Mi cuenta"
                aria-expanded={cuenta}
                aria-haspopup="menu"
                className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${
                  solid
                    ? 'text-piedra-700 hover:bg-piedra-100 hover:text-cielo-950'
                    : 'text-cream hover:bg-white/10'
                }`}
              >
                <UserIcon className="h-5 w-5" />
              </button>

              {cuenta && (
                <div
                  role="menu"
                  className="absolute right-0 top-11 z-50 w-72 overflow-hidden rounded-2xl border border-piedra-200 bg-white shadow-lg"
                >
                  <p className="border-b border-piedra-200 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-piedra-500">
                    Entrar a un panel
                  </p>
                  {paneles.map(({ to, label, desc, Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      role="menuitem"
                      onClick={() => setCuenta(false)}
                      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-cream-dark"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cielo-950 text-cream">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-cielo-950">{label}</span>
                        <span className="block text-xs text-piedra-500">{desc}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-piedra-700 hover:bg-piedra-100"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </NavLink>
              ))}
              <button
                onClick={() => {
                  setOpen(false)
                  navigate('/owner')
                }}
                className="mt-2 rounded-lg bg-cielo-950 px-3 py-2.5 text-sm font-semibold text-cream"
              >
                Publicá tu espacio
              </button>
              <p className="mt-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-piedra-500">
                Entrar a un panel
              </p>
              {paneles.map(({ to, label, desc, Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className="mt-1 flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-piedra-100"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cielo-950 text-cream">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-cielo-950">{label}</span>
                    <span className="block text-xs text-piedra-500">{desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  )
}
