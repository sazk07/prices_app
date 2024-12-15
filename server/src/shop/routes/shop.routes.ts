import { createShop } from "@shop/controllers/shop.create.controller.js";
import { deleteShop } from "@shop/controllers/shop.delete.controller.js";
import { getAllShops } from "@shop/controllers/shop.getAll.controller.js";
import { getShopById } from "@shop/controllers/shop.getById.controller.js";
import { updateShop } from "@shop/controllers/shop.update.controller.js";
import {
  validateShopData,
  validateShopId,
} from "@shop/validation/shop.validation.js";
import { Router } from "express";

const shopRouter = Router();

shopRouter.get("/shops", getAllShops);
shopRouter.get("/shop/:id", validateShopId, getShopById);
shopRouter.post("/shop/create", validateShopData, createShop);
shopRouter.put(
  "/shop/:id/update",
  validateShopId,
  validateShopData,
  updateShop,
);
shopRouter.delete("/shop/:id/delete", validateShopId, deleteShop);

export default shopRouter;
