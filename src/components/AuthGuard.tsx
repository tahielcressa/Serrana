import type { ReactNode } from 'react'
import { useSyncExternalStore } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { authStore, type Usuario } from '../data/auth'

export function useUsuario(): Usuario | null {
  return useSyncExternalStore(authStore.subscribe, authStore.get, () => null)
}

/**
 * Protege un panel. Si no hay sesión manda a /login. Si el rol no
 * alcanza, avisa en vez de mostrar los datos.
 */
export function RutaPrivada({
  children,
  rol,
}: {
  children: ReactNode
  rol?: 'admin' | 'cliente'
}) {
  const usuario = useUsuario()
  const location = useLocation()

  if (!usuario) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (rol && usuario.rol !== rol) {
    return (
      <main className="mx-auto flex min-h-[70dvh] max-w-lg flex-col justify-center px-4 pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth-500">Sin acceso</p>
        <h1 className="mt-3 text-2xl font-semibold text-cielo-950">
          Esta sección es solo para {rol === 'admin' ? 'la administración' : 'clientes'}
        </h1>
        <p className="mt-3 leading-relaxed text-piedra-500">
          Entraste como <span className="font-semibold text-cielo-950">{usuario.nombre}</span>, que tiene
          el rol de {usuario.rol === 'admin' ? 'administración' : 'cliente'}. Tu sesión no habilita este
          panel.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/owner"
            className="rounded-full bg-cielo-950 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cielo-900"
          >
            Ir a mi panel de cliente
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-piedra-300 px-5 py-2.5 text-sm font-semibold text-cielo-950"
          >
            Cambiar de cuenta
          </Link>
        </div>
      </main>
    )
  }

  return <>{children}</>
}
