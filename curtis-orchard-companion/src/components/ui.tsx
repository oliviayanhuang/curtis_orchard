import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from './Icons'

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-card border border-line bg-surface shadow-card ${className}`}
    >
      {children}
    </section>
  )
}

/** The mockup's dominant pattern: a content emoji on the left, a titled block on the right. */
export function IconCard({
  emoji,
  title,
  children,
  footer,
}: {
  emoji: string
  title: string
  children?: ReactNode
  footer?: { label: string; to: string }
}) {
  return (
    <Card>
      <div className="flex gap-3 p-3.5">
        <span
          aria-hidden="true"
          className="w-8 shrink-0 pt-px text-center text-[26px] leading-none"
        >
          {emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-bold">{title}</h2>
          {children && <div className="mt-1.5">{children}</div>}
          {footer && (
            <Link
              to={footer.to}
              className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink"
            >
              + {footer.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}

/** Label on the left, value right-aligned — used for activities and apple rows. */
export function DataRow({
  label,
  value,
  valueClass = 'text-ink-2',
}: {
  label: string
  value: ReactNode
  valueClass?: string
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-[3px]">
      <span className="text-[15px] text-ink-2">{label}</span>
      <span className={`text-[14px] font-medium tabular-nums ${valueClass}`}>{value}</span>
    </div>
  )
}

export function ChipRow({ children }: { children: ReactNode }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto">{children}</div>
  )
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-9 shrink-0 rounded-pill px-4 text-[14px] font-medium transition-colors ${
        active
          ? 'bg-orchard text-white'
          : 'border border-line bg-surface text-ink-2 active:bg-page'
      }`}
    >
      {children}
    </button>
  )
}

export function SearchField({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="flex h-11 items-center gap-2.5 rounded-pill border border-line bg-page px-4">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        className="h-[18px] w-[18px] shrink-0 text-ink-2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="6.4" />
        <path d="m15 15.4 3.4 4.1" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink-3"
      />
    </label>
  )
}

export function ScrollArea({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      {children}
    </main>
  )
}
