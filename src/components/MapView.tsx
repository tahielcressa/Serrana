import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
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

type ProviderKey = 'osm' | 'carto' | 'satelite'

// Todos los proveedores son públicos y no piden API key. Si uno no responde,
// el mapa salta solo al siguiente para que nunca quede en blanco.
// Importante: `subdomains` siempre tiene que ser string o array. Si llega
// undefined, Leaflet revienta al armar la URL del tile (usa subdomains.length).
const PROVIDERS: Record<
  ProviderKey,
  { label: string; url: string; attribution: string; maxZoom: number; subdomains: string; detectRetina?: boolean }
> = {
  osm: {
    label: 'Mapa',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    subdomains: 'abc',
  },
  carto: {
    label: 'Relieve',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    subdomains: 'abcd',
    detectRetina: true,
  },
  satelite: {
    label: 'Satélite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Imágenes &copy; Esri, Maxar, Earthstar Geographics',
    maxZoom: 18,
    subdomains: 'abc',
  },
}

const CHAIN: Record<ProviderKey, ProviderKey[]> = {
  osm: ['osm', 'carto'],
  carto: ['carto', 'osm'],
  satelite: ['satelite', 'carto', 'osm'],
}

const MAX_TILE_ERRORS = 3

function useBaseLayer(initial: ProviderKey) {
  const [provider, setProvider] = useState<ProviderKey>(initial)
  const [dead, setDead] = useState<ProviderKey[]>([])
  const [respaldo, setRespaldo] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const errors = useRef(0)
  const deadRef = useRef<ProviderKey[]>([])

  const choose = useCallback((next: ProviderKey) => {
    errors.current = 0
    deadRef.current = []
    setDead([])
    setRespaldo(false)
    setProvider(next)
  }, [])

  const onTileError = useCallback(() => {
    errors.current += 1
    if (errors.current < MAX_TILE_ERRORS) return
    errors.current = 0
    const caidos = deadRef.current
    if (caidos.includes(provider)) return
    const siguiente = CHAIN[provider].find((k) => k !== provider && !caidos.includes(k))
    deadRef.current = [...caidos, provider]
    setDead(deadRef.current)
    if (siguiente) {
      setProvider(siguiente)
      setRespaldo(true)
    }
  }, [provider])

  const todoCaido = (Object.keys(PROVIDERS) as ProviderKey[]).every((key) => dead.includes(key))

  return {
    provider,
    setProvider: choose,
    onTileError,
    todoCaido,
    respaldo,
    attempt,
    retry: () => {
      errors.current = 0
      deadRef.current = []
      setDead([])
      setAttempt((a) => a + 1)
    },
  }
}

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

function MapResizer() {
  const map = useMap()
  useEffect(() => {
    const el = map.getContainer()
    const observer = new ResizeObserver(() => map.invalidateSize({ animate: false }))
    observer.observe(el)
    return () => observer.disconnect()
  }, [map])
  return null
}

function ZoomButtons() {
  const map = useMap()
  const button =
    'flex h-8 w-8 items-center justify-center text-lg font-medium leading-none text-cielo-950 transition-colors hover:bg-piedra-100 disabled:text-piedra-300'
  return (
    <div className="absolute left-3 top-3 z-[500] flex flex-col overflow-hidden rounded-xl border border-piedra-200 bg-white shadow-sm">
      <button className={button} onClick={() => map.zoomIn()} aria-label="Acercar">
        +
      </button>
      <div className="h-px bg-piedra-200" />
      <button className={button} onClick={() => map.zoomOut()} aria-label="Alejar">
        −
      </button>
    </div>
  )
}

function OfflineNotice({ onRetry }: { onRetry: () => void }) {
  const map = useMap()
  const c = map.getCenter()
  const href = `https://www.openstreetmap.org/?mlat=${c.lat.toFixed(5)}&mlon=${c.lng.toFixed(5)}#map=${map.getZoom()}/${c.lat.toFixed(5)}/${c.lng.toFixed(5)}`
  return (
    <div className="absolute inset-0 z-[600] flex items-center justify-center bg-cream/90 p-6">
      <div className="max-w-sm rounded-2xl border border-piedra-200 bg-white p-5 text-center shadow-sm">
        <p className="text-sm font-semibold text-cielo-950">No se pudo cargar el mapa base</p>
        <p className="mt-1.5 text-sm text-piedra-600">
          Tu conexión o un bloqueo del navegador están impediendo descargar los mapas. Podés abrir la
          ubicación en OpenStreetMap o reintentar.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={onRetry}
            className="rounded-full bg-cielo-950 px-4 py-2 text-sm font-semibold text-cream transition-transform hover:scale-[1.03]"
          >
            Reintentar
          </button>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-piedra-300 px-4 py-2 text-sm font-semibold text-cielo-950 transition-colors hover:border-cielo-950"
          >
            Abrir en OSM
          </a>
        </div>
      </div>
    </div>
  )
}

