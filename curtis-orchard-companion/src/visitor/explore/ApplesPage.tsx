import { TopBar } from '../../components/TopBar'
import { Card, ScrollArea } from '../../components/ui'
import { todaySnapshot } from '../../data/today'
import { appleDisplay, toneClass } from '../../domain/status'
import { relativeAge } from '../../domain/freshness'

/** Section 50: U-Pick and Store availability are always shown separately. */
export function ApplesPage() {
  const { apples, publishedAt } = todaySnapshot

  return (
    <>
      <TopBar title="Apples" back />
      <ScrollArea>
        <div className="px-3.5 pt-4 pb-6">
          <p className="px-0.5 pb-3 text-[14px] text-ink-2">
            Availability is confirmed by staff each day. Updated {relativeAge(publishedAt)}.
          </p>

          <Card>
            <ul className="divide-y divide-line">
              {apples.map((a) => {
                const store = appleDisplay(a.store)
                const upick = appleDisplay(a.upick)
                return (
                  <li key={a.id} className="p-3.5">
                    <h2 className="text-[16px]">{a.name}</h2>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      <div className="rounded-[10px] bg-page px-3 py-2">
                        <p className="text-[12px] tracking-wide text-ink-3 uppercase">In Store</p>
                        <p className={`text-[14px] font-semibold ${toneClass[store.tone]}`}>
                          {store.label}
                        </p>
                      </div>
                      <div className="rounded-[10px] bg-page px-3 py-2">
                        <p className="text-[12px] tracking-wide text-ink-3 uppercase">U-Pick</p>
                        <p className={`text-[14px] font-semibold ${toneClass[upick.tone]}`}>
                          {upick.label}
                        </p>
                      </div>
                    </div>
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
