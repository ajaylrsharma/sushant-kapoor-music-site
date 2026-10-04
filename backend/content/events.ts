import { api } from "encore.dev/api";
import { db } from "./db";

interface Event {
  id: number;
  title: string;
  venue: string;
  city: string;
  country: string;
  date: string;
  ticketUrl: string;
  description: string;
}

interface ListEventsResponse {
  events: Event[];
}

interface CreateEventRequest {
  title: string;
  venue: string;
  city: string;
  country: string;
  date: string;
  ticketUrl: string;
  description: string;
}

interface UpdateEventRequest {
  id: number;
  title: string;
  venue: string;
  city: string;
  country: string;
  date: string;
  ticketUrl: string;
  description: string;
}

interface DeleteEventRequest {
  id: number;
}

function rowToEvent(row: Record<string, unknown>): Event {
  return {
    id: row.id as number,
    title: row.title as string,
    venue: row.venue as string,
    city: row.city as string,
    country: row.country as string,
    date: (row.date as Date).toISOString(),
    ticketUrl: row.ticket_url as string,
    description: row.description as string,
  };
}

export const listEvents = api<void, ListEventsResponse>(
  { expose: true, method: "GET", path: "/events" },
  async () => {
    const rows = await db.queryAll`SELECT * FROM events ORDER BY date ASC`;
    return { events: rows.map(rowToEvent) };
  }
);

export const createEvent = api<CreateEventRequest, Event>(
  { expose: true, auth: true, method: "POST", path: "/events" },
  async (req) => {
    const row = await db.queryRow<Record<string, unknown>>`
      INSERT INTO events (title, venue, city, country, date, ticket_url, description)
      VALUES (${req.title}, ${req.venue}, ${req.city}, ${req.country}, ${req.date}, ${req.ticketUrl}, ${req.description})
      RETURNING *
    `;
    return rowToEvent(row!);
  }
);

export const updateEvent = api<UpdateEventRequest, Event>(
  { expose: true, auth: true, method: "PUT", path: "/events/:id" },
  async (req) => {
    const row = await db.queryRow<Record<string, unknown>>`
      UPDATE events SET
        title = ${req.title},
        venue = ${req.venue},
        city = ${req.city},
        country = ${req.country},
        date = ${req.date},
        ticket_url = ${req.ticketUrl},
        description = ${req.description},
        updated_at = NOW()
      WHERE id = ${req.id}
      RETURNING *
    `;
    return rowToEvent(row!);
  }
);

export const deleteEvent = api<DeleteEventRequest, void>(
  { expose: true, auth: true, method: "DELETE", path: "/events/:id" },
  async (req) => {
    await db.exec`DELETE FROM events WHERE id = ${req.id}`;
  }
);
