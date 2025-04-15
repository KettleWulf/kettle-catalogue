import { body } from "express-validator";

export const createOrUpdateAlbumRules = [
    body("title")
        .isString().withMessage("title has to be a string").bail()
		.trim().isLength({ min: 3 }).withMessage("title has to be atleast 3 chars"),
];
