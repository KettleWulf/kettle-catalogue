import { body } from "express-validator";
import { getUserByEmail } from "../services/user_service";

const validateEmailDoesNotExist = async (value: string) => {

	const user = await getUserByEmail(value);

	if (user) {
		throw new Error("Email already exists");
	}
}

export const createUserRules = [
    body("email")
        .trim().isEmail().withMessage("email has to be valid").bail()
        .custom(validateEmailDoesNotExist),
    body("password")
        .isString().withMessage("password has to be a string")
        .isLength({ min: 6 }).withMessage("password has to be atleast 6 chars"),
    body("first_name")
        .isString().withMessage("first_name has to be a string")
        .isLength({ min: 3 }).withMessage("first_name has to be atleast 3 chars"),
    body("last_name")
        .isString().withMessage("last_name has to be a string")
        .isLength({ min: 3 }).withMessage("last_name has to be atleast 3 chars"),

]

export const updateUserRules = [
    body("email")
        .optional()
        .trim().isEmail().withMessage("email has to be valid").bail()
        .custom(validateEmailDoesNotExist),
    body("password")
        .optional()
        .isString().withMessage("password has to be a string")
        .isLength({ min: 6 }).withMessage("password has to be atleast 6 chars"),
    body("first_name")
        .optional()
        .isString().withMessage("first_name has to be a string")
        .isLength({ min: 3 }).withMessage("first_name has to be atleast 3 chars"),
    body("last_name")
        .optional()
        .isString().withMessage("last_name has to be a string")
        .isLength({ min: 3 }).withMessage("last_name has to be atleast 3 chars"),
]
