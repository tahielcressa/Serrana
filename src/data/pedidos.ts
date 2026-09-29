// ============================================================
// Pedidos de quien contrata un servicio.
//
// La cuenta "viajero" no sube lugares: mira lo publicado por otros
// y manda un pedido. El anfitrión (o el admin) lo responde desde su
// panel. Misma regla que en publicaciones: esta capa es la única que
// toca el almacenamiento, para poder moverla al backend sin tocar la UI.
// ============================================================

export type EstadoPedido = 'pendiente' | 'confirmado' | 'rechazado'

export const estadoPedidoLabel: Record<EstadoPedido, string> = {
  pendiente: 'Esperando respuesta',
  confirmado: 'Confirmado',
  rechazado: 'No se pudo coordonar',
}

export const estadoPedidoClass: Record<EstadoPedido, string> = {
  pendiente: 'bg-sand-200 text-earth-700',
  confirmado: 'bg-forest-100 text-forest-700',
  rechazado: 'bg-piedra-100 text-piedra-600',
}

export interface Pedido {
  id: string
  clienteId: string
  clienteNombre: string
  clienteEmail: string
  /** qué está buscando: un alojamiento, una ruta, filmación o equipos */
  tipo: 'espacio' | 'ruta' | 'servicio' | 'alquiler'
  /** si viene de una publicación concreta, su id */
  publicacionId: string
  /** qué necesita, escrito por el cliente */
  necesita: string
  donde: string
  desde: string
  hasta: string
  personas: number | null
  mensaje: string
  estado: EstadoPedido
  /** respuesta del anfitrión o del admin */
  respuesta: string
  fecha: string
}

export type BorradorPedido = Omit<Pedido, 'id' | 'fecha' | 'estado' | 'respuesta'>

const CLAVE = 'serrana:pedidos'

const oyentes = new Set<() => void>()
let cache: Pedido[] | null = null

function normalizar(p: Partial<Pedido>): Pedido {
  return {
    id: p.id ?? '',
    clienteId: p.clienteId ?? '',
    clienteNombre: p.clienteNombre ?? '',
    clienteEmail: p.clienteEmail ?? '',
    tipo: p.tipo ?? 'espacio',
    publicacionId: p.publicacionId ?? '',
    necesita: p.necesita ?? '',
    donde: p.donde ?? '',
    desde: p.desde ?? '',
    hasta: p.hasta ?? '',
    personas: typeof p.personas === 'number' ? p.personas : null,
    mensaje: p.mensaje ?? '',
    estado: p.estado ?? 'pendiente',
    respuesta: p.respuesta ?? '',
    fecha: p.fecha ?? new Date().toISOString().slice(0, 10),
  }
}

function leerTodas(): Pedido[] {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(CLAVE)
    const datos: Partial<Pedido>[] = raw ? JSON.parse(raw) : []
    cache = datos.filter((p) => p && p.id).map(normalizar)
  } catch {
    cache = []
  }
  return cache
}

function escribir(lista: Pedido[]) {
  cache = lista
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(lista))
  } catch {
    /* sin espacio: se avisa igual, el pedido no se pierde de la vista */
  }
  oyentes.forEach((f) => f())
}

export function validarPedido(d: BorradorPedido): string | null {
  if (d.necesita.trim().length < 3) return 'Contanos qué necesitás.'
  if (d.mensaje.trim().length < 15) return 'Sumá un par de líneas más (mínimo 15 letras).'
  if (d.desde && d.hasta && d.hasta < d.desde) return 'La fecha de salida es anterior a la de llegada.'
  return null
}

export function crearPedido(datos: BorradorPedido): Pedido {
  const nuevo: Pedido = {
    ...normalizar(datos),
    id: `ped-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
    fecha: new Date().toISOString().slice(0, 10),
    estado: 'pendiente',
    respuesta: '',
  }
  escribir([nuevo, ...leerTodas()])
  return nuevo
}

export function responderPedido(id: string, estado: EstadoPedido, respuesta = '') {
  escribir(leerTodas().map((p) => (p.id === id ? { ...p, estado, respuesta } : p)))
}

export function pedidosDe(clienteId: string) {
  return leerTodas().filter((p) => p.clienteId === clienteId)
}

/** Pedidos sin responder: los ve el admin. */
export function pedidosAbiertos() {
  return leerTodas().filter((p) => p.estado === 'pendiente')
}

export const pedidosStore = {
  get: leerTodas,
  subscribe: (f: () => void) => {
    oyentes.add(f)
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
