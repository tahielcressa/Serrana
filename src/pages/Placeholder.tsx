import { Link } from 'react-router-dom'

const demo: Record<string, { title: string; desc: string; emoji: string }> = {
  favorites: {
    title: 'Favoritos',
    emoji: '❤️',
    desc: 'Guardá alojamientos, trekkings, experiencias y regiones. Próximamente podés crear listas como "Escapadas de fin de semana".',
  },
  trips: {
    title: 'Viajes',
    emoji: '🧳',
    desc: 'Tus reservas próximas y el historial de aventuras completadas.',
  },
  profile: {
    title: 'Mi perfil',
    emoji: '👤',
    desc: 'Foto, ubicación, reseñas y tus experiencias guardadas.',
  },
  owner: {
    title: 'Panel de propietarios',
    emoji: '🏡',
    desc: 'Publicá tu espacio gratis: reservas, ingresos, ocupación y rating en un solo lugar. Solo pagás comisión cuando concretás.',
  },
  admin: {
    title: 'Panel administrativo',
    emoji: '🛡️',
    desc: 'Administración de usuarios, propietarios, alojamientos, trekkings, reservas y reportes.',
  },
}

export default function Placeholder({ page }: { page: string }) {
  const info = demo[page] ?? demo.profile

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col items-center justify-center px-4 pt-24 pb-16 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-3xl bg-forest-50 text-4xl">{info.emoji}</span>
      <h1 className="mt-6 font-display text-3xl font-semibold text-cielo-950 sm:text-4xl">{info.title}</h1>
      <p className="mt-4 max-w-lg leading-relaxed text-piedra-500">{info.desc}</p>
      <span className="mt-6 rounded-full bg-sand-100 px-4 py-2 text-xs font-semibold text-earth-700">🛠️ Sección en construcción · MVP</span>
      <Link to="/" className="mt-8 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-cream hover:bg-forest-800">
        Volver al inicio
      </Link>
    </main>
  )
}