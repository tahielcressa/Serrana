import { Link } from 'react-router-dom'
import { regions } from '../data/demo'
import ScrollReveal from './ScrollReveal'
import { SectionHeader } from './ui'

export default function Regions() {
  return (
    <section id="regiones" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader
        tag="explorar córdoba"
        title="Seis valles, infinitas aventuras."
        subtitle="Cada región de las Sierras tiene su carácter. Elegí la tuya y empezá a planear."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((r, i) => (
          <ScrollReveal key={r.id} delay={(i % 3) * 80}>
            <Link
              to="/explore"
              className="group relative block h-80 overflow-hidden rounded-3xl"
            >
              <img
                src={r.image}
                alt={r.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cielo-950/85 via-cielo-950/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-sand-300">
                  {r.propertiesCount} propiedades
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-cream">{r.name}</h3>
                <p className="text-sm font-medium text-cream/90">{r.tagline}</p>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">{r.description}</p>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}