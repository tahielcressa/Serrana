import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { propertyById, money, categoryEmoji, trails, experiences } from '../data/demo'
import { HeartIcon, PinIcon, StarIcon, UserIcon } from '../components/Icons'
import { Rating } from '../components/ui'

export default function Property() {
  const { id } = useParams()
  const property = propertyById(id ?? '')

  const [liked, setLiked] = useState(false)
  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')
  const [guests, setGuests] = useState(2)

  const nights = useMemo(() => {
    if (checkin && checkout) {
      const d = Math.round((+new Date(checkout) - +new Date(checkin)) / 86400000)
      return d > 0 ? d : 1
    }
    return 2
  }, [checkin, checkout])

  const nearbyStays = [{ emoji: '🏕️', label: 'Camping Chico', distance: '1,4 km', price: 8 }]

  if (!property) {
    return (
      <main className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center px-4 text-center">
        <p className="text-5xl">⛰️</p>
        <h1 className="mt-4 font-display text-3xl font-semibold">No encontramos ese alojamiento</h1>
        <Link to="/explore" className="mt-6 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-cream">
          Volver a explorar
        </Link>
      </main>
    )
  }

  const relatedTrails = trails.slice(0, 4)
  const relatedExp = experiences.slice(0, 3)

  return (
    <main className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <p className="flex items-center gap-1.5 text-sm text-piedra-500">
        <Link to="/explore" className="hover:text-forest-700">Explorar</Link>
        <span>/</span>
        <span className="text-cielo-950">{property.name}</span>
      </p>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-cielo-950 sm:text-4xl">{property.name}</h1>
          <p className="mt-2 flex items-center gap-2 text-piedra-500">
            <PinIcon className="h-4 w-4" /> {property.location}
            <span className="text-piedra-300">·</span>
            <Rating value={property.rating} count={property.reviews} />
          </p>
        </div>
        <button
          onClick={() => setLiked((v) => !v)}
          className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
            liked ? 'border-earth-500 bg-earth-500 text-cream' : 'border-piedra-300 text-cielo-950 hover:border-earth-400'
          }`}
        >
          <HeartIcon className="h-4 w-4" /> {liked ? 'Guardado' : 'Guardar'}
        </button>
      </div>

      {/* Galería */}
      <div className="mt-6 grid grid-cols-4 gap-2 overflow-hidden rounded-3xl lg:grid-cols-[2fr_1fr_1fr] lg:grid-rows-2 lg:gap-3 lg:[&>img:first-child]:row-span-2">
        {[property.image, ...property.images.slice(1, 4)].map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${property.name} ${i + 1}`}
            className={`${i === 0 ? 'col-span-4 h-64 w-full object-cover lg:col-span-1 lg:h-full' : 'h-40 w-full object-cover'} cursor-pointer transition-opacity hover:opacity-90 lg:h-36`}
          />
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <section>
            <h2 className="font-display text-xl font-semibold text-cielo-950">
              {property.emoji} {categoryEmoji[property.category]} Alojamiento en {property.region}
            </h2>
            <p className="mt-4 leading-relaxed text-piedra-600">{property.description}</p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-cielo-950">Características</h2>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-piedra-200">
                <span className="text-2xl">⛺</span> Capacidad: {property.capacity} personas
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-piedra-200">
                <span className="text-2xl">🛏️</span> {property.beds} cama{property.beds === 1 ? '' : 's'}
              </div>
              {property.features.map((f) => (
                <div key={f} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-piedra-200">
                  <span className="text-lg">✓</span> {f}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-cielo-950">Aventuras cerca de este lugar</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {property.nearby.map((n) => (
                <div key={n.label} className="flex items-center justify-between rounded-2xl bg-forest-50 p-4 text-sm">
                  <span className="font-medium text-forest-800">{n.label}</span>
                  <span className="text-xs text-forest-600">{n.distance}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {relatedTrails.map((t) => (
                <Link key={t.id} to={`/trail/${t.id}`} className="group rounded-2xl border border-piedra-200 bg-white p-4 transition-colors hover:border-forest-400">
                  <span className="text-sm font-semibold text-cielo-950 group-hover:text-forest-700">{t.name}</span>
                  <p className="mt-1 text-xs text-piedra-500">🥾 {t.distanceKm} km · {t.difficulty} · {t.durationH} h</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-cielo-950">Ubicación</h2>
            <div className="relative mt-4 h-72 overflow-hidden rounded-3xl">
              <img src="https://images.unsplash.com/photo-1464822611617-05d34a245dab?auto=format&fit=crop&w=1200&q=80" alt="Mapa de la zona" className="h-full w-full object-cover" />
              <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:40px_40px]" />
              <span className="absolute bottom-4 left-4 rounded-full bg-cielo-950/70 px-4 py-2 text-xs text-cream backdrop-blur">
                🗺️ Mapa interactivo por conectar
              </span>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-cielo-950">Experiencias cerca</h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {relatedExp.map((x) => (
                <Link key={x.id} to={`/experience/${x.id}`} className="group flex flex-1 items-center gap-3 rounded-2xl border border-piedra-200 bg-white p-4 transition-colors hover:border-forest-400">
                  <span className="text-3xl">{x.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-cielo-950 group-hover:text-forest-700">{x.name}</p>
                    <p className="text-xs text-piedra-500">{x.region} · {money(x.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Reserva sticky */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-piedra-200 bg-white p-6 shadow-lg shadow-forest-900/5">
            <div className="flex items-end justify-between">
              <p className="text-2xl font-semibold text-cielo-950">
                {money(property.pricePerNight)}
                <span className="text-sm font-normal text-piedra-400"> / noche</span>
              </p>
              <Rating value={property.rating} count={property.reviews} />
            </div>

            <div className="mt-5 rounded-2xl border border-piedra-200 overflow-hidden">
              <div className="grid grid-cols-2">
                <label className="border-b border-r border-piedra-200 p-3">
                  <span className="text-[10px] font-bold uppercase text-piedra-500">Llegada</span>
                  <input type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} className="mt-1 w-full text-sm outline-none" />
                </label>
                <label className="border-b border-piedra-200 p-3">
                  <span className="text-[10px] font-bold uppercase text-piedra-500">Salida</span>
                  <input type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} className="mt-1 w-full text-sm outline-none" />
                </label>
                <label className="col-span-2 p-3">
                  <span className="text-[10px] font-bold uppercase text-piedra-500">Huéspedes</span>
                  <span className="mt-1 flex items-center gap-3">
                    <UserIcon className="h-4 w-4 text-piedra-400" />
                    <select value={guests} onChange={(e) => setGuests(+e.target.value)} className="w-full text-sm outline-none">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? 'huésped' : 'huéspedes'}</option>
                      ))}
                    </select>
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm text-piedra-600">
              <p className="flex justify-between"><span>{money(property.pricePerNight)} × {nights} noches</span><span>{money(property.pricePerNight * nights)}</span></p>
              <p className="flex justify-between"><span>Tarifa de servicio</span><span>{money(Math.round(property.pricePerNight * nights * 0.1))}</span></p>
              <p className="flex justify-between border-t border-piedra-100 pt-3 text-base font-semibold text-cielo-950">
                <span>Total</span><span>{money(property.pricePerNight * nights + Math.round(property.pricePerNight * nights * 0.1))}</span>
              </p>
            </div>

            <button className="mt-5 w-full rounded-2xl bg-forest-700 py-3.5 text-sm font-semibold text-cream transition-all hover:bg-forest-800 active:scale-[0.98]">
              Reservar
            </button>
            <p className="mt-3 text-center text-xs text-piedra-400">No se te cobra todavía · Demo de reserva</p>
            <div className="mt-4 flex items-center justify-center gap-4 border-t border-piedra-100 pt-4 text-xs text-piedra-500">
              <span className="flex items-center gap-1"><StarIcon className="h-3.5 w-3.5 text-earth-400" /> Limpieza 4.9</span>
              <span className="flex items-center gap-1"><StarIcon className="h-3.5 w-3.5 text-earth-400" /> Ubicación 4.8</span>
            </div>
          </div>
          <p className="mt-3 flex justify-between rounded-2xl bg-forest-50 px-4 py-3 text-xs text-forest-800">
            <span>🛏️ {nearbyStays[0].emoji} Dónde dormir cerca</span><span>{nearbyStays[0].distance}</span>
          </p>
        </aside>
      </div>
    </main>
  )
}