import { useEffect, useRef, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'article' | 'li'
  variant?: 'up' | 'image'
}

function useReveal<T extends HTMLElement>(className: string, threshold = 0.12) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reveal = () => node.classList.add('is-visible')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          reveal()
          observer.unobserve(node)
        })
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(node)

    // Red de seguridad: si el observer no dispara, mostramos lo que ya esté
    // en pantalla. Nunca dejamos texto o fotos en opacity 0 para siempre.
    const safety = window.setTimeout(() => {
      const box = node.getBoundingClientRect()
      if (box.top < window.innerHeight && box.bottom > 0) reveal()
    }, 2000)

    return () => {
      observer.disconnect()
      window.clearTimeout(safety)
    }
  }, [threshold])

  return { ref, className }
}

/** Entrada suave al hacer scroll. */
export function ScrollReveal({ children, className = '', delay = 0, as: Tag = 'div' }: Omit<RevealProps, 'variant'>) {
  const { ref, className: revealClass } = useReveal<HTMLDivElement>('reveal')

  return (
    <Tag ref={ref as never} className={`${revealClass} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

/**
 * Barrido de la imagen de arriba hacia abajo.
 *
 * El recorte (clip-path) va en un hijo interno y no en el elemento observado:
 * si el elemento que mira el IntersectionObserver estuviera recortado al 0%,
 * nunca se consideraría visible y el reveal no se dispararía nunca.
 */
export function ImageReveal({ children, className = '', delay = 0 }: Omit<RevealProps, 'as' | 'variant'>) {
  const { ref, className: revealClass } = useReveal<HTMLDivElement>('reveal-img', 0.05)

  return (
    <div
      ref={ref}
      className={`${revealClass} relative ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="reveal-img-clip absolute inset-0">{children}</div>
    </div>
  )
}

export default ScrollReveal
