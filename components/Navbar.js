"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, ListFilter, MapPinned, Info } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/events", label: "All events", icon: ListFilter },
  { href: "/map", label: "World map", icon: MapPinned },
  { href: "/about", label: "About", icon: Info }
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="topbar">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <span className="brand-mark"><Activity size={21} strokeWidth={2.5} /></span>
          <span>Disaster<span className="brand-accent">Watch</span><small>GLOBAL NATURAL EVENTS MONITOR</small></span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`nav-link ${pathname === href ? "active" : ""}`}>
              <Icon size={16} /> <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="live-pill"><span className="pulse-dot" /> EVENT MONITOR</div>
      </div>
    </header>
  );
}
