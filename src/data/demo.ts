// ============================================================
// Datos de demostración: lugares reales de Córdoba con inventario ficticio.
// Sirven para maquetar la interfaz; se reemplazan por la API cuando exista.
// ============================================================

export const img = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

// ---------- Tipos ----------
export type PropertyCategory =
  | 'camping'
  | 'glamping'
  | 'domo'
  | 'cabaña'
  | 'tiny house'
  | 'refugio'
  | 'motorhome'

export interface Property {
  id: string
  name: string
  category: PropertyCategory
  region: string
  location: string
  pricePerNight: number
  rating: number
  reviews: number
  capacity: number
  beds: number
  image: string
  images: string[]
  description: string
  features: string[]
  nearby: { label: string; distance: string }[]
  coordinates: [number, number]
  emoji: string
}

export interface Trail {
  id: string
  name: string
  region: string
  location: string
  distanceKm: number
  difficulty: 'Fácil' | 'Moderado' | 'Difícil'
  durationH: number
  elevationGain: number
  maxAltitude: number
  rating: number
  reviews: number
  image: string
  description: string
  terrain: string[]
  emoji: string
  coordinates: [number, number]
}

export interface Experience {
  id: string
  name: string
  category: string
  region: string
  price: number
  durationH: number
  rating: number
  image: string
  description: string
  emoji: string
  coordinates: [number, number]
}

export interface RegionInfo {
  id: string
  name: string
  tagline: string
  description: string
  image: string
}

// ---------- Regiones ----------
export const regions: RegionInfo[] = [
  {
    id: 'sierras-chicas',
    name: 'Sierras Chicas',
    tagline: 'Naturaleza a minutos de la ciudad',
    description: 'Cerros, ríos y senderos perfectos para una escapada exprés.',
    image: img('1506905925346-21bda4d32df4', 1000),
  },
  {
    id: 'punilla',
    name: 'Punilla',
    tagline: 'Lagos, montañas y pueblos serranos',
    description: 'El valle más famoso de Córdoba, entre el lago y las cumbres.',
    image: img('1454496522488-7a8e488e8606', 1000),
  },
  {
    id: 'traslasierra',
    name: 'Traslasierra',
    tagline: 'Montañas, ríos y cielos inmensos',
    description: 'Algunos de los paisajes más salvajes y los mejores cielos nocturnos.',
    image: img('1441974231531-c6227db76b6e', 1000),
  },
  {
    id: 'calamuchita',
    name: 'Calamuchita',
    tagline: 'Bosques, ríos y encanto europeo',
    description: 'Lagos cristalinos y pueblos con aire de montaña alpina.',
    image: img('1501785888041-af3ef285b470', 1000),
  },
  {
    id: 'sierras-del-sur',
    name: 'Sierras del Sur',
    tagline: 'Sierras de aventura y tranquilidad',
    description: 'Terrenos más ondulados, ideales para trekking y ciclismo.',
    image: img('1464822759023-fed622ff2c3b', 1000),
  },
  {
    id: 'paravachasca',
    name: 'Valle de Paravachasca',
    tagline: 'El valle esmeralda',
    description: 'Ríos transparentes y bosques nativos que invitan a quedarse.',
    image: img('1470071459604-3b5ec3a7fe05', 1000),
  },
]

// ---------- Categorías de búsqueda (el ícono se resuelve en la UI) ----------
export const adventureCategories = [
  { id: 'camping', label: 'Camping', desc: 'Dormir bajo las estrellas' },
  { id: 'glamping', label: 'Glamping', desc: 'Naturaleza con confort' },
  { id: 'cabana', label: 'Cabaña', desc: 'Rincón serrano' },
  { id: 'domo', label: 'Domo', desc: 'Acogedor y panorámico' },
  { id: 'trekking', label: 'Trekking', desc: 'Conquistar una montaña' },
  { id: 'experiencia', label: 'Experiencia', desc: 'Aventura con amigos' },
  { id: 'motorhome', label: 'Motorhome', desc: 'Viajar sin ataduras' },
]

