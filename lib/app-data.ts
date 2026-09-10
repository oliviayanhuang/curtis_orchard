export type AppView = 'map' | 'explore' | 'plan';
export type MapCategory = 'all' | 'activities' | 'food' | 'shopping' | 'amenities';
export type LocationCategory = Exclude<MapCategory, 'all'>;
export type LocationIcon = 'parking' | 'store' | 'bakery' | 'cafe' | 'apple' | 'sparkles' | 'goat' | 'pumpkin' | 'restrooms' | 'pavilion';

export interface OrchardLocation {
  id: string;
  name: string;
  shortName: string;
  category: LocationCategory;
  icon: LocationIcon;
  x: number;
  y: number;
  summary: string;
  overview: string;
  terrain: string;
  season: string;
  admission: string;
  accessibility: string;
  highlights: string[];
  tips: string[];
  nearby: string[];
  officialUrl?: string;
}

export interface ExploreCategory {
  id: string;
  title: string;
  summary: string;
  detail: string;
  accent: 'green' | 'gold' | 'rose' | 'blue' | 'purple' | 'orange';
  icon: LocationIcon | 'accessibility';
  locationIds: string[];
}

export const PHONE_DISPLAY = '(217) 359-5565';
export const PHONE_HREF = 'tel:+12173595565';
export const OFFICIAL_SITE = 'https://www.curtisorchard.com/';

