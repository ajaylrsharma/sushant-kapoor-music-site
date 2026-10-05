import { useEffect, useState } from "react";
import backend from "~backend/client";
import { authedBackend } from "../../lib/auth";
import { Video } from "lucide-react";
import { LoadingState, EmptyState, Field, AdminRowActions, FormActions, AdminSectionHeader, inputCls } from "./shared";

type VideoItem = Awaited<ReturnType<typeof backend.content.listVideos>>["videos"][number];

const emptyForm = {
  title: "",
  description: "",
  youtubeUrl: "",
  thumbnailUrl: "",
  featured: false,
};

export default function VideosAdmin() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<VideoItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await backend.content.listVideos();
    setVideos(res.videos);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (video: VideoItem) => {
    setEditing(video);
    setForm({
      title: video.title,
      description: video.description,
      youtubeUrl: video.youtubeUrl,
      thumbnailUrl: video.thumbnailUrl,
      featured: video.featured,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await authedBackend().content.updateVideo({ id: editing.id, ...form });
      } else {
        await authedBackend().content.createVideo(form);
      }
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this video?")) return;
    setDeleting(id);
    try {
      await authedBackend().content.deleteVideo({ id });
      await load();
    } finally {
      setDeleting(null);
    }
  };

  const update = (k: keyof typeof emptyForm, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <AdminSectionHeader title="Videos" buttonLabel="Add Video" onClick={openCreate} />

      {showForm && (
        <div className="mb-6 bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-5">{editing ? "Edit Video" : "New Video"}</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title" required>
              <input required value={form.title} onChange={(e) => update("title", e.target.value)} className={inputCls} placeholder="Video title" />
            </Field>
            <Field label="YouTube URL" required>
              <input required value={form.youtubeUrl} onChange={(e) => update("youtubeUrl", e.target.value)} className={inputCls} placeholder="https://youtube.com/watch?v=..." />
            </Field>
            <Field label="Thumbnail URL" className="md:col-span-2">
              <input value={form.thumbnailUrl} onChange={(e) => update("thumbnailUrl", e.target.value)} className={inputCls} placeholder="https://... (leave blank to use YouTube thumbnail)" />
            </Field>
            <Field label="Description" className="md:col-span-2">
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} className={`${inputCls} resize-none h-20`} placeholder="Video description..." />
            </Field>
            <div className="md:col-span-2 flex items-center gap-3">
              <input type="checkbox" id="featured-video" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="w-4 h-4 accent-amber-400" />
              <label htmlFor="featured-video" className="text-zinc-300 text-sm">Featured video</label>
            </div>
            <FormActions saving={saving} saveLabel="Save Video" onCancel={() => setShowForm(false)} />
          </form>
        </div>
      )}

      {loading && <LoadingState />}

      {!loading && videos.length === 0 && !showForm && (
        <EmptyState icon={<Video className="w-10 h-10 opacity-40" />} message="No videos yet. Add your first video!" />
      )}

      {!loading && videos.length > 0 && (
        <div className="space-y-3">
          {videos.map((video) => (
            <div key={video.id} className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-20 h-12 rounded-lg bg-zinc-800 flex-shrink-0 overflow-hidden">
                {video.thumbnailUrl ? (
                  <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-5 h-5 text-zinc-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold truncate">{video.title}</span>
                  {video.featured && <span className="text-amber-400 text-xs bg-amber-400/10 px-2 py-0.5 rounded-full">Featured</span>}
                </div>
                <div className="text-zinc-500 text-xs truncate mt-0.5">{video.youtubeUrl}</div>
              </div>
              <AdminRowActions
                onEdit={() => openEdit(video)}
                onDelete={() => handleDelete(video.id)}
                deleting={deleting === video.id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
