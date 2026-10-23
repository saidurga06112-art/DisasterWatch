"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, RotateCcw, ListFilter } from "lucide-react";
import useEvents from "@/lib/useEvents";
import EventCard from "@/components/EventCard";
import StatusNotice from "@/components/StatusNotice";

export default function EventsList() {
  const { events, loading, error, source, isFallback, updatedAt, refresh } = useEvents();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const categories = useMemo(() => ["All categories", ...new Set(events.flatMap((event) => event.categories || [event.category]).filter(Boolean))].sort((a, b) => a === "All categories" ? -1 : a.localeCompare(b)), [events]);
  const filtered = useMemo(() => events.filter((event) => {
    const matchesCategory = category === "All categories" || (event.categories || [event.category]).includes(category);
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || [event.title, event.category, event.location].some((value) => String(value || "").toLowerCase().includes(needle));
    return matchesCategory && matchesQuery;
  }).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)), [events, category, query]);
  return (
    <div className="page-shell inner-page">
      <section className="page-intro"><div><span className="eyebrow"><span className="eyebrow-line" /> EVENT EXPLORER</span><h1>All event reports</h1><p>Search, filter, and explore natural-event records from the global feed.</p></div><div className="intro-orb"><ListFilter size={30} /></div></section>
      <StatusNotice loading={loading} error={error} source={source} isFallback={isFallback} updatedAt={updatedAt} onRefresh={refresh} />
      <section className="filter-panel">
        <div className="filter-heading"><div><SlidersHorizontal size={17} /><strong>Find an event</strong></div><span>{filtered.length} {filtered.length === 1 ? "record" : "records"}</span></div>
        <div className="filter-controls"><label className="search-field"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, category, or location…" aria-label="Search events" /></label><label className="select-field"><span>Category</span><select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">{categories.map((item) => <option key={item}>{item}</option>)}</select></label><button className="button-secondary reset-button" onClick={() => { setQuery(""); setCategory("All categories"); }}><RotateCcw size={15} /> Reset</button></div>
      </section>
      {loading ? <div className="loading-panel tall"><span className="loader" /> Fetching event records…</div> : filtered.length ? <div className="event-list events-page-list">{filtered.map((event) => <EventCard key={event.id} event={event} />)}</div> : <div className="empty-state large"><Search size={28} /><h3>No matching events</h3><p>Try a different search term or category.</p><button className="button-secondary" onClick={() => { setQuery(""); setCategory("All categories"); }}>Clear filters</button></div>}
      <p className="page-disclaimer">Select an event card for details. Source links open in a new browser tab and do not download files.</p>
    </div>
  );
}
