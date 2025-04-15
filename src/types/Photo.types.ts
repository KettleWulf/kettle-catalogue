import { Photo } from "@prisma/client";

export type PhotoId = Pick<Photo, "id">;

export type CreatePhotoData = Omit<Photo, "id" | "user_id">;

export type UpdatePhotoData = Partial<CreatePhotoData>;

export type ValidatedPhotoData = Pick<Photo, "id" | "user_id">