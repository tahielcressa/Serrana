import { Link } from 'react-router-dom'
import { regions } from '../data/demo'
import ScrollReveal from './ScrollReveal'

export default function Regions() {
  return (
    <section id="regiones" className="scroll-mt-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-700">Las regiones</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-cielo-950 sm:text-3xl">
            Cada valle tiene su propio ritmo.
          </h2>
          <p className="mt-3 max-w-xl text-piedra-500">
            Del bullicio de Punilla al silencio de Paravachasca: elegí el paisaje que quieras tener al
            despertar.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((r, i) => (
            <ScrollReveal key={r.id} delay={(i % 3) * 80}>
              <Link to="/explore" className="group relative block h-72 overflow-hidden rounded-2xl">
                <img
                  src={r.image}
                  alt={r.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cielo-950/85 via-cielo-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-lg font-semibold text-cream">{r.name}</h3>
                  <p className="mt-0.5 text-sm text-cream/80">{r.tagline}</p>
                  <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-cream/70 transition-all duration-500 group-hover:max-h-24">
                    {r.description}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
