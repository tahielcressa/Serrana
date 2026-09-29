// ============================================================
// Usuarios y sesión. Sin backend: se guardan en el navegador
// (localStorage). Las contraseñas nunca se guardan en texto plano,
// se guarda un hash SHA-256 con sal.
// ============================================================

export type Rol = 'admin' | 'cliente'
export type Perfil = 'anfitrion' | 'viajero'

/**
 * anfitrion: ofrece algo (un glamping, una ruta, filmaciones o equipos).
 * viajero: contrata el servicio; no necesita subir nada.
 */
export const perfilLabel: Record<Perfil, string> = {
  anfitrion: 'Ofrezco un lugar o servicio',
  viajero: 'Quiero contratar un servicio',
}

export interface Usuario {
  id: string
  nombre: string
  email: string
  region: string
  rol: Rol
  perfil: Perfil
  sal: string
  hash: string
  creado: string
}

const USUARIOS_KEY = 'serrana:usuarios'
const SESION_KEY = 'serrana:sesion'

// Tu cuenta de administrador. Es la única con rol admin y no se puede
// crear desde el formulario de registro.
export const ADMIN_EMAIL = 'tahielcressa@gmail.com'
export const ADMIN_PASSWORD_INICIAL = 'Serrana2026'

const adminSemilla: Usuario = {
  id: 'u-admin',
  nombre: 'Tahiel Cressa',
  email: ADMIN_EMAIL,
  region: 'Sierras de Córdoba',
  rol: 'admin',
  perfil: 'anfitrion',
  sal: 'serrana-admin',
  hash: '7a8c715156d6d885878bca7cc8b98f7464879fed445e99fb75e5084794cd9f14',
  creado: '2026-01-05',
}

/** Rellena campos nuevos en cuentas creadas con versiones anteriores. */
function normalizarUsuario(u: Partial<Usuario>): Usuario {
  return {
    id: u.id ?? idUnico(),
    nombre: u.nombre ?? '',
    email: (u.email ?? '').toLowerCase(),
    region: u.region ?? 'Sierras de Córdoba',
    rol: u.rol === 'admin' ? 'admin' : 'cliente',
    perfil: u.perfil === 'viajero' ? 'viajero' : 'anfitrion',
    sal: u.sal ?? '',
    hash: u.hash ?? '',
    creado: u.creado ?? new Date().toISOString().slice(0, 10),
  }
}

async function hashPassword(password: string, sal: string) {
  const datos = new TextEncoder().encode(`${sal}:${password}`)
  const buffer = await crypto.subtle.digest('SHA-256', datos)
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function leer(): Usuario[] {
  if (typeof window === 'undefined') return [adminSemilla]
  try {
    const raw = window.localStorage.getItem(USUARIOS_KEY)
    const guardados: Partial<Usuario>[] = raw ? JSON.parse(raw) : []
    const yaTienenPerfil = guardados.map(normalizarUsuario)
    // El admin siempre está disponible, aunque se borre el storage.
    if (!yaTienenPerfil.some((u) => u.rol === 'admin')) return [adminSemilla, ...yaTienenPerfil]
    return yaTienenPerfil
  } catch {
    return [adminSemilla]
  }
}

function guardar(usuarios: Usuario[]) {
  window.localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios))
  emitir()
}

