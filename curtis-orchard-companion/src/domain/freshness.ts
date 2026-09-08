const MINUTE = 60_000
const HOUR = 60 * MINUTE

/** Section 5.6: time-sensitive values must always say how old they are. */
export function relativeAge(publishedAt: string, now: number = Date.now()): string {
  const diff = now - new Date(publishedAt).getTime()
  if (diff < MINUTE) return 'just now'
  if (diff < HOUR) {
    const m = Math.round(diff / MINUTE)
    return `${m} minute${m === 1 ? '' : 's'} ago`
  }
  const h = Math.round(diff / HOUR)
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`
  const d = Math.round(h / 24)
  return `${d} day${d === 1 ? '' : 's'} ago`
}

/** Anything older than this is shown with a warning instead of as live truth. */
export const STALE_AFTER_HOURS = 12

export function isStale(publishedAt: string, now: number = Date.now()): boolean {
  return now - new Date(publishedAt).getTime() > STALE_AFTER_HOURS * HOUR
}
