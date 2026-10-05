import { api, APIError } from "encore.dev/api";
import { db } from "./db";

interface Photo {
  id: number;
  imageUrl: string;
  caption: string;
  category: string;
  featured: boolean;
  createdAt: string;
}

interface ListPhotosResponse {
  photos: Photo[];
}

interface CreatePhotoRequest {
  imageUrl: string;
  caption: string;
  category: string;
  featured: boolean;
}

interface UpdatePhotoRequest {
  id: number;
  imageUrl: string;
  caption: string;
  category: string;
  featured: boolean;
}

interface DeletePhotoRequest {
  id: number;
}

function rowToPhoto(row: Record<string, unknown>): Photo {
  return {
    id: row.id as number,
    imageUrl: row.image_url as string,
    caption: row.caption as string,
    category: row.category as string,
    featured: row.featured as boolean,
    createdAt: (row.created_at as Date).toISOString(),
  };
}

export const listPhotos = api<void, ListPhotosResponse>(
  { expose: true, method: "GET", path: "/gallery" },
  async () => {
    const rows = await db.queryAll`SELECT * FROM gallery ORDER BY created_at DESC`;
    return { photos: rows.map(rowToPhoto) };
  }
);

export const createPhoto = api<CreatePhotoRequest, Photo>(
  { expose: true, auth: true, method: "POST", path: "/gallery" },
  async (req) => {
    const row = await db.queryRow<Record<string, unknown>>`
      INSERT INTO gallery (image_url, caption, category, featured)
      VALUES (${req.imageUrl}, ${req.caption}, ${req.category}, ${req.featured})
      RETURNING *
    `;
    return rowToPhoto(row!);
  }
);

export const updatePhoto = api<UpdatePhotoRequest, Photo>(
  { expose: true, auth: true, method: "PUT", path: "/gallery/:id" },
  async (req) => {
    const row = await db.queryRow<Record<string, unknown>>`
      UPDATE gallery SET
        image_url = ${req.imageUrl},
        caption = ${req.caption},
        category = ${req.category},
        featured = ${req.featured}
      WHERE id = ${req.id}
      RETURNING *
    `;
    if (!row) throw APIError.notFound("photo not found");
    return rowToPhoto(row);
  }
);

export const deletePhoto = api<DeletePhotoRequest, void>(
  { expose: true, auth: true, method: "DELETE", path: "/gallery/:id" },
  async (req) => {
    await db.exec`DELETE FROM gallery WHERE id = ${req.id}`;
  }
);
