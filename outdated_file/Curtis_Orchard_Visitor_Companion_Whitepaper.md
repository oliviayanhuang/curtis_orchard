# Curtis Orchard Visitor Companion
## Technical Whitepaper and Implementation Specification

**Proposed stack:** React + Vite + TypeScript + Tailwind CSS + Firebase  
**Primary delivery format:** Mobile-first web application / PWA  
**Primary access method:** QR code  
**Target production URL:** `https://visit.curtisorchard.com`  
**Target infrastructure cost:** Approximately $0/month under expected small-business usage, subject to Firebase pricing and traffic  
**Primary design goal:** Extremely low-maintenance operation for non-technical farm staff

---

## 1. Executive Summary

The Curtis Orchard Visitor Companion is a mobile-first web application designed for guests who are already at Curtis Orchard or are about to visit.

Visitors scan a QR code and immediately open a phone-optimized website. No App Store download, account creation, or installation is required.

The system has two distinct interfaces:

1. **Visitor interface**
   - Today
   - Map
   - Explore
   - Plan My Visit
   - Events

2. **Staff interface**
   - Simple login
   - Apple availability
   - Activity open / closed status
   - Hours
   - Announcements
   - Events
   - Last-updated status

The recommended architecture uses React for the frontend and Firebase for backend services, hosting, authentication, and data storage.

The guiding principle is:

> **Staff should never need to understand Firebase, databases, code, Git, deployment, or server administration. They should only need to open a webpage, log in, change a few simple fields, and press Save.**

The system should be designed to remain useful after the student development team leaves.

---

# 2. Product Vision

The Visitor Companion should answer a visitor's most common on-site questions:

- What is open today?
- Which apples are available today?
- Where is the corn maze?
- Where are the restrooms?
- What activities are available?
- What events are happening?
- What can my family do in the next one or two hours?
- Where should we go next?

The product should not attempt to replace the existing Curtis Orchard website.

Instead, it should complement the existing website by focusing on the **on-site visitor experience**.

---

# 3. Core Product Principles

## 3.1 Mobile first

The application is primarily used on smartphones.

Design and engineering should prioritize:

- 375 px and wider mobile screens
- iPhone Safari
- Android Chrome
- One-handed use
- Outdoor visibility
- Large touch targets
- Fast loading
- Weak cellular connections

Desktop support is useful, but secondary.

---

## 3.2 QR first

The primary entry point is a permanent QR code.

Example:

```text
Physical sign
    ↓
Scan QR
    ↓
visit.curtisorchard.com
    ↓
Visitor Companion
```

The QR code must point to a permanent Curtis Orchard-controlled subdomain.

Recommended:

```text
https://visit.curtisorchard.com
```

Do not encode a temporary Firebase deployment URL directly into printed QR codes.

This allows the hosting provider to be changed later without replacing physical signs.

---

## 3.3 No visitor login

Visitors should not need to create an account.

Visitor flow:

```text
Scan
  ↓
Open
  ↓
Use
```

Avoid:

```text
Scan
  ↓
Create account
  ↓
Verify email
  ↓
Login
  ↓
Use
```

Visitor authentication adds friction without providing enough MVP value.

---

## 3.4 Single source of truth

Operational information should live in one central data source.

For example:

```text
Corn Maze status = Closed
```

That same value should appear consistently in:

- Today
- Explore
- Map
- Plan My Visit

Do not store separate copies of the same operational status in multiple pages.

---

## 3.5 Non-technical maintenance

Farm staff should not directly edit:

- Firestore documents
- JSON
- GitHub
- React files
- Firebase Console
- security rules
- deployment configuration

The staff experience should be a custom admin page built specifically for Curtis Orchard.

---

# 4. Recommended Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend framework | React | Visitor and staff interfaces |
| Build tool | Vite | Simple and fast React build workflow |
| Language | TypeScript | Safer long-term maintenance |
| UI styling | Tailwind CSS | Responsive mobile-first styling |
| Routing | React Router | Visitor and admin routes |
| Database | Cloud Firestore | Operational data and content |
| Authentication | Firebase Authentication | Staff login |
| Hosting | Firebase Hosting | Web hosting, CDN, HTTPS |
| Realtime updates | Firestore listeners | Immediate operational updates |
| Static map | SVG or optimized image | Interactive farm map |
| PWA support | Web manifest + service worker | Add-to-home-screen and caching |
| Source control | GitHub | Developer handoff and version history |

