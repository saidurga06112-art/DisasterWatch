import { normalizeEonetEvents, SAMPLE_EVENTS } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(
      "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=500",
      {
        headers: { Accept: "application/json" },
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(`NASA EONET returned ${response.status}`);
    }

    const payload = await response.json();

    const liveEvents = normalizeEonetEvents(payload?.events || []);

    // Use NASA live events when available.
    if (liveEvents.length > 0) {
      return Response.json({
        events: liveEvents.map((event) => ({
          ...event,
          isSample: false
        })),
        source: "NASA EONET v3",
        updatedAt: new Date().toISOString(),
        isFallback: false,
        warning: null
      });
    }

    // Use sample events if NASA returns no usable records.
    return Response.json({
      events: SAMPLE_EVENTS.map((event) => ({
        ...event,
        isSample: true
      })),
      source: "Saved sample data",
      updatedAt: new Date().toISOString(),
      isFallback: true,
      warning: "No live NASA events were available. Showing sample data."
    });

  } catch (error) {
    // Use sample events if the NASA API request fails.
    return Response.json({
      events: SAMPLE_EVENTS.map((event) => ({
        ...event,
        isSample: true
      })),
      source: "Saved sample data",
      updatedAt: new Date().toISOString(),
      isFallback: true,
      warning: "NASA EONET could not be reached. Showing sample data."
    });
  }
}
