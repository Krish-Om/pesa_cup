import express from "express";
import { asyncHandler } from "../../middlewares/error-handler";
import {
  apiReadLimiter,
  contactFormLimiter,
} from "../../middlewares/rate-limiter";
import { uploadGallery } from "../../middlewares/upload";
import galleryController from "./gallery.controller";
import { requireAdmin } from "../../middlewares/auth";

const gallery = express.Router();

// Public reads
gallery.get("/",    apiReadLimiter, asyncHandler(galleryController.getAllGalleryItems));
gallery.get("/:id", apiReadLimiter, asyncHandler(galleryController.getGalleryItemById));

// All write operations require admin
gallery.use(requireAdmin);

gallery.post(
  "/",
  contactFormLimiter,
  uploadGallery.single("file"),
  asyncHandler(galleryController.createGalleryItem),
);
gallery.put(
  "/:id",
  contactFormLimiter,
  asyncHandler(galleryController.updateGalleryItem),
);
gallery.patch(
  "/:id",
  contactFormLimiter,
  asyncHandler(galleryController.updateGalleryItem),
);
gallery.delete(
  "/:id",
  contactFormLimiter,
  asyncHandler(galleryController.deleteGalleryItem),
);

export default gallery;
