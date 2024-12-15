import { PurchaseModel } from "@purchase/models/purchase.model.js";
import {
  purchaseIdSchema,
  purchaseSchema,
} from "@purchase/validation/purchase.validation.js";
import { HttpError } from "@utils/http-errors-enhanced/base.js";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "@utils/http-errors-enhanced/errors.js";
import { validateId, validateRequest } from "@utils/validation.js";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const updatePurchase = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let validationError: HttpError;
  try {
    const valId = await validateId(req, purchaseIdSchema);
    const validatedData = await validateRequest(req, purchaseSchema);
    const purchaseModel = await PurchaseModel.createInstance();
    const isUpdated = await purchaseModel.update(valId, validatedData);
    if (!isUpdated) {
      validationError = new NotFoundError("Purchase not found");
      next(validationError);
    }
    // TODO: redirect to /purchases on update ?
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
