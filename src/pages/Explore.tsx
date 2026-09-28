import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  properties,
  trails,
  money,
  categoryLabel,
  type Property,
  type Trail,
  type PropertyCategory,
} from '../data/demo'
import MapView, { type MapItem } from '../components/MapView'
import { PinIcon, TentIcon, WalkIcon } from '../components/Icons'
import { Rating } from '../components/ui'

type Tab = 'alojamientos' | 'trekkings'

const typeFilters: ('Todos' | PropertyCategory)[] = [
  'Todos',
  'camping',
  'glamping',
  'domo',
  'cabaña',
  'tiny house',
  'refugio',
  'motorhome',
]

const short = (n: number) => `$${n}`

export default function Explore() {
  const [params] = useSearchParams()
  const [tab, setTab] = useState<Tab>(params.get('tipo') === 'trail' ? 'trekkings' : 'alojamientos')
  const [type, setType] = useState<'Todos' | PropertyCategory>('Todos')
  const [selected, setSelected] = useState<string | undefined>()
  const [focus, setFocus] = useState<{ id: string; position: [number, number] } | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [mobileView, setMobileView] = useState<'lista' | 'mapa'>('lista')
  const listRef = useRef<HTMLDivElement>(null)

  const stays = useMemo(
    () => (type === 'Todos' ? properties : properties.filter((p) => p.category === type)),
    [type],
  )

  const items: MapItem[] = useMemo(
    () =>
      tab === 'alojamientos'
        ? stays.map((p) => ({
            id: p.id,
            position: p.coordinates,
            label: short(p.pricePerNight),
            title: p.name,
            subtitle: `${categoryLabel[p.category]} · ${p.location}`,
            meta: p.rating.toFixed(1),
            image: p.image,
            href: `/property/${p.id}`,
          }))
        : trails.map((t) => ({
            id: t.id,
            position: t.coordinates,
            label: `${t.distanceKm} km`,
            title: t.name,
            subtitle: t.location,
            meta: t.rating.toFixed(1),
            image: t.image,
            href: `/trail/${t.id}`,
          })),
    [tab, stays],
  )

  // al cambiar de pestaña o filtro, el mapa vuelve a encuadrar los resultados
  useEffect(() => {
    setSelected(undefined)
    setFocus(null)
  }, [tab, type])

  const pick = (id: string) => {
    setSelected(id)
    const item = items.find((i) => i.id === id)
    if (item) {
      setFocus({ id, position: item.position })
      if (window.innerWidth < 1024) setMobileView('mapa')
    }
  }
  return (
    <main className="flex h-dvh flex-col bg-cream pt-16">
      {/* Barra de filtros */}
      <div className="border-b border-piedra-200 bg-cream/95 backdrop-blur">
        <div className="mx-auto w-full max-w-[1800px] px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-piedra-200 bg-white p-1">
              {(['alojamientos', 'trekkings'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    tab === t ? 'bg-cielo-950 text-cream' : 'text-piedra-700 hover:text-cielo-950'
                  }`}
                >
                  {t === 'alojamientos' ? <TentIcon className="h-4 w-4" /> : <WalkIcon className="h-4 w-4" />}
                  <span className="hidden sm:inline">{t === 'alojamientos' ? 'Alojamientos' : 'Trekkings'}</span>
                </button>
              ))}
            </div>

            {tab === 'alojamientos' && (
              <div className="flex flex-1 gap-2 overflow-x-auto pb-0.5">
                {typeFilters.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      type === t
                        ? 'border-cielo-950 bg-cielo-950 text-cream'
                        : 'border-piedra-200 bg-white text-piedra-700 hover:border-piedra-400'
                    }`}
                  >
                    {t === 'Todos' ? 'Todos' : categoryLabel[t]}
                  </button>
                ))}
              </div>
            )}

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  showFilters
                    ? 'border-forest-700 bg-forest-700 text-cream'
                    : 'border-piedra-200 bg-white text-cielo-950 hover:border-piedra-400'
                }`}
              >
                Filtros
              </button>

              <div className="flex rounded-full border border-piedra-200 bg-white p-1 lg:hidden">
                {(['lista', 'mapa'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setMobileView(v)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-semibold capitalize transition-colors ${
                      mobileView === v ? 'bg-cielo-950 text-cream' : 'text-piedra-700'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mt-3 grid gap-4 border-t border-piedra-200 pb-1 pt-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-piedra-500">
                  Precio por noche
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <input className="w-full rounded-lg border border-piedra-200 px-3 py-2" placeholder="Desde" />
                  <input className="w-full rounded-lg border border-piedra-200 px-3 py-2" placeholder="Hasta" />
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-piedra-500">Servicios</p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  {['Electricidad', 'Fogón', 'Wi-Fi', 'Parrilla', 'Pet friendly', 'Baño privado'].map((s) => (
                    <button key={s} className="rounded-full bg-forest-50 px-3 py-1 font-medium text-forest-700">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-piedra-500">Región</p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  {['Punilla', 'Calamuchita', 'Traslasierra', 'Sierras Chicas', 'Paravachasca'].map((s) => (
                    <button key={s} className="rounded-full bg-forest-50 px-3 py-1 font-medium text-forest-700">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-piedra-500">
                  Dificultad (trekkings)
                </p>
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
      </div>

      {/* Lista + mapa */}
      <div className="relative flex min-h-0 flex-1">
        <section
          ref={listRef}
          className={`min-h-0 flex-1 overflow-y-auto px-4 pb-10 pt-4 sm:px-6 lg:block ${
            mobileView === 'lista' ? 'block' : 'hidden'
          }`}
        >
          <p className="text-sm text-piedra-500">
            <strong className="font-semibold text-cielo-950">{items.length}</strong>{' '}
            {tab === 'alojamientos' ? 'lugares' : 'rutas'} en las Sierras de Córdoba
          </p>

          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {tab === 'alojamientos'
              ? stays.map((p) => (
                  <StayResult
                    key={p.id}
                    property={p}
                    selected={selected === p.id}
                    onHover={() => setSelected(p.id)}
                    onOpen={() => pick(p.id)}
                  />
                ))
              : trails.map((t) => (
                  <TrailResult
                    key={t.id}
                    trail={t}
                    selected={selected === t.id}
                    onHover={() => setSelected(t.id)}
                    onOpen={() => pick(t.id)}
                  />
                ))}
          </div>
        </section>

        <aside
          className={`h-full min-h-0 w-full shrink-0 lg:block lg:w-[46%] xl:w-[44%] ${
            mobileView === 'mapa' ? 'absolute inset-0 z-10 block lg:relative' : 'hidden'
          }`}
        >
          <MapView
            className="h-full w-full"
            items={items}
            selectedId={selected}
            onSelect={pick}
            focus={focus}
            onSearchArea={() => setFocus(null)}
          />
        </aside>
      </div>
    </main>
  )
}

function StayResult({
  property,
  selected,
  onHover,
  onOpen,
}: {
  property: Property
  selected: boolean
  onHover: () => void
  onOpen: () => void
}) {
  return (
    <article
      onMouseEnter={onHover}
      onClick={onOpen}
      className={`group cursor-pointer overflow-hidden rounded-2xl border bg-white transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-cielo-950/5 ${
        selected ? 'border-cielo-950 shadow-md shadow-cielo-950/5' : 'border-piedra-200'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-cielo-950 backdrop-blur">
          {categoryLabel[property.category]}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug text-cielo-950">{property.name}</h3>
          <Rating value={property.rating} count={property.reviews} />
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-piedra-500">
          <PinIcon className="h-3.5 w-3.5" /> {property.location}
        </p>
        <div className="mt-3 flex items-baseline justify-between">
          <p className="text-sm text-cielo-950">
            <strong className="font-semibold">{money(property.pricePerNight)}</strong>
            <span className="text-piedra-400"> / noche</span>
          </p>
          <Link
            to={`/property/${property.id}`}
            className="text-xs font-semibold text-forest-700 underline-offset-4 hover:underline"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </article>
  )
}

