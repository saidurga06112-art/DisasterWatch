"use client";

import { Activity, Globe2, Database, SearchCheck, AlertTriangle, ExternalLink } from "lucide-react";

const features = [
  { icon: Database, title: "NASA EONET integration", text: "Fetches event records from NASA's Earth Observatory Natural Event Tracker API." },
  { icon: SearchCheck, title: "Search and category filters", text: "Explore records by event name, category, and reported location." },
  { icon: Globe2, title: "Interactive geographic view", text: "Plots records with source-provided coordinates on an OpenStreetMap-powered map." },
  { icon: Activity, title: "Resilient fallback", text: "Sample records are shown if the public API is temporarily unavailable, with a visible fallback notice." }
];

export default function About() {
  return (
    <div className="page-shell inner-page">
      <section className="page-intro"><div><span className="eyebrow"><span className="eyebrow-line" /> ABOUT THE PROJECT</span><h1>Make global reports easier to explore.</h1><p>DisasterWatch is a compact natural-event monitor built for discovery, learning, and data exploration.</p></div><div className="intro-orb"><Activity size={30} /></div></section>
      <section className="about-mission"><div className="mission-icon"><Globe2 size={24} /></div><div><span className="eyebrow">OUR PURPOSE</span><h2>One view of a changing planet.</h2><p>The project brings public natural-event reports into a clear interface so people can browse what has been reported, where it was recorded, and which category it belongs to.</p></div></section>
      <div className="about-feature-grid">{features.map(({ icon: Icon, title, text }) => <article className="about-feature" key={title}><span className="about-feature-icon"><Icon size={20} /></span><h3>{title}</h3><p>{text}</p></article>)}</div>
      <section className="limitations-panel"><div className="limitations-icon"><AlertTriangle size={20} /></div><div><h2>Important limitations</h2><ul><li>Event reporting may not be real-time and may be delayed or incomplete.</li><li>Locations and dates depend on the information supplied by the source.</li><li>Fallback records are illustrative sample data and are not verified current events.</li><li>DisasterWatch is not an emergency alert, forecasting, or official response service.</li></ul></div></section>
      <section className="source-panel"><div><span className="eyebrow">DATA AND MAP SOURCES</span><h2>Built on public resources</h2><p>NASA EONET provides event metadata. OpenStreetMap provides the map tiles.</p></div><div className="source-links"><a href="https://eonet.gsfc.nasa.gov/" target="_blank" rel="noreferrer">NASA EONET <ExternalLink size={15} /></a><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap <ExternalLink size={15} /></a></div></section>
    </div>
  );
}