---

# 5. Why React

React is appropriate because the visitor experience is highly interactive and app-like.

The proposed design includes:

- Bottom navigation
- Dynamic activity status
- Interactive map hotspots
- Filterable Explore content
- Multi-step Plan My Visit flow
- Event filtering
- Realtime operational updates
- Staff dashboard

React provides enough flexibility to build these features without requiring a native mobile application.

---

# 6. Why Vite Instead of Next.js

Next.js is powerful, but the project does not require most of its advanced server-side capabilities.

The Visitor Companion does not initially require:

- Server-side rendering
- Complex SEO infrastructure
- Server Components
- Server-side API routes
- Large authenticated user systems

Vite keeps the project simpler.

Recommended build flow:

```text
React source
   ↓
Vite build
   ↓
Static production files
   ↓
Firebase Hosting
```

This reduces infrastructure complexity and makes future maintenance easier.

---

# 7. Why Firebase

Firebase is recommended because it provides most backend needs without requiring a traditional server.

The MVP can use:

- Cloud Firestore
- Firebase Authentication
- Firebase Hosting

No dedicated backend server is required.

This eliminates the need to maintain:

- Linux server
- Node backend
- Express
- AWS EC2
- Docker containers
- Nginx
- SQL server
- server patching
- SSL certificate renewal

For a small seasonal business, this is a major operational advantage.

---

# 8. High-Level System Architecture

```text
                         Curtis Orchard Staff
                                  │
                                  ▼
                    /admin Staff Dashboard
                                  │
                                  ▼
                    Firebase Authentication
                                  │
                                  ▼
                         Cloud Firestore
                         Central Data Store
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
           Today                 Map                 Explore
             │                    │                    │
             └────────────┬───────┴────────────┬───────┘
                          ▼                    ▼
                    Plan My Visit           Events
                          │
                          ▼
                   React Visitor App
                          │
                          ▼
                   Firebase Hosting
                          │
                          ▼
              visit.curtisorchard.com
```

---

# 9. Visitor Information Architecture

The visitor application should contain five primary sections.

## 9.1 Today

Purpose:

> Show the most important current operational information immediately.

Suggested content:

- Today's hours
- Apples available today
- Activities open today
- Today's events
- Weather or operational announcement
- Last updated time

Example:

```text
Today at Curtis Orchard
Sunday, September 20

Hours
9:00 AM - 6:00 PM

Apples Available Today
Honeycrisp
Gala
Crimson Crisp

Activities
Corn Maze       OPEN
Pumpkin Patch   OPEN
Pony Rides      12 PM - 4 PM
Wagon Rides     CLOSED

Today's Event
Apple Tasting Lab
3:00 PM

Notice
Wagon rides are closed due to rain.
```

---

## 9.2 Map

Purpose:

> Help visitors understand where things are.

MVP map features:

- Farm map image or SVG
- Clickable location hotspots
- Category filters
- Location details
- Accessibility information
- Approximate walking time

Example hotspots:

- Apple Orchard
- Pumpkin Patch
- Goats
- Corn Maze
- Country Store
- Cafe
- Restrooms
- Parking
- Pony Rides
- Kids activities

The MVP should not require Google Maps or Mapbox.

---

## 9.3 Explore

Purpose:

> Help visitors discover activities, food, shopping, and attractions.

Suggested categories:

- Apple Picking
- Animals
- Kids Activities
- Food & Drinks
- Shopping

Each item may contain:

- Name
- Image
- Description
- Open / closed status
- Hours
- Price
- Location
- Accessibility
- Recommended age
- Estimated duration

---

## 9.4 Plan My Visit

Purpose:

> Generate a simple recommended itinerary.

MVP should be rule-based, not AI-based.

Inputs:

### Visitor type

- Toddlers
- Young children
- Teenagers
- Adults
- Older adults

### Time available

- 1 hour
- 2 hours
- Half day
- Full day

### Interests

