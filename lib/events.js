// Find a representative coordinate from NASA geometry.
// NASA coordinates use [longitude, latitude].
function getRepresentativeCoordinates(geometry) {
  if (!geometry || !Array.isArray(geometry.coordinates)) {
    return null;
  }

  const positions = [];

  function collectPositions(value) {
    if (!Array.isArray(value)) return;

    if (
      value.length >= 2 &&
      typeof value[0] === "number" &&
      typeof value[1] === "number" &&
      Number.isFinite(value[0]) &&
      Number.isFinite(value[1])
    ) {
      positions.push(value);
      return;
    }

    value.forEach(collectPositions);
  }

  collectPositions(geometry.coordinates);

  if (positions.length === 0) return null;

  const longitude =
    positions.reduce((sum, point) => sum + point[0], 0) /
    positions.length;

  const latitude =
    positions.reduce((sum, point) => sum + point[1], 0) /
    positions.length;

  return {
    longitude,
    latitude
  };
}

// Find the latest available geometry.
function getLatestGeometry(geometries) {
  if (!geometries.length) return null;

  return [...geometries].sort((a, b) => {
    return (
      new Date(b.date || 0).getTime() -
      new Date(a.date || 0).getTime()
    );
  })[0];
}

// Convert NASA EONET data into a common dashboard format.
export function normalizeEonetEvents(rawEvents = []) {
  if (!Array.isArray(rawEvents)) return [];

  return rawEvents
    .filter((event) => event && event.id && event.title)
    .map((event) => {
      const geometries = Array.isArray(event.geometry)
        ? event.geometry
        : [];

      const latestGeometry = getLatestGeometry(geometries);

      const categories = Array.isArray(event.categories)
        ? event.categories
            .map((item) => item?.title)
            .filter(Boolean)
        : [];

      const category = categories[0] || "Other";

      const coordinates =
        getRepresentativeCoordinates(latestGeometry);

      const location = coordinates
        ? `Coordinates: ${coordinates.latitude.toFixed(4)}° latitude, ${coordinates.longitude.toFixed(4)}° longitude`
        : "Location not supplied";

      return {
        id: String(event.id),

        title: event.title,

        category,

        categories,

        date:
          latestGeometry?.date ||
          event.closed ||
          null,

        location,

        coordinates,

        description: event.description || null,

        magnitudeValue:
          latestGeometry?.magnitudeValue ?? null,

        magnitudeUnit:
          latestGeometry?.magnitudeUnit || null,

        geometry: geometries,

        sources: Array.isArray(event.sources)
          ? event.sources
          : [],

        sourceId: event.sources?.[0]?.id || null,

        sourceUrl: event.sources?.[0]?.url || null,

        eventUrl: event.link || null,

        closed: event.closed || null,

        isSample: false
      };
    });
}

// Sample records are used ONLY when NASA is unavailable.
// These are examples, not current live NASA reports.
export const SAMPLE_EVENTS = [
  {
    id: "SAMPLE_001",
    title: "Sample Wildfire Event",
    category: "Wildfires",
    categories: ["Wildfires"],
    date: "2026-10-16T20:14:00Z",
    location: "Sample location",
    coordinates: {
      longitude: -123.188056,
      latitude: 38.819722
    },
    description: "Example event displayed when NASA is unavailable.",
    magnitudeValue: null,
    magnitudeUnit: null,
    sources: [],
    sourceId: null,
    sourceUrl: null,
    eventUrl: null,
    closed: null,
    isSample: true
  },
  {
    id: "SAMPLE_002",
    title: "Sample Severe Storm Event",
    category: "Severe Storms",
    categories: ["Severe Storms"],
    date: "2026-10-20T18:00:00Z",
    location: "Sample location",
    coordinates: {
      longitude: 52.7,
      latitude: -5.1
    },
    description: "Example event displayed when NASA is unavailable.",
    magnitudeValue: null,
    magnitudeUnit: null,
    sources: [],
    sourceId: null,
    sourceUrl: null,
    eventUrl: null,
    closed: null,
    isSample: true
  }
];

// Format dates for the dashboard.
export function formatDate(value) {
  if (!value) return "Date not supplied";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date not supplied";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

// Assign colours according to event category.
export function categoryTone(category = "") {
  const value = category.toLowerCase();

  if (value.includes("wildfire")) return "orange";

  if (
    value.includes("storm") ||
    value.includes("cyclone")
  ) {
    return "purple";
  }

  if (value.includes("volcano")) return "red";

  if (value.includes("flood")) return "blue";

  if (
    value.includes("ice") ||
    value.includes("snow")
  ) {
    return "cyan";
  }

  return "green";
}
