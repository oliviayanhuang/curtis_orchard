import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TopBar } from '../../components/TopBar'
import { Card, ScrollArea, SearchField } from '../../components/ui'
import { ChevronRight } from '../../components/Icons'
import {
  AnimalsArt,
  ApplePickingArt,
  FoodArt,
  KidsArt,
  ShoppingArt,
} from './ExploreArt'

const CATEGORIES = [
  {
    id: 'apples',
    to: '/explore/apples',
    title: 'Apple Picking',
    line1: 'Pick your own apples',
    line2: '26+ varieties',
    Art: ApplePickingArt,
    keywords: 'apple upick orchard honeycrisp gala fuji',
  },
  {
    id: 'animals',
    to: '/explore/activities',
    title: 'Animals',
    line1: 'Goats, farm animals',
    line2: 'and more',
    Art: AnimalsArt,
    keywords: 'goats animals petting zoo pony',
  },
  {
    id: 'kids',
    to: '/explore/activities',
    title: 'Kids Activities',
    line1: 'Corn maze, pony rides,',
    line2: 'play areas',
    Art: KidsArt,
    keywords: 'kids corn maze pony rides play pumpkin',
  },
  {
    id: 'food',
    to: '/map',
    title: 'Food & Drinks',
    line1: 'Bakery, Flying Monkey Café,',
    line2: 'apple cider & more',
    Art: FoodArt,
    keywords: 'food drinks cafe donuts cider bakery coffee',
  },
  {
    id: 'shopping',
    to: '/map',
    title: 'Shopping',
    line1: 'Country Store &',
    line2: 'local products',
    Art: ShoppingArt,
    keywords: 'shopping store gifts local products',
  },
]

export function ExplorePage() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CATEGORIES
    return CATEGORIES.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.keywords.includes(q) ||
        `${c.line1} ${c.line2}`.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <>
      <TopBar title="Explore" />

      <div className="shrink-0 bg-surface px-3.5 pb-3">
        <SearchField
          placeholder="Search activities, food, etc."
          value={query}
          onChange={setQuery}
        />
      </div>

      <ScrollArea>
        <div className="space-y-2.5 px-3.5 pt-3.5 pb-6">
          {results.map(({ id, to, title, line1, line2, Art }) => (
            <Card key={id}>
              <Link to={to} className="flex items-center gap-3 p-2.5">
                <span className="h-[62px] w-[62px] shrink-0 overflow-hidden rounded-[10px]">
                  <Art />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold">{title}</span>
                  <span className="mt-0.5 block text-[13.5px] leading-[1.35] text-ink-2">
                    {line1}
                    <br />
                    {line2}
                  </span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-ink-3" />
              </Link>
            </Card>
          ))}

          {results.length === 0 && (
            <p className="px-1 pt-6 text-center text-[15px] text-ink-2">
              Nothing matched “{query}”. Try “cider”, “maze”, or “goats”.
            </p>
          )}
        </div>
      </ScrollArea>
    </>
  )
}
