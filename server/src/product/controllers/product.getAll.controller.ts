import { ProductOutput } from "@dataTypes/product.types.js";
import { ProductModel } from "@product/models/product.model.js";
import { InternalServerError } from "@utils/http-errors-enhanced/errors.js";
import { NextFunction, Request, Response } from "express";

export const getAllProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productModel = await ProductModel();
    const stmt = productModel.prepare(
      `
      SELECT
        productId,
        productName,
        productBrand,
        productCategory
      FROM Product
    `,
    );
    const result = await Promise.resolve(stmt.all());
    const products = result as ProductOutput[];
    res.statusCode = 200;
    res.json(products);
  } catch (err) {
    const validationError = new InternalServerError({
      error: err instanceof Error ? err.message : String(err),
    });
    next(validationError);
  }
};
