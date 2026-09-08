/**
 * Flat illustrations stand in for the photography in the design comp. They keep
 * the list looking deliberate without shipping stock imagery we do not own.
 */
const frame = {
  viewBox: '0 0 64 64',
  className: 'h-full w-full',
} as const

export function ApplePickingArt() {
  return (
    <svg {...frame} aria-hidden="true">
      <rect width="64" height="64" fill="#e9f0e0" />
      <path d="M0 46h64v18H0z" fill="#c9a06a" />
      <path d="M0 46h64v4H0z" fill="#b98d55" />
      <g fill="#b3242c">
        <circle cx="18" cy="40" r="9" />
        <circle cx="34" cy="43" r="9" />
        <circle cx="49" cy="39" r="9" />
      </g>
      <g fill="#8e1a21">
        <circle cx="21" cy="43" r="3.4" opacity="0.5" />
        <circle cx="37" cy="46" r="3.4" opacity="0.5" />
        <circle cx="52" cy="42" r="3.4" opacity="0.5" />
      </g>
      <g stroke="#6b4a2a" strokeWidth="2" strokeLinecap="round">
        <path d="M18 31v-4M34 34v-4M49 30v-4" />
      </g>
      <path d="M0 0h64v24H0z" fill="#8fb271" />
      <g fill="#a9c78c">
        <circle cx="12" cy="20" r="12" />
        <circle cx="34" cy="16" r="14" />
        <circle cx="56" cy="21" r="12" />
      </g>
    </svg>
  )
}

export function AnimalsArt() {
  return (
    <svg {...frame} aria-hidden="true">
      <rect width="64" height="64" fill="#f0ece1" />
      <path d="M0 46h64v18H0z" fill="#cbd9ae" />
      <path d="M0 46h64v3H0z" fill="#b8ca97" />
      {/* body */}
      <rect x="12" y="28" width="30" height="17" rx="7" fill="#a9764a" />
      <g fill="#8e5f39">
        <rect x="16" y="42" width="4.5" height="10" rx="2.2" />
        <rect x="26" y="42" width="4.5" height="10" rx="2.2" />
        <rect x="35" y="42" width="4.5" height="10" rx="2.2" />
      </g>
      {/* head */}
      <path d="M40 26h11a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4h-7a4 4 0 0 1-4-4z" fill="#c08c5c" />
      <path d="M51 33h5a2.6 2.6 0 0 1 0 5h-5z" fill="#a9764a" />
      <circle cx="47" cy="31.5" r="1.6" fill="#2b2118" />
      {/* horns + ear */}
      <path
        d="M44 25c-1-3.5-3.5-5-6-4.6M50 25c.2-3.6 2.2-5.4 4.8-5.4"
        fill="none"
        stroke="#7d5636"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <ellipse cx="41" cy="30" rx="3.4" ry="2" fill="#8e5f39" transform="rotate(-16 41 30)" />
      {/* tail */}
      <path d="M12 31c-3-1-5 .5-5 3" fill="none" stroke="#8e5f39" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function KidsArt() {
  return (
    <svg {...frame} aria-hidden="true">
      <rect width="64" height="64" fill="#f2ead9" />
      <path d="M0 42h64v22H0z" fill="#dcd0b4" />
      <g fill="#e08b2a">
        <ellipse cx="20" cy="44" rx="13" ry="11" />
        <ellipse cx="43" cy="47" rx="15" ry="12" />
      </g>
      <g fill="#c4731d" opacity="0.55">
        <ellipse cx="20" cy="44" rx="4" ry="11" />
        <ellipse cx="43" cy="47" rx="4.6" ry="12" />
      </g>
      <g stroke="#4f7a35" strokeWidth="3" strokeLinecap="round">
        <path d="M20 33v-4M43 35v-5" />
      </g>
      <g fill="#8fb271">
        <path d="M0 24h64v10H0z" opacity="0.5" />
      </g>
    </svg>
  )
}

export function FoodArt() {
  return (
    <svg {...frame} aria-hidden="true">
      <rect width="64" height="64" fill="#f6ebdd" />
      {/* cider mug */}
      <path d="M34 28h18v17a7 7 0 0 1-7 7h-4a7 7 0 0 1-7-7z" fill="#b8532f" />
      <path d="M34 28h18v4H34z" fill="#f0d3b0" />
      <path
        d="M52 33h3.5a5 5 0 0 1 0 10H52"
        fill="none"
        stroke="#b8532f"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {/* donut */}
      <circle cx="21" cy="36" r="15" fill="#c98a4b" />
      <path d="M6.6 32c3.4-6.6 25.4-6.6 28.8 0-2.6 6-26.2 6-28.8 0z" fill="#f0d3b0" />
      <circle cx="21" cy="36" r="5.2" fill="#f6ebdd" />
      <g fill="#b3242c">
        <rect x="12" y="28" width="4" height="1.8" rx="0.9" transform="rotate(-18 12 28)" />
        <rect x="23" y="26" width="4" height="1.8" rx="0.9" transform="rotate(12 23 26)" />
        <rect x="28" y="33" width="4" height="1.8" rx="0.9" transform="rotate(-25 28 33)" />
      </g>
    </svg>
  )
}

export function ShoppingArt() {
  return (
    <svg {...frame} aria-hidden="true">
      <rect width="64" height="64" fill="#eef1f4" />
      <path d="M10 26h44v34H10z" fill="#c8503f" />
      <path d="M10 26h44v6H10z" fill="#a8402f" />
      <path d="M6 26 14 12h36l8 14z" fill="#e6e1d6" />
      <g fill="#f3efe6">
        <rect x="18" y="38" width="12" height="12" rx="1.5" />
        <rect x="34" y="38" width="12" height="12" rx="1.5" />
      </g>
      <rect x="27" y="50" width="10" height="10" fill="#8a3427" />
      <g stroke="#ffffff" strokeWidth="2" opacity="0.6">
        <path d="M24 38v12M40 38v12" />
      </g>
    </svg>
  )
}
