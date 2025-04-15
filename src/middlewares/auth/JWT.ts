import Debug from "debug";
import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError }from "jsonwebtoken";
import { extractAndValidateAuthHeader } from "../../helpers/auth_helpers";
import { JwtAccessTokenPayload } from "../../types/JWT.types";


const debug = Debug("Kettle-Katalouge:JWT");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const validateAccessToken = async (req: Request, res: Response, next: NextFunction) => {

    debug("Running validateAccessToken");

    let token: string;

    try {
        token = extractAndValidateAuthHeader(req, "Bearer");
    } catch (err) {
        res.status(401).send({
            status: "fail",
            data: {
                message: "Authorization header missing or not of expected type"
            }
        });
        return;
    }

    if (!ACCESS_TOKEN_SECRET) {
        debug("Access token missing in environment");
        res.status(500).send({
            status: "error",
            message: "No access token secret defined"
        });
        return;
    }

    try {
        const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtAccessTokenPayload;

        debug("Payload: %O", payload);

        req.user = {
            id: payload.id,
            email: payload.email,
            first_name: payload.first_name,
            last_name: payload.last_name,
        }

        next();

    } catch (err) {
        debug("JWT-verification failed: %O,", err);

        if (err instanceof TokenExpiredError) {
            res.status(401).send({
                status: "fail",
                message: "Authorization token has expired",
            });
            return;
        }

        res.status(401).send({
            status: "fail",
            message: "Authorization denied",
        });
        return;
    } 
}
