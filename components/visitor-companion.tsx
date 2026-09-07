'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Accessibility,
  Apple,
  ArrowLeft,
  BadgeInfo,
  CalendarDays,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  Coffee,
  ExternalLink,
  History,
  Info,
  LocateFixed,
  Map as MapIcon,
  MapPin,
  Menu,
  Navigation,
  ParkingCircle,
  Phone,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Sun,
  Trees,
  UtensilsCrossed,
  WifiOff,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { isOperationalDataStale } from '@/lib/domain';

type View = 'today' | 'map';
type AvailabilityStatus =
  | 'available'
  | 'limited'
  | 'sold_out'
  | 'not_available'
  | 'not_in_season'
  | 'not_confirmed';
type ActivityStatus =
  | 'open'
  | 'closed'
  | 'opens_later'
  | 'temporarily_closed'
  | 'not_scheduled_today'
  | 'not_confirmed';
type VenueStatus = 'open' | 'opens_later' | 'closed';
type MapCategory = 'all' | 'food' | 'activities' | 'essentials';

interface AppleStatus {
  id: string;
  name: string;
  status: AvailabilityStatus;
  note?: string;
}

interface Activity {
  id: string;
  name: string;
  status: ActivityStatus;
  detail: string;
  weatherSensitive?: boolean;
}

interface Venue {
  id: string;
  name: string;
  hours: string;
  status: VenueStatus;
  note: string;
}

interface TodaySnapshot {
  businessDate: string;
  venues: Venue[];
  uPickApples: AppleStatus[];
  storeApples: AppleStatus[];
  activities: Activity[];
  announcement: string;
  publication: {
    publishedAt: string;
    publishedBy: string;
    revisionId: string;
    source: 'schedule_preview' | 'staff_published';
  };
}

interface MapLocation {
  id: string;
  name: string;
  shortName: string;
  category: Exclude<MapCategory, 'all'>;
  x: number;
  y: number;
  description: string;
  walk: string;
  mobilityDifficulty: 'Easy' | 'Moderate';
  surface: string;
  stepFree: boolean;
  Icon: typeof MapPin;
}

interface WebMcpTool {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
  execute: (input: unknown) => unknown;
}

declare global {
  interface Document {
    modelContext?: {
      registerTool: (
        tool: WebMcpTool,
        options?: { signal?: AbortSignal },
      ) => void | Promise<void>;
    };
  }
}

const PHONE_DISPLAY = '(217) 359-5565';
const PHONE_HREF = 'tel:+12173595565';
const STORAGE_KEY = 'curtis-orchard-today-v1';
const HISTORY_KEY = 'curtis-orchard-publish-history-v1';
const ANALYTICS_KEY = 'curtis-orchard-pilot-events-v1';

const INITIAL_SNAPSHOT: TodaySnapshot = {
  businessDate: '2026-09-07',
  venues: [
    {
      id: 'store-bakery',
      name: 'Country Store & Bakery',
      hours: '9 AM–6 PM',
      status: 'open',
      note: 'Schedule-derived for Monday',
    },
    {
      id: 'cafe',
      name: 'Flying Monkey Café',
      hours: '11 AM–2 PM',
      status: 'open',
      note: 'Weekday schedule',
    },
    {
      id: 'land-of-oz',
      name: 'Land of Oz',
      hours: 'Last wristband 5:30 PM',
      status: 'open',
      note: 'Labor Day schedule; weather can affect activities',
    },
  ],
  uPickApples: [
    { id: 'jonathan', name: 'Jonathan', status: 'available', note: 'Website-derived' },
    { id: 'crimson-crisp', name: 'Crimson Crisp', status: 'available', note: 'Website-derived' },
    { id: 'fuji', name: 'Fuji', status: 'available', note: 'Website-derived' },
    { id: 'golden-delicious', name: 'Golden Delicious', status: 'available', note: 'Website-derived' },
  ],
  storeApples: [
    { id: 'jonagold', name: 'Jonagold', status: 'available' },
    { id: 'cortland', name: 'Cortland', status: 'available' },
    { id: 'gala', name: 'Gala', status: 'available' },
    { id: 'honeycrisp', name: 'Honeycrisp', status: 'available' },
  ],
  activities: [
    {
      id: 'jumping-pillow',
      name: 'Jumping Pillow',
      status: 'not_confirmed',
      detail: 'Weather-sensitive • Staff confirmation needed',
      weatherSensitive: true,
    },
    {
      id: 'pony-rides',
      name: 'Pony Rides',
      status: 'not_confirmed',
      detail: 'Scheduled for Labor Day • Call to confirm',
      weatherSensitive: true,
    },
    {
      id: 'wagon-rides',
      name: 'Horse-Drawn Wagon Rides',
      status: 'not_scheduled_today',
      detail: 'Not scheduled on Labor Day',
    },
    {
      id: 'tractor-tours',
      name: 'Tractor Orchard Tours',
      status: 'not_scheduled_today',
      detail: 'Runs Wednesday–Friday in September and October',
    },
  ],
  announcement:
    'Outdoor activity status has not been confirmed by staff. Please call before making a special trip.',
  publication: {
    publishedAt: '2026-09-07T18:42:00.000Z',
    publishedBy: 'Schedule preview',
    revisionId: 'preview-2026-09-07',
    source: 'schedule_preview',
  },
};

const MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'country-store',
    name: 'Country Store & Bakery',
    shortName: 'Store',
    category: 'food',
    x: 28,
    y: 32,
    description: 'Fresh apples, cider, bakery favorites, gifts, and check-in.',
    walk: '1 min from main parking',
    mobilityDifficulty: 'Easy',
    surface: 'Flat, level entrance',
    stepFree: true,
    Icon: Store,
  },
  {
    id: 'cafe',
    name: 'Flying Monkey Café',
    shortName: 'Café',
    category: 'food',
    x: 43,
    y: 31,
    description: 'Lunch, drinks, and seasonal orchard treats.',
    walk: '2 min from main parking',
    mobilityDifficulty: 'Easy',
    surface: 'Flat, level entrance',
    stepFree: true,
    Icon: UtensilsCrossed,
  },
  {
    id: 'restrooms',
    name: 'Restrooms',
    shortName: 'Restrooms',
    category: 'essentials',
    x: 39,
    y: 50,
    description: 'Visitor restrooms near the central activity area.',
    walk: '3 min from main parking',
    mobilityDifficulty: 'Easy',
    surface: 'Paved path with slight decline',
    stepFree: true,
    Icon: BadgeInfo,
  },
  {
    id: 'main-parking',
    name: 'Main Parking',
    shortName: 'Parking',
    category: 'essentials',
    x: 21,
    y: 73,
    description: 'Free on-site parking. Peak October weekends can fill quickly.',
    walk: 'You are here',
    mobilityDifficulty: 'Easy',
    surface: 'Parking lot and paved approach',
    stepFree: true,
    Icon: ParkingCircle,
  },
  {
    id: 'land-of-oz-map',
    name: 'The Land of Oz Activity Area',
    shortName: 'Land of Oz',
    category: 'activities',
    x: 63,
    y: 67,
    description: 'Play areas, farm animals, slides, maze access, and outdoor fun.',
    walk: '6 min from main parking',
    mobilityDifficulty: 'Moderate',
    surface: 'Paved approach, then gravel and uneven ground',
    stepFree: true,
    Icon: Sparkles,
  },
  {
    id: 'u-pick-orchard',
    name: 'U-Pick Apple Orchard',
    shortName: 'U-Pick',
    category: 'activities',
    x: 72,
    y: 27,
    description: 'Designated rows for today’s available U-Pick varieties.',
    walk: '8 min from main parking',
    mobilityDifficulty: 'Moderate',
    surface: 'Grass, gravel, and uneven orchard ground',
    stepFree: true,
    Icon: Trees,
  },
];

const availabilityCopy: Record<AvailabilityStatus, string> = {
  available: 'Available',
  limited: 'Limited',
  sold_out: 'Sold out',
  not_available: 'Not available',
  not_in_season: 'Not in season',
  not_confirmed: 'Not confirmed',
};

const activityCopy: Record<ActivityStatus, string> = {
  open: 'Open',
  closed: 'Closed today',
  opens_later: 'Opens later',
  temporarily_closed: 'Temporarily closed',
  not_scheduled_today: 'Not scheduled today',
  not_confirmed: 'Status not confirmed',
};

const statusTone: Record<ActivityStatus | AvailabilityStatus, string> = {
  open: 'bg-[#dcefe3] text-[#17603c] ring-[#b9dbc6]',
  available: 'bg-[#dcefe3] text-[#17603c] ring-[#b9dbc6]',
  limited: 'bg-[#f7e9c5] text-[#74530d] ring-[#ead599]',
  opens_later: 'bg-[#e8ebf8] text-[#414f8a] ring-[#cbd1eb]',
  closed: 'bg-[#f6dfe2] text-[#8d2940] ring-[#e7bdc5]',
  temporarily_closed: 'bg-[#f6dfe2] text-[#8d2940] ring-[#e7bdc5]',
  sold_out: 'bg-[#f6dfe2] text-[#8d2940] ring-[#e7bdc5]',
  not_available: 'bg-[#eceee9] text-[#566059] ring-[#d5dad3]',
  not_in_season: 'bg-[#eceee9] text-[#566059] ring-[#d5dad3]',
  not_scheduled_today: 'bg-[#eceee9] text-[#566059] ring-[#d5dad3]',
  not_confirmed: 'bg-[#fff0d6] text-[#775218] ring-[#efd8ae]',
};

function parseStoredSnapshot(): TodaySnapshot {
  if (typeof window === 'undefined') return INITIAL_SNAPSHOT;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as TodaySnapshot) : INITIAL_SNAPSHOT;
  } catch {
    return INITIAL_SNAPSHOT;
  }
}

function parseHistory(): TodaySnapshot[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(HISTORY_KEY);
    return stored ? (JSON.parse(stored) as TodaySnapshot[]) : [];
  } catch {
    return [];
  }
}

function pilotEvent(name: 'landing_view' | 'today_view' | 'map_open' | 'help_call_click') {
  if (typeof window === 'undefined') return;
  try {
    const current = JSON.parse(window.localStorage.getItem(ANALYTICS_KEY) || '[]') as unknown[];
    const source = new URLSearchParams(window.location.search).get('src');
    window.localStorage.setItem(
      ANALYTICS_KEY,
      JSON.stringify([...current.slice(-99), { name, at: new Date().toISOString(), source }]),
    );
  } catch {
    // Pilot analytics are intentionally best-effort and device-local.
  }
}

