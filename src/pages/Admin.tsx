import { useMemo, useState } from 'react'
import {
  PanelShell,
  StatGrid,
  StatusBadge,
  SectionLabel,
  RowLink,
  RatingInline,
  Money,
  formatDate,
} from '../components/panel'
import {
  cuentaById,
  cuentas,
  estadoLabel,
  publicaciones,
  solicitudes,
  type Publicacion,
  type PublicacionEstado,
} from '../data/panel'
import {
  adventureCategories,
  categoryLabel,
  difficultyColor,
  experiences,
  properties,
  trails,
  type Property,
  type Trail,
} from '../data/demo'
import { TentIcon, WalkIcon, SparkIcon, CheckIcon, CloseIcon } from '../components/Icons'

type Tab = 'espacios' | 'rutas' | 'cuentas' | 'solicitudes'

const tabs: { id: Tab; label: string }[] = [
  { id: 'espacios', label: 'Espacios' },
  { id: 'rutas', label: 'Rutas' },
  { id: 'cuentas', label: 'Cuentas' },
  { id: 'solicitudes', label: 'Solicitudes' },
]

export default function Admin() {
  const [tab, setTab] = useState<Tab>('espacios')
  const [filtro, setFiltro] = useState<PublicacionEstado | 'todas'>('todas')
  const [resueltas, setResueltas] = useState<Record<string, 'aprobada' | 'rechazada'>>({})

  const espacios = useMemo(
    () =>
      publicaciones
        .filter((p) => p.tipo === 'espacio' && (filtro === 'todas' || filtro === p.estado))
        .map((p) => ({ pub: p, lugar: properties.find((x) => x.id === p.refId) }))
        .filter((r): r is { pub: Publicacion; lugar: Property } => Boolean(r.lugar)),
    [filtro],
  )

  const rutas = useMemo(
    () =>
      publicaciones
        .filter((p) => p.tipo === 'ruta' && (filtro === 'todas' || filtro === p.estado))
        .map((p) => ({ pub: p, lugar: trails.find((x) => x.id === p.refId) }))
        .filter((r): r is { pub: Publicacion; lugar: Trail } => Boolean(r.lugar)),
    [filtro],
  )

  const pendientes = solicitudes.filter((s) => (resueltas[s.id] ? false : s.estado === 'pendiente'))

  const resumen = useMemo(() => {
    const porEstado = (e: PublicacionEstado) => publicaciones.filter((p) => p.estado === e).length
    return [
      { label: 'Publicados', value: porEstado('publicado'), hint: 'visibles en el sitio' },
      { label: 'En revisión', value: porEstado('revision'), hint: 'esperando tu.ok' },
      { label: 'Cuentas', value: cuentas.length, hint: 'clientes activos' },
      { label: 'Solicitudes', value: pendientes.length, hint: 'por responder' },
    ]
  }, [pendientes.length])

  return (
    <PanelShell
      eyebrow="Tu panel"
      title="Quiénes se suman a Serrana"
      subtitle="Espacios y rutas publicados por cada cliente, cuentas dadas de alta y solicitudes pendientes de responder. Los números salen de los registros cargados."
      actions={
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-piedra-200 bg-white p-1">
            {(['todas', 'publicado', 'revision', 'borrador'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  filtro === f ? 'bg-cielo-950 text-cream' : 'text-piedra-700 hover:bg-piedra-100'
                }`}
              >
                {f === 'todas' ? 'Todos' : estadoLabel[f]}
              </button>
            ))}
          </div>
        </div>
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
            {t.id === 'solicitudes' && pendientes.length > 0 ? (
              <span className="ml-2 rounded-full bg-earth-500 px-1.5 py-0.5 text-[10px] font-bold text-cream">
                {pendientes.length}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'espacios' && (
          <section className="space-y-4">
            <SectionLabel count={espacios.length}>Espacios</SectionLabel>
            {espacios.length === 0 ? (
              <p className="text-sm text-piedra-500">No hay espacios en este estado.</p>
            ) : (
              <ul className="rounded-2xl border border-piedra-200 bg-white px-5">
                {espacios.map(({ pub, lugar }) => {
                  const duenio = cuentaById(pub.duenio)
                  return (
                    <li key={pub.id}>
                      <RowLink to={`/property/${lugar.id}`}>
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                          <img
                            src={lugar.image}
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-cielo-950 sm:truncate">{lugar.name}</p>
                            <p className="text-xs leading-relaxed text-piedra-500 sm:truncate">
                              {categoryLabel[lugar.category]} · {lugar.location} · {duenio?.nombre}
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
                  )
                })}
              </ul>
            )}
          </section>
        )}

        {tab === 'rutas' && (
          <section className="space-y-4">
            <SectionLabel count={rutas.length}>Rutas</SectionLabel>
            {rutas.length === 0 ? (
              <p className="text-sm text-piedra-500">No hay rutas en este estado.</p>
            ) : (
              <ul className="rounded-2xl border border-piedra-200 bg-white px-5">
                {rutas.map(({ pub, lugar }) => {
                  const duenio = cuentaById(pub.duenio)
                  return (
                    <li key={pub.id}>
                      <RowLink to={`/trail/${lugar.id}`}>
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                          <img
                            src={lugar.image}
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-cielo-950 sm:truncate">{lugar.name}</p>
                            <p className="text-xs leading-relaxed text-piedra-500 sm:truncate">
                              {lugar.region} · {lugar.location} · {duenio?.nombre}
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
                            <RatingInline value={lugar.rating} />
                            <span className="hidden text-xs text-piedra-400 sm:inline">
                              alta {formatDate(pub.alta)}
                            </span>
                            <StatusBadge estado={pub.estado} />
                          </div>
                        </div>
                      </RowLink>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )}

        {tab === 'cuentas' && (
          <section className="space-y-4">
            <SectionLabel count={cuentas.length}>Cuentas de clientes</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cuentas.map((c) => {
                const suyas = publicaciones.filter((p) => p.duenio === c.id)
                return (
                  <article key={c.id} className="rounded-2xl border border-piedra-200 bg-white p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-cielo-950">{c.nombre}</p>
                        <p className="text-xs text-piedra-500">{c.contacto}</p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          c.estado === 'activo' ? 'bg-forest-100 text-forest-700' : 'bg-sand-200 text-earth-700'
                        }`}
                      >
                        {c.estado === 'activo' ? 'Activa' : 'En revisión'}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-piedra-500">
                      {c.region} · desde {formatDate(c.desde)}
                    </p>
                    <ul className="mt-3 space-y-1.5 border-t border-piedra-200 pt-3">
                      {suyas.map((p) => {
                        const nombre =
                          properties.find((x) => x.id === p.refId)?.name ??
                          trails.find((x) => x.id === p.refId)?.name ??
                          '—'
                        return (
                          <li key={p.id} className="flex items-center justify-between gap-3 text-xs">
                            <span className="truncate text-piedra-700">{nombre}</span>
                            <StatusBadge estado={p.estado} />
                          </li>
                        )
                      })}
                    </ul>
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {tab === 'solicitudes' && (
          <section className="space-y-4">
            <SectionLabel count={solicitudes.length}>Solicitudes para publicar</SectionLabel>
            {solicitudes.length === 0 ? (
              <p className="text-sm text-piedra-500">No hay solicitudes.</p>
            ) : (
              <ul className="space-y-3">
                {solicitudes.map((s) => {
                  const Icon = s.tipo === 'ruta' ? WalkIcon : s.tipo === 'espacio' ? TentIcon : SparkIcon
                  const resuelta = resueltas[s.id]
                  return (
                    <li key={s.id} className="rounded-2xl border border-piedra-200 bg-white p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex min-w-0 gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream-dark text-cielo-950">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-cielo-950">{s.nombre}</p>
                            <p className="text-xs text-piedra-500">
                              {s.contacto} · {s.region} · {formatDate(s.fecha)}
                            </p>
                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-piedra-700">{s.mensaje}</p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {resuelta ? (
                            <span
                              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                resuelta === 'aprobada'
                                  ? 'bg-forest-100 text-forest-700'
                                  : 'bg-piedra-100 text-piedra-700'
                              }`}
                            >
                              {resuelta === 'aprobada' ? <CheckIcon className="h-3.5 w-3.5" /> : <CloseIcon className="h-3.5 w-3.5" />}
                              {resuelta === 'aprobada' ? 'Aprobada' : 'Rechazada'}
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => setResueltas((r) => ({ ...r, [s.id]: 'rechazada' }))}
                                className="rounded-full border border-piedra-300 px-3.5 py-1.5 text-xs font-semibold text-piedra-700 transition-colors hover:border-piedra-500"
                              >
                                Rechazar
                              </button>
                              <button
                                onClick={() => setResueltas((r) => ({ ...r, [s.id]: 'aprobada' }))}
                                className="rounded-full bg-cielo-950 px-3.5 py-1.5 text-xs font-semibold text-cream transition-colors hover:bg-cielo-900"
                              >
                                Aprobar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )}
      </div>

      <aside className="mt-12 rounded-2xl border border-piedra-200 bg-cream-dark/60 px-5 py-4 text-xs leading-relaxed text-piedra-600">
        Inventario de demostración: {properties.length} espacios, {trails.length} rutas,{' '}
        {experiences.length} experiencias y {adventureCategories.length} categorías. Cuando exista la API,
        estas mismas listas se llenan desde el servidor.
      </aside>
    </PanelShell>
  )
}
