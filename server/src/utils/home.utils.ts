import { ProductCount } from "@dataTypes/product.types.js";
import { PurchaseCount } from "@dataTypes/purchase.types.js";
import { ShopCount } from "@dataTypes/shop.types.js";
import { DatabaseSync } from "node:sqlite";

export const getCountOfShops = async (db: DatabaseSync) => {
  const stmt = db.prepare(
    `
    SELECT COUNT(DISTINCT shopId) AS [Number of Shops] FROM Shop
  `,
  );
  const result = await Promise.resolve(stmt.get());
  const countOfShops = (result as ShopCount) ?? null;
  return countOfShops;
};

export const getCountOfProducts = async (db: DatabaseSync) => {
  const stmt = db.prepare(
    `
    SELECT COUNT(DISTINCT productId) AS [Number of Products] FROM Product
  `,
  );
  const result = await Promise.resolve(stmt.get());
  const countOfProducts = (result as ProductCount) ?? null;
  return countOfProducts;
};

export const getCountOfPurchases = async (db: DatabaseSync) => {
  const stmt = db.prepare(
    `
    SELECT COUNT(DISTINCT PurchaseId) AS [Number of Purchases] FROM Purchase
  `,
  );
  const result = await Promise.resolve(stmt.get());
  const countOfPurchases = (result as PurchaseCount) ?? null;
  return countOfPurchases;
};
