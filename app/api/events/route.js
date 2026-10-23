import { normalizeEonetEvents, SAMPLE_EVENTS } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(
      "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=500",
      { headers: { Accept: "application/json" }, cache: "no-store" }
    );
    if (!response.ok) throw new Error(`NASA EONET returned ${response.status}`);
    const payload = await response.json();
    const liveEvents = normalizeEonetEvents(payload?.events || []);
    // Keep the five requested EONET records visible, while also showing other live records.
    const byId = new Map(SAMPLE_EVENTS.map((event) => [event.id, event]));
    liveEvents.forEach((event) => byId.set(event.id, event));
    const events = [...byId.values()];
    return Response.json({
      events,
      source: "NASA EONET v3",
      updatedAt: new Date().toISOString(),
      isFallback: false
    });
  } catch (error) {
    return Response.json({
      events: SAMPLE_EVENTS,
      source: "NASA EONET records (saved fallback)",
      updatedAt: new Date().toISOString(),
      isFallback: true,
      warning: "NASA EONET could not be reached. Showing the five supplied EONET records."
    }, { status: 200 });
  }
}
