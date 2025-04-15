/**
 * Router Template
 */
import express from "express";
import { index, show, store, update, destroy } from "../controllers/photo_controller";
import { createPhotoRules, updatePhotoRules } from "../validations/photo_rules";
import { validateRequest } from "../middlewares/validateRequest";
const router = express.Router();

/**
 * GET /resources
 *
 * Get all resources
 */
router.get("/", index);

/**
 * GET /resources/:resourceId
 *
 * Get a single resource
 */
router.get("/:photoId", show);

/**
 * POST /resources
 *
 * Create a resource
 */
router.post("/", createPhotoRules, validateRequest, store);

/**
 * PATCH /resources/:resourceId
 *
 * Update a resource
 */
router.patch("/:photoId", updatePhotoRules, validateRequest, update);

/**
 * DELETE /resources/:resourceId
 *
 * Delete a resource
 */
router.delete("/:photoId", destroy);

export default router;
