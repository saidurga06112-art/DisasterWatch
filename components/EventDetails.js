"use client";

import { X, ExternalLink, MapPin, CalendarDays, Layers3, Activity } from "lucide-react";
import { formatDate } from "@/lib/events";

export default function EventDetails({ event, onClose }) {
  if (!event) return null;
  const coordinates = event.coordinates;
  const geometry = Array.isArray(event.geometry) ? event.geometry : [];
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="details-title" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div><span className="eyebrow">NASA EONET EVENT DETAILS</span><h2 id="details-title">{event.title}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close details"><X size={18} /></button>
        </div>
        <p className="modal-description">{event.description || "No additional description was supplied for this event. Details below are from the NASA EONET record."}</p>
        <div className="detail-row"><Layers3 size={17} /><span><b>Category</b>{(event.categories || [event.category]).filter(Boolean).join(", ") || "Other"}</span></div>
        <div className="detail-row"><CalendarDays size={17} /><span><b>Latest reported date</b>{formatDate(event.date)}</span></div>
        <div className="detail-row"><MapPin size={17} /><span><b>Location / coordinates</b>{coordinates ? `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}` : (event.location || "Not supplied")}</span></div>
        {event.location && event.location !== "Location not supplied" && <div className="detail-row"><MapPin size={17} /><span><b>Location description</b>{event.location}</span></div>}
        {event.magnitudeValue !== null && event.magnitudeValue !== undefined && <div className="detail-row"><Activity size={17} /><span><b>Magnitude</b>{Number(event.magnitudeValue).toLocaleString()} {event.magnitudeUnit || ""}</span></div>}
        {event.closed && <div className="detail-row"><CalendarDays size={17} /><span><b>Closed</b>{formatDate(event.closed)}</span></div>}
        {geometry.length > 1 && <div className="geometry-history"><b>Recorded track ({geometry.length} points)</b>{geometry.map((point, index) => <div className="geometry-point" key={`${point.date}-${index}`}><span>{formatDate(point.date)}</span><span>{Array.isArray(point.coordinates) ? `${point.coordinates[1]}, ${point.coordinates[0]}` : "Coordinates unavailable"}{point.magnitudeValue != null ? ` · ${point.magnitudeValue} ${point.magnitudeUnit || ""}` : ""}</span></div>)}</div>}
        <div className="detail-links">
          <a className="button-primary full-button" href={event.eventUrl || "https://eonet.gsfc.nasa.gov/api/v3/events"} target="_blank" rel="noopener noreferrer">View NASA event page <ExternalLink size={16} /></a>
          {event.sourceUrl && event.sourceUrl !== event.eventUrl && <a className="button-secondary full-button" href={event.sourceUrl} target="_blank" rel="noopener noreferrer">Open original source: {event.sourceId || "source"} <ExternalLink size={16} /></a>}
        </div>
      </section>
    </div>
  );
}
