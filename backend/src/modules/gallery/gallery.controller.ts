import { type NextFunction, type Request, type Response } from "express";
import { AppError } from "../../utils/app-error";
import { galleryService } from "./gallery.service";

const parseId = (value: string): number => Number(value);

const galleryController = {
  getAllGalleryItems: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      res.status(200).json(await galleryService.getMedia());
    } catch (err) {
      next(err);
    }
  },
  getGalleryItemById: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      next(new AppError("Invalid gallery media ID", 400));
      return;
    }
    try {
      res.status(200).json(await galleryService.getMediaById(id));
    } catch (err) {
      next(err);
    }
  },
  createGalleryItem: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      res.status(201).json(await galleryService.createMedia(req.body));
    } catch (err) {
      next(err);
    }
  },
  updateGalleryItem: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      next(new AppError("Invalid gallery media ID", 400));
      return;
    }
    try {
      res.status(200).json(await galleryService.updateMedia(id, req.body));
    } catch (err) {
      next(err);
    }
  },
  deleteGalleryItem: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      next(new AppError("Invalid gallery media ID", 400));
      return;
    }
    try {
      await galleryService.deleteMedia(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

export default galleryController;
