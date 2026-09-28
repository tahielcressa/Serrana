import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { img } from '../data/demo'
import { SearchIcon, PinIcon, UserIcon } from './Icons'

function HeroSearch() {
  const navigate = useNavigate()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate('/explore')
  }

  return (
    <div className="hero-fade relative z-10 mx-auto mt-8 w-full max-w-3xl">
      <form
        onSubmit={submit}
        className="flex flex-col gap-1 rounded-2xl bg-cream p-2 shadow-2xl shadow-cielo-950/40 ring-1 ring-white/10 sm:flex-row"
      >
        <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-cream-dark">
          <PinIcon className="h-5 w-5 text-forest-600" />
          <div className="flex-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-piedra-500">
              ¿Adónde querés ir?
            </label>
            <input
              type="text"
              placeholder="Córdoba, Argentina"
              className="w-full bg-transparent text-sm font-medium text-cielo-950 outline-none placeholder:text-piedra-400"
            />
          </div>
        </div>
        <div className="hidden items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-cream-dark sm:flex">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-piedra-500">
              Fechas
            </label>
            <input
              type="text"
              placeholder="Agregá fechas"
              className="w-36 bg-transparent text-sm font-medium text-cielo-950 outline-none placeholder:text-piedra-400"
            />
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-cream-dark">
          <UserIcon className="h-5 w-5 text-forest-600" />
          <div className="flex-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-piedra-500">
              Huéspedes
            </label>
            <input
              type="text"
              placeholder="2 huéspedes"
              className="w-full bg-transparent text-sm font-medium text-cielo-950 outline-none placeholder:text-piedra-400 sm:w-32"
            />
          </div>
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-forest-700 px-6 py-3.5 text-sm font-semibold text-cream transition-all hover:bg-forest-800 active:scale-95"
        >
          <SearchIcon className="h-4 w-4" />
          Buscar
        </button>
      </form>

      <button
        className="mx-auto mt-3 flex items-center gap-2 text-xs font-semibold text-cream/80 underline decoration-cream/30 underline-offset-4 hover:text-cream sm:hidden"
      >
        <PinIcon className="h-4 w-4" /> opciones de búsqueda avanzada
      </button>
    </div>
  )
}

export default function Hero() {
  const [parallax, setParallax] = useState(0)

  useEffect(() => {
    const onScroll = () => setParallax(window.scrollY * 0.35)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative flex min-h-svh flex-col justify-center overflow-hidden">
      <div
        className="hero-zoom absolute inset-0"
        style={{
          backgroundImage: `url(${img('1454496522488-7a8e488e8606', 2000)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          transform: `translateY(${parallax}px) scale(1.1)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-cielo-950/70 via-cielo-950/40 to-cielo-950/75" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        <p className="hero-fade inline-flex items-center gap-2 rounded-full bg-cream/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-cream ring-1 ring-white/20 backdrop-blur" style={{ animationDelay: '80ms' }}>
          <span className="h-2 w-2 rounded-full bg-sand-300" />
          Sierras de Córdoba, Argentina
        </p>

        <h1
          className="hero-fade mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.04] text-cream sm:text-6xl lg:text-7xl"
          style={{ animationDelay: '180ms' }}
        >
          Tu próxima aventura
          <br />
          <span className="text-sand-300">empieza acá.</span>
        </h1>

        <p
          className="hero-fade mt-6 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg"
          style={{ animationDelay: '280ms' }}
        >
          Descubrí campings, domos, cabañas, trekkings y experiencias únicas en la naturaleza.
        </p>

        <HeroSearch />

        <div
          className="hero-fade mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-cream/80"
          style={{ animationDelay: '420ms' }}
        >
          <span className="flex items-center gap-2"><span className="text-sand-300">🏕️</span> +120 espacios serranos</span>
          <span className="flex items-center gap-2"><span className="text-sand-300">🥾</span> 45 rutas de trekking</span>
          <span className="flex items-center gap-2"><span className="text-sand-300">🔥</span> 30 experiencias al aire libre</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-cream/70">
        <div className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.25em]">
          <span>scroll</span>
          <span className="float-drift block h-8 w-px bg-gradient-to-b from-cream/0 via-cream/70 to-cream/0" />
        </div>
      </div>
    </section>
  )
}