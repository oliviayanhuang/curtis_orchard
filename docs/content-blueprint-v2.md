# Curtis Orchard Visitor Companion

## Content Blueprint v2 — Simplified Four-Page Scope

**Prepared:** September 9, 2026  
**Source:** Public information on the official Curtis Orchard website  
**Product role:** A lightweight, mobile-first guide visitors open from a QR code while they are at the orchard.

---

## 1. Product promise

### Working title

**Curtis Orchard Visitor Companion**

### One-line description

**Find your way, discover what to do, and build a simple plan for your visit.**

### Primary visitor journey

1. Scan a QR code at the orchard.
2. Open the map and understand where things are.
3. Explore activities, food, shopping, and visitor information.
4. Build a short itinerary based on time, group, and interests.
5. Open a location detail page and continue to the next stop.

### Navigation model

The persistent bottom navigation contains only three destinations:

- **Map**
- **Explore**
- **Plan**

**Location Detail** is a contextual page opened from a map marker, Explore card, or itinerary stop. It is not a fourth bottom-navigation tab.

---

## 2. Scope

### Included

- Static illustrated orchard map
- Clickable location hotspots
- Category-based Explore directory
- Simple front-end visit planner
- Reusable location detail pages
- External links to official directions, tickets, menus, and current information
- Manually configured seasonal content

### Removed

- Today page
- Events and event listings
- Live apple inventory
- Live activity status
- Weather feed and automatic closure alerts
- Announcements feed
- Staff editor and publishing history
- Reminders and push notifications
- Favorites, saved plans, and sharing
- Login, accounts, database, and CMS

The companion must not imply that prices, availability, hours, or weather-sensitive activities are live unless someone has manually reviewed and updated them.

---

## 3. Global content

### Orchard identity

**Curtis Orchard & Pumpkin Patch**  
3902 S. Duncan Road  
Champaign, IL 61822  
(217) 359-5565

### Utility actions

- **Get directions** — opens the official directions or map link
- **Call the orchard** — `tel:+12173595565`
- **Visit official website** — opens `https://www.curtisorchard.com/`

### Seasonal information notice

Use this short notice anywhere current hours, prices, or availability appear:

> Seasonal hours, prices, and activities can change. Check the official website or call the orchard before making a special trip.

### Accessibility summary

> The Country Store and café are on flat, level ground. A paved path with a slight decline leads toward the animal and activity areas. The orchard, pumpkin patch, and parts of the Land of Oz have gravel, grass, and uneven ground that may be more difficult for visitors with mobility needs.

### Visitor rules

- Only trained service animals recognized by the ADA are permitted; pets should stay home.
- Outside food and drinks are not allowed on the property.
- Children must remain supervised.
- Outdoor activities may close because of rain, wind, thunderstorms, or extreme heat.
- Cash, credit cards, Apple Pay, and Google Pay are accepted.

---

## 4. Page 1 — Map

### Page title

**Orchard Map**

### Page purpose

Help visitors orient themselves and choose a nearby destination. The map is an illustrated guide, not GPS navigation.

### Intro text

> Tap a place to learn what you’ll find there and what to visit next.

### Map controls

- **All**
- **Activities**
- **Food & Drink**
- **Shopping**
- **Amenities**

### “You are here” behavior

The starting marker is determined by the QR code a visitor scans. It must be labeled:

**You are here**

Do not describe the marker as GPS positioning.

### Primary map locations

| Map label | Category | Short map description | Opens detail page |
|---|---|---|---|
| Welcome / Parking | Amenities | Free on-site parking and the best place to begin | Yes |
| Country Store | Shopping | Apples, cider, honey, gifts, and pantry favorites | Yes |
| Bakery | Food & Drink | Fresh apple crisp donuts, pies, fritters, and seasonal baked goods | Yes |
| Flying Monkey Café | Food & Drink | Seasonal lunch service and family favorites | Yes |
| U-Pick Apple Orchard | Activities | Designated rows for picking your own apples | Yes |
| Land of Oz | Activities | Mazes, play areas, inflatables, animals, and games | Yes |
| Goat & Animal Area | Activities | Meet and feed farm animals during the activity season | Yes |
| Pumpkin Patch | Activities | Pick a pumpkin from the field in season | Yes |
| Restrooms | Amenities | Visitor restrooms near the main farm area | Brief detail |
| Poppyfield Pavilion | Amenities | Covered gathering and program space | Brief detail |