- Apple picking
- Animals
- Kids activities
- Food
- Shopping
- Photos
- Farm education

Example output:

```text
Your 2-Hour Orchard Visit

1:00 PM   Apple Picking
1:40 PM   Feed the Goats
2:00 PM   Corn Maze
2:35 PM   Apple Donuts
2:50 PM   Country Store
```

A simple scoring model is sufficient.

Example:

```text
Matching visitor type     +3
Matching interest         +3
Currently open            +2
Fits available time       +2
Nearby activity           +1
```

No external AI API should be required for MVP.

---

## 9.5 Events

Suggested views:

- Today
- This Week
- Upcoming

Event data:

- Title
- Date
- Start time
- End time
- Location
- Description
- Active status

Optional MVP feature:

- Save event locally with browser localStorage

Visitor accounts are not required.

---

# 10. Staff Dashboard

The staff dashboard is a core product feature, not a secondary developer tool.

Recommended URL:

```text
https://visit.curtisorchard.com/admin
```

The dashboard should be mobile friendly so staff can update information from a phone.

---

## 10.1 Daily Operations Screen

The default staff screen should be very simple.

Example:

```text
CURTIS ORCHARD STAFF

Today's Operations

APPLES

Honeycrisp
[ Available ] [ Unavailable ]

Gala
[ Available ] [ Unavailable ]

Fuji
[ Available ] [ Unavailable ]


ACTIVITIES

Corn Maze
[ OPEN ] [ CLOSED ]

Pony Rides
[ OPEN ] [ CLOSED ]

Hours
[ 12:00 PM ] to [ 4:00 PM ]


TODAY'S NOTICE

[ Wagon rides are closed due to rain. ]


            [ SAVE CHANGES ]
```

The staff member should not see Firestore concepts.

---

## 10.2 Separate quick updates from content editing

Two levels of administration are recommended.

### Quick Daily Update

Used every day.

```text
/admin/today
```

Contains:

- apple availability
- open / closed activity status
- hours
- announcements

### Content Management

Used occasionally.

```text
/admin/content
```

Contains:

- activity descriptions
- prices
- images
- map locations
- event creation
- accessibility information

This reduces staff confusion.

---

# 11. Proposed Firestore Data Model

Firestore is document-based.

The schema should remain intentionally small and understandable.

---

## 11.1 `activities`

Example document:

```json
{
  "name": "Corn Maze",
  "category": "kids_activity",
  "status": "open",
  "openTime": "09:00",
  "closeTime": "17:00",
  "locationId": "corn-maze",
  "price": null,
  "description": "Explore the Curtis Orchard corn maze.",
  "recommendedFor": [
    "young_children",
    "teenagers",
    "adults"
  ],
  "durationMinutes": 30,
  "lastUpdated": "server timestamp",
  "statusDate": "2026-09-07"
}
```

Example IDs:

```text
activities/
    corn-maze
    pony-rides
    wagon-rides
    pumpkin-patch
```

---

## 11.2 `apples`

Example:

```json
{
  "name": "Honeycrisp",
  "available": true,
  "location": "Orchard A",
  "displayOrder": 1,
  "lastUpdated": "server timestamp",
  "statusDate": "2026-09-07"
}
```

Example IDs:

```text
apples/
    honeycrisp
    gala
    fuji
    crimson-crisp
```

---

## 11.3 `events`

Example:

```json
{
  "title": "Apple Tasting Lab",
  "date": "2026-09-20",
  "startTime": "15:00",
  "endTime": "16:00",
  "location": "Main Barn",
  "description": "Guided tasting of seasonal apple varieties.",
  "active": true
}
```

---

## 11.4 `announcements`

Example:

```json
{
  "message": "Wagon rides are closed today due to rain.",
  "priority": "high",
  "active": true,
  "createdAt": "server timestamp",
  "expiresAt": "optional timestamp"
}
```

---

## 11.5 `locations`

Example:

```json
{
  "name": "Corn Maze",
  "category": "activity",
  "x": 62,
  "y": 47,
  "accessible": true,
  "walkingTimeFromStoreMinutes": 4
}
```

`x` and `y` are percentages relative to the farm map.

Example:

