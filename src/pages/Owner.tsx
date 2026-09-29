import { useMemo, useState, useSyncExternalStore } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  PanelShell,
  StatGrid,
  SectionLabel,
  RowLink,
  RatingInline,
  Money,
  formatDate,
  EmptyState,
} from '../components/panel'
import { publicaciones as publicacionesDemo } from '../data/panel'
import {
  actualizarPublicacion,
  borrarPublicacion,
  crearPublicacion,
  donde,
  estadoPublicacionClass,
  estadoPublicacionHint,
  estadoPublicacionLabel,
  PROVINCIAS,
  publicacionesDe,
  publicacionesStore,
  TIPOS,
  tipoPorId,
  validarPublicacion,
  type BorradorPublicacion,
  type Publicacion,
  type TipoPublicacion,
} from '../data/publicaciones'
import {
  crearPedido,
  estadoPedidoClass,
  estadoPedidoLabel,
  pedidosDe,
  pedidosStore,
  validarPedido,
  type Pedido,
} from '../data/pedidos'
import { categoryLabel, difficultyColor, properties, trails, type Property, type Trail } from '../data/demo'
import {
  InboxIcon,
  PlusIcon,
  TentIcon,
  WalkIcon,
  GearIcon,
  FilmIcon,
  ArrowLeftIcon,
  CheckIcon,
  TrashIcon,
  EditIcon,
  PinIcon,
} from '../components/Icons'
import { useUsuario } from '../components/AuthGuard'
import { LocationPicker } from '../components/MapView'
import { cambiarPerfil, perfilLabel, salir, type Perfil, type Usuario } from '../data/auth'

type Tab = 'publicaciones' | 'cargar' | 'pedidos' | 'perfil'

const DIFICULTADES = ['Fácil', 'Intermedia', 'Difícil', 'Técnica']

const iconoDeTipo: Record<TipoPublicacion, (props: { className?: string }) => React.ReactElement> = {
  espacio: TentIcon,
  ruta: WalkIcon,
  servicio: FilmIcon,
  alquiler: GearIcon,
}

