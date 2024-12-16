import { createPurchase } from "@purchase/controllers/purchase.create.controller.js";
import { deletePurchase } from "@purchase/controllers/purchase.delete.controller.js";
import { getAllPurchases } from "@purchase/controllers/purchase.getAll.controller.js";
import { getPurchaseById } from "@purchase/controllers/purchase.getById.controller.js";
import { updatePurchase } from "@purchase/controllers/purchase.update.controller.js";
import {
  validatePurchaseData,
  validatePurchaseId,
} from "@purchase/validation/purchase.validation.js";
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
