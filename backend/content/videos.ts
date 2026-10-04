import { api } from "encore.dev/api";
import { db } from "./db";

interface Video {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  featured: boolean;
}

interface ListVideosResponse {
  videos: Video[];
}

interface CreateVideoRequest {
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  featured: boolean;
}

interface UpdateVideoRequest {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  featured: boolean;
}

interface DeleteVideoRequest {
  id: number;
}

function rowToVideo(row: Record<string, unknown>): Video {
  return {
    id: row.id as number,
    title: row.title as string,
    description: row.description as string,
    youtubeUrl: row.youtube_url as string,
    thumbnailUrl: row.thumbnail_url as string,
    featured: row.featured as boolean,
  };
}

export const listVideos = api<void, ListVideosResponse>(
  { expose: true, method: "GET", path: "/videos" },
  async () => {
    const rows = await db.queryAll`SELECT * FROM videos ORDER BY created_at DESC`;
    return { videos: rows.map(rowToVideo) };
  }
);

export const createVideo = api<CreateVideoRequest, Video>(
  { expose: true, method: "POST", path: "/videos" },
  async (req) => {
    const row = await db.queryRow<Record<string, unknown>>`
      INSERT INTO videos (title, description, youtube_url, thumbnail_url, featured)
      VALUES (${req.title}, ${req.description}, ${req.youtubeUrl}, ${req.thumbnailUrl}, ${req.featured})
      RETURNING *
    `;
    return rowToVideo(row!);
  }
);

export const updateVideo = api<UpdateVideoRequest, Video>(
  { expose: true, method: "PUT", path: "/videos/:id" },
  async (req) => {
    const row = await db.queryRow<Record<string, unknown>>`
      UPDATE videos SET
        title = ${req.title},
        description = ${req.description},
        youtube_url = ${req.youtubeUrl},
        thumbnail_url = ${req.thumbnailUrl},
        featured = ${req.featured},
        updated_at = NOW()
      WHERE id = ${req.id}
      RETURNING *
    `;
    return rowToVideo(row!);
  }
);

export const deleteVideo = api<DeleteVideoRequest, void>(
  { expose: true, method: "DELETE", path: "/videos/:id" },
  async (req) => {
    await db.exec`DELETE FROM videos WHERE id = ${req.id}`;
  }
);
