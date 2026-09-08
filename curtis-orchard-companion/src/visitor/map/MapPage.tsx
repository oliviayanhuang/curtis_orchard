import { useMemo, useState } from 'react'
import { TopBar } from '../../components/TopBar'
import { Chip, ChipRow, SearchField } from '../../components/ui'
import { FarmMap } from './FarmMap'
import { mapPins, todaySnapshot, YOU_ARE_HERE } from '../../data/today'
import type { MapCategory, MapPin } from '../../types'
import { activityDisplay, toneClass } from '../../domain/status'

const FILTERS: Array<{ id: 'all' | MapCategory; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'food', label: 'Food' },
  { id: 'activities', label: 'Activities' },
  { id: 'restrooms', label: 'Restrooms' },
]

export function MapPage() {
  const [filter, setFilter] = useState<'all' | MapCategory>('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<MapPin | null>(null)

  const pins = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mapPins.filter(
      (p) =>
        (filter === 'all' || p.category === filter) &&
        (q === '' || p.name.toLowerCase().includes(q)),
    )
  }, [filter, query])

  return (
    <>
      <TopBar title="Farm Map" back />

      <div className="shrink-0 bg-surface px-3.5 pb-3">
        <SearchField
          placeholder="Search for a location..."
          value={query}
          onChange={setQuery}
        />
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <FarmMap />

        {pins.map((pin) => (
          <button
            key={pin.id}
            type="button"
            onClick={() => setSelected(pin)}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-[22px] shadow-lift">
              <span aria-hidden="true">{pin.emoji}</span>
            </span>
            <span className="-mt-1.5 rounded-md bg-surface px-1.5 py-0.5 text-[12px] font-semibold whitespace-nowrap shadow-lift">
              {pin.name}
            </span>
          </button>
        ))}

        <div
          style={{ left: `${YOU_ARE_HERE.x}%`, top: `${YOU_ARE_HERE.y}%` }}
          className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1d6fd4] ring-[3px] ring-white">
            <span className="h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          <span className="-mt-1 rounded-md bg-surface px-1.5 py-0.5 text-[12px] font-semibold shadow-lift">
            You are here
          </span>
        </div>
      </div>

      <div className="shrink-0 border-t border-line bg-surface px-3.5 pt-3 pb-3.5">
        <p className="mb-2 text-[13px] font-semibold text-ink-2">Filter by:</p>
        <ChipRow>
          {FILTERS.map((f) => (
            <Chip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </Chip>
          ))}
        </ChipRow>
      </div>

      {selected && <PinSheet pin={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function PinSheet({ pin, onClose }: { pin: MapPin; onClose: () => void }) {
  const activity = todaySnapshot.activities.find(
    (a) => a.name.toLowerCase() === pin.name.toLowerCase(),
  )
  const display = activity ? activityDisplay(activity.status) : null

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="flex-1 bg-ink/25"
      />
      <div className="rounded-t-2xl border-t border-line bg-surface p-4 pb-6 shadow-lift">
        <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-line-strong" />
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="text-[30px] leading-none">
            {pin.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[18px]">{pin.name}</h2>
            <p className="mt-0.5 text-[14px] text-ink-2">
              About {pin.walkMinutes} min walk from here
              {display && (
                <>
                  {' · '}
                  <span className={`font-semibold ${toneClass[display.tone]}`}>
                    {display.label}
                  </span>
                </>
              )}
            </p>
            <p className="mt-2 text-[15px] text-ink-2">{pin.detail}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
