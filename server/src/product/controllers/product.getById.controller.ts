import { NextFunction, Request, Response } from "express";
import { ProductModel } from "@product/models/product.model.js";
import { ProductOutput } from "@dataTypes/product.types.js";

export const getProductById = async (
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
    const productModel = await ProductModel();
    const stmt = productModel.prepare(
      `
      SELECT
        productId,
        productName,
        productBrand,
        productCategory
      FROM
        Product
      WHERE
        productId = ?
    `,
    );
    const result = await Promise.resolve(stmt.get(idNumber));
    const product = (result as ProductOutput) ?? null;
    res.statusCode = 200;
    res.json(product);
  } catch (err) {
    console.error(err);
    const reportedError = err instanceof Error ? err.message : String(err);
    next(reportedError);
  }
};
