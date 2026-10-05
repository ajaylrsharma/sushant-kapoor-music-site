import { useEffect, useState } from "react";
import backend from "~backend/client";
import { authedBackend } from "../../lib/auth";
import { Disc3 } from "lucide-react";
import { LoadingState, EmptyState, Field, AdminRowActions, FormActions, AdminSectionHeader, inputCls } from "./shared";

type Release = Awaited<ReturnType<typeof backend.content.listReleases>>["releases"][number];

const emptyForm = {
  title: "",
  releaseDate: "",
  coverImageUrl: "",
  spotifyUrl: "",
  youtubeUrl: "",
  isLatest: false,
};

export default function ReleasesAdmin() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Release | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await backend.content.listReleases();
    setReleases(res.releases);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (release: Release) => {
    setEditing(release);
    setForm({
      title: release.title,
      releaseDate: release.releaseDate,
      coverImageUrl: release.coverImageUrl,
      spotifyUrl: release.spotifyUrl,
      youtubeUrl: release.youtubeUrl,
      isLatest: release.isLatest,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await authedBackend().content.updateRelease({ id: editing.id, ...form });
      } else {
        await authedBackend().content.createRelease(form);
      }
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this release?")) return;
    setDeleting(id);
    try {
      await authedBackend().content.deleteRelease({ id });
      await load();
    } finally {
      setDeleting(null);
    }
  };

  const update = (k: keyof typeof emptyForm, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <AdminSectionHeader title="Releases" buttonLabel="Add Release" onClick={openCreate} />

      {showForm && (
        <div className="mb-6 bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-5">{editing ? "Edit Release" : "New Release"}</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title" required>
              <input required value={form.title} onChange={(e) => update("title", e.target.value)} className={inputCls} placeholder="Album / Single title" />
            </Field>
            <Field label="Release Date" required>
              <input required type="date" value={form.releaseDate} onChange={(e) => update("releaseDate", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Cover Image URL" className="md:col-span-2">
              <input value={form.coverImageUrl} onChange={(e) => update("coverImageUrl", e.target.value)} className={inputCls} placeholder="https://..." />
            </Field>
            <Field label="Spotify URL">
              <input value={form.spotifyUrl} onChange={(e) => update("spotifyUrl", e.target.value)} className={inputCls} placeholder="https://open.spotify.com/..." />
            </Field>
            <Field label="YouTube URL">
              <input value={form.youtubeUrl} onChange={(e) => update("youtubeUrl", e.target.value)} className={inputCls} placeholder="https://youtube.com/watch?v=..." />
            </Field>
            <div className="md:col-span-2 flex items-center gap-3">
              <input type="checkbox" id="is-latest" checked={form.isLatest} onChange={(e) => update("isLatest", e.target.checked)} className="w-4 h-4 accent-amber-400" />
              <label htmlFor="is-latest" className="text-zinc-300 text-sm">Mark as latest release (shown in hero banner)</label>
            </div>
            <FormActions saving={saving} saveLabel="Save Release" onCancel={() => setShowForm(false)} />
          </form>
        </div>
      )}

      {loading && <LoadingState />}

      {!loading && releases.length === 0 && !showForm && (
        <EmptyState icon={<Disc3 className="w-10 h-10 opacity-40" />} message="No releases yet. Add your first release!" />
      )}

      {!loading && releases.length > 0 && (
        <div className="space-y-3">
          {releases.map((release) => (
            <div key={release.id} className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex-shrink-0 overflow-hidden">
                {release.coverImageUrl ? (
                  <img src={release.coverImageUrl} alt={release.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Disc3 className="w-5 h-5 text-zinc-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold truncate">{release.title}</span>
                  {release.isLatest && <span className="text-amber-400 text-xs bg-amber-400/10 px-2 py-0.5 rounded-full">Latest</span>}
                </div>
                <div className="text-zinc-500 text-sm">{release.releaseDate}</div>
              </div>
              <AdminRowActions
                onEdit={() => openEdit(release)}
                onDelete={() => handleDelete(release.id)}
                deleting={deleting === release.id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
