import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { properties, trails, img, money, type Property, type Trail, categoryEmoji } from '../data/demo'
import { PinIcon } from '../components/Icons'
import { Rating } from '../components/ui'

type Tab = 'alojamientos' | 'trails'

const typeFilters = ['Todos', 'camping', 'glamping', 'domo', 'cabaña', 'tiny house', 'refugio', 'motorhome']

function MapMarker({
  x,
  y,
  label,
  selected,
  onClick,
}: {
  x: number
  y: number
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`absolute -translate-x-1/2 -translate-y-full rounded-full px-2.5 py-1 text-xs font-bold shadow-lg transition-transform hover:scale-110 ${
        selected ? 'z-20 scale-110 bg-earth-500 text-cream' : 'bg-cream text-cielo-950 ring-1 ring-earth-400/40'
      }`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {label}
    </button>
  )
}

function FakeMap({
  items,
  selectedId,
  onSelect,
}: {
  items: { id: string; x: number; y: number; label: string; emoji: string }[]
  selectedId?: string
  onSelect: (id: string) => void
}) {
  const spots: Record<string, [number, number]> = {
    '0': [22, 28],
    '1': [38, 18],
    '2': [58, 34],
    '3': [74, 22],
    '4': [30, 55],
    '5': [52, 62],
    '6': [78, 52],
    '7': [18, 78],
    '8': [44, 82],
    '9': [66, 84],
    '10': [82, 74],
    '11': [12, 45],
    '12': [88, 38],
  }

  return (
    <div className="relative h-full min-h-[520px] w-full overflow-hidden rounded-none">
      <img
        src={img('1464822759023-fed622ff2c3b', 1600)}
        alt="Mapa ilustrativo de las sierras"
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-forest-900/10 via-transparent to-cielo-950/30" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
      {items.map((it, i) => {
        const spot = spots[String(i % Object.keys(spots).length)] ?? [50, 50]
        return (
          <MapMarker
            key={it.id}
            x={spot[0]}
            y={spot[1]}
            label={`${it.emoji} ${it.label}`}
            selected={selectedId === it.id}
            onClick={() => onSelect(it.id)}
          />
        )
      })}
      <div className="absolute bottom-4 left-4 rounded-full bg-cielo-950/70 px-4 py-2 text-xs font-medium text-cream backdrop-blur">
        🗺️ Mapa demo · Mapbox / Google Maps (por conectar)
      </div>
    </div>
  )
}

