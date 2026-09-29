import type { MapItem } from './MapView'
import type { Publicacion } from '../data/publicaciones'

/** Convierte una publicación aprobada en un marcador para los mapas. */
export function aMapItem(p: Publicacion): MapItem {
  const precio = p.tipo === 'espacio' && p.precio !== null ? `$${p.precio}` : null
  const km = p.tipo === 'ruta' && p.distanciaKm !== null ? `${p.distanciaKm} km` : null
  const tipo = p.tipo === 'espacio' ? p.categoria : p.dificultad

  return {
    id: p.id,
    position: p.coordenadas as [number, number],
    label: precio ?? km ?? 'Nuevo',
    title: p.nombre,
    subtitle: [tipo, p.ubicacion].filter(Boolean).join(' · '),
    meta: p.duenioNombre,
    image: p.fotos[0],
  }
}
