// ============================================================
// Datos de los paneles: tu cuenta (admin) y las cuentas de clientes.
// Los espacios y rutas ya existentes salen de demo.ts; acá solo se guarda
// quién los administra y en qué estado están.
// ============================================================

export type PublicacionEstado = 'publicado' | 'revision' | 'borrador'
export type PublicacionTipo = 'espacio' | 'ruta' | 'experiencia'

export interface Publicacion {
  id: string
  tipo: PublicacionTipo
  /** id del lugar en demo.ts */
  refId: string
  /** quién lo administra */
  duenio: string
  estado: PublicacionEstado
  alta: string
}

export interface Cuenta {
  id: string
  nombre: string
  contacto: string
  region: string
  desde: string
  estado: 'activo' | 'revision'
}

export interface Solicitud {
  id: string
  nombre: string
  contacto: string
  tipo: PublicacionTipo
  region: string
  mensaje: string
  fecha: string
  estado: 'pendiente' | 'aprobada' | 'rechazada'
}

// Tu cuenta: administración de la plataforma.
export const admin = {
  id: 'admin',
  nombre: 'Tahiel Cressa',
  contacto: 'tahielcressa@gmail.com',
  rol: 'Administración de Serrana',
}

// Cuentas de clientes que ya cargaron publicaciones.
export const cuentas: Cuenta[] = [
  {
    id: 'c1',
    nombre: 'Valeria Sosa',
    contacto: 'valeria.sosa@correo.com',
    region: 'Calamuchita',
    desde: '2026-03-14',
    estado: 'activo',
  },
  {
    id: 'c2',
    nombre: 'Nico Ferreyra',
    contacto: 'nico.ferreyra@correo.com',
    region: 'Punilla',
    desde: '2026-05-02',
    estado: 'activo',
  },
  {
    id: 'c3',
    nombre: 'Juliana Basis Medina',
    contacto: 'julieta@correo.com',
    region: 'Traslasierra',
    desde: '2026-08-21',
    estado: 'revision',
  },
]

// Solicitudes de gente que quiere publicar. Las ve tu panel.
export const solicitudes: Solicitud[] = [
  {
    id: 's1',
    nombre: 'Marcos Bianchi',
    contacto: 'marcos.bianchi@correo.com',
    tipo: 'espacio',
    region: 'Sierras del Sur',
    mensaje: 'Tengo dos cabañas en Alpa Corral y quiero sumarlas para la temporada de verano.',
    fecha: '2026-09-18',
    estado: 'pendiente',
  },
  {
    id: 's2',
    nombre: 'Ana Lucía Prats',
    contacto: 'ana.prats@correo.com',
    tipo: 'ruta',
    region: 'Sierras Chicas',
    mensaje: 'Guía de montaña con certificados. Quiero sumar rutas guiadas de un día por Unquillo.',
    fecha: '2026-09-21',
    estado: 'pendiente',
  },
  {
    id: 's3',
    nombre: 'Estancia Los Quebrachos',
    contacto: 'contacto@losquebrachos.com.ar',
    tipo: 'espacio',
    region: 'Paravachasca',
    mensaje:
      'Estancia con 4 domos y un amplificador para zona de camping. Buscamos visibilidad en la plataforma.',
    fecha: '2026-09-24',
    estado: 'pendiente',
  },
]