function idUnico() {
  return `u-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function salAleatoria() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export type Resultado =
  | { ok: true; usuario: Usuario }
  | { ok: false; error: string }

export async function registrar(datos: {
  nombre: string
  email: string
  region: string
  password: string
  perfil?: Perfil
}): Promise<Resultado> {
  const nombre = datos.nombre.trim()
  const email = datos.email.trim().toLowerCase()

  if (nombre.length < 2) return { ok: false, error: 'Escribí tu nombre.' }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: 'Revisá el correo.' }
  if (datos.password.length < 8) return { ok: false, error: 'La contraseña necesita al menos 8 caracteres.' }

  const usuarios = leer()
  if (usuarios.some((u) => u.email === email)) {
    return { ok: false, error: 'Ya existe una cuenta con ese correo.' }
  }

  const sal = salAleatoria()
  const usuario: Usuario = {
    id: idUnico(),
    nombre,
    email,
    region: datos.region,
    rol: 'cliente',
    perfil: datos.perfil === 'viajero' ? 'viajero' : 'anfitrion',
    sal,
    hash: await hashPassword(datos.password, sal),
    creado: new Date().toISOString().slice(0, 10),
  }

  guardar([...usuarios, usuario])
  return { ok: true, usuario }
}

/**
 * Acceso con Google.
 *
 * Google manda un JWT firmado (id_token) del que leemos el correo y el
 * nombre para crear la cuenta. OJO: eso alcanza para el prototipo, pero
 * en producción el token tiene que validarlo el servidor contra Google,
 * porque un id_token se puede falsificar si no se chequea la firma.
 * Cuando haya backend, esta función se reemplaza por un login a la API.
 */
export async function registrarConGoogle(credential: string): Promise<Resultado> {
  if (!credential) return { ok: false, error: 'Google no devolvió tus datos.' }

  const partes = credential.split('.')
  if (partes.length !== 3) return { ok: false, error: 'Respuesta de Google inválida.' }

  let datos: { email?: string; email_verified?: boolean; name?: string; aud?: string; exp?: number }
  try {
    const json = atob(partes[1].replace(/-/g, '+').replace(/_/g, '/'))
    datos = JSON.parse(json)
  } catch {
    return { ok: false, error: 'No pudimos leer la respuesta de Google.' }
  }

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
  if (clientId && datos.aud !== clientId) {
    return { ok: false, error: 'Esa cuenta de Google no es de esta aplicación.' }
  }
  if (typeof datos.exp === 'number' && datos.exp * 1000 < Date.now()) {
    return { ok: false, error: 'La sesión de Google venció. Probá de nuevo.' }
  }
  if (!datos.email) return { ok: false, error: 'Tu cuenta de Google no tiene un correo visible.' }

  const email = datos.email.trim().toLowerCase()
  const usuarios = leer()
  let usuario = usuarios.find((u) => u.email === email)

  if (!usuario) {
    usuario = {
      id: idUnico(),
      nombre: datos.name?.trim() || email.split('@')[0],
      email,
      region: 'Sierras de Córdoba',
      rol: 'cliente',
      perfil: 'anfitrion',
      sal: '',
      hash: '',
      creado: new Date().toISOString().slice(0, 10),
    }
    guardar([...usuarios, usuario])
  }

  window.localStorage.setItem(SESION_KEY, JSON.stringify(usuario))
  cacheCrudo = null
  emitir()
  return { ok: true, usuario }
}

/** El usuario cambia si ofrece o si contrata. */export function cambiarPerfil(usuarioId: string, perfil: Perfil) {
  const usuario = leer().find((u) => u.id === usuarioId)
  if (!usuario) return

  const actualizado: Usuario = { ...usuario, perfil }
  guardar(leer().map((u) => (u.id === usuarioId ? actualizado : u)))

  // La sesión guarda una copia: hay que actualizarla también.
  const actual = usuarioActual()
  if (actual?.id === usuarioId) {
    window.localStorage.setItem(SESION_KEY, JSON.stringify(actualizado))
    cacheCrudo = null
    emitir()
  }
}

/**
 * Recuperación de contraseña.
 *
 * Sin servidor no podemos mandar un correo ni comprobar la identidad de
 * quien escribe, así que acá solo se informa qué haría falta. Cuando haya
 * backend, esta función llama a la API y se borra el mensaje.
 */
export function recuperarPassword(email: string): { ok: boolean; mensaje: string } {
  const correo = email.trim().toLowerCase()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) {
    return { ok: false, mensaje: 'Escribí un correo válido.' }
  }
  return {
    ok: false,
    mensaje:
      'El envío de correos todavía no está habilitado: las cuentas viven en el navegador. ' +
      'Cuando conectemos el servidor vas a poder recuperar la contraseña desde acá.',
  }
}

export async function entrar(email: string, password: string): Promise<Resultado> {
  const usuarios = leer()
  const usuario = usuarios.find((u) => u.email === email.trim().toLowerCase())
  // Mismo mensaje para todos los casos: no revela qué correos existen.
  const error = 'Correo o contraseña incorrectos.'
  if (!usuario) return { ok: false, error }

  const hash = await hashPassword(password, usuario.sal)
  if (hash !== usuario.hash) return { ok: false, error }

  window.localStorage.setItem(SESION_KEY, JSON.stringify(usuario))
  emitir()
  return { ok: true, usuario }
}

export function salir() {
  window.localStorage.removeItem(SESION_KEY)
  emitir()
}

// ---- Suscripción para que la UI reaccione a login/logout/registro

type Escucha = () => void
const escuchas = new Set<Escucha>()

// Contador para que los paneles se actualicen cuando alguien
// se registra o cierra sesión, aunque no cambie la sesión actual.
let version = 0

function emitir() {
  version += 1
  escuchas.forEach((f) => f())
}

// Cache del usuario de la sesión: useSyncExternalStore exige que
// getSnapshot devuelva siempre la MISMA referencia, si no React
// detecta un cambio en cada render y entra en loop.
let cacheCrudo: string | null = null
let cacheUsuario: Usuario | null = null

export function usuarioActual(): Usuario | null {
  if (typeof window === 'undefined') return null

  let crudo: string | null = null
  try {
    crudo = window.localStorage.getItem(SESION_KEY)
  } catch {
    return null
  }

  if (crudo === cacheCrudo) return cacheUsuario

  cacheCrudo = crudo
  try {
    // normalizarUsuario: una sesión guardada antes del campo "perfil"
    // no debe romper el panel.
    cacheUsuario = crudo ? normalizarUsuario(JSON.parse(crudo) as Partial<Usuario>) : null
  } catch {
    cacheUsuario = null
  }
  return cacheUsuario
}

export function listarUsuarios(): Usuario[] {
  return leer()
}

// useSyncExternalStore: devuelve el usuario de la sesión y avisa
// cuando la sesión cambia en esta u otra pestaña.
export const authStore = {
  get: usuarioActual,
  subscribe: (f: Escucha) => {
    escuchas.add(f)
    const alCambiarStorage = () => f()
    window.addEventListener('storage', alCambiarStorage)
    return () => {
      escuchas.delete(f)
      window.removeEventListener('storage', alCambiarStorage)
    }
  },
}

// Se suscribe al mismo aviso, pero devuelve un número: sirve para
// releer la lista de cuentas cuando alguien se registra.
export const usuariosStore = {
  get: () => version,
  subscribe: authStore.subscribe,
}

export { hashPassword }
