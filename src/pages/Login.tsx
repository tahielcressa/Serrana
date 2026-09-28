import { useSyncExternalStore, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authStore, entrar, registrar, type Usuario } from '../data/auth'
import { TentIcon, UsersIcon, CheckIcon, ArrowLeftIcon } from '../components/Icons'

type Modo = 'login' | 'registro'

const regiones = [
  'Calamuchita',
  'Punilla',
  'Traslasierra',
  'Sierras del Sur',
  'Paravachasca',
  'Sierras Chicas',
]

export default function Login() {
  const [modo, setModo] = useState<Modo>('login')
  const navigate = useNavigate()
  const usuario = useSyncExternalStore(authStore.subscribe, authStore.get, () => null)

  // Si ya hay sesión, seguimos de largo.
  if (usuario) {
    return (
      <main className="mx-auto flex min-h-[80dvh] max-w-md flex-col justify-center px-4 pt-24">
        <h1 className="text-2xl font-semibold text-cielo-950">Ya estás adentro</h1>
        <p className="mt-2 text-sm text-piedra-500">
          Entraste como <span className="font-semibold text-cielo-950">{usuario.nombre}</span> (
          {usuario.rol === 'admin' ? 'administración' : 'cliente'}).
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={usuario.rol === 'admin' ? '/admin' : '/owner'}
            className="rounded-full bg-cielo-950 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cielo-900"
          >
            Ir a mi panel
          </Link>
          <Link
            to="/explore"
            className="rounded-full border border-piedra-300 px-5 py-2.5 text-sm font-semibold text-cielo-950"
          >
            Explorar
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-[80dvh] w-full max-w-md flex-col justify-center px-4 pb-20 pt-24">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-piedra-500 hover:text-cielo-950"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Volver al inicio
      </Link>

      <h1 className="mt-6 text-2xl font-semibold text-cielo-950 sm:text-3xl">
        {modo === 'login' ? 'Entrá a tu cuenta' : 'Creá tu cuenta'}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-piedra-500">
        {modo === 'login'
          ? 'Conectate para ver tus espacios, rutas y publicaciones.'
          : 'Publicá tu espacio o tu ruta y seguí cómo avanza la revisión.'}
      </p>

      <div className="mt-6 flex rounded-full border border-piedra-200 bg-white p-1">
        {(['login', 'registro'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setModo(m)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              modo === m ? 'bg-cielo-950 text-cream' : 'text-piedra-700 hover:bg-piedra-100'
            }`}
          >
            {m === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {modo === 'login' ? (
          <FormularioLogin onEntrar={(u) => navigate(u.rol === 'admin' ? '/admin' : '/owner')} />
        ) : (
          <FormularioRegistro onCrear={() => setModo('login')} />
        )}
      </div>

      <p className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-piedra-500">
        <TentIcon className="mt-0.5 h-4 w-4 shrink-0" />
        El acceso de administrador lo tiene únicamente el dueño de la plataforma. Si sos cliente, creá tu
        cuenta con tu correo y quedás como usuario común.
      </p>
    </main>
  )
}

function Aviso({ texto, error }: { texto: string; error?: boolean }) {
  if (!texto) return null
  return (
    <p
      role="status"
      className={`rounded-xl px-3.5 py-2.5 text-sm ${
        error ? 'bg-sand-200 text-earth-700' : 'bg-forest-50 text-forest-800'
      }`}
    >
      {texto}
    </p>
  )
}

const campo =
  'mt-1.5 w-full rounded-xl border border-piedra-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-cielo-950'
const etiqueta = 'text-xs font-medium uppercase tracking-wider text-piedra-500'

function FormularioLogin({ onEntrar }: { onEntrar: (u: Usuario) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError('')
    const r = await entrar(email, password)
    setCargando(false)
    if (!r.ok) return setError(r.error)
    onEntrar(r.usuario)
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <label className="block">
        <span className={etiqueta}>Correo</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={campo}
          placeholder="tunombre@correo.com"
        />
      </label>
      <label className="block">
        <span className={etiqueta}>Contraseña</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={campo}
          placeholder="••••••••"
        />
      </label>
      {error ? <Aviso texto={error} error /> : null}
      <button
        type="submit"
        disabled={cargando}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-cielo-950 px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-cielo-900 disabled:opacity-60"
      >
        <UsersIcon className="h-4 w-4" />
        {cargando ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}

function FormularioRegistro({ onCrear }: { onCrear: () => void }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [region, setRegion] = useState(regiones[0])
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [listo, setListo] = useState('')
  const [cargando, setCargando] = useState(false)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError('')
    const r = await registrar({ nombre, email, region, password })
    setCargando(false)
    if (!r.ok) return setError(r.error)
    setListo('Cuenta creada. Ya podés entrar con tu correo.')
    setPassword('')
    setTimeout(onCrear, 1400)
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <label className="block">
        <span className={etiqueta}>Nombre y apellido</span>
        <input
          required
          autoComplete="name"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={campo}
          placeholder="Valeria Sosa"
        />
      </label>
      <label className="block">
        <span className={etiqueta}>Correo</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={campo}
          placeholder="tunombre@correo.com"
        />
      </label>
      <label className="block">
        <span className={etiqueta}>Región</span>
        <select value={region} onChange={(e) => setRegion(e.target.value)} className={campo}>
          {regiones.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className={etiqueta}>Contraseña</span>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={campo}
          placeholder="Mínimo 8 caracteres"
        />
      </label>
      {error ? <Aviso texto={error} error /> : null}
      {listo ? (
        <Aviso texto={listo} />
      ) : (
        <button
          type="submit"
          disabled={cargando}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-cielo-950 px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-cielo-900 disabled:opacity-60"
        >
          <CheckIcon className="h-4 w-4" />
          {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      )}
    </form>
  )
}
