# DisasterWatch — Global Natural Events Monitor

DisasterWatch is a responsive Next.js application for exploring public natural-event reports. It shows event names, categories, dates, reported locations, search and category filtering, a data status notice, sample fallback records, and an optional interactive map.

## Technology
- Next.js 14 App Router and React
- JavaScript
- NASA EONET v3 API: https://eonet.gsfc.nasa.gov/
- Leaflet + React Leaflet and OpenStreetMap tiles for the optional map
- Plain CSS and Lucide icons

## Run locally
Requirements: Node.js 18.17+ (Node 20 LTS recommended) and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

For a production build:

```bash
npm run build
npm start
```

## Pages
- `/` — Dashboard and overview
- `/events` — Searchable and filterable event list
- `/map` — Optional interactive map for events with coordinates
- `/about` — Data source, purpose, and limitations

## API integration
The Next.js route `app/api/events/route.js` requests open events from NASA EONET v3. `lib/events.js` normalizes the response into a shared event format:
- `id`, `title`, `category`, `categories`
- `date`, `location`
- `coordinates` (`latitude`, `longitude`) when provided
- `sourceUrl`, `eventUrl`, `description`

The browser requests `/api/events`; the public NASA API is called server-side. No API key is required for this public endpoint. The app refreshes data on page load and provides a manual refresh button.

## Fallback and limitations
If NASA EONET is unavailable or returns no usable records, the route returns illustrative sample records and the UI shows a fallback warning. Sample records are clearly labelled and must not be presented as verified current events.

Event reporting is not necessarily real-time. Some reports may lack coordinates or precise dates. Map markers are shown only where coordinates are supplied. OpenStreetMap tiles require an internet connection.

**DisasterWatch is an educational event-exploration tool, not an emergency alert, prediction, or official response service.** For urgent situations, follow local emergency authorities.

## team responsibilities
- Member 1: `components/Dashboard.js,app/globals.css`
- Member 2: `app/api/events/route.js,lib/events.js`
- Member 3: `components/WorldMap.js,components/WorldMapCanvas.js,components/EventDetails.js,
- components/EventStatistics.js,lib/leaflet-icons.js`
- Member 4: `components/EventsList.js`, `lib/useEvents.js`
- Member 5: `components/Navbar.js,components/About.js,app/page.js,app/layout.js,app/events/page.js,
- app/map/page.js,app/about/page.js, README and coordination
