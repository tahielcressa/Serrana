import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { propertyById, money, categoryLabel, trails } from '../data/demo'
import { SinglePinMap } from '../components/MapView'
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

  if (!property) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-semibold">No encontramos ese alojamiento</h1>
        <Link to="/explore" className="mt-6 rounded-full bg-cielo-950 px-6 py-3 text-sm font-semibold text-cream">
          Volver a explorar
        </Link>
      </main>
    )
  }

  const serviceFee = Math.round(property.pricePerNight * nights * 0.1)
  const total = property.pricePerNight * nights + serviceFee
  const nearbyTrails = trails
    .map((t) => ({
      trail: t,
      km: haversineKm(property.coordinates, t.coordinates),
    }))
    .sort((a, b) => a.km - b.km)
    .slice(0, 3)

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
      <p className="flex items-center gap-1.5 text-sm text-piedra-500">
        <Link to="/explore" className="hover:text-forest-700">Explorar</Link>
        <span>/</span>
        <span className="text-cielo-950">{property.name}</span>
      </p>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-cielo-950 sm:text-3xl">{property.name}</h1>
          <p className="mt-1.5 flex items-center gap-2 text-sm text-piedra-500">
            <PinIcon className="h-4 w-4" /> {property.location}
            <span className="text-piedra-300">·</span>
            <Rating value={property.rating} count={property.reviews} />
          </p>
        </div>
        <button
          onClick={() => setLiked((v) => !v)}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            liked
              ? 'border-cielo-950 bg-cielo-950 text-cream'
              : 'border-piedra-300 text-cielo-950 hover:border-cielo-950'
          }`}
        >
          <HeartIcon className="h-4 w-4" /> {liked ? 'Guardado' : 'Guardar'}
        </button>
      </div>

      {/* Galería */}
      <div className="mt-6 grid gap-2 overflow-hidden rounded-2xl sm:grid-cols-[2fr_1fr]">
        <img
          src={property.image}
          alt={property.name}
          className="h-[280px] w-full object-cover sm:h-[420px]"
        />
        <div className="hidden grid-rows-2 gap-2 sm:grid">
          {property.images.slice(1, 3).map((src) => (
            <img key={src} src={src} alt="" className="h-full w-full object-cover" />
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <section>
            <h2 className="text-lg font-semibold text-cielo-950">
              {categoryLabel[property.category]} en {property.region}
            </h2>
            <p className="mt-2 text-sm text-piedra-500">
              Capacidad {property.capacity} personas · {property.beds}{' '}
              {property.beds === 1 ? 'cama' : 'camas'}
            </p>
            <p className="mt-5 leading-relaxed text-piedra-600">{property.description}</p>
          </section>

          <section className="mt-10 border-t border-piedra-200 pt-8">
            <h2 className="text-lg font-semibold text-cielo-950">Qué ofrece</h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 text-sm text-piedra-600 sm:grid-cols-2">
              {property.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-forest-50 text-[11px] text-forest-700">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 border-t border-piedra-200 pt-8">
            <h2 className="text-lg font-semibold text-cielo-950">Dónde está</h2>
            <p className="mt-1 text-sm text-piedra-500">{property.location}</p>
            <SinglePinMap
              className="mt-4 h-[340px] rounded-2xl"
              position={property.coordinates}
              label={`$${property.pricePerNight}`}
              zoom={12}
            />
            <p className="mt-3 text-xs text-piedra-500">
              Movete el mapa para ver el entorno. El marcador muestra el precio por noche.
            </p>
          </section>

          <section className="mt-10 border-t border-piedra-200 pt-8">
            <h2 className="text-lg font-semibold text-cielo-950">Rutas cerca</h2>
            <div className="mt-4 divide-y divide-piedra-100 border-y border-piedra-100">
              {nearbyTrails.map(({ trail, km }) => (
                <Link
                  key={trail.id}
                  to={`/trail/${trail.id}`}
                  className="group flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-semibold text-cielo-950 group-hover:text-forest-700">
                      {trail.name}
                    </p>
                    <p className="mt-0.5 text-xs text-piedra-500">
                      {trail.distanceKm} km de recorrido · {trail.difficulty} · {trail.durationH} h
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-sm text-piedra-500">
                    a {km.toFixed(1)} km
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Reserva */}
        <aside>
          <div className="rounded-2xl border border-piedra-200 bg-white p-6 lg:sticky lg:top-20">
            <div className="flex items-end justify-between">
              <p className="text-xl font-semibold text-cielo-950">
                {money(property.pricePerNight)}
                <span className="text-sm font-normal text-piedra-400"> / noche</span>
              </p>
              <Rating value={property.rating} count={property.reviews} />
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-piedra-200">
              <div className="grid grid-cols-2">
                <label className="border-b border-r border-piedra-200 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-piedra-500">Llegada</span>
                  <input
                    type="date"
                    value={checkin}
                    onChange={(e) => setCheckin(e.target.value)}
                    className="mt-1 w-full text-sm outline-none"
                  />
                </label>
                <label className="border-b border-piedra-200 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-piedra-500">Salida</span>
                  <input
                    type="date"
                    value={checkout}
                    onChange={(e) => setCheckout(e.target.value)}
                    className="mt-1 w-full text-sm outline-none"
                  />
                </label>
                <label className="col-span-2 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-piedra-500">Huéspedes</span>
                  <span className="mt-1 flex items-center gap-3">
                    <UserIcon className="h-4 w-4 text-piedra-400" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(+e.target.value)}
                      className="w-full text-sm outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'huésped' : 'huéspedes'}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm text-piedra-600">
              <p className="flex justify-between">
                <span>
                  {money(property.pricePerNight)} × {nights} {nights === 1 ? 'noche' : 'noches'}
                </span>
                <span>{money(property.pricePerNight * nights)}</span>
              </p>
              <p className="flex justify-between">
                <span>Tarifa de servicio</span>
                <span>{money(serviceFee)}</span>
              </p>
              <p className="flex justify-between border-t border-piedra-100 pt-3 text-base font-semibold text-cielo-950">
                <span>Total</span>
                <span>{money(total)}</span>
              </p>
            </div>

            <button className="mt-5 w-full rounded-xl bg-forest-800 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-forest-900 active:scale-[0.99]">
              Reservar
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-piedra-400">
              <StarIcon className="h-3.5 w-3.5 text-earth-400" />
              La reserva se confirma al contactarse con el anfitrión
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}

function haversineKm(a: [number, number], b: [number, number]) {
  const toRad = (v: number) => (v * Math.PI) / 180
  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])
  const lat1 = toRad(a[0])
  const lat2 = toRad(b[0])
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}
