# Curtis Orchard Visitor Companion
## Technical Whitepaper and Implementation Specification
### Version 1.1

**Status:** Revised implementation specification  
**Primary delivery format:** Mobile-first web application / PWA  
**Primary access method:** QR code  
**Recommended frontend:** React + Vite + TypeScript + Tailwind CSS  
**Recommended backend:** Firebase Authentication + Cloud Firestore  
**Recommended static hosting:** Cloudflare Pages  
**Target production URL:** `https://visit.curtisorchard.com`  
**Target operating model:** Near-zero routine IT maintenance for Curtis Orchard staff  
**Cost target:** Designed to remain very low-cost under expected usage; do not promise permanent $0 operation without monitoring actual traffic and current vendor pricing

---

# 0. Version 1.1 Revision Summary

Version 1.1 keeps the original React + Firebase direction but changes the product architecture around the most important real-world risks identified during review.

The major changes are:

1. **Business workflow is now a first-class architecture dependency.**
   - Development must begin by understanding how Curtis Orchard currently publishes website, social, and daily operational information.
   - The system must avoid becoming a third independent place that staff must remember to update.

2. **Operational data is no longer modeled as simple `open / closed` booleans.**
   - Recurring schedules, date ranges, day-of-week rules, holiday exceptions, and same-day overrides are modeled separately.
   - Staff should normally update only exceptions, not manually recreate known schedules every morning.

3. **Apple availability is split by visitor meaning.**
   - Store availability and U-Pick availability must be represented independently.
   - States may include available, limited, sold out, out of season, and not confirmed.

4. **The public Today page should consume an aggregated published snapshot.**
   - Authoring collections remain the source of truth.
   - A derived `public/today` document reduces Firestore reads and prevents inconsistent partial page loads.

5. **Cloudflare Pages is preferred for static frontend hosting.**
   - Firebase remains the backend for Firestore and Auth.
   - This reduces exposure to Firebase Hosting transfer limits during seasonal traffic spikes.

6. **The MVP is smaller.**
   - True MVP: Today + Map + Staff Daily Operations + help/call fallback.
   - Explore and Events may link to the existing website initially.
   - Plan My Visit moves to Phase 2.

7. **A live pilot moves forward to approximately Week 4.**
   - The goal is to collect real QR usage and staff feedback during the active season instead of waiting until the entire semester build is complete.

8. **Timezone, auditability, stale data, offline behavior, security testing, analytics, and ownership are now explicit requirements.**

9. **Normal staff maintenance does not include image upload or map-coordinate editing in MVP.**
   - Static images and map layout remain developer-managed unless a later staff-friendly editor is deliberately built.

10. **The central product question changes from "How do we build an app?" to:**

> **How can Curtis Orchard publish accurate operational information to visitors with the least possible human effort?**

---

# 1. Executive Summary

The Curtis Orchard Visitor Companion is a QR-accessed, mobile-first web application intended primarily for people who are already at Curtis Orchard or are about to arrive.

The application should help visitors answer immediate operational questions:

- What is open today?
- Which apples are available for U-Pick?
- Which apples are available in the store?
- Are weather-sensitive activities operating?
- Where are the restrooms, food, parking, and major activities?
- What is happening right now?
- Where should I go for help if the information is uncertain?

The system has two interfaces:

## Visitor interface

Initial MVP:

- Today
- Interactive Farm Map
- Help / Call Curtis Orchard

Later phases:

- Explore
- Events
- Curated Routes / Plan My Visit

## Staff interface

Initial MVP:

- Staff login
- Daily operational confirmation
- Apple availability
- Same-day activity overrides
- Weather closures
- Announcements
- Publish
- Last updated
- Audit information
- Undo previous publish

The product must not depend on farm staff understanding Firebase, GitHub, React, deployment, or databases.

The most important product requirement is:

> **A non-technical staff member should be able to publish accurate same-day visitor information from a phone in approximately 1 to 3 minutes, and most routine days should require even less work because known schedules are calculated automatically.**

---

# 2. The Primary Risk Is Operational, Not Technical

React and Firebase can easily implement the proposed UI.

That is not the primary project risk.

The primary risk is that the Visitor Companion becomes another independent information channel that must be manually maintained in addition to:

- the existing Curtis Orchard website;
- social media;
- physical signage;
- staff verbal communication;
- any existing internal process.

A technically successful application can still fail operationally if staff must remember to enter the same information in several places.

Therefore, before the final production schema is locked, the project must answer:

> **Where does each piece of visitor-facing information currently come from, who knows it first, who updates it today, and which system should be authoritative in the future?**

---

# 3. Mandatory Discovery Before Final Schema Lock

The first implementation phase is not coding.

The development team must map the current operational information workflow.

At minimum, interview the Curtis Orchard stakeholder(s) responsible for operations and website/content updates.

## 3.1 Required workflow questions

Ask:

1. Who currently updates the Curtis Orchard website?
2. Can Curtis staff directly update the current CMS, or is an outside company involved?
3. Who decides that an activity is closed due to weather?
4. Who first knows which apple varieties are currently available?
5. Is U-Pick availability tracked separately from store inventory today?
6. How does that information move from orchard staff to the person who publishes it?
7. Which information changes:
   - several times per day;
   - once per day;
   - weekly;
   - seasonally;
   - rarely?
