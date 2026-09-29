import { useMemo, useState, useSyncExternalStore } from 'react'
import { useNavigate } from 'react-router-dom'
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
  resolverSolicitud,
  solicitudes,
  solicitudesStore,
  type Publicacion,
  type PublicacionEstado,
} from '../data/panel'
import { listarUsuarios, salir, usuariosStore } from '../data/auth'
import {
  cambiarEstadoPublicacion,
  donde,
  estadoPublicacionClass,
  estadoPublicacionLabel,
  publicacionesStore,
  tipoPorId,
  type Publicacion as PublicacionReal,
} from '../data/publicaciones'
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
import { estadoPedidoClass, estadoPedidoLabel, pedidosStore, responderPedido } from '../data/pedidos'
import { TentIcon, WalkIcon, SparkIcon, CheckIcon, CloseIcon, PinIcon } from '../components/Icons'

type Tab = 'cargadas' | 'pedidos' | 'espacios' | 'rutas' | 'cuentas' | 'solicitudes'

const tabs: { id: Tab; label: string }[] = [
  { id: 'cargadas', label: 'Cargadas por usuarios' },
  { id: 'pedidos', label: 'Pedidos de servicio' },
  { id: 'espacios', label: 'Espacios' },
  { id: 'rutas', label: 'Rutas' },
  { id: 'cuentas', label: 'Cuentas' },
  { id: 'solicitudes', label: 'Solicitudes' },
]

