import { useEffect, useState } from "react";
import backend from "~backend/client";
import { authedBackend } from "../../lib/auth";
import { Calendar } from "lucide-react";
import { LoadingState, EmptyState, Field, AdminRowActions, FormActions, AdminSectionHeader, inputCls } from "./shared";

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

  const update = (k: keyof typeof emptyForm, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <AdminSectionHeader title="Events" buttonLabel="Add Event" onClick={openCreate} />

      {showForm && (
        <div className="mb-6 bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-5">{editing ? "Edit Event" : "New Event"}</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Event Title" required className="md:col-span-2">
              <input required value={form.title} onChange={(e) => update("title", e.target.value)} className={inputCls} placeholder="Concert / Show name" />
            </Field>
            <Field label="Venue" required>
              <input required value={form.venue} onChange={(e) => update("venue", e.target.value)} className={inputCls} placeholder="Venue name" />
            </Field>
            <Field label="City" required>
              <input required value={form.city} onChange={(e) => update("city", e.target.value)} className={inputCls} placeholder="City" />
            </Field>
            <Field label="Country" required>
              <input required value={form.country} onChange={(e) => update("country", e.target.value)} className={inputCls} placeholder="Country" />
            </Field>
            <Field label="Date & Time" required>
              <input required type="datetime-local" value={form.date} onChange={(e) => update("date", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Ticket URL" className="md:col-span-2">
              <input value={form.ticketUrl} onChange={(e) => update("ticketUrl", e.target.value)} className={inputCls} placeholder="https://tickets.example.com/..." />
            </Field>
            <Field label="Description" className="md:col-span-2">
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} className={`${inputCls} resize-none h-20`} placeholder="Event description..." />
            </Field>
            <FormActions saving={saving} saveLabel="Save Event" onCancel={() => setShowForm(false)} />
          </form>
        </div>
      )}

      {loading && <LoadingState />}

      {!loading && events.length === 0 && !showForm && (
        <EmptyState icon={<Calendar className="w-10 h-10 opacity-40" />} message="No events yet. Add your first event!" />
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
                <AdminRowActions
                  onEdit={() => openEdit(event)}
                  onDelete={() => handleDelete(event.id)}
                  deleting={deleting === event.id}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