export function VisitorCompanion() {
  const [view, setView] = useState<View>('today');
  const [snapshot, setSnapshot] = useState<TodaySnapshot>(INITIAL_SNAPSHOT);
  const [history, setHistory] = useState<TodaySnapshot[]>([]);
  const [staffOpen, setStaffOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [online, setOnline] = useState(true);
  const [mapFilter, setMapFilter] = useState<MapCategory>('all');
  const [selectedLocation, setSelectedLocation] = useState<MapLocation>(MAP_LOCATIONS[0]);
  const snapshotRef = useRef(snapshot);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      setSnapshot(parseStoredSnapshot());
      setHistory(parseHistory());
      setOnline(window.navigator.onLine);
    }, 0);
    pilotEvent('landing_view');
    pilotEvent('today_view');
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.clearTimeout(restore);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  const chooseView = useCallback((next: View) => {
    setView(next);
    setMenuOpen(false);
    if (next === 'map') pilotEvent('map_open');
    if (next === 'today') pilotEvent('today_view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = async () => {
      await context.registerTool(
        {
          name: 'get_curtis_orchard_today',
          title: 'Get today at Curtis Orchard',
          description:
            'Read the currently visible visitor snapshot for venue hours, U-Pick and store apples, activities, notices, and publication time.',
          inputSchema: { type: 'object', properties: {}, additionalProperties: false },
          annotations: { readOnlyHint: true, untrustedContentHint: false },
          execute: () => {
            const current = snapshotRef.current;
            return {
              businessDate: current.businessDate,
              venues: current.venues,
              uPickApples: current.uPickApples,
              storeApples: current.storeApples,
              activities: current.activities,
              announcement: current.announcement,
              publishedAt: current.publication.publishedAt,
              source: current.publication.source,
            };
          },
        },
        { signal: lifecycle.signal },
      );
      await context.registerTool(
        {
          name: 'open_curtis_orchard_map',
          title: 'Open the Curtis Orchard map',
          description:
            'Open the visible farm map and optionally focus a known location by its stable location ID.',
          inputSchema: {
            type: 'object',
            properties: {
              locationId: {
                type: 'string',
                enum: MAP_LOCATIONS.map((location) => location.id),
              },
            },
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute: (input) => {
            const value = input as { locationId?: string };
            if (value.locationId !== undefined && !MAP_LOCATIONS.some((item) => item.id === value.locationId)) {
              throw new Error('Unknown Curtis Orchard map location.');
            }
            const location = MAP_LOCATIONS.find((item) => item.id === value.locationId);
            if (location) setSelectedLocation(location);
            setMapFilter('all');
            setView('map');
            pilotEvent('map_open');
            return { view: 'map', focusedLocationId: location?.id ?? null };
          },
        },
        { signal: lifecycle.signal },
      );
    };
    void register().catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  const publishSnapshot = (next: TodaySnapshot) => {
    const nextHistory = [...history, snapshot].slice(-20);
    setSnapshot(next);
    setHistory(nextHistory);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  };

  const undoLastPublish = () => {
    const previous = history.at(-1);
    if (!previous) return;
    const restored: TodaySnapshot = {
      ...previous,
      publication: {
        ...previous.publication,
        publishedAt: new Date().toISOString(),
        publishedBy: 'Staff preview • Undo',
        revisionId: `undo-${Date.now()}`,
        source: 'staff_published',
      },
    };
    const nextHistory = [...history, snapshot].slice(-20);
    setSnapshot(restored);
    setHistory(nextHistory);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(restored));
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  };

  return (
    <main className="min-h-dvh bg-background pb-28 text-foreground md:pb-0">
      <SiteHeader
        view={view}
        onViewChange={chooseView}
        menuOpen={menuOpen}
        onMenuChange={setMenuOpen}
        onStaffOpen={() => setStaffOpen(true)}
      />

      {view === 'today' ? (
        <TodayView
          snapshot={snapshot}
          online={online}
          onMapOpen={() => chooseView('map')}
          onStaffOpen={() => setStaffOpen(true)}
        />
      ) : (
        <MapView
          selected={selectedLocation}
          onSelected={setSelectedLocation}
          filter={mapFilter}
          onFilter={setMapFilter}
          onBack={() => chooseView('today')}
        />
      )}

      <MobileNav view={view} onViewChange={chooseView} />
      <StaffEditor
        open={staffOpen}
        onOpenChange={setStaffOpen}
        snapshot={snapshot}
        historyCount={history.length}
        onPublish={publishSnapshot}
        onUndo={undoLastPublish}
      />
    </main>
  );
}

function SiteHeader({
  view,
  onViewChange,
  menuOpen,
  onMenuChange,
  onStaffOpen,
}: {
  view: View;
  onViewChange: (view: View) => void;
  menuOpen: boolean;
  onMenuChange: (open: boolean) => void;
  onStaffOpen: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#d8e1d9] bg-[#fbfaf5]/94 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <button className="group flex min-h-11 items-center gap-3 text-left" onClick={() => onViewChange('today')} aria-label="Curtis Orchard Visitor Companion home">
          <span className="grid size-10 place-items-center rounded-[14px] bg-[#d8212f] text-white shadow-[0_8px_20px_rgba(160,26,39,.18)] transition-transform group-hover:-rotate-3">
            <Apple className="size-5" strokeWidth={2.5} />
          </span>
          <span className="leading-none">
            <span className="block font-heading text-[19px] font-bold tracking-[-0.03em] text-[#0a5139]">Curtis Orchard</span>
            <span className="mt-1 block text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#6b756e]">Visitor Companion</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          <Button variant="ghost" className={`h-11 rounded-full px-5 ${view === 'today' ? 'bg-[#e6f0e7] text-[#0b6043]' : 'text-[#426052]'}`} onClick={() => onViewChange('today')}>
            <CalendarDays data-icon="inline-start" /> Today
          </Button>
          <Button variant="ghost" className={`h-11 rounded-full px-5 ${view === 'map' ? 'bg-[#e6f0e7] text-[#0b6043]' : 'text-[#426052]'}`} onClick={() => onViewChange('map')}>
            <MapIcon data-icon="inline-start" /> Farm map
          </Button>
          <Button variant="ghost" className="h-11 rounded-full px-4 text-[#426052]" onClick={onStaffOpen}>Staff preview</Button>
          <Button nativeButton={false} className="ml-1 h-11 rounded-full bg-[#007050] px-5 shadow-sm hover:bg-[#075f46]" render={<a href={PHONE_HREF} aria-label="Call Curtis Orchard" onClick={() => pilotEvent('help_call_click')} />}>
            <Phone data-icon="inline-start" /> Call us
          </Button>
        </nav>

        <Button variant="ghost" size="icon-lg" className="size-11 rounded-full text-[#214b38] md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => onMenuChange(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {menuOpen && (
        <div className="border-t border-[#e1e6de] bg-[#fbfaf5] px-5 py-4 md:hidden">
          <div className="mx-auto grid max-w-6xl gap-2">
            <Button variant="ghost" className="h-12 justify-start rounded-xl text-[#214b38]" onClick={() => onViewChange('today')}><CalendarDays data-icon="inline-start" /> Today</Button>
            <Button variant="ghost" className="h-12 justify-start rounded-xl text-[#214b38]" onClick={() => onViewChange('map')}><MapIcon data-icon="inline-start" /> Farm map</Button>
            <Button variant="ghost" className="h-12 justify-start rounded-xl text-[#214b38]" onClick={() => { onMenuChange(false); onStaffOpen(); }}><ShieldCheck data-icon="inline-start" /> Staff preview</Button>
          </div>
        </div>
      )}
    </header>
  );
}

