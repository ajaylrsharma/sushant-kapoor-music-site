import { useEffect, useState } from "react";
import backend from "~backend/client";
import { ImageIcon } from "lucide-react";

type Photo = Awaited<ReturnType<typeof backend.content.listPhotos>>["photos"][number];

export default function PhotosSection() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backend.content.listPhotos()
      .then((res) => setPhotos(res.photos))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean)))];
  const filtered = activeCategory === "All" ? photos : photos.filter((p) => p.category === activeCategory);

  if (!loading && photos.length === 0) return null;

  return (
    <section id="gallery" className="py-32 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            <ImageIcon className="w-5 h-5" />
            Gallery
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white">Photo Gallery</h2>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-6" />
        </div>

        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-amber-400 text-zinc-950"
                    : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="break-inside-avoid rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse" style={{ height: `${160 + (i % 3) * 60}px` }} />
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((photo) => (
              <div
                key={photo.id}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-amber-400/30 transition-all duration-300"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || "Gallery photo"}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {(photo.caption || photo.category) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    {photo.featured && (
                      <span className="absolute top-3 right-3 text-amber-400 text-xs bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full">Featured</span>
                    )}
                    <div>
                      {photo.caption && <p className="text-white text-sm font-semibold">{photo.caption}</p>}
                      {photo.category && <p className="text-zinc-400 text-xs">{photo.category}</p>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
