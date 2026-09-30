import { Link } from 'react-router-dom'

interface Seccion {
  id: string
  titulo: string
  cuerpo: string[]
}

const SECCIONES: Seccion[] = [
  {
    id: 'quienes-somos',
    titulo: 'Quiénes somos',
    cuerpo: [
      'Serrana es una plataforma que conecta a personas que ofrecen alojamiento, rutas, servicios de filmación y alquiler de equipamiento en Córdoba con las personas que buscan contratarlos.',
      'El sitio es un catálogo: no vendemos ni reservamos por nuestra cuenta. Quien publica es responsable de lo que ofrece.',
    ],
  },
  {
    id: 'cuenta',
    titulo: 'Tu cuenta',
    cuerpo: [
      'Para usar el panel necesitás una cuenta con tu nombre y un correo válido. Hay dos tipos de cuenta: una para quienes ofrecen algo y otra para quienes solo quieren contratar.',
      'La contraseña la guardamos cifrada en tu navegador. Nadie del equipo puede verla. Si perdés el acceso a tu correo, hoy todavía no podemos enviarte un correo de recuperación: escribinos y te ayudamos a resolverlo.',
    ],
  },
  {
    id: 'publicaciones',
    titulo: 'Qué se publica y quién lo aprueba',
    cuerpo: [
      'Todo lo que subís pasa por una revisión antes de aparecer en el mapa y en el listado. Podemos pedirte cambios o no publicar una carga.',
      'La dirección que marcás en el mapa se usa solo para señalar dónde queda el lugar. No mostramos tu dirección exacta ni tu teléfono: el contacto es por correo.',
      'Nos reservamos el derecho de quitar una publicación que tenga datos falsos, precios que no correspondan o contenido que no sea del lugar ofrecido.',
    ],
  },
  {
    id: 'resenas',
    titulo: 'Reseñas y opiniones',
    cuerpo: [
      'Solo puede reseñar quien tiene cuenta y una sola vez por lugar. Las reseñas no se borran porque no gusten: si una reseña tiene insultos o datos personales, la podemos quitar.',
      'Las reseñas expresan la opinión de quien las escribe. Serrana no responde por lo que diga cada persona.',
    ],
  },
  {
    id: 'reservas',
    titulo: 'Reservas y pagos',
    cuerpo: [
      'Serrana no cobra comisiones ni intermedia pagos. La reserva, el precio final y la forma de pagar se acuerdan directo entre las dos partes.',
      'Si pagaste y no te devuelven el servicio, no hay nosotros para reclamar: contactá a quien te lo vendió. Guardá la conversación como prueba.',
    ],
  },
  {
    id: 'datos',
    titulo: 'Tus datos',
    cuerpo: [
      'Guardamos tu nombre, tu correo y lo que cargás en tu panel. No vendemos ni cedemos esa información.',
      'Todo eso vive en el almacenamiento local de tu navegador y no se envía a ningún servidor. No usamos cookies de rastreo ni herramientas de publicidad: está detallado en la página de privacidad.',
      'Las fotos que subís tienen que ser tuyas o tener permiso de quien las tomó. No uses imágenes de Google o de otro sitio sin permiso.',
    ],
  },
  {
    id: 'derechos',
    titulo: 'Tus derechos',
    cuerpo: [
      'Podés editar o borrar tus publicaciones cuando quieras desde el panel, sin escribirnos.',
      'Podés pedirnos borrar tu cuenta y todos tus datos. Escribinos al correo de contacto y lo hacemos.',
    ],
  },
  {
    id: 'cambios',
    titulo: 'Cambios en estos términos',
    cuerpo: [
      'Si cambiamos algo, actualizamos esta página y la fecha de arriba. Sigue usando el sitio después de un cambio, se entiende que aceptaste los términos nuevos.',
    ],
  },
]

export default function Terminos() {
  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
        <Link
          to="/"
          className="text-xs font-semibold text-piedra-500 underline underline-offset-4 transition-colors hover:text-cielo-950"
        >
          Volver al inicio
        </Link>

        <h1 className="mt-6 font-serif text-3xl text-cielo-950 sm:text-4xl">Términos y condiciones</h1>
        <p className="mt-3 text-sm leading-relaxed text-piedra-600">
          Última actualización: septiembre de 2026. Esta versión es un borrador: antes de publicar la
          web para clientes reales hay que revisarla con un abogado. Sobre qué guardamos y qué cookies
          usamos, mirá la página de{' '}
          <Link
            to="/privacidad"
            className="font-semibold text-cielo-950 underline underline-offset-4 hover:text-cielo-700"
          >
            privacidad
          </Link>
          .
        </p>

        <nav className="mt-8 rounded-2xl border border-piedra-200 bg-white px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wider text-piedra-500">Contenido</p>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {SECCIONES.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-cielo-950 underline underline-offset-4 transition-colors hover:text-cielo-700"
                >
                  {s.titulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 space-y-10">
          {SECCIONES.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="font-serif text-xl text-cielo-950 sm:text-2xl">{s.titulo}</h2>
              <div className="mt-3 space-y-3">
                {s.cuerpo
                  .filter(Boolean)
                  .map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed text-piedra-700">
                      {p}
                    </p>
                  ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-piedra-200 bg-white px-5 py-5 text-sm leading-relaxed text-piedra-600">
          <p className="font-semibold text-cielo-950">¿Tenés una duda?</p>
          <p className="mt-1.5">
            Escribinos por el formulario de contacto del pie de página. Para una reclamo, guardá
            siempre la conversación con la persona que te vendió el servicio.
          </p>
        </div>
      </div>
    </main>
  )
}