function FitBounds({ items }: { items: MapItem[] }) {
  const map = useMap()
  useEffect(() => {
    if (!items.length) return
    // Leaflet puede medir el contenedor antes de que tenga tamaño final
    // (por ejemplo en la vista lista/mapa del móvil): forzamos el recálculo.
    map.invalidateSize({ animate: false })
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

function LayerToggle({ mode, onChange }: { mode: ProviderKey; onChange: (m: ProviderKey) => void }) {
  return (
    <div className="absolute right-3 top-3 z-[500] flex overflow-hidden rounded-full border border-piedra-200 bg-white shadow-sm">
      {(Object.keys(PROVIDERS) as ProviderKey[]).map((key, index) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors ${
            mode === key ? 'bg-cielo-950 text-cream' : 'text-piedra-700 hover:bg-piedra-100'
          } ${index > 0 ? 'border-l border-piedra-200' : ''}`}
        >
          {index === 0 ? <LayersIcon className="h-3.5 w-3.5" /> : null}
          {PROVIDERS[key].label}
        </button>
      ))}
    </div>
  )
}

function BaseTiles({
  provider,
  onTileError,
  attempt,
}: {
  provider: ProviderKey
  onTileError: () => void
  attempt: number
}) {
  const tile = PROVIDERS[provider]
  const eventHandlers = useMemo(() => ({ tileerror: onTileError }), [onTileError])
  return (
    <TileLayer
      key={`${provider}-${attempt}`}
      url={tile.url}
      attribution={tile.attribution}
      subdomains={tile.subdomains ?? 'abc'}
      maxZoom={tile.maxZoom}
      detectRetina={tile.detectRetina}
      eventHandlers={eventHandlers}
    />
  )
}

function ProviderNote({ respaldo }: { respaldo: boolean }) {
  if (!respaldo) return null
  return (
    <p className="absolute bottom-6 left-3 z-[500] rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-piedra-600 shadow-sm">
      El proveedor anterior no respondió: se muestra el mapa de respaldo.
    </p>
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
  const tiles = useBaseLayer('osm')
  const center = useMemo<[number, number]>(() => items[0]?.position ?? [-31.7, -64.6], [items])

  return (
    <div className={`relative isolate min-h-[320px] ${className}`}>
      <MapContainer
        center={center}
        zoom={10}
        minZoom={6}
        scrollWheelZoom={scrollWheelZoom}
        zoomControl={false}
        className="h-full w-full"
      >
        <BaseTiles provider={tiles.provider} onTileError={tiles.onTileError} attempt={tiles.attempt} />
        <MapResizer />
        <ZoomButtons />
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

        {tiles.todoCaido ? <OfflineNotice onRetry={tiles.retry} /> : null}
      </MapContainer>
      <LayerToggle mode={tiles.provider} onChange={tiles.setProvider} />
      <ProviderNote respaldo={tiles.respaldo} />
    </div>
  )
}

function RouteLine({ points }: { points: [number, number][] }) {
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

/** Reencuadra el mapa cuando cambia el punto elegido. */
function Recenter({ position, zoom }: { position: [number, number] | null; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.setView(position, Math.max(map.getZoom(), zoom), { animate: true })
  }, [position, zoom, map])
  return null
}

const draftIcon = () =>
  L.divIcon({
    className: 'serrana-pin-wrap serrana-pin-draft',
    html: '<span class="serrana-dot is-draft"></span>',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })

/**
 * Mapa para que el usuario marque dónde queda su lugar o por dónde
 * pasa su ruta. Un clic sobre el mapa deja el pin donde se hizo.
 */
export function LocationPicker({
  value,
  onChange,
  className = '',
  zoom = 11,
}: {
  value: [number, number] | null
  onChange: (position: [number, number]) => void
  className?: string
  zoom?: number
}) {
  const tiles = useBaseLayer('osm')
  const center: [number, number] = value ?? [-31.7, -64.6]

  return (
    <div className={`relative isolate min-h-[280px] overflow-hidden ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        scrollWheelZoom={false}
        className="h-full w-full cursor-crosshair"
      >
        <BaseTiles provider={tiles.provider} onTileError={tiles.onTileError} attempt={tiles.attempt} />
        <MapResizer />
        <ZoomButtons />
        <Recenter position={value} zoom={zoom} />
        {value ? (
          <Marker
            position={value}
            icon={draftIcon()}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng()
                onChange([Number(lat.toFixed(6)), Number(lng.toFixed(6))])
              },
            }}
          />
        ) : null}
        <MapClickHandler onChange={onChange} />
        {tiles.todoCaido ? <OfflineNotice onRetry={tiles.retry} /> : null}
      </MapContainer>
      <LayerToggle mode={tiles.provider} onChange={tiles.setProvider} />
    </div>
  )
}

function MapClickHandler({ onChange }: { onChange: (position: [number, number]) => void }) {
  const map = useMap()
  useEffect(() => {
    const onClick = (e: L.LeafletMouseEvent) => {
      onChange([Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6))])
    }
    map.on('click', onClick)
    return () => {
      map.off('click', onClick)
    }
  }, [map, onChange])
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
  const tiles = useBaseLayer('osm')
  return (
    <div className={`relative isolate min-h-[280px] overflow-hidden ${className}`}>
      <MapContainer
        center={position}
        zoom={zoom}
        zoomControl={false}
        scrollWheelZoom={Boolean(children)}
        dragging={Boolean(children)}
        className="h-full w-full"
      >
        <BaseTiles provider={tiles.provider} onTileError={tiles.onTileError} attempt={tiles.attempt} />
        <MapResizer />
        <ZoomButtons />
        {trail?.length ? <RouteLine points={trail} /> : null}
        <Marker position={position} icon={label ? pinIcon(label, true) : dotIcon()} />
        {tiles.todoCaido ? <OfflineNotice onRetry={tiles.retry} /> : null}
      </MapContainer>
      <LayerToggle mode={tiles.provider} onChange={tiles.setProvider} />
      <ProviderNote respaldo={tiles.respaldo} />
    </div>
  )
}
