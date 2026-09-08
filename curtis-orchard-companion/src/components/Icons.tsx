interface IconProps {
  filled?: boolean
  className?: string
}

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function HomeIcon({ filled, className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path
        d="M4 10.2 12 4l8 6.2V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"
        fill={filled ? 'currentColor' : 'none'}
      />
    </svg>
  )
}

export function PinIcon({ filled, className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path
        d="M12 21c4.2-4.5 6.3-7.8 6.3-10.4A6.3 6.3 0 0 0 5.7 10.6C5.7 13.2 7.8 16.5 12 21z"
        fill={filled ? 'currentColor' : 'none'}
      />
      <circle cx="12" cy="10.3" r="2.3" fill={filled ? 'var(--color-surface)' : 'none'} stroke={filled ? 'none' : 'currentColor'} />
    </svg>
  )
}

export function SearchIcon({ filled, className }: IconProps) {
  return (
    <svg {...base} strokeWidth={filled ? 2.2 : 1.7} className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="6.4" />
      <path d="m14.6 15.4 3.4 4.1" />
    </svg>
  )
}

export function PlanIcon({ filled, className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="5.5" fill={filled ? 'currentColor' : 'none'} />
      <path
        d="m9.4 14.6 2-4.6 4.6-2-2 4.6z"
        stroke={filled ? 'var(--color-surface)' : 'currentColor'}
      />
    </svg>
  )
}

export function CalendarIcon({ filled, className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="4" y="5.5" width="16" height="14.5" rx="2.5" fill={filled ? 'currentColor' : 'none'} />
      <path d="M8 3.6v3.4M16 3.6v3.4" stroke="currentColor" />
      <rect
        x="10.4"
        y="11.6"
        width="3.2"
        height="3.2"
        rx="0.7"
        fill={filled ? 'var(--color-surface)' : 'currentColor'}
        stroke="none"
      />
    </svg>
  )
}

export function ChevronRight({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="m9.5 6 6 6-6 6" />
    </svg>
  )
}

export function ChevronLeft({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="m14.5 6-6 6 6 6" />
    </svg>
  )
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  )
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg {...base} strokeWidth={2} className={className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function HeartIcon({ filled, className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path
        d="M12 20s-7.3-4.4-7.3-9.3A4.2 4.2 0 0 1 12 8.2a4.2 4.2 0 0 1 7.3 2.5C19.3 15.6 12 20 12 20z"
        fill={filled ? 'currentColor' : 'none'}
      />
    </svg>
  )
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M6.4 3.8h3l1.5 3.7-2 1.4a11.4 11.4 0 0 0 5.2 5.2l1.4-2 3.7 1.5v3a1.8 1.8 0 0 1-2 1.8A15.4 15.4 0 0 1 4.6 5.8a1.8 1.8 0 0 1 1.8-2z" />
    </svg>
  )
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.4V12l3 1.8" />
    </svg>
  )
}

export function AlertIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 4.5 21 19.5H3z" />
      <path d="M12 10v4M12 16.8v.2" />
    </svg>
  )
}

/** Wordmark apple. Drawn rather than emoji so the header stays consistent. */
export function AppleMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 8.4C11 6.7 9.2 6.1 7.6 6.7 5.6 7.5 4.4 9.5 4.4 12.3c0 4 2.6 8.1 4.9 8.1 1 0 1.6-.5 2.7-.5s1.7.5 2.7.5c2.3 0 4.9-4.1 4.9-8.1 0-2.8-1.2-4.8-3.2-5.6-1.6-.6-3.4 0-4.4 1.7z"
        fill="var(--color-orchard)"
      />
      <path
        d="M12.5 8.1c-.3-2.3 1.1-4.3 3.8-4.8.4 2.4-1.2 4.4-3.8 4.8z"
        fill="var(--color-canopy)"
      />
      <path
        d="M12.1 8.3c-.2-1.6-.4-2.6-.7-3.4"
        fill="none"
        stroke="#6b4a2a"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}
