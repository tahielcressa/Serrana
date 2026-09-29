import { useMemo, useState, useSyncExternalStore } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import { publicaciones as publicacionesDemo } from '../data/panel'
import {
  actualizarPublicacion,
  borrarPublicacion,
  crearPublicacion,
  estadoPublicacionClass,
  estadoPublicacionHint,
  estadoPublicacionLabel,
  publicacionesDe,
  publicacionesStore,
  validarPublicacion,
  type BorradorPublicacion,
  type Publicacion,
  type TipoPublicacion,
} from '../data/publicaciones'
import { categoryLabel, difficultyColor, properties, trails, type Property, type Trail } from '../data/demo'
import {
  InboxIcon,
  TentIcon,
  WalkIcon,
  ArrowLeftIcon,
  CheckIcon,
  TrashIcon,
  EditIcon,
  PinIcon,
} from '../components/Icons'
import { useUsuario } from '../components/AuthGuard'
import { LocationPicker } from '../components/MapView'
import { salir, type Usuario } from '../data/auth'

type Tab = 'espacios' | 'rutas' | 'cargar' | 'perfil'

const tabs: { id: Tab; label: string }[] = [
  { id: 'espacios', label: 'Mis espacios' },
  { id: 'rutas', label: 'Mis rutas' },
  { id: 'cargar', label: 'Cargar un lugar' },
  { id: 'perfil', label: 'Mi información' },
]

const CATEGORIAS = ['Glamping', 'Cabaña', 'Domo', 'Camping', 'Hostel', 'Casa rodante', 'Refugio']
const DIFICULTADES = ['Fácil', 'Intermedia', 'Difícil', 'Técnica']
const REGIONES = [
  'Calamuchita',
  'Punilla',
  'Traslasierra',
  'Sierras del Sur',
  'Paravachasca',
  'Sierras de Córdoba',
]

export default function Owner() {
  const [tab, setTab] = useState<Tab>('espacios')
  const [editando, setEditando] = useState<Publicacion | null>(null)
  const navigate = useNavigate()
  const usuario = useUsuario()
  const todas = useSyncExternalStore(publicacionesStore.subscribe, publicacionesStore.get, () => [])

  const mias = useMemo(() => (usuario ? publicacionesDe(usuario.id) : []), [usuario, todas])

  // Los lugares del inventario demo que administra esta cuenta.
  const delDemo = useMemo(
    () => publicacionesDemo.filter((p) => p.duenio === usuario?.id),
    [usuario?.id],
  )

  const espaciosDemo = delDemo
    .filter((p) => p.tipo === 'espacio')
    .map((p) => ({ pub: p, lugar: properties.find((x) => x.id === p.refId) }))
    .filter((r): r is { pub: (typeof delDemo)[number]; lugar: Property } => Boolean(r.lugar))

  const rutasDemo = delDemo
    .filter((p) => p.tipo === 'ruta')
    .map((p) => ({ pub: p, lugar: trails.find((x) => x.id === p.refId) }))
    .filter((r): r is { pub: (typeof delDemo)[number]; lugar: Trail } => Boolean(r.lugar))

  const resumen = [
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
    { label: 'Espacios y rutas', value: mias.length, hint: 'cargados por vos' },
  ]

  if (!usuario) return null

  function editar(p: Publicacion) {
    setEditando(p)
    setTab('cargar')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function limpiarEdicion() {
    setEditando(null)
  }

  return (
    <PanelShell
      eyebrow="Panel del cliente"
      title={usuario.nombre}
      subtitle={`${usuario.region} · cuenta creada el ${formatDate(usuario.creado)}. Cargá tu glamping, tu camping o la ruta que conocés y seguí el estado de cada publicación.`}
      actions={
        usuario.rol === 'admin' ? (
          <Link
            to="/admin"
            className="rounded-full border border-piedra-300 px-4 py-2 text-xs font-semibold text-piedra-700 transition-colors hover:border-piedra-500"
          >
            Ver administración
          </Link>
        ) : (
          <button
            onClick={() => {
              setEditando(null)
              setTab('cargar')
            }}
            className="rounded-full bg-cielo-950 px-4 py-2 text-xs font-semibold text-cream transition-colors hover:bg-cielo-900"
          >
            Cargar un lugar
          </button>
        )
      }
    >
      <StatGrid stats={resumen} />

      <div className="mt-8 flex gap-1 overflow-x-auto border-b border-piedra-200 pb-px">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setEditando(null)
              setTab(t.id)
            }}
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
          <ListaPublicaciones
            titulo="Espacios"
            items={mias.filter((p) => p.tipo === 'espacio')}
            demo={espaciosDemo}
            vacio={{
              title: 'Todavía no cargaste ningún espacio',
              desc: 'Si tenés un glamping, un camping o una cabaña, cargalo con la pestaña “Cargar un lugar”.',
            }}
            onEditar={editar}
            onBorrar={borrarPublicacion}
            onNuevo={() => setTab('cargar')}
          />
        )}

        {tab === 'rutas' && (
          <ListaPublicaciones
            titulo="Rutas"
            items={mias.filter((p) => p.tipo === 'ruta')}
            demo={rutasDemo}
            vacio={{
              title: 'Todavía no aportaste ninguna ruta',
              desc: 'Si conocés un sendero o una salida guiada, sumala y la revisamos antes de publicarla.',
            }}
            onEditar={editar}
            onBorrar={borrarPublicacion}
            onNuevo={() => setTab('cargar')}
          />
        )}

        {tab === 'cargar' && (
          <PublicacionForm
            usuario={usuario}
            editando={editando}
            onCancelar={limpiarEdicion}
            onListo={() => {
              setEditando(null)
              setTab('espacios')
            }}
          />
        )}

        {tab === 'perfil' && <MiInformacion usuario={usuario} publicaciones={mias} />}
      </div>

      <aside className="mt-12 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-piedra-200 bg-cream-dark/60 px-5 py-4 text-xs text-piedra-600">
        <span>
          Sesión de {usuario.email} · rol {usuario.rol === 'admin' ? 'administración' : 'cliente'}
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
// Lista de las publicaciones reales del cliente
// ============================================================

