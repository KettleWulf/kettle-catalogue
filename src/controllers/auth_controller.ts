/**
 * Resource Controller
 */
import bcrypt from "bcrypt";
import Debug from "debug";
import { Request, Response } from "express";
import { matchedData }from "express-validator"
import { handlePrismaError } from "../exceptions/prisma";
import { CreateUserData } from "../types/User.types"
import { createUser, getUserByEmail, getUserById } from "../services/user_service";
import { StringValue } from "ms";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { JwtAccessTokenPayload, JwtRefreshTokenPayload } from "../types/JWT.types";



// Create a new debug instance
const debug = Debug('kettle-katalouge:auth_controller');

// Environment variables
const ACCESS_TOKEN_LIFETIME = process.env.ACCESS_TOKEN_LIFETIME as StringValue || "15min"; 
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_LIFETIME = process.env.REFRESH_TOKEN_LIFETIME as StringValue || "1h";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

// Type interface for destructuring request body
interface LoginRequestBody {
	email: string;
	password: string;
}

// Log in an existing user
export const login = async (req: Request, res: Response) => {

    const { email, password }: LoginRequestBody = matchedData(req);

    const user = await getUserByEmail(email);
    
    if (!user) {
        debug("User %s not found", email);
        res.status(401).send({
            status: "fail",
            data: {
                message: "Authorization required"
            }
        });
        return;
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
        debug("Password for user %s was not correct", email);
        res.status(401).send({
            status: "fail",
            data: {
                message: "Authorization required"
            }
        });
        return;
    }

    // ACCESS TOKEN PAYLOAD
    const payload: JwtAccessTokenPayload = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
    }

    if (!ACCESS_TOKEN_SECRET) {
        debug("ACCESS TOKEN SECRET missing in environment");
        res.status(500).send({
            status: "error",
            message: "No access token defined",
        });
        return;
    }

    const access_token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_LIFETIME,
    });

    const refresh_payload: JwtRefreshTokenPayload = {
        id: user.id,
    }

    if (!REFRESH_TOKEN_SECRET) {
        debug("REFRESH TOKEN SECRET missing in environment");
        res.status(500).send({
            status: "Error",
            message: "No refresh token defined",
        });
        return;
    }

    const refresh_token = jwt.sign(refresh_payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_LIFETIME
    });

    // REFRESH TOKEN COOKIE
    res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        sameSite: "strict",
        path: "/refresh"
    });

    res.send({
        status: "success",
        data: {
            access_token
        }
    });
}



// Register a new user
export const register = async (req: Request, res: Response) => {

    const validatedData: CreateUserData = matchedData(req);
    debug("Validated data: %O", validatedData);
    
    const hashed_password = await bcrypt.hash(validatedData.password, SALT_ROUNDS);
    debug("Password: %s", validatedData.password);
    debug("Hashed password: %s", hashed_password);

    try {
        const user = await createUser({
            ...validatedData,
            password: hashed_password,
        });

        res.status(201).send({ 
            status: "Success", 
            data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            }
        });

    } catch (err) {
        debug("Error when trying to create User: %o %O", validatedData, err);
        const { status_code, body } = handlePrismaError(err);
        res.status(status_code).send(body);

    }
}

export const refresh = async (req: Request, res: Response) => {

    debug("Cookies: %O", req.cookies);

    const refresh_token: string | undefined = req.cookies.refresh_token;
    if (!refresh_token) {
        debug("No refresh token found in cookies");
        res.status(401).send({
            status: "fail",
            data: {
                message: "Authorization required"
            }
        });
        return;
    }


    if (!REFRESH_TOKEN_SECRET) {
        debug("REFRESH_TOKEN_SECRET missing in environment");
        res.status(500).send({
            status: "error",
            message: "No refresh token secret defined"
        });
        return;
    }

    let refresh_payload: JwtRefreshTokenPayload;
    try {
        // TOKEN VERIFICATION
        refresh_payload = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET) as JwtRefreshTokenPayload;
        
    } catch (err) {
        debug("JWT-Refresh verification failed: %O", err);

        if (err instanceof TokenExpiredError) {
            res.status(401).send({
                status: "fail",
                data: {
                    message: "Refresh token expired",
                }
            });
            return;
        }

        res.status(401).send({
            status: "fail",
            data: {
                message: "Authorization denied",
            }
        });
        return;
    }

    const user = await getUserById(refresh_payload.id);
    if(!user) {
        res.status(401).send({
            status: "fail",
            data: {
                message: "Authorization required"
            }
        });
        return;
    }

    const access_payload: JwtAccessTokenPayload = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
    }

    if (!ACCESS_TOKEN_SECRET) {
        debug("ACCESS_TOKEN_SECRET missing in enviroment");
        res.status(500).send({
            status: "error",
            message: "Access token secret not defined"
        });
        return;
    }
    
    const access_token = jwt.sign(access_payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_LIFETIME,
    });

    res.send({
        status: "success",
        data: {
            access_token
        }
    });
}

