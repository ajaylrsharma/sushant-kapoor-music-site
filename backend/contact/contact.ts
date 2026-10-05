import { api, APIError } from "encore.dev/api";
import { db } from "./db";

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  id: number;
}

interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface ListInquiriesResponse {
  inquiries: Inquiry[];
}

interface MarkReadRequest {
  id: number;
  read: boolean;
}

interface DeleteInquiryRequest {
  id: number;
}

function rowToInquiry(row: Record<string, unknown>): Inquiry {
  return {
    id: row.id as number,
    name: row.name as string,
    email: row.email as string,
    subject: row.subject as string,
    message: row.message as string,
    read: row.read as boolean,
    createdAt: (row.created_at as Date).toISOString(),
  };
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const submitContact = api<ContactRequest, ContactResponse>(
  { expose: true, method: "POST", path: "/contact" },
  async (req) => {
    if (!req.name.trim()) throw APIError.invalidArgument("name is required");
    if (!req.email.trim()) throw APIError.invalidArgument("email is required");
    if (!validateEmail(req.email)) throw APIError.invalidArgument("invalid email address");
    if (!req.subject.trim()) throw APIError.invalidArgument("subject is required");
    if (!req.message.trim()) throw APIError.invalidArgument("message is required");
    if (req.message.trim().length < 10) throw APIError.invalidArgument("message must be at least 10 characters");

    const row = await db.queryRow<Record<string, unknown>>`
      INSERT INTO inquiries (name, email, subject, message)
      VALUES (${req.name.trim()}, ${req.email.trim()}, ${req.subject.trim()}, ${req.message.trim()})
      RETURNING id
    `;
    return { id: row!.id as number };
  }
);

export const listInquiries = api<void, ListInquiriesResponse>(
  { expose: true, auth: true, method: "GET", path: "/contact/inquiries" },
  async () => {
    const rows = await db.queryAll`SELECT * FROM inquiries ORDER BY created_at DESC`;
    return { inquiries: rows.map(rowToInquiry) };
  }
);

export const markRead = api<MarkReadRequest, Inquiry>(
  { expose: true, auth: true, method: "PUT", path: "/contact/inquiries/:id" },
  async (req) => {
    const row = await db.queryRow<Record<string, unknown>>`
      UPDATE inquiries SET read = ${req.read} WHERE id = ${req.id} RETURNING *
    `;
    if (!row) throw APIError.notFound("inquiry not found");
    return rowToInquiry(row);
  }
);

export const deleteInquiry = api<DeleteInquiryRequest, void>(
  { expose: true, auth: true, method: "DELETE", path: "/contact/inquiries/:id" },
  async (req) => {
    await db.exec`DELETE FROM inquiries WHERE id = ${req.id}`;
  }
);