```text
x = 62%
y = 47%
```

This allows a responsive interactive map without requiring a mapping API.

---

## 11.6 `settings`

Possible global settings:

```text
settings/today
settings/site
```

Example:

```json
{
  "openTime": "09:00",
  "closeTime": "18:00",
  "lastConfirmedDate": "2026-09-07",
  "lastUpdated": "server timestamp"
}
```

---

# 12. Realtime Update Strategy

Not all data needs realtime listeners.

Recommended approach:

| Page | Strategy |
|---|---|
| Today | Realtime listener |
| Map | Initial fetch |
| Explore | Initial fetch |
| Plan My Visit | Local data after initial fetch |
| Events | Query on load |
| Admin | Realtime or refresh after save |

Example realtime behavior:

```text
Staff changes:
Corn Maze
OPEN -> CLOSED

        ↓

Firestore update

        ↓

Visitor Today page

Corn Maze
CLOSED
```

The visitor should not need to manually refresh the Today page.

Avoid maintaining unnecessary realtime listeners for every document across every page, because Firestore listeners generate reads.

---

# 13. Daily Reset Without Scheduled Server Jobs

Daily operational information can become dangerous if yesterday's status remains visible.

Example problem:

```text
Sunday:
Pony Rides = OPEN

Monday:
Staff forgets to update

Visitor sees:
Pony Rides = OPEN
```

The MVP should avoid scheduled Cloud Functions if possible.

Instead, save a `statusDate`.

Example:

```json
{
  "status": "open",
  "statusDate": "2026-09-06"
}
```

If today is:

```text
2026-09-07
```

the application interprets the status as stale.

Visitor display:

```text
Pony Rides
Not confirmed today
```

Admin display:

```text
Pony Rides
Needs confirmation
```

This creates a daily reset behavior without:

- cron jobs
- Cloud Functions
- servers
- additional billing complexity

---

# 14. Last Updated Strategy

Every operational update should use a server-generated timestamp.

Example:

```text
Apple Availability
Updated 18 minutes ago
```

If data is old:

```text
Apple Availability
Not confirmed today
```

This improves visitor trust and helps staff identify stale information.

---

# 15. Authentication and Authorization

Visitors:

```text
No login
Read-only access
```

Staff:

```text
Email + password
Authenticated access
Authorized write access
```

Public signup should be disabled.

Only designated Curtis Orchard staff accounts should receive write permissions.

---

# 16. Firestore Security Model

Security must not rely only on the user interface.

The backend rules must enforce:

```text
Visitor
READ     allowed for public visitor data
WRITE    denied

Authorized Staff
READ     allowed
WRITE    allowed
```

Recommended authorization options:

### Option A: staff user collection

```text
staffUsers/{uid}
```

The application checks whether the authenticated Firebase UID exists in the authorized staff collection.

### Option B: custom claims

More scalable, but slightly more complex.

For MVP, a simple staff-user allowlist is sufficient.

---

# 17. Interactive Map Implementation

The MVP map should use an SVG or optimized farm-map image.

Example structure:

```text
Farm map image
+
absolutely positioned React hotspots
```

Example:

```text
Apple Orchard
x = 31%
y = 28%

Corn Maze
x = 64%
y = 49%

Cafe
x = 82%
y = 70%
```

Benefits:

- No Google Maps API
- No Mapbox API
- No per-request map billing
- Better visual representation of the farm
- Works for paths that may not exist in public map providers
- Easier branding

---

# 18. Walking Directions

MVP should use approximate walking times, not GPS routing.

Example:

```text
Corn Maze
Approx. 4-minute walk from Country Store
```

Do not initially implement:

- turn-by-turn GPS
- live position
- route optimization
- background location tracking

These features can be explored later.

---

# 19. Progressive Web App Strategy

The product should initially behave like a normal website.

Later, PWA support can add:

- Add to Home Screen
- app icon
- standalone display mode
- cached static assets
- offline map
- offline activity descriptions

The application should remain fully usable without installation.

---

# 20. Weak-Network Support

Curtis Orchard is an outdoor property, so cellular coverage may be inconsistent.

Static resources should be cached where practical:

