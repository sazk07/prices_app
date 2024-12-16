import { NextFunction, Request, Response } from "express";
import { ProductOutput } from "@dataTypes/product.types.js";
import { PurchaseModel } from "@purchase/models/purchase.model.js";

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
      WHERE
        purchaseId = ?
    `,
    );
    const result = await Promise.resolve(stmt.get(idNumber));
    const purchase = (result as ProductOutput) ?? null;
    res.statusCode = 200;
    res.json(purchase);
  } catch (err) {
    console.error(err);
    const reportedError = err instanceof Error ? err.message : String(err);
    next(reportedError);
  }
};
