import { useEffect, useState } from "react";
import backend from "~backend/client";
import { Plus, Pencil, Trash2, X, Check, Music } from "lucide-react";

type Track = Awaited<ReturnType<typeof backend.content.listTracks>>["tracks"][number];

const emptyForm = {
  title: "",
  description: "",
  genre: "",
  releaseYear: new Date().getFullYear(),
  spotifyUrl: "",
  youtubeUrl: "",
  coverImageUrl: "",
  featured: false,
};

export default function TracksAdmin() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Track | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await backend.content.listTracks();
    setTracks(res.tracks);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (track: Track) => {
    setEditing(track);
    setForm({
      title: track.title,
      description: track.description,
      genre: track.genre,
      releaseYear: track.releaseYear,
      spotifyUrl: track.spotifyUrl,
      youtubeUrl: track.youtubeUrl,
      coverImageUrl: track.coverImageUrl,
      featured: track.featured,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await backend.content.updateTrack({ id: editing.id, ...form });
      } else {
        await backend.content.createTrack(form);
      }
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this track?")) return;
    setDeleting(id);
    try {
      await backend.content.deleteTrack({ id });
      await load();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white">Music Tracks</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-zinc-950 text-sm font-bold rounded-xl hover:bg-amber-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Track
        </button>
      </div>

      {showForm && (
        <TrackForm
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          saving={saving}
          editing={!!editing}
        />
      )}

      {loading && <LoadingState />}

      {!loading && tracks.length === 0 && !showForm && (
        <EmptyState icon={<Music className="w-10 h-10 opacity-40" />} message="No tracks yet. Add your first track!" />
      )}

      {!loading && tracks.length > 0 && (
        <div className="space-y-3">
          {tracks.map((track) => (
            <div key={track.id} className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex-shrink-0 overflow-hidden">
                {track.coverImageUrl ? (
                  <img src={track.coverImageUrl} alt={track.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-5 h-5 text-zinc-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold truncate">{track.title}</span>
                  {track.featured && <span className="text-amber-400 text-xs bg-amber-400/10 px-2 py-0.5 rounded-full">Featured</span>}
                </div>
                <div className="text-zinc-500 text-sm">{track.genre} {track.releaseYear > 0 && `· ${track.releaseYear}`}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(track)}
                  className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(track.id)}
                  disabled={deleting === track.id}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
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

function TrackForm({
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
  const update = (k: keyof typeof emptyForm, v: string | number | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="mb-6 bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
      <h3 className="text-white font-bold text-lg mb-5">{editing ? "Edit Track" : "New Track"}</h3>
      <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Title *" required>
          <input required value={form.title} onChange={(e) => update("title", e.target.value)} className={inputCls} placeholder="Track title" />
        </Field>
        <Field label="Genre">
          <input value={form.genre} onChange={(e) => update("genre", e.target.value)} className={inputCls} placeholder="e.g. Pop, Rock, Jazz" />
        </Field>
        <Field label="Release Year">
          <input type="number" value={form.releaseYear} onChange={(e) => update("releaseYear", Number(e.target.value))} className={inputCls} />
        </Field>
        <Field label="Spotify URL">
          <input value={form.spotifyUrl} onChange={(e) => update("spotifyUrl", e.target.value)} className={inputCls} placeholder="https://open.spotify.com/..." />
        </Field>
        <Field label="YouTube URL">
          <input value={form.youtubeUrl} onChange={(e) => update("youtubeUrl", e.target.value)} className={inputCls} placeholder="https://youtube.com/watch?v=..." />
        </Field>
        <Field label="Cover Image URL">
          <input value={form.coverImageUrl} onChange={(e) => update("coverImageUrl", e.target.value)} className={inputCls} placeholder="https://..." />
        </Field>
        <Field label="Description" className="md:col-span-2">
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)} className={`${inputCls} resize-none h-20`} placeholder="Track description..." />
        </Field>
        <div className="md:col-span-2 flex items-center gap-3">
          <input type="checkbox" id="featured-track" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="w-4 h-4 accent-amber-400" />
          <label htmlFor="featured-track" className="text-zinc-300 text-sm">Featured track</label>
        </div>
        <div className="md:col-span-2 flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-zinc-950 font-bold rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-60">
            <Check className="w-4 h-4" />
            {saving ? "Saving..." : "Save Track"}
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

function Field({ label, children, required, className }: { label: string; children: React.ReactNode; required?: boolean; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
        {label}{required && " *"}
      </label>
      {children}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-16 bg-zinc-900 rounded-xl border border-zinc-800 animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="text-center py-16 text-zinc-600">
      <div className="flex justify-center mb-4">{icon}</div>
      <p>{message}</p>
    </div>
  );
}

const inputCls = "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition-all duration-300 text-sm";
