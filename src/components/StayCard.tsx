import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Property } from '../data/demo'
import { money } from '../data/demo'
import { HeartIcon, PinIcon, StarIcon } from './Icons'

export default function StayCard({ property }: { property: Property }) {
  const [liked, setLiked] = useState(false)

  return (
    <article className="group relative">
      <Link to={`/property/${property.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
          <img
            src={property.image}
            alt={property.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 rounded-full bg-cream/95 px-3 py-1 text-xs font-semibold text-forest-700 backdrop-blur">
            {property.emoji} {property.category}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cielo-950/50 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-sm font-medium text-cream">
            <StarIcon className="h-3.5 w-3.5 text-sand-300" />
            {property.rating.toFixed(1)}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-semibold text-cielo-950">{property.name}</h3>
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-piedra-500">
            <PinIcon className="h-3.5 w-3.5" /> {property.location}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {property.features.slice(0, 3).map((f) => (
              <span key={f} className="rounded-full bg-forest-50 px-2.5 py-0.5 text-[11px] font-medium text-forest-700">
                {f}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm text-piedra-500">
            <strong className="font-semibold text-cielo-950">{money(property.pricePerNight)}</strong>
            <span className="text-piedra-400"> / noche</span>
          </p>
        </div>
      </Link>

      <button
        onClick={() => setLiked((v) => !v)}
        aria-label="Guardar favorito"
        className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full shadow-md transition-all ${
          liked ? 'bg-earth-500 text-cream' : 'bg-cream/95 text-piedra-700 hover:text-earth-500'
        }`}
      >
        <HeartIcon className="h-4 w-4" />
      </button>
    </article>
  )
}