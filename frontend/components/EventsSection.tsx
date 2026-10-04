import { useEffect, useState } from "react";
import backend from "~backend/client";
import { Calendar, MapPin, Ticket, Clock } from "lucide-react";

type EventItem = Awaited<ReturnType<typeof backend.content.listEvents>>["events"][number];

export default function EventsSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backend.content.listEvents().then((res) => {
      setEvents(res.events);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <section id="events" className="py-32 px-6 bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            <Calendar className="w-5 h-5" />
            Live Performances
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white">Upcoming Events</h2>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-6" />
        </div>

        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-zinc-900 rounded-2xl animate-pulse border border-zinc-800" />
            ))}
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="text-center py-20 text-zinc-600">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No upcoming events. Stay tuned!</p>
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="space-y-4">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function EventCard({ event, index }: { event: EventItem; index: number }) {
  const date = new Date(event.date);
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const year = date.getFullYear();
  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-amber-400/30 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)] hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex-shrink-0 text-center w-20 bg-amber-400/10 rounded-xl p-3 border border-amber-400/20">
        <div className="text-amber-400 text-xs font-bold tracking-widest uppercase">{month}</div>
        <div className="text-white text-3xl font-black leading-tight">{day}</div>
        <div className="text-zinc-500 text-xs">{year}</div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold text-xl mb-2 group-hover:text-amber-400 transition-colors duration-300">
          {event.title}
        </h3>
        <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-sm">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-400/70" />
            {event.venue}, {event.city}, {event.country}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400/70" />
            {time}
          </span>
        </div>
        {event.description && (
          <p className="text-zinc-500 text-sm mt-2 line-clamp-1">{event.description}</p>
        )}
      </div>

      {event.ticketUrl && (
        <a
          href={event.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-zinc-950 text-sm font-bold tracking-wider uppercase rounded-full hover:bg-amber-300 transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]"
        >
          <Ticket className="w-4 h-4" />
          Tickets
        </a>
      )}
    </div>
  );
}
