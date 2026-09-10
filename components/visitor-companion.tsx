'use client';

import { useState } from 'react';
import {
  Accessibility, Apple, ArrowLeft, ArrowRight, BadgeInfo, CakeSlice, Check,
  ChevronRight, Clock3, ExternalLink, Footprints, Info, Map as MapIcon,
  MapPin, Navigation, ParkingCircle, PawPrint, Search, Sparkles, Store,
  TentTree, Toilet, Trash2, UsersRound, UtensilsCrossed, X,
} from 'lucide-react';

import {
  EXPLORE_CATEGORIES, GROUP_OPTIONS, INTEREST_OPTIONS, OFFICIAL_SITE,
  ORCHARD_LOCATIONS, TIME_OPTIONS, type AppView, type LocationIcon,
  type MapCategory, type OrchardLocation,
} from '@/lib/app-data';

const iconMap = {
  parking: ParkingCircle, store: Store, bakery: CakeSlice, cafe: UtensilsCrossed,
  apple: Apple, sparkles: Sparkles, goat: PawPrint, pumpkin: TentTree,
  restrooms: Toilet, pavilion: TentTree, accessibility: Accessibility,
} satisfies Record<LocationIcon | 'accessibility', typeof MapPin>;

const emojiMap: Record<LocationIcon | 'accessibility', string> = {
  parking: '🅿️', store: '🏪', bakery: '🍩', cafe: '☕', apple: '🍎',
  sparkles: '🌽', goat: '🐐', pumpkin: '🎃', restrooms: '🚻',
  pavilion: '⛺', accessibility: '♿',
};

const categoryLabels = { activities: 'Activities', food: 'Food & drink', shopping: 'Shopping', amenities: 'Amenities' };
const filters: Array<{ id: MapCategory; label: string }> = [
  { id: 'all', label: 'All' }, { id: 'food', label: 'Food' },
  { id: 'activities', label: 'Activities' }, { id: 'shopping', label: 'Shopping' },
  { id: 'amenities', label: 'Amenities' },
];

function getLocation(id: string) { return ORCHARD_LOCATIONS.find((location) => location.id === id); }

