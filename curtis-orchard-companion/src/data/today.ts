import type { MapPin, TodaySnapshot } from '../types'

// Stands in for the derived `public/today` Firestore document until the
// backend exists. Shape must not drift from TodaySnapshot.
export const todaySnapshot: TodaySnapshot = {
  businessDate: '2025-09-20',
  displayDate: 'Sunday, September 20',
  hours: { label: '9:00 AM – 6:00 PM', status: 'open' },
  weather: { tempF: 72, label: 'Sunny', emoji: '☀️' },
  apples: [
    { id: 'honeycrisp', name: 'Honeycrisp', store: 'available', upick: 'limited' },
    { id: 'gala', name: 'Gala', store: 'available', upick: 'available' },
    { id: 'crimson-crisp', name: 'Crimson Crisp', store: 'available', upick: 'not_available' },
    { id: 'fuji', name: 'Fuji', store: 'limited', upick: 'available' },
    { id: 'golden-delicious', name: 'Golden Delicious', store: 'available', upick: 'limited' },
    { id: 'jonathan', name: 'Jonathan', store: 'sold_out', upick: 'not_in_season' },
  ],
  activities: [
    { id: 'pumpkin-patch', name: 'Pumpkin Patch', status: 'open' },
    { id: 'corn-maze', name: 'Corn Maze', status: 'open' },
    { id: 'pony-rides', name: 'Pony Rides', status: 'opens_later', window: '12:00 – 4:00 PM' },
    { id: 'wagon-rides', name: 'Wagon Rides', status: 'open', window: '11:00 – 5:00 PM' },
    { id: 'jumping-pillow', name: 'Jumping Pillow', status: 'temporarily_closed', note: 'Wet from overnight rain' },
    { id: 'petting-zoo', name: 'Petting Zoo', status: 'open' },
  ],
  events: [
    {
      id: 'apple-tasting-lab',
      title: 'Apple Tasting Lab',
      when: 'Today, 3:00 PM',
      location: 'Main Barn',
      description: 'Join us for a guided tasting of seasonal varieties.',
      emoji: '🍎',
      bucket: 'today',
    },
    {
      id: 'story-time',
      title: 'Story Time',
      when: 'Sat, Sep 28, 11:00 AM',
      location: 'Country Store',
      description: 'A fun story time for kids and families.',
      emoji: '📖',
      bucket: 'week',
    },
    {
      id: 'farm-bureau-ag-day',
      title: 'Farm Bureau Ag Learning Day',
      when: 'Thu, Oct 3, 9:00 AM',
      location: 'Educational Program',
      description: 'Learn about agriculture through hands-on activities.',
      emoji: '🌱',
      bucket: 'upcoming',
    },
    {
      id: 'cookies-with-santa',
      title: 'Cookies with Santa',
      when: 'Sat, Dec 14, 10:00 AM',
      location: 'Country Store',
      description: 'Photos, cookies, and holiday fun!',
      emoji: '🎅',
      bucket: 'upcoming',
    },
  ],
  announcements: [
    {
      id: 'wet-pillow',
      tone: 'weather',
      title: 'Jumping Pillow closed this morning',
      body: 'It is still wet from overnight rain. Staff will reopen it once it dries.',
    },
  ],
  publishedAt: new Date(Date.now() - 18 * 60_000).toISOString(),
  publishedBy: 'Front Desk',
}

export const mapPins: MapPin[] = [
  { id: 'apple-orchard', name: 'Apple Orchard', emoji: '🍎', category: 'activities', x: 34, y: 22, walkMinutes: 6, detail: 'U-Pick rows, wagon pickup at the north gate.' },
  { id: 'pumpkin-patch', name: 'Pumpkin Patch', emoji: '🎃', category: 'activities', x: 76, y: 25, walkMinutes: 8, detail: 'Open field, pick-your-own pumpkins by weight.' },
  { id: 'goats', name: 'Goats', emoji: '🐐', category: 'activities', x: 14, y: 45, walkMinutes: 3, detail: 'Feed cups available from the Country Store.' },
  { id: 'corn-maze', name: 'Corn Maze', emoji: '🌽', category: 'activities', x: 53, y: 48, walkMinutes: 5, detail: 'Two routes: a short loop and the full maze.' },
  { id: 'country-store', name: 'Country Store', emoji: '🏪', category: 'food', x: 21, y: 68, walkMinutes: 2, detail: 'Cider, donuts, apples by the peck, gifts.' },
  { id: 'cafe', name: 'Café', emoji: '☕', category: 'food', x: 79, y: 63, walkMinutes: 4, detail: 'Flying Monkey Café — sandwiches, coffee, cider slush.' },
  { id: 'restrooms', name: 'Restrooms', emoji: '🚻', category: 'restrooms', x: 84, y: 82, walkMinutes: 3, detail: 'Accessible stalls and a changing table.' },
  { id: 'parking', name: 'Parking', emoji: '🅿️', category: 'services', x: 12, y: 88, walkMinutes: 0, detail: 'Free lot. Accessible spaces nearest the barn.' },
]

export const YOU_ARE_HERE = { x: 50, y: 78 }
