import { Link } from 'react-router-dom'

const pages: Record<string, { title: string; desc: string; status: string }> = {
  favorites: {
    title: 'Favoritos',
    desc: 'Guardá alojamientos y rutas. Van a quedar guardados en tu cuenta, con listas por viaje.',
    status: 'En desarrollo',
  },
  trips: {
    title: 'Mis viajes',
    desc: 'Reservas próximas, viajes pasado y el detalle de cada salida por la sierra.',
    status: 'En desarrollo',
  },
  profile: {
    title: 'Mi perfil',
    desc: 'Tus datos, tus reseñas y los lugares que ya visitaste.',
    status: 'En desarrollo',
  },
  owner: {
    title: 'Panel de propietarios',
    desc: 'Publicá tu espacio, definí disponibilidad, recibí solicitudes de reserva y seguí tus ingresos.',
    status: 'Próximamente',
  },
  admin: {
    title: 'Panel administrativo',
    desc: 'Gestión de usuarios, alojamientos, rutas, reservas y reportes de la plataforma.',
    status: 'Próximamente',
  },
}

export default function Placeholder({ page }: { page: string }) {
  const info = pages[page] ?? pages.profile

  return (
    <main className="mx-auto flex min-h-[80dvh] max-w-2xl flex-col justify-center px-4 pb-20 pt-24">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest-700">{info.status}</p>
      <h1 className="mt-3 text-2xl font-semibold text-cielo-950 sm:text-3xl">{info.title}</h1>
      <p className="mt-4 leading-relaxed text-piedra-500">{info.desc}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/explore"
          className="rounded-full bg-cielo-950 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cielo-900"
        >
          Explorar lugares
        </Link>
        <Link
          to="/"
          className="rounded-full border border-piedra-300 px-5 py-2.5 text-sm font-semibold text-cielo-950 transition-colors hover:border-cielo-950"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
