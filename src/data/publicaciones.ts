// ============================================================
// Publicaciones que cargan los usuarios desde su panel:
// un glamping, un camping, una ruta, un servicio de filmación
// o el alquiler de equipamiento.
// ============================================================
//
// TODO BACKEND: este archivo es la única capa que toca el
// almacenamiento. Hoy escribe en localStorage, así que cada
// navegador ve solo lo suyo. Cuando elijas el backend, cambiá
// estas cinco funciones y el resto de la app sigue igual:
//
//   leerTodas()     -> SELECT ... FROM publicaciones
//   escribir(lista) -> INSERT / UPDATE / DELETE
//   CLAVE           -> nombre de la tabla
//   oyentes         -> realtime o polling
//   generarId()     -> id generado por la base
//
// Cuando haya base real, el control de que solo un admin apruebe
// tiene que validarse en el servidor, no acá.

export type EstadoPublicacion = 'revision' | 'publicado' | 'rechazado'
export type TipoPublicacion = 'espacio' | 'ruta' | 'servicio' | 'alquiler'

export const PROVINCIAS = [
  'Córdoba',
  'Buenos Aires',
  'Catamarca',
  'Entre Ríos',
  'Jujuy',
  'La Pampa',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Fe',
  'Santiago del Estero',
  'Tucumán',
]

export const CIUDADES_CORDOBA = [
  'Alta Gracia',
  'Calamuchita',
  'Capilla del Carmen',
  'Cosquín',
  'Embalse',
  'La Cruz',
  'Los Reartes',
  'Mina Clavero',
  'Oncativo',
  'Río Cuarto',
  'San Antonio de Requena',
  'San José de Gracia',
  'Sierras de Córdoba',
  'Tanti',
  'Villa Carlos Paz',
  'Villa del Carmen',
  'Villa General Belgrano',
]

/** Qué se puede subir y qué datos pide cada tipo. */
export const TIPOS: {
  id: TipoPublicacion
  label: string
  desc: string
  categorias: string[]
  unidades: string[]
  conPrecio: boolean
  conCapacidad: boolean
  conRuta: boolean
}[] = [
  {
    id: 'espacio',
    label: 'Alojamiento',
    desc: 'Glamping, cabaña, domo, camping o vanlife para alojarse',
    categorias: ['Glamping', 'Cabaña', 'Domo', 'Camping', 'Hostel', 'Casa rodante', 'Refugio'],
    unidades: ['por noche', 'por noche/persona', 'por día', 'por semana'],
    conPrecio: true,
    conCapacidad: true,
    conRuta: false,
  },
  {
    id: 'ruta',
    label: 'Ruta',
    desc: 'Sendero, trekking o salida guiada que podés recorrer',
    categorias: ['Sendero', 'Trekking', 'Cicloturismo', 'Cabalgata', 'Travesía'],
    unidades: ['por salida', 'por persona', 'por grupo'],
    conPrecio: true,
    conCapacidad: true,
    conRuta: true,
  },
  {
    id: 'servicio',
    label: 'Servicio',
    desc: 'Filmación, fotografía y producción audiovisual',
    categorias: [
      'Filmación y fotografía',
      'Producción audiovisual',
      'Guía de turismo',
      'Traslado y logística',
      'Eventos',
    ],
    unidades: ['por servicio', 'por jornada', 'por persona'],
    conPrecio: true,
    conCapacidad: false,
    conRuta: false,
  },
  {
    id: 'alquiler',
    label: 'Alquiler de equipamiento',
    desc: 'Carpas, camas, kayaks, bicis y equipo para salir',
    categorias: [
      'Carpa',
      'Cama o colchón',
      'Kayak o bote',
      'Bicicleta',
      'Equipo de trekking',
      'Cocina de campaña',
      'Hamaca',
      'Equipamiento de escalada',
    ],
    unidades: ['por día', 'por semana', 'por salida'],
    conPrecio: true,
    conCapacidad: false,
    conRuta: false,
  },
]

export const tipoPorId = (id: TipoPublicacion) => TIPOS.find((t) => t.id === id) ?? TIPOS[0]

export const estadoPublicacionLabel: Record<EstadoPublicacion, string> = {
  revision: 'En revisión',
  publicado: 'Publicado',
  rechazado: 'Rechazado',
}

export const estadoPublicacionClass: Record<EstadoPublicacion, string> = {
  revision: 'bg-sand-200 text-earth-700',
  publicado: 'bg-forest-100 text-forest-700',
  rechazado: 'bg-piedra-100 text-piedra-600',
}

