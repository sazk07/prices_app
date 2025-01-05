import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "@utils/http-errors-enhanced/errors.js";
import { ShopModel } from "@shop/models/shop.model.js";

export const updateShop = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { shopName, shopLocation } = req.body;
    const { id } = req.params;
    if (!id) {
      throw new Error("Shop ID not found");
    }
    const idNumber = parseInt(id);
    const shopModel = await ShopModel();
    const stmt = shopModel.prepare(
      `
      UPDATE Shop
      SET
        shopName = ?,
        shopLocation = ?,
        editedAt = ?
      WHERE
        shopId = ?
    `,
    );
    const result = await Promise.resolve(
      stmt.run(shopName, shopLocation, Date.now(), idNumber),
    );
    const isUpdated = result.changes > 0 ? true : false;
    if (!isUpdated) {
      const validationError = new NotFoundError("Shop not found");
      next(validationError);
    }
    res.status(204).end();
  } catch (err) {
    console.error(err);
    const reportedErr = err instanceof Error ? err.message : String(err);
    next(reportedErr);
  }
};