export const ORCHARD_LOCATIONS: OrchardLocation[] = [
  {
    id: 'welcome-parking', name: 'Welcome & Parking', shortName: 'Parking', category: 'amenities', icon: 'parking', x: 18, y: 82,
    summary: 'Free on-site parking and the best place to begin.',
    overview: 'Start here for the Country Store, Bakery, café, orchard, and activity areas. Overflow parking is available in an adjacent field during busy periods.',
    terrain: 'Parking lot with a paved approach', season: 'Whenever the orchard is open', admission: 'Free parking',
    accessibility: 'The approach to the Country Store and café is flat and level.',
    highlights: ['Main visitor entrance', 'Free on-site parking', 'Adjacent overflow parking'],
    tips: ['October weekends are especially busy; arrive early or visit on a weekday.', 'Buses and oversized vehicles should use the north entrance.'],
    nearby: ['country-store', 'bakery', 'cafe'], officialUrl: 'https://www.curtisorchard.com/directions',
  },
  {
    id: 'country-store', name: 'Country Store', shortName: 'Store', category: 'shopping', icon: 'store', x: 31, y: 66,
    summary: 'Apples, cider, honey, local foods, and orchard gifts.',
    overview: 'Browse fresh apples, award-winning cider, Curtis Orchard honey, local and Amish pantry goods, toys, candles, and gifts.',
    terrain: 'Flat, level entrance', season: 'Seasonal, generally July through December', admission: 'No admission required',
    accessibility: 'The Country Store is on flat, level ground.',
    highlights: ['Fresh produce and cider', 'Curtis Orchard honey', 'Pantry goods, toys, and gifts'],
    tips: ['Popular items may sell out.', 'Off-season shopping may be available by appointment.'],
    nearby: ['bakery', 'cafe', 'welcome-parking'], officialUrl: 'https://www.curtisorchard.com/country-store',
  },
  {
    id: 'bakery', name: 'Bakery', shortName: 'Bakery', category: 'food', icon: 'bakery', x: 43, y: 61,
    summary: 'Fresh apple crisp donuts, pies, fritters, and seasonal favorites.',
    overview: 'The bakery is known for apple crisp donuts made fresh daily, along with pies, apple fritters, cobblers, pumpkin bars, and other seasonal treats.',
    terrain: 'Flat, level access in the main store area', season: 'Seasonal, generally July through December', admission: 'No admission required',
    accessibility: 'The Bakery is in the flat, level main store area.',
    highlights: ['Apple crisp donuts', 'Fruit pies and cobblers', 'Apple fritters and pumpkin bars'],
    tips: ['Arrive early on busy fall weekends.', 'Orders larger than two dozen donuts or two pies should be reserved ahead.'],
    nearby: ['country-store', 'cafe', 'welcome-parking'], officialUrl: 'https://www.curtisorchard.com/bakery',
  },
  {
    id: 'cafe', name: 'Flying Monkey Café', shortName: 'Café', category: 'food', icon: 'cafe', x: 55, y: 64,
    summary: 'Seasonal lunch service with orchard comfort-food favorites.',
    overview: 'Stop for a seasonal fall lunch with sandwiches, soups, comfort-food entrées, and sides prepared by the café team.',
    terrain: 'Flat, level entrance', season: 'Late summer through October; check current dates', admission: 'No admission required',
    accessibility: 'The café is on flat, level ground.',
    highlights: ['Sandwiches and entrées', 'Soups and seasonal sides', 'Family-friendly indoor stop'],
    tips: ['The café has a shorter season than the Store and Bakery.', 'Check the current menu and hours before visiting.'],
    nearby: ['bakery', 'country-store', 'land-of-oz'], officialUrl: 'https://www.curtisorchard.com/flying-monkey-cafe',
  },
  {
    id: 'apple-orchard', name: 'U-Pick Apple Orchard', shortName: 'U-Pick', category: 'activities', icon: 'apple', x: 28, y: 24,
    summary: 'Designated rows for picking your own apples.',
    overview: 'Walk the designated rows, pick your own apples, and bring home a bag. Curtis Orchard grows more than 26 varieties across the season.',
    terrain: 'Grass, gravel, and uneven orchard ground', season: 'Varieties ripen at different times', admission: 'Separate U-Pick admission required',
    accessibility: 'Natural orchard terrain can be challenging for mobility devices.',
    highlights: ['26+ varieties across the season', 'Pick from designated rows', 'A classic orchard experience'],
    tips: ['Check the official apple page if you want a specific variety.', 'Pick only in designated rows and follow staff signs.'],
    nearby: ['pumpkin-patch', 'country-store'], officialUrl: 'https://www.curtisorchard.com/apples',
  },
  {
    id: 'pumpkin-patch', name: 'Pumpkin Patch', shortName: 'Pumpkins', category: 'activities', icon: 'pumpkin', x: 71, y: 20,
    summary: 'Pick a pumpkin from the field during pumpkin season.',
    overview: 'Choose from pumpkins in many colors, shapes, and sizes. The walk to the field passes through the apple trees and is part of the experience.',
    terrain: 'Natural field and orchard ground', season: 'Pumpkin season; check availability', admission: 'Pumpkins are priced separately',
    accessibility: 'The field route includes grass and uneven ground.',
    highlights: ['Many pumpkin colors', 'Pick-your-own field', 'Orchard walk along the way'],
    tips: ['Take a red wagon for pumpkins or tired little legs.', 'Additional pumpkins and gourds may be available closer to the store.'],
    nearby: ['apple-orchard', 'country-store'], officialUrl: 'https://www.curtisorchard.com/pumpkin-patch',
  },
  {
    id: 'land-of-oz', name: 'Land of Oz', shortName: 'Land of Oz', category: 'activities', icon: 'sparkles', x: 68, y: 47,
    summary: 'Mazes, slides, games, play spaces, and seasonal farm fun.',
    overview: 'Spend the day in a Wizard of Oz-themed activity area with mazes, slides, play spaces, games, animals, and selected seasonal rides.',
    terrain: 'Paved approach, then gravel and uneven ground', season: 'Outdoor activity season', admission: 'Wristband required for visitors age 4 and older',
    accessibility: 'Some areas are reached by a paved decline; activity terrain may be challenging.',
    highlights: ['Corn and themed mazes', 'Slides, inflatables, and games', 'Selected tractor and wagon rides'],
    tips: ['Children 14 and younger need a paying adult.', 'Picking and pony or horse activities are separate.', 'Outdoor attractions may close for weather.'],
    nearby: ['animal-area', 'poppyfield-pavilion', 'cafe'], officialUrl: 'https://www.curtisorchard.com/the-land-of-oz',
  },
  {
    id: 'animal-area', name: 'Goat & Animal Area', shortName: 'Animals', category: 'activities', icon: 'goat', x: 48, y: 43,
    summary: 'Meet goats and other seasonal farm animals.',
    overview: 'Meet the goats and other seasonal farm animals inside the Land of Oz activity area. Animal availability changes during the season.',
    terrain: 'Paved approach, then activity-area ground', season: 'Seasonal animal availability', admission: 'Land of Oz admission may be required',
    accessibility: 'The approach includes a paved path with a slight decline.',
    highlights: ['Goats', 'Other seasonal farm animals', 'Approved goat feed available separately'],
    tips: ['Be gentle and supervise children.', 'Feed animals only with approved feed.'],
    nearby: ['land-of-oz', 'poppyfield-pavilion', 'cafe'], officialUrl: 'https://www.curtisorchard.com/the-land-of-oz',
  },
  {
    id: 'restrooms', name: 'Restrooms', shortName: 'Restrooms', category: 'amenities', icon: 'restrooms', x: 39, y: 76,
    summary: 'Visitor restrooms near the main farm area.', overview: 'Find visitor restrooms near the central store and activity approach.',
    terrain: 'Main-area paths', season: 'During visitor hours', admission: 'No admission required', accessibility: 'Use the main-area paved approach.',
    highlights: ['Near the central visitor area'], tips: ['Ask orchard staff if you need the nearest accessible route.'], nearby: ['country-store', 'welcome-parking', 'cafe'],
  },
  {
    id: 'poppyfield-pavilion', name: 'Poppyfield Pavilion', shortName: 'Pavilion', category: 'amenities', icon: 'pavilion', x: 81, y: 63,
    summary: 'Covered gathering and program space.', overview: 'A covered orchard gathering space used for selected programs, group visits, and seasonal activities.',
    terrain: 'Activity-area paths', season: 'Use varies by program', admission: 'Depends on the program', accessibility: 'Contact the orchard for the best route.',
    highlights: ['Covered gathering area', 'Selected family programs', 'Group-visit space'], tips: ['Follow posted signs for scheduled programs.'], nearby: ['land-of-oz', 'animal-area', 'cafe'],
  },
];