export const estadoPublicacionHint: Record<EstadoPublicacion, string> = {
  revision: 'La estamos revisando. Todavía no aparece en el sitio público.',
  publicado: 'Visible en el sitio y en el mapa. Cualquiera puede contactarte.',
  rechazado: 'No la publicamos. Corregí los datos y mandala de nuevo.',
}

export interface Publicacion {
  id: string
  /** id del usuario dueño, tomado de la sesión */
  duenio: string
  duenioNombre: string
  duenioEmail: string
  tipo: TipoPublicacion
  nombre: string
  // --- dónde queda
  provincia: string
  ciudad: string
  direccion: string
  descripcion: string
  /** links a imágenes que el usuario ya tiene subidas en otro lado */
  fotos: string[]
  contacto: string
  // --- qué es
  categoria: string
  // --- precio
  precio: number | null
  unidad: string
  // --- detalles
  capacidad: number | null
  servicios: string[]
  // --- ruta
  dificultad: string
  distanciaKm: number | null
  // --- geolocalización
  coordenadas: [number, number] | null
  fecha: string
  estado: EstadoPublicacion
  /** motivo del rechazo o aclaración, lo escribe el admin */
  nota: string
}

export type BorradorPublicacion = Omit<Publicacion, 'id' | 'fecha' | 'estado' | 'nota'>

/** Forma de los registros que se guardaron con versiones anteriores del formulario. */
type PublicacionGuardada = Partial<Publicacion> & { ubicacion?: string; region?: string }

const CLAVE = 'serrana:publicaciones'

const oyentes = new Set<() => void>()
let cache: Publicacion[] | null = null

/**
 * Rellena los campos que falten. Sirve para dos cosas: que las
 * publicaciones que ya estaban cargadas no se rompan y que un
 * registro incompleto nunca rompa la interfaz.
 */
function normalizar(p: PublicacionGuardada): Publicacion {
  const tipo = (p.tipo as TipoPublicacion) ?? 'espacio'
  return {
    id: p.id ?? '',
    duenio: p.duenio ?? '',
    duenioNombre: p.duenioNombre ?? '',
    duenioEmail: p.duenioEmail ?? '',
    tipo,
    nombre: p.nombre ?? '',
    provincia: p.provincia ?? 'Córdoba',
    // antes la ubicación era un solo campo libre
    ciudad: p.ciudad ?? p.ubicacion ?? '',
    direccion: p.direccion ?? p.ubicacion ?? '',
    descripcion: p.descripcion ?? '',
    fotos: Array.isArray(p.fotos) ? p.fotos : [],
    contacto: p.contacto ?? p.duenioEmail ?? '',
    categoria: p.categoria ?? '',
    precio: typeof p.precio === 'number' ? p.precio : null,
    unidad: p.unidad ?? tipoPorId(tipo).unidades[0],
    capacidad: typeof p.capacidad === 'number' ? p.capacidad : null,
    servicios: Array.isArray(p.servicios) ? p.servicios : [],
    dificultad: p.dificultad ?? '',
    distanciaKm: typeof p.distanciaKm === 'number' ? p.distanciaKm : null,
    coordenadas: Array.isArray(p.coordenadas) ? (p.coordenadas as [number, number]) : null,
    fecha: p.fecha ?? new Date().toISOString().slice(0, 10),
    estado: p.estado ?? 'revision',
    nota: p.nota ?? '',
  }
}

function leerTodas(): Publicacion[] {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(CLAVE)
    const datos: PublicacionGuardada[] = raw ? JSON.parse(raw) : []
    cache = datos.filter((p) => p && p.id).map(normalizar)
  } catch {
    cache = []
  }
  return cache
}

function escribir(lista: Publicacion[]) {
  cache = lista
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(lista))
  } catch {
    // Cuota llena o almacenamiento bloqueado: igual avisamos a la UI
    // para que el cliente no piense que se perdió el envío.
  }
  oyentes.forEach((f) => f())
}