function ListaPublicaciones({
  titulo,
  items,
  demo,
  vacio,
  onEditar,
  onBorrar,
  onNuevo,
}: {
  titulo: string
  items: Publicacion[]
  demo: { pub: (typeof publicacionesDemo)[number]; lugar: Property | Trail }[]
  vacio: { title: string; desc: string }
  onEditar: (p: Publicacion) => void
  onBorrar: (id: string) => void
  onNuevo: () => void
}) {
  const [porBorrar, setPorBorrar] = useState<string | null>(null)

  return (
    <section className="space-y-6">
      <SectionLabel count={items.length}>{titulo}</SectionLabel>

      {items.length === 0 ? (
        <EmptyState title={vacio.title} desc={vacio.desc} />
      ) : (
        <ul className="rounded-2xl border border-piedra-200 bg-white px-5">
          {items.map((p) => (
            <li key={p.id} className="border-b border-piedra-200 py-4 last:border-b-0">
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
                    {p.tipo === 'espacio' ? (
                      <TentIcon className="h-5 w-5" />
                    ) : (
                      <WalkIcon className="h-5 w-5" />
                    )}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-cielo-950">{p.nombre}</p>
                  <p className="text-xs leading-relaxed text-piedra-500">
                    {p.region} · {p.ubicacion}
                    {p.tipo === 'espacio' && p.categoria ? ` · ${p.categoria}` : ''}
                    {p.tipo === 'espacio' && p.precio !== null ? ` · USD ${p.precio} por noche` : ''}
                    {p.tipo === 'ruta' && p.distanciaKm !== null ? ` · ${p.distanciaKm} km` : ''}
                    {p.tipo === 'ruta' && p.dificultad ? ` · ${p.dificultad}` : ''}
                  </p>
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
                    <span>{p.fotos.length} {p.fotos.length === 1 ? 'foto' : 'fotos'}</span>
                  </p>
                </div>

                <div className="ml-auto flex shrink-0 flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${estadoPublicacionClass[p.estado]}`}
                  >
                    {estadoPublicacionLabel[p.estado]}
                  </span>
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
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div>
        <button
          onClick={onNuevo}
          className="inline-flex items-center gap-2 rounded-full border border-piedra-300 px-4 py-2 text-sm font-semibold text-cielo-950 transition-colors hover:border-cielo-950"
        >
          Cargar {titulo === 'Espacios' ? 'un espacio' : 'una ruta'}
        </button>
      </div>

      {demo.length > 0 && (
        <div>
          <SectionLabel count={demo.length}>{titulo} de demostración</SectionLabel>
          <ul className="mt-3 rounded-2xl border border-piedra-200 bg-white px-5">
            {demo.map(({ pub, lugar }) => {
              const esEspacio = pub.tipo === 'espacio'
              const p = lugar as Property
              const t = lugar as Trail
              return (
                <li key={pub.id}>
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
                        {!esEspacio && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${difficultyColor[t.difficulty]}`}
                          >
                            {t.difficulty}
                          </span>
                        )}
                        <RatingInline value={lugar.rating} />
                        {esEspacio ? <Money value={p.pricePerNight} /> : null}
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
          <p className="mt-2 text-xs text-piedra-400">
            Datos de ejemplo del sitio, no cargados por vos.
          </p>
        </div>
      )}
    </section>
  )
}

// ============================================================
// Formulario para cargar un espacio o aportar una ruta
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
  const [coordenadas, setCoordenadas] = useState<[number, number] | null>(
    editando?.coordenadas ?? null,
  )
  const [error, setError] = useState<string | null>(null)
  const [listo, setListo] = useState(false)

  const tipos = [
    { id: 'espacio' as const, label: 'Alojamiento', desc: 'Glamping, cabaña, camping, vanlife', Icon: TentIcon },
    { id: 'ruta' as const, label: 'Ruta', desc: 'Sendero, trekking o salida guiada', Icon: WalkIcon },
  ]

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

    const borrador: BorradorPublicacion = {
      duenio: usuario.id,
      duenioNombre: usuario.nombre,
      duenioEmail: usuario.email,
      tipo,
      nombre: String(d.get('nombre') ?? ''),
      region: String(d.get('region') ?? ''),
      ubicacion: String(d.get('ubicacion') ?? ''),
      descripcion: String(d.get('descripcion') ?? ''),
      fotos: String(d.get('fotos') ?? '')
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean),
      contacto: String(d.get('contacto') ?? ''),
      categoria: tipo === 'espacio' ? String(d.get('categoria') ?? '') : '',
      capacidad: tipo === 'espacio' ? numero('capacidad') : null,
      precio: tipo === 'espacio' ? numero('precio') : null,
      servicios:
        tipo === 'espacio'
          ? String(d.get('servicios') ?? '')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      dificultad: tipo === 'ruta' ? String(d.get('dificultad') ?? '') : '',
      distanciaKm: tipo === 'ruta' ? numero('distancia') : null,
      coordenadas,
    }

    const falla = validarPublicacion(borrador)
    if (falla) {
      setError(falla)
      return
    }

    setError(null)
    if (editando) actualizarPublicacion(editando.id, borrador)
    else crearPublicacion(borrador)
    setListo(true)
    setCoordenadas(null)
    form.reset()
    setTimeout(() => setListo(false), 5000)
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

      <fieldset>
        <legend className="text-sm font-semibold text-cielo-950">¿Qué querés subir?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {tipos.map(({ id, label, desc, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTipo(id)}
              className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                tipo === id ? 'border-cielo-950 bg-cream-dark' : 'border-piedra-200 hover:border-piedra-400'
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
          <span className={etiqueta}>Nombre</span>
          <input
            required
            name="nombre"
            defaultValue={editando?.nombre}
            placeholder="Glamping Los Nogales"
            className={campo}
          />
        </label>
        <label className="block">
          <span className={etiqueta}>Región</span>
          <select name="region" defaultValue={editando?.region ?? usuario.region} className={campo}>
            {REGIONES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className={etiqueta}>Dónde queda (localidad, paraje o ruta de acceso)</span>
        <input
          required
          name="ubicacion"
          defaultValue={editando?.ubicacion}
          placeholder="La Cruz, a 6 km de Villa del Carmen"
          className={campo}
        />
      </label>

      {tipo === 'espacio' ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className={etiqueta}>Tipo</span>
            <select name="categoria" defaultValue={editando?.categoria ?? CATEGORIAS[0]} className={campo}>
              {CATEGORIAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={etiqueta}>Huéspedes</span>
            <input
              name="capacidad"
              type="number"
              min={1}
              defaultValue={editando?.capacidad ?? ''}
              placeholder="4"
              className={campo}
            />
          </label>
          <label className="block">
            <span className={etiqueta}>Precio por noche (USD)</span>
            <input
              name="precio"
              type="number"
              min={0}
              defaultValue={editando?.precio ?? ''}
              placeholder="120"
              className={campo}
            />
          </label>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={etiqueta}>Dificultad</span>
            <select name="dificultad" defaultValue={editando?.dificultad ?? DIFICULTADES[0]} className={campo}>
              {DIFICULTADES.map((d) => (
                <option key={d}>{d}</option>
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
      )}

      {tipo === 'espacio' ? (
        <label className="block">
          <span className={etiqueta}>Servicios (separados por coma)</span>
          <input
            name="servicios"
            defaultValue={editando?.servicios.join(', ')}
            placeholder="Wifi, cocina,achteneck, pileta, desayuno"
            className={campo}
          />
        </label>
      ) : null}

      <label className="block">
        <span className={etiqueta}>Contanos del lugar</span>
        <textarea
          required
          name="descripcion"
          rows={4}
          defaultValue={editando?.descripcion}
          placeholder="Capacidad, servicios, acceso, temporada, how to llegar..."
          className={`${campo} resize-none`}
        />
      </label>

      <label className="block">
        <span className={etiqueta}>Fotos (links, uno por línea)</span>
        <textarea
          name="fotos"
          rows={3}
          defaultValue={editando?.fotos.join('\n')}
          placeholder={'https://.../glamping-1.jpg\nhttps://.../glamping-2.jpg'}
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
          Es el único dato de contacto que se muestra. No publicamos tu teléfono ni tu dirección.
        </span>
      </label>

      <div>
        <span className={etiqueta}>Marcá el lugar en el mapa</span>
        <p className="mt-1.5 text-xs leading-relaxed text-piedra-500">
          {coordenadas
            ? 'Podés arrastrar el pin para ajustarlo. Solo se muestra la posición del lugar, nunca tu dirección exacta.'
            : 'Hacé clic en el mapa para dejar el pin donde está tu lugar o donde arranca tu ruta.'}
        </p>
        <LocationPicker
          value={coordenadas}
          onChange={setCoordenadas}
          className="mt-3 h-[320px] overflow-hidden rounded-2xl border border-piedra-200 sm:h-[380px]"
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
          {listo
            ? 'Listo, la cargamos y ya está en revisión.'
            : 'Queda en revisión hasta que la aprobemos. Después aparece en el mapa del sitio.'}
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
// La ficha del cliente, lo que el admin ve de él
// ============================================================

function MiInformacion({
  usuario,
  publicaciones,
}: {
  usuario: Usuario
  publicaciones: Publicacion[]
}) {
  const campos: { label: string; value: string }[] = [
    { label: 'Nombre', value: usuario.nombre },
    { label: 'Correo', value: usuario.email },
    { label: 'Región', value: usuario.region },
    { label: 'Cuenta creada', value: formatDate(usuario.creado) },
    { label: 'Tipo de cuenta', value: usuario.rol === 'admin' ? 'Administración' : 'Cliente' },
    { label: 'Publicaciones', value: `${publicaciones.length}` },
  ]

  return (
    <section className="max-w-2xl space-y-6">
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
