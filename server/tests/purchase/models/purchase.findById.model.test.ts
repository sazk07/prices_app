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

export const testFindById = () => {
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

    suite("findById method", () => {
      suite("with taxRate", () => {
        it("should return a Purchase type", async () => {
          const entry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-04-01",
            quantity: 104,
            price: 199,
            taxRate: 10,
          };
          const createdEntry = await purchaseModel?.create(entry);
          const result = await purchaseModel?.findById(createdEntry);
          assert.deepStrictEqual(
            result?.shopId,
            entry.shopId,
            "shopId should match",
          );
          assert.deepStrictEqual(
            result?.productId,
            entry.productId,
            "productId should match",
          );
          assert.deepStrictEqual(
            result?.purchaseDate,
            entry.purchaseDate,
            "purchaseDate should match",
          );
          assert.deepStrictEqual(
            result?.quantity,
            entry.quantity,
            "quantity should match",
          );
          assert.deepStrictEqual(
            result?.price,
            entry.price,
            "price should match",
          );
          assert.deepStrictEqual(
            result?.taxRate,
            entry.taxRate,
            "taxRate should match",
          );
          assert.deepStrictEqual(result?.taxAmount, 0, "taxAmount should be 0");
          assert.deepStrictEqual(
            result?.mrpTaxAmount,
            0,
            "mrpTaxAmount should be 0",
          );
          assert.deepStrictEqual(
            result?.nonMrpTaxAmount,
            0,
            "nonMrpTaxAmount should be 0",
          );
        });
        it("should return null if purchase is not found by corresponding ID ", async () => {
          const entry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-04-01",
            quantity: 104,
            price: 199,
            taxRate: 10,
          };
          const createdEntry = await purchaseModel.create(entry);
          const result = await purchaseModel?.findById(createdEntry + 1);
          assert.deepStrictEqual(result, null, "result should be null");
        });
      });
      suite("with taxAmount", () => {
        it("should return a Purchase type", async () => {
          const entry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-04-01",
            quantity: 104,
            price: 199,
            taxAmount: 107,
          };
          const createdEntry = await purchaseModel?.create(entry);
          const result = await purchaseModel?.findById(createdEntry);
          assert.deepStrictEqual(
            result?.shopId,
            entry.shopId,
            "shopId should match",
          );
          assert.deepStrictEqual(
            result?.productId,
            entry.productId,
            "productId should match",
          );
          assert.deepStrictEqual(
            result?.purchaseDate,
            entry.purchaseDate,
            "purchaseDate should match",
          );
          assert.deepStrictEqual(
            result?.quantity,
            entry.quantity,
            "quantity should match",
          );
          assert.deepStrictEqual(
            result?.price,
            entry.price,
            "price should match",
          );
          assert.deepStrictEqual(
            result?.taxAmount,
            entry.taxAmount,
            "taxRate should match",
          );
          assert.deepStrictEqual(result?.taxRate, 0, "taxRate should be 0");
          assert.deepStrictEqual(
            result?.mrpTaxAmount,
            0,
            "mrpTaxAmount should be 0",
          );
          assert.deepStrictEqual(
            result?.nonMrpTaxAmount,
            0,
            "nonMrpTaxAmount should be 0",
          );
        });
        it("should return null if purchase is not found in database", async () => {
          const entry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-04-01",
            quantity: 104,
            price: 199,
            taxAmount: 107,
          };
          const createdEntry = await purchaseModel.create(entry);
          const result = await purchaseModel?.findById(createdEntry + 1);
          assert.deepStrictEqual(result, null, "result should be null");
        });
      });
      suite("with mrpTaxAmount and nonMrpTaxAmount", () => {
        it("should return a Purchase type", async () => {
          const entry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-04-11",
            quantity: 124,
            price: 1099,
            mrpTaxAmount: 207,
            nonMrpTaxAmount: 140,
          };
          const createdEntry = await purchaseModel?.create(entry);
          const result = await purchaseModel?.findById(createdEntry);
          assert.deepStrictEqual(
            result?.shopId,
            entry.shopId,
            "shopId should match",
          );
          assert.deepStrictEqual(
            result?.productId,
            entry.productId,
            "productId should match",
          );
          assert.deepStrictEqual(
            result?.purchaseDate,
            entry.purchaseDate,
            "purchaseDate should match",
          );
          assert.deepStrictEqual(
            result?.quantity,
            entry.quantity,
            "quantity should match",
          );
          assert.deepStrictEqual(
            result?.price,
            entry.price,
            "price should match",
          );
          assert.deepStrictEqual(
            result?.taxAmount,
            0,
            "taxAmount should match",
          );
          assert.deepStrictEqual(result.taxRate, 0, "taxRate should be 0");
          assert.deepStrictEqual(
            result?.mrpTaxAmount,
            entry.mrpTaxAmount,
            "mrpTaxAmount should be 0",
          );
          assert.deepStrictEqual(
            result?.nonMrpTaxAmount,
            entry.nonMrpTaxAmount,
            "nonMrpTaxAmount should be 0",
          );
        });
        it("should return null if purchase is not found in database", async () => {
          const entry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-04-11",
            quantity: 124,
            price: 1099,
            mrpTaxAmount: 207,
            nonMrpTaxAmount: 140,
          };
          const createdEntry = await purchaseModel.create(entry);
          const result = await purchaseModel?.findById(createdEntry + 1);
          assert.deepStrictEqual(result, null, "result should be null");
        });
      });
    });
  });
};
