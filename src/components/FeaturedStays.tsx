import { Link } from 'react-router-dom'
import { properties } from '../data/demo'
import { ScrollReveal } from './ScrollReveal'
import StayCard from './StayCard'
import { SectionHeader } from './ui'

export default function FeaturedStays() {
  const featured = [...properties].sort((a, b) => b.rating - a.rating).slice(0, 4)

  return (
    <section id="alojamientos" className="scroll-mt-16 bg-cream-dark">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            tag="Dónde dormir"
            title="Alojamientos en las sierras."
            subtitle="Camping, domos, glampings, cabañas y refugios, con ubicación real en el mapa."
          />
          <Link
            to="/explore"
            className="rounded-full border border-cielo-950 px-5 py-2.5 text-sm font-semibold text-cielo-950 transition-colors hover:bg-cielo-950 hover:text-cream"
          >
            Ver todos los lugares
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ScrollReveal key={p.id} delay={(i % 4) * 70}>
              <StayCard property={p} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
