import { useEffect, useState } from "react";
import backend from "~backend/client";
import { authedBackend } from "../../lib/auth";
import { Music } from "lucide-react";
import { LoadingState, EmptyState, Field, AdminRowActions, FormActions, AdminSectionHeader, inputCls } from "./shared";

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
        await authedBackend().content.updateTrack({ id: editing.id, ...form });
      } else {
        await authedBackend().content.createTrack(form);
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
      await authedBackend().content.deleteTrack({ id });
      await load();
    } finally {
      setDeleting(null);
    }
  };

  const update = (k: keyof typeof emptyForm, v: string | number | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <AdminSectionHeader title="Music Tracks" buttonLabel="Add Track" onClick={openCreate} />

      {showForm && (
        <div className="mb-6 bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-5">{editing ? "Edit Track" : "New Track"}</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title" required>
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
            <FormActions saving={saving} saveLabel="Save Track" onCancel={() => setShowForm(false)} />
          </form>
        </div>
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
              <AdminRowActions
                onEdit={() => openEdit(track)}
                onDelete={() => handleDelete(track.id)}
                deleting={deleting === track.id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