function TrailResult({
  trail,
  selected,
  onHover,
  onOpen,
}: {
  trail: Trail
  selected: boolean
  onHover: () => void
  onOpen: () => void
}) {
  return (
    <article
      onMouseEnter={onHover}
      onClick={onOpen}
      className={`group cursor-pointer overflow-hidden rounded-2xl border bg-white transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-cielo-950/5 ${
        selected ? 'border-cielo-950 shadow-md shadow-cielo-950/5' : 'border-piedra-200'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={trail.image}
          alt={trail.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-cielo-950/80 px-2.5 py-1 text-[11px] font-semibold text-cream backdrop-blur">
          {trail.difficulty}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug text-cielo-950">{trail.name}</h3>
          <Rating value={trail.rating} count={trail.reviews} />
        </div>
        <p className="mt-1 text-xs text-piedra-500">{trail.location}</p>
        <div className="mt-3 flex items-center justify-between border-t border-piedra-100 pt-3 text-sm">
          <span className="text-piedra-500">
            {trail.distanceKm} km · {trail.durationH} h
          </span>
          <Link
            to={`/trail/${trail.id}`}
            className="text-xs font-semibold text-forest-700 underline-offset-4 hover:underline"
          >
            Ver ruta
          </Link>
        </div>
      </div>
    </article>
  )
}