export const EXPLORE_CATEGORIES: ExploreCategory[] = [
  { id: 'apple-picking', title: 'Apple Picking', summary: 'Pick your own · 26+ varieties', detail: 'Walk the rows, choose from designated trees, and take home a bag of fresh apples.', accent: 'green', icon: 'apple', locationIds: ['apple-orchard'] },
  { id: 'family-activities', title: 'Family Activities', summary: 'Mazes, slides, play areas, games, and rides', detail: 'Explore Wizard of Oz-themed outdoor fun for different ages and energy levels.', accent: 'blue', icon: 'sparkles', locationIds: ['land-of-oz'] },
  { id: 'animals', title: 'Animals', summary: 'Meet goats and other seasonal farm animals', detail: 'Make a friendly animal stop and learn how to interact gently.', accent: 'purple', icon: 'goat', locationIds: ['animal-area'] },
  { id: 'food-drinks', title: 'Food & Drinks', summary: 'Donuts, cider, and seasonal lunch', detail: 'Choose a quick treat, a café lunch, or orchard favorites to take home.', accent: 'gold', icon: 'cafe', locationIds: ['bakery', 'cafe'] },
  { id: 'shopping', title: 'Shopping', summary: 'Produce, honey, pantry goods, and gifts', detail: 'Browse orchard-made favorites and local goods in the Country Store.', accent: 'rose', icon: 'store', locationIds: ['country-store'] },
  { id: 'pumpkin-picking', title: 'Pumpkin Picking', summary: 'Choose a pumpkin from the field in season', detail: 'Take the orchard walk to a field filled with many shapes and colors.', accent: 'orange', icon: 'pumpkin', locationIds: ['pumpkin-patch'] },
  { id: 'accessibility', title: 'Accessibility', summary: 'Compare paths, surfaces, and easier stops', detail: 'The main building is flat and level; outdoor terrain can be uneven.', accent: 'green', icon: 'accessibility', locationIds: ['welcome-parking', 'country-store', 'bakery', 'cafe', 'restrooms'] },
];

export const TIME_OPTIONS = [
  { id: 'quick', label: '1–2 hours', stopCount: 3 }, { id: 'medium', label: '2–4 hours', stopCount: 4 },
  { id: 'half-day', label: 'Half day', stopCount: 5 }, { id: 'full-day', label: 'Full day', stopCount: 7 },
] as const;
export const GROUP_OPTIONS = [
  { id: 'solo', label: 'Solo' }, { id: 'couple', label: 'Couple' }, { id: 'young-family', label: 'Young family' },
  { id: 'older-family', label: 'Older kids' }, { id: 'friends', label: 'Friends' }, { id: 'group', label: 'Group' },
] as const;
export const INTEREST_OPTIONS = [
  { id: 'apples', label: 'Apple picking', locationId: 'apple-orchard' }, { id: 'kids', label: 'Kids’ activities', locationId: 'land-of-oz' },
  { id: 'animals', label: 'Animals', locationId: 'animal-area' }, { id: 'pumpkins', label: 'Pumpkin picking', locationId: 'pumpkin-patch' },
  { id: 'food', label: 'Food & drinks', locationId: 'cafe' }, { id: 'shopping', label: 'Shopping', locationId: 'country-store' },
  { id: 'relaxed', label: 'Relaxed pace', locationId: 'bakery' }, { id: 'easy-access', label: 'Easier access', locationId: 'welcome-parking' },
] as const;