function TodayView({ snapshot, online, onMapOpen, onStaffOpen }: { snapshot: TodaySnapshot; online: boolean; onMapOpen: () => void; onStaffOpen: () => void }) {
  const isPreview = snapshot.publication.source === 'schedule_preview';
  const [now, setNow] = useState(Date.parse('2026-09-07T19:00:00.000Z'));
  useEffect(() => {
    const firstTick = window.setTimeout(() => setNow(Date.now()), 0);
    const interval = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => {
      window.clearTimeout(firstTick);
      window.clearInterval(interval);
    };
  }, []);
  const age = relativeTime(snapshot.publication.publishedAt, now);
  const stale = isOperationalDataStale(
    {
      businessDate: snapshot.businessDate,
      publishedAt: snapshot.publication.publishedAt,
    },
    { now, maxAgeMs: 8 * 60 * 60 * 1000 },
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-12 pt-5 sm:px-8 sm:pt-8">
      <output className={`mb-5 flex flex-col gap-3 rounded-2xl border px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between ${!online || stale ? 'border-[#e8c4c6] bg-[#fae9e9] text-[#762f3d]' : 'border-[#d6dfcc] bg-[#eef4e9] text-[#315941]'}`}>
        <div className="flex items-start gap-2.5">
          {!online ? <WifiOff className="mt-0.5 size-4 shrink-0" /> : isPreview ? <Info className="mt-0.5 size-4 shrink-0" /> : <Check className="mt-0.5 size-4 shrink-0" />}
          <span>
            {!online
              ? `You’re offline. Showing the last saved update from ${age}.`
              : stale
                ? `Today’s operating status has not been refreshed recently. Last update: ${age}.`
                : isPreview
                  ? 'Pilot preview: hours and apples are website-derived; weather-sensitive activities need staff confirmation.'
                  : `Staff-published update • ${age}`}
          </span>
        </div>
        {isPreview && <button className="shrink-0 text-left font-bold underline decoration-1 underline-offset-4 sm:text-right" onClick={onStaffOpen}>Publish a staff update</button>}
      </output>

      <section className="overflow-hidden rounded-[30px] bg-[#075d43] text-white shadow-[0_22px_60px_rgba(11,74,53,.15)]">
        <div className="grid lg:grid-cols-[1.07fr_.83fr]">
          <div className="relative z-10 p-6 sm:p-9 lg:p-11">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="h-8 border border-white/20 bg-white/13 px-3 text-white"><Sun data-icon="inline-start" /> Monday at the orchard</Badge>
              <span className="text-sm font-semibold text-white/70">September 7</span>
            </div>
            <h1 className="mt-8 max-w-2xl font-heading text-[clamp(2.7rem,7vw,5rem)] font-bold leading-[.92] tracking-[-0.055em]">
              Make the most of <span className="text-[#f3c675]">today.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-7 text-white/78">See today’s venue hours, find apples, check activities, and get around the farm with less guessing.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button nativeButton={false} className="h-12 rounded-full bg-[#fbfaf5] px-5 text-[#0a5139] shadow-md hover:bg-white" render={<a href="#apples" aria-label="Jump to today’s apples" />}><Apple data-icon="inline-start" /> Today’s apples</Button>
              <Button variant="outline" className="h-12 rounded-full border-white/25 bg-white/8 px-5 text-white hover:bg-white/16 hover:text-white" onClick={onMapOpen}><MapPin data-icon="inline-start" /> Open farm map</Button>
            </div>
          </div>
          <div className="relative min-h-[240px] overflow-hidden lg:min-h-full">
            <Image src="/og.png" alt="Illustration of apple trees, baskets of apples, and a red orchard barn" fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover object-[76%_center]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#075d43] via-[#075d43]/25 to-transparent lg:block" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#075d43]/55 to-transparent" />
          </div>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="hours-heading">
        <SectionHeading eyebrow="Hours by place" title="What’s open today" description="Different parts of the orchard keep different hours." />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {snapshot.venues.map((venue, index) => (
            <article key={venue.id} className={`rounded-[24px] border p-5 ${index === 0 ? 'border-[#cdddcf] bg-[#eef5eb]' : index === 1 ? 'border-[#edd8bd] bg-[#fbf1df]' : 'border-[#d7d5e4] bg-[#f1eff8]'}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-2xl bg-white/75 text-[#166246]">{index === 0 ? <ShoppingBag className="size-5" /> : index === 1 ? <Coffee className="size-5" /> : <Sparkles className="size-5" />}</span>
                <span className="rounded-full bg-white/75 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#35624b]">Scheduled</span>
              </div>
              <h3 className="mt-5 text-base font-extrabold text-[#173d2d]">{venue.name}</h3>
              <p className="mt-1 font-heading text-2xl font-bold tracking-[-0.035em] text-[#102f24]">{venue.hours}</p>
              <p className="mt-2 text-xs leading-5 text-[#647169]">{venue.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_.8fr]" aria-label="Today’s notice and quick help">
        <article className="rounded-[26px] border border-[#edd0d2] bg-[#faebea] p-5 sm:p-6">
          <div className="flex items-center gap-3 text-[#982f43]"><span className="grid size-10 place-items-center rounded-2xl bg-white/65"><CircleAlert className="size-5" /></span><span className="text-xs font-extrabold uppercase tracking-[0.14em]">Today’s notice</span></div>
          <p className="mt-5 max-w-2xl text-lg font-bold leading-7 text-[#513037]">{snapshot.announcement}</p>
          <p className="mt-3 text-sm text-[#79525a]">Updated {age} by {snapshot.publication.publishedBy}</p>
        </article>
        <article className="rounded-[26px] border border-[#d8e0d7] bg-white p-5 sm:p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#66766a]">Need a quick answer?</p>
          <p className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-[#163b2d]">We’re happy to help.</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Call to confirm conditions before making a special trip.</p>
          <Button nativeButton={false} className="mt-5 h-12 w-full rounded-full bg-[#007050] hover:bg-[#075f46]" render={<a href={PHONE_HREF} aria-label={`Call Curtis Orchard at ${PHONE_DISPLAY}`} onClick={() => pilotEvent('help_call_click')} />}><Phone data-icon="inline-start" /> {PHONE_DISPLAY}</Button>
        </article>
      </section>

      <section id="apples" className="mt-10 scroll-mt-28" aria-labelledby="apples-heading">
        <SectionHeading eyebrow="Fresh today" title="Find your favorite apples" description="U-Pick availability and Country Store inventory answer different questions, so they stay separate." />
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <ApplePanel title="U-Pick apples" subtitle="Website-derived varieties ready in the orchard" apples={snapshot.uPickApples} tint="green" />
          <ApplePanel title="In the Country Store" subtitle="Bring orchard favorites home without picking" apples={snapshot.storeApples} tint="rose" />
        </div>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">Apple timing changes with the weather. The official calendar is a guide; call for same-day confirmation.</p>
      </section>

      <section className="mt-10" aria-labelledby="activities-heading">
        <SectionHeading eyebrow="Around the farm" title="Activities today" description="Plain-language statuses keep weather changes and scheduled closures easy to spot." />
        <div className="mt-5 overflow-hidden rounded-[26px] border border-[#dce3da] bg-white">
          {snapshot.activities.map((activity, index) => (
            <article key={activity.id} className={`flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 ${index ? 'border-t border-[#e4e8e2]' : ''}`}>
              <div className="flex items-start gap-4">
                <span className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-2xl bg-[#edf3e9] text-[#18704e]"><Sparkles className="size-5" /></span>
                <div>
                  <h3 className="font-extrabold text-[#173d2d]">{activity.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{activity.detail}</p>
                </div>
              </div>
              <StatusBadge status={activity.status} label={activityCopy[activity.status]} />
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid overflow-hidden rounded-[30px] bg-[#e1ecdb] lg:grid-cols-[1fr_.8fr]">
        <div className="p-6 sm:p-8 lg:p-10">
          <Badge className="bg-white/75 text-[#0b6043]"><MapPin data-icon="inline-start" /> Farm map</Badge>
          <h2 className="mt-5 max-w-md font-heading text-4xl font-bold tracking-[-0.045em] text-[#103b2a]">Find the fun, faster.</h2>
          <p className="mt-3 max-w-lg text-[16px] leading-7 text-[#52675a]">Locate apple rows, food, restrooms, parking, accessible paths, and family activities.</p>
          <Button className="mt-6 h-12 rounded-full bg-[#007050] px-5 hover:bg-[#075f46]" onClick={onMapOpen}><Navigation data-icon="inline-start" /> Explore the farm map</Button>
        </div>
        <div className="mini-map relative min-h-[270px] overflow-hidden border-t border-white/50 lg:border-l lg:border-t-0" aria-hidden="true">
          {MAP_LOCATIONS.slice(0, 5).map((location) => (
            <span key={location.id} className="absolute grid size-9 place-items-center rounded-full border-2 border-white bg-[#d8212f] text-white shadow-lg" style={{ left: `${location.x}%`, top: `${location.y}%` }}><location.Icon className="size-4" /></span>
          ))}
        </div>
      </section>

      <footer className="mt-10 grid gap-6 border-t border-[#dce3da] py-8 text-sm text-muted-foreground md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="font-heading text-xl font-bold text-[#153c2c]">Curtis Orchard & Pumpkin Patch</p>
          <p className="mt-1">3902 S. Duncan Road, Champaign, IL 61822</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3 font-semibold text-[#326047]">
          <a className="min-h-11 content-center hover:underline" href="https://www.curtisorchard.com/faq" target="_blank" rel="noreferrer">Visitor FAQ <ExternalLink className="ml-1 inline size-3.5" /></a>
          <a className="min-h-11 content-center hover:underline" href="https://www.google.com/maps/dir/?api=1&destination=3902+S+Duncan+Road+Champaign+IL+61822" target="_blank" rel="noreferrer">Get directions <ExternalLink className="ml-1 inline size-3.5" /></a>
          <button className="min-h-11 font-semibold hover:underline" onClick={onStaffOpen}>Staff preview</button>
        </div>
      </footer>
    </div>
  );
}

function MapView({ selected, onSelected, filter, onFilter, onBack }: { selected: MapLocation; onSelected: (location: MapLocation) => void; filter: MapCategory; onFilter: (filter: MapCategory) => void; onBack: () => void }) {
  const filtered = filter === 'all' ? MAP_LOCATIONS : MAP_LOCATIONS.filter((location) => location.category === filter);
  const filters: Array<{ id: MapCategory; label: string }> = [
    { id: 'all', label: 'All places' },
    { id: 'food', label: 'Food & shop' },
    { id: 'activities', label: 'Activities' },
    { id: 'essentials', label: 'Essentials' },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-12 pt-6 sm:px-8 sm:pt-9">
      <Button variant="ghost" className="-ml-2 h-11 rounded-full px-3 text-[#315942]" onClick={onBack}><ArrowLeft data-icon="inline-start" /> Back to today</Button>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#d8212f]">You are here</p>
          <h1 className="mt-1 font-heading text-4xl font-bold tracking-[-0.045em] text-[#103b2a] sm:text-5xl">Farm map</h1>
          <p className="mt-2 max-w-xl text-[16px] leading-7 text-muted-foreground">Tap a pin for walking time, surface details, and accessibility notes.</p>
        </div>
        <Button nativeButton={false} variant="outline" className="h-11 w-fit rounded-full border-[#c7d4c8] bg-white px-4 text-[#1b5b3f]" render={<a href="https://www.google.com/maps/dir/?api=1&destination=3902+S+Duncan+Road+Champaign+IL+61822" target="_blank" rel="noreferrer" aria-label="Open driving directions to Curtis Orchard" />}><LocateFixed data-icon="inline-start" /> Directions here</Button>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Map filters">
        {filters.map((item) => (
          <Button key={item.id} variant={filter === item.id ? 'default' : 'outline'} className={`h-11 shrink-0 rounded-full px-4 ${filter === item.id ? 'bg-[#007050] hover:bg-[#075f46]' : 'border-[#d3ddd2] bg-white text-[#3b5b49]'}`} onClick={() => onFilter(item.id)}>{item.label}</Button>
        ))}
      </div>

      <section className="mt-3 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,.65fr)]">
        <div className="farm-map relative min-h-[530px] overflow-hidden rounded-[30px] border border-[#cbd8c7] bg-[#dcebd5] shadow-[0_16px_50px_rgba(34,78,54,.09)]" aria-label="Interactive Curtis Orchard farm map">
          <div className="absolute left-[8%] top-[12%] h-[25%] w-[38%] rounded-[48%] border border-[#abc79e] bg-[#c9dfbf]/70" />
          <div className="absolute right-[6%] top-[8%] h-[39%] w-[39%] rounded-[42%] border border-[#abc79e] bg-[#bfd8b4]/80" />
          <div className="absolute bottom-[7%] right-[9%] h-[34%] w-[46%] rounded-[42%] border border-[#b0ca9f] bg-[#c7ddb9]/80" />
          <div className="map-path absolute left-[24%] top-[-8%] h-[118%] w-[18%] -rotate-[18deg] rounded-[50%] border-x-[22px] border-[#f4e5c8] opacity-90" />
          <div className="absolute left-[14%] top-[60%] flex items-center gap-2 rounded-full bg-[#255c98] px-3 py-2 text-xs font-bold text-white shadow-md"><LocateFixed className="size-4" /> You are here</div>
          <span className="absolute left-[16%] top-[82%] text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#5d735e]">Main entrance</span>
          <span className="absolute right-[12%] top-[48%] text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#658265]">Orchard rows</span>

          {filtered.map((location) => {
            const active = selected.id === location.id;
            return (
              <button key={location.id} className="group absolute -translate-x-1/2 -translate-y-1/2 text-left focus-visible:outline-none" style={{ left: `${location.x}%`, top: `${location.y}%` }} onClick={() => onSelected(location)} aria-label={`Show ${location.name} details`}>
                <span className={`grid size-12 place-items-center rounded-full border-[3px] border-white text-white shadow-[0_8px_22px_rgba(31,77,52,.2)] transition-transform group-hover:-translate-y-1 group-focus-visible:ring-4 group-focus-visible:ring-[#007050]/30 ${active ? 'scale-110 bg-[#d8212f]' : 'bg-[#087653]'}`}><location.Icon className="size-5" /></span>
                <span className={`absolute left-1/2 top-[52px] -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-extrabold shadow-sm ${active ? 'bg-[#173d2d] text-white' : 'bg-white/90 text-[#274735]'}`}>{location.shortName}</span>
              </button>
            );
          })}
        </div>

        <aside className="self-start rounded-[26px] border border-[#dce3da] bg-white p-5 shadow-[0_12px_40px_rgba(30,65,47,.07)] sm:p-6 lg:sticky lg:top-[98px]" aria-live="polite">
          <div className="flex items-start justify-between gap-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#e8f1e5] text-[#08704e]"><selected.Icon className="size-6" /></span>
            <Badge className="bg-[#eef4e9] text-[#326048]">{selected.category === 'food' ? 'Food & shop' : selected.category === 'activities' ? 'Activity' : 'Essential'}</Badge>
          </div>
          <h2 className="mt-5 font-heading text-2xl font-bold tracking-[-0.035em] text-[#153c2c]">{selected.name}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{selected.description}</p>
          <div className="mt-5 space-y-3 border-t border-[#e4e8e2] pt-5">
            <DetailRow icon={Clock3} label="Walking time" value={selected.walk} />
            <DetailRow icon={Accessibility} label="Mobility" value={`${selected.mobilityDifficulty} • ${selected.stepFree ? 'Step-free' : 'Steps present'}`} />
            <DetailRow icon={Navigation} label="Surface" value={selected.surface} />
          </div>
          <Button nativeButton={false} className="mt-6 h-12 w-full rounded-full bg-[#007050] hover:bg-[#075f46]" render={<a href="https://www.google.com/maps/dir/?api=1&destination=3902+S+Duncan+Road+Champaign+IL+61822" target="_blank" rel="noreferrer" aria-label={`Open directions for ${selected.name}`} />}><Navigation data-icon="inline-start" /> Route from entrance</Button>
        </aside>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-[24px] border border-[#ddddea] bg-[#f3f1f8] p-5 sm:p-6">
          <div className="flex items-center gap-3 text-[#4f4c78]"><Accessibility className="size-5" /><h2 className="font-extrabold">Accessibility at a glance</h2></div>
          <p className="mt-3 text-sm leading-6 text-[#65627d]">The Store and Café are flat and level. A paved path with a slight decline reaches the chickens, photo areas, and Land of Oz booth. Orchard and activity terrain includes gravel and uneven ground.</p>
        </article>
        <article className="rounded-[24px] border border-[#ead9bf] bg-[#fbf2e2] p-5 sm:p-6">
          <div className="flex items-center gap-3 text-[#75581e]"><ParkingCircle className="size-5" /><h2 className="font-extrabold">Parking tip</h2></div>
          <p className="mt-3 text-sm leading-6 text-[#756744]">Parking is free. Peak October weekends can fill quickly; adjacent overflow parking may be used. Buses and oversized vehicles use the north entrance.</p>
        </article>
      </section>
    </div>
  );
}

function StaffEditor({ open, onOpenChange, snapshot, historyCount, onPublish, onUndo }: { open: boolean; onOpenChange: (open: boolean) => void; snapshot: TodaySnapshot; historyCount: number; onPublish: (next: TodaySnapshot) => void; onUndo: () => void }) {
  const [step, setStep] = useState<'edit' | 'review' | 'success'>('edit');
  const [uPickApples, setUPickApples] = useState(snapshot.uPickApples);
  const [storeApples, setStoreApples] = useState(snapshot.storeApples);
  const [activities, setActivities] = useState(snapshot.activities);
  const [announcement, setAnnouncement] = useState(snapshot.announcement);

  useEffect(() => {
    if (!open) return;
    const restore = window.setTimeout(() => {
      setStep('edit');
      setUPickApples(snapshot.uPickApples);
      setStoreApples(snapshot.storeApples);
      setActivities(snapshot.activities);
      setAnnouncement(snapshot.announcement);
    }, 0);
    return () => window.clearTimeout(restore);
  }, [open, snapshot]);

  const publish = () => {
    onPublish({
      ...snapshot,
      uPickApples,
      storeApples,
      activities: activities.map((activity) => ({
        ...activity,
        detail: activity.status === 'closed' ? 'Closed today • Weather override' : activity.status === 'open' ? 'Staff confirmed open today' : activity.detail,
      })),
      announcement,
      publication: {
        publishedAt: new Date().toISOString(),
        publishedBy: 'Orchard staff preview',
        revisionId: `publish-${Date.now()}`,
        source: 'staff_published',
      },
    });
    setStep('success');
  };

  const changedApples = [...uPickApples, ...storeApples].filter((apple, index) => {
    const originals = [...snapshot.uPickApples, ...snapshot.storeApples];
    return apple.status !== originals[index]?.status;
  }).length;
  const changedActivities = activities.filter((activity, index) => activity.status !== snapshot.activities[index]?.status).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-1rem)] w-[min(720px,calc(100%-1rem))] max-w-[720px] overflow-y-auto rounded-[26px] p-0 sm:max-w-[720px]" showCloseButton={false}>
        <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-[#e0e6df] bg-white/95 px-5 py-5 backdrop-blur-md sm:px-7">
          <DialogHeader className="gap-1">
            <div className="flex flex-wrap items-center gap-2"><Badge className="bg-[#e5f0e7] text-[#176044]">Staff preview</Badge><Badge variant="outline" className="text-[#6c746f]">Saved on this device</Badge></div>
            <DialogTitle className="pt-2 font-heading text-2xl font-bold tracking-[-0.035em] text-[#153c2c]">{step === 'review' ? 'Review today’s update' : step === 'success' ? 'Update published' : 'Daily operations'}</DialogTitle>
            <DialogDescription>{step === 'edit' ? 'Confirm only what changed. Expected operations are already filled in.' : step === 'review' ? 'Check the visitor-facing changes before publishing.' : 'The Today view now uses this staff-published snapshot.'}</DialogDescription>
          </DialogHeader>
          <Button variant="ghost" size="icon-lg" className="size-11 rounded-full" aria-label="Close staff preview" onClick={() => onOpenChange(false)}><X /></Button>
        </div>

        {step === 'edit' && (
          <div className="space-y-7 px-5 py-6 sm:px-7">
            <div className="rounded-2xl border border-[#d7e3d4] bg-[#eff5eb] p-4">
              <div className="flex items-center gap-2 text-sm font-extrabold text-[#23533b]"><Check className="size-4" /> Normal schedule loaded</div>
              <p className="mt-1 text-sm leading-6 text-[#627167]">Store, Café, and Land of Oz hours are already calculated for Monday, September 7.</p>
            </div>

            <StaffSection title="U-Pick apples" description="Confirm what visitors can pick in the orchard.">
              {uPickApples.map((apple) => <AppleSelect key={apple.id} apple={apple} onChange={(status) => setUPickApples((current) => current.map((item) => item.id === apple.id ? { ...item, status } : item))} />)}
            </StaffSection>

            <StaffSection title="Country Store apples" description="Keep store inventory separate from U-Pick.">
              {storeApples.map((apple) => <AppleSelect key={apple.id} apple={apple} onChange={(status) => setStoreApples((current) => current.map((item) => item.id === apple.id ? { ...item, status } : item))} />)}
            </StaffSection>

            <StaffSection title="Weather & exceptions" description="Expected activities need a clear same-day status.">
              {activities.filter((activity) => activity.weatherSensitive).map((activity) => (
                <div key={activity.id} className="rounded-2xl border border-[#e1e5df] bg-[#fcfcf9] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div><p className="font-extrabold text-[#214232]">{activity.name}</p><p className="mt-1 text-xs text-muted-foreground">Expected: scheduled • weather-sensitive</p></div>
                    <Select value={activity.status} onValueChange={(value) => setActivities((current) => current.map((item) => item.id === activity.id ? { ...item, status: value as ActivityStatus } : item))}>
                      <SelectTrigger className="h-11 w-full rounded-xl bg-white sm:w-[190px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed today</SelectItem>
                        <SelectItem value="temporarily_closed">Temporarily closed</SelectItem>
                        <SelectItem value="not_confirmed">Not confirmed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </StaffSection>

            <StaffSection title="Today’s notice" description="This appears prominently on the visitor Today page.">
              <Textarea value={announcement} onChange={(event) => setAnnouncement(event.target.value)} className="min-h-28 rounded-2xl bg-white p-4 text-base" maxLength={220} aria-label="Today’s visitor notice" />
              <p className="text-right text-xs text-muted-foreground">{announcement.length}/220</p>
            </StaffSection>

            <div className="flex flex-col gap-3 border-t border-[#e1e5df] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="ghost" className="h-11 justify-start rounded-full px-3 text-[#6c4c50]" disabled={historyCount === 0} onClick={onUndo}><RotateCcw data-icon="inline-start" /> Undo last publish</Button>
              <Button className="h-12 rounded-full bg-[#007050] px-6 hover:bg-[#075f46]" onClick={() => setStep('review')}>Review & publish <ChevronRight data-icon="inline-end" /></Button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-5 px-5 py-6 sm:px-7">
            <div className="grid gap-3 sm:grid-cols-3">
              <ReviewStat label="Apple changes" value={changedApples} />
              <ReviewStat label="Activity changes" value={changedActivities} />
              <ReviewStat label="Notice" value={announcement === snapshot.announcement ? 'Unchanged' : 'Updated'} />
            </div>
            <div className="rounded-2xl border border-[#e2e6df] bg-[#fafaf7] p-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-[#65726a]">Visitor notice</p>
              <p className="mt-3 text-base font-semibold leading-7 text-[#2f4639]">{announcement || 'No notice today.'}</p>
            </div>
            <div className="space-y-3">
              {activities.filter((activity) => activity.weatherSensitive).map((activity) => <div key={activity.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[#e2e6df] bg-white p-4"><span className="font-bold text-[#274333]">{activity.name}</span><StatusBadge status={activity.status} label={activityCopy[activity.status]} /></div>)}
            </div>
            <div className="rounded-2xl border border-[#ecd9b7] bg-[#fff5df] p-4 text-sm leading-6 text-[#73571e]"><Info className="mr-2 inline size-4" />Publishing creates a new revision and keeps the previous visitor snapshot in local preview history.</div>
            <div className="flex flex-col-reverse gap-3 border-t border-[#e1e5df] pt-5 sm:flex-row sm:justify-between">
              <Button variant="ghost" className="h-12 rounded-full px-5" onClick={() => setStep('edit')}><ArrowLeft data-icon="inline-start" /> Keep editing</Button>
              <Button className="h-12 rounded-full bg-[#007050] px-6 hover:bg-[#075f46]" onClick={publish}><Check data-icon="inline-start" /> Publish today’s update</Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="px-5 py-12 text-center sm:px-7">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#dff0e3] text-[#08704e]"><Check className="size-8" strokeWidth={2.5} /></span>
            <h3 className="mt-6 font-heading text-3xl font-bold tracking-[-0.04em] text-[#153c2c]">Visitors have the update.</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">The Today page now shows a staff-published revision with a fresh timestamp. In this prototype, it’s stored on this device.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="outline" className="h-12 rounded-full px-5" onClick={() => setStep('edit')}><History data-icon="inline-start" /> Make another update</Button>
              <Button className="h-12 rounded-full bg-[#007050] px-5 hover:bg-[#075f46]" onClick={() => onOpenChange(false)}>View visitor page <ChevronRight data-icon="inline-end" /></Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MobileNav({ view, onViewChange }: { view: View; onViewChange: (view: View) => void }) {
  return (
    <nav aria-label="Mobile primary navigation" className="fixed inset-x-4 bottom-4 z-40 grid grid-cols-3 rounded-[22px] border border-[#d7dfd6] bg-[#fbfaf5]/94 p-2 shadow-[0_18px_50px_rgba(20,47,35,.2)] backdrop-blur-xl md:hidden">
      <button className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-extrabold ${view === 'today' ? 'bg-[#007050] text-white' : 'text-[#53665a]'}`} onClick={() => onViewChange('today')}><CalendarDays className="size-5" />Today</button>
      <button className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-extrabold ${view === 'map' ? 'bg-[#007050] text-white' : 'text-[#53665a]'}`} onClick={() => onViewChange('map')}><MapIcon className="size-5" />Map</button>
      <a className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-extrabold text-[#53665a]" href={PHONE_HREF} onClick={() => pilotEvent('help_call_click')}><Phone className="size-5" />Help</a>
    </nav>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#d8212f]">{eyebrow}</p><h2 className="mt-1 font-heading text-3xl font-bold tracking-[-0.04em] text-[#153c2c] sm:text-4xl">{title}</h2></div>
      <p className="max-w-md text-sm leading-6 text-muted-foreground sm:text-right">{description}</p>
    </div>
  );
}

function ApplePanel({ title, subtitle, apples, tint }: { title: string; subtitle: string; apples: AppleStatus[]; tint: 'green' | 'rose' }) {
  return (
    <article className={`rounded-[26px] border p-5 sm:p-6 ${tint === 'green' ? 'border-[#cfdfce] bg-[#edf5e9]' : 'border-[#ead5d3] bg-[#f9eeed]'}`}>
      <div className="flex items-start justify-between gap-4">
        <div><h3 className="font-heading text-2xl font-bold tracking-[-0.035em] text-[#153c2c]">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{subtitle}</p></div>
        <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${tint === 'green' ? 'bg-[#d3e6cf] text-[#1d6846]' : 'bg-[#f0d6d5] text-[#9e3043]'}`}><Apple className="size-5" /></span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {apples.map((apple) => (
          <div key={apple.id} className="flex min-h-[70px] items-center justify-between gap-3 rounded-2xl bg-white/82 px-4 py-3 shadow-[0_1px_0_rgba(28,55,43,.04)]">
            <div><p className="font-extrabold text-[#213f31]">{apple.name}</p>{apple.note && <p className="mt-0.5 text-[11px] text-muted-foreground">{apple.note}</p>}</div>
            <StatusBadge status={apple.status} label={availabilityCopy[apple.status]} compact />
          </div>
        ))}
      </div>
    </article>
  );
}

function StatusBadge({ status, label, compact = false }: { status: ActivityStatus | AvailabilityStatus; label: string; compact?: boolean }) {
  return <span className={`w-fit shrink-0 rounded-full font-extrabold ring-1 ${compact ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-2 text-[11px]'} uppercase tracking-[0.06em] ${statusTone[status]}`}>{label}</span>;
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return <div className="flex items-start gap-3"><Icon className="mt-0.5 size-4 shrink-0 text-[#377052]" /><div><p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#7b827d]">{label}</p><p className="mt-0.5 text-sm font-semibold leading-5 text-[#34503f]">{value}</p></div></div>;
}

function StaffSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section><div className="mb-3"><h3 className="font-heading text-xl font-bold tracking-[-0.025em] text-[#173d2d]">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{description}</p></div><div className="space-y-3">{children}</div></section>;
}

function AppleSelect({ apple, onChange }: { apple: AppleStatus; onChange: (status: AvailabilityStatus) => void }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#e1e5df] bg-[#fcfcf9] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="font-extrabold text-[#214232]">{apple.name}</p><p className="mt-1 text-xs text-muted-foreground">Current: {availabilityCopy[apple.status]}</p></div>
      <Select value={apple.status} onValueChange={(value) => onChange(value as AvailabilityStatus)}>
        <SelectTrigger className="h-11 w-full rounded-xl bg-white sm:w-[175px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="limited">Limited</SelectItem>
          <SelectItem value="sold_out">Sold out</SelectItem>
          <SelectItem value="not_available">Not available</SelectItem>
          <SelectItem value="not_confirmed">Not confirmed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function ReviewStat({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl border border-[#e1e5df] bg-[#fafaf7] p-4"><p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#707a73]">{label}</p><p className="mt-2 font-heading text-2xl font-bold text-[#173d2d]">{value}</p></div>;
}

function relativeTime(iso: string, now: number) {
  const minutes = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60_000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
