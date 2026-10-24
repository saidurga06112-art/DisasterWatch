import "./globals.css";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "DisasterWatch | Global Natural Events Monitor",
  description: "Explore natural-event reports from NASA EONET in a clear, interactive dashboard."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="site-main">{children}</main>
        <footer className="site-footer">
          <div className="footer-inner">
            <span className="footer-brand"><span className="brand-mark small">D</span> DisasterWatch</span>
            <span>Natural-event reports for exploration and awareness — not an emergency alert service.</span>
            <span>Data integration: NASA EONET</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
