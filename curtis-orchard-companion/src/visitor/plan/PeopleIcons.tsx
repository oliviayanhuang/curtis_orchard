/** Simple figure groups for the "who are you visiting with" tiles. */
export type GroupVariant = 'child' | 'pair' | 'family' | 'adult' | 'senior'

function Figure({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} />
      <path d={`M${x - r * 1.75} ${y + r * 3.4} a ${r * 1.75} ${r * 2.2} 0 0 1 ${r * 3.5} 0z`} />
    </>
  )
}

export function GroupIcon({
  variant,
  className,
}: {
  variant: GroupVariant
  className?: string
}) {
  return (
    <svg viewBox="0 0 40 34" className={className} fill="currentColor" aria-hidden="true">
      {variant === 'child' && <Figure x={20} y={13} r={4.2} />}

      {variant === 'adult' && <Figure x={20} y={10} r={5.4} />}

      {variant === 'pair' && (
        <>
          <Figure x={12} y={12} r={4.6} />
          <Figure x={27} y={9} r={5.4} />
        </>
      )}

      {variant === 'family' && (
        <>
          <Figure x={9} y={13} r={3.8} />
          <Figure x={31} y={13} r={3.8} />
          <Figure x={20} y={9} r={5} />
        </>
      )}

      {variant === 'senior' && (
        <>
          <Figure x={17} y={10} r={5.2} />
          <rect x="28" y="9" width="2.2" height="19" rx="1.1" />
          <path d="M28 10.5c0-2.2 1.6-3.6 3.6-3.6v2.2c-.9 0-1.4.6-1.4 1.4z" />
        </>
      )}
    </svg>
  )
}
