import { useState, useEffect } from "react";
import { Music } from "lucide-react";

const navLinks = [
  { label: "Music", href: "#music" },
  { label: "Videos", href: "#videos" },
  { label: "Events", href: "#events" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-zinc-950/95 backdrop-blur-md border-b border-amber-500/10 shadow-lg shadow-black/40" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <Music className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-xl font-bold tracking-wider text-white">
            SUSHANT<span className="text-amber-400">.</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium tracking-widest uppercase text-zinc-400 hover:text-amber-400 transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        <button
          className="md:hidden text-zinc-400 hover:text-amber-400 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div className="flex flex-col gap-1.5">
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-zinc-950/98 border-t border-zinc-800 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium tracking-widest uppercase text-zinc-400 hover:text-amber-400 transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