### Marker preview card

Each tapped marker displays:

- Location name
- One-sentence description
- Category
- Terrain or access note
- **View details**
- **Add to plan**

Walking-time estimates should remain unpublished until they are measured on site. Until then, use relative wayfinding such as **near the Country Store**, **past the store**, or **through the orchard**.

---

## 5. Page 2 — Explore

### Page title

**Explore**

### Intro text

> Discover picking, play, food, shopping, and helpful visitor information.

### Category cards

#### Apple Picking

**Card summary:** Pick your own apples from designated orchard rows.

**Expanded copy:**

> Curtis Orchard grows more than 26 apple varieties across the season. U-Pick timing depends on weather and ripening, so check the official apple page before visiting for a specific variety.

**Quick facts:**

- Seasonal activity
- Grass and uneven orchard ground
- Admission required
- Children age 3 and under are currently listed as free with a paid parent or guardian; no bag is included

**Actions:** **View location** · **Official apple information** · **Add to plan**

#### Land of Oz Activities

**Card summary:** Mazes, slides, play areas, games, animals, and seasonal rides.

**Expanded copy:**

> The Wizard of Oz-themed activity area combines all-day family play with seasonal farm experiences. Available attractions vary by weekday, weekend, weather, and time of season.

**Typical activities:**

- Scarecrow’s Corn Maze
- Ruby Slippers Maze & Playground
- Zinnia Maze
- Giant Slide or Jumping Pillow
- Flying Monkey Training Course
- Mini golf and yard games
- Tractor orchard tours on selected days
- Optional pony and horse-drawn wagon rides on selected dates

**Actions:** **View location** · **Official activities and pricing** · **Add to plan**

#### Animals

**Card summary:** Meet goats and other farm animals in the Land of Oz area.

**Expanded copy:**

> Stop by the animal area to meet farm animals during the activity season. Goat feed may be purchased separately. Animal availability can change during the season.

**Visitor note:** Children should be supervised and animals should be treated gently.

**Actions:** **View location** · **Add to plan**

#### Food & Drinks

**Card summary:** Fresh donuts, baked goods, cider, and seasonal lunch service.

**Expanded copy:**

> Start with fresh apple crisp donuts and bakery favorites, stop for lunch at the Flying Monkey Café during its fall season, or take home Curtis Orchard cider.

**Highlights:**

- Apple crisp donuts
- Fruit pies, apple fritters, cobblers, and pumpkin bars
- Cider and seasonal treats
- Sandwiches, soups, and sides at the café

**Visitor note:** Popular bakery items can sell out on busy fall weekends. Large orders should be placed ahead.

**Actions:** **Bakery details** · **Café details** · **Add to plan**

#### Shopping

**Card summary:** Apples, cider, honey, local foods, and orchard gifts.

**Expanded copy:**

> The Country Store carries fresh produce, award-winning cider, Curtis Orchard honey, Amish canned goods, jams, fudge, toys, candles, and gifts.

**Actions:** **View location** · **Official online store** · **Add to plan**

#### Pumpkin Picking

**Card summary:** Walk through the orchard to choose a pumpkin from the field.

**Expanded copy:**

> The pumpkin patch offers orange, blue, green, and white pumpkins in many shapes and sizes. The walk to the field takes visitors through the apple trees. Pumpkins, squash, mini pumpkins, and decorative gourds may also be available closer to the store.

**Visitor tip:** Pick up a red wagon before heading to the field.

**Actions:** **View location** · **Official pumpkin information** · **Add to plan**

#### Accessibility

**Card summary:** Understand paths and terrain before choosing your route.

**Expanded copy:**

> The Country Store and café have flat, level access. A paved path with a slight decline reaches several nearby areas. Gravel, grass, and uneven ground can make the Land of Oz, apple orchard, and pumpkin patch more challenging for mobility devices.

**Actions:** **Show easier-access locations on map** · **Call with a question**

---

## 6. Page 3 — Plan My Visit