export default function Owner() {
  const navigate = useNavigate()
  const usuario = useUsuario()
  const todas = useSyncExternalStore(publicacionesStore.subscribe, publicacionesStore.get, () => [])
  const todosPedidos = useSyncExternalStore(pedidosStore.subscribe, pedidosStore.get, () => [])

  // Quien contrata no sube nada: arranca en sus pedidos, no en un
  // formulario de carga que no le sirve.
  const esAnfitrion = usuario?.perfil !== 'viajero'
  const [tab, setTab] = useState<Tab>(esAnfitrion ? 'publicaciones' : 'pedidos')
  const [editando, setEditando] = useState<Publicacion | null>(null)

  const tabs = useMemo(() => {
    if (esAnfitrion) {
      return [
        { id: 'publicaciones' as const, label: 'Mis publicaciones' },
        { id: 'cargar' as const, label: 'Cargar' },
        { id: 'perfil' as const, label: 'Mi información' },
      ]
    }
    return [
      { id: 'pedidos' as const, label: 'Mis pedidos' },
      { id: 'perfil' as const, label: 'Mi información' },
    ]
  }, [esAnfitrion])

  const mias = useMemo(() => (usuario ? publicacionesDe(usuario.id) : []), [usuario, todas])
  const misPedidos = useMemo(() => (usuario ? pedidosDe(usuario.id) : []), [usuario, todosPedidos])

  const espaciosDemo = publicacionesDemo
    .filter((p) => p.duenio === usuario?.id && p.tipo === 'espacio')
    .map((p) => ({ pub: p, lugar: properties.find((x) => x.id === p.refId) }))
    .filter((r): r is { pub: (typeof publicacionesDemo)[number]; lugar: Property } => Boolean(r.lugar))

  const rutasDemo = publicacionesDemo
    .filter((p) => p.duenio === usuario?.id && p.tipo === 'ruta')
    .map((p) => ({ pub: p, lugar: trails.find((x) => x.id === p.refId) }))
    .filter((r): r is { pub: (typeof publicacionesDemo)[number]; lugar: Trail } => Boolean(r.lugar))

  if (!usuario) return null

  const resumen = esAnfitrion
    ? [
        {
          label: 'Publicados',
          value: mias.filter((p) => p.estado === 'publicado').length,
          hint: 'visibles en el mapa',
        },
        {
          label: 'En revisión',
          value: mias.filter((p) => p.estado === 'revision').length,
          hint: 'a la espera',
        },
        {
          label: 'Rechazados',
          value: mias.filter((p) => p.estado === 'rechazado').length,
          hint: 'para corregir',
        },
        { label: 'Total', value: mias.length, hint: 'cargados por vos' },
      ]
    : [
        {
          label: 'Pedidos',
          value: misPedidos.length,
          hint: 'los que hiciste',
        },
        {
          label: 'Esperando',
          value: misPedidos.filter((p) => p.estado === 'pendiente').length,
          hint: 'respuesta pendiente',
        },
        {
          label: 'Confirmados',
          value: misPedidos.filter((p) => p.estado === 'confirmado').length,
          hint: 'ya coordinados',
        },
        { label: 'Sin responder', value: misPedidos.filter((p) => p.estado === 'rechazado').length, hint: 'a buscar otra opción' },
      ]

  function editar(p: Publicacion) {
    setEditando(p)
    setTab('cargar')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function irA(t: Tab) {
    setEditando(null)
    setTab(t)
  }

  return (
    <PanelShell
      eyebrow={esAnfitrion ? 'Panel del cliente' : 'Panel de quien contrata'}
      title={usuario.nombre}
      subtitle={
        esAnfitrion
          ? `Cargá tu glamping, tu ruta, tus servicios de filmación o el equipamiento que alquilás y seguí el estado de cada publicación.`
          : `Pedí el lugar o el servicio que necesitás y seguí la respuesta acá. No hace falta que subas nada.`
      }
      actions={
        usuario.rol === 'admin' ? (
          <Link
            to="/admin"
            className="rounded-full border border-piedra-300 px-4 py-2 text-xs font-semibold text-piedra-700 transition-colors hover:border-piedra-500"
          >
            Ver administración
          </Link>
        ) : esAnfitrion ? (
          <button
            onClick={() => irA('cargar')}
            className="rounded-full bg-cielo-950 px-4 py-2 text-xs font-semibold text-cream transition-colors hover:bg-cielo-900"
          >
            Cargar
          </button>
        ) : (
          <Link
            to="/explore"
            className="rounded-full bg-cielo-950 px-4 py-2 text-xs font-semibold text-cream transition-colors hover:bg-cielo-900"
          >
            Explorar lugares
          </Link>
        )
      }
    >
      <StatGrid stats={resumen} />

      <div className="mt-8 flex gap-1 overflow-x-auto border-b border-piedra-200 pb-px">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => irA(t.id)}
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

      <div className="mt-6">
        {tab === 'publicaciones' && esAnfitrion && (
          <ListaPublicaciones
            items={mias}
            demo={[...espaciosDemo, ...rutasDemo]}
            puedeEditar
            onEditar={editar}
            onBorrar={borrarPublicacion}
            onNuevo={() => irA('cargar')}
          />
        )}

        {tab === 'cargar' && esAnfitrion && (
          <PublicacionForm
            usuario={usuario}
            editando={editando}
            onCancelar={() => setEditando(null)}
            onListo={() => {
              setEditando(null)
              setTab('publicaciones')
            }}
          />
        )}

        {tab === 'pedidos' && !esAnfitrion && <ListaPedidos usuario={usuario} pedidos={misPedidos} />}

        {tab === 'perfil' && (
          <MiInformacion usuario={usuario} publicaciones={mias.length} pedidos={misPedidos.length} />
        )}
      </div>

      <aside className="mt-12 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-piedra-200 bg-cream-dark/60 px-5 py-4 text-xs text-piedra-600">
        <span>
          Sesión de {usuario.email} · {perfilLabel[usuario.perfil].toLowerCase()}
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/explore" className="inline-flex items-center gap-1.5 font-semibold text-cielo-950">
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Volver a explorar
          </Link>
          <button
            onClick={() => {
              salir()
              navigate('/')
            }}
            className="font-semibold text-piedra-600 underline underline-offset-4 transition-colors hover:text-cielo-950"
          >
            Salir de mi cuenta
          </button>
        </div>
      </aside>
    </PanelShell>
  )
}

// ============================================================
// Lista de publicaciones, con filtro por tipo
// ============================================================

