import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRightIcon, StarIcon } from './Icons'
import { estadoClass, estadoLabel, type PublicacionEstado } from '../data/panel'

/** Layout común de los dos paneles. */
export function PanelShell({
  eyebrow,
  title,
  subtitle,
  actions,
  children,
}: {
  eyebrow: string
  title: string
  subtitle: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-24 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-piedra-200 pb-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest-700">{eyebrow}</p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight text-cielo-950 sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-piedra-500">{subtitle}</p>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      <div className="pt-8">{children}</div>
    </main>
  )
}

/** Cifras que se calculan a partir de los datos, no inventadas. */
export function StatGrid({ stats }: { stats: { label: string; value: number | string; hint?: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-piedra-200 bg-piedra-200 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-cream px-5 py-4">
          <dt className="text-xs font-medium uppercase tracking-wider text-piedra-500">{s.label}</dt>
          <dd className="mt-1 text-2xl font-semibold text-cielo-950">{s.value}</dd>
          {s.hint ? <p className="mt-0.5 text-xs text-piedra-500">{s.hint}</p> : null}
        </div>
      ))}
    </dl>
  )
}

export function StatusBadge({ estado }: { estado: PublicacionEstado }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${estadoClass[estado]}`}>
      {estadoLabel[estado]}
    </span>
  )
}

export function SectionLabel({ children, count }: { children: ReactNode; count?: number }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-cielo-950">{children}</h2>
      {typeof count === 'number' ? <span className="text-xs text-piedra-500">{count}</span> : null}
    </div>
  )
}

export function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-piedra-300 px-6 py-10 text-center">
      <p className="text-sm font-semibold text-cielo-950">{title}</p>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-piedra-500">{desc}</p>
    </div>
  )
}

export function RowLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-4 border-b border-piedra-200 py-4 transition-colors last:border-b-0 hover:bg-cream-dark/60"
    >
      {children}
      <ChevronRightIcon className="h-4 w-4 shrink-0 text-piedra-400 transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

export function RatingInline({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-piedra-600">
      <StarIcon className="h-3.5 w-3.5 text-earth-400" />
      {value.toFixed(1)}
    </span>
  )
}

export function Money({ value }: { value: number }) {
  return <span className="text-sm font-semibold text-cielo-950">USD {value}</span>
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
