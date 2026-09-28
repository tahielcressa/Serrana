import { Link, useParams } from 'react-router-dom'
import { trailById, properties, difficultyColor, money } from '../data/demo'
import { Rating } from '../components/ui'

export default function Trail() {
  const { id } = useParams()
  const trail = trailById(id ?? '')

  if (!trail) {
    return (
      <main className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center px-4 text-center">
        <p className="text-5xl">🥾</p>
        <h1 className="mt-4 font-display text-3xl font-semibold">No encontramos esa ruta</h1>
        <Link to="/explore?tipo=trail" className="mt-6 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-cream">
          Volver a los trekkings
        </Link>
      </main>
    )
  }

  const sleepNearby = properties.slice(0, 4)

  return (
    <main className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <p className="flex items-center gap-1.5 text-sm text-piedra-500">
        <Link to="/explore" className="hover:text-forest-700">Explorar</Link>
        <span>/</span>
        <span className="text-cielo-950">{trail.name}</span>
      </p>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-cielo-950 sm:text-4xl">{trail.name}</h1>
          <p className="mt-2 text-piedra-500">{trail.location}</p>
        </div>
        <Rating value={trail.rating} count={trail.reviews} />
      </div>

      {/* Stats hero */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { k: 'Distancia', v: `${trail.distanceKm} km`, emoji: '🥾' },
          { k: 'Duración', v: `${trail.durationH} h`, emoji: '⏱️' },
          { k: 'Desnivel +', v: `+${trail.elevationGain} m`, emoji: '📈' },
          { k: 'Alt. máxima', v: `${trail.maxAltitude} m`, emoji: '🏔️' },
          { k: 'Dificultad', v: trail.difficulty, emoji: '🎯', badge: true },
        ].map((s) => (
          <div key={s.k} className="rounded-3xl bg-white p-5 text-center ring-1 ring-piedra-200">
            <span className="text-2xl">{s.emoji}</span>
            <p className={`mt-2 text-lg font-semibold ${s.badge ? '' : 'text-cielo-950'}`}>
              {s.badge ? (
                <span className={`rounded-full px-3 py-1 text-sm ${difficultyColor[trail.difficulty]}`}>{s.v}</span>
              ) : (
                s.v
              )}
            </p>
            <p className="text-[11px] uppercase tracking-wider text-piedra-400">{s.k}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          {/* Mapa de ruta */}
          <div className="relative h-[420px] overflow-hidden rounded-3xl">
            <img src={trail.image} alt={trail.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cielo-950/60" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 420" preserveAspectRatio="none" aria-hidden>
              <path
                d="M80 360 C 180 320, 120 250, 240 250 S 360 190, 420 210 S 500 280, 560 190 S 660 120, 700 90"
                fill="none"
                stroke="#faf7f1"
                strokeWidth="4"
                strokeDasharray="2 10"
                strokeLinecap="round"
              />
              <circle cx="80" cy="360" r="9" fill="#faf7f1" stroke="#b07e52" strokeWidth="3" />
              <circle cx="700" cy="90" r="9" fill="#b07e52" stroke="#faf7f1" strokeWidth="3" />
            </svg>
            <span className="absolute left-4 top-4 rounded-full bg-cielo-950/70 px-4 py-2 text-xs text-cream backdrop-blur">
              🗺️ Ruta {trail.distanceKm} km → {trail.durationH} h
            </span>
            <span className="absolute bottom-4 left-4 rounded-full bg-cream px-4 py-2 text-xs font-semibold text-cielo-950">
              {trail.emoji} Inicio del sendero
            </span>
          </div>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-cielo-950">Sobre la ruta</h2>
            <p className="mt-4 leading-relaxed text-piedra-600">{trail.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {trail.terrain.map((t) => (
                <span key={t} className="rounded-full bg-forest-50 px-4 py-1.5 text-xs font-semibold text-forest-700">
                  🧭 {t}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-cielo-950">Recomendaciones</h2>
            <ul className="mt-4 space-y-2 text-sm text-piedra-600">
              <li>• Llevar al menos 2 L de agua por persona.</li>
              <li>• Salir temprano: el calor serrano pega fuerte al mediodía.</li>
              <li>• Calzado con buena pisada y bastones si es Difícil.</li>
              <li>• Sumá protector solar y gorra aunque esté nublado.</li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-cielo-950">Comentarios</h2>
            <div className="mt-4 space-y-3">
              {[
                { u: 'Marta R.', t: 'Hermoso paisaje, señalizado perfecto', stars: 5 },
                { u: 'Julián P.', t: 'Exigente pero vale cada paso', stars: 4 },
              ].map((c) => (
                <div key={c.u} className="rounded-2xl bg-white p-4 ring-1 ring-piedra-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-cielo-950">{c.u}</p>
                    <span className="text-sm text-earth-400">{'★'.repeat(c.stars)}</span>
                  </div>
                  <p className="mt-1 text-sm text-piedra-600">{c.t}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Dónde dormir cerca */}
        <aside>
          <div className="rounded-3xl border border-piedra-200 bg-white p-6 sticky top-24 shadow-lg shadow-forest-900/5">
            <h2 className="font-display text-lg font-semibold text-cielo-950">Dónde dormir cerca</h2>
            <p className="mt-1 text-xs text-piedra-400">Alojamientos a menos de 30 km de la ruta</p>
            <div className="mt-4 space-y-3">
              {sleepNearby.map((p) => (
                <Link key={p.id} to={`/property/${p.id}`} className="group flex items-center gap-3 rounded-2xl border border-piedra-200 p-3 transition-colors hover:border-forest-400">
                  <img src={p.image} alt={p.name} className="h-14 w-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-cielo-950 group-hover:text-forest-700">{p.name}</p>
                    <p className="text-xs text-piedra-500">{p.emoji} {p.category} · {money(p.pricePerNight)}/noche</p>
                  </div>
                  <span className="text-xs text-piedra-400">{p.nearby[0]?.distance}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}