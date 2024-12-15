import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "@utils/http-errors-enhanced/errors.js";
import { ShopModel } from "@shop/models/shop.model.js";
import { ShopOutput } from "@dataTypes/shop.types.js";

export const getShopById = async (
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
    const shopModel = await ShopModel();
    const stmt = shopModel.prepare(
      `
      SELECT
        shopId,
        shopName,
        shopLocation
      FROM
        Shop
      WHERE
        shopId = ?

    `,
    );
    const result = await Promise.resolve(stmt.get(idNumber));
    const shop = (result as ShopOutput) ?? null;
    if (!shop) {
      const validationError = new NotFoundError("Shop not found");
      next(validationError);
    }
    res.statusCode = 200;
    res.json(shop);
  } catch (err) {
    console.error(err);
    const reportedErr = err instanceof Error ? err.message : String(err);
    next(reportedErr);
  }
};