// ---------- Alojamientos ----------
export const properties: Property[] = [
  {
    id: 'domo-entre-las-sierras',
    name: 'Domo entre las sierras',
    category: 'domo',
    region: 'Calamuchita',
    location: 'La Cumbrecita, Córdoba',
    pricePerNight: 85,
    rating: 4.9,
    reviews: 127,
    capacity: 4,
    beds: 1,
    image: img('1537565266759-34bbc16be345', 1000),
    images: [
      img('1537565266759-34bbc16be345', 1400),
      img('1519681393784-d120267933ba', 1000),
      img('1504280390367-361c6d9f38f4', 1000),
    ],
    description:
      'Un domo geodésico con paredes de vidrio que despierta entre bosques de pinos. Fogón exterior, hamacas y el cielo cordobés más oscuro a metros del refugio.',
    features: ['Fogón', 'Parrilla', 'Baño privado', 'Estacionamiento', 'Pet friendly', 'Cocina'],
    nearby: [
      { label: '🥾 Trekking', distance: '800 m' },
      { label: '🏞️ Río', distance: '1,2 km' },
      { label: '🌌 Astroturismo', distance: '2 km' },
    ],
    coordinates: [-31.9, -64.55],
    emoji: '🔮',
  },
  {
    id: 'camping-el-relincho',
    name: 'Camping El Relincho',
    category: 'camping',
    region: 'Traslasierra',
    location: 'Mina Clavero, Córdoba',
    pricePerNight: 9,
    rating: 4.6,
    reviews: 203,
    capacity: 6,
    beds: 0,
    image: img('1523987355523-c7b5b0dd90a7', 1000),
    images: [img('1523987355523-c7b5b0dd90a7', 1400), img('1504280390367-361c6d9f38f4', 1000)],
    description:
      'A orillas del río Mina Clavero, con sectores arbolados para carpas, mesas, fogones y bajada directa al balneario. Ideal para ir con amigos.',
    features: ['Fogón', 'Duchas', 'Electricidad', 'Parrilla', 'Estacionamiento'],
    nearby: [
      { label: '🏞️ Río', distance: '40 m' },
      { label: '🥾 Sendero', distance: '1 km' },
    ],
    coordinates: [-31.73, -65.01],
    emoji: '🏕️',
  },
  {
    id: 'glamping-las-altas-cumbres',
    name: 'Glamping Las Altas Cumbres',
    category: 'glamping',
    region: 'Punilla',
    location: 'Los Gigantes, Córdoba',
    pricePerNight: 120,
    rating: 4.8,
    reviews: 89,
    capacity: 2,
    beds: 1,
    image: img('1441974231531-c6227db76b6e', 1000),
    images: [img('1441974231531-c6227db76b6e', 1400), img('1519681393784-d120267933ba', 1000)],
    description:
      'Tiendas safari equipadas con cama king, calefacción y baño privado. Amaneceres sobre los granitos de Los Gigantes y fogata comunitaria nocturna.',
    features: ['Wi-Fi', 'Baño privado', 'Desayuno', 'Fogón', 'Calefacción'],
    nearby: [
      { label: '🧗 Escalada', distance: '5 km' },
      { label: '🥾 Trekking', distance: '2 km' },
    ],
    coordinates: [-31.36, -64.9],
    emoji: '⛺',
  },
  {
    id: 'cabanas-del-lago',
    name: 'Cabañas del Lago',
    category: 'cabaña',
    region: 'Punilla',
    location: 'Villa Carlos Paz, Córdoba',
    pricePerNight: 62,
    rating: 4.7,
    reviews: 156,
    capacity: 6,
    beds: 3,
    image: img('1473448912268-2022ce9509d8', 1000),
    images: [img('1473448912268-2022ce9509d8', 1400), img('1508873696983-2dfd5898f08b', 1000)],
    description:
      'Cabinas de madera con vista al lago San Roque. Patio con parrilla, bicicletas de cortesía y a 10 minutos del centro.',
    features: ['Parrilla', 'Wi-Fi', 'Piscina', 'Cocina', 'Estacionamiento'],
    nearby: [
      { label: '🏔️ Cerro de la Cruz', distance: '6 km' },
      { label: '🥾 Trekking', distance: '4 km' },
    ],
    coordinates: [-31.42, -64.49],
    emoji: '🏡',
  },
  {
    id: 'tiny-house-valle-verde',
    name: 'Tiny House Valle Verde',
    category: 'tiny house',
    region: 'Paravachasca',
    location: 'Alta Gracia, Córdoba',
    pricePerNight: 78,
    rating: 4.9,
    reviews: 74,
    capacity: 2,
    beds: 1,
    image: img('1518780664697-55e3ad937233', 1000),
    images: [img('1518780664697-55e3ad937233', 1400), img('1508873696983-2dfd5898f08b', 1000)],
    description:
      'Minicasa nórdica en medio de un bosque de molles. Terraza con vista, cocina completa y río a 600 metros por una huella de tierra.',
    features: ['Cocina', 'Wi-Fi', 'Hidromasaje', 'Estacionamiento', 'Pet friendly'],
    nearby: [
      { label: '🏞️ Río', distance: '600 m' },
      { label: '🐎 Cabalgata', distance: '3 km' },
    ],
    coordinates: [-31.66, -64.43],
    emoji: '🏡',
  },
  {
    id: 'refugio-del-velez',
    name: 'Refugio del Veléz',
    category: 'refugio',
    region: 'Traslasierra',
    location: 'Parque Nacional Quebrada del Condorito, Córdoba',
    pricePerNight: 22,
    rating: 4.5,
    reviews: 67,
    capacity: 8,
    beds: 8,
    image: img('1518495973542-4542c06a5843', 1000),
    images: [img('1518495973542-4542c06a5843', 1400), img('1470071459604-3b5ec3a7fe05', 1000)],
    description:
      'Refugio simple y acogedor junto al sendero al Balcón Norte, con literas, cocina compartida y chimenea. Punto de partida al condorito serrano.',
    features: ['Chimenea', 'Cocina compartida', 'Agua'],
    nearby: [
      { label: '🦅 Sendero al Balcón', distance: '200 m' },
      { label: '🏔️ Cerro Champaquí', distance: '16 km' },
    ],
    coordinates: [-31.6, -65.01],
    emoji: '⛰️',
  },
  {
    id: 'glamping-quinta-del-sol',
    name: 'Glamping Estancia Quinta del Sol',
    category: 'glamping',
    region: 'Sierras del Sur',
    location: 'Alpa Corral, Córdoba',
    pricePerNight: 96,
    rating: 4.8,
    reviews: 58,
    capacity: 4,
    beds: 2,
    image: img('1504280390367-361c6d9f38f4', 1000),
    images: [img('1504280390367-361c6d9f38f4', 1400), img('1519681393784-d120267933ba', 1000)],
    description:
      'Carpa safari en una estancia de campo, con cena a la luz de la luna, astroturismo guiado y paseos a caballo por los potreros.',
    features: ['Desayuno', 'Cena opcional', 'Fogón', 'Cabalgata incluida'],
    nearby: [
      { label: '🐎 Cabalgata', distance: '500 m' },
      { label: '🌌 Astroturismo', distance: 'En el lugar' },
    ],
    coordinates: [-33.12, -64.61],
    emoji: '⛺',
  },
  {
    id: 'motorhome-punto-serrano',
    name: 'Motorhome Punto Serrano',
    category: 'motorhome',
    region: 'Calamuchita',
    location: 'Santa Rosa de Calamuchita, Córdoba',
    pricePerNight: 15,
    rating: 4.4,
    reviews: 41,
    capacity: 4,
    beds: 2,
    image: img('1501785888041-af3ef285b470', 1000),
    images: [img('1501785888041-af3ef285b470', 1400), img('1519681393784-d120267933ba', 1000)],
    description:
      'Parque para motorhomes con servicios completos, a 800 metros del río. Conexión eléctrica, agua y zona de descarga de aguas grises.',
    features: ['Electricidad', 'Agua', 'Baños', 'Duchas', 'Wi-Fi'],
    nearby: [
      { label: '🏞️ Río', distance: '800 m' },
      { label: '🥾 Sendero', distance: '3 km' },
    ],
    coordinates: [-32.07, -64.54],
    emoji: '🚐',
  },
]