function ListaPublicaciones({
  items,
  demo,
  puedeEditar,
  onEditar,
  onBorrar,
  onNuevo,
}: {
  items: Publicacion[]
  demo: { pub: (typeof publicacionesDemo)[number]; lugar: Property | Trail }[]
  puedeEditar: boolean
  onEditar: (p: Publicacion) => void
  onBorrar: (id: string) => void
  onNuevo: () => void
}) {
  const [filtro, setFiltro] = useState<TipoPublicacion | 'todos'>('todos')
  const [porBorrar, setPorBorrar] = useState<string | null>(null)

  const usados = TIPOS.filter((t) => items.some((p) => p.tipo === t.id))
  const lista = filtro === 'todos' ? items : items.filter((p) => p.tipo === filtro)

  return (
    <section className="space-y-5">
      {usados.length > 1 ? (
        <div className="flex flex-wrap gap-1.5">
          <Filtro activo={filtro === 'todos'} onClick={() => setFiltro('todos')}>
            Todos ({items.length})
          </Filtro>
          {usados.map((t) => (
            <Filtro key={t.id} activo={filtro === t.id} onClick={() => setFiltro(t.id)}>
              {t.label} ({items.filter((p) => p.tipo === t.id).length})
            </Filtro>
          ))}
        </div>
      ) : null}

      {lista.length === 0 ? (
        <EmptyState
          title="Todavía no cargaste nada"
          desc="Si tenés un glamping, un camping, una ruta, hacés filmaciones o alquilás equipamiento, cargalo y lo revisamos antes de publicarlo."
        />
      ) : (
        <ul className="overflow-hidden rounded-2xl border border-piedra-200 bg-white">
          {lista.map((p) => {
            const Icono = iconoDeTipo[p.tipo]
            return (
              <li key={p.id} className="border-b border-piedra-200 px-4 py-4 last:border-b-0 sm:px-5">
                <div className="flex min-w-0 flex-1 flex-wrap items-start gap-x-4 gap-y-2">
                  {p.fotos[0] ? (
                    <img
                      src={p.fotos[0]}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.style.visibility = 'hidden'
                      }}
                    />
                  ) : (
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-piedra-100 text-piedra-400">
                      <Icono className="h-5 w-5" />
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-cielo-950">{p.nombre}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-piedra-500">
                      {[tipoPorId(p.tipo).label, p.categoria, donde(p)].filter(Boolean).join(' · ')}
                    </p>
                    {p.precio !== null ? (
                      <p className="mt-0.5 text-xs text-cielo-950">
                        USD {p.precio} {p.unidad}
                      </p>
                    ) : null}
                    <p className="mt-1.5 text-xs leading-relaxed text-piedra-500">
                      {estadoPublicacionHint[p.estado]}
                    </p>
                    {p.nota ? (
                      <p className="mt-1.5 rounded-lg bg-sand-200/60 px-3 py-2 text-xs leading-relaxed text-earth-700">
                        Nota de la administración: {p.nota}
                      </p>
                    ) : null}
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-piedra-400">
                      <span>cargada el {formatDate(p.fecha)}</span>
                      {p.coordenadas ? (
                        <span className="inline-flex items-center gap-1">
                          <PinIcon className="h-3 w-3" />
                          {p.coordenadas[0].toFixed(4)}, {p.coordenadas[1].toFixed(4)}
                        </span>
                      ) : (
                        <span>sin ubicación en el mapa</span>
                      )}
                      <span>
                        {p.fotos.length} {p.fotos.length === 1 ? 'foto' : 'fotos'}
                      </span>
                    </p>
                  </div>

                  <div className="ml-auto flex shrink-0 flex-col items-end gap-2">
                    <span
                      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${estadoPublicacionClass[p.estado]}`}
                    >
                      {estadoPublicacionLabel[p.estado]}
                    </span>
                    {puedeEditar ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditar(p)}
                          title="Editar"
                          aria-label={`Editar ${p.nombre}`}
                          className="grid h-8 w-8 place-items-center rounded-lg text-piedra-500 transition-colors hover:bg-piedra-100 hover:text-cielo-950"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        {porBorrar === p.id ? (
                          <span className="flex items-center gap-1 text-[11px]">
                            <button
                              onClick={() => {
                                onBorrar(p.id)
                                setPorBorrar(null)
                              }}
                              className="rounded-lg bg-cielo-950 px-2 py-1.5 font-semibold text-cream"
                            >
                              Borrar
                            </button>
                            <button
                              onClick={() => setPorBorrar(null)}
                              className="rounded-lg px-2 py-1.5 font-semibold text-piedra-500 hover:bg-piedra-100"
                            >
                              No
                            </button>
                          </span>
                        ) : (
                          <button
                            onClick={() => setPorBorrar(p.id)}
                            title="Borrar"
                            aria-label={`Borrar ${p.nombre}`}
                            className="grid h-8 w-8 place-items-center rounded-lg text-piedra-500 transition-colors hover:bg-piedra-100 hover:text-cielo-950"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {puedeEditar ? (
        <div>
          <button
            onClick={onNuevo}
            className="inline-flex items-center gap-2 rounded-full border border-piedra-300 px-4 py-2 text-sm font-semibold text-cielo-950 transition-colors hover:border-cielo-950"
          >
            Cargar algo nuevo
          </button>
        </div>
      ) : null}

      {demo.length > 0 && (
        <div>
          <SectionLabel count={demo.length}>De demostración</SectionLabel>
          <ul className="mt-3 overflow-hidden rounded-2xl border border-piedra-200 bg-white">
            {demo.map(({ pub, lugar }) => {
              const esEspacio = pub.tipo === 'espacio'
              const p = lugar as Property
              const t = lugar as Trail
              return (
                <li key={pub.id} className="border-b border-piedra-200 last:border-b-0">
                  <RowLink to={esEspacio ? `/property/${p.id}` : `/trail/${t.id}`}>
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1.5">
                      <img src={lugar.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-cielo-950 sm:truncate">{lugar.name}</p>
                        <p className="text-xs leading-relaxed text-piedra-500 sm:truncate">
                          {esEspacio
                            ? `${categoryLabel[p.category]} · ${p.location} · ${p.capacity} huéspedes`
                            : `${t.region} · ${t.location}`}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-3">
                        {!esEspacio ? (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${difficultyColor[t.difficulty]}`}
                          >
                            {t.difficulty}
                          </span>
                        ) : null}
                        <RatingInline value={lugar.rating} />
                        {esEspacio ? <Money value={p.pricePerNight} /> : null}
                        <span className="hidden text-xs text-piedra-400 sm:inline">alta {formatDate(pub.alta)}</span>
                      </div>
                    </div>
                  </RowLink>
                </li>
              )
            })}
          </ul>
          <p className="mt-2 text-xs text-piedra-400">Datos de ejemplo del sitio, no cargados por vos.</p>
        </div>
      )}
    </section>
  )
}

