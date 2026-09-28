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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          node.classList.add('is-visible')
          observer.unobserve(node)
        })
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
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

/** Barrido de la imagen de arriba hacia abajo. */
export function ImageReveal({ children, className = '', delay = 0 }: Omit<RevealProps, 'as' | 'variant'>) {
  const { ref, className: revealClass } = useReveal<HTMLDivElement>('reveal-img', 0.05)

  return (
    <div ref={ref} className={`${revealClass} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export default ScrollReveal
