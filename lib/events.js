const REQUESTED_EONET_EVENTS = [
  {
    id: "EONET_25457", title: "Tropical Cyclone 02S", description: null,
    link: "https://eonet.gsfc.nasa.gov/api/v3/events/EONET_25457", closed: null,
    categories: [{ id: "severeStorms", title: "Severe Storms" }],
    sources: [{ id: "JTWC", url: "https://www.metoc.navy.mil/jtwc/products/sh0227.tcw" }],
    geometry: [
      { magnitudeValue: 35, magnitudeUnit: "kts", date: "2026-10-20T06:00:00Z", type: "Point", coordinates: [53.8, -4.5] },
      { magnitudeValue: 40, magnitudeUnit: "kts", date: "2026-10-20T12:00:00Z", type: "Point", coordinates: [53.3, -5] },
      { magnitudeValue: 40, magnitudeUnit: "kts", date: "2026-10-20T18:00:00Z", type: "Point", coordinates: [52.7, -5.1] }
    ]
  },
  {
    id: "EONET_25455", title: "Prescribed Fire STE - Goodin Ridge RX, McCreary, Kentucky", description: null,
    link: "https://eonet.gsfc.nasa.gov/api/v3/events/EONET_25455", closed: null,
    categories: [{ id: "wildfires", title: "Wildfires" }],
    sources: [{ id: "IRWIN", url: "https://irwin.doi.gov/observer/incidents/2026-KYDBF-260285" }],
    geometry: [{ magnitudeValue: 2604, magnitudeUnit: "acres", date: "2026-10-18T08:25:00Z", type: "Point", coordinates: [-84.376511, 36.948746] }]
  },
  {
    id: "EONET_25450", title: "Wildfire COOLEY, Mendocino, California", description: "4 Miles S from Yorkville, CA",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events/EONET_25450", closed: null,
    categories: [{ id: "wildfires", title: "Wildfires" }],
    sources: [{ id: "IRWIN", url: "https://irwin.doi.gov/observer/incidents/2026-CAMEU-012265" }],
    geometry: [{ magnitudeValue: 1365, magnitudeUnit: "acres", date: "2026-10-16T20:14:00Z", type: "Point", coordinates: [-123.188056, 38.819722] }]
  },
  {
    id: "EONET_25452", title: "Wildfire NORTE, Orange, California", description: "1 Miles NW from San Clemente, CA",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events/EONET_25452", closed: null,
    categories: [{ id: "wildfires", title: "Wildfires" }],
    sources: [{ id: "IRWIN", url: "https://irwin.doi.gov/observer/incidents/2026-CAORC-149182" }],
    geometry: [{ magnitudeValue: 570, magnitudeUnit: "acres", date: "2026-10-16T14:52:00Z", type: "Point", coordinates: [-117.63483, 33.47965118] }]
  },
  {
    id: "EONET_25454", title: "Prescribed Fire Rx Polk 9275, Polk, Texas", description: null,
    link: "https://eonet.gsfc.nasa.gov/api/v3/events/EONET_25454", closed: null,
    categories: [{ id: "wildfires", title: "Wildfires" }],
    sources: [{ id: "IRWIN", url: "https://irwin.doi.gov/observer/incidents/2026-TXTXS-269275" }],
    geometry: [{ magnitudeValue: 900, magnitudeUnit: "acres", date: "2026-10-16T08:31:00Z", type: "Point", coordinates: [-94.72916667, 30.57111111] }]
  }
];

export function normalizeEonetEvents(rawEvents = []) {
  return rawEvents.map((event) => {
    const geometries = Array.isArray(event.geometry) ? event.geometry : [];
    const latestGeometry = geometries.length ? geometries[geometries.length - 1] : null;
    const coords = latestGeometry?.coordinates;
    const categoryNames = (event.categories || []).map((category) => category.title).filter(Boolean);
    const category = categoryNames[0] || "Other";
    return {
      id: String(event.id || event.title || Math.random()),
      title: event.title || "Unnamed natural event",
      category,
      categories: categoryNames.length ? categoryNames : [category],
      date: latestGeometry?.date || geometries[0]?.date || event.closed || null,
      location: latestGeometry?.description || latestGeometry?.title || event.description || "Location not supplied",
      coordinates: Array.isArray(coords) && coords.length >= 2
        ? { longitude: Number(coords[0]), latitude: Number(coords[1]) } : null,
      magnitudeValue: latestGeometry?.magnitudeValue ?? null,
      magnitudeUnit: latestGeometry?.magnitudeUnit || null,
      geometry: geometries,
      sources: event.sources || [],
      sourceId: event.sources?.[0]?.id || null,
      sourceUrl: event.sources?.[0]?.url || event.link || "https://eonet.gsfc.nasa.gov/",
      eventUrl: event.link || `https://eonet.gsfc.nasa.gov/api/v3/events/${event.id}`,
      description: event.description || null,
      closed: event.closed || null,
      isSample: false
    };
  });
}

export const SAMPLE_EVENTS = normalizeEonetEvents(REQUESTED_EONET_EVENTS).map((event) => ({
  ...event,
  description: event.description || `NASA EONET event record: ${event.title}.`,
  isSample: false
}));

export function formatDate(value) {
  if (!value) return "Date not supplied";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not supplied";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

export function categoryTone(category = "") {
  const value = category.toLowerCase();
  if (value.includes("wildfire")) return "orange";
  if (value.includes("storm") || value.includes("cyclone")) return "purple";
  if (value.includes("volcano")) return "red";
  if (value.includes("flood")) return "blue";
  if (value.includes("ice") || value.includes("snow")) return "cyan";
  return "green";
}
