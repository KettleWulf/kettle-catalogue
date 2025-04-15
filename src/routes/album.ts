/**
 * Router Template
 */
import express from "express";
import { index, show, store, update, destroy, addPhoto, removePhoto } from "../controllers/album_controller";
import { createOrUpdateAlbumRules } from "../validations/album_rules";
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
router.get("/:albumId", show);

/**
 * POST /resources
 *
 * Create a resource
 */
router.post("/", createOrUpdateAlbumRules, validateRequest, store);

/**
 * PATCH /resources/:resourceId
 *
 * Update a resource
 */
router.patch("/:albumId", createOrUpdateAlbumRules, validateRequest, update);

/**
 * DELETE /resources/:resourceId
 *
 * Delete a resource
 */
router.delete("/:albumId", destroy);

/**
 * POST /albums/:albumId/photos
 */
router.post("/:albumId/photos", addPhoto);

/**
 * DELETE /albums/:albumId/photos/:photoId
 */
router.delete("/:albumId/photos/:photoId", removePhoto);

export default router;
