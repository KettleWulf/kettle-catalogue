/**
 * Main application routes
 */
import express from "express";
import { login, refresh, register } from "../controllers/auth_controller";
import { createUserRules } from "../validations/user_rules";
import { validateRequest } from "../middlewares/validateRequest";
import { loginUserRules } from "../validations/auth_rules";
import profileRouter from "./profile";
import albumRouter from "./album";
import photoRouter from "./photo";
import { validateAccessToken } from "../middlewares/auth/JWT";

const router = express.Router();

/**
 * GET /
 */
router.get("/", (req, res) => {
	res.send({
		status: "success",
		data:  {
			message: "But first, let me take a selfie 🤳 https://www.youtube.com/watch?v=kdemFfbS5H0",
		}
	});
});

// Resource routes
router.use("/profile", validateAccessToken, profileRouter);
router.use("/albums", validateAccessToken, albumRouter);
router.use("/photos", validateAccessToken, photoRouter);

// Log in a user
router.post("/login", loginUserRules, validateRequest, login);

// Register a new user
router.post("/register", createUserRules, validateRequest, register);

// Refresh Authentication
router.post("/refresh", refresh);


/**
 * Catch-all route handler
 */
router.use((req, res) => {
	// Respond with 404 and a message in JSON-format
	res.status(404).send({
		status: "fail",
		data: {
			message: `Cannot ${req.method} ${req.path}`,
		}
	});
});

export default router;
