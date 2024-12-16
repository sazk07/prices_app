import { NextFunction, Request, Response } from "express";
import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { InternalServerError } from "@utils/http-errors-enhanced/errors.js";
import { PurchaseOutput } from "@dataTypes/purchase.types.js";

export const getAllPurchases = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const purchaseModel = await PurchaseModel();
    const stmt = purchaseModel.prepare(
      `
      SELECT
        purchaseId,
        shopId,
        productId,
        purchaseDate,
        quantity,
        price,
        taxRate,
        taxAmount,
        mrpTaxAmount,
        nonMrpTaxAmount
      FROM
        Purchase
    `,
    );
    const result = await Promise.resolve(stmt.all());
    const purchases = result as PurchaseOutput[];
    res.statusCode = 200;
    res.json(purchases);
  } catch (err) {
    const validationError = new InternalServerError({
      error: err instanceof Error ? err.message : String(err),
    });
    next(validationError);
  }
};
