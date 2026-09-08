# Curtis Orchard Visitor Companion

A QR-accessed, mobile-first web app for people who are already at Curtis Orchard
or about to arrive. It answers the questions staff get asked all day: what is
open, which apples are ripe, where things are, and who to call when the app is
not sure.

**Live:** https://oliviayanhuang.github.io/curtis_orchard/

The full specification is [`guide/Curtis_Orchard_Visitor_Companion_Whitepaper_v1.1.md`](guide/Curtis_Orchard_Visitor_Companion_Whitepaper_v1.1.md).
The UI follows the design comp at [`guide/效果图.png`](guide/效果图.png).

## Status

**Visitor front-end only, running on mock data.** Everything below the UI layer
is still to be built.

| Area | State |
|---|---|
| Visitor screens | Built — Today, Map, Explore, Plan, Events, Help |
| Data source | Mock snapshot in `src/data/today.ts`, shaped like the eventual `public/today` document |
| Firebase (Firestore, Auth) | Not wired up. The dependency is installed but nothing imports it |
| Staff / admin screens | Not started |
| Publish, audit, undo | Not started |
| Map coordinates | Hand-placed percentages, illustrative rather than surveyed |
| Explore imagery | Hand-drawn SVG placeholders, not orchard photography |
| Analytics | Not started |

Because the data is mocked, the "Updated 18 minutes ago" line and the stale-data
banner are wired to real logic but fed a synthetic timestamp.

## Routes

| Path | Screen |
|---|---|
| `/` | Today — hours, apple availability, activity status, event, announcements, last-updated, call fallback |
| `/map` | Illustrated farm map with pins, category filters, and a detail sheet |
| `/explore` | Category list |
| `/explore/apples` | Every variety, in-store and U-Pick shown separately |
| `/explore/activities` | Today's status for every activity |
| `/plan` | Four-step visit planner (Phase 2 in the whitepaper; UI only) |
| `/events` | Today / This Week / Upcoming |
| `/help` | Phone fallback and link out to curtisorchard.com |

## Repository layout

```
.github/workflows/deploy.yml   build + publish to GitHub Pages
guide/                         whitepaper v1.1 and the design comp
outdated_file/                 superseded whitepaper v1.0, kept for reference
curtis-orchard-companion/      the app
  src/
    domain/                    pure helpers: status vocabulary, snapshot freshness
    types/                     TodaySnapshot and the fixed status enums
    data/                      mock snapshot standing in for Firestore
    components/                shell, bottom nav, top bar, shared primitives
    visitor/                   one folder per route
```

Status strings come from the fixed vocabulary in whitepaper sections 49–50 and
live in `src/types/index.ts`. Add states there, never inline in a component.
Every state carries a word, not just a colour.

## Develop

Requires Node 24 and pnpm 10.

```
cd curtis-orchard-companion
pnpm install
pnpm dev        # http://localhost:5173
pnpm build
pnpm lint
```

## Deployment

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the app and publishes it to GitHub Pages.

Two things make a project site work that are easy to break:

- **Base path.** A project site is served from `/<repo>/`, not `/`. The workflow
  passes `VITE_BASE=/${{ github.event.repository.name }}/` so the repository can
  be renamed without touching the code, and React Router reads the same value
  through `import.meta.env.BASE_URL`. When the app eventually moves to
  `visit.curtisorchard.com`, leave `VITE_BASE` unset and the base returns to `/`.
- **Deep links.** GitHub Pages has no history fallback, so `/map` would hit the
  Pages 404 page. The build emits `404.html` as a copy of `index.html`, which
  lets the SPA boot and hand the URL to the router. Pages still returns a 404
  *status* for those URLs — that is expected and does not affect rendering.

**Pages must be enabled by a repository admin**, once, at Settings → Pages →
Build and deployment → Source → **GitHub Actions**. The `configure-pages` action
cannot do this itself: its `enablement` input requires a personal access token,
not the workflow's `GITHUB_TOKEN`.

## Next steps

Whitepaper section 54 gives the intended order. The next meaningful pieces are
the Firestore schema and security rules, Auth, and the staff daily-operations
screen with publish and undo.

Before the production schema is locked, section 3 asks for the operational
discovery work — mapping who currently knows each piece of information first and
who publishes it — so the app does not become a third place staff must remember
to update.