- application shell
- icons
- farm map
- static descriptions
- basic navigation

Dynamic information should attempt to refresh:

- today's operational status
- announcements
- current event information

If the latest data cannot be fetched, the application should avoid pretending old information is current.

Suggested UI:

```text
Last updated 24 minutes ago
```

or:

```text
Current status could not be refreshed.
Showing the latest available information.
```

---

# 21. Image Optimization

Large images should not be shipped directly from phone cameras.

Recommended:

```text
WebP
approximately 100 KB to 300 KB for content cards
```

Avoid:

```text
5 MB JPEG
```

Farm map:

```text
SVG preferred
```

This reduces:

- load time
- Firebase Hosting bandwidth
- cellular usage
- perceived latency

---

# 22. Recommended Repository Structure

```text
curtis-orchard-companion/
│
├── public/
│   ├── icons/
│   ├── images/
│   ├── map/
│   │   └── farm-map.svg
│   ├── manifest.json
│   └── favicon.ico
│
├── src/
│   │
│   ├── visitor/
│   │   ├── today/
│   │   │   └── TodayPage.tsx
│   │   ├── map/
│   │   │   └── MapPage.tsx
│   │   ├── explore/
│   │   │   └── ExplorePage.tsx
│   │   ├── plan/
│   │   │   └── PlanPage.tsx
│   │   └── events/
│   │       └── EventsPage.tsx
│   │
│   ├── admin/
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── ApplesEditor.tsx
│   │   ├── ActivitiesEditor.tsx
│   │   ├── EventsEditor.tsx
│   │   └── AnnouncementEditor.tsx
│   │
│   ├── components/
│   │   ├── BottomNav.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── ActivityCard.tsx
│   │   ├── ErrorState.tsx
│   │   └── LoadingState.tsx
│   │
│   ├── firebase/
│   │   ├── config.ts
│   │   ├── firestore.ts
│   │   └── auth.ts
│   │
│   ├── hooks/
│   │   ├── useActivities.ts
│   │   ├── useApples.ts
│   │   └── useEvents.ts
│   │
│   ├── types/
│   │   ├── activity.ts
│   │   ├── apple.ts
│   │   ├── event.ts
│   │   └── location.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── firestore.rules
├── firebase.json
├── package.json
├── README.md
└── .env.example
```

---

# 23. Environment Variables

Firebase frontend configuration should be stored using Vite environment variables.

Example:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Important:

Firebase web client configuration is not treated like a private server secret.

However, security must be enforced through:

- Firestore Security Rules
- authentication
- authorization

Do not place private server credentials or service account keys in the browser.

---

# 24. macOS Development Environment

Recommended developer tools:

- Homebrew
- Git
- Node.js LTS
- `fnm`
- pnpm
- VS Code
- Firebase CLI
- GitHub

---

## 24.1 Install basic tools

```bash
brew install git
brew install fnm
```

Install Node LTS:

```bash
fnm install --lts
fnm use --lts
```

Verify:

```bash
node -v
npm -v
git --version
```

---

## 24.2 Enable pnpm

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

Verify:

```bash
pnpm -v
```

---

## 24.3 Create the React application

```bash
pnpm create vite curtis-orchard-companion
```

Select:

```text
React
TypeScript
```

Then:

```bash
cd curtis-orchard-companion
pnpm install
```

---

## 24.4 Install dependencies

```bash
pnpm add react-router-dom
pnpm add firebase
```

Add Tailwind using the current official Vite integration.

---

## 24.5 Install Firebase CLI

```bash
npm install -g firebase-tools
```

Login:

```bash
firebase login
```

Initialize:

```bash
firebase init
```

Select:

```text
Firestore
Hosting
```

Production build directory:

```text
dist
```

Configure as a single-page app:

```text
Yes
```

---

# 25. Local Development

Start development server:

```bash
pnpm dev
```

Default URL:

```text
http://localhost:5173
```

For testing on a phone connected to the same Wi-Fi:

```bash
pnpm dev --host
```

Find the Mac's local IP:

```bash
ipconfig getifaddr en0
```

Example:

```text
192.168.1.43
```

Open on phone:

```text
http://192.168.1.43:5173
```

