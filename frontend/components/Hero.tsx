import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface Note {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  symbol: string;
  drift: number;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const notesRef = useRef<Note[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const symbols = ["♩", "♪", "♫", "♬", "𝄞", "𝄢", "♭", "♯"];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    notesRef.current = Array.from({ length: 35 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: 0.3 + Math.random() * 0.6,
      size: 14 + Math.random() * 22,
      opacity: 0.04 + Math.random() * 0.1,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      drift: (Math.random() - 0.5) * 0.4,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      notesRef.current.forEach((note) => {
        ctx.font = `${note.size}px serif`;
        ctx.fillStyle = `rgba(251, 191, 36, ${note.opacity})`;
        ctx.fillText(note.symbol, note.x, note.y);
        note.y -= note.speed;
        note.x += note.drift;
        if (note.y < -30) {
          note.y = canvas.height + 30;
          note.x = Math.random() * canvas.width;
        }
        if (note.x < -30) note.x = canvas.width + 30;
        if (note.x > canvas.width + 30) note.x = -30;
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(251,191,36,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 80% 80%, rgba(120,53,15,0.12) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <p className="text-amber-400 text-sm font-semibold tracking-[0.4em] uppercase mb-6 opacity-0 animate-[fadeInDown_0.8s_0.2s_forwards]">
          ♪ Official Website ♪
        </p>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6 opacity-0 animate-[fadeInDown_0.8s_0.4s_forwards]">
          <span className="text-white">SUSHANT</span>
          <br />
          <span className="text-amber-400">KAPOOR</span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 font-light tracking-widest mb-12 opacity-0 animate-[fadeInDown_0.8s_0.6s_forwards]">
          Where Music Meets Soul
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-[fadeInDown_0.8s_0.8s_forwards]">
          <a
            href="#music"
            className="px-8 py-4 bg-amber-400 text-zinc-950 font-bold text-sm tracking-widest uppercase rounded-full hover:bg-amber-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:-translate-y-0.5"
          >
            Explore Music
          </a>
          <a
            href="#videos"
            className="px-8 py-4 border border-amber-400/40 text-amber-400 font-bold text-sm tracking-widest uppercase rounded-full hover:bg-amber-400/10 hover:border-amber-400 transition-all duration-300 hover:-translate-y-0.5"
          >
            Watch Videos
          </a>
        </div>
      </div>

      <a
        href="#music"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-amber-400/60 hover:text-amber-400 transition-colors animate-bounce"
      >
        <ChevronDown className="w-8 h-8" />
      </a>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
