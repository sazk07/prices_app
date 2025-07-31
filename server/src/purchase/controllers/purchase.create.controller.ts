import type { NextFunction, Request, Response } from "express";
import { PurchaseModel } from "@purchase/models/purchase.model.js";

export const createPurchase = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      shopId,
      productId,
      purchaseDate,
      quantity,
      price,
      taxRate,
      taxAmount,
      mrpTaxAmount,
      nonMrpTaxAmount,
    } = req.body;
    const purchaseModel = await PurchaseModel();
    const stmt = purchaseModel.prepare(
      `
      INSERT INTO Purchase (
        shopId,
        productId,
        purchaseDate,
        quantity,
        price,
        taxRate,
        taxAmount,
        mrpTaxAmount,
        nonMrpTaxAmount)
      VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?)
    `,
    );
    const result = await Promise.resolve(
      stmt.run(
        shopId,
        productId,
        purchaseDate,
        quantity,
        price,
        taxRate ?? 0,
        taxAmount ?? 0,
        mrpTaxAmount ?? 0,
        nonMrpTaxAmount ?? 0,
      ),
    );
    const purchaseId = result.lastInsertRowid as number;
    res.statusCode = 201;
    res.json({
      message: "Purchase created successfully",
      purchaseId,
    });
  } catch (err) {
    console.error(err);
    const reportedErr = err instanceof Error ? err.message : String(err);
    next(reportedErr);
  }
};
