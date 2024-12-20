import { NextFunction, Request, Response } from "express";
import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { NotFoundError } from "@utils/http-errors-enhanced/errors.js";
import {
  getCountOfProducts,
  getCountOfPurchases,
  getCountOfShops,
} from "@utils/home.utils.js";

export const homePage = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const purchaseModel = await PurchaseModel();
    const countOfShops = await getCountOfShops(purchaseModel);
    if (!countOfShops) {
      const validationError = new NotFoundError("No Shop IDs found");
      next(validationError);
    }
    const countOfProducts = await getCountOfProducts(purchaseModel);
    if (!countOfProducts) {
      const validationError = new NotFoundError("No Product IDs found");
      next(validationError);
    }
    const countOfPurchases = await getCountOfPurchases(purchaseModel);
    if (!countOfPurchases) {
      const validationError = new NotFoundError("No Purchase IDs found");
      next(validationError);
    }
    res.statusCode = 200;
    res.json({
      title: "Welcome to the Expense Tracker",
      countOfShops: countOfShops["Number of Shops"],
      countOfProducts: countOfProducts["Number of Products"],
      countOfPurchases: countOfPurchases["Number of Purchases"],
    });
  } catch (err) {
    console.error(err);
    const reportedErr = err instanceof Error ? err.message : String(err);
    next(reportedErr);
  }
};
