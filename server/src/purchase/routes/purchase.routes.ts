import { createPurchase } from "../controllers/purchase.create.controller.js";
import { deletePurchase } from "../controllers/purchase.delete.controller.js";
import { getAllPurchases } from "../controllers/purchase.getAll.controller.js";
import { getPurchaseById } from "../controllers/purchase.getById.controller.js";
import { updatePurchase } from "../controllers/purchase.update.controller.js";
import {
  validatePurchaseData,
  validatePurchaseId,
} from "../validation/purchase.validation.js";
import { Router } from "express";

const purchaseRouter = Router();

purchaseRouter.get("/purchases", getAllPurchases);
purchaseRouter.get("/purchase/:id", validatePurchaseId, getPurchaseById);
purchaseRouter.post("/purchase/create", validatePurchaseData, createPurchase);
purchaseRouter.put(
  "/purchase/:id/update",
  validatePurchaseId,
  validatePurchaseData,
  updatePurchase,
);
purchaseRouter.delete(
  "/purchase/:id/delete",
  validatePurchaseId,
  deletePurchase,
);

export default purchaseRouter;
