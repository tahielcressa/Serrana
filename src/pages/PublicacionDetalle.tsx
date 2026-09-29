import { useState, useSyncExternalStore } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  donde,
  estadoPublicacionLabel,
  publicarResena,
  publicacionesStore,
  resenasStore,
  tipoPorId,
} from '../data/publicaciones'
import {
  ArrowLeftIcon,
  CheckIcon,
  GearIcon,
  FilmIcon,
  PinIcon,
  StarIcon,
  TentIcon,
  WalkIcon,
} from '../components/Icons'
import { SinglePinMap } from '../components/MapView'
import { useUsuario } from '../components/AuthGuard'
import { formatDate } from '../components/panel'

const iconos = { espacio: TentIcon, ruta: WalkIcon, servicio: FilmIcon, alquiler: GearIcon }

/**
 * Ficha de un lugar que subió un usuario. Muestra los datos de contacto,
 * el pin y las reseñas que dejó la gente.
 */
export default function PublicacionDetalle() {
  const { id } = useParams<{ id: string }>()
  const usuario = useUsuario()
  const [error, setError] = useState('')
  const [listo, setListo] = useState(false)
  const [puntaje, setPuntaje] = useState(0)
  const [texto, setTexto] = useState('')

  const todas = useSyncExternalStore(publicacionesStore.subscribe, publicacionesStore.get, () => [])
  const resenas = useSyncExternalStore(resenasStore.subscribe, resenasStore.get, () => [])

  const pub = todas.find((p) => p.id === id) ?? null
  // Una publicación en revisión o rechazada solo la ven su dueño y el admin:
  // si el link queda en un chat no puede quedar publicada para cualquiera.
  const privileged = usuario?.rol === 'admin' || (pub !== null && usuario?.id === pub.duenio)
  const visible = pub !== null && (pub.estado === 'publicado' || privileged)
  const propias = resenas.filter((r) => r.publicacionId === id)
  const promedio = propias.length ? propias.reduce((a, r) => a + r.puntaje, 0) / propias.length : null
  const yaReseño = propias.some((r) => r.autorId === usuario?.id)

  if (pub && !visible) {
    return (
      <main className="bg-cream pb-24">
        <div className="mx-auto max-w-3xl px-5 py-28">
          <h1 className="font-display text-2xl text-cielo-950">Esta publicación todavía no está disponible</h1>
          <p className="mt-3 text-sm leading-relaxed text-piedra-600">
            La revisamos antes de publicarla. Cuando la aprobemos va a aparecer en Explorar.
          </p>
          <Link
            to="/explore"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-cielo-950 px-5 py-2.5 text-sm font-semibold text-cream"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Volver a Explorar
          </Link>
        </div>
      </main>
    )
  }

  if (!pub) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-28">
        <p className="text-sm text-piedra-500">Buscando la publicación...</p>
      </main>
    )
  }

  const Icono = iconos[pub.tipo]

  return (
    <main className="bg-cream pb-24">
      <div className="mx-auto max-w-5xl px-5 pt-8 sm:px-8 sm:pt-12">
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-piedra-500 transition-colors hover:text-cielo-950"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Volver a explorar
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div>
            <div className="overflow-hidden rounded-2xl border border-piedra-200 bg-white">
              {pub.fotos[0] ? (
                <img src={pub.fotos[0]} alt={pub.nombre} className="aspect-[4/3] w-full object-cover" />
              ) : (
                <div className="grid aspect-[4/3] w-full place-items-center bg-piedra-100 text-piedra-400">
                  <Icono className="h-12 w-12" />
                </div>
              )}
            </div>
            {pub.fotos.length > 1 ? (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {pub.fotos.slice(1, 5).map((f, i) => (
                  <img
                    key={i}
                    src={f}
                    alt=""
                    className="aspect-square w-full rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-piedra-100 px-2.5 py-1 text-[11px] font-semibold text-piedra-700">
              <Icono className="h-3.5 w-3.5" />
              {tipoPorId(pub.tipo).label}
            </span>
            <h1 className="mt-3 font-serif text-3xl text-cielo-950">{pub.nombre}</h1>
            <p className="mt-1.5 text-sm text-piedra-500">
              {[pub.categoria, donde(pub)].filter(Boolean).join(' · ')}
            </p>
            {pub.direccion ? <p className="mt-0.5 text-xs text-piedra-400">{pub.direccion}</p> : null}

            {promedio !== null ? (
              <p className="mt-3 flex items-center gap-1.5 text-sm text-cielo-950">
                <StarIcon className="h-4 w-4" />
                {promedio.toFixed(1)}
                <span className="text-xs text-piedra-500">
                  ({propias.length} {propias.length === 1 ? 'reseña' : 'reseñas'})
                </span>
              </p>
            ) : null}

            <dl className="mt-5 overflow-hidden rounded-2xl border border-piedra-200 bg-white">
              {[
                pub.precio !== null
                  ? { k: 'Precio', v: `USD ${pub.precio} ${pub.unidad}` }
                  : null,
                pub.capacidad !== null
                  ? { k: 'Cupo', v: `${pub.capacidad} personas` }
                  : null,
                pub.distanciaKm !== null ? { k: 'Distancia', v: `${pub.distanciaKm} km` } : null,
                pub.dificultad ? { k: 'Dificultad', v: pub.dificultad } : null,
                { k: 'Publicado por', v: pub.duenioNombre },
                { k: 'Estado', v: estadoPublicacionLabel[pub.estado] },
              ]
                .filter(Boolean)
                .map((f) => (
                  <div
                    key={f!.k}
                    className="flex items-center justify-between gap-3 border-b border-piedra-200 px-5 py-3 last:border-b-0"
                  >
                    <dt className="text-xs font-medium uppercase tracking-wider text-piedra-500">{f!.k}</dt>
                    <dd className="text-sm font-semibold text-cielo-950">{f!.v}</dd>
                  </div>
                ))}
            </dl>

            {pub.servicios.length ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {pub.servicios.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-piedra-200 bg-white px-2.5 py-1 text-[11px] text-piedra-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : null}

            <a
              href={`mailto:${pub.contacto}`}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-cielo-950 px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-cielo-900"
            >
              Consultar por correo
            </a>
            <p className="mt-2 text-center text-[11px] text-piedra-400">
              Serrana no cobra ni intermedia pagos: coordinás directo con {pub.duenioNombre}.
            </p>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="font-serif text-xl text-cielo-950">Sobre el lugar</h2>
          <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-piedra-700">
            {pub.descripcion}
          </p>
        </section>

        {pub.coordenadas ? (
          <section className="mt-10">
            <h2 className="font-serif text-xl text-cielo-950">Dónde queda</h2>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-piedra-500">
              <PinIcon className="h-3.5 w-3.5" />
              {pub.coordenadas[0].toFixed(5)}, {pub.coordenadas[1].toFixed(5)}
            </p>
            <div className="mt-3 overflow-hidden rounded-2xl border border-piedra-200">
              <SinglePinMap
                position={pub.coordenadas}
                label={pub.nombre}
                className="h-[320px] sm:h-[400px]"
              />
            </div>
          </section>
        ) : null}

        <section className="mt-10">
          <h2 className="font-serif text-xl text-cielo-950">
            Reseñas {propias.length > 0 ? `(${propias.length})` : ''}
          </h2>

          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-3">
              {propias.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-piedra-300 px-5 py-8 text-center text-sm text-piedra-500">
                  Todavía nadie reseñó este lugar. Si te quedaste, contanos.
                </p>
              ) : (
                propias.map((r) => (
                  <article
                    key={r.id}
                    className="rounded-2xl border border-piedra-200 bg-white px-5 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-cielo-950">{r.autorNombre}</p>
                      <span className="flex items-center gap-0.5 text-sand-500">
                        {Array.from({ length: 5 }, (_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < r.puntaje ? 'text-sand-500' : 'text-piedra-200'
                            }`}
                          />
                        ))}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-piedra-700">{r.texto}</p>
                    <p className="mt-2 text-[11px] text-piedra-400">{formatDate(r.fecha)}</p>
                  </article>
                ))
              )}
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              {usuario ? (
                yaReseño ? (
                  <p className="rounded-2xl border border-piedra-200 bg-white px-5 py-5 text-sm text-piedra-600">
                    Ya dejaste tu reseña en este lugar. Gracias por opinar.
                  </p>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const r = publicarResena({
                        publicacionId: pub.id,
                        autorId: usuario.id,
                        autorNombre: usuario.nombre,
                        puntaje,
                        texto,
                      })
                      if (!r.ok) return setError(r.error)
                      setError('')
                      setListo(true)
                      setPuntaje(0)
                      setTexto('')
                    }}
                    className="space-y-3 rounded-2xl border border-piedra-200 bg-white px-5 py-5"
                  >
                    <p className="text-sm font-semibold text-cielo-950">Dejá tu reseña</p>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setPuntaje(n)}
                          aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
                          className="p-0.5"
                        >
                          <StarIcon
                            className={`h-6 w-6 ${
                              n <= puntaje ? 'text-sand-500' : 'text-piedra-200'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs text-piedra-500">
                        {puntaje === 0 ? 'Elegí puntaje' : `${puntaje} de 5`}
                      </span>
                    </div>

                    <textarea
                      required
                      rows={4}
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                      placeholder="¿Cómo fue tu estadía? ¿Llegaste fácil? ¿Qué mejoraría?"
                      className="w-full resize-none rounded-xl border border-piedra-200 px-3.5 py-2.5 text-sm outline-none focus:border-cielo-950"
                    />

                    {error ? <p className="text-xs text-earth-700">{error}</p> : null}
                    {listo ? (
                      <p className="flex items-center gap-1.5 text-xs text-forest-700">
                        <CheckIcon className="h-3.5 w-3.5" />
                        ¡Gracias! Ya está publicada.
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={puntaje === 0}
                      className="w-full rounded-full bg-cielo-950 px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cielo-900 disabled:opacity-50"
                    >
                      Publicar reseña
                    </button>
                    <p className="text-[11px] leading-relaxed text-piedra-400">
                      Se publica con tu nombre. No podemos editarla después, así que escribí algo que
                      te sirva a vos y a los demás.
                    </p>
                  </form>
                )
              ) : (
                <div className="rounded-2xl border border-piedra-200 bg-white px-5 py-5 text-sm text-piedra-600">
                  <p>
                    <Link to="/login" className="font-semibold text-cielo-950 underline underline-offset-4">
                      Entrá a tu cuenta
                    </Link>{' '}
                    para dejar una reseña.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
