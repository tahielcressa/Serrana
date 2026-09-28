import { Link } from 'react-router-dom'
import { regions } from '../data/demo'

export default function Footer() {
  return (
    <footer className="bg-cielo-950 text-piedra-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-800 text-sand-300">
                <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden>
                  <path d="M10 46 L24 20 L33 35 L39 26 L54 46 Z" fill="currentColor" />
                  <circle cx="48" cy="15" r="4" fill="#faf7f1" />
                </svg>
              </span>
              <span className="font-display text-xl font-semibold text-cream">Serrana</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-piedra-400">
              Turismo de naturaleza y aventura. Campings, domos, cabañas, trekkings y experiencias
              en las Sierras de Córdoba.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cream">Explorar</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link className="text-piedra-400 hover:text-cream" to="/explore">Alojamientos</Link></li>
              <li><Link className="text-piedra-400 hover:text-cream" to="/explore">Trekkings</Link></li>
              <li><Link className="text-piedra-400 hover:text-cream" to="/explore">Experiencias</Link></li>
              <li><Link className="text-piedra-400 hover:text-cream" to="/explore">Favoritos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cream">Regiones</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {regions.slice(0, 5).map((r) => (
                <li key={r.id}>
                  <Link className="text-piedra-400 hover:text-cream" to="/explore">
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cream">Para dueños</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link className="text-piedra-400 hover:text-cream" to="/owner">Publicar mi espacio</Link></li>
              <li><Link className="text-piedra-400 hover:text-cream" to="/owner">Dashboard</Link></li>
              <li><span className="text-piedra-400">hola@serrana.travel</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-piedra-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Serrana. Inspirado en las Sierras de Córdoba.</p>
          <p className="rounded-full bg-white/5 px-3 py-1">Datos de demostración · MVP</p>
        </div>
      </div>
    </footer>
  )
}