import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { purchaseSchema } from "@purchase/validation/purchase.validation.js";
import { HttpError } from "@utils/http-errors-enhanced/base.js";
import {
  BadRequestError,
  InternalServerError,
} from "@utils/http-errors-enhanced/errors.js";
import { validateRequest } from "@utils/validation.js";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const createPurchase = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = await validateRequest(req, purchaseSchema);
    const purchaseModel = await PurchaseModel.createInstance();
    const purchaseId = await purchaseModel.create(validatedData);
    res.statusCode = 201;
    res.json({
      message: "Purchase created successfully",
      purchaseId,
    });
  } catch (err) {
    let validationError: HttpError;
    if (err instanceof ZodError) {
      validationError = new BadRequestError("Validation Failed", {
        errors: err.errors,
      });
    } else {
      validationError = new InternalServerError({
        error: err instanceof Error ? err.message : String(err),
      });
    }
    next(validationError);
  }
};
