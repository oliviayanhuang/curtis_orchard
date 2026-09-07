# Curtis Orchard Visitor Companion

A mobile-first visitor companion for Curtis Orchard & Pumpkin Patch. The current build implements the whitepaper’s MVP flow:

- one-glance Today view with venue-specific hours;
- separate U-Pick and Country Store apple availability;
- plain-language activity states, stale/offline messaging, and a persistent call-for-help path;
- interactive farm map with filters, walking context, and structured accessibility notes;
- phone-friendly staff preview with review, publish, local audit history, and undo;
- pure operational domain functions with schedule → exception → override precedence tests;
- privacy-conscious, device-local pilot events; and
- an imperative WebMCP surface for reading Today and opening/focusing the map.

## Run locally

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm test
npm run build
```

## Content status

The initial September 7, 2026 snapshot is a clearly labeled pilot preview derived from Curtis Orchard’s official website. Weather-sensitive activities are intentionally marked **Status not confirmed**. A staff update changes the visible snapshot only in the current browser using local storage.

The production system still needs Curtis-controlled authentication and a shared, server-backed publishing store before permanent QR signs or the `visit.curtisorchard.com` domain go live. See [Production handoff](docs/production-handoff.md).

## Primary source pages

- [Curtis Orchard](https://www.curtisorchard.com/)
- [Apples](https://www.curtisorchard.com/apples)
- [Land of Oz](https://www.curtisorchard.com/the-land-of-oz)
- [Directions](https://www.curtisorchard.com/directions)
- [FAQ](https://www.curtisorchard.com/faq)