This is strongly recommended because desktop responsive mode is not a substitute for testing on a real phone.

---

# 26. Development Strategy: Build a Vertical Slice First

Do not build all five visitor pages before integrating Firebase.

The first end-to-end milestone should be:

```text
Staff Dashboard

Corn Maze
OPEN -> CLOSED

      ↓

Firestore

      ↓

Visitor Today

Corn Maze
CLOSED
```

This validates the core architecture.

Once this works, the highest-risk system behavior is proven.

---

# 27. Recommended Implementation Milestones

## Milestone 0: Project setup

Deliverables:

- React + Vite + TypeScript project
- Tailwind configured
- React Router configured
- Firebase project connected
- GitHub repository created
- `/` route works
- `/admin` route works

---

## Milestone 1: Static visitor shell

Create:

- bottom navigation
- Today
- Map
- Explore
- Plan
- Events

Use hard-coded mock data.

Goal:

Reproduce the approved mobile wireframe style.

---

## Milestone 2: Firestore connection

Create initial collections:

```text
activities
apples
events
announcements
locations
settings
```

Replace mock data on Today page with Firestore data.

---

## Milestone 3: Staff authentication

Implement:

- staff login
- logout
- protected admin routes
- authorized staff check

No public signup.

---

## Milestone 4: Daily Operations Dashboard

Implement:

- apple availability
- activity open / closed
- operating hours
- announcement
- save changes
- last updated timestamps
- status date confirmation

This milestone is one of the most important parts of the project.

---

## Milestone 5: Realtime Today page

Use Firestore realtime listeners for operational data.

Acceptance test:

1. Staff opens Admin.
2. Staff changes Corn Maze from Open to Closed.
3. Visitor page updates without manual refresh.
4. Visitor sees updated timestamp.

---

## Milestone 6: Interactive farm map

Implement:

- responsive map
- hotspots
- location cards
- category filtering
- accessibility information
- approximate walking time

No GPS required.

---

## Milestone 7: Explore

Implement:

- categories
- activity cards
- activity details
- dynamic open / closed status
- hours
- location
- pricing if available

---

## Milestone 8: Plan My Visit

Implement:

- visitor type
- available time
- interests
- recommendation scoring
- itinerary output

No AI API.

---

## Milestone 9: Events

Implement:

- Today
- This Week
- Upcoming
- event detail
- local save / favorite

---

## Milestone 10: PWA and performance

Implement:

- web app manifest
- icons
- installability
- caching strategy
- optimized images
- loading states
- error states
- weak-network handling

---

## Milestone 11: Production deployment

Deploy to Firebase Hosting.

Connect:

```text
visit.curtisorchard.com
```

Verify:

- HTTPS
- iPhone Safari
- Android Chrome
- QR scanning
- production Firestore rules
- staff authentication

---

## Milestone 12: Handoff

Deliver:

- production site
- staff accounts
- admin guide
- developer README
- GitHub repository
- Firebase ownership
- DNS ownership
- QR assets
- architecture documentation
- emergency recovery instructions

---

# 28. Suggested 10-Week Semester Schedule

| Week | Main Goal |
|---|---|
| 1 | Requirements, repo, React, Firebase setup |
| 2 | Static Today + navigation |
| 3 | Firestore data model and connection |
| 4 | Admin login and Daily Operations dashboard |
| 5 | Realtime updates and status confirmation |
| 6 | Interactive Map |
| 7 | Explore |
| 8 | Plan My Visit + Events |
| 9 | On-site mobile testing and PWA optimization |
| 10 | Production deployment and handoff |

---

# 29. Testing Strategy

Testing should include both technical tests and real-world usability tests.

---

## 29.1 Device testing

At minimum test:

- small iPhone
- regular iPhone
- large iPhone
- Pixel
- Samsung Galaxy

---

## 29.2 Browser testing

At minimum:

- Safari iOS
- Chrome Android
- Chrome desktop
- Safari macOS

---

## 29.3 Outdoor usability testing

Test at Curtis Orchard if possible.

Evaluate:

- readability in sunlight
- thumb reach
- touch target size
- loading over cellular
- map comprehension
- QR placement
- navigation while walking
- older-user readability

---

