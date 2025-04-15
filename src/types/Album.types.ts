import { Album } from "@prisma/client";

export type AlbumId = Pick<Album, "id">;

export type CreateOrUpdateAlbumData = Omit<Album, "id" | "user_id">;