// ---------- Trekkings ----------
export const trails: Trail[] = [
  {
    id: 'sendero-altas-cumbres',
    name: 'Sendero de las Altas Cumbres',
    region: 'Punilla',
    location: 'Camino de las Altas Cumbres, Córdoba',
    distanceKm: 8.4,
    difficulty: 'Moderado',
    durationH: 3,
    elevationGain: 420,
    maxAltitude: 1410,
    rating: 4.8,
    reviews: 210,
    image: img('1551632811-561732d1e306', 1000),
    description:
      'Sendero con vistas panorámicas de los valles de Punilla y Traslasierra. Ideal al amanecer, con nubes bajas entre los granitos.',
    terrain: ['Roca', 'Sendero', 'Zanjas'],
    emoji: '🥾',
    coordinates: [-31.23, -64.68],
  },
  {
    id: 'cerro-champaqui',
    name: 'Cerro Champaquí',
    region: 'Traslasierra',
    location: 'Villa Alpina, Córdoba',
    distanceKm: 16.8,
    difficulty: 'Difícil',
    durationH: 7,
    elevationGain: 980,
    maxAltitude: 2790,
    rating: 4.9,
    reviews: 340,
    image: img('1464822759023-fed622ff2c3b', 1000),
    description:
      'La cumbre más alta de Córdoba. Exigente pero premiante: arriba, la sensación de estar en el techo de las sierras.',
    terrain: ['Roca', 'Pastizal de altura', 'Pendiente fuerte'],
    emoji: '🏔️',
    coordinates: [-31.9, -64.9],
  },
  {
    id: 'balcon-norte',
    name: 'Balcón Norte',
    region: 'Traslasierra',
    location: 'Quebrada del Condorito, Córdoba',
    distanceKm: 7.2,
    difficulty: 'Moderado',
    durationH: 3.5,
    elevationGain: 260,
    maxAltitude: 1900,
    rating: 4.8,
    reviews: 260,
    image: img('1470071459604-3b5ec3a7fe05', 1000),
    description:
      'El mirador para ver cóndores reales planear en la quebrada más profunda de Argentina fuera de los Andes.',
    terrain: ['Roca', 'Miradores'],
    emoji: '🦅',
    coordinates: [-31.6, -65.0],
  },
  {
    id: 'cerro-las-toscanas',
    name: 'Cerro Las Toscanas',
    region: 'Calamuchita',
    location: 'Los Reartes, Córdoba',
    distanceKm: 5.6,
    difficulty: 'Fácil',
    durationH: 2,
    elevationGain: 180,
    maxAltitude: 1200,
    rating: 4.6,
    reviews: 120,
    image: img('1508020963102-c6c723be5764', 1000),
    description:
      'Caminata tranquila entre bosques de tosca con vistas al valle de Calamuchita. Perfecta para empezar en el trekking.',
    terrain: ['Senderos', 'Bosque'],
    emoji: '🌲',
    coordinates: [-31.92, -64.58],
  },
  {
    id: 'pilones-de-copina',
    name: 'Pilones de Copina',
    region: 'Punilla',
    location: 'Copina, Córdoba',
    distanceKm: 4.1,
    difficulty: 'Fácil',
    durationH: 1.5,
    elevationGain: 120,
    maxAltitude: 1500,
    rating: 4.7,
    reviews: 95,
    image: img('1448375240586-882707db888b', 1000),
    description:
      'Siete pilones de granito naturales al borde del camino. Corta, fotogénica y apta para toda la familia.',
    terrain: ['Roca', 'Mirador'],
    emoji: '🪨',
    coordinates: [-31.28, -64.65],
  },
  {
    id: 'cerro-uritorco',
    name: 'Cerro Uritorco',
    region: 'Punilla',
    location: 'Capilla del Monte, Córdoba',
    distanceKm: 12.0,
    difficulty: 'Moderado',
    durationH: 5,
    elevationGain: 700,
    maxAltitude: 1979,
    rating: 4.6,
    reviews: 310,
    image: img('1506905925346-21bda4d32df4', 1000),
    description:
      'La montaña mítica de Córdoba. Un clásico que combina esfuerzo, leyendas locales y una vista enorme al valle de Punilla.',
    terrain: ['Sendero', 'Roca'],
    emoji: '🏔️',
    coordinates: [-30.93, -64.55],
  },
  {
    id: 'sendero-del-tipo',
    name: 'Sendero del Tipo',
    region: 'Sierras Chicas',
    location: 'Unquillo, Córdoba',
    distanceKm: 6.3,
    difficulty: 'Moderado',
    durationH: 2.5,
    elevationGain: 300,
    maxAltitude: 1150,
    rating: 4.5,
    reviews: 80,
    image: img('1551632811-561732d1e306', 1000),
    description:
      'Bosque nativo, arroyo y una subida accesible a minutos de la ciudad. La excursión de cabecera para los vecinos de Sierras Chicas.',
    terrain: ['Bosque', 'Arroyo'],
    emoji: '🌿',
    coordinates: [-31.23, -64.3],
  },
  {
    id: 'cumbre-de-las-sierras-del-sur',
    name: 'Cumbre de Sierras del Sur',
    region: 'Sierras del Sur',
    location: 'Alpa Corral, Córdoba',
    distanceKm: 9.5,
    difficulty: 'Moderado',
    durationH: 4,
    elevationGain: 480,
    maxAltitude: 1450,
    rating: 4.7,
    reviews: 70,
    image: img('1501854140801-50d01698950b', 1000),
    description:
      'Paisajes ondulados al sur, con baja concurrencia y silencio total. El trekking para quienes buscan soledad.',
    terrain: ['Sendero', 'Pastizal'],
    emoji: '⛰️',
    coordinates: [-33.15, -64.6],
  },
]