8. Which operating schedules are predictable from published rules?
9. Which schedules require same-day human judgment?
10. Who will actually open the admin page and press Publish?
11. Who is the backup person if the primary staff member is absent?
12. What happens now when an attraction unexpectedly closes?
13. Where do customers most often ask repeated questions?
14. What information creates the most staff interruptions?
15. Which existing website information should not be duplicated in the new system?
16. Would the existing website maintainer support an API, CMS export, or synchronization path?
17. Who can provide DNS access for `visit.curtisorchard.com`?
18. Which Curtis-controlled Google account should own Firebase?
19. What would Curtis consider a successful pilot?
20. Where can QR signs realistically be placed?

## 3.2 Deliverable

The result should be an **Operational Information Map**.

Example:

```text
Information:
U-Pick apple availability

First known by:
Orchard operations staff

Current communication:
Staff -> manager -> website / sign / front desk

Desired future:
One update -> Visitor Companion + future website integration
```

Do this for every major data category before finalizing the production model.

---

# 4. Existing Website Integration Strategy

The Visitor Companion must not silently assume that Firebase is automatically the master source for all Curtis Orchard content.

Three integration patterns are possible.

---

## 4.1 Pattern A: Existing CMS is authoritative

```text
Existing Curtis CMS
        │
        ├──── Existing Website
        │
        └──── Visitor Companion
```

This is preferred if the current website CMS exposes usable structured content and the current maintainer can support it.

Benefits:

- no duplicate staff entry;
- existing workflows stay intact;
- lowest organizational disruption.

Risks:

- access may be limited;
- APIs or CMS structure may not fit same-day operational needs;
- outside maintainer coordination may be required.

---

## 4.2 Pattern B: Split ownership by content type

This is likely the most realistic MVP.

```text
Existing website
    │
    ├── permanent descriptions
    ├── parties
    ├── policies
    ├── long-form pricing
    ├── detailed seasonal content
    └── marketing content

Visitor Companion
    │
    ├── today's apples
    ├── today's operating exceptions
    ├── weather closures
    ├── today's announcement
    ├── live visitor map status
    └── on-site help
```

The goal is to minimize duplicate ownership.

The Visitor Companion should specialize in:

> **What is happening now?**

not:

> **Rebuild the entire Curtis Orchard website.**

---

## 4.3 Pattern C: Firebase becomes a future content hub

Long-term possibility:

```text
                Curtis Data Hub
                      │
            ┌─────────┴─────────┐
            ▼                   ▼
      Existing Website     Visitor Companion
```

This should be treated as a future integration goal unless the website maintainer explicitly agrees to support it.

The semester MVP must not depend on Pattern C being available.

---

# 5. Product Principles

## 5.1 Mobile first

Primary context:

- outdoor use;
- one-handed phone use;
- bright sunlight;
- weak cellular conditions;
- family groups;
- older visitors;
- people walking while checking information.

Design for small screens first.

Recommended minimum assumptions:

```text
375 px viewport width
16 px minimum body text
approximately 44 x 44 px minimum touch target
```

---

## 5.2 QR first

Primary visitor flow:

```text
Physical QR sign
      ↓
visit.curtisorchard.com
      ↓
Visitor Companion
```

The QR must use a Curtis-controlled permanent subdomain, never a vendor deployment URL.

This allows the infrastructure to change later without replacing physical signs.

The printed sign should also include the readable short URL below the QR code.

---

## 5.3 No visitor login

Visitor flow:

```text
Scan
 ↓
Open
 ↓
Use
```

No account should be required for the MVP.

---

## 5.4 Single operational truth, not duplicated page state

A status such as:

```text
Corn Maze = Closed today
```

must not be independently edited in Today, Map, and Explore.

Those surfaces should all derive from the same published operational state.

---

## 5.5 Rules first, manual overrides second

Known recurring operations should be represented as schedules.

Staff should manually enter only exceptions whenever possible.

Preferred model:

```text
Recurring Schedule
       +
Business-Date Rules
       +
Today Override
       =
Effective Visitor Status
```

---

## 5.6 Stale information must never appear live without context

Every time-sensitive value must carry a business date and publication timestamp.

If the current state cannot be refreshed, the UI must communicate that clearly.

---

# 6. Recommended Technology Stack

| Layer | Recommended Technology | Purpose |
|---|---|---|
| Frontend | React | Visitor and staff interfaces |
| Build tool | Vite | Lightweight static build |
| Language | TypeScript | Safer long-term maintenance |
| Styling | Tailwind CSS | Mobile-first UI |
| Routing | React Router | Visitor/admin routes |
| Database | Cloud Firestore | Operational data |
| Auth | Firebase Authentication | Staff accounts |
| Static hosting | Cloudflare Pages | Frontend hosting |
| Realtime | Firestore listeners where justified | Same-day operational updates |
| Analytics | Privacy-conscious web analytics / Firebase-compatible analytics as appropriate | Pilot usage measurement |
| Map | SVG or optimized image + React hotspots | Farm-specific map |
| PWA | Manifest + carefully versioned service worker | Optional installability/caching |
| Source control | GitHub | Developer history and handoff |

---

# 7. Why Cloudflare Pages + Firebase Instead of Firebase-Only Hosting

Firebase remains a good fit for:

- Firestore;
- Authentication;
- realtime updates.

However, static frontend delivery is separated from the backend.

Recommended:

```text
React + Vite
     ↓
Cloudflare Pages

React frontend
     ↓
Firebase Firestore + Auth
```

Reasons:

1. The React application is fundamentally a static frontend.
2. Seasonal traffic may spike sharply during busy weekends.
3. Separating static delivery from Firebase reduces the risk that frontend asset transfer limits become the first production constraint.
4. Staff workflow is unaffected; only developers see the infrastructure split.
5. The frontend can later move to another host without changing the QR code if the permanent domain remains the same.

Do not promise exact future infrastructure costs without reviewing current pricing at launch.

---

# 8. Revised Product Scope

## 8.1 True MVP

### Visitor

- Today
- Interactive Farm Map
- Help / Call Curtis Orchard
- Clear last-updated and stale-data behavior
- Mobile responsive design

### Staff

- Login
- Daily apple availability
- Same-day overrides
- Weather closures
- Announcement
- Publish
- Last updated
- Updated by
- Undo previous publish

### Infrastructure

- Firestore
- Firebase Auth
- Cloudflare Pages
- Firestore Security Rules
- Security Rule emulator tests
- Production domain
- Basic analytics

---

## 8.2 Phase 1.5

- Map activity status
- Better accessibility notes
- Event-of-the-day card
- Existing-website deep links
- Additional admin content editing if genuinely needed

---

## 8.3 Phase 2

- Explore
- Curated visitor routes
- Events inside the companion
- More advanced content editing
- Optional image management
- Existing website synchronization

---

## 8.4 Phase 3

Possible future features:

- dynamic itinerary generation;
- Square integration;
- parking or queue information;
- weather-assisted staff alerts;
- push notifications;
- automated content synchronization.

---

# 9. Visitor Today Page

The Today page is the highest-priority visitor page.

It should answer immediate operational questions in seconds.

Example:

```text
Today at Curtis Orchard
Sunday, September 20

OPEN TODAY
9:00 AM - 6:00 PM

U-PICK APPLES
Fuji              Available
Golden Delicious  Limited

IN-STORE APPLES
Honeycrisp        Available
Gala              Available

ACTIVITIES
Corn Maze         Open
Pony Rides        12 PM - 4 PM
Wagon Rides       Closed today

TODAY'S NOTICE
Wagon rides are closed due to weather.

Updated 18 minutes ago

[ Call Curtis Orchard ]
```

The application should not claim a status is current if it is stale or unavailable.

---

# 10. Operational Data Model

The v1.0 model was too close to a simple CMS.

Version 1.1 separates:

1. static catalog data;
2. recurring operating rules;
3. daily variable data;
4. same-day overrides;
5. public published snapshot.

---

# 11. Static Catalog Collections

Static or slowly changing information may include:

```text
activities
locations
appleVarieties
venues
accessibilityNotes
```

These describe what something is, not necessarily whether it is operating today.

Example activity:

```json
{
  "name": "Corn Maze",
  "category": "activity",
  "description": "Seasonal corn maze.",
  "locationId": "corn-maze",
  "defaultDurationMinutes": 30,
  "requiresTicket": true,
  "activeSeasonally": true
}
```

---

# 12. Apple Availability Model

Do not use:

```json
{
  "available": true
}
```

Store availability and U-Pick availability represent different visitor questions.

Recommended state type:

```ts
type AvailabilityStatus =
  | "available"
  | "limited"
  | "sold_out"
  | "not_available"
  | "not_in_season"
  | "not_confirmed";
```

Example:

```json
{
  "name": "Honeycrisp",
  "storeStatus": "available",
  "uPickStatus": "not_available",
  "uPickLocationId": null,
  "businessDate": "2026-09-07",
  "updatedAt": "server timestamp",
  "updatedBy": "staff uid"
}
```

Example where both are relevant:

```json
{
  "name": "Fuji",
  "storeStatus": "limited",
  "uPickStatus": "available",
  "uPickLocationId": "orchard-zone-b",
  "businessDate": "2026-09-07"
}
```

The exact business vocabulary should be confirmed with Curtis staff.

---

# 13. Venue and Hours Model

Do not assume one global opening time.

Possible venues:

```text
orchard_store
bakery
cafe
land_of_oz
u_pick
```

Each may have its own schedule.

Example:

```json
{
  "venueId": "cafe",
  "scheduleRuleIds": [
    "cafe-fall-weekday",
    "cafe-fall-sunday"
  ]
}
```

---

# 14. Schedule Rules

Known recurring operating schedules should be modeled explicitly.

Example conceptual rule:

```json
{
  "id": "pony-rides-fall-weekends",
  "targetType": "activity",
  "targetId": "pony-rides",
  "startDate": "2026-09-05",
  "endDate": "2026-11-01",
  "daysOfWeek": [0, 6],
  "openTime": "12:00",
  "closeTime": "16:00",
  "holidayMode": "use_exception_list",
  "enabled": true
}
```

Exceptions must be represented separately.

Do not hardcode website schedule text permanently into code.

Schedule rules should be based on operational information confirmed by Curtis.

---

# 15. Schedule Exceptions

Example:

```json
{
  "targetId": "pony-rides",
  "businessDate": "2026-10-12",
  "type": "open_exception",
  "openTime": "12:00",
  "closeTime": "16:00",
  "reason": "Holiday schedule"
}
```

Or:

```json
{
  "targetId": "wagon-rides",
  "businessDate": "2026-10-12",
  "type": "closed_exception",
  "reason": "Holiday schedule"
}
```

The system should not assume holiday rules without explicit configuration.

---

# 16. Today Overrides

Same-day operational overrides represent abnormal conditions.

Examples:

- rain closure;
- excessive wind;
- equipment problem;
- sold out;
- staffing issue;
- temporary closure.

Example:

```json
{
  "targetType": "activity",
  "targetId": "jumping-pillow",
  "businessDate": "2026-09-07",
  "status": "closed",
  "reasonCode": "weather",
  "message": "Closed due to weather.",
  "createdAt": "server timestamp",
  "createdBy": "staff uid"
}
```

Effective state:

```text
Recurring schedule
      ↓
date/holiday exception
      ↓
today override
      ↓
effective status
```

---

# 17. Which Data Requires Daily Confirmation

Not every item should become "Not confirmed today" every morning.

## Rule-driven

Normally calculated automatically:

- standard venue hours;
- scheduled rides;
- normal recurring events.

## Daily-variable

Human confirmation may be required:

- U-Pick availability;
- store apple availability when appropriate;
- weather-sensitive closures;
- sell-outs;
- special announcements.

## Static

No daily confirmation:

- restroom locations;
- parking;
- map geometry;
- general descriptions;
- accessibility notes.

This avoids turning "Not confirmed" into noise.

---

# 18. Curtis Business Date and Timezone

All operational date logic must use:

```text
America/Chicago
```

Do not use the visitor device timezone as the source of truth for "today."

The business date helper must be centralized.

Example implementation concept:

```ts
const BUSINESS_TIME_ZONE = "America/Chicago";
```

Date formatting and comparison should explicitly use the business timezone.

This applies to:

- `businessDate`;
- `statusDate`;
- event grouping;
- stale-data logic;
- schedule evaluation;
- Today labels.

---

# 19. Published Public Today Snapshot

Visitors should not need to read 20 to 30 individual operational documents to render Today.

Authoring data remains normalized.

Publishing creates a derived snapshot:

```text
public/today
```

Conceptual structure:

```json
{
  "businessDate": "2026-09-07",
  "venues": [],
  "uPickApples": [],
  "storeApples": [],
  "activities": [],
  "todayEvents": [],
  "announcement": {},
  "publishedAt": "server timestamp",
  "publishedBy": "staff uid",
  "revisionId": "..."
}
```

Benefits:

- one primary visitor read;
- lower Firestore read usage;
- consistent page state;
- simpler offline behavior;
- easier audit and rollback;
- faster rendering.

The snapshot is derived data, not the editing source.

---

# 20. Publish Workflow

Preferred staff workflow:

```text
Admin loads effective state
      ↓
Staff edits today's variable information
      ↓
Staff reviews changes
      ↓
Publish
      ↓
Atomic write / batch
      ↓
Authoring data updated
      +
public/today updated
      +
audit entry created
```

Do not show Publish success unless all required writes succeed.

---

# 21. Audit History

Every production publish should record:

```text
updatedAt
updatedBy
businessDate
revisionId
```

Recommended audit collection:

```text
publishHistory/
```

Example:

```json
{
  "businessDate": "2026-09-07",
  "revisionId": "2026-09-07T14:42:18Z",
  "publishedAt": "server timestamp",
  "publishedBy": "uid",
  "snapshot": {
    "...": "previous public state"
  }
}
```

MVP does not require enterprise audit tooling.

It does require enough history to answer:

- who changed it;
- when;
- what was previously published.

---

# 22. Undo

The admin should include:

```text
Undo Last Publish
```

Possible implementation:

1. Load previous `publishHistory` snapshot.
2. Show a confirmation dialog.
3. Republish that snapshot as a new revision.
4. Never silently mutate history.

This is safer than directly deleting audit history.

---

# 23. Staff Dashboard

The default screen should focus on what might need human attention today.

Example:

```text
CURTIS ORCHARD STAFF

Monday, September 7

NORMAL OPERATIONS
Most scheduled activities are calculated automatically.

NEEDS CONFIRMATION

U-PICK APPLES
Fuji
[ Available ] [ Limited ] [ Sold Out ]

Golden Delicious
[ Available ] [ Limited ] [ Sold Out ]

WEATHER / EXCEPTIONS

Jumping Pillow
Expected: OPEN
[ Keep Open ] [ Close Today ]

Wagon Rides
Expected: OPEN
[ Keep Open ] [ Close Today ]

TODAY'S NOTICE
[                                       ]

                [ REVIEW & PUBLISH ]
```

The key improvement is:

> The system presents expected operations and asks staff only for exceptions.

---

# 24. Map Data and Editing

The visitor map may store hotspot coordinates as percentages internally.

Example:

```json
{
  "locationId": "corn-maze",
  "x": 64,
  "y": 49
}
```

However:

> **MVP staff must not be required to type x/y coordinates.**

Two acceptable approaches:

## MVP

Map geometry is developer-maintained static content.

This is reasonable because the physical farm layout changes infrequently.

## Future

