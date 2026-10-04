import { useEffect, useState } from "react";
import backend from "~backend/client";
import { authedBackend } from "../../lib/auth";
import { Plus, Pencil, Trash2, X, Check, Calendar } from "lucide-react";

type EventItem = Awaited<ReturnType<typeof backend.content.listEvents>>["events"][number];

const emptyForm = {
  title: "",
  venue: "",
  city: "",
  country: "",
  date: "",
  ticketUrl: "",
  description: "",
};

export default function EventsAdmin() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await backend.content.listEvents();
    setEvents(res.events);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (event: EventItem) => {
    setEditing(event);
    const d = new Date(event.date);
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setForm({
      title: event.title,
      venue: event.venue,
      city: event.city,
      country: event.country,
      date: local,
      ticketUrl: event.ticketUrl,
      description: event.description,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, date: new Date(form.date).toISOString() };
      if (editing) {
        await authedBackend().content.updateEvent({ id: editing.id, ...payload });
      } else {
        await authedBackend().content.createEvent(payload);
      }
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    setDeleting(id);
    try {
      await authedBackend().content.deleteEvent({ id });
      await load();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white">Events</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-zinc-950 text-sm font-bold rounded-xl hover:bg-amber-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {showForm && (
        <EventForm
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

      {!loading && events.length === 0 && !showForm && (
        <div className="text-center py-16 text-zinc-600">
          <Calendar className="w-10 h-10 mx-auto mb-4 opacity-40" />
          <p>No events yet. Add your first event!</p>
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className="space-y-3">
          {events.map((event) => {
            const date = new Date(event.date);
            return (
              <div key={event.id} className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="w-14 flex-shrink-0 text-center bg-amber-400/10 rounded-lg p-2 border border-amber-400/20">
                  <div className="text-amber-400 text-xs font-bold">{date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}</div>
                  <div className="text-white text-xl font-black leading-tight">{date.getDate()}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-white font-semibold block truncate">{event.title}</span>
                  <span className="text-zinc-500 text-sm">{event.venue}, {event.city}, {event.country}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(event)} className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(event.id)} disabled={deleting === event.id} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EventForm({
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
  const update = (k: keyof typeof emptyForm, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="mb-6 bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
      <h3 className="text-white font-bold text-lg mb-5">{editing ? "Edit Event" : "New Event"}</h3>
      <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Event Title *" className="md:col-span-2">
          <input required value={form.title} onChange={(e) => update("title", e.target.value)} className={inputCls} placeholder="Concert / Show name" />
        </Field>
        <Field label="Venue *">
          <input required value={form.venue} onChange={(e) => update("venue", e.target.value)} className={inputCls} placeholder="Venue name" />
        </Field>
        <Field label="City *">
          <input required value={form.city} onChange={(e) => update("city", e.target.value)} className={inputCls} placeholder="City" />
        </Field>
        <Field label="Country *">
          <input required value={form.country} onChange={(e) => update("country", e.target.value)} className={inputCls} placeholder="Country" />
        </Field>
        <Field label="Date & Time *">
          <input required type="datetime-local" value={form.date} onChange={(e) => update("date", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Ticket URL" className="md:col-span-2">
          <input value={form.ticketUrl} onChange={(e) => update("ticketUrl", e.target.value)} className={inputCls} placeholder="https://tickets.example.com/..." />
        </Field>
        <Field label="Description" className="md:col-span-2">
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)} className={`${inputCls} resize-none h-20`} placeholder="Event description..." />
        </Field>
        <div className="md:col-span-2 flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-zinc-950 font-bold rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-60">
            <Check className="w-4 h-4" />
            {saving ? "Saving..." : "Save Event"}
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
