import { NextFunction, Request, Response } from "express";
import { ProductModel } from "@product/models/product.model.js";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productName, productCategory, productBrand } = req.body;
    const productModel = await ProductModel();
    const stmt = productModel.prepare(
      `
      INSERT INTO Product (
        productName,
        productCategory,
        productBrand)
      VALUES (
        ?,
        ?,
        ?)
    `,
    );
    const result = await Promise.resolve(
      stmt.run(productName, productCategory, productBrand),
    );
    const productId = result.lastInsertRowid as number;
    res.statusCode = 201;
    res.json({
      message: "Product created successfully",
      productId,
    });
  } catch (err) {
    console.error(err);
    const reportedErr = err instanceof Error ? err.message : String(err);
    next(reportedErr);
  }
};
