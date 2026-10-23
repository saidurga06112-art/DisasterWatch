"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import { formatDate, categoryTone } from "@/lib/events";

function FitEvents({ events }) {
  const map = useMap();
  useEffect(() => {
    if (events.length) {
      const bounds = events.filter((e) => e.coordinates).map((e) => [e.coordinates.latitude, e.coordinates.longitude]);
      if (bounds.length > 1) map.fitBounds(bounds, { padding: [30, 30], maxZoom: 4 });
      else if (bounds.length === 1) map.setView(bounds[0], 3);
    }
  }, [events, map]);
  return null;
}

const colors = { orange: "#f97316", purple: "#8b5cf6", red: "#ef4444", blue: "#3b82f6", cyan: "#06b6d4", green: "#10b981" };

export default function WorldMapCanvas({ events = [], onSelect }) {
  return (
    <MapContainer center={[20, 0]} zoom={2} minZoom={2} scrollWheelZoom className="leaflet-map">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitEvents events={events} />
      {events.map((event) => {
        const tone = categoryTone(event.category);
        return <CircleMarker key={event.id} center={[event.coordinates.latitude, event.coordinates.longitude]} radius={8} pathOptions={{ color: "#ffffff", weight: 2, fillColor: colors[tone] || colors.green, fillOpacity: 0.92 }}>
          <Popup><div className="map-popup"><span>{event.category}</span><strong>{event.title}</strong><small>{formatDate(event.date)} · {event.location}</small><button onClick={() => onSelect(event)}>View details</button></div></Popup>
        </CircleMarker>;
      })}
    </MapContainer>
  );
}
