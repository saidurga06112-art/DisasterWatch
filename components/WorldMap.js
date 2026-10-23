"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { MapPinned, Info } from "lucide-react";
import useEvents from "@/lib/useEvents";
import StatusNotice from "@/components/StatusNotice";
import EventDetails from "@/components/EventDetails";

const WorldMapCanvas = dynamic(() => import("@/components/WorldMapCanvas"), {
  ssr: false,
  loading: () => <div className="map-loading"><span className="loader" /> Preparing interactive map…</div>
});

export default function WorldMap() {
  const { events, loading, error, source, isFallback, updatedAt, refresh } = useEvents();
  const [selected, setSelected] = useState(null);
  const mapped = events.filter((event) => event.coordinates);
  return (
    <div className="page-shell inner-page">
      <section className="page-intro"><div><span className="eyebrow"><span className="eyebrow-line" /> GEOGRAPHIC VIEW</span><h1>World event map</h1><p>Explore event locations where coordinates are supplied in the source record.</p></div><div className="intro-orb"><MapPinned size={30} /></div></section>
      <StatusNotice loading={loading} error={error} source={source} isFallback={isFallback} updatedAt={updatedAt} onRefresh={refresh} />
      <div className="map-summary"><div><strong>{mapped.length}</strong><span>mappable records</span></div><div><strong>{events.length}</strong><span>total records</span></div><p><Info size={16} /> Some reports do not include coordinates and cannot appear as map markers.</p></div>
      <section className="map-frame"><WorldMapCanvas events={mapped} onSelect={setSelected} /></section>
      <p className="page-disclaimer">Map tiles © OpenStreetMap contributors. Event data: {source}. Locations are based on source-provided coordinates and may be approximate.</p>
      {selected && <EventDetails event={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
