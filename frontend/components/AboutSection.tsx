import { Music2, Mic2, Star } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-32 px-6 bg-zinc-900/40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            <Star className="w-5 h-5" />
            The Artist
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white">About Sushant</h2>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-6" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-800 relative">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(251,191,36,0.15) 0%, rgba(10,10,10,0.9) 100%)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-9xl mb-4">🎵</div>
                  <div className="text-amber-400/60 text-lg tracking-widest uppercase font-semibold">
                    Sushant Kapoor
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-amber-400/10 border border-amber-400/20 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="text-amber-400 text-3xl font-black">♪</div>
                <div className="text-zinc-400 text-xs mt-1 tracking-wider">LIVE</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-black text-white mb-4">
                A Journey Through <span className="text-amber-400">Sound</span>
              </h3>
              <div className="space-y-4 text-zinc-400 leading-relaxed">
                <p>
                  Sushant Kapoor is a passionate musician whose music transcends boundaries, 
                  blending soulful melodies with contemporary beats to create an unforgettable 
                  listening experience. With a deep-rooted love for music that began at a young age, 
                  Sushant has crafted a unique sound that resonates with audiences across the globe.
                </p>
                <p>
                  His artistry is a seamless fusion of classical influences and modern production, 
                  resulting in tracks that speak directly to the heart. Whether performing live on 
                  stage or crafting intricate studio recordings, Sushant brings an unparalleled 
                  energy and authenticity to every note.
                </p>
                <p>
                  Through years of dedication and relentless pursuit of musical excellence, 
                  Sushant has established himself as a versatile artist — a songwriter, performer, 
                  and storyteller who uses music as a bridge between cultures and emotions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: <Music2 className="w-5 h-5" />, label: "Tracks", value: "50+" },
                { icon: <Mic2 className="w-5 h-5" />, label: "Live Shows", value: "100+" },
                { icon: <Star className="w-5 h-5" />, label: "Years Active", value: "10+" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center hover:border-amber-400/30 transition-colors duration-300"
                >
                  <div className="text-amber-400 flex justify-center mb-2">{stat.icon}</div>
                  <div className="text-white text-2xl font-black">{stat.value}</div>
                  <div className="text-zinc-500 text-xs tracking-wider uppercase mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
