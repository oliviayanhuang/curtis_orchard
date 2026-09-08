# Curtis Orchard Visitor Companion

Mobile-first visitor app for Curtis Orchard, reached by QR code at the farm.
Built to the spec in `../guide/Curtis_Orchard_Visitor_Companion_Whitepaper_v1.1.md`.

## Current state

Visitor front-end only, running against a mock `public/today` snapshot
(`src/data/today.ts`). No Firebase wiring, no staff/admin routes yet.

- `/` — Today: hours, apple availability, activity status, event, announcements,
  last-updated line, call fallback
- `/map` — illustrated farm map with pins, filters, and a detail sheet
- `/explore` — categories, plus `/explore/apples` and `/explore/activities`
- `/plan` — four-step visit planner (Phase 2 in the whitepaper; UI only)
- `/events` — Today / This Week / Upcoming
- `/help` — phone fallback and link out to curtisorchard.com

## Layout

```
src/
  domain/      pure helpers: status vocabulary, snapshot freshness
  types/       TodaySnapshot and the fixed status enums (whitepaper §49-50)
  data/        mock snapshot standing in for Firestore
  components/  shell, bottom nav, top bar, shared primitives
  visitor/     one folder per route
```

Status strings are the fixed vocabulary from the whitepaper. Add states there,
not inline in components.

## Develop

```
pnpm install
pnpm dev
pnpm build
pnpm lint
```

## Not done yet

Firestore schema and security rules, Auth, the staff daily-operations screen,
publish/undo, real map coordinates, analytics. See whitepaper §54 for the order.
