import { useEffect, useState } from "react";
import backend from "~backend/client";
import { Video, Play } from "lucide-react";

type VideoItem = Awaited<ReturnType<typeof backend.content.listVideos>>["videos"][number];

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function VideosSection() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    backend.content.listVideos().then((res) => {
      setVideos(res.videos);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <section id="videos" className="py-32 px-6 bg-zinc-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            <Video className="w-5 h-5" />
            Watch & Listen
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white">Videos</h2>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-6" />
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-zinc-800 animate-pulse aspect-video" />
            ))}
          </div>
        )}

        {!loading && videos.length === 0 && (
          <div className="text-center py-20 text-zinc-600">
            <Play className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No videos added yet. Check back soon!</p>
          </div>
        )}

        {!loading && videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, i) => {
              const videoId = extractYouTubeId(video.youtubeUrl);
              return (
                <VideoCard
                  key={video.id}
                  video={video}
                  videoId={videoId}
                  index={i}
                  isActive={active === String(video.id)}
                  onActivate={() => setActive(String(video.id))}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function VideoCard({
  video,
  videoId,
  index,
  isActive,
  onActivate,
}: {
  video: VideoItem;
  videoId: string | null;
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  const thumbnail = video.thumbnailUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "");

  return (
    <div
      className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-400/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative aspect-video overflow-hidden bg-zinc-800">
        {isActive && videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <button className="w-full h-full relative" onClick={onActivate}>
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <Play className="w-12 h-12 text-zinc-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-400/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Play className="w-7 h-7 text-zinc-950 ml-1" fill="currentColor" />
              </div>
            </div>
          </button>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-white font-bold text-base mb-1">{video.title}</h3>
        {video.description && (
          <p className="text-zinc-500 text-sm line-clamp-2">{video.description}</p>
        )}
        {video.featured && (
          <span className="inline-block mt-2 text-amber-400 text-xs font-bold tracking-wider uppercase">
            ★ Featured
          </span>
        )}
      </div>
    </div>
  );
}
