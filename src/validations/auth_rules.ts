import { body } from "express-validator";

export const loginUserRules = [
	body("email")
		.trim().isEmail().withMessage("email has to be a valid email").bail(),

	body("password")
        .isString().withMessage("password has to be a string")
        .isLength({ min: 6 }).withMessage("password has to be atleast 6 chars"),
];