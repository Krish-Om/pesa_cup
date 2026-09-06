import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/app-error";
import { getUploadUrl, UPLOAD_SUBDIRS } from "../../utils/local-storage";
import { registrationsService } from "./registrations.service";

const parseId = (value: string): number => Number(value);

const registrationsController = {
  create: async (req: Request, res: Response): Promise<void> => {
    res.status(201).json(await registrationsService.create(req.body));
  },

  getAll: async (req: Request, res: Response): Promise<void> => {
    res.status(200).json(await registrationsService.getAll());
  },

  /**
   * POST /registrations/upload-receipt
   *
   * Multer diskStorage (uploadReceipt) writes the file to uploads/receipts/
   * before this handler runs. We just build the relative URL from req.file.filename
   * and return it — no extra I/O needed.
   *
   * The returned relative path (/uploads/receipts/<filename>) is what the
   * frontend stores in paymentReceiptUrl and later submits with the registration.
   */
  uploadReceipt: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (!req.file) {
      next(new AppError("A receipt image is required", 400));
      return;
    }
    const relativeUrl = getUploadUrl(UPLOAD_SUBDIRS.receipts, req.file.filename);
    res.status(200).json({ url: relativeUrl });
  },

  approve: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = parseId(String(req.params["id"] ?? ""));
    if (!Number.isInteger(id) || id <= 0) {
      next(new AppError("Invalid registration ID", 400));
      return;
    }
    res.status(200).json(await registrationsService.approve(id, req.body));
  },

  reject: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = parseId(String(req.params["id"] ?? ""));
    if (!Number.isInteger(id) || id <= 0) {
      next(new AppError("Invalid registration ID", 400));
      return;
    }
    res.status(200).json(await registrationsService.reject(id, req.body));
  },
};

export default registrationsController;
