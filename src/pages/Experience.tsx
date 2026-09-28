import { Link, useParams } from 'react-router-dom'
import { experienceById, money, properties } from '../data/demo'
import { SinglePinMap } from '../components/MapView'
import { ClockIcon, StarIcon } from '../components/Icons'
import { Rating } from '../components/ui'

const includes: Record<string, string[]> = {
  Astroturismo: ['Telescopio y puntero láser', 'Guía local', 'Merienda y mate'],
  Kayak: ['Kayak y chaleco', 'Guía local', 'Embarcadero y traslado'],
  Cabalgata: ['Caballo y equipo', 'Guía local', 'Parada con mate'],
  Escalada: ['Cuerdas y casco', 'Guía certificado', 'Punto de acceso'],
  Pesca: ['Equipo de pesca', 'Guía local', 'Embarcación'],
}

const fallback = ['Guía local', 'Seguro de actividad', 'Equipamiento']

export default function ExperiencePage() {
  const { id } = useParams()
  const exp = experienceById(id ?? '')

  if (!exp) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-semibold">No encontramos esa experiencia</h1>
        <Link to="/explore" className="mt-6 rounded-full bg-cielo-950 px-6 py-3 text-sm font-semibold text-cream">
          Volver a explorar
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
      <p className="flex items-center gap-1.5 text-sm text-piedra-500">
        <Link to="/explore" className="hover:text-forest-700">Explorar</Link>
        <span>/</span>
        <span className="text-cielo-950">{exp.name}</span>
      </p>

      <div className="relative mt-4 h-[360px] overflow-hidden rounded-2xl sm:h-[440px]">
        <img src={exp.image} alt={exp.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-cielo-950/75 via-cielo-950/20 to-transparent" />
        <div className="absolute bottom-0 p-6 sm:p-8">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-cielo-950">
            {exp.category}
          </span>
          <h1 className="mt-3 max-w-xl text-2xl font-semibold text-cream sm:text-3xl">{exp.name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-cream/85">
            <span>{exp.region}</span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4" /> {exp.durationH} h
            </span>
            <Rating value={exp.rating} />
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <section>
            <h2 className="text-lg font-semibold text-cielo-950">Sobre la experiencia</h2>
            <p className="mt-4 leading-relaxed text-piedra-600">{exp.description}</p>
          </section>

          <section className="mt-10 border-t border-piedra-200 pt-8">
            <h2 className="text-lg font-semibold text-cielo-950">Qué incluye</h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 text-sm text-piedra-600 sm:grid-cols-2">
              {(includes[exp.category] ?? fallback).map((it) => (
                <li key={it} className="flex items-center gap-2.5">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-forest-50 text-[11px] text-forest-700">
                    ✓
                  </span>
                  {it}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 border-t border-piedra-200 pt-8">
            <h2 className="text-lg font-semibold text-cielo-950">Punto de encuentro</h2>
            <SinglePinMap className="mt-4 h-[320px] rounded-2xl" position={exp.coordinates} zoom={12} />
          </section>

          <section className="mt-10 border-t border-piedra-200 pt-8">
            <h2 className="text-lg font-semibold text-cielo-950">Dónde alojarse cerca</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {properties.slice(0, 2).map((p) => (
                <Link
                  key={p.id}
                  to={`/property/${p.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-piedra-200 p-3 transition-colors hover:border-cielo-950"
                >
                  <img src={p.image} alt={p.name} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-cielo-950 group-hover:text-forest-700">
                      {p.name}
                    </p>
                    <p className="mt-0.5 text-xs text-piedra-500">{money(p.pricePerNight)} / noche</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside>
          <div className="rounded-2xl bg-cielo-950 p-6 text-cream lg:sticky lg:top-20">
            <p className="text-2xl font-semibold text-sand-300">
              {money(exp.price)}
              <span className="text-sm font-normal text-cream/60"> / persona</span>
            </p>
            <button className="mt-5 w-full rounded-xl bg-sand-300 py-3.5 text-sm font-semibold text-cielo-950 transition-colors hover:bg-sand-200">
              Reservar
            </button>
            <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-sm text-cream/80">
              <li className="flex items-center justify-between">
                <span>Duración</span>
                <span>{exp.durationH} h</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Región</span>
                <span>{exp.region}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Guía</span>
                <span className="flex items-center gap-1">
                  <StarIcon className="h-3.5 w-3.5 text-sand-300" />
                  verificado
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}
