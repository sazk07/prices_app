import type { NextFunction, Request, Response } from "express";
import { ShopModel } from "@shop/models/shop.model.js";

export const createShop = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { shopName, shopLocation } = req.body;
    const shopModel = await ShopModel();
    const stmt = shopModel.prepare(
      "INSERT INTO Shop (shopName, shopLocation) VALUES (?, ?)",
    );
    const result = await Promise.resolve(stmt.run(shopName, shopLocation));
    const shopId = result.lastInsertRowid as number;
    res.statusCode = 201;
    res.json({
      message: "Shop created successfully",
      shopId,
    });
  } catch (err) {
    console.error(err);
    const reportedErr = err instanceof Error ? err.message : String(err);
    next(reportedErr);
  }
};
