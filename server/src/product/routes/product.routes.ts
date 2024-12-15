import { createProduct } from "@product/controllers/product.create.controller.js";
import { deleteProduct } from "@product/controllers/product.delete.controller.js";
import { getAllProducts } from "@product/controllers/product.getAll.controller.js";
import { getProductById } from "@product/controllers/product.getById.controller.js";
import { updateProduct } from "@product/controllers/product.update.controller.js";
import {
  validateProductData,
  validateProductId,
} from "@product/validation/product.validation.js";
import { Router } from "express";

const productRouter = Router();

productRouter.get("/products", getAllProducts);
productRouter.get("/product/:id", validateProductId, getProductById);
productRouter.post("/product/create", validateProductData, createProduct);
productRouter.put(
  "/product/:id/update",
  validateProductId,
  validateProductData,
  updateProduct,
);
productRouter.delete("/product/:id/delete", validateProductId, deleteProduct);

export default productRouter;
