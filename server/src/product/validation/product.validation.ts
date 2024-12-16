import { InternalServerError } from "@utils/http-errors-enhanced/errors.js";
import { validateId, validateRequest } from "@utils/validation.js";
import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

const productSchema = z.object({
  productName: z
    .string({
      invalid_type_error: "Product Name must be a string",
    })
    .min(1, { message: "Product Name is required" })
    .trim(),
  productCategory: z
    .string({
      invalid_type_error: "Product Category must be a string",
    })
    .min(1, { message: "Product Category is required" })
    .trim(),
  productBrand: z
    .string({
      invalid_type_error: "Product Brand must be a string",
    })
    .min(1, { message: "Product Brand is required" })
    .trim(),
});

const productIdSchema = z
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

export const validateProductData = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    await validateRequest(req, productSchema);
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

export const validateProductId = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    await validateId(req, productIdSchema);
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
