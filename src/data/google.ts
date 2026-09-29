// ============================================================
// Acceso con cuenta de Google (GIS: Google Identity Services).
//
// Para que funcione hay que:
//   1. Crear el Client ID en https://console.cloud.google.com
//      -> APIs y servicios -> Credenciales -> ID de cliente OAuth 2.0
//      -> Aplicación web.
//   2. Copiarlo en un archivo .env.local:
//        VITE_GOOGLE_CLIENT_ID=1234567890-abc.apps.googleusercontent.com
//   3. En esa misma pantalla, en "Orígenes de JavaScript autorizados",
//      agregar:
//        http://localhost:5173              (desarrollo)
//        https://tahielcressa.github.io        (producción)
//
// Si el Client ID no está cargado, googleListo() devuelve false y la
// interfaz muestra un aviso en vez de un botón que no hace nada.
// ============================================================

import { registrarConGoogle, type Usuario } from './auth'

export const CLIENT_ID_GOOGLE = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

type RespuestaGoogle = {
  credential: string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (r: RespuestaGoogle) => void
          }) => void
          prompt: (opts?: { callback?: () => void }) => void
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void
        }
      }
    }
  }
}

let scriptCargado: Promise<boolean> | null = null

function cargarScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (window.google?.accounts?.id) return Promise.resolve(true)
  if (scriptCargado) return scriptCargado

  scriptCargado = new Promise<boolean>((resolve) => {
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.onload = () => resolve(Boolean(window.google?.accounts?.id))
    s.onerror = () => resolve(false)
    document.head.appendChild(s)
  })

  return scriptCargado
}

/** ¿Se puede mostrar el botón de Google? */
export function googleListo() {
  return Boolean(CLIENT_ID_GOOGLE)
}

export async function iniciarSesionConGoogle(): Promise<
  { ok: true; usuario: Usuario } | { ok: false; error: string }
> {
  if (!CLIENT_ID_GOOGLE) {
    return { ok: false, error: 'El acceso con Google todavía no está configurado.' }
  }

  const cargado = await cargarScript()
  if (!cargado || !window.google?.accounts?.id) {
    return {
      ok: false,
      error: 'No pudimos cargar el acceso de Google. Revisá la conexión o usá tu correo.',
    }
  }

  return new Promise((resolve) => {
    window.google!.accounts.id.initialize({
      client_id: CLIENT_ID_GOOGLE,
      callback: async (respuesta) => {
        const r = await registrarConGoogle(respuesta.credential)
        if (!r.ok) return resolve(r)
        resolve({ ok: true, usuario: r.usuario })
      },
    })
    window.google!.accounts.id.prompt()
  })
}
