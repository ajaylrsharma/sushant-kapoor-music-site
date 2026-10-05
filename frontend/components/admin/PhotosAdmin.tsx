import { useEffect, useState } from "react";
import backend from "~backend/client";
import { authedBackend } from "../../lib/auth";
import { ImageIcon } from "lucide-react";
import { LoadingState, EmptyState, Field, AdminRowActions, FormActions, AdminSectionHeader, inputCls } from "./shared";

type Photo = Awaited<ReturnType<typeof backend.content.listPhotos>>["photos"][number];

const emptyForm = {
  imageUrl: "",
  caption: "",
  category: "",
  featured: false,
};

export default function PhotosAdmin() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Photo | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await backend.content.listPhotos();
    setPhotos(res.photos);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (photo: Photo) => {
    setEditing(photo);
    setForm({
      imageUrl: photo.imageUrl,
      caption: photo.caption,
      category: photo.category,
      featured: photo.featured,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await authedBackend().content.updatePhoto({ id: editing.id, ...form });
      } else {
        await authedBackend().content.createPhoto(form);
      }
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this photo?")) return;
    setDeleting(id);
    try {
      await authedBackend().content.deletePhoto({ id });
      await load();
    } finally {
      setDeleting(null);
    }
  };

  const update = (k: keyof typeof emptyForm, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <AdminSectionHeader title="Gallery Photos" buttonLabel="Add Photo" onClick={openCreate} />

      {showForm && (
        <div className="mb-6 bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-5">{editing ? "Edit Photo" : "New Photo"}</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Image URL" required className="md:col-span-2">
              <input required value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} className={inputCls} placeholder="https://..." />
            </Field>
            <Field label="Caption">
              <input value={form.caption} onChange={(e) => update("caption", e.target.value)} className={inputCls} placeholder="Photo caption..." />
            </Field>
            <Field label="Category">
              <input value={form.category} onChange={(e) => update("category", e.target.value)} className={inputCls} placeholder="e.g. Live, Studio, Events" />
            </Field>
            <div className="md:col-span-2 flex items-center gap-3">
              <input type="checkbox" id="featured-photo" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="w-4 h-4 accent-amber-400" />
              <label htmlFor="featured-photo" className="text-zinc-300 text-sm">Featured photo</label>
            </div>
            <FormActions saving={saving} saveLabel="Save Photo" onCancel={() => setShowForm(false)} />
          </form>
        </div>
      )}

      {loading && <LoadingState />}

      {!loading && photos.length === 0 && !showForm && (
        <EmptyState icon={<ImageIcon className="w-10 h-10 opacity-40" />} message="No photos yet. Add your first photo!" />
      )}

      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors aspect-square">
              {photo.imageUrl ? (
                <img src={photo.imageUrl} alt={photo.caption} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-zinc-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end gap-1.5">
                  <AdminRowActions
                    onEdit={() => openEdit(photo)}
                    onDelete={() => handleDelete(photo.id)}
                    deleting={deleting === photo.id}
                  />
                </div>
                <div>
                  {photo.featured && <span className="text-amber-400 text-xs bg-amber-400/10 px-2 py-0.5 rounded-full">Featured</span>}
                  {photo.caption && <p className="text-white text-xs mt-1 truncate">{photo.caption}</p>}
                  {photo.category && <p className="text-zinc-400 text-xs">{photo.category}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
