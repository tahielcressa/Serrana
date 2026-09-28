import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { trails, difficultyColor } from '../data/demo'
import { WalkIcon, ClockIcon, ChartIcon } from './Icons'
import { Rating } from './ui'

/** Sección pegajosa: la imagen de la izquierda cambia según el panel activo. */
export default function Trekkings() {
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = panelRefs.current.indexOf(entry.target as HTMLDivElement)
          if (index >= 0) setActive(index)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    panelRefs.current.forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const trail = trails[active]

  return (
    <section id="trekkings" className="relative scroll-mt-16 bg-cielo-950">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-300">
              Explorá a pie
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-cream sm:text-3xl">
              Rutas con distancia, desnivel y duración reales.
            </h2>
          </div>
          <Link
            to="/explore?tipo=trail"
            className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:border-sand-300 hover:text-sand-300"
          >
            Ver todas las rutas
          </Link>
        </div>

        {/* Barra de progreso de la sección */}
        <div className="mt-10 h-px w-full bg-white/10">
          <div
            className="h-px bg-sand-300 transition-[width] duration-500"
            style={{ width: `${((active + 1) / trails.length) * 100}%` }}
          />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* Columna pegajosa con la imagen activa */}
          <div className="lg:sticky lg:top-20 lg:h-[70dvh]">
            <div className="relative h-full overflow-hidden rounded-2xl">
              {trails.map((t, i) => (
                <img
                  key={t.id}
                  src={t.image}
                  alt={t.name}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    i === active ? 'scrolly-active opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-cielo-950/85 via-cielo-950/10 to-transparent" />
              <div className="absolute bottom-0 p-6">
                <Rating value={trail.rating} count={trail.reviews} />
                <h3 className="mt-2 text-xl font-semibold text-cream">{trail.name}</h3>
                <p className="mt-1 text-sm text-cream/75">{trail.location}</p>
              </div>
            </div>
          </div>

          {/* Paneles que van cambiando */}
          <div>
            {trails.map((t, i) => (
              <div
                key={t.id}
                ref={(node) => {
                  panelRefs.current[i] = node
                }}
                className="flex min-h-[70dvh] flex-col justify-center border-b border-white/10 py-10 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold tabular-nums text-sand-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyColor[t.difficulty]}`}>
                    {t.difficulty}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-semibold text-cream">{t.name}</h3>
                <p className="mt-3 leading-relaxed text-piedra-300">{t.description}</p>

                <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-cream/80">
                  <div className="flex items-center gap-2">
                    <WalkIcon className="h-4 w-4 text-sand-300" />
                    <dt className="sr-only">Distancia</dt>
                    <dd>{t.distanceKm} km</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-sand-300" />
                    <dt className="sr-only">Duración</dt>
                    <dd>{t.durationH} h</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChartIcon className="h-4 w-4 text-sand-300" />
                    <dt className="sr-only">Desnivel</dt>
                    <dd>+{t.elevationGain} m</dd>
                  </div>
                </dl>

                <button
                  onClick={() => navigate(`/trail/${t.id}`)}
                  className="mt-7 w-fit rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-cielo-950 transition-colors hover:bg-sand-300"
                >
                  Ver la ruta
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
