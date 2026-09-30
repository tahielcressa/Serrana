import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const CLAVE = 'serrana:cookies'

export type PreferenciaCookies = 'aceptadas' | 'esenciales'

function leerPreferencia(): PreferenciaCookies | null {
  try {
    const v = window.localStorage.getItem(CLAVE)
    return v === 'aceptadas' || v === 'esenciales' ? v : null
  } catch {
    // Modo privado o almacenamiento bloqueado: mostramos el aviso igual
    // y lo mantenemos solo en esta sesión.
    return null
  }
}

function guardarPreferencia(valor: PreferenciaCookies) {
  try {
    window.localStorage.setItem(CLAVE, valor)
  } catch {
    /* si no se puede guardar, el aviso se vuelve a mostrar la próxima vez */
  }
}

/**
 * Aviso de cookies y almacenamiento local.
 *
 * Serrana no usa cookies de rastreo: lo que guarda es la sesión y lo que
 * cada persona carga, y vive solo en su navegador. El aviso igual se
 * muestra la primera vez para que quede dicho, y hay una forma de
 * cambiar de opinión más abajo.
 */
export default function CookieBanner() {
  const [preferencia, setPreferencia] = useState<PreferenciaCookies | null>(null)
  const [visible, setVisible] = useState(false)
  const [cerrado, setCerrado] = useState(false)
  const franja = useRef<HTMLDivElement>(null)
  const [alto, setAlto] = useState(0)

  useEffect(() => {
    const guardada = leerPreferencia()
    setPreferencia(guardada)
    setVisible(guardada === null)
  }, [])

  // La franja es fija: reservamos debajo el mismo alto que mide, para no
  // tapar el pie de página ni el último contenido de la página.
  useEffect(() => {
    const el = franja.current
    if (!el) {
      setAlto(0)
      return
    }
    const medir = () => setAlto(el.getBoundingClientRect().height)
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    window.addEventListener('resize', medir)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', medir)
    }
  }, [visible, cerrado, preferencia])

  const elegir = (valor: PreferenciaCookies) => {
    guardarPreferencia(valor)
    setPreferencia(valor)
    setVisible(false)
  }

  // Cuando ya hubo una elección, queda un botón chico para revisarla
  // o cambiar de opinión.
  if (preferencia !== null) {
    if (cerrado) return null
    return (
      <div className="fixed bottom-3 left-3 z-40 sm:bottom-4 sm:left-4">
        <button
          onClick={() => setVisible(true)}
          className="rounded-full border border-piedra-300 bg-white/95 px-3.5 py-1.5 text-[11px] font-medium text-piedra-600 shadow-sm backdrop-blur transition-colors hover:border-cielo-950 hover:text-cielo-950"
        >
          Cookies
        </button>
        {visible ? (
          <div className="absolute bottom-10 left-0 w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border border-piedra-200 bg-white p-4 shadow-lg">
            <p className="text-xs leading-relaxed text-piedra-600">
              Guardamos {preferencia === 'aceptadas' ? 'todo lo que pediste' : 'solo lo esencial'} y
              no usamos cookies de rastreo.{' '}
              <Link
                to="/privacidad"
                onClick={() => setCerrado(true)}
                className="font-semibold text-cielo-950 underline underline-offset-4"
              >
                Ver detalle
              </Link>
            </p>
            <div className="mt-3 flex flex-col gap-1.5">
              <button
                onClick={() => elegir('esenciales')}
                className="rounded-full border border-piedra-300 py-1.5 text-xs font-semibold text-piedra-700 transition-colors hover:border-cielo-950 hover:text-cielo-950"
              >
                Solo esenciales
              </button>
              <button
                onClick={() => elegir('aceptadas')}
                className="rounded-full bg-cielo-950 py-1.5 text-xs font-semibold text-cream transition-colors hover:bg-cielo-900"
              >
                Aceptar
              </button>
              <button
                onClick={() => setCerrado(true)}
                className="py-1 text-xs text-piedra-500 transition-colors hover:text-cielo-950"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <>
      <div aria-hidden style={{ height: alto }} />
      <div
        ref={franja}
        role="region"
        aria-label="Aviso de cookies"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-piedra-200 bg-cream/97 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-cielo-950">Cookies y almacenamiento local</p>
            <p className="mt-1.5 text-xs leading-relaxed text-piedra-600">
              Serrana no usa cookies de rastreo ni te perfila. Guardamos en tu navegador tu sesión y
              lo que vos cargás (publicaciones, pedidos y reseñas), sin mandarlo a ningún servidor.{' '}
              Los mapas los sirven OpenStreetMap, CARTO y Esri, que sí ven tu conexión. Por ahora las
              dos opciones hacen lo mismo: no hay rastreadores que apagar.{' '}
              <Link
                to="/privacidad"
                className="font-semibold text-cielo-950 underline underline-offset-4 transition-colors hover:text-cielo-700"
              >
                Leer más
              </Link>{' '}
              ·{' '}
              <Link
                to="/terminos"
                className="font-semibold text-cielo-950 underline underline-offset-4 transition-colors hover:text-cielo-700"
              >
                Términos y condiciones
              </Link>
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <button
              onClick={() => elegir('esenciales')}
              className="rounded-full border border-piedra-300 px-5 py-2.5 text-sm font-semibold text-piedra-700 transition-colors hover:border-cielo-950 hover:text-cielo-950"
            >
              Solo esenciales
            </button>
            <button
              onClick={() => elegir('aceptadas')}
              className="rounded-full bg-cielo-950 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cielo-900"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
