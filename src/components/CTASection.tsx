import { Link } from 'react-router-dom'
import { img } from '../data/demo'
import ScrollReveal from './ScrollReveal'

const steps = [
  { n: '01', title: 'Buscá', desc: 'Filtrá por tipo de espacio, región, precio y servicios.' },
  { n: '02', title: 'Compará', desc: 'Mapa, fotos, reseñas y actividades cerca de cada lugar.' },
  { n: '03', title: 'Reservá', desc: 'Fechas, huéspedes y confirmación en un par de clics.' },
]

export default function CTASection() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {steps.map((s, i) => (
            <ScrollReveal key={s.n} delay={i * 90}>
              <div className="rounded-3xl border border-piedra-200 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-forest-900/5">
                <span className="font-display text-4xl font-semibold text-sand-400">{s.n}</span>
                <h3 className="mt-3 font-display text-xl font-semibold text-cielo-950">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-piedra-500">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-forest-900">
            <img
              src={img('1519681393784-d120267933ba', 1600)}
              alt="Cielo estrellado sobre las sierras"
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cielo-950/90 to-cielo-950/40" />
            <div className="relative grid gap-8 p-10 sm:p-14 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sand-300">
                  <span className="h-px w-8 bg-earth-400" /> ¿Tenés un espacio?
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-cream sm:text-4xl">
                  Conectá tu lugar con miles de aventureros.
                </h2>
                <p className="mt-4 max-w-md text-cream/75">
                  Publicá tu camping, cabaña o domo gratis. Nosotros nos encargamos de las reservas,
                  cobramos solo cuando vos cobrás.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/owner"
                    className="rounded-full bg-sand-300 px-6 py-3 text-sm font-semibold text-cielo-950 transition-colors hover:bg-sand-200"
                  >
                    Publicar mi espacio
                  </Link>
                  <Link
                    to="/explore"
                    className="rounded-full border border-cream/40 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:border-cream"
                  >
                    Ver cómo funciona
                  </Link>
                </div>
              </div>

              <div className="hidden gap-4 lg:flex">
                <div className="flex-1 rounded-2xl bg-cream/10 p-5 backdrop-blur ring-1 ring-white/15">
                  <p className="font-display text-3xl font-semibold text-cream">0%</p>
                  <p className="mt-1 text-xs leading-relaxed text-cream/70">
                    costo para publicar tu espacio
                  </p>
                </div>
                <div className="flex-1 rounded-2xl bg-cream/10 p-5 backdrop-blur ring-1 ring-white/15">
                  <p className="font-display text-3xl font-semibold text-cream">X%</p>
                  <p className="mt-1 text-xs leading-relaxed text-cream/70">
                    solo cuando concretás una reserva
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}