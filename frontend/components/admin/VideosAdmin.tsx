import { useEffect, useState } from "react";
import backend from "~backend/client";
import { authedBackend } from "../../lib/auth";
import { Plus, Pencil, Trash2, X, Check, Video } from "lucide-react";

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white">Videos</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-zinc-950 text-sm font-bold rounded-xl hover:bg-amber-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Video
        </button>
      </div>

      {showForm && (
        <VideoForm
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          saving={saving}
          editing={!!editing}
        />
      )}

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-zinc-900 rounded-xl border border-zinc-800 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && videos.length === 0 && !showForm && (
        <div className="text-center py-16 text-zinc-600">
          <Video className="w-10 h-10 mx-auto mb-4 opacity-40" />
          <p>No videos yet. Add your first video!</p>
        </div>
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
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(video)} className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(video.id)} disabled={deleting === video.id} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VideoForm({
  form,
  setForm,
  onSave,
  onCancel,
  saving,
  editing,
}: {
  form: typeof emptyForm;
  setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
  saving: boolean;
  editing: boolean;
}) {
  const update = (k: keyof typeof emptyForm, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="mb-6 bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
      <h3 className="text-white font-bold text-lg mb-5">{editing ? "Edit Video" : "New Video"}</h3>
      <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Title *">
          <input required value={form.title} onChange={(e) => update("title", e.target.value)} className={inputCls} placeholder="Video title" />
        </Field>
        <Field label="YouTube URL *">
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
        <div className="md:col-span-2 flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-zinc-950 font-bold rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-60">
            <Check className="w-4 h-4" />
            {saving ? "Saving..." : "Save Video"}
          </button>
          <button type="button" onClick={onCancel} className="flex items-center gap-2 px-6 py-2.5 bg-zinc-800 text-zinc-300 font-bold rounded-xl hover:bg-zinc-700 transition-colors">
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition-all duration-300 text-sm";
