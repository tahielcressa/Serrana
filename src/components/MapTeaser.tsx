import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { properties, trails, categoryLabel } from '../data/demo'
import MapView, { type MapItem } from './MapView'
import { TentIcon, WalkIcon, ChevronRightIcon } from './Icons'
import { SectionHeader } from './ui'

export default function MapTeaser() {
  const [mode, setMode] = useState<'alojamientos' | 'trekkings'>('alojamientos')

  const items: MapItem[] = useMemo(
    () =>
      mode === 'alojamientos'
        ? properties.map((p) => ({
            id: p.id,
            position: p.coordinates,
            label: `$${p.pricePerNight}`,
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
    [mode],
  )

  return (
    <section className="relative z-10 border-y border-piedra-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            tag="En el mapa"
            title="Cada lugar, en su punto exacto."
            subtitle="Movete el mapa, corré el zoom y abrí el lugar que te interesa. Después filtrá por tipo, región o precio."
          />

          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-piedra-200 p-1">
              {([
                { id: 'alojamientos', label: 'Alojamientos', Icon: TentIcon },
                { id: 'trekkings', label: 'Trekkings', Icon: WalkIcon },
              ] as const).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    mode === id ? 'bg-cielo-950 text-cream' : 'text-piedra-700 hover:text-cielo-950'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
            <Link
              to="/explore"
              className="hidden items-center gap-1 rounded-full border border-piedra-300 px-4 py-2 text-sm font-semibold text-cielo-950 transition-colors hover:border-cielo-950 sm:flex"
            >
              Explorar
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <MapView
          className="mt-8 h-[420px] overflow-hidden rounded-2xl sm:h-[520px]"
          items={items}
          scrollWheelZoom={false}
        />

        <p className="mt-3 text-xs text-piedra-500">
          {items.length} {mode === 'alojamientos' ? 'lugares' : 'rutas'} en las Sierras de Córdoba.
          El precio del marcador es por noche.
        </p>
      </div>
    </section>
  )
}
