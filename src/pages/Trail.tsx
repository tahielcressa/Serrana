import { Link, useParams } from 'react-router-dom'
import { trailById, properties, difficultyColor, money } from '../data/demo'
import { SinglePinMap } from '../components/MapView'
import { WalkIcon, ClockIcon, ChartIcon, MountainIcon } from '../components/Icons'
import { Rating } from '../components/ui'

export default function Trail() {
  const { id } = useParams()
  const trail = trailById(id ?? '')

  if (!trail) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-semibold">No encontramos esa ruta</h1>
        <Link to="/explore?tipo=trail" className="mt-6 rounded-full bg-cielo-950 px-6 py-3 text-sm font-semibold text-cream">
          Volver a los trekkings
        </Link>
      </main>
    )
  }

  const stats = [
    { label: 'Distancia', value: `${trail.distanceKm} km`, Icon: WalkIcon },
    { label: 'Duración', value: `${trail.durationH} h`, Icon: ClockIcon },
    { label: 'Desnivel', value: `+${trail.elevationGain} m`, Icon: ChartIcon },
    { label: 'Alt. máxima', value: `${trail.maxAltitude} msnm`, Icon: MountainIcon },
  ]

  // trazado aproximado alrededor del punto de la ruta para dibujarla en el mapa
  const [lat, lng] = trail.coordinates
  const path: [number, number][] = [
    [lat - 0.035, lng + 0.05],
    [lat - 0.02, lng + 0.015],
    [lat - 0.006, lng + 0.035],
    [lat + 0.008, lng - 0.01],
    [lat + 0.02, lng - 0.04],
    [lat + 0.03, lng - 0.01],
  ]

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
      <p className="flex items-center gap-1.5 text-sm text-piedra-500">
        <Link to="/explore" className="hover:text-forest-700">Explorar</Link>
        <span>/</span>
        <span className="text-cielo-950">{trail.name}</span>
      </p>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-cielo-950 sm:text-3xl">{trail.name}</h1>
          <p className="mt-1.5 text-sm text-piedra-500">{trail.location}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${difficultyColor[trail.difficulty]}`}
          >
            {trail.difficulty}
          </span>
          <Rating value={trail.rating} count={trail.reviews} />
        </div>
      </div>

      {/* Ficha técnica */}
      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-piedra-200 py-6 sm:grid-cols-4">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="h-5 w-5 shrink-0 text-forest-600" />
            <div>
              <dt className="text-xs text-piedra-500">{label}</dt>
              <dd className="text-sm font-semibold text-cielo-950">{value}</dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <SinglePinMap
            className="h-[420px] rounded-2xl"
            position={trail.coordinates}
            zoom={12}
            trail={path}
          />
          <p className="mt-3 text-xs text-piedra-500">
            Trazado orientativo de la ruta. Parte desde {trail.location}.
          </p>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-cielo-950">Sobre la ruta</h2>
            <p className="mt-4 leading-relaxed text-piedra-600">{trail.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {trail.terrain.map((t) => (
                <span key={t} className="rounded-full bg-forest-50 px-3.5 py-1.5 text-xs font-medium text-forest-700">
                  {t}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-10 border-t border-piedra-200 pt-8">
            <h2 className="text-lg font-semibold text-cielo-950">Antes de salir</h2>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-piedra-600">
              <li>· Llevá al menos 2 L de agua por persona.</li>
              <li>· Salí temprano: al mediodía el calor serrano es intenso.</li>
              <li>· Calzado con buena pisada; bastones recomendados si es Difícil.</li>
              <li>· Protector solar y gorra, esté nublado o no.</li>
            </ul>
          </section>
        </div>

        <aside>
          <div className="lg:sticky lg:top-20">
            <h2 className="text-lg font-semibold text-cielo-950">Dónde dormir cerca</h2>
            <p className="mt-1 text-sm text-piedra-500">Alojamientos con salida a esta ruta</p>
            <div className="mt-5 divide-y divide-piedra-100 border-y border-piedra-100">
              {properties.slice(0, 4).map((p) => (
                <Link key={p.id} to={`/property/${p.id}`} className="group flex items-center gap-3 py-3.5">
                  <img src={p.image} alt={p.name} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-cielo-950 group-hover:text-forest-700">
                      {p.name}
                    </p>
                    <p className="mt-0.5 text-xs text-piedra-500">
                      {money(p.pricePerNight)} / noche · {p.location}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              to="/explore"
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-piedra-300 px-5 py-3 text-sm font-semibold text-cielo-950 transition-colors hover:border-cielo-950"
            >
              Ver todos los lugares
            </Link>
          </div>
        </aside>
      </div>
    </main>
  )
}
