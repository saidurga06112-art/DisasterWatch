"use client";

import { useCallback, useEffect, useState } from "react";
import { SAMPLE_EVENTS } from "@/lib/events";

export default function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [source, setSource] = useState("NASA EONET v3");
  const [isFallback, setIsFallback] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/events", { cache: "no-store" });
      if (!response.ok) throw new Error("The event service is temporarily unavailable.");
      const data = await response.json();
      if (!Array.isArray(data.events) || !data.events.length) throw new Error("No event records were returned.");
      setEvents(data.events);
      setSource(data.source || "NASA EONET v3");
      setIsFallback(Boolean(data.isFallback));
      setUpdatedAt(data.updatedAt || new Date().toISOString());
      if (data.warning) setError(data.warning);
    } catch (e) {
      setEvents(SAMPLE_EVENTS);
      setSource("Sample fallback data");
      setIsFallback(true);
      setError("Could not load the event service. Sample records are displayed instead.");
      setUpdatedAt(new Date().toISOString());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { events, loading, error, source, isFallback, updatedAt, refresh };
}
