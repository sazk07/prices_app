import { createProduct } from "../controllers/product.create.controller.js";
import { deleteProduct } from "../controllers/product.delete.controller.js";
import { getAllProducts } from "../controllers/product.getAll.controller.js";
import { getProductById } from "../controllers/product.getById.controller.js";
import { updateProduct } from "../controllers/product.update.controller.js";
import {
  validateProductData,
  validateProductId,
} from "../validation/product.validation.js";
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
