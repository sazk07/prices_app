import { NextFunction, Request, Response } from "express";
import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { NotFoundError } from "@utils/http-errors-enhanced/errors.js";

export const updatePurchase = async (
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
    const { id } = req.params;
    if (!id) {
      throw new Error("Purchase ID not found");
    }
    const idNumber = parseInt(id);
    const purchaseModel = await PurchaseModel();
    const stmt = purchaseModel.prepare(
      `
      UPDATE
        Purchase
      SET
        shopId = ?,
        productId = ?,
        purchaseDate = ?,
        quantity = ?,
        price = ?,
        taxRate = ?,
        taxAmount = ?,
        mrpTaxAmount = ?,
        nonMrpTaxAmount = ?,
        editedAt = ?
      WHERE
        purchaseId = ?
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
        Date.now(),
        idNumber,
      ),
    );
    const isUpdated = result.changes > 0 ? true : false;
    if (!isUpdated) {
      const validationError = new NotFoundError("Purchase not found");
      next(validationError);
    }
    // TODO: redirect to /purchases on update ?
    res.status(204).end();
  } catch (err) {
    console.error("Error updating purchase:", err);
    const reportedError = err instanceof Error ? err.message : String(err);
    next(reportedError);
  }
};
