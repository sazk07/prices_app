import type { NextFunction, Request, Response } from "express";
import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { type PurchaseView } from "@dataTypes/purchase.types.js";

export const getPurchaseById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("ID not found");
    }
    const idNumber = parseInt(id);
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
      WHERE
        purchaseId = ?
    `,
    );
    const result = await Promise.resolve(stmt.get(idNumber));
    const purchase = (result as PurchaseView) ?? null;
    res.statusCode = 200;
    res.json(purchase);
  } catch (err) {
    console.error(err);
    const reportedError = err instanceof Error ? err.message : String(err);
    next(reportedError);
  }
};
