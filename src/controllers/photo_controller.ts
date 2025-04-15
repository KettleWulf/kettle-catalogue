/**
 * Resource Controller
 */
import Debug from "debug";
import { Request, Response } from "express";
import { handlePrismaError } from "../exceptions/prisma";
import { createPhoto, deletePhoto, getPhotosByUserId, getSinglePhoto, unlinkPhoto, updatePhoto } from "../services/photo_service";
import { CreatePhotoData, UpdatePhotoData } from "../types/Photo.types";
import { matchedData } from "express-validator"


// Create a new debug instance
const debug = Debug('kettle-katalouge:photo_controller');

/**
 * Get all resources
 */
export const index = async (req: Request, res: Response) => {
      
    if (!req.user) {
        throw new Error("Trying to access authenticated user but none exists");
    }

    const userId = req.user.id;

    try {
        const photos = await getPhotosByUserId(userId);

        res.send({
            status: "success",
            data: photos
        });
    } catch (err) {
        debug("Error when trying to get authenticated user %d photos: %O", userId, err);
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

    const photoId = Number(req.params.photoId);
	if (!photoId) {
		res.status(400).send({ 
            status: "fail", 
            data: { 
                message: "That is not a valid ID" }});
		return;
	}

	try {
		const photo = await getSinglePhoto(photoId);

        if (photo.user_id !== userId) {
            throw new Error("ALERT! Trying to access un-authorized data!");
        }

		res.send({ 
            status: "success", 
            data: photo });

	} catch (err) {
		debug("Error when trying to query for photo #%d: %O", photoId, err);

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

    const validatedData: CreatePhotoData = matchedData(req);

    try {
        const photo = await createPhoto(validatedData, userId);
        res.status(201).send({ status: "success", data: photo });

    } catch (err) {
        debug("Error when trying to create a Photo: %O", err);
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

    const photoId = Number(req.params.photoId);
	if (!photoId) {
		res.status(400).send({ 
            status: "fail", 
            data: { 
                message: "That is not a valid ID" }});
		return;
	}

    const validatedData: UpdatePhotoData = matchedData(req);

    try {
        const authorize = await getSinglePhoto(photoId);
        if (authorize.user_id !== userId) {
            throw new Error("ALERT! Trying to access un-authorized data!");
        }

        const photo = await updatePhoto(validatedData, photoId);
        res.status(200).send({ status: "success", data: photo });

    } catch (err) {
        debug("Error when trying to update a Photo: %O", err);

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

    const photoId = Number(req.params.photoId);
	if (!photoId) {
		res.status(400).send({ 
            status: "fail", 
            data: { 
                message: "That is not a valid ID" }});
		return;
	}

    try {
        const authorize = await getSinglePhoto(photoId);
        if (authorize.user_id !== userId) {
            throw new Error("ALERT! Trying to access un-authorized data!");
        }

        await unlinkPhoto(photoId);
        await deletePhoto(photoId);
        res.status(204).send();

    } catch (err) {
        debug("Error when trying to delete a Photo: %O", err);

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