Build a map editor:

```text
Open admin map
    ↓
Select location
    ↓
Tap map position
    ↓
Save
```

The system calculates x/y automatically.

---

# 25. Accessibility Data

Do not model accessibility as:

```json
{
  "accessible": true
}
```

Use more informative structured notes.

MVP example:

```ts
type MobilityDifficulty =
  | "easy"
  | "moderate"
  | "difficult";
```

Example:

```json
{
  "mobilityDifficulty": "moderate",
  "surfaceType": "gravel_and_uneven_ground",
  "stepFree": true,
  "notes": "Some uneven ground and gravel in this area."
}
```

The public UI should:

- not rely only on color;
- provide text status labels;
- support semantic headings;
- use keyboard-accessible controls where relevant;
- aim for WCAG 2.2 AA practices.

---

# 26. Help and Phone Fallback

Operational information can change quickly.

The Visitor Companion should always provide a clear help path.

Example:

```text
Need help or want to confirm today's conditions?

[ Call Curtis Orchard ]
```

The production phone number should be confirmed directly with Curtis before launch.

Suggested supporting message:

> Conditions can change during the day. For the latest on-site information, please check posted signs or ask a Curtis Orchard team member.

The system should help visitors, not pretend software can eliminate operational uncertainty.

---

# 27. Offline and Weak-Network Behavior

Weak cellular coverage must be treated as normal.

Potentially cache:

- app shell;
- map;
- icons;
- static descriptions.

Time-sensitive data requires special handling.

If Firestore returns cached data, the UI must not present it as guaranteed live state.

Example:

```text
Offline
Last published 36 minutes ago
```

If current data cannot be refreshed:

```text
We could not refresh the latest operating information.
Showing the most recent published update.
```

Firestore cache metadata should be considered in the implementation.

---

# 28. Service Worker Safety

If PWA caching is enabled:

- version application assets;
- invalidate old caches after deployment;
- never cache Admin API behavior in a way that hides a new version;
- keep production update behavior testable.

Admin users must not remain stuck on an old interface after a deployment.

PWA features should be added only after core online behavior is stable.

---

# 29. Image Strategy

MVP should not require staff image upload.

Recommended:

```text
public/images/
```

Images are developer-managed and deployed with the frontend.

Reasons:

- activity hero images change rarely;
- simpler security;
- simpler cost model;
- avoids introducing storage management into staff workflow.

If staff image upload becomes a real requirement later, it should be deliberately designed as a Phase 2 feature with current storage pricing and billing reviewed at that time.

---

# 30. Realtime Strategy

Do not place realtime listeners on every catalog document.

Recommended:

| Data | Strategy |
|---|---|
| `public/today` | Realtime listener |
| Static map/catalog | Initial fetch or build-time/static |
| Existing website links | Static |
| Admin state | Fetch + subscribe only where useful |
| Audit history | Query on demand |

Typical visitor flow:

```text
Visitor opens Today
      ↓
read public/today
      ↓
subscribe to public/today
      ↓
staff republishes
      ↓
one updated snapshot
      ↓
visitor UI updates
```

This is much simpler than watching every apple and activity individually.

---

# 31. Authentication

Visitors:

```text
No login
```

Staff:

```text
Email + password
```

No public signup.

Production staff accounts should be explicitly authorized.

---

# 32. Authorization

A valid Firebase Auth session alone must not imply write access.

Recommended:

```text
staffUsers/{uid}
```

Example:

```json
{
  "role": "editor",
  "active": true
}
```

Security rules must prevent:

- anonymous writes;
- staff self-promotion;
- reading private staff data from public pages;
- writing unexpected fields;
- invalid enum values where feasible.

---

# 33. Security Must Be Built With the Schema

Security is not a final hardening step.

For each new collection:

```text
Define schema
   ↓
Define Firestore rules
   ↓
Write emulator allow/deny tests
   ↓
Build UI
```

Minimum automated rule tests:

- visitor can read published public content;
- visitor cannot write;
- visitor cannot read staffUsers;
- unauthorized authenticated user cannot write;
- authorized active staff can write allowed operational fields;
- editor cannot modify their own role;
- invalid writes are rejected.

Security-rule tests are part of Definition of Done.

---

# 34. Analytics Is Part of the Pilot

Analytics is not only a future optimization.

The project needs evidence that visitors actually use the product.

Minimum pilot events:

```text
landing_view
today_view
map_open
help_call_click
```

Optional:

```text
qr_location
```

if different QR signs use distinct campaign parameters.

Do not collect unnecessary personal data.

---

# 35. QR Pilot Design

The first live pilot should test distribution, not just software.

Potential locations to confirm with Curtis:

- parking / entrance;
- Country Store;
- checkout;
- activity signage;
- printed handout.

Each QR sign should include:

```text
Scan for today's apples, activity status, and farm map
```

and:

```text
visit.curtisorchard.com
```

under the QR.

Different placements may use harmless campaign parameters, for example:

```text
?src=entrance
?src=store
```

This helps determine which physical placement works.

---

# 36. Pilot Success Metrics

The pilot should answer:

1. Do visitors scan?
2. Which QR location performs best?
3. Do visitors open Today or Map?
4. Does staff actually publish daily?
5. How long does the update workflow take?
6. Does the system reduce repeated visitor questions?
7. Are stale states occurring?
8. Are visitors confused by any labels?
9. Does cellular performance remain acceptable?
10. Is the current website duplication problem manageable?

