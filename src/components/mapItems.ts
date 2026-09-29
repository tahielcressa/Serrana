import type { MapItem } from './MapView'
import { donde, tipoPorId, type Publicacion } from '../data/publicaciones'

/** Convierte una publicación aprobada en un marcador para los mapas. */
export function aMapItem(p: Publicacion): MapItem {
  const etiqueta =
    p.precio !== null
      ? `$${p.precio}`
      : p.tipo === 'ruta' && p.distanciaKm !== null
        ? `${p.distanciaKm} km`
        : tipoPorId(p.tipo).label

  return {
    id: p.id,
    position: p.coordenadas as [number, number],
    label: etiqueta,
    title: p.nombre,
    subtitle: [p.categoria || tipoPorId(p.tipo).label, donde(p)].filter(Boolean).join(' · '),
    meta: p.duenioNombre,
    image: p.fotos[0],
  }
}
