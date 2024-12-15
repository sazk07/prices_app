import assert from "node:assert/strict";
import { after, afterEach, before, beforeEach, it, suite } from "node:test";
import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { DatabaseSync } from "node:sqlite";
import { ShopEntry } from "@dataTypes/shop.types.js";
import { ShopModel } from "@shop/models/shop.model.js";
import { ProductEntry } from "@dataTypes/product.types.js";
import { ProductModel } from "@product/models/product.model.js";
import { PurchaseEntry } from "@dataTypes/purchase.types.js";
import connectToDatabase from "@configs/database.js";

export const testUpdate = () => {
  suite("PurchaseModel", () => {
    let purchaseModel: PurchaseModel;
    let shopModel: ShopModel;
    let productModel: ProductModel;
    let db: DatabaseSync;
    let shopId: number;
    let productId: number;

    before(async () => {
      db = await connectToDatabase();
      purchaseModel = await PurchaseModel.createInstance();
      shopModel = await ShopModel.createInstance();
      productModel = await ProductModel.createInstance();
    });

    beforeEach(async () => {
      db.prepare("DELETE FROM Shop").run();
      db.prepare("DELETE FROM Product").run();

      const shopEntryData: ShopEntry = {
        shopName: "Another Test Shop",
        shopLocation: "Another Test Location",
      };
      shopId = await shopModel.create(shopEntryData);

      const productEntryData: ProductEntry = {
        productName: "Another Test Product",
        productCategory: "Another Test Category",
        productBrand: "Another Test Brand",
      };
      productId = await productModel.create(productEntryData);
    });

    afterEach(() => {
      db.prepare("DELETE FROM Purchase").run();
    });

    after(() => db.close());

    suite("update method", () => {
      suite("with taxRate", () => {
        it("should return a boolean with true as value", async () => {
          const entry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-01",
            quantity: 200,
            price: 1022,
            taxRate: 17,
          };
          const createdId = await purchaseModel.create(entry);
          const updatedEntry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-09-01",
            quantity: 210,
            price: 1032,
            taxRate: 17,
          };
          const updated = await purchaseModel.update(createdId, updatedEntry);
          assert.ok(typeof updated === "boolean", "should return a boolean");
          assert.deepStrictEqual(updated, true, "should return true");
        });
        it("should return false if no changes are made", async (t) => {
          const entry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-01",
            quantity: 200,
            price: 1022,
            taxRate: 17,
          };
          const createdId = await purchaseModel.create(entry);
          const updatedEntry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-01",
            quantity: 200,
            price: 1022,
            taxRate: 17,
          };
          t.mock.method(purchaseModel, "update", () => false);
          const updated = await purchaseModel.update(createdId, updatedEntry);
          assert.deepStrictEqual(updated, false, "should return false");
        });
      });
      suite("with taxAmount", () => {
        it("should return a boolean with true as value", async () => {
          const entry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-01",
            quantity: 200,
            price: 1022,
            taxAmount: 500,
          };
          const createdId = await purchaseModel.create(entry);
          const updatedEntry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-09-01",
            quantity: 210,
            price: 1032,
            taxAmount: 550,
          };
          const updated = await purchaseModel.update(createdId, updatedEntry);
          assert.ok(typeof updated === "boolean", "should return a boolean");
          assert.deepStrictEqual(updated, true, "should return true");
        });
        it("should return false if no changes are made", async (t) => {
          const entry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-01",
            quantity: 200,
            price: 1022,
            taxAmount: 170,
          };
          const createdId = await purchaseModel.create(entry);
          const updatedEntry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-01",
            quantity: 200,
            price: 1022,
            taxAmount: 170,
          };
          t.mock.method(purchaseModel, "update", () => false);
          const updated = await purchaseModel.update(createdId, updatedEntry);
          assert.deepStrictEqual(updated, false, "should return false");
        });
      });
      suite("with MRP and non-MRP Tax Amounts", () => {
        it("should return a boolean with true as value", async () => {
          const entry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-01",
            quantity: 200,
            price: 1022,
            mrpTaxAmount: 130,
            nonMrpTaxAmount: 44,
          };
          const createdEntry = await purchaseModel.create(entry);
          const updatedEntry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-09-01",
            quantity: 210,
            price: 1032,
            mrpTaxAmount: 144,
            nonMrpTaxAmount: 51,
          };
          const updated = await purchaseModel.update(
            createdEntry,
            updatedEntry,
          );
          assert.ok(typeof updated === "boolean", "should return a boolean");
          assert.deepStrictEqual(updated, true, "should return true");
        });
        it("should return false if no changes are made", async (t) => {
          const entry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-01",
            quantity: 200,
            price: 1022,
            mrpTaxAmount: 144,
            nonMrpTaxAmount: 51,
          };
          const createdId = await purchaseModel.create(entry);
          const updatedEntry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-09-01",
            quantity: 210,
            price: 1032,
            mrpTaxAmount: 144,
            nonMrpTaxAmount: 51,
          };
          t.mock.method(purchaseModel, "update", () => false);
          const updated = await purchaseModel.update(createdId, updatedEntry);
          assert.deepStrictEqual(updated, false, "should return false");
        });
      });
    });
  });
};
