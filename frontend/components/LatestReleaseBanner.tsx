import { useEffect, useState } from "react";
import backend from "~backend/client";
import { Disc3, ExternalLink, Play } from "lucide-react";

type Release = Awaited<ReturnType<typeof backend.content.getLatestRelease>>["release"];

export default function LatestReleaseBanner() {
  const [release, setRelease] = useState<Release>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backend.content.getLatestRelease()
      .then((res) => setRelease(res.release))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !release) return null;

  return (
    <section className="py-12 px-6 bg-zinc-900/60 border-y border-amber-400/10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 bg-gradient-to-r from-amber-400/5 via-zinc-900 to-zinc-900 rounded-3xl border border-amber-400/20 p-6 md:p-8 hover:border-amber-400/40 transition-colors duration-500">
          <div className="relative flex-shrink-0">
            {release.coverImageUrl ? (
              <img
                src={release.coverImageUrl}
                alt={release.title}
                className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover shadow-2xl shadow-black/60"
              />
            ) : (
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <Disc3 className="w-12 h-12 text-amber-400/60" />
              </div>
            )}
            <div className="absolute -top-2 -right-2 bg-amber-400 text-zinc-950 text-xs font-black px-2.5 py-1 rounded-full tracking-wide uppercase">
              New
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-amber-400 text-xs font-semibold tracking-[0.3em] uppercase mb-1">Latest Release</p>
            <h3 className="text-white text-2xl md:text-3xl font-black mb-1">{release.title}</h3>
            <p className="text-zinc-500 text-sm mb-5">{release.releaseDate}</p>

            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              {release.spotifyUrl && (
                <a
                  href={release.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1DB954] text-black text-sm font-bold rounded-full hover:brightness-110 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Listen on Spotify
                </a>
              )}
              {release.youtubeUrl && (
                <a
                  href={release.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 text-white text-sm font-bold rounded-full hover:bg-zinc-700 transition-all duration-300 border border-zinc-700 hover:border-zinc-600 hover:-translate-y-0.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  Watch on YouTube
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