A semester project should produce evidence, not only screenshots.

---

# 37. Revised Development Timeline

The schedule prioritizes live seasonal validation.

---

## Week 1: Discovery + ownership dependencies

Do immediately:

- stakeholder interview;
- existing CMS workflow mapping;
- data ownership decisions;
- contact current website maintainer if appropriate;
- request Curtis-controlled Google account;
- request DNS coordination;
- decide pilot QR locations;
- define success metrics.

Technical setup can happen in parallel:

- repo;
- React/Vite;
- Firebase project;
- Cloudflare Pages preview.

---

## Week 2: Today MVP

Build:

- mobile shell;
- Today page;
- `public/today` mock snapshot;
- Admin login;
- simple daily editor;
- business-date helper using `America/Chicago`.

---

## Week 3: End-to-end operational slice

Implement:

```text
normal rule
+
today override
+
apple availability
+
Publish
+
public/today
+
audit entry
```

Acceptance test:

```text
Admin:
Jumping Pillow
OPEN -> CLOSED TODAY

        ↓

Publish

        ↓

Visitor:
Jumping Pillow
CLOSED TODAY
Updated 1 minute ago
```

Security rules and emulator tests must already exist.

---

## Week 4: Live pilot

Deploy:

```text
visit.curtisorchard.com
```

Pilot can be intentionally small.

Minimum live product:

- Today;
- Map beta;
- Call for Help;
- Admin daily publish.

Place limited QR signs with Curtis approval.

Start analytics.

---

## Week 5: Iterate from real feedback

Focus on:

- staff update friction;
- confusing statuses;
- stale-data cases;
- mobile readability;
- QR placement;
- real network behavior.

Do not add new features until pilot issues are understood.

---

## Week 6: Map completion

Improve:

- map hotspots;
- activity detail;
- accessibility notes;
- filters if useful.

---

## Week 7: Existing-website integration improvements

Based on discovery:

- link or sync selected content;
- remove duplicated information;
- document ownership per data type.

---

## Week 8: Phase 1.5 features

Choose based on evidence:

- event card;
- simple Explore;
- curated route cards;
- content editing improvements.

Do not automatically build all of them.

---

## Week 9: Reliability and handoff

Focus on:

- offline behavior;
- stale-state handling;
- undo;
- audit history;
- security tests;
- deployment documentation;
- staff guide.

---

## Week 10: Final evaluation

Deliver:

- production build;
- analytics summary;
- staff usability findings;
- architecture;
- known limitations;
- handoff package;
- Phase 2 recommendations.

---

# 38. Plan My Visit Is No Longer MVP

The original three-step recommendation feature is moved to Phase 2.

Reason:

A scoring system can identify attractive activities, but a time-stamped itinerary also requires:

- opening windows;
- duration;
- walking time;
- route order;
- ticket requirements;
- age constraints;
- weather constraints.

That is a different optimization problem.

A lower-risk Phase 2 solution is to begin with curated routes.

Examples:

```text
First-Time Family
~2 hours

Young Kids
~1 hour

Easy Walking
~1.5 hours

Rainy Day
~1 hour
```

These can be reviewed by Curtis staff before publication.

Only after real use should algorithmic itinerary generation be considered.

---

# 39. Existing Website Links as a Feature, Not a Failure

The MVP does not need to duplicate every mature website page.

Examples:

```text
View full event calendar
      ↓
existing Curtis event page

Full pricing and policies
      ↓
existing Curtis website

Party reservations
      ↓
existing Curtis website
```

This keeps scope small and reduces content duplication.

---

# 40. Cost Model

The architecture is designed for very low operating cost.

Likely cost components:

```text
Cloudflare Pages
Firebase Firestore
Firebase Authentication
Domain/subdomain
Analytics
```

The exact recurring cost depends on:

- traffic;
- current Firebase pricing;
- current Cloudflare pricing;
- future storage features;
- whether paid backup or additional Firebase services are enabled.

Do not market the production system as "guaranteed $0 forever."

Recommended stakeholder wording:

> **The MVP is designed to operate at very low infrastructure cost and without a dedicated server. We will monitor actual pilot usage and confirm current vendor pricing before production handoff.**

---

# 41. Billing Safety

If a paid Firebase billing plan becomes necessary later:

- enable billing alerts;
- define an internal expected monthly ceiling;
- document which feature required billing;
- keep usage dashboards visible to the project owner;
- avoid unbounded third-party API calls.

Budget alerts are operational warnings, not a guaranteed hard spending cap.

---

# 42. Backup and Recovery

Do not promise an automated backup system unless one is actually configured.

MVP recovery layers:

1. Git history for code and static content.
2. `publishHistory` snapshots for recent operational rollback.
3. `Undo Last Publish`.
4. Documented admin recovery steps.

If Curtis requires formal Firestore backup retention, evaluate current paid backup/export options separately.

---

# 43. Ownership Must Start in Week 1

Do not postpone ownership planning until handoff.

The project should begin resolving:

- Curtis-controlled Google account;
- Firebase owner access;
- Cloudflare owner access;
- DNS administrator;
- GitHub repository ownership.

