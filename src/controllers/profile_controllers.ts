/**
 * Resource Controller
 */
import bcrypt from "bcrypt"
import Debug from "debug";
import { Request, Response } from "express";
import { handlePrismaError } from "../exceptions/prisma";
import { UpdateUserData } from "../types/User.types";
import { matchedData } from "express-validator";
import { updateUser } from "../services/user_service";

// Create a new debug instance
const debug = Debug('kettle-katalouge:profile_controller');

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

/**
 * Get all resources
 */
export const getProfile = async (req: Request, res: Response) => {

    if (!req.user) {
        throw new Error("Trying to access authenticated user but none exists");
    }

    res.send({
        status: "success",
        data: {
            id: req.user.id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
        }
    });
}


/**
 * Update a resource
 */
export const updateProfile = async (req: Request, res: Response) => {

    if (!req.user) {
        throw new Error("Trying to access authenticated user but none exists");
    }

    const userId = req.user.id;

    const validatedData: UpdateUserData = matchedData(req);

    if (validatedData.password) {
        validatedData.password = await bcrypt.hash(validatedData.password, SALT_ROUNDS);
    }

    try {
        const user = await updateUser(userId, validatedData);
    
        res.send({
            status: "success",
            data: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            },
        });

    } catch (err) {
        debug("Error when trying to update authenticated user %d: %O", userId, err);
		const { status_code, body } = handlePrismaError(err);
		res.status(status_code).send(body);
    }
}

