/**
 * Router Template
 */
import express from "express";
import { getProfile, updateProfile } from "../controllers/profile_controllers";
import { updateUserRules } from "../validations/user_rules";
import { validateRequest } from "../middlewares/validateRequest";

const router = express.Router();

/**
 * GET /resources
 *
 * Get all resources
 */
router.get("/", getProfile);


/**
 * PATCH /resources/:resourceId
 *
 * Update a resource
 */
router.patch("/", updateUserRules, validateRequest, updateProfile);


export default router;
