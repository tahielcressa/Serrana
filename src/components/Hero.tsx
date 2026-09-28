import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { img } from '../data/demo'
import { SearchIcon, PinIcon, UserIcon, TentIcon, WalkIcon, CampfireIcon } from './Icons'

function HeroSearch() {
  const navigate = useNavigate()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate('/explore')
  }

  const field =
    'w-full bg-transparent text-sm font-medium text-cielo-950 outline-none placeholder:text-piedra-400'
  const label = 'block text-[11px] font-semibold uppercase tracking-wider text-piedra-500'

  return (
    <form
      onSubmit={submit}
      className="mt-8 flex w-full max-w-3xl flex-col gap-1 rounded-2xl bg-white p-2 shadow-xl shadow-cielo-950/25 sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-piedra-100">
        <PinIcon className="h-5 w-5 shrink-0 text-forest-700" />
        <div className="flex-1">
          <label className={label}>¿Adónde?</label>
          <input type="text" defaultValue="Córdoba, Argentina" className={field} />
        </div>
      </div>
      <div className="hidden flex-1 items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-piedra-100 md:flex">
        <div className="flex-1">
          <label className={label}>Qué te pinta</label>
          <input type="text" placeholder="Camping, trekking, kayak…" className={field} />
        </div>
      </div>
      <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-piedra-100">
        <UserIcon className="h-5 w-5 shrink-0 text-forest-700" />
        <div className="flex-1">
          <label className={label}>Huéspedes</label>
          <input type="text" defaultValue="2" className={`${field} sm:w-24`} />
        </div>
      </div>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-xl bg-forest-800 px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-forest-900"
      >
        <SearchIcon className="h-4 w-4" />
        Buscar
      </button>
    </form>
  )
}

const suggestions = [
  { to: '/explore', label: 'Camping y glamping', Icon: TentIcon },
  { to: '/explore?tipo=trail', label: 'Rutas de trekking', Icon: WalkIcon },
  { to: '/explore', label: 'Experiencias al aire libre', Icon: CampfireIcon },
]

export default function Hero() {
  const [parallax, setParallax] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setParallax(window.scrollY * 0.3)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative flex min-h-[92dvh] flex-col justify-center overflow-hidden">
      <div
        className="hero-zoom absolute inset-0"
        style={{
          backgroundImage: `url(${img('1454496522488-7a8e488e8606', 2000)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          transform: `translateY(${parallax}px) scale(1.08)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-cielo-950/80 via-cielo-950/45 to-cielo-950/85" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p
          className="hero-fade inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-cream ring-1 ring-white/20 backdrop-blur"
          style={{ animationDelay: '60ms' }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-sand-300" />
          Sierras de Córdoba, Argentina
        </p>

        <h1
          className="hero-fade mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] text-cream sm:text-5xl lg:text-6xl"
          style={{ animationDelay: '150ms' }}
        >
          Dormí en la sierra, caminá el cerro y volvé con la cabeza llena.
        </h1>

        <p
          className="hero-fade mt-5 max-w-xl leading-relaxed text-cream/80"
          style={{ animationDelay: '250ms' }}
        >
          Un solo lugar para encontrar campings, domos, cabañas, rutas de trekking y actividades con
          guías locales, en los valles de Córdoba.
        </p>

        <HeroSearch />

        <div
          className="hero-fade mt-8 flex flex-wrap items-center gap-2.5"
          style={{ animationDelay: '380ms' }}
        >
          <span className="text-xs text-cream/60">Probá:</span>
          {suggestions.map(({ to, label, Icon }) => (
            <button
              key={label}
              onClick={() => navigate(to)}
              className="flex items-center gap-1.5 rounded-full border border-white/25 px-3.5 py-1.5 text-xs font-medium text-cream/90 transition-colors hover:border-white/60 hover:text-cream"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-cream/70">
        <div className="flex flex-col items-center gap-1.5 text-[10px] uppercase tracking-[0.25em]">
          <span>scroll</span>
          <span className="float-drift block h-8 w-px bg-gradient-to-b from-cream/0 via-cream/70 to-cream/0" />
        </div>
      </div>
    </section>
  )
}
