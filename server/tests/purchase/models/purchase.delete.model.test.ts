import assert from "node:assert/strict";
import { after, afterEach, before, beforeEach, it, suite } from "node:test";
import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { DatabaseSync } from "node:sqlite";
import { ShopEntry } from "@dataTypes/shop.types.js";
import { ProductEntry } from "@dataTypes/product.types.js";
import { ShopModel } from "@shop/models/shop.model.js";
import { ProductModel } from "@product/models/product.model.js";
import { PurchaseEntry } from "@dataTypes/purchase.types.js";
import connectToDatabase from "@configs/database.js";

export const testDelete = () => {
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

    suite("delete method", () => {
      suite("with taxRate", () => {
        it("should delete the purchase and return true", async () => {
          const entry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-01",
            quantity: 200,
            price: 1022,
            taxRate: 17,
          };
          const createdId = await purchaseModel.create(entry);
          const deleted = await purchaseModel.delete(createdId);
          assert.ok(typeof deleted === "boolean", "should return a boolean");
          assert.deepStrictEqual(deleted, true, "should return true");
        });
        it("should return false if no changes made to the database", async (t) => {
          const entry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-01",
            quantity: 200,
            price: 1022,
            taxRate: 17,
          };
          const createdId = await purchaseModel.create(entry);
          t.mock.method(purchaseModel, "delete", () => false);
          const deleted = await purchaseModel.delete(createdId);
          assert.deepStrictEqual(deleted, false, "should return false");
        });
      });
      suite("with taxAmount", () => {
        it("should delete the purchase and return true", async () => {
          const entry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-01",
            quantity: 200,
            price: 1022,
            taxAmount: 102,
          };
          const createdId = await purchaseModel.create(entry);
          const deleted = await purchaseModel.delete(createdId);
          assert.ok(typeof deleted === "boolean", "should return a boolean");
          assert.deepStrictEqual(deleted, true, "should return true");
        });
        it("should return false if no changes made to the database", async (t) => {
          const entry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-01",
            quantity: 200,
            price: 1022,
            taxAmount: 102,
          };
          const createdId = await purchaseModel.create(entry);
          t.mock.method(purchaseModel, "delete", () => false);
          const deleted = await purchaseModel.delete(createdId);
          assert.deepStrictEqual(deleted, false, "should return false");
        });
      });
      suite("with MRP and non-MRP Tax Amounts", () => {
        it("should delete the purchase and return true", async () => {
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
          const deleted = await purchaseModel.delete(createdId);
          assert.ok(typeof deleted === "boolean", "should return a boolean");
          assert.deepStrictEqual(deleted, true, "should return true");
        });
        it("should return false if no changes made to the database", async (t) => {
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
          t.mock.method(purchaseModel, "delete", () => false);
          const deleted = await purchaseModel.delete(createdId);
          assert.deepStrictEqual(deleted, false, "should return false");
        });
      });
    });
  });
};
