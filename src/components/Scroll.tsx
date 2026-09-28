import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Devuelve 0→1 según cuánto se ve el elemento en el viewport. */
export function useViewportProgress<T extends HTMLElement>(offset = 0) {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    let frame = 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const measure = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const total = rect.height + vh - offset * 2
      const seen = vh - offset - rect.top
      const value = Math.min(1, Math.max(0, seen / total))
      setProgress(reduced ? 1 : value)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [offset])

  return { ref, progress }
}

/** Fondo que se desplaza más lento que el scroll. */
export function ParallaxBackground({
  image,
  speed = 0.18,
  className = '',
  overlay = 'from-cielo-950/80 via-cielo-950/40',
  children,
}: {
  image: string
  speed?: number
  className?: string
  overlay?: string
  children?: ReactNode
}) {
  const { ref, progress } = useViewportProgress<HTMLDivElement>()
  const shift = (progress - 0.5) * speed * 100

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <img
        src={image}
        alt=""
        className="h-full w-full object-cover will-change-transform"
        style={{ transform: `translate3d(0, ${shift.toFixed(2)}vh, 0) scale(1.18)` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${overlay}`} />
      {children}
    </div>
  )
}

/** Barra de progreso de lectura, fija arriba. */
export function ScrollProgress() {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setValue(max > 0 ? doc.scrollTop / max : 0)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent">
      <div
        className="h-full origin-left bg-forest-700"
        style={{ transform: `scaleX(${value})` }}
      />
    </div>
  )
}
