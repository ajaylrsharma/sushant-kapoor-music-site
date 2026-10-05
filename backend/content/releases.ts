import { api, APIError } from "encore.dev/api";
import { db } from "./db";

interface Release {
  id: number;
  title: string;
  releaseDate: string;
  coverImageUrl: string;
  spotifyUrl: string;
  youtubeUrl: string;
  isLatest: boolean;
}

interface ListReleasesResponse {
  releases: Release[];
}

interface CreateReleaseRequest {
  title: string;
  releaseDate: string;
  coverImageUrl: string;
  spotifyUrl: string;
  youtubeUrl: string;
  isLatest: boolean;
}

interface UpdateReleaseRequest {
  id: number;
  title: string;
  releaseDate: string;
  coverImageUrl: string;
  spotifyUrl: string;
  youtubeUrl: string;
  isLatest: boolean;
}

interface DeleteReleaseRequest {
  id: number;
}

function rowToRelease(row: Record<string, unknown>): Release {
  return {
    id: row.id as number,
    title: row.title as string,
    releaseDate: row.release_date as string,
    coverImageUrl: row.cover_image_url as string,
    spotifyUrl: row.spotify_url as string,
    youtubeUrl: row.youtube_url as string,
    isLatest: row.is_latest as boolean,
  };
}

export const listReleases = api<void, ListReleasesResponse>(
  { expose: true, method: "GET", path: "/releases" },
  async () => {
    const rows = await db.queryAll`SELECT * FROM releases ORDER BY created_at DESC`;
    return { releases: rows.map(rowToRelease) };
  }
);

export const getLatestRelease = api<void, { release: Release | null }>(
  { expose: true, method: "GET", path: "/releases/latest" },
  async () => {
    const row = await db.queryRow<Record<string, unknown>>`
      SELECT * FROM releases WHERE is_latest = TRUE ORDER BY created_at DESC LIMIT 1
    `;
    return { release: row ? rowToRelease(row) : null };
  }
);

export const createRelease = api<CreateReleaseRequest, Release>(
  { expose: true, auth: true, method: "POST", path: "/releases" },
  async (req) => {
    if (req.isLatest) {
      await db.exec`UPDATE releases SET is_latest = FALSE`;
    }
    const row = await db.queryRow<Record<string, unknown>>`
      INSERT INTO releases (title, release_date, cover_image_url, spotify_url, youtube_url, is_latest)
      VALUES (${req.title}, ${req.releaseDate}, ${req.coverImageUrl}, ${req.spotifyUrl}, ${req.youtubeUrl}, ${req.isLatest})
      RETURNING *
    `;
    return rowToRelease(row!);
  }
);

export const updateRelease = api<UpdateReleaseRequest, Release>(
  { expose: true, auth: true, method: "PUT", path: "/releases/:id" },
  async (req) => {
    if (req.isLatest) {
      await db.exec`UPDATE releases SET is_latest = FALSE WHERE id != ${req.id}`;
    }
    const row = await db.queryRow<Record<string, unknown>>`
      UPDATE releases SET
        title = ${req.title},
        release_date = ${req.releaseDate},
        cover_image_url = ${req.coverImageUrl},
        spotify_url = ${req.spotifyUrl},
        youtube_url = ${req.youtubeUrl},
        is_latest = ${req.isLatest},
        updated_at = NOW()
      WHERE id = ${req.id}
      RETURNING *
    `;
    if (!row) throw APIError.notFound("release not found");
    return rowToRelease(row);
  }
);

export const deleteRelease = api<DeleteReleaseRequest, void>(
  { expose: true, auth: true, method: "DELETE", path: "/releases/:id" },
  async (req) => {
    await db.exec`DELETE FROM releases WHERE id = ${req.id}`;
  }
);
