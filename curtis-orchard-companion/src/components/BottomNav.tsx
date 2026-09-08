import { NavLink } from 'react-router-dom'
import { CalendarIcon, HomeIcon, PinIcon, PlanIcon, SearchIcon } from './Icons'

const TABS = [
  { to: '/', label: 'Today', Icon: HomeIcon, end: true },
  { to: '/map', label: 'Map', Icon: PinIcon, end: false },
  { to: '/explore', label: 'Explore', Icon: SearchIcon, end: false },
  { to: '/plan', label: 'Plan', Icon: PlanIcon, end: false },
  { to: '/events', label: 'Events', Icon: CalendarIcon, end: false },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="z-20 shrink-0 border-t border-line bg-surface"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-5">
        {TABS.map(({ to, label, Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className="flex min-h-[56px] flex-col items-center justify-center gap-1 pt-2 pb-1.5"
            >
              {({ isActive }) => (
                <>
                  <Icon
                    filled={isActive}
                    className={`h-[22px] w-[22px] ${isActive ? 'text-orchard' : 'text-ink-2'}`}
                  />
                  <span
                    className={`text-[11px] leading-none ${
                      isActive ? 'font-semibold text-orchard' : 'text-ink-2'
                    }`}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
