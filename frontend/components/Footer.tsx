import { Music, Instagram, Facebook, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-10 px-6 pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-amber-400" />
          <span className="text-white font-bold tracking-wider">
            SUSHANT<span className="text-amber-400">.</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://instagram.com/sushantkapoor76" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-zinc-600 hover:text-pink-400 transition-colors duration-300">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="https://facebook.com/sushantkapoor76" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-zinc-600 hover:text-blue-400 transition-colors duration-300">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="https://linkedin.com/in/sushantkapoor" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-zinc-600 hover:text-blue-400 transition-colors duration-300">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>

        <p className="text-zinc-600 text-sm text-center">
          © {new Date().getFullYear()} Sushant Kapoor. All rights reserved.
        </p>
        <a
          href="#/admin"
          className="text-zinc-700 text-xs hover:text-zinc-500 transition-colors duration-300 tracking-wider"
        >
          Admin
        </a>
      </div>
    </footer>
  );
}
