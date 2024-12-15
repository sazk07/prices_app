import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { InternalServerError } from "@utils/http-errors-enhanced/errors.js";
import { NextFunction, Request, Response } from "express";

export const getAllPurchases = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const purchaseModel = await PurchaseModel.createInstance();
    const purchases = await purchaseModel.findAll();
    res.statusCode = 200;
    res.json(purchases);
  } catch (err) {
    const validationError = new InternalServerError({
      error: err instanceof Error ? err.message : String(err),
    });
    next(validationError);
  }
};
