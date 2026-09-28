import { Link } from 'react-router-dom'
import { properties } from '../data/demo'
import ScrollReveal from './ScrollReveal'
import StayCard from './StayCard'
import { SectionHeader } from './ui'

export default function FeaturedStays() {
  const featured = [...properties].sort((a, b) => b.rating - a.rating).slice(0, 4)

  return (
    <section className="bg-white/60 py-20" id="alojamientos">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="donde dormir"
          title="Alojamientos destacados en las sierras."
          subtitle="Domos, glampings, cabañas y lugares para carpar, elegidos por nuestra comunidad."
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ScrollReveal key={p.id} delay={(i % 4) * 70}>
              <StayCard property={p} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-10 text-center">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 rounded-full border border-forest-700 px-6 py-3 text-sm font-semibold text-forest-700 transition-colors hover:bg-forest-700 hover:text-cream"
          >
            Ver todos los espacios →
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}