## 29.4 Recommended mobile UI constraints

Suggested minimum:

```text
Body text: 16 px or larger
Touch targets: approximately 44 x 44 px minimum
```

Avoid tiny gray labels that are difficult to read outdoors.

---

# 30. Failure and Edge Cases

The system should handle:

### Firestore unavailable

Show:

```text
We could not refresh the latest information.
Showing the most recent available data.
```

### No announcement

Hide the announcement card.

### Activity status stale

Show:

```text
Not confirmed today
```

### Image missing

Use a default placeholder.

### Event list empty

Show:

```text
No upcoming events currently listed.
```

### Admin save failure

Do not display a false success state.

Show a clear retry message.

---

# 31. Cost Strategy

The system is intentionally designed to avoid recurring infrastructure costs where possible.

Expected components:

```text
Firebase Hosting
Cloud Firestore
Firebase Authentication
Custom subdomain
HTTPS
Static map
Rule-based itinerary
```

Under expected small-business usage, the system may remain within Firebase's free usage allowances.

However:

> **Do not promise Curtis Orchard that the service will permanently cost exactly $0.**

Firebase pricing and traffic patterns can change.

Recommended wording:

> "The system is designed to operate within free-tier limits under expected usage, with no dedicated server maintenance. Actual costs should be monitored and Firebase pricing should be reviewed before production launch."

---

# 32. Avoidable Recurring Costs

The MVP should intentionally avoid:

- dedicated VPS
- AWS EC2
- RDS
- Google Maps API
- Mapbox API
- OpenAI API
- Anthropic API
- paid CMS
- native mobile app store deployment
- commercial push-notification platform

This keeps the operational footprint small.

---

# 33. Features Explicitly Out of Scope for MVP

Do not build these unless the core product is already complete:

- Native iOS app
- Native Android app
- Visitor accounts
- Payment processing
- Ticket checkout
- Square integration
- AI chatbot
- AI itinerary generation
- Push notifications
- Real-time parking availability
- Real-time queue lengths
- Turn-by-turn GPS navigation
- Employee management
- Inventory management
- Full website replacement

---

# 34. Analytics

Optional later addition:

- QR / landing page visits
- Today page usage
- Map usage
- Explore category clicks
- Plan My Visit completion
- Most viewed activities
- Event detail views

Analytics should be used to understand whether the Visitor Companion is actually helping guests.

Avoid collecting unnecessary personal information.

---

# 35. Data Ownership

Curtis Orchard should own the production system.

Production ownership should not remain under a student's personal accounts.

Recommended final ownership model:

```text
Curtis Orchard controlled Google account
    ├── Firebase project
    ├── Google Cloud project
    └── billing access if ever needed

Curtis Orchard / project organization
    └── GitHub repository

Curtis Orchard domain administrator
    └── visit.curtisorchard.com DNS
```

Student developers may remain collaborators, but Curtis Orchard should retain owner-level access.

---

# 36. Handoff Requirements

The development team should provide a short staff guide.

Example:

## Daily Update Guide

1. Open `visit.curtisorchard.com/admin`
2. Log in
3. Confirm today's apple availability
4. Confirm open / closed activities
5. Update hours if needed
6. Add a notice if needed
7. Press Save
8. Confirm the visitor Today page looks correct

The goal should be:

> **Daily update time: approximately 1 to 3 minutes.**

---

# 37. Developer README Requirements

The repository README should explain:

- local setup
- Node version
- package manager
- environment variables
- Firebase project structure
- Firestore collections
- security rules
- development commands
- production build
- deployment
- custom domain
- staff authorization
- backup process
- common troubleshooting

---

# 38. Recommended Development Commands

Development:

```bash
pnpm dev
```

Build:

```bash
pnpm build
```

Preview:

```bash
pnpm preview
```

Deploy:

```bash
firebase deploy
```

---

# 39. Definition of Done

The MVP is complete when all of the following work.

## Visitor

- [ ] QR code opens the site
- [ ] Mobile layout works correctly
- [ ] Today page loads current operational information
- [ ] Interactive Map works
- [ ] Explore works
- [ ] Plan My Visit generates an itinerary
- [ ] Events page works
- [ ] No visitor login required
- [ ] Weak-network states are handled
- [ ] Last-updated information is visible where appropriate

