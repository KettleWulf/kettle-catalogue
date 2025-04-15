import { body } from "express-validator";

export const createPhotoRules = [
	body("title")
		.isString().withMessage("title has to be a string").bail()
		.trim().isLength({ min: 3 }).withMessage("title has to be atleast 3 chars"),

	body("url")
		.isURL().withMessage("URL has to be valid"),

    body("comment")
        .optional()
        .isString().withMessage("comment has to be a string")
        .trim().isLength({ min: 3 }).withMessage("comment has to be atleast 3 chars")
];

export const updatePhotoRules = [
	body("title")
		.optional()
		.isString().withMessage("title has to be a string").bail()
		.trim().isLength({ min: 3 }).withMessage("title has to be atleast 3 chars"),

	body("url")
		.optional()
		.isURL().withMessage("URL has to be valid"),

    body("comment")
        .optional()
        .isString().withMessage("comment has to be a string")
        .trim().isLength({ min: 3 }).withMessage("comment has to be atleast 3 chars")
];