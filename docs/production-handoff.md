# Production handoff

## What is ready

- Responsive visitor Today and Map experiences
- Phone-friendly staff review/publish/undo prototype
- Accessible status vocabulary and structured map accessibility notes
- Chicago business-date, schedule, exception, override, snapshot, and stale-data domain logic
- Automated domain tests
- Pilot analytics event shape: `landing_view`, `today_view`, `map_open`, `help_call_click`, plus optional `src`
- Social-sharing metadata and artwork

## Required before a public launch

1. Confirm the operational owner, daily publisher, and backup publisher.
2. Confirm venue hours, holiday exceptions, apple vocabulary, weather-sensitive activities, map geometry, and accessibility wording with Curtis staff.
3. Replace browser-local preview persistence with a shared Curtis-owned data store.
4. Add allowlisted staff authentication with `editor` and `admin` roles; prohibit public writes, unauthorized reads, and role self-promotion.
5. Make publication atomic: save authoring changes, create the public Today snapshot, and append immutable audit history in one transaction.
6. Add emulator-backed allow/deny security tests.
7. Connect `visit.curtisorchard.com` only after a live on-site cellular pilot.
8. Print permanent QR signs only after domain ownership and recovery contacts are documented.

## Data ownership

| Data | Proposed authority | Maintainer | Companion behavior |
| --- | --- | --- | --- |
| Venue hours | Confirmed schedule rules | Admin | Calculate by Chicago business date |
| Holiday hours | Explicit date exceptions | Admin | Override recurring schedule |
| U-Pick apples | Daily operational update | Orchard operations | Publish separately from store status |
| Store apples | Daily operational update | Country Store staff | Publish separately from U-Pick |
| Weather closures | Same-day override | Authorized manager | Apply immediately with reason |
| Map geometry | Developer-managed static content | Admin/developer | Publish stable coordinates |
| Prices, policies, events | Existing Curtis website | Current website owner | Deep-link unless a sync plan is approved |

## Backup and recovery

- Preserve every public revision and the author/timestamp that produced it.
- Undo by republishing an earlier revision; never delete audit history to simulate rollback.
- Export authoring data and publish history on a documented schedule appropriate to the chosen provider.
- Keep DNS, hosting, authentication, analytics, and source-code ownership in Curtis-controlled accounts with at least two recovery contacts.

## Cost monitoring

Do not describe any vendor tier as permanently free. Record the selected hosting, database, authentication, analytics, domain, backup, and email/SMS plans at launch; assign one owner to review usage and billing alerts during the active season.

