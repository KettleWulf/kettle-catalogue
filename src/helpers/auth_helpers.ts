import Debug from "debug";
import { Request } from "express";

const debug = Debug("Kettle-Katalouge:auth_helpers");

export const extractAndValidateAuthHeader = (req: Request, expectedType: "Bearer") => {

    if (!req.headers.authorization) {
        debug("Authorization header missing");
        throw new Error("Authorization header missing");
    }

    const [ authType, payload ] = req.headers.authorization.split(" ");

    if (authType.toLowerCase() !== expectedType.toLowerCase()) {
        debug("Authorization type %s does not match expected authorization type %s", authType, expectedType);
        throw new Error(`Expected ${expectedType} but got ${authType}`);
    }

    if (!payload) {
        debug("Payload not found in authorization header");
        throw new Error("Payload not found in authorization header");
    }

    return payload;
}