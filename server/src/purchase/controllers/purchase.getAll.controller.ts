import type { NextFunction, Request, Response } from "express";
import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { InternalServerError } from "@utils/http-errors-enhanced/errors.js";
import { type PurchaseView } from "@dataTypes/purchase.types.js";

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
        Purchase.purchaseId,
        Product.productName,
        Product.productBrand,
        Product.productCategory,
        Shop.shopName,
        Shop.shopLocation,
        Purchase.purchaseDate,
        Purchase.quantity,
        Purchase.price,
        Purchase.taxRate,
        Purchase.taxAmount,
        Purchase.mrpTaxAmount,
        Purchase.nonMrpTaxAmount
      FROM
        Purchase
      INNER JOIN Product ON Purchase.productId = Product.productId
      INNER JOIN Shop ON Purchase.shopId = Shop.shopId
    `,
    );
    const result = await Promise.resolve(stmt.all());
    const purchases = result as PurchaseView[];
    res.statusCode = 200;
    res.json(purchases);
  } catch (err) {
    const reportedErr = new InternalServerError({
      error: err instanceof Error ? err.message : String(err),
    });
    next(reportedErr);
  }
};
