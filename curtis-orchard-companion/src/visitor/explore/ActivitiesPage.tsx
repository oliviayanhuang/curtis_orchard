import { TopBar } from '../../components/TopBar'
import { Card, ScrollArea } from '../../components/ui'
import { todaySnapshot } from '../../data/today'
import { activityDisplay, toneClass } from '../../domain/status'
import { relativeAge } from '../../domain/freshness'

export function ActivitiesPage() {
  const { activities, publishedAt } = todaySnapshot

  return (
    <>
      <TopBar title="Activities" back />
      <ScrollArea>
        <div className="px-3.5 pt-4 pb-6">
          <p className="px-0.5 pb-3 text-[14px] text-ink-2">
            Today’s status for every activity. Updated {relativeAge(publishedAt)}.
          </p>

          <Card>
            <ul className="divide-y divide-line">
              {activities.map((a) => {
                const d = activityDisplay(a.status)
                return (
                  <li key={a.id} className="flex items-start justify-between gap-4 p-3.5">
                    <div className="min-w-0">
                      <h2 className="text-[15px] font-semibold">{a.name}</h2>
                      {a.window && <p className="text-[14px] text-ink-2">{a.window}</p>}
                      {a.note && <p className="text-[13px] text-ink-3">{a.note}</p>}
                    </div>
                    <span
                      className={`shrink-0 pt-0.5 text-[12px] font-bold tracking-wide ${toneClass[d.tone]}`}
                    >
                      {d.label}
                    </span>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>
      </ScrollArea>
    </>
  )
}
