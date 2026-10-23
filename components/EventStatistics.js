"use client";

import { Activity, Globe2, Layers3, MapPin } from "lucide-react";

export default function EventStatistics({ events = [] }) {
  const mapped = events.filter((event) => event.coordinates).length;
  const categories = new Set(events.flatMap((event) => event.categories || [event.category]).filter(Boolean)).size;
  const stats = [
    { label: "Reports listed", value: events.length, icon: Activity, note: "Available records" },
    { label: "Categories", value: categories, icon: Layers3, note: "Event types represented" },
    { label: "With coordinates", value: mapped, icon: MapPin, note: "Can be plotted on map" },
    { label: "Global coverage", value: "Global", icon: Globe2, note: "Across reported regions" }
  ];
  return <div className="stats-grid">{stats.map(({ label, value, icon: Icon, note }) => <div className="stat-card" key={label}><div className="stat-head"><span>{label}</span><span className="stat-icon"><Icon size={17} /></span></div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>)}</div>;
}
