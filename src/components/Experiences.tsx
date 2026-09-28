import { Link } from 'react-router-dom'
import { experiences, money } from '../data/demo'
import { ScrollReveal } from './ScrollReveal'
import { Rating, SectionHeader } from './ui'

export default function Experiences() {
  return (
    <section id="experiencias" className="scroll-mt-16 bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader
          tag="Experiencias"
          title="Actividades para hacer con guías locales."
          subtitle="Kayak, cabalgatas, escalada, pesca, astroturismo y noches de fogata."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((x, i) => (
            <ScrollReveal key={x.id} delay={(i % 3) * 80}>
              <Link
                to={`/experience/${x.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-piedra-200 bg-white transition-all hover:-translate-y-0.5 hover:border-cielo-950"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={x.image}
                    alt={x.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-cielo-950">
                    {x.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold leading-snug text-cielo-950">{x.name}</h3>
                    <Rating value={x.rating} />
                  </div>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-piedra-500">
                    {x.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-piedra-100 pt-3 text-sm">
                    <span className="text-piedra-500">
                      {x.region} · {x.durationH} h
                    </span>
                    <span className="font-semibold text-cielo-950">{money(x.price)}</span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
