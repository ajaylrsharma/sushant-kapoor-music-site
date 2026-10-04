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
import { loginAdmin, isAuthenticated, clearToken } from "./lib/auth";

export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  const [adminAuthed, setAdminAuthed] = useState(() => isAuthenticated());

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
      <MusicSection />
      <VideosSection />
      <EventsSection />
      <AboutSection />
      <SocialSection />
      <Footer />
    </div>
  );
}
