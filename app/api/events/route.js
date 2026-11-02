import {
  normalizeEonetEvents,
  SAMPLE_EVENTS
} from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Request actual event information from NASA.
    const response = await fetch(
      "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=500",
      {
        headers: {
          Accept: "application/json"
        },
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        `NASA EONET returned status ${response.status}`
      );
    }

    const payload = await response.json();

    // Convert NASA records into dashboard format.
    const liveEvents = normalizeEonetEvents(
      payload?.events || []
    );

    // Return NASA data when available.
    if (liveEvents.length > 0) {
      return Response.json({
        events: liveEvents,
        source: "NASA EONET v3",
        updatedAt: new Date().toISOString(),
        isFallback: false,
        warning: null
      });
    }

    // Use sample records if NASA returns no usable events.
    return Response.json({
      events: SAMPLE_EVENTS,
      source: "Sample fallback data",
      updatedAt: new Date().toISOString(),
      isFallback: true,
      warning: "No usable live NASA events were available."
    });

  } catch (error) {
    // Use sample records if NASA cannot be reached.
    return Response.json({
      events: SAMPLE_EVENTS,
      source: "Sample fallback data",
      updatedAt: new Date().toISOString(),
      isFallback: true,
      warning: "NASA EONET is temporarily unavailable. Showing sample records."
    });
  }
}