export default function Explore() {
  const [params] = useSearchParams()
  const initial: Tab = params.get('tipo') === 'trail' ? 'trails' : 'alojamientos'
  const [tab, setTab] = useState<Tab>(initial)
  const [type, setType] = useState('Todos')
  const [selected, setSelected] = useState<string | undefined>()
  const [showFilters, setShowFilters] = useState(false)

  const filteredProps = useMemo(
    () => (type === 'Todos' ? properties : properties.filter((p) => p.category === type)),
    [type],
  )

  const shownItems =
    tab === 'alojamientos' ? (filteredProps as Property[]) : trails

  return (
    <main className="flex h-[calc(100dvh-0px)] flex-col bg-cream pt-20">
      {/* Barra superior */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-forest-600">
              <PinIcon className="h-4 w-4" /> Córdoba, Argentina
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-cielo-950">Explorar</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                showFilters
                  ? 'border-forest-700 bg-forest-700 text-cream'
                  : 'border-piedra-300 text-cielo-950 hover:border-forest-600'
              }`}
            >
              Filtros
            </button>
            <div className="flex rounded-full border border-piedra-300 p-1 text-sm font-semibold">
              {(['alojamientos', 'trails'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t)
                    setSelected(undefined)
                  }}
                  className={`rounded-full px-4 py-1.5 transition-colors ${
                    tab === t ? 'bg-cielo-950 text-cream' : 'text-piedra-700 hover:text-cielo-950'
                  }`}
                >
                  {t === 'alojamientos' ? '🛏️ Alojamientos' : '🥾 Trekkings'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {typeFilters.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                type === t
                  ? 'bg-forest-800 text-cream'
                  : 'bg-white text-piedra-700 ring-1 ring-piedra-200 hover:ring-forest-400'
              }`}
            >
              {t === 'Todos' ? 'Todos' : `${categoryEmoji[t as keyof typeof categoryEmoji]} ${t}`}
            </button>
          ))}
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-4 rounded-2xl border border-piedra-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-piedra-500">Precio por noche</p>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <input className="w-full rounded-lg border border-piedra-200 px-3 py-2" placeholder="Desde" />
                <input className="w-full rounded-lg border border-piedra-200 px-3 py-2" placeholder="Hasta" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-piedra-500">Servicios</p>
              <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                {['Electricidad', 'Fogón', 'Wi-Fi', 'Parrilla', 'Pet friendly', 'Piscina'].map((s) => (
                  <button key={s} className="rounded-full bg-forest-50 px-3 py-1 font-medium text-forest-700">
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-piedra-500">Actividades</p>
              <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                {['Trekking', 'Kayak', 'Pesca', 'Escalada', 'Cabalgata'].map((s) => (
                  <button key={s} className="rounded-full bg-forest-50 px-3 py-1 font-medium text-forest-700">
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-piedra-500">Dificultad (trekkings)</p>
              <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                {['Fácil', 'Moderado', 'Difícil'].map((s) => (
                  <button key={s} className="rounded-full bg-sand-100 px-3 py-1 font-medium text-earth-700">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido: lista + mapa */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section className="min-h-0 flex-1 overflow-y-auto px-4 pb-16 sm:px-6 lg:px-8">
          <p className="py-3 text-sm text-piedra-500">
            <strong className="text-cielo-950">{shownItems.length}</strong> resultados en las Sierras
          </p>

          <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2 xl:grid-cols-3">
            {tab === 'alojamientos'
              ? (filteredProps as Property[]).map((p) => (
                  <ExploreCard key={p.id} property={p} selected={selected === p.id} onSelect={() => setSelected(p.id)} />
                ))
              : trails.map((t) => (
                  <TrailCard key={t.id} trail={t as unknown as Trail} selected={selected === t.id} onSelect={() => setSelected(t.id)} />
                ))}
          </div>
        </section>

        {/* Mapa */}
        <aside className="relative top-0 hidden h-[calc(100dvh-220px)] border-l border-piedra-200 lg:block lg:w-[46%] xl:w-[42%]">
          {tab === 'alojamientos' ? (
            <FakeMap
              items={(filteredProps as Property[]).map((p) => ({ id: p.id, x: 0, y: 0, label: money(p.pricePerNight), emoji: p.emoji }))}
              selectedId={selected}
              onSelect={setSelected}
            />
          ) : (
            <FakeMap
              items={trails.map((t) => ({ id: t.id, x: 0, y: 0, label: t.distanceKm.toString(), emoji: t.emoji }))}
              selectedId={selected}
              onSelect={setSelected}
            />
          )}
        </aside>
      </div>
    </main>
  )
}

function ExploreCard({ property, selected, onSelect }: { property: Property; selected: boolean; onSelect: () => void }) {
  return (
    <article
      onClick={onSelect}
      className={`group overflow-hidden rounded-3xl border bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg ${
        selected ? 'border-forest-600 ring-2 ring-forest-600/20' : 'border-piedra-200 hover:shadow-forest-900/5'
      }`}
    >
      <div className="relative h-44 overflow-hidden">
        <img src={property.image} alt={property.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-3 py-1 text-xs font-semibold text-forest-700 backdrop-blur">
          {property.emoji} {property.category}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-cielo-950">{property.name}</h3>
          <Rating value={property.rating} count={property.reviews} />
        </div>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-piedra-500">
          <PinIcon className="h-3 w-3" /> {property.location}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {property.features.slice(0, 3).map((f) => (
            <span key={f} className="rounded-full bg-forest-50 px-2 py-0.5 text-[10px] font-medium text-forest-700">
              {f}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-piedra-500">
            <strong className="text-cielo-950">{money(property.pricePerNight)}</strong>
            <span className="text-piedra-400"> / noche</span>
          </p>
          <Link to={`/property/${property.id}`} className="rounded-full bg-forest-700 px-4 py-1.5 text-xs font-semibold text-cream hover:bg-forest-800">
            Ver →
          </Link>
        </div>
      </div>
    </article>
  )
}

function TrailCard({ trail, selected, onSelect }: { trail: Trail; selected: boolean; onSelect: () => void }) {
  return (
    <article
      onClick={onSelect}
      className={`group overflow-hidden rounded-3xl border bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg ${
        selected ? 'border-forest-600 ring-2 ring-forest-600/20' : 'border-piedra-200 hover:shadow-forest-900/5'
      }`}
    >
      <div className="relative h-44 overflow-hidden">
        <img src={trail.image} alt={trail.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-cielo-950/70 px-3 py-1 text-xs font-semibold text-cream backdrop-blur">
          {trail.emoji} {trail.difficulty}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-cielo-950">{trail.name}</h3>
          <Rating value={trail.rating} count={trail.reviews} />
        </div>
        <p className="mt-0.5 text-xs text-piedra-500">{trail.location}</p>
        <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl bg-forest-50/60 p-3 text-center">
          <div><p className="text-sm font-semibold text-cielo-950">🥾 {trail.distanceKm} km</p><p className="text-[10px] uppercase text-piedra-400">distancia</p></div>
          <div><p className="text-sm font-semibold text-cielo-950">⏱ {trail.durationH} h</p><p className="text-[10px] uppercase text-piedra-400">duración</p></div>
          <div><p className="text-sm font-semibold text-cielo-950">📈 +{trail.elevationGain} m</p><p className="text-[10px] uppercase text-piedra-400">desnivel</p></div>
        </div>
        <Link to={`/trail/${trail.id}`} className="mt-3 inline-block rounded-full bg-forest-700 px-4 py-1.5 text-xs font-semibold text-cream hover:bg-forest-800">
          Ver ruta →
        </Link>
      </div>
    </article>
  )
}