// ---------- Experiencias ----------
export const experiences: Experience[] = [
  {
    id: 'astro-noche-serrana',
    name: 'Astroturismo en Traslasierra',
    category: 'Astroturismo',
    region: 'Traslasierra',
    price: 25,
    durationH: 2.5,
    rating: 4.9,
    image: img('1446776811953-b23d57bd21aa', 1000),
    description: 'Noche de telescopio, láser astronómico y mitología de las constelaciones australes.',
    emoji: '🌌',
    coordinates: [-31.72, -64.9],
  },
  {
    id: 'kayak-lago-san-roque',
    name: 'Kayak al amanecer en el lago',
    category: 'Kayak',
    region: 'Punilla',
    price: 30,
    durationH: 2,
    rating: 4.7,
    image: img('1544551763-46a013bb70d5', 1000),
    description: 'Remá en aguas calmas mientras sale el sol sobre el lago San Roque.',
    emoji: '🛶',
    coordinates: [-31.44, -64.48],
  },
  {
    id: 'cabalgata-valle-de-paravachasca',
    name: 'Cabalgata guiada en Paravachasca',
    category: 'Cabalgata',
    region: 'Paravachasca',
    price: 40,
    durationH: 3,
    rating: 4.8,
    image: img('1501785888041-af3ef285b470', 1000),
    description: 'Cabalgata por bosques y ríos con guía local y parada con mate en la montaña.',
    emoji: '🐎',
    coordinates: [-31.65, -64.42],
  },
  {
    id: 'escalada-los-gigantes',
    name: 'Escalada en Los Gigantes',
    category: 'Escalada',
    region: 'Punilla',
    price: 55,
    durationH: 4,
    rating: 4.8,
    image: img('1448375240586-882707db888b', 1000),
    description: 'Vías para todos los niveles sobre las paredes de granito más famosas de Córdoba.',
    emoji: '🧗',
    coordinates: [-31.37, -64.79],
  },
  {
    id: 'pesca-embalse',
    name: 'Jornada de pesca en el embalse',
    category: 'Pesca',
    region: 'Calamuchita',
    price: 35,
    durationH: 4,
    rating: 4.5,
    image: img('1473448912268-2022ce9509d8', 1000),
    description: 'Pesca deportiva con guía, equipo incluido y costa tranquila garantizada.',
    emoji: '🎣',
    coordinates: [-32.06, -64.5],
  },
  {
    id: 'fogata-con-asado',
    name: 'Noche de fogata y asado',
    category: 'Experiencia grupal',
    region: 'Traslasierra',
    price: 28,
    durationH: 3,
    rating: 4.9,
    image: img('1504280390367-361c6d9f38f4', 1000),
    description: 'Asado criollo, guitarras y fogón bajo el cielo estrellado de las sierras.',
    emoji: '🔥',
    coordinates: [-31.74, -65.02],
  },
]

// ---------- Helpers ----------
export const propertyById = (id: string) => properties.find((p) => p.id === id)
export const trailById = (id: string) => trails.find((t) => t.id === id)
export const experienceById = (id: string) => experiences.find((x) => x.id === id)

export const categoryLabel: Record<PropertyCategory, string> = {
  camping: 'Camping',
  glamping: 'Glamping',
  domo: 'Domo',
  cabaña: 'Cabaña',
  'tiny house': 'Tiny house',
  refugio: 'Refugio',
  motorhome: 'Motorhome',
}

export const difficultyColor: Record<Trail['difficulty'], string> = {
  Fácil: 'bg-forest-100 text-forest-700',
  Moderado: 'bg-sand-200 text-earth-700',
  Difícil: 'bg-earth-400 text-cream',
}

export const money = (usd: number) => `USD ${usd}`