function Filtro({
  activo,
  onClick,
  children,
}: {
  activo: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
        activo
          ? 'border-cielo-950 bg-cielo-950 text-cream'
          : 'border-piedra-300 text-piedra-600 hover:border-cielo-950 hover:text-cielo-950'
      }`}
    >
      {children}
    </button>
  )
}

// ============================================================
// Formulario: alojamiento, ruta, servicio o alquiler
// ============================================================

function PublicacionForm({
  usuario,
  editando,
  onCancelar,
  onListo,
}: {
  usuario: Usuario
  editando: Publicacion | null
  onCancelar: () => void
  onListo: () => void
}) {
  const [tipo, setTipo] = useState<TipoPublicacion>(editando?.tipo ?? 'espacio')
  const [coordenadas, setCoordenadas] = useState<[number, number] | null>(editando?.coordenadas ?? null)
  const [error, setError] = useState<string | null>(null)
  const [listo, setListo] = useState(false)

  const conf = tipoPorId(tipo)

  // Al cambiar de tipo reiniciamos los campos que no aplican, para no
  // mandar datos de un glamping dentro de un alquiler de equipos.
  function cambiarTipo(nuevo: TipoPublicacion) {
    setTipo(nuevo)
    setError(null)
  }

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const d = new FormData(form)

    const numero = (campo: string) => {
      const bruto = String(d.get(campo) ?? '').trim()
      if (!bruto) return null
      const n = Number(bruto)
      return Number.isFinite(n) ? n : null
    }
    const lista = (campo: string) =>
      String(d.get(campo) ?? '')
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean)

    const borrador: BorradorPublicacion = {
      duenio: usuario.id,
      duenioNombre: usuario.nombre,
      duenioEmail: usuario.email,
      tipo,
      nombre: String(d.get('nombre') ?? ''),
      provincia: String(d.get('provincia') ?? ''),
      ciudad: String(d.get('ciudad') ?? ''),
      direccion: String(d.get('direccion') ?? ''),
      descripcion: String(d.get('descripcion') ?? ''),
      fotos: lista('fotos'),
      contacto: String(d.get('contacto') ?? ''),
      categoria: String(d.get('categoria') ?? conf.categorias[0]),
      precio: conf.conPrecio ? numero('precio') : null,
      unidad: String(d.get('unidad') ?? conf.unidades[0]),
      capacidad: conf.conCapacidad ? numero('capacidad') : null,
      servicios: lista('servicios'),
      dificultad: conf.conRuta ? String(d.get('dificultad') ?? '') : '',
      distanciaKm: conf.conRuta ? numero('distancia') : null,
      coordenadas,
    }

    const falla = validarPublicacion(borrador)
    if (falla) {
      setError(falla)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setError(null)
    if (editando) actualizarPublicacion(editando.id, borrador)
    else crearPublicacion(borrador)
    setListo(true)
    setCoordenadas(null)
    form.reset()
    setTimeout(() => setListo(false), 6000)
    onListo()
  }

  const campo = 'mt-1.5 w-full rounded-xl border border-piedra-200 px-3.5 py-2.5 text-sm outline-none focus:border-cielo-950'
  const etiqueta = 'text-xs font-medium uppercase tracking-wider text-piedra-500'

  return (
    <form onSubmit={enviar} className="space-y-6">
      {editando ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-piedra-200 bg-cream-dark/60 px-5 py-3">
          <p className="text-sm text-piedra-600">
            Editando <span className="font-semibold text-cielo-950">{editando.nombre}</span>. Al guardar
            vuelve a revisión.
          </p>
          <button
            type="button"
            onClick={onCancelar}
            className="text-xs font-semibold text-piedra-600 underline underline-offset-4 hover:text-cielo-950"
          >
            Cancelar
          </button>
        </div>
      ) : null}

      {listo ? (
        <p className="flex items-center gap-2 rounded-xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm text-forest-700">
          <CheckIcon className="h-4 w-4 shrink-0" />
          Listo. La mandamos a revisión y te avisamos cuando esté publicada.
        </p>
      ) : null}

      <fieldset>
        <legend className="text-sm font-semibold text-cielo-950">¿Qué querés subir?</legend>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {TIPOS.map(({ id, label, desc }) => {
            const Icono = iconoDeTipo[id]
            return (
              <button
                key={id}
                type="button"
                onClick={() => cambiarTipo(id)}
                aria-pressed={tipo === id}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                  tipo === id ? 'border-cielo-950 bg-cream-dark' : 'border-piedra-200 hover:border-piedra-400'
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-cielo-950">
                  <Icono className="h-4 w-4" />
                  {label}
                </span>
                <span className="mt-1 block text-xs text-piedra-500">{desc}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={etiqueta}>Nombre</span>
          <input
            required
            name="nombre"
            defaultValue={editando?.nombre}
            placeholder={tipo === 'espacio' ? 'Glamping Los Nogales' : tipo === 'ruta' ? 'Sendero de la Cruz' : tipo === 'servicio' ? 'Filmación en el cerro' : 'Carpas para 4'}
            className={campo}
          />
        </label>
        <label className="block">
          <span className={etiqueta}>Categoría</span>
          <select name="categoria" key={`cat-${tipo}`} defaultValue={editando?.categoria || conf.categorias[0]} className={campo}>
            {conf.categorias.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="space-y-4 rounded-2xl border border-piedra-200 bg-cream-dark/40 px-4 py-4 sm:px-5">
        <legend className="px-1 text-xs font-medium uppercase tracking-wider text-piedra-500">
          Dónde queda
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={etiqueta}>Provincia</span>
            <select name="provincia" defaultValue={editando?.provincia ?? 'Córdoba'} className={campo}>
              {PROVINCIAS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={etiqueta}>Ciudad o localidad</span>
            <input
              required
              name="ciudad"
              list="ciudades-cordoba"
              defaultValue={editando?.ciudad}
              placeholder="La Cruz"
              className={campo}
            />
            <datalist id="ciudades-cordoba">
              {[
                'Alta Gracia',
                'Cosquín',
                'Embalse',
                'La Cruz',
                'Los Reartes',
                'Tanti',
                'Villa Carlos Paz',
                'Villa del Carmen',
                'Villa General Belgrano',
              ].map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
        </div>
        <label className="block">
          <span className={etiqueta}>Dirección o paraje (opcional)</span>
          <input
            name="direccion"
            defaultValue={editando?.direccion}
            placeholder="Ruta Provincial 21, km 6, a 400 m del centro"
            className={campo}
          />
          <span className="mt-1.5 block text-xs leading-relaxed text-piedra-500">
            Se muestra como referencia para llegar. En el mapa marcamos el lugar, no tu casa.
          </span>
        </label>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-3">
        {conf.conCapacidad ? (
          <label className="block">
            <span className={etiqueta}>{tipo === 'espacio' ? 'Huéspedes' : 'Cupo de personas'}</span>
            <input
              name="capacidad"
              type="number"
              min={1}
              defaultValue={editando?.capacidad ?? ''}
              placeholder="4"
              className={campo}
            />
          </label>
        ) : null}
        {conf.conPrecio ? (
          <label className="block">
            <span className={etiqueta}>Precio (USD)</span>
            <input
              name="precio"
              type="number"
              min={0}
              defaultValue={editando?.precio ?? ''}
              placeholder="120"
              className={campo}
            />
          </label>
        ) : null}
        {conf.conPrecio ? (
          <label className="block">
            <span className={etiqueta}>Se cobra</span>
            <select name="unidad" key={`uni-${tipo}`} defaultValue={editando?.unidad || conf.unidades[0]} className={campo}>
              {conf.unidades.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {conf.conRuta ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={etiqueta}>Dificultad</span>
            <select name="dificultad" defaultValue={editando?.dificultad || DIFICULTADES[0]} className={campo}>
              {DIFICULTADES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={etiqueta}>Distancia en km</span>
            <input
              name="distancia"
              type="number"
              min={0}
              step="0.1"
              defaultValue={editando?.distanciaKm ?? ''}
              placeholder="8.5"
              className={campo}
            />
          </label>
        </div>
      ) : null}

      <label className="block">
        <span className={etiqueta}>
          {tipo === 'servicio' ? 'Qué incluye el servicio' : 'Servicios o detalles (separados por coma)'}
        </span>
        <input
          name="servicios"
          defaultValue={editando?.servicios.join(', ')}
          placeholder={
            tipo === 'espacio'
              ? 'Wifi, cocina, pileta, desayuno'
              : tipo === 'alquiler'
                ? 'Carpa para 4, roller, cooler, delivery al lugar'
                : tipo === 'servicio'
                  ? 'Cámara, estabilizador, operador, vehículo 4x4'
                  : 'Guía, señales, dificultad incluida'
          }
          className={campo}
        />
      </label>

      <label className="block">
        <span className={etiqueta}>Contanos del lugar o del servicio</span>
        <textarea
          required
          name="descripcion"
          rows={4}
          defaultValue={editando?.descripcion}
          placeholder="Capacidad, servicios, acceso, temporada, cómo llegar..."
          className={`${campo} resize-none`}
        />
      </label>

      <label className="block">
        <span className={etiqueta}>Fotos (links, uno por línea)</span>
        <textarea
          name="fotos"
          rows={3}
          defaultValue={editando?.fotos.join('\n')}
          placeholder={'https://.../foto-1.jpg\nhttps://.../foto-2.jpg'}
          className={`${campo} resize-none`}
        />
        <span className="mt-1.5 block text-xs leading-relaxed text-piedra-500">
          Por ahora pegá el link de una imagen que ya tengas subida. Cuando haya servidor, vas a poder
          subir el archivo directo desde acá.
        </span>
      </label>

      <label className="block">
        <span className={etiqueta}>Correo de contacto</span>
        <input
          required
          name="contacto"
          type="email"
          defaultValue={editando?.contacto ?? usuario.email}
          className={campo}
        />
        <span className="mt-1.5 block text-xs leading-relaxed text-piedra-500">
          Es el único dato de contacto que se muestra. No publicamos tu teléfono.
        </span>
      </label>

      <div>
        <span className={etiqueta}>
          {tipo === 'ruta' ? 'Marcá dónde arranca la ruta' : 'Marcá el lugar en el mapa'}
        </span>
        <p className="mt-1.5 text-xs leading-relaxed text-piedra-500">
          {coordenadas
            ? 'Podés arrastrar el pin para ajustarlo. Solo se muestra la posición del lugar, nunca tu dirección exacta.'
            : 'Hacé clic en el mapa para dejar el pin donde está tu lugar.'}
        </p>
        <LocationPicker
          value={coordenadas}
          onChange={setCoordenadas}
          className="mt-3 h-[260px] overflow-hidden rounded-2xl border border-piedra-200 sm:h-[380px]"
        />
        {coordenadas ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-piedra-600">
            <PinIcon className="h-3.5 w-3.5" />
            {coordenadas[0].toFixed(5)}, {coordenadas[1].toFixed(5)}
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-xl border border-earth-400/40 bg-sand-200/60 px-4 py-3 text-sm text-earth-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-piedra-200 pt-4">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-piedra-500">
          <InboxIcon className="mt-0.5 h-4 w-4 shrink-0" />
          Queda en revisión hasta que la aprobemos. Después aparece en el mapa del sitio.
        </p>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-cielo-950 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cielo-900"
        >
          <CheckIcon className="h-4 w-4" />
          {editando ? 'Guardar cambios' : 'Enviar a revisión'}
        </button>
      </div>
    </form>
  )
}

// ============================================================
// Pedidos de quien contrata
// ============================================================

function ListaPedidos({ usuario, pedidos }: { usuario: Usuario; pedidos: Pedido[] }) {
  const [abierto, setAbierto] = useState(pedidos.length === 0)
  const [error, setError] = useState<string | null>(null)
  const [listo, setListo] = useState(false)

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const d = new FormData(form)
    const personas = Number(String(d.get('personas') ?? '').trim())

    const borrador = {
      clienteId: usuario.id,
      clienteNombre: usuario.nombre,
      clienteEmail: usuario.email,
      tipo: (String(d.get('tipo') ?? 'espacio') as Pedido['tipo']),
      publicacionId: String(d.get('publicacionId') ?? ''),
      necesita: String(d.get('necesita') ?? ''),
      donde: String(d.get('donde') ?? ''),
      desde: String(d.get('desde') ?? ''),
      hasta: String(d.get('hasta') ?? ''),
      personas: Number.isFinite(personas) && personas > 0 ? personas : null,
      mensaje: String(d.get('mensaje') ?? ''),
    }

    const falla = validarPedido(borrador)
    if (falla) {
      setError(falla)
      return
    }

    setError(null)
    crearPedido(borrador)
    form.reset()
    setListo(true)
    setAbierto(false)
    setTimeout(() => setListo(false), 6000)
  }

  const campo = 'mt-1.5 w-full rounded-xl border border-piedra-200 px-3.5 py-2.5 text-sm outline-none focus:border-cielo-950'
  const etiqueta = 'text-xs font-medium uppercase tracking-wider text-piedra-500'

  return (
    <section className="space-y-5">
      {listo ? (
        <p className="flex items-center gap-2 rounded-xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm text-forest-700">
          <CheckIcon className="h-4 w-4 shrink-0" />
          Pedido enviado. Te van a responder por correo.
        </p>
      ) : null}

      {!abierto ? (
        <button
          onClick={() => setAbierto(true)}
          className="inline-flex items-center gap-2 rounded-full bg-cielo-950 px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cielo-900"
        >
          <PlusIcon className="h-4 w-4" />
          Pedir un lugar o servicio
        </button>
      ) : (
        <form onSubmit={enviar} className="space-y-5 rounded-2xl border border-piedra-200 bg-cream-dark/40 px-4 py-5 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-cielo-950">Nuevo pedido</h2>
            {pedidos.length > 0 ? (
              <button
                type="button"
                onClick={() => setAbierto(false)}
                className="text-xs font-semibold text-piedra-600 underline underline-offset-4 hover:text-cielo-950"
              >
                Cancelar
              </button>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={etiqueta}>Qué necesitás</span>
              <select name="tipo" className={campo}>
                {TIPOS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={etiqueta}>Título</span>
              <input name="necesita" required placeholder="Glamping para 4 con pileta" className={campo} />
            </label>
          </div>

          <label className="block">
            <span className={etiqueta}>Dónde te sirve</span>
            <input name="donde" list="ciudades-cordoba" placeholder="Villa General Belgrano" className={campo} />
            <datalist id="ciudades-cordoba">
              {['Alta Gracia', 'Cosquín', 'La Cruz', 'Los Reartes', 'Tanti', 'Villa Carlos Paz', 'Villa del Carmen'].map(
                (c) => (
                  <option key={c} value={c} />
                ),
              )}
            </datalist>
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className={etiqueta}>Desde</span>
              <input name="desde" type="date" className={campo} />
            </label>
            <label className="block">
              <span className={etiqueta}>Hasta</span>
              <input name="hasta" type="date" className={campo} />
            </label>
            <label className="block">
              <span className={etiqueta}>Personas</span>
              <input name="personas" type="number" min={1} placeholder="2" className={campo} />
            </label>
          </div>

          <label className="block">
            <span className={etiqueta}>Contanos un poco más</span>
            <textarea
              name="mensaje"
              required
              rows={3}
              placeholder="Fechas, cuántas personas somos, si necesitamos traslado..."
              className={`${campo} resize-none`}
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-earth-400/40 bg-sand-200/60 px-4 py-3 text-sm text-earth-700">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-piedra-200 pt-4">
            <p className="flex items-start gap-2 text-xs leading-relaxed text-piedra-500">
              <InboxIcon className="mt-0.5 h-4 w-4 shrink-0" />
              Te respondemos al correo de tu cuenta. No hace falta que subas nada.
            </p>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-cielo-950 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cielo-900"
            >
              <CheckIcon className="h-4 w-4" />
              Enviar pedido
            </button>
          </div>
        </form>
      )}

      {pedidos.length === 0 ? (
        <EmptyState
          title="Todavía no hiciste ningún pedido"
          desc="Pedí el lugar o el servicio que necesitás. Te contactamos por correo y no hace falta que tengas nada cargado."
        />
      ) : (
        <ul className="overflow-hidden rounded-2xl border border-piedra-200 bg-white">
          {pedidos.map((p) => (
            <li key={p.id} className="border-b border-piedra-200 px-4 py-4 last:border-b-0 sm:px-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-cielo-950">{p.necesita}</p>
                  <p className="mt-0.5 text-xs text-piedra-500">
                    {[tipoPorId(p.tipo).label, p.donde, p.desde ? `desde ${formatDate(p.desde)}` : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-piedra-600">{p.mensaje}</p>
                  {p.respuesta ? (
                    <p className="mt-2 rounded-lg bg-forest-50 px-3 py-2 text-xs leading-relaxed text-forest-700">
                      Respuesta: {p.respuesta}
                    </p>
                  ) : null}
                  <p className="mt-1.5 text-[11px] text-piedra-400">pedido el {formatDate(p.fecha)}</p>
                </div>
                <span
                  className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${estadoPedidoClass[p.estado]}`}
                >
                  {estadoPedidoLabel[p.estado]}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

