import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { money, categoryLabel, type Property } from '../data/demo'
import { HeartIcon, PinIcon, StarIcon } from './Icons'
import { ImageReveal } from './ScrollReveal'

export default function StayCard({ property }: { property: Property }) {
  const storageKey = `serrana:favorito:${property.id}`
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    try {
      setLiked(localStorage.getItem(storageKey) === '1')
    } catch {
      /* sin almacenamiento: queda sin guardar */
    }
  }, [storageKey])

  const toggle = () => {
    const next = !liked
    setLiked(next)
    try {
      localStorage.setItem(storageKey, next ? '1' : '0')
    } catch {
      /* sin almacenamiento */
    }
  }

  return (
    <article className="group relative">
      <Link to={`/property/${property.id}`} className="block">
        <ImageReveal className="relative block aspect-[4/5] overflow-hidden rounded-2xl">
          <img
            src={property.image}
            alt={property.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-cielo-950">
            {categoryLabel[property.category]}
          </span>
          <span className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-semibold text-cream">
            <StarIcon className="h-3.5 w-3.5 text-sand-300" />
            {property.rating.toFixed(1)}
          </span>
        </ImageReveal>

        <div className="mt-3">
          <h3 className="truncate font-semibold text-cielo-950">{property.name}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-piedra-500">
            <PinIcon className="h-3.5 w-3.5" /> {property.location}
          </p>
          <p className="mt-2 text-sm text-piedra-600">
            <strong className="font-semibold text-cielo-950">{money(property.pricePerNight)}</strong>
            <span className="text-piedra-400"> / noche</span>
          </p>
        </div>
      </Link>

      <button
        onClick={toggle}
        aria-label={liked ? 'Quitar de favoritos' : 'Guardar favorito'}
        aria-pressed={liked}
        className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full transition-colors ${
          liked ? 'bg-cielo-950 text-cream' : 'bg-white/95 text-cielo-950 hover:bg-cielo-950 hover:text-cream'
        }`}
      >
        <HeartIcon className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
      </button>
    </article>
  )
}
