import { useState } from 'react'
import { TopBar } from '../../components/TopBar'
import { Card, ScrollArea } from '../../components/ui'
import { HeartIcon } from '../../components/Icons'
import { todaySnapshot } from '../../data/today'

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'upcoming', label: 'Upcoming' },
] as const

type TabId = (typeof TABS)[number]['id']

export function EventsPage() {
  const [tab, setTab] = useState<TabId>('today')
  const [saved, setSaved] = useState<string[]>([])

  const events = todaySnapshot.events.filter((e) =>
    tab === 'today' ? e.bucket === 'today' : tab === 'week' ? e.bucket !== 'upcoming' : true,
  )

  const toggle = (id: string) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  return (
    <>
      <TopBar title="Events" back />

      <div className="shrink-0 bg-surface px-3.5 pb-3">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
              className={`h-9 flex-1 rounded-pill text-[14px] font-semibold transition-colors ${
                tab === t.id
                  ? 'bg-orchard text-white'
                  : 'border border-line bg-surface text-ink-2 active:bg-page'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea>
        <div className="space-y-2.5 px-3.5 pt-3.5 pb-6">
          {events.map((e) => (
            <Card key={e.id}>
              <article className="flex gap-3 p-3.5">
                <span aria-hidden="true" className="w-9 shrink-0 text-center text-[30px] leading-none">
                  {e.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="pr-8 text-[16px] leading-tight">{e.title}</h2>
                  <p className="mt-1 text-[14.5px] text-ink-2">{e.when}</p>
                  <p className="text-[14.5px] text-ink-2">{e.location}</p>
                  <p className="mt-1 text-[14.5px] text-ink-2">{e.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(e.id)}
                  aria-label={saved.includes(e.id) ? `Remove ${e.title}` : `Save ${e.title}`}
                  aria-pressed={saved.includes(e.id)}
                  className={`-mt-1 -mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    saved.includes(e.id) ? 'text-apple' : 'text-ink-3'
                  }`}
                >
                  <HeartIcon filled={saved.includes(e.id)} className="h-[21px] w-[21px]" />
                </button>
              </article>
            </Card>
          ))}

          {events.length === 0 && (
            <p className="px-1 pt-8 text-center text-[15px] text-ink-2">
              No events scheduled for today.
            </p>
          )}

          <p className="px-1 pt-2 text-[13px] text-ink-3">
            The full season calendar lives on curtisorchard.com.
          </p>
        </div>
      </ScrollArea>
    </>
  )
}