## Staff

- [ ] Staff can log in
- [ ] Unauthorized users cannot edit data
- [ ] Staff can change apple availability
- [ ] Staff can change activity status
- [ ] Staff can update hours
- [ ] Staff can publish announcements
- [ ] Staff can manage events
- [ ] Staff can confirm today's operational status
- [ ] Staff can use the dashboard on a phone
- [ ] Staff does not need Firebase Console for normal operation

## Infrastructure

- [ ] Firebase Hosting configured
- [ ] Firestore configured
- [ ] Firebase Authentication configured
- [ ] Firestore Security Rules configured
- [ ] Production domain configured
- [ ] HTTPS works
- [ ] GitHub repo documented
- [ ] Curtis Orchard has owner-level access

---

# 40. Agent Implementation Priorities

If an autonomous coding agent is used, it should follow this order:

1. Build the project skeleton.
2. Implement mobile navigation.
3. Implement Today with mock data.
4. Connect Firebase.
5. Build staff authentication.
6. Build Daily Operations dashboard.
7. Complete the OPEN/CLOSED realtime vertical slice.
8. Add remaining collections.
9. Build Map.
10. Build Explore.
11. Build Plan My Visit.
12. Build Events.
13. Add PWA features.
14. Add error and loading states.
15. Harden security rules.
16. Test production build.
17. Document handoff.

The agent should not prematurely add advanced infrastructure.

---

# 41. Agent Engineering Constraints

The coding agent should follow these implementation constraints.

## Keep the system simple

Prefer:

- direct React components
- clear TypeScript types
- simple hooks
- explicit Firestore queries
- minimal dependencies

Avoid:

- unnecessary state management libraries
- microservices
- complex backend abstraction
- over-engineered design patterns
- unnecessary Cloud Functions
- unnecessary third-party APIs

---

## Code style

Use:

- clear file names
- clear variable names
- short English comments
- explicit error handling
- straightforward control flow
- small reusable components where useful

Avoid clever abstractions that make handoff harder.

---

## Security

Never weaken Firestore rules to make development easier in production.

Never commit:

- Firebase service account JSON
- private keys
- privileged server credentials

---

# 42. Primary Product Success Metrics

The project should be judged by four outcomes.

## Visitor usability

Can a visitor scan and find useful information within seconds?

## Staff maintainability

Can non-technical staff update today's information in 1 to 3 minutes?

## Operational reliability

Does yesterday's information avoid appearing as if it is current?

## Long-term sustainability

Can Curtis Orchard continue operating the system after the student team leaves?

---

# 43. Final Recommended Production Architecture

```text
┌─────────────────────────────────────────────┐
│       Curtis Orchard Visitor Companion      │
│                                             │
│ React + Vite + TypeScript + Tailwind CSS    │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
                Firebase Hosting
                       │
             visit.curtisorchard.com
                       │
                       ▼
                 Cloud Firestore
               Single Source of Truth
                ↙                   ↘
       Visitor read access       Staff write access
                                      │
                                      ▼
                           Firebase Authentication
                                      │
                                      ▼
                              /admin dashboard
```

---

# 44. Final Recommendation

For this project, React + Firebase is a strong fit because it balances:

- modern mobile UX
- low infrastructure complexity
- low expected recurring cost
- no dedicated server maintenance
- realtime data updates
- easy staff authentication
- simple production hosting
- strong future extensibility

The most important implementation decision is not React versus Firebase.

It is this:

> **The visitor interface may be sophisticated, but the staff maintenance interface must remain extremely simple.**

The system should be designed so that Curtis Orchard employees can maintain daily information without technical knowledge.

If that requirement is achieved, the Visitor Companion has a realistic chance of remaining useful after the course project ends.

---

# 45. Immediate First Build

The first engineering target should be intentionally small:

```text
/admin

Corn Maze
OPEN -> CLOSED

      ↓

Firestore

      ↓

/today

Corn Maze
CLOSED
```

Once this works reliably on both desktop and a real phone, the architecture is validated.

Everything else can be built incrementally on top of that foundation.