Desired final model:

```text
Curtis Orchard-controlled account
    ├── Firebase
    ├── Cloudflare
    └── DNS coordination

Project / organization repository
    └── GitHub
```

Student developers remain collaborators, not the only owners.

---

# 44. Recommended Repository Structure

```text
curtis-orchard-companion/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── map/
│       └── farm-map.svg
│
├── src/
│   ├── visitor/
│   │   ├── today/
│   │   ├── map/
│   │   └── help/
│   │
│   ├── admin/
│   │   ├── login/
│   │   ├── today/
│   │   ├── publish/
│   │   └── history/
│   │
│   ├── domain/
│   │   ├── schedules/
│   │   ├── effectiveStatus/
│   │   ├── businessDate/
│   │   └── publishSnapshot/
│   │
│   ├── firebase/
│   │   ├── config.ts
│   │   ├── auth.ts
│   │   └── firestore.ts
│   │
│   ├── components/
│   ├── hooks/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
│
├── tests/
│   ├── firestore-rules/
│   └── domain/
│
├── firestore.rules
├── firebase.json
├── package.json
├── README.md
└── .env.example
```

The `domain/` folder is important because schedule evaluation and business-date logic should not be scattered through UI components.

---

# 45. Domain Logic Requirements

The agent should implement pure, testable functions for:

```text
getBusinessDate()
evaluateSchedule()
applyDateException()
applyTodayOverride()
getEffectiveStatus()
buildPublicTodaySnapshot()
isOperationalDataStale()
```

These functions should be unit tested independently from React.

---

# 46. Example Effective Status Evaluation

Pseudo-flow:

```text
get business date in America/Chicago

        ↓

load normal schedule rules

        ↓

evaluate date range + weekday

        ↓

apply configured date exception

        ↓

apply today's explicit override

        ↓

return effective status
```

Example result:

```json
{
  "status": "closed",
  "source": "today_override",
  "reason": "Weather",
  "effectiveFrom": "2026-09-07T13:30:00-05:00"
}
```

This is much more expressive than a single boolean.

---

# 47. Staff Roles

MVP can remain simple.

Possible roles:

```text
editor
admin
```

Editor:

- edit operational data;
- publish;
- undo recent publish.

Admin:

- manage staff accounts;
- edit schedule rules;
- edit structural content.

Do not give every daily staff member access to structural configuration if it is not needed.

---

# 48. Staff Usability Requirements

The admin must work comfortably on a phone.

Target:

- login in seconds;
- no technical vocabulary;
- expected state shown before editing;
- exceptions highlighted;
- obvious Publish action;
- confirmation after success;
- visible error after failure;
- easy undo.

The admin should never use terms such as:

- Firestore document;
- collection;
- JSON;
- deployment;
- snapshot listener.

---

# 49. Public Status Vocabulary

Avoid ambiguous states.

Recommended activity states:

```text
open
closed
opens_later
temporarily_closed
not_scheduled_today
not_confirmed
```

Visitor wording should remain friendly.

Examples:

```text
OPEN
CLOSED TODAY
OPENS AT 12 PM
TEMPORARILY CLOSED
NOT SCHEDULED TODAY
STATUS NOT CONFIRMED
```

Do not rely only on red/green color.

---

# 50. Apple Status Vocabulary

Recommended:

```text
available
limited
sold_out
not_available
not_in_season
not_confirmed
```

Present U-Pick and Store separately.

Example:

```text
Honeycrisp

In Store
AVAILABLE

U-Pick
NOT AVAILABLE
```

---

# 51. Data Ownership Matrix

A production implementation should maintain a simple document such as:

| Data | Authority | Update Frequency | Maintainer | Visitor Companion Behavior |
|---|---|---:|---|---|
| General activity description | Existing website or approved static catalog | Rare | Website maintainer | Link or copy only if ownership agreed |
| U-Pick apple status | Operational system | Daily / intraday | Orchard operations | Display directly |
| Store apple status | Operational system | Daily / intraday | Store staff | Display directly |
| Normal ride schedule | Schedule rules | Seasonal | Admin | Calculate automatically |
| Weather closure | Today override | Intraday | Manager / authorized staff | Display immediately |
| Full event calendar | Existing website initially | Weekly | Existing maintainer | Link in MVP |
| Restroom location | Static map | Rare | Developer/admin | Display |
| Pricing | Existing website unless structured ownership agreed | Seasonal | Existing maintainer | Link in MVP |

This matrix is a required project artifact.

---

# 52. Avoiding the "Third Place to Update" Problem

Version 1.1 explicitly requires this design question to be resolved.

For every field shown in the Visitor Companion, one of the following must be true:

### A. This information exists only in the operational companion

Example:

```text
Today's weather closure
```

### B. This information is synchronized from an existing source

Example:

```text
Existing website event calendar
```

### C. The Visitor Companion links to the existing authoritative page instead of duplicating it

Example:

```text
Full pricing policy
```

### D. A deliberate future integration plan exists

No information should be duplicated merely because it is easy to copy into Firestore.

---

# 53. Graceful Degradation

If same-day information is stale or unavailable:

Do not silently show false certainty.

Possible UI:

```text
Today's operating status has not been refreshed recently.

[ Call Curtis Orchard ]
[ View Official Website ]
```

