import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MusicSection from "./components/MusicSection";
import VideosSection from "./components/VideosSection";
import EventsSection from "./components/EventsSection";
import AboutSection from "./components/AboutSection";
import SocialSection from "./components/SocialSection";
import Footer from "./components/Footer";
import AdminPanel from "./components/admin/AdminPanel";
import AdminLogin from "./components/admin/AdminLogin";

const ADMIN_PASSWORD = "sushant2024";
const ADMIN_KEY = "sk_admin_auth";

export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  const [adminAuthed, setAdminAuthed] = useState(() => localStorage.getItem(ADMIN_KEY) === "true");

  useEffect(() => {
    const handler = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const isAdmin = hash === "#/admin";

  const handleLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_KEY, "true");
      setAdminAuthed(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY);
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
      <MusicSection />
      <VideosSection />
      <EventsSection />
      <AboutSection />
      <SocialSection />
      <Footer />
    </div>
  );
}
