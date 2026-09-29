// ============================================================
// Publicaciones que cargan los usuarios desde su panel de cliente:
// su glamping, su camping, su cabaña, la ruta que conoce.
// ============================================================
//
// TODO BACKEND: este archivo es la única capa que toca el
// almacenamiento. Hoy escribe en localStorage, así que cada
// navegador ve solo lo suyo. Cuando elijas el backend, cambiá
// estas cinco funciones y las restas de la app siguen igual:
//
//   leerTodas()        -> SELECT ... FROM publicaciones
//   escribir(lista)    -> INSERT / UPDATE / DELETE
//   claveAlmacen()     -> nombre de la tabla
//   suscribir(fn)      -> realtime o polling
//   generarId()        -> id generado por la base
//
// Importante para cuando haya base real: el control de que solo
// un admin apruebe tiene que validarse en el servidor, no acá.

export type EstadoPublicacion = 'revision' | 'publicado' | 'rechazado'
export type TipoPublicacion = 'espacio' | 'ruta'

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
  publicado: 'Visible en el sitio y en el mapa. Cualquiera puede reservarlo.',
  rechazado: 'No la publicamos. Borrala o escribinos para corregir los datos.',
}

export interface Publicacion {
  id: string
  /** id del usuario dueño, tomado de la sesión */
  duenio: string
  duenioNombre: string
  duenioEmail: string
  tipo: TipoPublicacion
  nombre: string
  region: string
  ubicacion: string
  descripcion: string
  /** links a imágenes que el usuario ya tiene subidas en otro lado */
  fotos: string[]
  contacto: string
  // --- datos de espacio
  categoria: string
  capacidad: number | null
  precio: number | null
  servicios: string[]
  // --- datos de ruta
  dificultad: string
  distanciaKm: number | null
  // --- geolocalización
  coordenadas: [number, number] | null
  fecha: string
  estado: EstadoPublicacion
  /** motivo del rechazo, lo escribe el admin */
  nota: string
}

export type BorradorPublicacion = Omit<Publicacion, 'id' | 'fecha' | 'estado' | 'nota'>

const CLAVE = 'serrana:publicaciones'

const oyentes = new Set<() => void>()
let cache: Publicacion[] | null = null

function leerTodas(): Publicacion[] {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(CLAVE)
    cache = raw ? (JSON.parse(raw) as Publicacion[]) : []
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
  if (d.ubicacion.trim().length < 2) return 'Escribí dónde queda el lugar.'
  if (d.descripcion.trim().length < 20) return 'Contanos un poco más (mínimo 20 letras).'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.contacto.trim())) return 'Revisá el correo de contacto.'
  if (d.tipo === 'espacio' && d.precio !== null && d.precio < 0) return 'El precio no puede ser negativo.'
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
    ...datos,
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
    leerTodas().map((p) => (p.id === id ? { ...p, ...cambios, estado: 'revision' as const, nota: '' } : p)),
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
