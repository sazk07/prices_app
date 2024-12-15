import { InternalServerError } from "@utils/http-errors-enhanced/errors.js";
import { validateId, validateRequest } from "@utils/validation.js";
import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

const shopSchema = z.object({
  shopName: z
    .string({
      invalid_type_error: "Shop name must be a string",
    })
    .min(1, { message: "Shop name is required" })
    .trim(),
  shopLocation: z
    .string({
      invalid_type_error: "Shop location must be a string",
    })
    .min(1, { message: "Shop location is required" })
    .trim(),
});

const shopIdSchema = z
  .number({
    message: "ID must be a number",
  })
  .int({
    message: "Invalid ID",
  })
  .finite({
    message: "ID must be a finite number",
  })
  .nonnegative({
    message: "ID must be a non-negative number",
  });

export const validateShopData = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    await validateRequest(req, shopSchema);
    next();
  } catch (err) {
    let validationError: string[] | InternalServerError;
    if (err instanceof ZodError) {
      validationError = err.issues.map((issue) => issue.message);
    } else {
      validationError = new InternalServerError({
        error: err instanceof Error ? err.message : String(err),
      });
    }
    next(validationError);
  }
};

export const validateShopId = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    await validateId(req, shopIdSchema);
    next();
  } catch (err) {
    let validationError: string[] | InternalServerError;
    if (err instanceof ZodError) {
      validationError = err.issues.map((issue) => issue.message);
    } else {
      validationError = new InternalServerError({
        error: err instanceof Error ? err.message : String(err),
      });
    }
    next(validationError);
  }
};