function generarId() {
  return `pub-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

/** Devuelve el texto del error, o null si los datos están completos. */
export function validarPublicacion(d: BorradorPublicacion): string | null {
  if (d.nombre.trim().length < 3) return 'Poné un nombre de al menos 3 letras.'
  if (d.ciudad.trim().length < 2) return 'Elegí la ciudad donde queda.'
  if (d.descripcion.trim().length < 20) return 'Contanos un poco más (mínimo 20 letras).'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.contacto.trim())) return 'Revisá el correo de contacto.'
  if (d.precio !== null && d.precio < 0) return 'El precio no puede ser negativo.'
  if (d.tipo === 'ruta' && d.distanciaKm !== null && d.distanciaKm <= 0) {
    return 'La distancia tiene que ser mayor a cero.'
  }
  for (const foto of d.fotos) {
    if (!/^https?:\/\//i.test(foto.trim())) return 'Las fotos tienen que ser links que empiecen con http.'
  }
  return null
}

export function crearPublicacion(datos: BorradorPublicacion): Publicacion {
  const nueva: Publicacion = {
    ...normalizar(datos),
    id: generarId(),
    fecha: new Date().toISOString().slice(0, 10),
    estado: 'revision',
    nota: '',
  }
  escribir([nueva, ...leerTodas()])
  return nueva
}

export function actualizarPublicacion(id: string, cambios: Partial<BorradorPublicacion>) {
  escribir(
    leerTodas().map((p) =>
      p.id === id
        ? { ...normalizar({ ...p, ...cambios }), estado: 'revision' as const, nota: '' }
        : p,
    ),
  )
}

export function borrarPublicacion(id: string) {
  escribir(leerTodas().filter((p) => p.id !== id))
}

export function cambiarEstadoPublicacion(id: string, estado: EstadoPublicacion, nota = '') {
  escribir(leerTodas().map((p) => (p.id === id ? { ...p, estado, nota } : p)))
}

export function publicacionesDe(usuarioId: string) {
  return leerTodas().filter((p) => p.duenio === usuarioId)
}

/** Las únicas que se muestran en el sitio público y en el mapa. */
export function publicadas() {
  return leerTodas().filter((p) => p.estado === 'publicado')
}

/** Texto corto de dónde queda, para listados y fichas. */
export function donde(p: Publicacion) {
  return [p.ciudad, p.provincia].filter(Boolean).join(', ')
}

export const publicacionesStore = {
  get: leerTodas,
  subscribe: (f: () => void) => {
    oyentes.add(f)
    // El evento "storage" llega desde otras pestañas del mismo navegador:
    // sin esto, el panel de administración no se actualiza si el cliente
    // carga un lugar en otra pestaña.
    const alCambiarEnOtraTabla = () => {
      cache = null
      f()
    }
    window.addEventListener('storage', alCambiarEnOtraTabla)
    return () => {
      oyentes.delete(f)
      window.removeEventListener('storage', alCambiarEnOtraTabla)
    }
  },
}

// ============================================================
// Reseñas de los lugares publicados
// ============================================================

export interface Resena {
  id: string
  publicacionId: string
  autorId: string
  autorNombre: string
  puntaje: number
  texto: string
  fecha: string
}

const RESENAS_KEY = 'serrana:resenas'

const oyentesResena = new Set<() => void>()
let cacheResena: Resena[] | null = null

function leerResenas(): Resena[] {
  if (cacheResena) return cacheResena
  try {
    const raw = window.localStorage.getItem(RESENAS_KEY)
    cacheResena = raw ? (JSON.parse(raw) as Resena[]) : []
  } catch {
    cacheResena = []
  }
  return cacheResena
}

function escribirResenas(lista: Resena[]) {
  cacheResena = lista
  try {
    window.localStorage.setItem(RESENAS_KEY, JSON.stringify(lista))
  } catch {
    /* sin espacio: la reseña no se guarda, pero la interfaz avisa */
  }
  oyentesResena.forEach((f) => f())
}

export function publicarResena(datos: Omit<Resena, 'id' | 'fecha'>) {
  if (datos.puntaje < 1 || datos.puntaje > 5) return { ok: false as const, error: 'Elegí de 1 a 5 estrellas.' }
  if (datos.texto.trim().length < 10) return { ok: false as const, error: 'Contanos un poco más (mínimo 10 letras).' }
  if (resenasDe(datos.publicacionId).some((r) => r.autorId === datos.autorId)) {
    return { ok: false as const, error: 'Ya dejaste tu reseña en este lugar.' }
  }
  const nueva: Resena = {
    ...datos,
    id: `res-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
    fecha: new Date().toISOString().slice(0, 10),
  }
  escribirResenas([nueva, ...leerResenas()])
  return { ok: true as const, resena: nueva }
}

export function resenasDe(publicacionId: string) {
  return leerResenas().filter((r) => r.publicacionId === publicacionId)
}

export function promedioDe(publicacionId: string) {
  const lista = resenasDe(publicacionId)
  if (!lista.length) return null
  return lista.reduce((a, r) => a + r.puntaje, 0) / lista.length
}

export const resenasStore = {
  get: leerResenas,
  subscribe: (f: () => void) => {
    oyentesResena.add(f)
    const alCambiar = () => {
      cacheResena = null
      f()
    }
    window.addEventListener('storage', alCambiar)
    return () => {
      oyentesResena.delete(f)
      window.removeEventListener('storage', alCambiar)
    }
  },
}
