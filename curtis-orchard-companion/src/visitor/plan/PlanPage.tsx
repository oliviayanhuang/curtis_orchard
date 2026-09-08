import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TopBar } from '../../components/TopBar'
import { Card, ScrollArea } from '../../components/ui'
import { ArrowRight } from '../../components/Icons'
import { GroupIcon, type GroupVariant } from './PeopleIcons'
import { mapPins } from '../../data/today'

const COMPANY: Array<{
  id: string
  label: string
  sub: string
  variant: GroupVariant
}> = [
  { id: 'toddlers', label: 'Toddlers', sub: '(0–3)', variant: 'child' },
  { id: 'young', label: 'Young Children', sub: '(4–12)', variant: 'family' },
  { id: 'teens', label: 'Teenagers', sub: '(13+)', variant: 'pair' },
  { id: 'adults', label: 'Adults', sub: '', variant: 'adult' },
  { id: 'older', label: 'Older Adults', sub: '', variant: 'senior' },
]

const TIME = [
  { id: '1h', label: 'About an hour', sub: 'A quick stop' },
  { id: '2h', label: 'Two hours', sub: 'The usual visit' },
  { id: 'half', label: 'Half a day', sub: 'Time for lunch' },
  { id: 'full', label: 'A full day', sub: 'See everything' },
]

const INTERESTS = [
  { id: 'upick', label: 'Apple picking' },
  { id: 'animals', label: 'Animals' },
  { id: 'kids', label: 'Kids play' },
  { id: 'food', label: 'Food & cider' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'events', label: 'Events' },
]

const STOPS_BY_INTEREST: Record<string, string[]> = {
  upick: ['apple-orchard'],
  animals: ['goats'],
  kids: ['corn-maze', 'pumpkin-patch'],
  food: ['cafe'],
  shopping: ['country-store'],
  events: ['apple-orchard'],
}

export function PlanPage() {
  const [step, setStep] = useState(1)
  const [company, setCompany] = useState<string[]>([])
  const [time, setTime] = useState<string | null>(null)
  const [interests, setInterests] = useState<string[]>([])

  const toggle = (list: string[], set: (v: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

  const canAdvance =
    (step === 1 && company.length > 0) ||
    (step === 2 && time !== null) ||
    (step === 3 && interests.length > 0)

  const itinerary = buildItinerary(interests)

  return (
    <>
      <TopBar title="Plan My Visit" back />

      <div className="shrink-0 bg-surface px-3.5 pb-4">
        <ol className="flex items-center gap-2">
          {[1, 2, 3, 4].map((n) => (
            <li key={n} className="flex flex-1 items-center gap-2">
              <span
                aria-current={step === n ? 'step' : undefined}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                  n <= step ? 'bg-orchard text-white' : 'bg-page text-ink-3'
                }`}
              >
                {n}
              </span>
              {n < 4 && (
                <span
                  className={`h-px flex-1 ${n < step ? 'bg-orchard' : 'bg-line-strong'}`}
                />
              )}
            </li>
          ))}
        </ol>
      </div>

      <ScrollArea>
        <div className="px-3.5 pt-2 pb-6">
          {step === 1 && (
            <>
              <h2 className="px-0.5 pb-3 text-[19px]">Who are you visiting with?</h2>
              <div className="grid grid-cols-3 gap-2.5">
                {COMPANY.map((c) => (
                  <TileButton
                    key={c.id}
                    active={company.includes(c.id)}
                    onClick={() => toggle(company, setCompany, c.id)}
                  >
                    <GroupIcon variant={c.variant} className="h-8 w-8" />
                    <span className="mt-1.5 text-[12.5px] leading-tight font-semibold">
                      {c.label}
                    </span>
                    {c.sub && <span className="text-[12px] text-ink-2">{c.sub}</span>}
                  </TileButton>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="px-0.5 pb-3 text-[19px]">How much time do you have?</h2>
              <div className="space-y-2.5">
                {TIME.map((t) => (
                  <RowButton key={t.id} active={time === t.id} onClick={() => setTime(t.id)}>
                    <span className="block text-[15px] font-semibold">{t.label}</span>
                    <span className="block text-[13.5px] text-ink-2">{t.sub}</span>
                  </RowButton>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="px-0.5 pb-3 text-[19px]">What sounds good today?</h2>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((i) => (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => toggle(interests, setInterests, i.id)}
                    aria-pressed={interests.includes(i.id)}
                    className={`h-10 rounded-pill px-4 text-[14.5px] font-medium transition-colors ${
                      interests.includes(i.id)
                        ? 'bg-orchard text-white'
                        : 'border border-line bg-surface text-ink-2'
                    }`}
                  >
                    {i.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="px-0.5 text-[19px]">Your suggested route</h2>
              <p className="px-0.5 pb-3 text-[14px] text-ink-2">
                Walking order, starting from the parking lot.
              </p>
              <Card>
                <ol className="divide-y divide-line">
                  {itinerary.map((stop, i) => (
                    <li key={stop.id} className="flex items-center gap-3 p-3.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orchard-soft text-[13px] font-bold text-orchard">
                        {i + 1}
                      </span>
                      <span aria-hidden="true" className="text-[22px] leading-none">
                        {stop.emoji}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold">{stop.name}</span>
                        <span className="block text-[13.5px] text-ink-2">
                          about {stop.walkMinutes} min walk
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </Card>
              <Link
                to="/map"
                className="mt-3 flex h-12 items-center justify-center rounded-card border border-line bg-surface text-[15px] font-semibold"
              >
                Show these on the map
              </Link>
            </>
          )}
        </div>
      </ScrollArea>

      <div className="shrink-0 border-t border-line bg-surface px-3.5 py-3">
        {step < 4 ? (
          <button
            type="button"
            disabled={!canAdvance}
            onClick={() => setStep((s) => s + 1)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-card bg-orchard text-[15px] font-semibold text-white disabled:bg-line-strong disabled:text-ink-3"
          >
            Next
            <ArrowRight className="h-[18px] w-[18px]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="h-12 w-full rounded-card border border-line bg-surface text-[15px] font-semibold"
          >
            Start over
          </button>
        )}
      </div>
    </>
  )
}

function buildItinerary(interests: string[]) {
  const ids = new Set(interests.flatMap((i) => STOPS_BY_INTEREST[i] ?? []))
  const chosen = mapPins.filter((p) => ids.has(p.id))
  const stops = chosen.length > 0 ? chosen : mapPins.filter((p) => p.category === 'activities')
  return [...stops].sort((a, b) => a.walkMinutes - b.walkMinutes)
}

function TileButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-h-[104px] flex-col items-center justify-center rounded-card border px-1.5 py-3 text-center transition-colors ${
        active
          ? 'border-orchard bg-orchard-soft text-orchard'
          : 'border-line bg-surface text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function RowButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full rounded-card border px-4 py-3 text-left transition-colors ${
        active ? 'border-orchard bg-orchard-soft' : 'border-line bg-surface'
      }`}
    >
      {children}
    </button>
  )
}
