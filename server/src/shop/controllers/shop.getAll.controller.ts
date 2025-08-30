import { type ShopOutput } from "../../../../shared/src/types/shop.types.js";
import { ShopModel } from "../models/shop.model.js";
import { InternalServerError } from "@sazk/http-errors-enhanced";
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
