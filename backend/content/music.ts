import { api, APIError } from "encore.dev/api";
import { db } from "./db";

interface Track {
  id: number;
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  spotifyUrl: string;
  youtubeUrl: string;
  coverImageUrl: string;
  featured: boolean;
}

interface ListTracksResponse {
  tracks: Track[];
}

interface CreateTrackRequest {
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  spotifyUrl: string;
  youtubeUrl: string;
  coverImageUrl: string;
  featured: boolean;
}

interface UpdateTrackRequest {
  id: number;
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  spotifyUrl: string;
  youtubeUrl: string;
  coverImageUrl: string;
  featured: boolean;
}

interface DeleteTrackRequest {
  id: number;
}

function rowToTrack(row: Record<string, unknown>): Track {
  return {
    id: row.id as number,
    title: row.title as string,
    description: row.description as string,
    genre: row.genre as string,
    releaseYear: row.release_year as number,
    spotifyUrl: row.spotify_url as string,
    youtubeUrl: row.youtube_url as string,
    coverImageUrl: row.cover_image_url as string,
    featured: row.featured as boolean,
  };
}

export const listTracks = api<void, ListTracksResponse>(
  { expose: true, method: "GET", path: "/tracks" },
  async () => {
    const rows = await db.queryAll`SELECT * FROM tracks ORDER BY created_at DESC`;
    return { tracks: rows.map(rowToTrack) };
  }
);

export const createTrack = api<CreateTrackRequest, Track>(
  { expose: true, auth: true, method: "POST", path: "/tracks" },
  async (req) => {
    const row = await db.queryRow<Record<string, unknown>>`
      INSERT INTO tracks (title, description, genre, release_year, spotify_url, youtube_url, cover_image_url, featured)
      VALUES (${req.title}, ${req.description}, ${req.genre}, ${req.releaseYear}, ${req.spotifyUrl}, ${req.youtubeUrl}, ${req.coverImageUrl}, ${req.featured})
      RETURNING *
    `;
    return rowToTrack(row!);
  }
);

export const updateTrack = api<UpdateTrackRequest, Track>(
  { expose: true, auth: true, method: "PUT", path: "/tracks/:id" },
  async (req) => {
    const row = await db.queryRow<Record<string, unknown>>`
      UPDATE tracks SET
        title = ${req.title},
        description = ${req.description},
        genre = ${req.genre},
        release_year = ${req.releaseYear},
        spotify_url = ${req.spotifyUrl},
        youtube_url = ${req.youtubeUrl},
        cover_image_url = ${req.coverImageUrl},
        featured = ${req.featured},
        updated_at = NOW()
      WHERE id = ${req.id}
      RETURNING *
    `;
    if (!row) throw APIError.notFound("track not found");
    return rowToTrack(row);
  }
);

export const deleteTrack = api<DeleteTrackRequest, void>(
  { expose: true, auth: true, method: "DELETE", path: "/tracks/:id" },
  async (req) => {
    await db.exec`DELETE FROM tracks WHERE id = ${req.id}`;
  }
);
