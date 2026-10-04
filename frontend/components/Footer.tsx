import { Music } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-amber-400" />
          <span className="text-white font-bold tracking-wider">
            SUSHANT<span className="text-amber-400">.</span>
          </span>
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
