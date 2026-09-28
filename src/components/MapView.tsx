import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { StarIcon, ChevronRightIcon, LayersIcon } from './Icons'

export interface MapItem {
  id: string
  position: [number, number]
  label: string
  title: string
  subtitle?: string
  meta?: string
  image?: string
  href?: string
}

interface MapViewProps {
  items: MapItem[]
  selectedId?: string
  onSelect?: (id: string) => void
  focus?: { id: string; position: [number, number] } | null
  className?: string
  onSearchArea?: () => void
  scrollWheelZoom?: boolean
}

const TILES = {
  mapa: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  satelite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Imágenes &copy; Esri, Maxar, Earthstar Geographics',
  },
} as const

const pinIcon = (label: string, active: boolean) =>
  L.divIcon({
    className: 'serrana-pin-wrap',
    html: `<span class="serrana-pin${active ? ' is-active' : ''}">${label}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })

const dotIcon = () =>
  L.divIcon({
    className: 'serrana-pin-wrap',
    html: '<span class="serrana-dot"></span>',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })

function FitBounds({ items }: { items: MapItem[] }) {
  const map = useMap()
  useEffect(() => {
    if (!items.length) return
    const bounds = L.latLngBounds(items.map((i) => i.position))
    map.fitBounds(bounds, { padding: [56, 56], maxZoom: 12 })
  }, [map, items])
  return null
}

function FocusFly({ focus }: { focus: MapViewProps['focus'] }) {
  const map = useMap()
  useEffect(() => {
    if (focus) map.flyTo(focus.position, Math.max(map.getZoom(), 13), { duration: 0.7 })
  }, [focus, map])
  return null
}

function SearchArea({ onSearch }: { onSearch?: () => void }) {
  const map = useMap()
  const [armed, setArmed] = useState(false)
  const first = useRef(true)

  useEffect(() => {
    const arm = () => {
      if (first.current) {
        first.current = false
        return
      }
      setArmed(true)
    }
    const off = () => setArmed(false)
    map.on('dragstart', off)
    map.on('zoomstart', off)
    map.on('moveend', arm)
    return () => {
      map.off('dragstart', off)
      map.off('zoomstart', off)
      map.off('moveend', arm)
    }
  }, [map])

  if (!armed || !onSearch) return null
  return (
    <button
      onClick={() => {
        onSearch()
        setArmed(false)
      }}
      className="absolute left-1/2 top-4 z-[500] -translate-x-1/2 rounded-full bg-cielo-950 px-5 py-2.5 text-sm font-semibold text-cream shadow-lg shadow-cielo-950/20 transition-transform hover:scale-[1.03]"
    >
      Buscar en esta zona
    </button>
  )
}

function LayerToggle({ mode, onChange }: { mode: 'mapa' | 'satelite'; onChange: (m: 'mapa' | 'satelite') => void }) {
  return (
    <div className="absolute right-3 top-3 z-[500] flex overflow-hidden rounded-full border border-piedra-200 bg-white shadow-sm">
      <button
        onClick={() => onChange('mapa')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors ${
          mode === 'mapa' ? 'bg-cielo-950 text-cream' : 'text-piedra-700 hover:bg-piedra-100'
        }`}
      >
        <LayersIcon className="h-3.5 w-3.5" /> Mapa
      </button>
      <button
        onClick={() => onChange('satelite')}
        className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
          mode === 'satelite' ? 'bg-cielo-950 text-cream' : 'text-piedra-700 hover:bg-piedra-100'
        }`}
      >
        Satélite
      </button>
    </div>
  )
}

function BaseTiles({ mode }: { mode: 'mapa' | 'satelite' }) {
  const tile = TILES[mode]
  return (
    <TileLayer
      key={mode}
      url={tile.url}
      attribution={tile.attribution}
      subdomains={mode === 'mapa' ? ['a', 'b', 'c', 'd'] : undefined}
      maxZoom={19}
    />
  )
}

export default function MapView({
  items,
  selectedId,
  onSelect,
  focus,
  className = '',
  onSearchArea,
  scrollWheelZoom = true,
}: MapViewProps) {
  const [mode, setMode] = useState<'mapa' | 'satelite'>('mapa')
  const center = useMemo<[number, number]>(() => items[0]?.position ?? [-31.7, -64.6], [items])

  return (
    <div className={`relative isolate ${className}`}>
      <MapContainer
        center={center}
        zoom={10}
        minZoom={6}
        scrollWheelZoom={scrollWheelZoom}
        zoomControl={false}
        className="h-full w-full"
      >
        <BaseTiles mode={mode} />
        <FitBounds items={items} />
        <FocusFly focus={focus} />
        <SearchArea onSearch={onSearchArea} />

        {items.map((item) => (
          <Marker
            key={item.id}
            position={item.position}
            icon={pinIcon(item.label, item.id === selectedId)}
            zIndexOffset={item.id === selectedId ? 1000 : 0}
            eventHandlers={{ click: () => onSelect?.(item.id) }}
          >
            <Popup closeButton={false} offset={[0, -4]}>
              <Link to={item.href ?? '#'} className="serrana-popup">
                {item.image ? <img src={item.image} alt="" className="serrana-popup-img" /> : null}
                <div className="serrana-popup-body">
                  <p className="serrana-popup-title">{item.title}</p>
                  {item.subtitle ? <p className="serrana-popup-sub">{item.subtitle}</p> : null}
                  <div className="serrana-popup-foot">
                    <span className="flex items-center gap-1">
                      <StarIcon className="h-3 w-3 text-earth-400" />
                      {item.meta}
                    </span>
                    <span className="flex items-center gap-0.5 font-semibold text-cielo-950">
                      {item.label}
                      <ChevronRightIcon className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <LayerToggle mode={mode} onChange={setMode} />
    </div>
  )
}

function Polyline({ points }: { points: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    const line = L.polyline(points, {
      color: '#283b25',
      weight: 4,
      opacity: 0.9,
      dashArray: '1 9',
      lineCap: 'round',
    }).addTo(map)
    return () => {
      map.removeLayer(line)
    }
  }, [map, points])
  return null
}

export function SinglePinMap({
  position,
  label,
  className = '',
  zoom = 12,
  trail,
  children,
}: {
  position: [number, number]
  label?: string
  className?: string
  zoom?: number
  trail?: [number, number][]
  children?: ReactNode
}) {
  const [mode, setMode] = useState<'mapa' | 'satelite'>('mapa')
  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      <MapContainer
        center={position}
        zoom={zoom}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={Boolean(children)}
        className="h-full w-full"
      >
        <BaseTiles mode={mode} />
        {trail?.length ? <Polyline points={trail} /> : null}
        <Marker position={position} icon={label ? pinIcon(label, true) : dotIcon()} />
      </MapContainer>
      <LayerToggle mode={mode} onChange={setMode} />
    </div>
  )
}
