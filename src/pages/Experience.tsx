import { Link, useParams } from 'react-router-dom'
import { experiences, money, properties } from '../data/demo'
import { Rating } from '../components/ui'

export default function Experience() {
  const { id } = useParams()
  const exp = experiences.find((x) => x.id === id)

  if (!exp) {
    return (
      <main className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center px-4 text-center">
        <p className="text-5xl">🔥</p>
        <h1 className="mt-4 font-display text-3xl font-semibold">No encontramos esa experiencia</h1>
        <Link to="/explore" className="mt-6 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-cream">
          Volver a explorar
        </Link>
      </main>
    )
  }

  const include = {
    Astroturismo: ['Telescopio', 'Guía local', 'Mate y tortitas'],
    Kayak: ['Equipo completo', 'Chaleco salvavidas', 'Instructor'],
    Cabalgata: ['Caballo entrenado', 'Equipo de seguridad', 'Guía'],
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <p className="flex items-center gap-1.5 text-sm text-piedra-500">
        <Link to="/explore" className="hover:text-forest-700">Explorar</Link>
        <span>/</span><span className="text-cielo-950">{exp.name}</span>
      </p>

      <div className="relative mt-4 h-[420px] overflow-hidden rounded-3xl">
        <img src={exp.image} alt={exp.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-cielo-950/70 to-transparent" />
        <div className="absolute bottom-0 p-8">
          <span className="rounded-full bg-cream/95 px-3 py-1 text-xs font-semibold text-forest-700">
            {exp.emoji} {exp.category}
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-cream sm:text-4xl">{exp.name}</h1>
          <p className="mt-1 flex items-center gap-3 text-sm text-cream/85">
            {exp.region} · {exp.durationH} h · <Rating value={exp.rating} />
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <section>
            <h2 className="font-display text-xl font-semibold text-cielo-950">Sobre la experiencia</h2>
            <p className="mt-4 leading-relaxed text-piedra-600">{exp.description}</p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-cielo-950">Qué incluye</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(include[exp.category as keyof typeof include] ?? ['Guía local', 'Seguro', 'Equipamiento']).map((it) => (
                <span key={it} className="rounded-full bg-forest-50 px-4 py-1.5 text-xs font-semibold text-forest-700">✓ {it}</span>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-cielo-950">Dónde alojarse cerca</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {properties.slice(0, 2).map((p) => (
                <Link key={p.id} to={`/property/${p.id}`} className="group flex items-center gap-3 rounded-2xl border border-piedra-200 bg-white p-4 transition-colors hover:border-forest-400">
                  <img src={p.image} alt={p.name} className="h-14 w-14 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-cielo-950 group-hover:text-forest-700">{p.name}</p>
                    <p className="text-xs text-piedra-500">{p.emoji} {p.category} · {money(p.pricePerNight)}/noche</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside>
          <div className="sticky top-24 rounded-3xl bg-cielo-950 p-6 text-cream">
            <p className="text-3xl font-semibold text-sand-300">{money(exp.price)}<span className="text-sm font-normal text-cream/60"> / persona</span></p>
            <button className="mt-5 w-full rounded-2xl bg-sand-300 py-3.5 text-sm font-semibold text-cielo-950 transition-all hover:bg-sand-200 active:scale-[0.98]">
              Reservar experiencia
            </button>
            <p className="mt-3 text-center text-xs text-cream/60">Demo · cupos por confirmar con el guía</p>
            <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm text-cream/80">
              <p className="flex justify-between"><span>📅 {exp.durationH} h de actividad</span><span>Guía incluido</span></p>
              <p className="flex justify-between"><span>📍 {exp.region}</span><span>{exp.rating} ★</span></p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}