The system should degrade toward verified sources and human help, not toward guessed data.

---

# 54. Agent Development Priorities

An autonomous coding agent should follow this order.

1. Create project skeleton.
2. Add business-timezone utility.
3. Define TypeScript domain types.
4. Define Firestore schema.
5. Write Firestore security rules.
6. Write emulator security tests.
7. Implement pure schedule evaluation.
8. Implement effective-status logic.
9. Build Today page with mock `public/today`.
10. Add Auth.
11. Build Admin Daily Operations.
12. Implement Publish batch.
13. Implement `public/today` snapshot generation.
14. Add audit history.
15. Add Undo.
16. Deploy internal preview.
17. Add analytics.
18. Run pilot.
19. Build Map improvements.
20. Add further features only after pilot feedback.

---

# 55. Agent Engineering Constraints

## Keep the system boring

Prefer:

- small dependency list;
- clear TypeScript types;
- plain React;
- straightforward Firebase SDK usage;
- pure business-logic helpers;
- explicit error handling.

Avoid:

- unnecessary global state frameworks;
- microservices;
- Cloud Functions unless a real requirement justifies them;
- complex build systems;
- AI dependencies;
- map APIs for MVP;
- image upload for MVP.

---

## Security

Never:

- use open production Firestore rules;
- commit service account keys;
- expose privileged server credentials;
- trust UI-only authorization.

---

## Comments

Use short English comments only where logic is not obvious.

---

# 56. Definition of Done

## Discovery

- [ ] Current information workflow documented
- [ ] Website authority identified
- [ ] Operational update owner identified
- [ ] Backup staff owner identified
- [ ] DNS contact identified
- [ ] Curtis-owned platform accounts started
- [ ] Data ownership matrix approved

## Visitor MVP

- [ ] QR opens permanent Curtis subdomain
- [ ] Today loads published operational snapshot
- [ ] Store and U-Pick apples are distinct
- [ ] Rule-driven activity status works
- [ ] Same-day overrides work
- [ ] Last published time shown
- [ ] Stale/offline state shown clearly
- [ ] Interactive map works on phone
- [ ] Help / Call path always available
- [ ] No visitor login

## Staff MVP

- [ ] Staff login works
- [ ] Unauthorized users cannot edit
- [ ] Expected schedule is visible
- [ ] Staff can edit daily-variable apple status
- [ ] Staff can create same-day activity override
- [ ] Staff can publish announcement
- [ ] Publish is atomic from the user's perspective
- [ ] Published-by and published-at recorded
- [ ] Undo previous publish works
- [ ] Staff can complete common workflow on phone

## Security

- [ ] Firestore rules exist for every production collection
- [ ] Rule emulator tests exist
- [ ] Public user cannot read staff data
- [ ] Public user cannot write
- [ ] Unauthorized authenticated user cannot write
- [ ] Staff cannot self-promote privileges
- [ ] Invalid state values are rejected where feasible

## Pilot

- [ ] Live deployment occurs during active season if feasible
- [ ] Analytics records landing and primary actions
- [ ] QR placement is tested
- [ ] Staff update time is measured
- [ ] Real visitor feedback is collected
- [ ] Cellular performance is tested on-site

## Handoff

- [ ] Curtis has owner-level access
- [ ] GitHub documented
- [ ] DNS documented
- [ ] Staff guide delivered
- [ ] Developer README delivered
- [ ] Cost assumptions documented
- [ ] Recovery / undo process documented
- [ ] Known limitations documented

---

# 57. Immediate Next Step

Before asking an agent to build the complete product, complete two things.

## Step 1: Operational interview

Use the discovery checklist in Section 3.

## Step 2: Small technical vertical slice

After the workflow is understood, build:

```text
Normal schedule says:
Jumping Pillow = OPEN

Staff Admin:
Close Today
Reason: Weather

        ↓

Publish

        ↓

public/today

        ↓

Visitor Today:
Jumping Pillow
CLOSED TODAY
Weather
Updated 1 minute ago
```

This single slice validates:

- schedule rules;
- overrides;
- Auth;
- Firestore;
- publish snapshot;
- audit history;
- public rendering;
- realtime update;
- staff workflow.

If that workflow is easy for Curtis staff, the architecture is on the right path.

---

# 58. Final Recommendation

React + Firebase remains a strong technical foundation.

The revised architecture is:

```text
Existing Curtis Website / CMS
           │
           │ understand ownership first
           ▼
   Static / Seasonal Rules
           │
           ▼
   Same-Day Operational Data
           │
           ▼
      Cloud Firestore
       Authoring Source
           │
           ▼
     Publish Snapshot
       public/today
           │
           ▼
   React Visitor Companion
           │
           ▼
    Cloudflare Pages
           │
           ▼
visit.curtisorchard.com
```

The staff workflow is:

```text
Known schedule calculated automatically
            +
Staff enters only today's exceptions
            ↓
          Publish
            ↓
Visitors receive one coherent current snapshot
```

The primary measure of success is not the number of features.

It is whether Curtis Orchard can continue using the system after the student development team leaves.

The most important product rule remains:

> **The visitor interface may be sophisticated, but the staff maintenance workflow must stay extremely simple.**

Version 1.1 adds an equally important second rule:

> **Do not create a third place that Curtis staff must remember to update.**
