import { Product } from "./product.types.js";
import { Shop } from "./shop.types.js";

export interface Purchase {
  purchaseId: number;
  shopId: number;
  productId: number;
  purchaseDate: string;
  quantity: number;
  price: number;
  taxRate?: number | undefined;
  taxAmount?: number | undefined;
  mrpTaxAmount?: number | undefined;
  nonMrpTaxAmount?: number | undefined;
  createdAt: number;
  editedAt: number;
}

export type PurchaseEntry = Omit<
  Purchase,
  "purchaseId" | "createdAt" | "editedAt"
>;

export type PurchaseOutput = Omit<Purchase, "createdAt" | "editedAt">;

export type PurchaseView = Omit<Purchase & Product & Shop, "createdAt" | "editedAt"> ;

export interface PurchaseCount {
  "Number of Purchases": number;
}
