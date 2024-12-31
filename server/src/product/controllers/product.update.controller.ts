import { NextFunction, Request, Response } from "express";
import { ProductModel } from "@product/models/product.model.js";
import { NotFoundError } from "@utils/http-errors-enhanced/errors.js";

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productName, productCategory, productBrand } = req.body;
    const { id } = req.params;
    if (!id) {
      throw new Error("Product ID not found");
    }
    const idNumber = parseInt(id);
    const productModel = await ProductModel();
    const stmt = productModel.prepare(
      `
      UPDATE Product
      SET
        productName = ?,
        productBrand = ?,
        productCategory = ?,
        editedAt = ?
      WHERE
        productId = ?
    `,
    );
    const result = await Promise.resolve(
      stmt.run(
        productName,
        productBrand,
        productCategory,
        Date.now(),
        idNumber,
      ),
    );
    const isUpdated = result.changes > 0 ? true : false;
    if (!isUpdated) {
      const validationError = new NotFoundError("Product not found");
      next(validationError);
    }
    // TODO: redirect to /products on update ?
    res.status(204).end();
  } catch (err) {
    console.error("Error updating product:", err);
    const reportedError = err instanceof Error ? err.message : String(err);
    next(reportedError);
  }
};
