import type { ActivityStatus, AppleStatus } from '../types'

export type Tone = 'good' | 'limited' | 'off' | 'unknown'

interface Display {
  label: string
  tone: Tone
}

// Never rely on colour alone (whitepaper 49): every state carries a word.
const ACTIVITY: Record<ActivityStatus, Display> = {
  open: { label: 'OPEN', tone: 'good' },
  closed: { label: 'CLOSED TODAY', tone: 'off' },
  opens_later: { label: 'OPENS LATER', tone: 'limited' },
  temporarily_closed: { label: 'TEMPORARILY CLOSED', tone: 'off' },
  not_scheduled_today: { label: 'NOT SCHEDULED TODAY', tone: 'off' },
  not_confirmed: { label: 'NOT CONFIRMED', tone: 'unknown' },
}

const APPLE: Record<AppleStatus, Display> = {
  available: { label: 'Available', tone: 'good' },
  limited: { label: 'Limited', tone: 'limited' },
  sold_out: { label: 'Sold out', tone: 'off' },
  not_available: { label: 'Not available', tone: 'off' },
  not_in_season: { label: 'Out of season', tone: 'off' },
  not_confirmed: { label: 'Not confirmed', tone: 'unknown' },
}

export const activityDisplay = (s: ActivityStatus): Display => ACTIVITY[s]
export const appleDisplay = (s: AppleStatus): Display => APPLE[s]

export const toneClass: Record<Tone, string> = {
  good: 'text-orchard',
  limited: 'text-harvest',
  off: 'text-ink-3',
  unknown: 'text-ink-3',
}
