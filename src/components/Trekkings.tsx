import { Link } from 'react-router-dom'
import { trails, difficultyColor } from '../data/demo'
import ScrollReveal from './ScrollReveal'
import { Rating, SectionHeader } from './ui'

export default function Trekkings() {
  return (
    <section id="trekkings" className="bg-cielo-950 py-20">
      <div className="mx-auto max-w-7xl scroll-mt-20 px-4 text-cream sm:px-6 lg:px-8">
        <SectionHeader
          tag="explorá a pie"
          title="Trekkings populares."
          subtitle="Rutas con distancia, dificultad, desnivel y duración. Elegí la tuya y salí a caminar."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trails.slice(0, 8).map((t, i) => (
            <ScrollReveal key={t.id} delay={(i % 4) * 70}>
              <Link
                to={`/trail/${t.id}`}
                className="group block overflow-hidden rounded-3xl bg-cielo-900 ring-1 ring-white/10 transition-all hover:-translate-y-1 hover:ring-sand-300/40"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={t.image}
                    alt={t.name}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-cielo-950/70 px-3 py-1 text-xs font-semibold text-cream backdrop-blur">
                    {t.emoji} {t.difficulty}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base font-semibold leading-snug text-cream">
                      {t.name}
                    </h3>
                    <Rating value={t.rating} />
                  </div>
                  <p className="mt-1 text-xs text-piedra-300">{t.location}</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center">
                    <div>
                      <p className="text-sm font-semibold text-sand-300">🥾 {t.distanceKm} km</p>
                      <p className="text-[10px] uppercase tracking-wider text-piedra-400">{t.terrain[0] || 'sendero'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-sand-300">⏱ {t.durationH} h</p>
                      <p className="text-[10px] uppercase tracking-wider text-piedra-400">duración</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-sand-300">📈 +{t.elevationGain} m</p>
                      <p className="text-[10px] uppercase tracking-wider text-piedra-400">desnivel</p>
                    </div>
                  </div>
                  <span
                    className={`mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${difficultyColor[t.difficulty]}`}
                  >
                    {t.difficulty}
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-10 text-center">
          <Link
            to="/explore?tipo=trail"
            className="inline-flex items-center gap-2 rounded-full border border-sand-300/60 px-6 py-3 text-sm font-semibold text-sand-300 transition-colors hover:bg-sand-300 hover:text-cielo-950"
          >
            Ver todas las rutas →
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}