// ============================================================
// Usuarios y sesión. Sin backend: se guardan en el navegador
// (localStorage). Las contraseñas nunca se guardan en texto plano,
// se guarda un hash SHA-256 con sal.
// ============================================================

export type Rol = 'admin' | 'cliente'

export interface Usuario {
  id: string
  nombre: string
  email: string
  region: string
  rol: Rol
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
  sal: 'serrana-admin',
  hash: '7a8c715156d6d885878bca7cc8b98f7464879fed445e99fb75e5084794cd9f14',
  creado: '2026-01-05',
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
    const guardados: Usuario[] = raw ? JSON.parse(raw) : []
    // El admin siempre está disponible, aunque se borre el storage.
    if (!guardados.some((u) => u.rol === 'admin')) return [adminSemilla, ...guardados]
    return guardados
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
    sal,
    hash: await hashPassword(datos.password, sal),
    creado: new Date().toISOString().slice(0, 10),
  }

  guardar([...usuarios, usuario])
  return { ok: true, usuario }
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
    cacheUsuario = crudo ? (JSON.parse(crudo) as Usuario) : null
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
