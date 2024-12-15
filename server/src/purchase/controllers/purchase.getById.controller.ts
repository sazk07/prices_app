import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { purchaseIdSchema } from "@purchase/validation/purchase.validation.js";
import { HttpError } from "@utils/http-errors-enhanced/base.js";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "@utils/http-errors-enhanced/errors.js";
import { validateId } from "@utils/validation.js";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const getPurchaseById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let validationError: HttpError;
  try {
    const valId = await validateId(req, purchaseIdSchema);
    const purchaseModel = await PurchaseModel.createInstance();
    const purchase = await purchaseModel.findById(valId);
    if (!purchase) {
      validationError = new NotFoundError("Purchase not found");
      next(validationError);
    }
    res.statusCode = 200;
    res.json(purchase);
  } catch (err) {
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
