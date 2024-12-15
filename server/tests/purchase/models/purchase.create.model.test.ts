import assert from "node:assert/strict";
import { after, afterEach, before, beforeEach, it, suite } from "node:test";
import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { DatabaseSync } from "node:sqlite";
import { PurchaseEntry } from "@dataTypes/purchase.types.js";
import { ShopEntry } from "@dataTypes/shop.types.js";
import { ShopModel } from "@shop/models/shop.model.js";
import { ProductEntry } from "@dataTypes/product.types.js";
import { ProductModel } from "@product/models/product.model.js";
import connectToDatabase from "@configs/database.js";

export const testCreate = () => {
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

    suite("create method", () => {
      suite("with taxRate", () => {
        it("should create a new purchase successfully and return a number", async () => {
          const entryData: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-01",
            quantity: 10,
            price: 19,
            taxRate: 17,
          };
          const result = await purchaseModel.create(entryData);
          assert.ok(typeof result === "number", "result should be a number");
        });
      });
      suite("with taxAmount", () => {
        it("should create a new purchase successfully and return a number", async () => {
          const entryData: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-02",
            quantity: 20,
            price: 190,
            taxAmount: 107,
          };
          const result = await purchaseModel.create(entryData);
          assert.ok(typeof result === "number", "result should be a number");
        });
      });
      suite("with MRP and non-MRP Tax Amounts", () => {
        it("should create a new purchase successfully and return a number", async () => {
          const entryData: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-02-01",
            quantity: 20,
            price: 190,
            mrpTaxAmount: 107,
            nonMrpTaxAmount: 40,
          };
          const result = await purchaseModel.create(entryData);
          assert.ok(typeof result === "number", "result should be a number");
        });
      });
    });
  });
};
