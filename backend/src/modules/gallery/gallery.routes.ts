import express from "express";
import multer from "multer";
import { asyncHandler } from "../../middlewares/error-handler";
import {
  apiReadLimiter,
  contactFormLimiter,
} from "../../middlewares/rate-limiter";
import galleryController from "./gallery.controller";

const gallery = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

gallery.get(
  "/",
  apiReadLimiter,
  asyncHandler(galleryController.getAllGalleryItems),
);
gallery.get(
  "/:id",
  apiReadLimiter,
  asyncHandler(galleryController.getGalleryItemById),
);
gallery.post(
  "/",
  contactFormLimiter,
  upload.single("file"),
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
