# Curtis Orchard Visitor Companion

A mobile-first guide for visitors at Curtis Orchard & Pumpkin Patch.

The `Simplified` branch contains the streamlined visitor experience:

- an illustrated farm map with search, filters, hotspots, and location previews;
- an Explore directory for picking, family activities, animals, food, shopping, pumpkins, and accessibility;
- a four-step Plan My Visit flow with an adjustable itinerary; and
- detailed location pages with terrain, admission, accessibility, tips, and nearby stops.

The Today page, event listings, live inventory, staff editor, login, and database features are intentionally outside this version's scope.

## Run locally

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm test
npm run build
npm run build:pages
```

## GitHub Pages

Pushes to `Simplified` run [the GitHub Pages workflow](.github/workflows/deploy-pages.yml). The workflow builds a static version with the `/curtis_orchard/` base path and deploys `dist-pages` to GitHub Pages.

Published site: <https://oliviayanhuang.github.io/curtis_orchard/>

## Content status

The visitor-facing copy is based on Curtis Orchard's official website and organized for the simplified prototype. Details that may change by date, season, or weather should be confirmed with Curtis Orchard before a visit.

## Primary source pages

- [Curtis Orchard](https://www.curtisorchard.com/)
- [Apples](https://www.curtisorchard.com/apples)
- [Land of Oz](https://www.curtisorchard.com/the-land-of-oz)
- [Directions](https://www.curtisorchard.com/directions)
- [FAQ](https://www.curtisorchard.com/faq)
