import { useMemo, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import {
  PanelShell,
  StatGrid,
  StatusBadge,
  SectionLabel,
  RowLink,
  RatingInline,
  Money,
  formatDate,
  EmptyState,
} from '../components/panel'
import { publicaciones, enviarSolicitud, solicitudesStore, type EstadoSolicitud } from '../data/panel'
import { categoryLabel, difficultyColor, properties, trails, type Property, type Trail } from '../data/demo'
import { InboxIcon, TentIcon, WalkIcon, SparkIcon, ArrowLeftIcon, CheckIcon } from '../components/Icons'
import { useUsuario } from '../components/AuthGuard'

type Tab = 'espacios' | 'rutas' | 'solicitud'

const tabs: { id: Tab; label: string }[] = [
  { id: 'espacios', label: 'Mis espacios' },
  { id: 'rutas', label: 'Mis rutas' },
  { id: 'solicitud', label: 'Sumar otro lugar' },
]

const solicitudEstadoLabel: Record<EstadoSolicitud, string> = {
  pendiente: 'En revisión',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
}

const solicitudEstadoClass: Record<EstadoSolicitud, string> = {
  pendiente: 'bg-sand-200 text-earth-700',
  aprobada: 'bg-forest-100 text-forest-700',
  rechazada: 'bg-piedra-100 text-piedra-700',
}

export default function Owner() {
  const [tab, setTab] = useState<Tab>('espacios')
  const usuario = useUsuario()
  const enviados = useSyncExternalStore(solicitudesStore.subscribe, solicitudesStore.get, () => [])

  const mias = enviados.filter((s) => s.usuarioId === usuario?.id)

  // Los lugares del inventario demo que administra esta cuenta.
  const mios = useMemo(
    () => publicaciones.filter((p) => p.duenio === usuario?.id),
    [usuario?.id],
  )

  const espacios = mios
    .filter((p) => p.tipo === 'espacio')
    .map((p) => ({ pub: p, lugar: properties.find((x) => x.id === p.refId) }))
    .filter((r): r is { pub: (typeof mios)[number]; lugar: Property } => Boolean(r.lugar))

  const rutas = mios
    .filter((p) => p.tipo === 'ruta')
    .map((p) => ({ pub: p, lugar: trails.find((x) => x.id === p.refId) }))
    .filter((r): r is { pub: (typeof mios)[number]; lugar: Trail } => Boolean(r.lugar))

  const resumen = [
    { label: 'Publicados', value: mios.filter((p) => p.estado === 'publicado').length, hint: 'visibles' },
    { label: 'En revisión', value: mios.filter((p) => p.estado === 'revision').length, hint: 'a la espera' },
    {
      label: 'Borradores',
      value: mios.filter((p) => p.estado === 'borrador').length,
      hint: 'sin publicar',
    },
    {
      label: 'Solicitudes',
      value: mias.length,
      hint: mias.length === 1 ? 'enviada' : 'enviadas',
    },
  ]

  if (!usuario) return null

  return (
    <PanelShell
      eyebrow="Panel del cliente"
      title={usuario.nombre}
      subtitle={`${usuario.region} · cuenta creada el ${formatDate(usuario.creado)}. Acá ves lo que cargaste y el estado de cada publicación.`}
      actions={
        usuario.rol === 'admin' ? (
          <Link
            to="/admin"
            className="rounded-full border border-piedra-300 px-4 py-2 text-xs font-semibold text-piedra-700 transition-colors hover:border-piedra-500"
          >
            Ver administración
          </Link>
        ) : (
          <Link
            to="/"
            className="rounded-full border border-piedra-300 px-4 py-2 text-xs font-semibold text-piedra-700 transition-colors hover:border-piedra-500"
          >
            Volver al sitio
          </Link>
        )
      }
    >
      <StatGrid stats={resumen} />

      <div className="mt-8 flex gap-1 overflow-x-auto border-b border-piedra-200 pb-px">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.id
                ? 'border-cielo-950 text-cielo-950'
                : 'border-transparent text-piedra-500 hover:text-cielo-950'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'espacios' && (
          <section className="space-y-4">
            <SectionLabel count={espacios.length}>Espacios</SectionLabel>
            {espacios.length === 0 ? (
              <EmptyState
                title="Todavía no cargaste espacios"
                desc="Usá la pestaña “Sumar otro lugar” para enviar tu primer espacio a revisión."
              />
            ) : (
              <ul className="rounded-2xl border border-piedra-200 bg-white px-5">
                {espacios.map(({ pub, lugar }) => (
                  <li key={pub.id}>
                    <RowLink to={`/property/${lugar.id}`}>
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1.5">
                        <img src={lugar.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-cielo-950 sm:truncate">{lugar.name}</p>
                          <p className="text-xs leading-relaxed text-piedra-500 sm:truncate">
                            {categoryLabel[lugar.category]} · {lugar.location} · {lugar.capacity} huéspedes
                          </p>
                        </div>
                        <div className="ml-auto flex items-center gap-3">
                          <RatingInline value={lugar.rating} />
                          <Money value={lugar.pricePerNight} />
                          <span className="hidden text-xs text-piedra-400 sm:inline">
                            alta {formatDate(pub.alta)}
                          </span>
                          <StatusBadge estado={pub.estado} />
                        </div>
                      </div>
                    </RowLink>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === 'rutas' && (
          <section className="space-y-4">
            <SectionLabel count={rutas.length}>Rutas</SectionLabel>
            {rutas.length === 0 ? (
              <EmptyState
                title="Todavía no cargaste rutas"
                desc="Podés proponer un sendero o una salida guiada desde la pestaña “Sumar otro lugar”."
              />
            ) : (
              <ul className="rounded-2xl border border-piedra-200 bg-white px-5">
                {rutas.map(({ pub, lugar }) => (
                  <li key={pub.id}>
                    <RowLink to={`/trail/${lugar.id}`}>
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1.5">
                        <img src={lugar.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-cielo-950 sm:truncate">{lugar.name}</p>
                          <p className="text-xs leading-relaxed text-piedra-500 sm:truncate">
                            {lugar.region} · {lugar.location}
                          </p>
                        </div>
                        <div className="ml-auto flex items-center gap-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              difficultyColor[lugar.difficulty]
                            }`}
                          >
                            {lugar.difficulty}
                          </span>
                          <span className="text-xs text-piedra-600">{lugar.distanceKm} km</span>
                          <span className="text-xs text-piedra-400">{lugar.durationH} h</span>
                          <RatingInline value={lugar.rating} />
                          <span className="hidden text-xs text-piedra-400 sm:inline">
                            alta {formatDate(pub.alta)}
                          </span>
                          <StatusBadge estado={pub.estado} />
                        </div>
                      </div>
                    </RowLink>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === 'solicitud' && (
          <section className="max-w-2xl space-y-4">
            <SectionLabel count={mias.length}>Sumar un lugar</SectionLabel>

            {mias.length > 0 && (
              <ul className="space-y-2">
                {mias.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-piedra-200 bg-white px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-cielo-950">{s.lugar}</p>
                      <p className="truncate text-xs text-piedra-500">
                        {s.tipo} · {s.region} · enviada el {formatDate(s.fecha)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        solicitudEstadoClass[s.estado]
                      }`}
                    >
                      {solicitudEstadoLabel[s.estado]}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <SolicitudForm usuario={usuario} />

            <p className="flex items-start gap-2 text-xs leading-relaxed text-piedra-500">
              <InboxIcon className="mt-0.5 h-4 w-4 shrink-0" />
              La solicitud queda guardada en este navegador y aparece en el panel de la administración.
              Cuando exista el servidor, se enviará por la API.
            </p>
          </section>
        )}
      </div>

      <aside className="mt-12 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-piedra-200 bg-cream-dark/60 px-5 py-4 text-xs text-piedra-600">
        <span>
          Sesión de {usuario.email} · rol {usuario.rol === 'admin' ? 'administración' : 'cliente'}
        </span>
        <Link to="/explore" className="inline-flex items-center gap-1.5 font-semibold text-cielo-950">
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Volver a explorar
        </Link>
      </aside>
    </PanelShell>
  )
}

function SolicitudForm({ usuario }: { usuario: NonNullable<ReturnType<typeof useUsuario>> }) {
  const [tipo, setTipo] = useState<'espacio' | 'ruta' | 'experiencia'>('espacio')
  const [listo, setListo] = useState(false)

  const tipos = [
    { id: 'espacio' as const, label: 'Espacio', desc: 'Cabaña, domo, camping o vanlife', Icon: TentIcon },
    { id: 'ruta' as const, label: 'Ruta', desc: 'Sendero o trekking guiado', Icon: WalkIcon },
    {
      id: 'experiencia' as const,
      label: 'Experiencia',
      desc: 'Astronomía, kayak, chevalley',
      Icon: SparkIcon,
    },
  ]

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const datos = new FormData(e.currentTarget)
    enviarSolicitud({
      usuarioId: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      tipo,
      region: String(datos.get('region')),
      lugar: String(datos.get('nombre')),
      mensaje: String(datos.get('mensaje')),
    })
    e.currentTarget.reset()
    setListo(true)
  }

  return (
    <form
      onSubmit={enviar}
      className="space-y-6 rounded-2xl border border-piedra-200 bg-white p-6"
    >
      <fieldset>
        <legend className="text-sm font-semibold text-cielo-950">¿Qué querés sumar?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {tipos.map(({ id, label, desc, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTipo(id)}
              className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                tipo === id
                  ? 'border-cielo-950 bg-cream-dark'
                  : 'border-piedra-200 hover:border-piedra-400'
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-cielo-950">
                <Icon className="h-4 w-4" />
                {label}
              </span>
              <span className="mt-1 block text-xs text-piedra-500">{desc}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-piedra-500">Nombre</span>
          <input
            required
            name="nombre"
            placeholder="Cabaña Los Nogales"
            className="mt-1.5 w-full rounded-xl border border-piedra-200 px-3.5 py-2.5 text-sm outline-none focus:border-cielo-950"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-piedra-500">Región</span>
          <select
            name="region"
            className="mt-1.5 w-full rounded-xl border border-piedra-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-cielo-950"
          >
            <option>Calamuchita</option>
            <option>Punilla</option>
            <option>Traslasierra</option>
            <option>Sierras del Sur</option>
            <option>Paravachasca</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wider text-piedra-500">
          Contanos del lugar
        </span>
        <textarea
          required
          name="mensaje"
          rows={4}
          placeholder="Capacidad, servicios, acceso, temporada..."
          className="mt-1.5 w-full resize-none rounded-xl border border-piedra-200 px-3.5 py-2.5 text-sm outline-none focus:border-cielo-950"
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wider text-piedra-500">Contacto</span>
        <input
          required
          name="contacto"
          type="email"
          defaultValue={usuario.email}
          className="mt-1.5 w-full rounded-xl border border-piedra-200 px-3.5 py-2.5 text-sm outline-none focus:border-cielo-950"
        />
      </label>

      <div className="flex items-center justify-between gap-4 border-t border-piedra-200 pt-4">
        <p className="text-xs text-piedra-500">
          {listo ? 'Listo, la solicitud quedó registrada.' : 'Revisión en 3 a 5 días hábiles.'}
        </p>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-cielo-950 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cielo-900"
        >
          <CheckIcon className="h-4 w-4" />
          Enviar a revisión
        </button>
      </div>
    </form>
  )
}
