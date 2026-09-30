import { Link } from 'react-router-dom'

interface Seccion {
  id: string
  titulo: string
  cuerpo: string[]
}

const SECCIONES: Seccion[] = [
  {
    id: 'sin-cookies',
    titulo: 'No usamos cookies de rastreo',
    cuerpo: [
      'Serrana no pone cookies publicitarias, ni de seguimiento, ni de perfiles de comportamiento. No hay Google Analytics, ni Meta Pixel, ni ninguna herramienta que te siga entre sitios. Nunca te vamos a vender a un anunciante ni a una red de publicidad.',
      'Si algún día sumamos alguna de esas herramientas, va a estar escrito acá antes y vas a tener que aceptarlo de forma explícita.',
    ],
  },
  {
    id: 'que-guardamos',
    titulo: 'Qué guardamos en tu navegador',
    cuerpo: [
      'Para que el sitio funcione guardamos algunos datos en el almacenamiento local de tu navegador (localStorage). Esto no son cookies: no se envían a ningún servidor, no viajan a ningún lado y solo quedan en este dispositivo.',
      'La lista es corta y la podés ver vos mismo en las herramientas de tu navegador:',
    ],
  },
  {
    id: 'almacenamiento',
    titulo: 'Para qué sirve cada cosa',
    cuerpo: [
      'La clave "serrana:sesion" es la que te mantiene conectada. Sin ella tendrías que escribir tu correo y contraseña en cada visita.',
      'La clave "serrana:usuarios" guarda el nombre, el correo y una huella de la contraseña para que la cuenta exista. La contraseña no se guarda en texto legible.',
      'Las claves "serrana:publicaciones", "serrana:pedidos" y "serrana:resenas" guardan lo que cargás: lugares, rutas, servicios, equipamiento, pedidos y opiniones.',
      'La clave "serrana:cookies" guarda únicamente si ya aceptaste o no este aviso, para no mostrártelo en cada visita. No contiene datos personales.',
    ],
  },
  {
    id: 'que-salen',
    titulo: 'Qué sale de tu dispositivo y hacia dónde',
    cuerpo: [
      'Cuando abrís un mapa, el navegador le pide los dibujos del mapa a OpenStreetMap, a CARTO o a Esri, según el botón que elijas dentro del mapa. Eso significa que esos servicios ven la dirección IP desde la que te conectás y qué recuadro del mapa estás mirando. No guardamos esa información y no la usamos para identificarte.',
      'Si iniciás sesión con Google, la decisión y los datos los maneja Google: ellos aplican sus propias políticas de privacidad. En este prototipo solo decodificamos el comprobante que devuelve Google, así que todavía no es un acceso seguro.',
    ],
  },
  {
    id: 'terceros',
    titulo: 'Servicios de terceros',
    cuerpo: [
      'OpenStreetMap, CARTO y Esri: sirven las imágenes de los mapas. Sus términos están en openstreetmap.org/copyright, carto.com/attributions y arcgis.com.',
      'Google: solo si elegís entrar con tu cuenta de Google. También es el proveedor del archivo de las fotos del sitio.',
    ],
  },
  {
    id: 'borrar',
    titulo: 'Cómo borrar lo tuyo',
    cuerpo: [
      'Desde tu panel podés borrar cada publicación y cada pedido que cargaste. Las reseñas se pueden quitar si tienen insultos o datos personales.',
      'Para borrar tu cuenta y todo lo que publicaste escribinos a hola@serrana.travel. Si querés dejar el sitio limpio de una vez, podés borrar los datos del sitio desde las herramientas de tu navegador: eso también te cierra la sesión.',
    ],
  },
  {
    id: 'menores',
    titulo: 'Menores de edad',
    cuerpo: [
      'Serrana es para personas mayores de 18 años. Si sos menor y querés usar el sitio, necesitás la autorización de una persona adulta que responda por vos.',
    ],
  },
]

export default function Privacidad() {
  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
        <Link
          to="/"
          className="text-xs font-semibold text-piedra-500 underline underline-offset-4 transition-colors hover:text-cielo-950"
        >
          Volver al inicio
        </Link>

        <h1 className="mt-6 font-serif text-3xl text-cielo-950 sm:text-4xl">Privacidad y cookies</h1>
        <p className="mt-3 text-sm leading-relaxed text-piedra-600">
          Última actualización: septiembre de 2026. Esta página explica, sin vueltas, qué guardamos
          cuando usás Serrana. El detalle de las reglas del servicio está en los{' '}
          <Link
            to="/terminos"
            className="font-semibold text-cielo-950 underline underline-offset-4 hover:text-cielo-700"
          >
            términos y condiciones
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
          <p className="font-semibold text-cielo-950">¿Te quedó una duda?</p>
          <p className="mt-1.5">
            Escribinos a hola@serrana.travel y te explicamos en simple: qué dato guardamos, de
            dónde salió y cómo se borra. También podés revisar los{' '}
            <Link
              to="/terminos"
              className="font-semibold text-cielo-950 underline underline-offset-4 hover:text-cielo-700"
            >
              términos y condiciones
            </Link>{' '}
            completos.
          </p>
        </div>
      </div>
    </main>
  )
}
