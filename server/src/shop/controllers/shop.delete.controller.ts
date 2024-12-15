import { NextFunction, Request, Response } from "express";
import { GoneError } from "@utils/http-errors-enhanced/errors.js";
import { ShopModel } from "@shop/models/shop.model.js";

export const deleteShop = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Shop ID not found");
    }
    const idNumber = parseInt(id);
    const shopModel = await ShopModel();
    const stmt = shopModel.prepare("DELETE FROM Shop WHERE shopId = ?");
    const result = await Promise.resolve(stmt.run(idNumber));
    const isDeleted = result.changes > 0 ? true : false;
    if (!isDeleted) {
      const validationError = new GoneError("Shop already deleted");
      next(validationError);
    }
    // TODO: redirect to /shops on delete ?
    res.status(204).end();
  } catch (err) {
    console.error(err);
    const reportedErr = err instanceof Error ? err.message : String(err);
    next(reportedErr);
  }
};
