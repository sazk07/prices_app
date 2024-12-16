import { InternalServerError } from "@utils/http-errors-enhanced/errors.js";
import { validateId, validateRequest } from "@utils/validation.js";
import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

const purchaseSchema = z.object({
  shopId: z.number({
    invalid_type_error: "Invalid Shop ID",
  }),
  productId: z.number({
    invalid_type_error: "Invalid Product ID",
  }),
  purchaseDate: z.string().date("Purchase Date must be a valid date").trim(),
  quantity: z
    .number({
      invalid_type_error: "Quantity must be a number",
    })
    .nonnegative({
      message: "Quantity must be a non-negative number",
    })
    .finite({
      message: "Quantity must be a finite number",
    }),
  price: z
    .number({
      invalid_type_error: "Price must be a number",
    })
    .nonnegative({
      message: "Price must be a non-negative number",
    })
    .finite({
      message: "Price must be a finite number",
    }),
  taxRate: z
    .number()
    .nonnegative({
      message: "Tax Rate must be a non-negative number",
    })
    .finite({
      message: "Tax Rate must be a finite number",
    })
    .optional(),
  taxAmount: z
    .number({
      invalid_type_error: "Tax Amount must be a number",
    })
    .nonnegative({
      message: "Tax Amount must be a non-negative number",
    })
    .finite({
      message: "Tax Amount must be a finite number",
    })
    .optional(),
  mrpTaxAmount: z
    .number({
      invalid_type_error: "MRP Tax Amount must be a number",
    })
    .nonnegative({
      message: "MRP Tax Amount must be a non-negative number",
    })
    .finite({
      message: "MRP Tax Amount must be a finite number",
    })
    .optional(),
  nonMrpTaxAmount: z
    .number({
      invalid_type_error: "Non-MRP Tax Amount must be a number",
    })
    .nonnegative({
      message: "Non-MRP Tax Amount must be a non-negative number",
    })
    .finite({
      message: "Non-MRP Tax Amount must be a finite number",
    })
    .optional(),
});

const purchaseIdSchema = z
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

export const validatePurchaseData = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    await validateRequest(req, purchaseSchema);
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

export const validatePurchaseId = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    await validateId(req, purchaseIdSchema);
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