export function VisitorCompanion() {
  const [view, setView] = useState<AppView>('map');
  const [detail, setDetail] = useState<OrchardLocation | null>(null);
  const [previousView, setPreviousView] = useState<AppView>('map');
  const [selected, setSelected] = useState<OrchardLocation | null>(null);
  const [mapFilter, setMapFilter] = useState<MapCategory>('all');
  const [planStops, setPlanStops] = useState<string[]>([]);
  const [planStep, setPlanStep] = useState(1);

  const chooseView = (next: AppView) => {
    setView(next); setDetail(null); setSelected(null);
    if (next === 'plan' && planStops.length > 0) setPlanStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openDetail = (location: OrchardLocation, from: AppView) => {
    setPreviousView(from); setDetail(location); setSelected(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const addToPlan = (id: string) => setPlanStops((current) => current.includes(id) ? current : [...current, id]);
  const showOnMap = (location: OrchardLocation) => { setView('map'); setDetail(null); setMapFilter('all'); setSelected(location); };

  return <main className="app-shell">
    <TopBar view={view} detail={detail} planStep={planStep} onBack={() => detail ? setDetail(null) : setPlanStep((step) => Math.max(1, step - 1))} />
    <div className="app-content">
      {detail ? <LocationDetail location={detail} inPlan={planStops.includes(detail.id)} onBack={() => setDetail(null)} onNearby={(location) => openDetail(location, previousView)} onAdd={() => addToPlan(detail.id)} onMap={() => showOnMap(detail)} />
      : view === 'map' ? <MapPage filter={mapFilter} selected={selected} planStops={planStops} onFilter={setMapFilter} onSelect={setSelected} onClose={() => setSelected(null)} onDetail={(location) => openDetail(location, 'map')} onAdd={addToPlan} />
      : view === 'explore' ? <ExplorePage onDetail={(location) => openDetail(location, 'explore')} />
      : <PlanPage step={planStep} planStops={planStops} onStep={setPlanStep} onPlan={setPlanStops} onDetail={(location) => openDetail(location, 'plan')} onMap={showOnMap} />}
    </div>
    {!detail && <BottomNav view={view} count={planStops.length} onChange={chooseView} />}
  </main>;
}

function TopBar({ view, detail, planStep, onBack }: { view: AppView; detail: OrchardLocation | null; planStep: number; onBack: () => void }) {
  const title = detail?.name ?? (view === 'map' ? 'Farm Map' : view === 'explore' ? 'Explore' : 'Plan My Visit');
  const showBack = Boolean(detail) || (view === 'plan' && planStep > 1);
  return <header className="app-topbar">
    <div className="topbar-side">{showBack ? <button className="topbar-button" onClick={onBack} aria-label="Go back"><ArrowLeft /></button> : <span className="brand-apple"><Apple /></span>}</div>
    <h1>{title}</h1><div className="topbar-side topbar-side-right" />
  </header>;
}

function MapPage({ filter, selected, planStops, onFilter, onSelect, onClose, onDetail, onAdd }: {
  filter: MapCategory; selected: OrchardLocation | null; planStops: string[];
  onFilter: (value: MapCategory) => void; onSelect: (location: OrchardLocation) => void;
  onClose: () => void; onDetail: (location: OrchardLocation) => void; onAdd: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const visible = ORCHARD_LOCATIONS.filter((location) => (filter === 'all' || location.category === filter) && `${location.name} ${location.summary}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="map-page">
    <SearchBox value={query} onChange={setQuery} placeholder="Search for a location..." />
    <div className="reference-map">
      <span className="map-road road-one" /><span className="map-road road-two" />
      <span className="tree t1">🌳</span><span className="tree t2">🌳</span><span className="tree t3">🌳</span><span className="tree t4">🌳</span><span className="tree t5">🌳</span><span className="tree t6">🌳</span><span className="tree t7">🌳</span><span className="tree t8">🌳</span><span className="tree t9">🌳</span><span className="tree t10">🌳</span>
      {visible.map((location) => <button key={location.id} className={`map-marker ${selected?.id === location.id ? 'map-marker-active' : ''}`} style={{ left: `${location.x}%`, top: `${location.y}%` }} onClick={() => onSelect(location)} aria-label={location.name}><span>{emojiMap[location.icon]}</span><b>{location.shortName}</b></button>)}
      <div className="you-are-here"><MapPin /> <span>You are here</span></div>
    </div>
    <div className="map-filters"><span>Filter by:</span><div>{filters.map((item) => <button key={item.id} className={filter === item.id ? 'active' : ''} onClick={() => onFilter(item.id)}>{item.label}</button>)}</div></div>
    {selected && <><button className="sheet-scrim" aria-label="Close location preview" onClick={onClose} /><aside className="location-sheet">
      <button className="sheet-close" onClick={onClose} aria-label="Close"><X /></button>
      <div className="sheet-handle" /><div className="sheet-title"><span>{emojiMap[selected.icon]}</span><div><h2>{selected.name}</h2><p>{categoryLabels[selected.category]}</p></div></div>
      <p className="sheet-summary">{selected.summary}</p><p className="sheet-meta"><Footprints /> {selected.terrain}</p>
      <div className="sheet-actions"><button onClick={() => onDetail(selected)}>View details <ChevronRight /></button><button className="secondary" disabled={planStops.includes(selected.id)} onClick={() => onAdd(selected.id)}>{planStops.includes(selected.id) ? 'Added to plan' : 'Add to plan'}</button></div>
    </aside></>}
  </section>;
}

function ExplorePage({ onDetail }: { onDetail: (location: OrchardLocation) => void }) {
  const [query, setQuery] = useState('');
  const categories = EXPLORE_CATEGORIES.filter((category) => `${category.title} ${category.summary} ${category.detail}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="standard-page explore-page"><SearchBox value={query} onChange={setQuery} placeholder="Search activities, food, etc." />
    <div className="explore-list">{categories.map((category) => { const location = getLocation(category.locationIds[0]); return <button key={category.id} className="explore-row" onClick={() => location && onDetail(location)}>
      <span className={`explore-thumb thumb-${category.accent}`}><span>{emojiMap[category.icon]}</span></span>
      <span className="explore-copy"><b>{category.title}</b><small>{category.summary}</small></span><ChevronRight />
    </button>; })}</div>
    {categories.length === 0 && <EmptyState icon={Search} title="No matching places" text="Try another activity or location." />}
    <a className="official-note" href={OFFICIAL_SITE} target="_blank" rel="noreferrer"><Info /> Seasonal details can change. Check the official website. <ExternalLink /></a>
  </section>;
}

function PlanPage({ step, planStops, onStep, onPlan, onDetail, onMap }: {
  step: number; planStops: string[]; onStep: (step: number) => void; onPlan: (stops: string[]) => void;
  onDetail: (location: OrchardLocation) => void; onMap: (location: OrchardLocation) => void;
}) {
  const [group, setGroup] = useState(''); const [time, setTime] = useState(''); const [interests, setInterests] = useState<string[]>([]);
  const ready = step === 1 ? Boolean(group) : step === 2 ? Boolean(time) : step === 3 ? interests.length > 0 : true;
  const buildPlan = () => {
    const selectedTime = TIME_OPTIONS.find((option) => option.id === time) ?? TIME_OPTIONS[1];
    const interestStops = INTEREST_OPTIONS.filter((item) => interests.includes(item.id)).map((item) => item.locationId);
    const defaults = group === 'young-family' ? ['land-of-oz', 'animal-area', 'bakery'] : group === 'group' ? ['welcome-parking', 'land-of-oz', 'country-store'] : ['apple-orchard', 'cafe', 'country-store'];
    onPlan([...new Set([...planStops, ...interestStops, ...defaults, 'country-store'])].slice(0, selectedTime.stopCount)); onStep(4);
  };
  const next = () => step === 3 ? buildPlan() : onStep(step + 1);
  const move = (index: number, direction: -1 | 1) => { const nextIndex = index + direction; if (nextIndex < 0 || nextIndex >= planStops.length) return; const nextStops = [...planStops]; [nextStops[index], nextStops[nextIndex]] = [nextStops[nextIndex], nextStops[index]]; onPlan(nextStops); };
  return <section className="plan-page"><Progress step={step} /><div className="plan-body">
    {step === 1 && <><h2>Who are you visiting with?</h2><div className="group-grid">{GROUP_OPTIONS.map((option) => <ChoiceTile key={option.id} selected={group === option.id} icon={UsersRound} title={option.label} onClick={() => setGroup(option.id)} />)}</div></>}
    {step === 2 && <><h2>How much time do you have?</h2><div className="option-list">{TIME_OPTIONS.map((option) => <ChoiceRow key={option.id} selected={time === option.id} title={option.label} subtitle={option.id === 'quick' ? 'A quick stop' : option.id === 'medium' ? 'The usual visit' : option.id === 'half-day' ? 'Time for lunch' : 'See everything'} onClick={() => setTime(option.id)} />)}</div></>}
    {step === 3 && <><h2>What are you interested in?</h2><div className="interest-grid">{INTEREST_OPTIONS.map((option) => <ChoiceTile key={option.id} selected={interests.includes(option.id)} title={option.label} onClick={() => setInterests((current) => current.includes(option.id) ? current.filter((id) => id !== option.id) : [...current, option.id])} />)}</div></>}
    {step === 4 && <PlanResult stops={planStops} onPlan={onPlan} onDetail={onDetail} onMap={onMap} onMove={move} onRestart={() => { onPlan([]); onStep(1); }} />}
  </div>{step < 4 && <div className="plan-next"><button disabled={!ready} onClick={next}>Next <ArrowRight /></button></div>}
  </section>;
}

function Progress({ step }: { step: number }) { return <ol className="progress">{[1, 2, 3, 4].map((item) => <li key={item} className={item <= step ? 'active' : ''}><span>{item}</span>{item < 4 && <i />}</li>)}</ol>; }
function ChoiceTile({ selected, icon: Icon, title, onClick }: { selected: boolean; icon?: typeof MapPin; title: string; onClick: () => void }) { return <button className={`choice-tile ${selected ? 'selected' : ''}`} onClick={onClick}>{Icon && <Icon />}<b>{title}</b>{selected && <span className="choice-check"><Check /></span>}</button>; }
function ChoiceRow({ selected, title, subtitle, onClick }: { selected: boolean; title: string; subtitle: string; onClick: () => void }) { return <button className={`choice-row ${selected ? 'selected' : ''}`} onClick={onClick}><span><b>{title}</b><small>{subtitle}</small></span>{selected && <Check />}</button>; }

function PlanResult({ stops, onPlan, onDetail, onMap, onMove, onRestart }: { stops: string[]; onPlan: (stops: string[]) => void; onDetail: (location: OrchardLocation) => void; onMap: (location: OrchardLocation) => void; onMove: (index: number, direction: -1 | 1) => void; onRestart: () => void }) {
  return <div className="plan-result"><div className="result-heading"><span><MapIcon /></span><div><small>Your visit</small><h2>Your orchard plan</h2></div></div><p>A simple route based on your choices. Tap a stop for details.</p>
    {stops.length ? <ol>{stops.map((id, index) => { const location = getLocation(id); if (!location) return null; return <li key={id}><button className="stop-main" onClick={() => onDetail(location)}><span className="stop-number">{index + 1}</span><span><b>{location.name}</b><small>{location.summary}</small></span><ChevronRight /></button><div className="stop-actions"><button disabled={index === 0} onClick={() => onMove(index, -1)} aria-label="Move earlier"><ArrowLeft className="up-arrow" /></button><button disabled={index === stops.length - 1} onClick={() => onMove(index, 1)} aria-label="Move later"><ArrowRight className="down-arrow" /></button><button onClick={() => onPlan(stops.filter((stop) => stop !== id))} aria-label="Remove"><Trash2 /></button></div></li>; })}</ol> : <EmptyState icon={Clock3} title="Your plan is empty" text="Start again to build another route." />}
    <div className="result-buttons"><button disabled={!stops.length} onClick={() => { const first = getLocation(stops[0]); if (first) onMap(first); }}><MapIcon /> View on map</button><button className="secondary" onClick={onRestart}>Start over</button></div>
  </div>;
}

function LocationDetail({ location, inPlan, onBack, onNearby, onAdd, onMap }: { location: OrchardLocation; inPlan: boolean; onBack: () => void; onNearby: (location: OrchardLocation) => void; onAdd: () => void; onMap: () => void }) {
  const Icon = iconMap[location.icon]; const nearby = location.nearby.map(getLocation).filter(Boolean) as OrchardLocation[];
  return <article className="detail-page"><div className="detail-hero"><span>{emojiMap[location.icon]}</span><Icon /></div><div className="detail-intro"><p>{location.overview}</p></div>
    <section className="detail-section"><h2><BadgeInfo /> Good to know</h2><div className="fact-grid"><Fact label="Season" value={location.season} /><Fact label="Admission" value={location.admission} /><Fact label="Terrain" value={location.terrain} /><Fact label="Accessibility" value={location.accessibility} /></div></section>
    <section className="detail-section"><h2><Sparkles /> What you’ll find</h2><ul className="check-list">{location.highlights.map((item) => <li key={item}><Check /> {item}</li>)}</ul></section>
    <section className="detail-section"><h2><Info /> Rules & tips</h2><ul className="tip-list">{location.tips.map((item) => <li key={item}>{item}</li>)}</ul></section>
    {nearby.length > 0 && <section className="detail-section"><h2><Navigation /> What’s nearby</h2><div className="nearby-list">{nearby.map((item) => <button key={item.id} onClick={() => onNearby(item)}><span>{emojiMap[item.icon]}</span><b>{item.name}</b><ChevronRight /></button>)}</div></section>}
    <div className="detail-actions"><button disabled={inPlan} onClick={onAdd}>{inPlan ? <><Check /> Added to plan</> : <><Clock3 /> Add to plan</>}</button><button className="secondary" onClick={onMap}><MapIcon /> View on map</button>{location.officialUrl && <a href={location.officialUrl} target="_blank" rel="noreferrer">Official details <ExternalLink /></a>}</div>
    <button className="detail-back-link" onClick={onBack}><ArrowLeft /> Back</button>
  </article>;
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) { return <label className="search-box"><Search /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} />{value && <button onClick={() => onChange('')} aria-label="Clear search"><X /></button>}</label>; }
function Fact({ label, value }: { label: string; value: string }) { return <div><small>{label}</small><p>{value}</p></div>; }
function EmptyState({ icon: Icon, title, text }: { icon: typeof MapPin; title: string; text: string }) { return <div className="empty-state"><Icon /><b>{title}</b><p>{text}</p></div>; }

function BottomNav({ view, count, onChange }: { view: AppView; count: number; onChange: (view: AppView) => void }) { return <nav className="bottom-nav" aria-label="Primary navigation"><NavButton active={view === 'map'} icon={MapIcon} label="Map" onClick={() => onChange('map')} /><NavButton active={view === 'explore'} icon={Search} label="Explore" onClick={() => onChange('explore')} /><NavButton active={view === 'plan'} icon={Clock3} label="Plan" count={count} onClick={() => onChange('plan')} /></nav>; }
function NavButton({ active, icon: Icon, label, count, onClick }: { active: boolean; icon: typeof MapPin; label: string; count?: number; onClick: () => void }) { return <button className={active ? 'active' : ''} onClick={onClick}><span><Icon />{Boolean(count) && <i>{count}</i>}</span><small>{label}</small></button>; }