### Page title

**Plan My Visit**

### Intro text

> Choose what fits your day. We’ll suggest a simple route you can adjust.

### Step 1 — How much time do you have?

- **1–2 hours**
- **2–4 hours**
- **Half day**
- **Full day**

### Step 2 — Who are you visiting with?

- **Solo**
- **Couple**
- **Family with young children**
- **Family with older children**
- **Friends**
- **Group**

### Step 3 — What are you interested in?

- **Apple picking**
- **Kids’ activities**
- **Animals**
- **Pumpkin picking**
- **Food & drinks**
- **Shopping**
- **Relaxed pace**
- **Easier-access route**

### Plan result heading

**Your orchard plan**

### Result intro

> Here’s a suggested order based on your choices. Seasonal availability may change, so check official information when you arrive.

### Example plans

#### 1–2 hours · Orchard favorites

1. **Country Store & Bakery** — begin with donuts, cider, and a quick look around.
2. **U-Pick Apple Orchard** — pick a bag if U-Pick is open.
3. **Country Store** — check out and take home your favorites.

#### 2–4 hours · Family play day

1. **Land of Oz** — start with the activity area while energy is high.
2. **Goat & Animal Area** — meet the animals nearby.
3. **Flying Monkey Café** — pause for lunch during café hours.
4. **Country Store & Bakery** — finish with cider, donuts, and gifts.

#### Half day · Picking and play

1. **U-Pick Apple Orchard**
2. **Land of Oz**
3. **Flying Monkey Café**
4. **Pumpkin Patch** — add during pumpkin season.
5. **Country Store & Bakery**

#### Easier-access visit

1. **Welcome / Parking**
2. **Country Store**
3. **Bakery**
4. **Flying Monkey Café**
5. **Nearby paved-path stops**, based on comfort and current conditions

### Plan controls

- **View first stop**
- **Show route on map**
- **Change my choices**
- **Remove stop**
- **Move stop up / down**

The plan exists only for the current browser session. It is not saved to an account or shared.

---

## 7. Page 4 — Location Detail

### Reusable page structure

Every location detail page should contain these blocks in this order:

1. **Location name**
2. Hero photo or orchard illustration
3. One-paragraph overview
4. **Good to know** — season, admission, terrain, and key limitations
5. **What you’ll find**
6. **Accessibility**
7. **Rules and tips**
8. **Nearby** — related locations, without unverified walking times
9. Primary action: **Next stop** or **Add to plan**
10. Secondary action: **View on map**
11. External action when useful: **Check official details**

### Location detail copy

#### Welcome / Parking

**Overview:**

> Start here for the Country Store, Bakery, café, orchard, and activity areas. Free parking is available on site, with overflow parking in an adjacent field during busy periods.

**Good to know:** October weekends are especially busy. Arriving early or visiting on a weekday usually makes parking and exploring easier. Buses and oversized vehicles should use the north entrance.

**Nearby:** Country Store · Bakery · Main orchard entrance

#### Country Store

**Overview:**

> Browse fresh apples, award-winning cider, Curtis Orchard honey, local and Amish pantry goods, toys, candles, and gifts.

**Good to know:** The store operates seasonally from July through December, with off-season shopping by appointment. Popular items may sell out.

**Accessibility:** Flat, level entrance.

**Nearby:** Bakery · Flying Monkey Café · Parking

#### Bakery

**Overview:**

> The bakery is known for apple crisp donuts made fresh daily, along with pies, apple fritters, cobblers, pumpkin bars, and other seasonal favorites.

**Good to know:** Arrive early on busy fall weekends. Orders larger than two dozen donuts or two pies should be reserved in advance.

**Accessibility:** Flat, level access in the main store area.

**Nearby:** Country Store · Flying Monkey Café · Parking

#### Flying Monkey Café

**Overview:**

> Stop for a seasonal fall lunch with sandwiches, soups, comfort-food entrées, and sides prepared by the café team.

**Good to know:** The café operates only during the late-summer and fall season. Current hours and menu should be checked on the official site.

**Accessibility:** Flat, level access.

**Nearby:** Country Store · Bakery · Land of Oz entrance

#### U-Pick Apple Orchard

