import type { ReactNode } from 'react'
import { StarIcon } from './Icons'
import ScrollReveal from './ScrollReveal'

export function SectionTag({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-forest-600">
      <span className="h-px w-8 bg-earth-400" />
      {children}
    </p>
  )
}

export function SectionTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-display text-3xl font-semibold leading-tight text-cielo-950 sm:text-4xl ${className}`}>
      {children}
    </h2>
  )
}

export function SectionHeader({
  tag,
  title,
  subtitle,
  center = false,
}: {
  tag: string
  title: string
  subtitle?: string
  center?: boolean
}) {
  return (
    <ScrollReveal className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <div className={center ? 'flex justify-center' : ''}>
        <SectionTag>{tag}</SectionTag>
      </div>
      <SectionTitle className="mt-3">{title}</SectionTitle>
      {subtitle ? <p className="mt-3 text-piedra-500">{subtitle}</p> : null}
    </ScrollReveal>
  )
}

export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <StarIcon className="h-3.5 w-3.5 text-earth-400" />
      <strong className="font-semibold text-cielo-950">{value.toFixed(1)}</strong>
      {typeof count === 'number' ? <span className="text-piedra-400">({count})</span> : null}
    </span>
  )
}