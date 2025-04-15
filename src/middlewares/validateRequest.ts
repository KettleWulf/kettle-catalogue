import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {

        const validationErrors = validationResult(req);

        if(!validationErrors.isEmpty()) {
            res.status(400).send({
                status: "fail",
                data: validationErrors.array()
            });
            return;
        }

        next();
}