// ============================================================
// Ficha del cliente, lo que el admin ve de él
// ============================================================

function MiInformacion({
  usuario,
  publicaciones,
  pedidos,
}: {
  usuario: Usuario
  publicaciones: number
  pedidos: number
}) {
  const campos: { label: string; value: string }[] = [
    { label: 'Nombre', value: usuario.nombre },
    { label: 'Correo', value: usuario.email },
    { label: 'Región', value: usuario.region },
    { label: 'Cuenta creada', value: formatDate(usuario.creado) },
    { label: 'Tipo de cuenta', value: usuario.perfil === 'viajero' ? 'Contrata servicios' : 'Ofrece lugares y servicios' },
    { label: 'Publicaciones', value: `${publicaciones}` },
    { label: 'Pedidos', value: `${pedidos}` },
  ]

  return (
    <section className="max-w-2xl space-y-5">
      <SectionLabel>Mi información</SectionLabel>

      <dl className="overflow-hidden rounded-2xl border border-piedra-200 bg-white">
        {campos.map((c) => (
          <div
            key={c.label}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-piedra-200 px-5 py-3.5 last:border-b-0"
          >
            <dt className="text-xs font-medium uppercase tracking-wider text-piedra-500">{c.label}</dt>
            <dd className="break-all text-sm font-semibold text-cielo-950">{c.value}</dd>
          </div>
        ))}
      </dl>

      <div className="rounded-2xl border border-piedra-200 bg-cream-dark/60 px-5 py-4">
        <p className="text-sm font-semibold text-cielo-950">¿Qué tipo de cuenta tenés?</p>
        <p className="mt-1.5 text-xs leading-relaxed text-piedra-600">
          Si tenés un lugar o un servicio para ofrecer, elegí “ofrezco”. Si lo que querés es contratar,
          elegí “contrato” y pedí sin subir nada.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(['anfitrion', 'viajero'] as Perfil[]).map((p) => (
            <button
              key={p}
              onClick={() => cambiarPerfil(usuario.id, p)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                usuario.perfil === p
                  ? 'border-cielo-950 bg-cielo-950 text-cream'
                  : 'border-piedra-300 text-piedra-600 hover:border-cielo-950 hover:text-cielo-950'
              }`}
            >
              {perfilLabel[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-piedra-200 bg-cream-dark/60 px-5 py-4 text-xs leading-relaxed text-piedra-600">
        <p className="font-semibold text-cielo-950">Qué se ve de vos en el sitio</p>
        <p className="mt-1.5">
          Cuando aprobamos una publicación, el lugar aparece en el mapa y en la ficha con tu nombre
          como dueño. Tu correo solo queda para que te contactemos: no se muestra en el sitio.
        </p>
        <p className="mt-3 font-semibold text-cielo-950">Para cambiar tus datos</p>
        <p className="mt-1.5">
          Escribinos y los actualizamos. Tu nombre y tu correo son los que se usan en las
          publicaciones que cargues.
        </p>
      </div>
    </section>
  )
}
