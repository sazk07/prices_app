import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { purchaseIdSchema } from "@purchase/validation/purchase.validation.js";
import { HttpError } from "@utils/http-errors-enhanced/base.js";
import {
  BadRequestError,
  GoneError,
  InternalServerError,
} from "@utils/http-errors-enhanced/errors.js";
import { validateId } from "@utils/validation.js";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const deletePurchase = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let validationError: HttpError;
  try {
    const valId = await validateId(req, purchaseIdSchema);
    const purchaseModel = await PurchaseModel.createInstance();
    const isDeleted = await purchaseModel.delete(valId);
    if (!isDeleted) {
      validationError = new GoneError("Purchase already deleted");
      next(validationError);
    }
    // TODO: redirect to /purchases on delete ?
    res.status(204).end();
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
