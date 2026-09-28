import { Link } from 'react-router-dom'
import { adventureCategories } from '../data/demo'
import ScrollReveal from './ScrollReveal'

export default function AdventureCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" id="aventuras">
      <ScrollReveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-forest-600">
            <span className="h-px w-8 bg-earth-400" /> ¿Qué aventura buscás?
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-cielo-950 sm:text-4xl">
            Dormí, caminá, explorá.
          </h2>
        </div>
      </ScrollReveal>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {adventureCategories.map((c, i) => (
          <ScrollReveal key={c.label} delay={i * 60}>
            <Link
              to="/explore"
              className="group flex flex-col items-center gap-3 rounded-2xl border border-piedra-200 bg-white/70 p-5 text-center transition-all hover:-translate-y-1 hover:border-forest-300 hover:shadow-lg hover:shadow-forest-900/5"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-forest-50 text-2xl transition-transform group-hover:scale-110">
                {c.emoji}
              </span>
              <span className="text-sm font-semibold text-cielo-950">{c.label}</span>
              <span className="text-xs text-piedra-400">{c.desc}</span>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}