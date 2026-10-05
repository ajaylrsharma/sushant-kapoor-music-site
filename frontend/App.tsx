import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import LatestReleaseBanner from "./components/LatestReleaseBanner";
import MusicSection from "./components/MusicSection";
import VideosSection from "./components/VideosSection";
import PhotosSection from "./components/PhotosSection";
import EventsSection from "./components/EventsSection";
import AboutSection from "./components/AboutSection";
import PricingSection from "./components/PricingSection";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import AdminPanel from "./components/admin/AdminPanel";
import AdminLogin from "./components/admin/AdminLogin";
import { loginAdmin, isAuthenticated, clearToken } from "./lib/auth";

function injectSEO() {
  document.title = "Sushant Kapoor — Official Music Site | Helsinki";
  const setMeta = (name: string, content: string, prop = false) => {
    const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let el = document.querySelector(sel) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement("meta");
      prop ? el.setAttribute("property", name) : el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };
  setMeta("description", "Sushant Kapoor — musician, live performer & recording artist based in Helsinki. Book for events, weddings & corporate shows.");
  setMeta("keywords", "Sushant Kapoor, musician Helsinki, live music Finland, Bollywood artist, wedding singer Helsinki");
  setMeta("og:title", "Sushant Kapoor — Official Music Site", true);
  setMeta("og:description", "Live performer & recording artist based in Helsinki, Finland. Bollywood, pop & fusion.", true);
  setMeta("og:type", "website", true);
  setMeta("og:url", "https://sushantkapoor.com", true);
  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", "Sushant Kapoor — Official Music Site");
  setMeta("twitter:description", "Live performer & recording artist based in Helsinki, Finland.");

  const existing = document.querySelector('script[type="application/ld+json"]');
  if (!existing) {
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MusicGroup",
      "name": "Sushant Kapoor",
      "url": "https://sushantkapoor.com",
      "description": "Musician, live performer & recording artist based in Helsinki, Finland.",
      "address": { "@type": "PostalAddress", "addressLocality": "Helsinki", "addressCountry": "FI" },
      "sameAs": [
        "https://instagram.com/sushantkapoor76",
        "https://facebook.com/sushantkapoor76",
        "https://linkedin.com/in/sushantkapoor"
      ],
    });
    document.head.appendChild(ld);
  }
}

export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  const [adminAuthed, setAdminAuthed] = useState(() => isAuthenticated());

  useEffect(() => { injectSEO(); }, []);

  useEffect(() => {
    const handler = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const isAdmin = hash === "#/admin";

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    const ok = await loginAdmin(username, password);
    if (ok) setAdminAuthed(true);
    return ok;
  };

  const handleLogout = () => {
    clearToken();
    setAdminAuthed(false);
    window.location.hash = "";
  };

  if (isAdmin) {
    if (!adminAuthed) return <AdminLogin onLogin={handleLogin} />;
    return <AdminPanel onLogout={handleLogout} />;
  }

  return (
    <div className="dark bg-zinc-950 text-white min-h-screen">
      <Navbar />
      <Hero />
      <TrustBar />
      <LatestReleaseBanner />
      <MusicSection />
      <VideosSection />
      <PhotosSection />
      <EventsSection />
      <AboutSection />
      <PricingSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      <FloatingActions />
    </div>
  );
}
