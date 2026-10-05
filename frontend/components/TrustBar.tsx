import { Music2, Mic2, Star, Users } from "lucide-react";

const stats = [
  { icon: <Star className="w-5 h-5" />, value: "10+", label: "Years Active" },
  { icon: <Mic2 className="w-5 h-5" />, value: "100+", label: "Live Shows" },
  { icon: <Music2 className="w-5 h-5" />, value: "50+", label: "Tracks" },
  { icon: <Users className="w-5 h-5" />, value: "5★", label: "Google Rating" },
];

export default function TrustBar() {
  return (
    <div className="bg-zinc-900/80 border-y border-zinc-800/60 py-6 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2 text-center">
              <div className="text-amber-400">{stat.icon}</div>
              <div className="text-white text-2xl font-black">{stat.value}</div>
              <div className="text-zinc-500 text-xs tracking-widest uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
