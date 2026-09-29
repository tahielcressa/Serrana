import { useSyncExternalStore, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  authStore,
  entrar,
  perfilLabel,
  recuperarPassword,
  registrar,
  type Perfil,
  type Usuario,
} from '../data/auth'
import { TentIcon, UsersIcon, CheckIcon, ArrowLeftIcon, FilmIcon } from '../components/Icons'
import { CLIENT_ID_GOOGLE, iniciarSesionConGoogle } from '../data/google'

type Modo = 'login' | 'registro' | 'recuperar'

const regiones = [
  'Calamuchita',
  'Punilla',
  'Traslasierra',
  'Sierras del Sur',
  'Paravachasca',
  'Sierras Chicas',
]

const perfiles: { id: Perfil; label: string; desc: string; Icon: typeof TentIcon }[] = [
  {
    id: 'anfitrion',
    label: 'Quiero ofrecer',
    desc: 'Tengo un glamping, un camping, una ruta, hago filmaciones o alquilo equipos. Cargo mi publicación y la apruebo antes de que aparezca.',
    Icon: TentIcon,
  },
  {
    id: 'viajero',
    label: 'Quiero contratar',
    desc: 'Solo busco un lugar o un servicio. No tengo que subir nada: miro lo publicado y mando el pedido.',
    Icon: FilmIcon,
  },
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
        {modo === 'login' ? 'Entrá a tu cuenta' : modo === 'registro' ? 'Creá tu cuenta' : 'Recuperá tu contraseña'}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-piedra-500">
        {modo === 'login'
          ? 'Conectate para ver tus publicaciones, tus pedidos y tu panel.'
          : modo === 'registro'
            ? 'Elegí cómo vas a usar Serrana. Después podés cambiarlo cuando quieras.'
            : 'Escribí el correo con el que te registraste.'}
      </p>

      {modo !== 'recuperar' ? (
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
      ) : null}

      <div className="mt-6">
        {modo === 'login' ? (
          <FormularioLogin
            onEntrar={(u) => navigate(u.rol === 'admin' ? '/admin' : '/owner')}
            onRecuperar={() => setModo('recuperar')}
          />
        ) : modo === 'recuperar' ? (
          <FormularioRecuperar onVolver={() => setModo('login')} />
        ) : (
          <FormularioRegistro onCrear={() => setModo('login')} />
        )}
      </div>

      {modo !== 'registro' ? <BotonGoogle onEntro={(u) => navigate(u.rol === 'admin' ? '/admin' : '/owner')} /> : null}

      <p className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-piedra-500">
        <TentIcon className="mt-0.5 h-4 w-4 shrink-0" />
        El acceso de administrador lo tiene únicamente el dueño de la plataforma. Al registrarte quedás
        como usuario común y podés cambiar el tipo de cuenta cuando quieras desde tu panel.
      </p>
    </main>
  )
}

/** Botón de Google: solo aparece si hay un Client ID configurado. */
function BotonGoogle({ onEntro }: { onEntro: (u: Usuario) => void }) {
  const [error, setError] = useState('')

  if (!CLIENT_ID_GOOGLE) {
    return (
      <p className="mt-4 rounded-xl border border-dashed border-piedra-300 px-3.5 py-3 text-xs leading-relaxed text-piedra-500">
        El acceso con Google se activa cuando cargues el Client ID del proyecto en
        <code className="mx-1 rounded bg-piedra-100 px-1 py-0.5 text-[11px]">VITE_GOOGLE_CLIENT_ID</code>
        y lo agregues como origen autorizado.
      </p>
    )
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-piedra-200" />
        <span className="text-[11px] uppercase tracking-wider text-piedra-400">o continuá con</span>
        <span className="h-px flex-1 bg-piedra-200" />
      </div>
      <button
        type="button"
        onClick={async () => {
          setError('')
          const r = await iniciarSesionConGoogle()
          if (!r.ok) return setError(r.error)
          onEntro(r.usuario)
        }}
        className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-full border border-piedra-300 bg-white px-5 py-3 text-sm font-semibold text-cielo-950 transition-colors hover:border-cielo-950"
      >
        <svg viewBox="0 0 18 18" className="h-4 w-4" aria-hidden>
          <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
          <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z" />
          <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
        </svg>
        Continuar con Google
      </button>
      {error ? (
        <p className="mt-2 text-xs text-earth-700">{error}</p>
      ) : null}
    </div>
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

function FormularioLogin({
  onEntrar,
  onRecuperar,
}: {
  onEntrar: (u: Usuario) => void
  onRecuperar: () => void
}) {
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
        <span className="flex items-center justify-between gap-3">
          <span className={etiqueta}>Contraseña</span>
          <button
            type="button"
            onClick={onRecuperar}
            className="text-[11px] font-semibold text-cielo-950 underline underline-offset-4 transition-colors hover:text-cielo-700"
          >
            ¿La olvidaste?
          </button>
        </span>
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

function FormularioRecuperar({ onVolver }: { onVolver: () => void }) {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState<{ texto: string; error: boolean } | null>(null)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const r = recuperarPassword(email)
        setMensaje({ texto: r.mensaje, error: !r.ok })
      }}
      className="space-y-4"
    >
      <label className="block">
        <span className={etiqueta}>Correo con el que te registraste</span>
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
      {mensaje ? <Aviso texto={mensaje.texto} error={mensaje.error} /> : null}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-full bg-cielo-950 px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-cielo-900"
        >
          Recuperar contraseña
        </button>
        <button
          type="button"
          onClick={onVolver}
          className="text-xs font-semibold text-piedra-600 underline underline-offset-4 hover:text-cielo-950"
        >
          Volver a entrar
        </button>
      </div>
    </form>
  )
}

function FormularioRegistro({ onCrear }: { onCrear: () => void }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [region, setRegion] = useState(regiones[0])
  const [password, setPassword] = useState('')
  const [perfil, setPerfil] = useState<Perfil>('anfitrion')
  const [acepta, setAcepta] = useState(false)
  const [error, setError] = useState('')
  const [listo, setListo] = useState('')
  const [cargando, setCargando] = useState(false)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!acepta) return setError('Tenés que aceptar los términos y condiciones.')
    setCargando(true)
    setError('')
    const r = await registrar({ nombre, email, region, password, perfil })
    setCargando(false)
    if (!r.ok) return setError(r.error)
    setListo('Cuenta creada. Ya podés entrar con tu correo.')
    setPassword('')
    setTimeout(onCrear, 1400)
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <fieldset>
        <legend className="text-xs font-medium uppercase tracking-wider text-piedra-500">
          ¿Cómo vas a usar Serrana?
        </legend>
        <div className="mt-2 grid gap-2.5">
          {perfiles.map(({ id, label, desc, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPerfil(id)}
              aria-pressed={perfil === id}
              className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                perfil === id ? 'border-cielo-950 bg-cream-dark' : 'border-piedra-200 hover:border-piedra-400'
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-cielo-950">
                <Icon className="h-4 w-4" />
                {label}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-piedra-500">{desc}</span>
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[11px] text-piedra-400">
          {perfilLabel[perfil]}. Podés cambiarlo después desde tu panel.
        </p>
      </fieldset>

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

      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-piedra-600">
        <input
          type="checkbox"
          checked={acepta}
          onChange={(e) => setAcepta(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-piedra-300"
        />
        <span>
          Leo y acepto los{' '}
          <Link
            to="/terminos"
            className="font-semibold text-cielo-950 underline underline-offset-4"
          >
            términos y condiciones
          </Link>
          . Entiendo que Serrana es un catálogo y que la reserva se acuerda directo con quien publica.
        </span>
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
