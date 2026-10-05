import { useState, useEffect } from "react";
import { Music } from "lucide-react";

const navLinks = [
  { label: "Music", href: "#music" },
  { label: "Videos", href: "#videos" },
  { label: "Gallery", href: "#gallery" },
  { label: "Events", href: "#events" },
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
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

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-medium tracking-widest uppercase text-zinc-400 hover:text-amber-400 transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden lg:block px-5 py-2 bg-amber-400 text-zinc-950 font-bold text-xs tracking-widest uppercase rounded-full hover:bg-amber-300 transition-all duration-300 hover:-translate-y-0.5"
        >
          Book Now
        </a>

        <button
          className="lg:hidden text-zinc-400 hover:text-amber-400 transition-colors"
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
        <div className="lg:hidden bg-zinc-950/98 border-t border-zinc-800 px-6 py-4 flex flex-col gap-4">
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
