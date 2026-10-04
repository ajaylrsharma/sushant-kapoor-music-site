import { useEffect, useState } from "react";
import backend from "~backend/client";
import { Music, ExternalLink, Youtube } from "lucide-react";

type Track = Awaited<ReturnType<typeof backend.content.listTracks>>["tracks"][number];

export default function MusicSection() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backend.content.listTracks().then((res) => {
      setTracks(res.tracks);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <section id="music" className="py-32 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <SectionHeader icon={<Music className="w-5 h-5" />} label="Discography" title="My Music" />

        {loading && <LoadingGrid />}

        {!loading && tracks.length === 0 && (
          <EmptyState message="No tracks added yet. Check back soon!" />
        )}

        {!loading && tracks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tracks.map((track, i) => (
              <TrackCard key={track.id} track={track} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TrackCard({ track, index }: { track: Track; index: number }) {
  return (
    <div
      className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-400/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        {track.coverImageUrl ? (
          <img
            src={track.coverImageUrl}
            alt={track.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="w-16 h-16 text-zinc-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />
        {track.featured && (
          <span className="absolute top-3 right-3 bg-amber-400 text-zinc-950 text-xs font-bold px-2 py-1 rounded-full tracking-wider">
            FEATURED
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-white font-bold text-lg mb-1 truncate">{track.title}</h3>
        <div className="flex items-center gap-2 mb-3">
          {track.genre && (
            <span className="text-amber-400 text-xs font-medium tracking-wider uppercase bg-amber-400/10 px-2 py-0.5 rounded-full">
              {track.genre}
            </span>
          )}
          {track.releaseYear > 0 && (
            <span className="text-zinc-500 text-xs">{track.releaseYear}</span>
          )}
        </div>
        {track.description && (
          <p className="text-zinc-500 text-sm line-clamp-2 mb-4">{track.description}</p>
        )}
        <div className="flex items-center gap-3">
          {track.spotifyUrl && (
            <a
              href={track.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-green-400 hover:text-green-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Spotify
            </a>
          )}
          {track.youtubeUrl && (
            <a
              href={track.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              <Youtube className="w-3.5 h-3.5" />
              YouTube
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, label, title }: { icon: React.ReactNode; label: string; title: string }) {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
        {icon}
        {label}
      </div>
      <h2 className="text-4xl md:text-5xl font-black text-white">{title}</h2>
      <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-6" />
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 animate-pulse">
          <div className="aspect-square bg-zinc-800" />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-zinc-800 rounded w-3/4" />
            <div className="h-3 bg-zinc-800 rounded w-1/3" />
            <div className="h-3 bg-zinc-800 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20 text-zinc-600">
      <Music className="w-12 h-12 mx-auto mb-4 opacity-40" />
      <p>{message}</p>
    </div>
  );
}
