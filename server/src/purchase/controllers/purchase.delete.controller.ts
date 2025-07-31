import type { NextFunction, Request, Response } from "express";
import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { GoneError } from "@utils/http-errors-enhanced/errors.js";

export const deletePurchase = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Purchase ID not found");
    }
    const idNumber = parseInt(id);
    const purchaseModel = await PurchaseModel();
    const stmt = purchaseModel.prepare(
      "DELETE FROM Purchase WHERE purchaseId = ?",
    );
    const result = await Promise.resolve(stmt.run(idNumber));
    const idDeleted = result.changes > 0 ? true : false;
    if (!idDeleted) {
      const validationError = new GoneError("Purchase already deleted");
      next(validationError);
    }
    // TODO: redirect to /purchases on delete ?
    res.status(204).end();
  } catch (err) {
    console.error(err);
    const reportedErr = err instanceof Error ? err.message : String(err);
    next(reportedErr);
  }
};
