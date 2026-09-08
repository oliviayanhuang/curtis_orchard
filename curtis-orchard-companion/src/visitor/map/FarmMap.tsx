// Hand-placed decorative layer for the farm map. Coordinates are in the SVG
// viewBox below, chosen so canopies never sit under a pin label.
const TREES: Array<[number, number, number]> = [
  [22, 44, 1], [58, 30, 0.85], [96, 58, 0.9], [140, 34, 0.8], [186, 44, 1],
  [232, 30, 0.85], [268, 62, 0.95], [312, 38, 0.9], [346, 66, 0.85],
  [30, 108, 0.9], [86, 128, 0.8], [150, 116, 1], [212, 132, 0.85],
  [258, 112, 0.9], [318, 124, 1], [352, 158, 0.8],
  [20, 186, 0.85], [72, 208, 0.95], [130, 190, 0.8], [196, 214, 0.9],
  [246, 190, 0.85], [300, 210, 1], [344, 236, 0.9],
  [46, 268, 0.9], [116, 286, 0.85], [178, 262, 0.95], [238, 292, 0.8],
  [292, 268, 0.9], [340, 300, 0.85],
  [66, 356, 0.9], [148, 372, 0.8], [218, 348, 0.95], [286, 376, 0.85],
  [336, 352, 0.9], [24, 322, 0.8], [200, 420, 0.85], [280, 430, 0.8],
  [110, 432, 0.9],
]

function Tree({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-1.6" y="6" width="3.2" height="9" rx="1.4" fill="#a58256" />
      <circle cx="-6.5" cy="2" r="7.5" fill="var(--color-canopy)" />
      <circle cx="6.5" cy="2" r="7.5" fill="var(--color-canopy)" />
      <circle cx="0" cy="-4" r="9.5" fill="var(--color-canopy)" />
      <circle cx="-3" cy="-1" r="6" fill="var(--color-canopy-deep)" opacity="0.45" />
    </g>
  )
}

export function FarmMap() {
  return (
    <svg
      viewBox="0 0 375 460"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-label="Illustrated map of Curtis Orchard"
      role="img"
    >
      <rect width="375" height="460" fill="var(--color-field)" />

      {/* Mown grass banding, very low contrast */}
      <g opacity="0.35" fill="var(--color-canopy)">
        <rect y="90" width="375" height="26" />
        <rect y="230" width="375" height="26" />
        <rect y="370" width="375" height="26" />
      </g>

      {/* Walking paths */}
      <g
        fill="none"
        stroke="var(--color-path)"
        strokeWidth="19"
        strokeLinecap="round"
      >
        <path d="M188 470 C 188 400, 150 360, 152 300 S 210 210, 206 150 S 170 60, 176 -10" />
        <path d="M-10 250 C 60 246, 110 300, 168 300" />
        <path d="M385 210 C 320 206, 262 258, 210 250" />
        <path d="M60 462 C 78 410, 120 372, 152 340" />
      </g>
      <g
        fill="none"
        stroke="#f6efe1"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.75"
      >
        <path d="M188 470 C 188 400, 150 360, 152 300 S 210 210, 206 150 S 170 60, 176 -10" />
      </g>

      {/* Pond */}
      <path
        d="M-20 372 C 18 356, 54 372, 62 396 C 70 422, 40 448, 2 452 C -30 456, -46 420, -20 372 Z"
        fill="var(--color-water)"
      />
      <path
        d="M-14 384 C 12 374, 40 386, 46 402"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.5"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Orchard rows behind the north pins */}
      <g opacity="0.5" stroke="var(--color-canopy-deep)" strokeWidth="2.5" strokeLinecap="round">
        <path d="M40 14 H 130" />
        <path d="M40 26 H 122" />
        <path d="M244 14 H 340" />
        <path d="M252 26 H 334" />
      </g>

      {TREES.map(([x, y, s], i) => (
        <Tree key={i} x={x} y={y} s={s} />
      ))}
    </svg>
  )
}
