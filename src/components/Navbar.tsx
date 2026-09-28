import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { MenuIcon, CloseIcon, UserIcon } from './Icons'

const links = [
  { to: '/explore', label: 'Explorar' },
  { to: '/#regiones', label: 'Regiones' },
  { to: '/#trekkings', label: 'Trekkings' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? 'bg-cream/95 shadow-sm backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-3 pb-3 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
          <span
            className={`grid h-9 w-9 place-items-center rounded-xl bg-forest-800 text-sand-300 transition-transform group-hover:-translate-y-0.5 ${
              solid ? '' : 'ring-1 ring-cream/20'
            }`}
          >
            <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden>
              <path d="M10 46 L24 20 L33 35 L39 26 L54 46 Z" fill="currentColor" />
              <circle cx="48" cy="15" r="4" fill="#faf7f1" />
            </svg>
          </span>
          <span
            className={`font-display text-xl font-semibold ${solid ? 'text-cielo-950' : 'text-cream'}`}
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
                  ? 'text-piedra-700 hover:bg-forest-100/60 hover:text-forest-700'
                  : 'text-cream/90 hover:bg-white/10 hover:text-cream'
              }`}
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={() => navigate('/owner')}
            className={`ml-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              solid
                ? 'border-forest-700 text-forest-700 hover:bg-forest-700 hover:text-cream'
                : 'border-cream/60 text-cream hover:bg-cream hover:text-cielo-950'
            }`}
          >
            Publicá tu espacio
          </button>
          <button
            onClick={() => navigate('/profile')}
            aria-label="Mi perfil"
            className={`ml-1 grid h-10 w-10 place-items-center rounded-full border transition-colors ${
              solid
                ? 'border-piedra-200 text-piedra-700 hover:border-forest-600 hover:text-forest-700'
                : 'border-cream/50 text-cream hover:border-cream'
            }`}
          >
            <UserIcon className="h-5 w-5" />
          </button>
        </nav>

        <button
          className={`grid h-10 w-10 place-items-center rounded-full md:hidden ${
            solid ? 'text-cielo-950' : 'text-cream'
          }`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-piedra-200 bg-cream px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="rounded-lg px-3 py-2 text-sm font-medium text-piedra-700 hover:bg-forest-100/60"
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
              className="rounded-lg bg-forest-700 px-3 py-2 text-sm font-semibold text-cream"
            >
              Publicá tu espacio
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}