// Publicaciones: qué cuenta administra cada lugar de demo.ts.
export const publicaciones: Publicacion[] = [
  { id: 'pub1', tipo: 'espacio', refId: 'domo-entre-las-sierras', duenio: 'c1', estado: 'publicado', alta: '2026-03-14' },
  { id: 'pub2', tipo: 'espacio', refId: 'camping-el-relincho', duenio: 'c2', estado: 'publicado', alta: '2026-05-02' },
  { id: 'pub3', tipo: 'espacio', refId: 'glamping-las-altas-cumbres', duenio: 'c1', estado: 'publicado', alta: '2026-04-20' },
  { id: 'pub4', tipo: 'espacio', refId: 'cabanas-del-lago', duenio: 'c3', estado: 'revision', alta: '2026-08-21' },
  { id: 'pub5', tipo: 'espacio', refId: 'tiny-house-valle-verde', duenio: 'c1', estado: 'revision', alta: '2026-06-11' },
  { id: 'pub6', tipo: 'espacio', refId: 'refugio-del-velez', duenio: 'c2', estado: 'publicado', alta: '2026-05-30' },
  { id: 'pub7', tipo: 'espacio', refId: 'glamping-quinta-del-sol', duenio: 'c3', estado: 'revision', alta: '2026-09-01' },
  { id: 'pub8', tipo: 'espacio', refId: 'motorhome-punto-serrano', duenio: 'c2', estado: 'borrador', alta: '2026-09-12' },
  { id: 'pub9', tipo: 'ruta', refId: 'sendero-altas-cumbres', duenio: 'c2', estado: 'publicado', alta: '2026-05-02' },
  { id: 'pub10', tipo: 'ruta', refId: 'cerro-champaqui', duenio: 'c2', estado: 'publicado', alta: '2026-05-18' },
  { id: 'pub11', tipo: 'ruta', refId: 'balcon-norte', duenio: 'c1', estado: 'publicado', alta: '2026-04-02' },
  { id: 'pub12', tipo: 'ruta', refId: 'cerro-las-toscanas', duenio: 'c1', estado: 'borrador', alta: '2026-06-22' },
  { id: 'pub13', tipo: 'ruta', refId: 'pilones-de-copina', duenio: 'c3', estado: 'revision', alta: '2026-08-28' },
  { id: 'pub14', tipo: 'ruta', refId: 'cerro-uritorco', duenio: 'c2', estado: 'publicado', alta: '2026-07-09' },
  { id: 'pub15', tipo: 'ruta', refId: 'sendero-del-tipo', duenio: 'c1', estado: 'publicado', alta: '2026-06-30' },
  { id: 'pub16', tipo: 'ruta', refId: 'cumbre-de-las-sierras-del-sur', duenio: 'c3', estado: 'borrador', alta: '2026-09-15' },
]

export const estadoLabel: Record<PublicacionEstado, string> = {
  publicado: 'Publicado',
  revision: 'En revisión',
  borrador: 'Borrador',
}

export const estadoClass: Record<PublicacionEstado, string> = {
  publicado: 'bg-forest-100 text-forest-700',
  revision: 'bg-sand-200 text-earth-700',
  borrador: 'bg-piedra-100 text-piedra-700',
}

export const cuentaById = (id: string) => cuentas.find((c) => c.id === id)

// ============================================================
// Solicitudes que mandan los usuarios desde su panel de cliente.
// Se guardan en el navegador y aparecen en la pestaña
// "Solicitudes" del panel de administración.
// ============================================================

export type EstadoSolicitud = 'pendiente' | 'aprobada' | 'rechazada'

export interface SolicitudEnviada {
  id: string
  usuarioId: string
  nombre: string
  email: string
  tipo: PublicacionTipo
  region: string
  lugar: string
  mensaje: string
  fecha: string
  estado: EstadoSolicitud
}

const SOLIC_KEY = 'serrana:solicitudes'

const oyentes = new Set<() => void>()
let cache: SolicitudEnviada[] | null = null

function leerEnviadas(): SolicitudEnviada[] {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(SOLIC_KEY)
    cache = raw ? (JSON.parse(raw) as SolicitudEnviada[]) : []
  } catch {
    cache = []
  }
  return cache
}

function guardarEnviadas(lista: SolicitudEnviada[]) {
  cache = lista
  window.localStorage.setItem(SOLIC_KEY, JSON.stringify(lista))
  oyentes.forEach((f) => f())
}

export function enviarSolicitud(datos: Omit<SolicitudEnviada, 'id' | 'fecha' | 'estado'>) {
  const nueva: SolicitudEnviada = {
    ...datos,
    id: `sol-${Date.now().toString(36)}`,
    fecha: new Date().toISOString().slice(0, 10),
    estado: 'pendiente',
  }
  guardarEnviadas([nueva, ...leerEnviadas()])
  return nueva
}

export function resolverSolicitud(id: string, estado: EstadoSolicitud) {
  guardarEnviadas(leerEnviadas().map((s) => (s.id === id ? { ...s, estado } : s)))
}

export const solicitudesStore = {
  get: leerEnviadas,
  subscribe: (f: () => void) => {
    oyentes.add(f)
    return () => oyentes.delete(f)
  },
}
