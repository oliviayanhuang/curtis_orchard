import { TopBar } from '../../components/TopBar'
import { Card, ScrollArea } from '../../components/ui'
import { PhoneIcon } from '../../components/Icons'
import { todaySnapshot } from '../../data/today'
import { relativeAge } from '../../domain/freshness'

const PHONE = '+12178673073'
const PHONE_LABEL = '(217) 867-3073'

/** Section 26: there must always be a human fallback when data is uncertain. */
export function HelpPage() {
  return (
    <>
      <TopBar title="Help" back />
      <ScrollArea>
        <div className="space-y-3 px-3.5 pt-4 pb-6">
          <Card>
            <div className="p-3.5">
              <h2 className="text-[16px]">Not sure about something?</h2>
              <p className="mt-1 text-[15px] text-ink-2">
                Staff at the Country Store can confirm hours, availability, and closures right
                now.
              </p>
              <a
                href={`tel:${PHONE}`}
                className="mt-3 flex h-12 items-center justify-center gap-2 rounded-card bg-orchard text-[15px] font-semibold text-white active:bg-orchard-deep"
              >
                <PhoneIcon className="h-[18px] w-[18px]" />
                Call {PHONE_LABEL}
              </a>
            </div>
          </Card>

          <Card>
            <dl className="divide-y divide-line">
              <Row term="Address" desc="3902 S Duncan Rd, Champaign, IL 61822" />
              <Row term="Today’s hours" desc={todaySnapshot.hours.label} />
              <Row
                term="Information last confirmed"
                desc={`${relativeAge(todaySnapshot.publishedAt)} by ${todaySnapshot.publishedBy}`}
              />
            </dl>
          </Card>

          <Card>
            <div className="p-3.5">
              <h2 className="text-[16px]">Full website</h2>
              <p className="mt-1 text-[15px] text-ink-2">
                Pricing, the season calendar, and group bookings live on the main Curtis Orchard
                site.
              </p>
              <a
                href="https://curtisorchard.com"
                className="mt-3 flex h-12 items-center justify-center rounded-card border border-line text-[15px] font-semibold"
              >
                Open curtisorchard.com
              </a>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </>
  )
}

function Row({ term, desc }: { term: string; desc: string }) {
  return (
    <div className="p-3.5">
      <dt className="text-[12px] tracking-wide text-ink-3 uppercase">{term}</dt>
      <dd className="mt-0.5 text-[15px]">{desc}</dd>
    </div>
  )
}