export default function Admin() {
  const [tab, setTab] = useState<Tab>('cargadas')
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState<PublicacionEstado | 'todas'>('todas')
  const [resueltas, setResueltas] = useState<Record<string, 'aprobada' | 'rechazada'>>({})
  const [nota, setNota] = useState<Record<string, string>>({})

  const enviadas = useSyncExternalStore(solicitudesStore.subscribe, solicitudesStore.get, () => [])
  const versionUsuarios = useSyncExternalStore(usuariosStore.subscribe, usuariosStore.get, () => 0)
  const registradas = useMemo(() => listarUsuarios().filter((u) => u.rol === 'cliente'), [versionUsuarios])

  const cargadas = useSyncExternalStore(publicacionesStore.subscribe, publicacionesStore.get, () => [])
  const porRevisar = cargadas.filter((p) => p.estado === 'revision')

  const todosPedidos = useSyncExternalStore(pedidosStore.subscribe, pedidosStore.get, () => [])
  const pedidosAbiertos = todosPedidos.filter((p) => p.estado === 'pendiente')
  const [respuestasPedido, setRespuestasPedido] = useState<Record<string, string>>({})

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

  const pendientesDemo = solicitudes.filter(
    (s) => (resueltas[s.id] ? false : s.estado === 'pendiente'),
  )
  const pendientesReales = enviadas.filter((s) => s.estado === 'pendiente')
  const pendientes = pendientesDemo.length + pendientesReales.length

  const resumen = useMemo(() => {
    const porEstado = (e: PublicacionEstado) => publicaciones.filter((p) => p.estado === e).length
    return [
      { label: 'Publicados', value: porEstado('publicado') + cargadas.filter((p) => p.estado === 'publicado').length, hint: 'visibles en el sitio' },
      { label: 'En revisión', value: porRevisar.length, hint: 'esperando tu ok' },
      { label: 'Cuentas', value: cuentas.length + registradas.length, hint: 'de clientes' },
      { label: 'Solicitudes', value: pendientes, hint: 'por responder' },
      { label: 'Pedidos', value: pedidosAbiertos.length, hint: 'de clientes' },
    ]
  }, [pendientes, registradas.length, cargadas, porRevisar.length, pedidosAbiertos.length])

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
            {t.id === 'solicitudes' && pendientes > 0 ? (
              <span className="ml-2 rounded-full bg-earth-500 px-1.5 py-0.5 text-[10px] font-bold text-cream">
                {pendientes}
              </span>
            ) : null}
            {t.id === 'pedidos' && pedidosAbiertos.length > 0 ? (
              <span className="ml-2 rounded-full bg-earth-500 px-1.5 py-0.5 text-[10px] font-bold text-cream">
                {pedidosAbiertos.length}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'cargadas' && (
          <section className="space-y-4">
            <SectionLabel count={cargadas.length}>Cargadas por usuarios</SectionLabel>
            {cargadas.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-piedra-300 px-6 py-10 text-center text-sm text-piedra-500">
                Todavía no cargó nadie un espacio o una ruta. Cuando lo hagan, lo vas a ver acá para
                aprobarlo y que aparezca en el mapa del sitio.
              </p>
            ) : (
              <ul className="space-y-3">
                {cargadas.map((p) => (
                  <RevisionCard
                    key={p.id}
                    pub={p}
                    nota={nota[p.id] ?? ''}
                    onNota={(v) => setNota((n) => ({ ...n, [p.id]: v }))}
                  />
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === 'pedidos' && (
          <section className="space-y-4">
            <SectionLabel count={todosPedidos.length}>Pedidos de servicio</SectionLabel>
            {todosPedidos.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-piedra-300 px-6 py-10 text-center text-sm text-piedra-500">
                Todavía nadie pediu un servicio. Cuando un cliente que solo contrata mande uno, lo vas a
                ver acá con su correo para responderle.
              </p>
            ) : (
              <ul className="space-y-3">
                {todosPedidos.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-2xl border border-piedra-200 bg-white px-5 py-4"
                  >
                    <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-cielo-950">{p.necesita}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-piedra-500">
                          {tipoPorId(p.tipo).label} · {p.donde || 'sin localidad'} ·{' '}
                          {p.desde ? `desde ${formatDate(p.desde)}` : 'sin fecha'} ·{' '}
                          {p.personas ? `${p.personas} personas` : 'sin dato de personas'}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-piedra-600">{p.mensaje}</p>
                        <p className="mt-1.5 text-[11px] text-piedra-400">
                          {p.clienteNombre} · {p.clienteEmail} · pedido el {formatDate(p.fecha)}
                        </p>
                        {p.respuesta ? (
                          <p className="mt-2 rounded-lg bg-forest-50 px-3 py-2 text-xs leading-relaxed text-forest-700">
                            Tu respuesta: {p.respuesta}
                          </p>
                        ) : null}
                      </div>
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${estadoPedidoClass[p.estado]}`}
                      >
                        {estadoPedidoLabel[p.estado]}
                      </span>
                    </div>

                    {p.estado === 'pendiente' ? (
                      <div className="mt-4 border-t border-piedra-200 pt-4">
                        <label className="block">
                          <span className="text-xs font-medium uppercase tracking-wider text-piedra-500">
                            Respuesta para {p.clienteNombre}
                          </span>
                          <textarea
                            rows={2}
                            value={respuestasPedido[p.id] ?? ''}
                            onChange={(e) =>
                              setRespuestasPedido((r) => ({ ...r, [p.id]: e.target.value }))
                            }
                            placeholder={`Hola ${p.clienteNombre.split(' ')[0]}, tenemos lugar para esas fechas...`}
                            className="mt-1.5 w-full rounded-xl border border-piedra-200 px-3.5 py-2.5 text-sm outline-none focus:border-cielo-950"
                          />
                        </label>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => responderPedido(p.id, 'confirmado', respuestasPedido[p.id] ?? '')}
                            className="inline-flex items-center gap-1.5 rounded-full bg-cielo-950 px-3.5 py-2 text-xs font-semibold text-cream transition-colors hover:bg-cielo-900"
                          >
                            <CheckIcon className="h-3.5 w-3.5" />
                            Confirmar
                          </button>
                          <button
                            onClick={() => responderPedido(p.id, 'rechazado', respuestasPedido[p.id] ?? '')}
                            className="inline-flex items-center gap-1.5 rounded-full border border-piedra-300 px-3.5 py-2 text-xs font-semibold text-piedra-700 transition-colors hover:border-cielo-950"
                          >
                            <CloseIcon className="h-3.5 w-3.5" />
                            No se puede
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

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
          <section className="space-y-8">
            <div>
              <SectionLabel count={registradas.length}>Cuentas creadas por usuarios</SectionLabel>
              {registradas.length === 0 ? (
                <p className="mt-4 rounded-2xl border border-dashed border-piedra-300 px-6 py-8 text-center text-sm text-piedra-500">
                  Todavía no se creó ninguna cuenta. Se registran solas desde “Entrar o crear cuenta”.
                </p>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {registradas.map((u) => {
                    const suyas = enviadas.filter((s) => s.usuarioId === u.id)
                    return (
                      <article
                        key={u.id}
                        className="rounded-2xl border border-piedra-200 bg-white p-5"
                      >
                        <div className="flex items-start gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cielo-950 text-xs font-bold text-cream">
                            {u.nombre
                              .split(' ')
                              .slice(0, 2)
                              .map((p) => p[0]?.toUpperCase())
                              .join('')}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-cielo-950">{u.nombre}</p>
                            <p className="truncate text-xs text-piedra-500">{u.email}</p>
                            <p className="mt-1 inline-block rounded-full bg-piedra-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-piedra-700">
                              Cliente
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 text-xs text-piedra-500">
                          {u.region} · desde {formatDate(u.creado)}
                        </p>
                        <p className="mt-3 border-t border-piedra-200 pt-3 text-xs text-piedra-600">
                          {suyas.length === 0
                            ? 'Sin solicitudes enviadas.'
                            : `${suyas.length} ${suyas.length === 1 ? 'solicitud' : 'solicitudes'} en el sistema.`}
                        </p>
                      </article>
                    )
                  })}
                </div>
              )}
            </div>

            <div>
              <SectionLabel count={cuentas.length}>Cuentas del inventario de demostración</SectionLabel>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

            <div className="pt-4">
              <SectionLabel count={enviadas.length}>Enviadas desde los paneles de cliente</SectionLabel>
              {enviadas.length === 0 ? (
                <p className="mt-4 rounded-2xl border border-dashed border-piedra-300 px-6 py-8 text-center text-sm text-piedra-500">
                  Nadie mandó una solicitud todavía. Aparecen acá apenas un cliente usa el formulario.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {enviadas.map((s) => {
                    const Icon = s.tipo === 'ruta' ? WalkIcon : s.tipo === 'espacio' ? TentIcon : SparkIcon
                    return (
                      <li key={s.id} className="rounded-2xl border border-piedra-200 bg-white p-5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex min-w-0 gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cielo-950 text-cream">
                              <Icon className="h-5 w-5" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-cielo-950">{s.lugar}</p>
                              <p className="text-xs text-piedra-500">
                                {s.nombre} · {s.email} · {s.region} · {formatDate(s.fecha)}
                              </p>
                              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-piedra-700">
                                {s.mensaje}
                              </p>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {s.estado === 'pendiente' ? (
                              <>
                                <button
                                  onClick={() => resolverSolicitud(s.id, 'rechazada')}
                                  className="rounded-full border border-piedra-300 px-3.5 py-1.5 text-xs font-semibold text-piedra-700 transition-colors hover:border-piedra-500"
                                >
                                  Rechazar
                                </button>
                                <button
                                  onClick={() => resolverSolicitud(s.id, 'aprobada')}
                                  className="rounded-full bg-cielo-950 px-3.5 py-1.5 text-xs font-semibold text-cream transition-colors hover:bg-cielo-900"
                                >
                                  Aprobar
                                </button>
                              </>
                            ) : (
                              <span
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                  s.estado === 'aprobada'
                                    ? 'bg-forest-100 text-forest-700'
                                    : 'bg-piedra-100 text-piedra-700'
                                }`}
                              >
                                {s.estado === 'aprobada' ? (
                                  <CheckIcon className="h-3.5 w-3.5" />
                                ) : (
                                  <CloseIcon className="h-3.5 w-3.5" />
                                )}
                                {s.estado === 'aprobada' ? 'Aprobada' : 'Rechazada'}
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </section>
        )}
      </div>

      <aside className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-piedra-200 bg-cream-dark/60 px-5 py-4 text-xs leading-relaxed text-piedra-600">
        <span>
          Inventario de demostración: {properties.length} espacios, {trails.length} rutas,{' '}
          {experiences.length} experiencias y {adventureCategories.length} categorías. Cuando exista la API,
          estas mismas listas se llenan desde el servidor.
        </span>
        <button
          onClick={() => {
            salir()
            navigate('/')
          }}
          className="shrink-0 font-semibold text-piedra-600 underline underline-offset-4 transition-colors hover:text-cielo-950"
        >
          Salir de mi cuenta
        </button>
      </aside>
    </PanelShell>
  )
}

// ============================================================
// Ficha de revisión de lo que cargó un cliente
// ============================================================

function RevisionCard({
  pub,
  nota,
  onNota,
}: {
  pub: PublicacionReal
  nota: string
  onNota: (v: string) => void
}) {
  const [abierto, setAbierto] = useState(false)
  const tipo = tipoPorId(pub.tipo)
  const detalles = [
    tipo.label,
    pub.categoria,
    donde(pub),
    pub.direccion,
    pub.tipo === 'espacio' && pub.capacidad !== null ? `${pub.capacidad} huéspedes` : null,
    pub.precio !== null ? `USD ${pub.precio} ${pub.unidad}` : null,
    pub.distanciaKm !== null ? `${pub.distanciaKm} km` : null,
    pub.dificultad ? `Dificultad ${pub.dificultad}` : null,
    pub.servicios.length ? pub.servicios.join(', ') : null,
  ].filter(Boolean) as string[]

  return (
    <li className="rounded-2xl border border-piedra-200 bg-white px-5 py-4">
      <div className="flex min-w-0 flex-1 flex-wrap items-start gap-x-4 gap-y-2">
        {pub.fotos[0] ? (
          <img
            src={pub.fotos[0]}
            alt=""
            className="h-16 w-16 shrink-0 rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.style.visibility = 'hidden'
            }}
          />
        ) : (
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-piedra-100 text-piedra-400">
            {pub.tipo === 'espacio' ? <TentIcon className="h-5 w-5" /> : <WalkIcon className="h-5 w-5" />}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-cielo-950">{pub.nombre}</p>
            <span className="rounded-full bg-piedra-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-piedra-600">
              {pub.tipo}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-piedra-500">{detalles.join(' · ')}</p>
          <p className="mt-1 text-xs text-piedra-500">
            De <span className="font-semibold text-cielo-950">{pub.duenioNombre}</span> ·{' '}
            {pub.duenioEmail} · cargada el {formatDate(pub.fecha)}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 text-[11px] text-piedra-400">
            {pub.coordenadas ? (
              <a
                href={`https://www.openstreetmap.org/?mlat=${pub.coordenadas[0]}&mlon=${pub.coordenadas[1]}#map=14/${pub.coordenadas[0]}/${pub.coordenadas[1]}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-cielo-950"
              >
                <PinIcon className="h-3 w-3" />
                {pub.coordenadas[0].toFixed(4)}, {pub.coordenadas[1].toFixed(4)}
              </a>
            ) : (
              <span>sin marcar en el mapa</span>
            )}
            <span>
              {pub.fotos.length} {pub.fotos.length === 1 ? 'foto' : 'fotos'}
            </span>
            {pub.servicios.length ? <span>{pub.servicios.length} servicios</span> : null}
          </p>
        </div>

        <div className="ml-auto flex shrink-0 flex-col items-end gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${estadoPublicacionClass[pub.estado]}`}
          >
            {estadoPublicacionLabel[pub.estado]}
          </span>
          <button
            onClick={() => setAbierto((v) => !v)}
            className="text-xs font-semibold text-piedra-600 underline underline-offset-4 hover:text-cielo-950"
          >
            {abierto ? 'Ocultar detalle' : 'Ver detalle'}
          </button>
        </div>
      </div>

      {abierto ? (
        <div className="mt-4 space-y-4 border-t border-piedra-200 pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-piedra-500">Descripción</p>
            <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-piedra-600">
              {pub.descripcion}
            </p>
          </div>

          {pub.servicios.length ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-piedra-500">Servicios</p>
              <p className="mt-1.5 text-sm text-piedra-600">{pub.servicios.join(' · ')}</p>
            </div>
          ) : null}

          {pub.fotos.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              {pub.fotos.slice(1).map((f) => (
                <img
                  key={f}
                  src={f}
                  alt=""
                  className="h-20 w-20 rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.style.visibility = 'hidden'
                  }}
                />
              ))}
            </div>
          ) : null}

          {pub.estado === 'revision' ? (
            <div className="space-y-3 border-t border-piedra-200 pt-4">
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-piedra-500">
                  Nota para el cliente (opcional, se ve si lo rechazás)
                </span>
                <input
                  value={nota}
                  onChange={(e) => onNota(e.target.value)}
                  placeholder="Le falta la foto de portada o confirmar el precio"
                  className="mt-1.5 w-full rounded-xl border border-piedra-200 px-3.5 py-2.5 text-sm outline-none focus:border-cielo-950"
                />
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => cambiarEstadoPublicacion(pub.id, 'publicado', nota)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-cielo-950 px-4 py-2 text-xs font-semibold text-cream transition-colors hover:bg-cielo-900"
                >
                  <CheckIcon className="h-3.5 w-3.5" />
                  Aprobar y publicar
                </button>
                <button
                  onClick={() => cambiarEstadoPublicacion(pub.id, 'rechazado', nota)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-piedra-300 px-4 py-2 text-xs font-semibold text-piedra-700 transition-colors hover:border-cielo-950"
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                  Rechazar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 border-t border-piedra-200 pt-4">
              <span className="text-xs text-piedra-500">
                {pub.estado === 'publicado'
                  ? 'Está visible en el mapa del sitio.'
                  : 'Rechazada.'}
              </span>
              <button
                onClick={() => cambiarEstadoPublicacion(pub.id, 'revision', '')}
                className="text-xs font-semibold text-piedra-600 underline underline-offset-4 hover:text-cielo-950"
              >
                Volver a revisar
              </button>
            </div>
          )}
        </div>
      ) : null}
    </li>
  )
}