**Overview:**

> Walk the designated rows, pick your own apples, and bring home a bag. Curtis Orchard grows more than 26 varieties, but ripening dates and U-Pick availability depend on weather.

**Good to know:** Admission is separate from Land of Oz admission. The orchard terrain is grassy and uneven. Check the official apple page if you are visiting for a specific variety.

**Rules and tips:** Pick only in designated rows and follow staff signs and instructions.

**Nearby:** Country Store · Pumpkin Patch · Main orchard path

#### Land of Oz

**Overview:**

> Spend the day in a Wizard of Oz-themed activity area with mazes, slides, play spaces, games, animals, and selected seasonal rides.

**Good to know:** A wristband is required for everyone age 4 and older. Children 14 and younger must be accompanied by a paying adult. Apple picking, pumpkin picking, and pony or horse activities are not included in the standard wristband.

**Weather note:** The jumping pillow and outdoor inflatables close in rain or winds of 25 mph or more. Other closures may occur during thunderstorms or heat advisories.

**Nearby:** Goat & Animal Area · Poppyfield Pavilion · Flying Monkey Café

#### Goat & Animal Area

**Overview:**

> Meet the goats and other seasonal farm animals inside the Land of Oz activity area. Goat feed may be purchased separately.

**Good to know:** Animal availability varies by season. Land of Oz admission may be required.

**Rules and tips:** Be gentle, supervise children, and feed animals only with approved feed.

**Nearby:** Land of Oz activities · Poppyfield Pavilion · Café

#### Pumpkin Patch

**Overview:**

> Choose a pumpkin from a field filled with many colors, shapes, and sizes. The walk to the patch passes through the apple trees and is part of the experience.

**Good to know:** The official site describes the patch as about a 10-minute walk from the main area. The route includes natural, uneven ground. Additional pumpkins and gourds may be available closer to the store.

**Tips:** Take a red wagon for pumpkins or tired little legs, then bring your selection back to the store to check out.

**Nearby:** U-Pick Apple Orchard · Country Store

---

## 8. Content that must remain manually configurable

The following values should live in one simple configuration file rather than being repeated across page components:

- Orchard, Country Store, and Bakery hours
- Flying Monkey Café opening date and hours
- Land of Oz season, hours, admission prices, and included activities
- U-Pick admission price and currently available varieties
- Pumpkin pricing and seasonal availability
- Weather-related closures
- Attraction availability by weekday or weekend
- Official ticket, menu, preorder, and directions links
- “Last reviewed” date

### Required status label

At the bottom of any manually maintained information block:

**Last reviewed: [Month Day, Year]**

Never use **Live**, **Open now**, **Available today**, or similar language without a real current-data source.

---

## 9. Source notes and content conflicts

The official website currently contains a few details that should be verified before hard-coding:

- The Shop & Eat page summarizes Store and Bakery hours differently from the more detailed Bakery, Country Store, and Contact pages, especially Sunday hours.
- One page describes the Flying Monkey Café opening weekend as August 29–30, while another lists August 30 as the opening date.
- The Contact page appears to show “Oct 1 – Oct 3,” while related pages use October 1–31.
- Apple availability, attraction availability, events, weather closures, and homepage announcement banners change frequently.

For the prototype, use stable descriptive copy and link out for current operational details. Before public launch, Curtis Orchard staff should confirm the seasonal configuration values.

---

## 10. Official source pages

- Home: https://www.curtisorchard.com/
- Visit / Activities: https://www.curtisorchard.com/visit
- Directions and parking: https://www.curtisorchard.com/directions
- Apples / U-Pick: https://www.curtisorchard.com/apples
- Land of Oz: https://www.curtisorchard.com/the-land-of-oz
- Pumpkin Patch: https://www.curtisorchard.com/pumpkin-patch
- Shop & Eat: https://www.curtisorchard.com/shop-eat
- Country Store: https://www.curtisorchard.com/country-store
- Bakery: https://www.curtisorchard.com/bakery
- Flying Monkey Café: https://www.curtisorchard.com/flying-monkey-cafe
- FAQs and policies: https://www.curtisorchard.com/faq
- Contact and seasonal hours: https://www.curtisorchard.com/contact

