// Vocabulary is fixed by the whitepaper (sections 49-50). Do not invent new states.

export type ActivityStatus =
  | 'open'
  | 'closed'
  | 'opens_later'
  | 'temporarily_closed'
  | 'not_scheduled_today'
  | 'not_confirmed'

export type AppleStatus =
  | 'available'
  | 'limited'
  | 'sold_out'
  | 'not_available'
  | 'not_in_season'
  | 'not_confirmed'

export interface Activity {
  id: string
  name: string
  status: ActivityStatus
  /** Shown instead of a status word when the activity runs a window today. */
  window?: string
  note?: string
}

export interface AppleVariety {
  id: string
  name: string
  store: AppleStatus
  upick: AppleStatus
}

export interface TodayEvent {
  id: string
  title: string
  /** Human date label; the mock snapshot is not doing timezone math. */
  when: string
  location: string
  description: string
  emoji: string
  bucket: 'today' | 'week' | 'upcoming'
}

export interface Announcement {
  id: string
  tone: 'weather' | 'notice'
  title: string
  body: string
}

/** Mirrors the derived `public/today` document described in section 19. */
export interface TodaySnapshot {
  businessDate: string
  displayDate: string
  hours: { label: string; status: ActivityStatus }
  weather: { tempF: number; label: string; emoji: string }
  apples: AppleVariety[]
  activities: Activity[]
  events: TodayEvent[]
  announcements: Announcement[]
  publishedAt: string
  publishedBy: string
}

export type MapCategory = 'food' | 'activities' | 'restrooms' | 'services'

export interface MapPin {
  id: string
  name: string
  emoji: string
  category: MapCategory
  /** Percent coordinates inside the map viewport. */
  x: number
  y: number
  walkMinutes: number
  detail: string
}
