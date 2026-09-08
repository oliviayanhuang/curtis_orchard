import { Link } from 'react-router-dom'
import { TopBar } from '../../components/TopBar'
import { Card, DataRow, IconCard, ScrollArea } from '../../components/ui'
import { AlertIcon, PhoneIcon } from '../../components/Icons'
import { todaySnapshot } from '../../data/today'
import { activityDisplay, toneClass } from '../../domain/status'
import { isStale, relativeAge } from '../../domain/freshness'

export function TodayPage() {
  const t = todaySnapshot
  const stale = isStale(t.publishedAt)
  const featuredApples = t.apples.slice(0, 3)
  const featuredActivities = t.activities.slice(0, 4)
  const todaysEvent = t.events.find((e) => e.bucket === 'today')

  return (
    <>
      <TopBar brand />
      <ScrollArea>
        <div className="space-y-3 px-3.5 pt-4 pb-6">
          <div className="flex items-start justify-between gap-3 px-0.5">
            <div className="min-w-0">
              <h1 className="text-[27px] leading-[1.15]">
                Today at
                <br />
                Curtis Orchard
              </h1>
              <p className="mt-1.5 text-[15px] text-ink-2">{t.displayDate}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-card border border-line bg-surface px-3 py-2 shadow-card">
              <span aria-hidden="true" className="text-[22px] leading-none">
                {t.weather.emoji}
              </span>
              <span className="leading-tight">
                <span className="block text-[15px] font-bold">{t.weather.tempF}°F</span>
                <span className="block text-[12px] text-ink-2">{t.weather.label}</span>
              </span>
            </div>
          </div>

          {stale && (
            <Card className="border-harvest/40 bg-harvest/[0.06]">
              <div className="flex gap-3 p-3.5">
                <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-harvest" />
                <p className="text-[14px] text-ink-2">
                  This information has not been confirmed today. Please check with staff before
                  planning around it.
                </p>
              </div>
            </Card>
          )}

          <IconCard emoji="🕘" title="Hours">
            <p className="text-[15px] text-ink-2">{t.hours.label}</p>
          </IconCard>

          <IconCard
            emoji="🍎"
            title="Apples Available Today"
            footer={{ label: 'View all varieties', to: '/explore/apples' }}
          >
            <div>
              {featuredApples.map((a) => (
                <p key={a.id} className="py-[3px] text-[15px] text-ink-2">
                  {a.name}
                </p>
              ))}
            </div>
          </IconCard>

          <IconCard
            emoji="🎃"
            title="Activities Open Today"
            footer={{ label: 'View all activities', to: '/explore/activities' }}
          >
            <div>
              {featuredActivities.map((a) => {
                const d = activityDisplay(a.status)
                return (
                  <DataRow
                    key={a.id}
                    label={a.name}
                    value={a.window ?? d.label}
                    valueClass={a.window ? 'text-ink-2' : toneClass[d.tone]}
                  />
                )
              })}
            </div>
          </IconCard>

          {todaysEvent && (
            <IconCard emoji="📅" title="Today's Event">
              <p className="text-[15px] font-semibold">{todaysEvent.title}</p>
              <p className="text-[15px] text-ink-2">
                {todaysEvent.when.replace('Today, ', '')} | {todaysEvent.location}
              </p>
              <p className="text-[15px] text-ink-2">{todaysEvent.description}</p>
            </IconCard>
          )}

          {t.announcements.map((a) => (
            <Card key={a.id} className="border-harvest/40 bg-harvest/[0.06]">
              <div className="flex gap-3 p-3.5">
                <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-harvest" />
                <div>
                  <h2 className="text-[15px] font-bold">{a.title}</h2>
                  <p className="mt-0.5 text-[14px] text-ink-2">{a.body}</p>
                </div>
              </div>
            </Card>
          ))}

          <div className="px-0.5 pt-1">
            <p className="text-[13px] text-ink-3">
              Updated {relativeAge(t.publishedAt)} by {t.publishedBy}
            </p>
            <Link
              to="/help"
              className="mt-3 flex h-12 items-center justify-center gap-2 rounded-card bg-orchard text-[15px] font-semibold text-white active:bg-orchard-deep"
            >
              <PhoneIcon className="h-[18px] w-[18px]" />
              Call Curtis Orchard
            </Link>
          </div>
        </div>
      </ScrollArea>
    </>
  )
}
