import type { NextFunction, Request, Response } from "express";
import { ProductModel } from "@product/models/product.model.js";
import { GoneError } from "@utils/http-errors-enhanced/errors.js";

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Product ID not found");
    }
    const idNumber = parseInt(id);
    const productModel = await ProductModel();
    const stmt = productModel.prepare(
      "DELETE FROM Product WHERE productId = ?",
    );
    const result = await Promise.resolve(stmt.run(idNumber));
    const isDeleted = result.changes > 0 ? true : false;
    if (!isDeleted) {
      const validationError = new GoneError("Product already deleted");
      next(validationError);
    }
    // TODO: redirect to /products on delete ?
    res.status(204).end();
  } catch (err) {
    console.error(err);
    const reportedErr = err instanceof Error ? err.message : String(err);
    next(reportedErr);
  }
};
