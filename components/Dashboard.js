"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Globe2, ShieldAlert, Sparkles } from "lucide-react";
import useEvents from "@/lib/useEvents";
import EventCard from "@/components/EventCard";
import EventStatistics from "@/components/EventStatistics";
import StatusNotice from "@/components/StatusNotice";

export default function Dashboard() {
  const { events, loading, error, source, isFallback, updatedAt, refresh } = useEvents();
  const recent = [...events].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 4);
  const categoryCount = new Map();
  events.forEach((event) => categoryCount.set(event.category || "Other", (categoryCount.get(event.category || "Other") || 0) + 1));
  const topCategories = [...categoryCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  return (
    <div className="page-shell">
      <section className="hero-panel">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> GLOBAL MONITORING · NASA EONET</div>
            <h1>Understand the events<br /><span>shaping our planet.</span></h1>
            <p className="hero-text">Explore natural-event reports from across the globe in one clear, interactive view. Data for awareness and discovery — not emergency alerts.</p>
            <div className="hero-actions"><Link href="/events" className="button-primary">Explore all events <ArrowRight size={17} /></Link><Link href="/map" className="button-secondary"><Globe2 size={17} /> View world map</Link></div>
            <div className="hero-footnote"><span className="pulse-dot" /> Public event data <span className="footnote-divider">/</span> No account required</div>
          </div>
          <div className="hero-visual" aria-label="Illustration of the Earth and global event locations">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="planet"><div className="planet-shade" /><div className="continent continent-one" /><div className="continent continent-two" /><div className="continent continent-three" /><span className="planet-glow" /></div>
            <div className="orbit-point point-one" /><div className="orbit-point point-two" /><div className="orbit-point point-three" />
            <div className="visual-label label-top"><span className="pulse-dot" /> EARTH SYSTEMS</div>
            <div className="visual-label label-bottom"><span className="visual-label-dot" /> EVENT DATA · GLOBAL</div>
          </div>
        </div>
        <div className="hero-bottom"><div><span className="hero-bottom-number">01</span><span>Discover reports</span></div><div><span className="hero-bottom-number">02</span><span>Explore categories</span></div><div><span className="hero-bottom-number">03</span><span>Understand locations</span></div><div className="hero-bottom-caption">A clearer view of our changing planet.</div></div>
      </section>

      <StatusNotice loading={loading} error={error} source={source} isFallback={isFallback} updatedAt={updatedAt} onRefresh={refresh} />
      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">AT A GLANCE</span><h2>Event overview</h2><p>A quick summary of the currently available records.</p></div><span className="section-index">01 / OVERVIEW</span></div>
        {loading ? <div className="loading-panel"><span className="loader" /> Loading event overview…</div> : <EventStatistics events={events} />}
      </section>

      <section className="section-block two-column-section">
        <div className="recent-panel">
          <div className="section-heading small-heading"><div><span className="eyebrow">LATEST RECORDS</span><h2>Recent event reports</h2></div><Link href="/events" className="text-link">View all <ArrowRight size={15} /></Link></div>
          {loading ? <div className="loading-panel"><span className="loader" /> Loading event reports…</div> : recent.length ? <div className="event-list">{recent.map((event) => <EventCard key={event.id} event={event} compact />)}</div> : <div className="empty-state">No event records are available right now.</div>}
        </div>
        <aside className="category-panel">
          <div className="section-heading small-heading"><div><span className="eyebrow">REPORT MIX</span><h2>By category</h2></div><span className="mini-icon"><Sparkles size={17} /></span></div>
{loading ? (
  <div className="skeleton-line" />
) : topCategories.length > 0 ? (
  <div className="category-bars">
    {topCategories.map(([name, count], i) => {
      const percentage = Math.max(
        7,
        (count / Math.max(...topCategories.map((item) => item[1]))) * 100
      );

      return (
        <div className="category-bar-row" key={name}>
          <div className="category-bar-label">
            <span>{name}</span>
            <b>{count}</b>
          </div>

          <div className="bar-track">
            <span
              className={`bar-fill bar-${i}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      );
    })}
  </div>
) : (
  <p className="muted-copy">
    Category summaries will appear when data loads.
  </p>
)}          <div className="category-note"><ShieldAlert size={17} /><span>Reports may not be real-time. Always consult local authorities for emergency instructions.</span></div>
        </aside>
      </section>
      <section className="closing-banner"><div className="closing-icon"><Globe2 size={22} /></div><div><h2>Explore the bigger picture.</h2><p>Browse event records by category, date, and reported location.</p></div><Link href="/events" className="button-primary">Explore events <ArrowUpRight size={17} /></Link></section>
      <p className="page-disclaimer">Data source: {source}. Event records are presented for informational and educational use. DisasterWatch is not an emergency alert service.</p>
    </div>
  );
}
