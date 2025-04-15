/**
 * Resource Controller
 */
import Debug from "debug";
import { Request, Response } from "express";
import { handlePrismaError } from "../exceptions/prisma";
import { getAlbumsByUserId, getSingleAlbum, createAlbum, updateAlbum, addPhotoToAlbum, validatePhotos, unlinkAlbum, deleteAlbum, unlinkSinglePhoto } from "../services/album_service";
import { CreateOrUpdateAlbumData } from "../types/Album.types";
import { matchedData } from "express-validator"


// Create a new debug instance
const debug = Debug('kettle-katalouge:album_controller');

/**
 * Get all resources
 */
export const index = async (req: Request, res: Response) => {
      
    if (!req.user) {
        throw new Error("Trying to access authenticated user but none exists");
    }

    const userId = req.user.id;

    try {
        const albums = await getAlbumsByUserId(userId);

        res.send({
            status: "success",
            data: albums
        });
    } catch (err) {
        debug("Error when trying to get authenticated user %d albums: %O", userId, err);
		const { status_code, body } = handlePrismaError(err);
		res.status(status_code).send(body);
    }
}

/**
 * Get a single resource
 */
export const show = async (req: Request, res: Response) => {

    if (!req.user) {
        throw new Error("Trying to access authenticated user but none exists");
    }

    const userId = req.user.id;

    const albumId = Number(req.params.albumId);
	if (!albumId) {
		res.status(400).send({ 
            status: "fail", 
            data: { 
                message: "That is not a valid ID" }});
		return;
	}

	try {
		const album = await getSingleAlbum(albumId);

        if (album.user_id !== userId) {
            throw new Error("ALERT! Trying to access un-authorized data!");
        }

		res.send({ 
            status: "success", 
            data: album });

	} catch (err) {
		debug("Error when trying to query for album #%d: %O", albumId, err);

        if (err instanceof Error && err.message === "ALERT! Trying to access un-authorized data!") {
            res.status(403).send({
                status: "fail",
                data: { message: err.message },
            });
            return;
        }

		const { status_code, body } = handlePrismaError(err);
		res.status(status_code).send(body);
	}
}

/**
 * Create a resource
 */
export const store = async (req: Request, res: Response) => {
    if (!req.user) {
        throw new Error("Trying to access authenticated user but none exists");
    }

    const userId = req.user.id; 

    const validatedData: CreateOrUpdateAlbumData = matchedData(req);

    try {
        const album = await createAlbum(validatedData, userId);
        res.status(201).send({ status: "success", data: album });

    } catch (err) {
        debug("Error when trying to create a Album: %O", err);
        const { status_code, body } = handlePrismaError(err);
        res.status(status_code).send(body);
    }
};

/**
 * Update a resource
 */
export const update = async (req: Request, res: Response) => {
    if (!req.user) {
        throw new Error("Trying to access authenticated user but none exists");
    }

    const userId = req.user.id;

    const albumId = Number(req.params.albumId);
    if (!albumId) {
        res.status(400).send({ 
            status: "fail", 
            data: { 
                message: "That is not a valid ID" }});
        return;
    }

    const validatedData: CreateOrUpdateAlbumData = matchedData(req);

    try {
        const authorize = await getSingleAlbum(albumId);
        if (authorize.user_id !== userId) {
            throw new Error("ALERT! Trying to access un-authorized data!");
        }

        const album = await updateAlbum(validatedData, albumId);
        res.status(200).send({ status: "success", data: album });

    } catch (err) {
        debug("Error when trying to update an Album: %O", err);

        if (err instanceof Error && err.message === "ALERT! Trying to access un-authorized data!") {
            res.status(403).send({
                status: "fail",
                data: { message: err.message },
            });
            return;
        }

        const { status_code, body } = handlePrismaError(err);
        res.status(status_code).send(body);
    }
}

/**
 * Delete a resource
 */
export const destroy = async (req: Request, res: Response) => {
    if (!req.user) {
        throw new Error("Trying to access authenticated user but none exists");
    }

    const userId = req.user.id;

    const albumId = Number(req.params.albumId);
    if (!albumId) {
        res.status(400).send({ 
            status: "fail", 
            data: { 
                message: "That is not a valid ID" }});
        return;
    }

    try {
        const authorize = await getSingleAlbum(albumId);
        if (authorize.user_id !== userId) {
            throw new Error("ALERT! Trying to access un-authorized data!");
        }

        await unlinkAlbum(albumId);
        await deleteAlbum(albumId);
        res.status(204).send();

    } catch (err) {
        debug("Error when trying to delete an album: %O", err);

        if (err instanceof Error && err.message === "ALERT! Trying to access un-authorized data!") {
            res.status(403).send({
                status: "fail",
                data: { message: err.message },
            });
            return;
        }

        const { status_code, body } = handlePrismaError(err);
        res.status(status_code).send(body);
    }
}

/**
 * Add photo(s) to Album
 */
export const addPhoto = async (req: Request, res: Response) => {
	const albumId = Number(req.params.albumId);
	if (!albumId) {
		res.status(400).send({ status: "fail", data: { message: "That is not a valid ID" }});
		return;
	}

    if (!req.user) {
        throw new Error("Trying to access authenticated user but none exists");
    }

    const userId = req.user.id
    const photoCollection: { id: number }[] = req.body;

	try {
        const validPhotos = await validatePhotos(photoCollection, userId);

        if (validPhotos.length !== req.body.length) {
            throw new Error("Verify all photos exists and are registered on your user");
        }

		const album = await addPhotoToAlbum(albumId, validPhotos);
		res.status(201).send({ status: "success", data: null });

	} catch (err) {
		debug("Error when trying to add Photo %j to Album #%d: %O", req.body, albumId, err);

        if (err instanceof Error && err.message === "Verify all photos exists and are registered on your user") {
            res.status(403).send({
                status: "fail",
                data: { message: err.message },
            });
            return;
        }

		const { status_code, body } = handlePrismaError(err);
		res.status(status_code).send(body);
	}
}

// Remove single photo from album
export const removePhoto = async (req: Request, res: Response) => {
    if (!req.user) {
        throw new Error("Trying to access authenticated user but none exists");
    }

    const userId = req.user.id;

    const albumId = Number(req.params.albumId);
    const photoId = Number(req.params.photoId)
    if (!albumId || !photoId) {
        res.status(400).send({ 
            status: "fail", 
            data: { 
                message: "One ID or both ID's are not valid" }});
        return;
    }

    try {
        const authorize = await getSingleAlbum(albumId);
        if (authorize.user_id !== userId) {
            throw new Error("ALERT! Trying to access un-authorized data!");
        }

        await unlinkSinglePhoto(albumId, photoId);
        res.status(204).send();

    } catch (err) {
        debug("Error when trying to remove a photo: %O", err);

        if (err instanceof Error && err.message === "ALERT! Trying to access un-authorized data!") {
            res.status(403).send({
                status: "fail",
                data: { message: err.message },
            });
            return;
        }

        const { status_code, body } = handlePrismaError(err);
        res.status(status_code).send(body);
    }
}

