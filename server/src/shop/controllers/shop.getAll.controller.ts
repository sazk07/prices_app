import { type ShopOutput } from "@dataTypes/shop.types.js";
import { ShopModel } from "@shop/models/shop.model.js";
import { InternalServerError } from "@utils/http-errors-enhanced/errors.js";
import type { NextFunction, Request, Response } from "express";

export const getAllShops = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const shopModel = await ShopModel();
    const stmt = shopModel.prepare(
      `
      SELECT
        shopId,
        shopName,
        shopLocation
      FROM
        Shop
    `,
    );
    const result = await Promise.resolve(stmt.all());
    const shops = result as ShopOutput[];
    res.statusCode = 200;
    res.json(shops);
  } catch (err) {
    const reportedErr = new InternalServerError({
      error: err instanceof Error ? err.message : String(err),
    });
    next(reportedErr);
  }
};
