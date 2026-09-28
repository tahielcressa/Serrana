import { Link } from 'react-router-dom'
import { adventureCategories } from '../data/demo'
import ScrollReveal from './ScrollReveal'
import { TentIcon, DomeIcon, CabinIcon, BackpackIcon, CampfireIcon, VanIcon, MountainIcon } from './Icons'

const icons = {
  camping: TentIcon,
  glamping: TentIcon,
  cabana: CabinIcon,
  domo: DomeIcon,
  trekking: BackpackIcon,
  experiencia: CampfireIcon,
  motorhome: VanIcon,
} as const

export default function AdventureCategories() {
  return (
    <section id="aventuras" className="scroll-mt-16 border-b border-piedra-200 bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-2xl font-semibold text-cielo-950 sm:text-3xl">¿Qué andás buscando?</h2>
        </ScrollReveal>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
          {adventureCategories.map((c, i) => {
            const Icon = icons[c.id as keyof typeof icons] ?? MountainIcon
            return (
              <ScrollReveal key={c.id} delay={i * 60}>
                <Link
                  to={c.id === 'trekking' ? '/explore?tipo=trail' : '/explore'}
                  className="group block text-center"
                >
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-piedra-200 text-forest-800 transition-all group-hover:-translate-y-1 group-hover:border-cielo-950 group-hover:bg-cielo-950 group-hover:text-cream">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="mt-3 block text-sm font-semibold text-cielo-950">{c.label}</span>
                  <span className="mt-0.5 block text-xs text-piedra-500">{c.desc}</span>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
