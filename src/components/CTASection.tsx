import { Link } from 'react-router-dom'
import { img } from '../data/demo'
import { ScrollReveal, ImageReveal } from './ScrollReveal'

const steps = [
  {
    n: '01',
    title: 'Buscás',
    desc: 'Filtrá por tipo de espacio, región, servicios y precio. El mapa te muestra todo lo que hay.',
  },
  {
    n: '02',
    title: 'Comparás',
    desc: 'Fotos, reseñas, servicios y las rutas de trekking que tenés cerca de cada lugar.',
  },
  {
    n: '03',
    title: 'Reservás',
    desc: 'Elegís fechas y huéspedes, y coordinás la reserva directo con el anfitrión.',
  },
]

export default function CTASection() {
  return (
    <>
      <section className="border-t border-piedra-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest-700">
              Cómo funciona
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-cielo-950 sm:text-3xl">
              Tres pasos y ya estás en la montaña.
            </h2>
          </ScrollReveal>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <ScrollReveal key={s.n} delay={i * 90}>
                <div className="border-t border-piedra-200 pt-5">
                  <span className="text-xs font-semibold tabular-nums text-earth-500">{s.n}</span>
                  <h3 className="mt-2 text-lg font-semibold text-cielo-950">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-piedra-500">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bloque para anfitriones, con fondo que se mueve al scrollear */}
      <section className="relative isolate overflow-hidden bg-cielo-950">
        <img
          src={img('1519681393784-d120267933ba', 2000)}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full -scale-y-100 object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cielo-950 via-cielo-950/70 to-cielo-950" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <ImageReveal className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand-300">
              ¿Tenés un lugar?
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-cream sm:text-3xl">
              Publicá tu espacio y mostralo en el mapa.
            </h2>
            <p className="mt-4 leading-relaxed text-cream/75">
              Camping, cabaña, refugio o lote para motorhome. Vos definís precio, disponibilidad y
              reglas; nosotros ayudamos con las reservas y la visibilidad en el mapa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/owner"
                className="rounded-full bg-sand-300 px-6 py-3 text-sm font-semibold text-cielo-950 transition-colors hover:bg-sand-200"
              >
                Publicar mi espacio
              </Link>
              <Link
                to="/explore"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:border-cream"
              >
                Ver cómo se ve
              </Link>
            </div>
          </ImageReveal>
        </div>
      </section>
    </>
  )
}
