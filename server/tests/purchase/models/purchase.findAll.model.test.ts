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

export const testFindAll = () => {
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

    suite("findAll method", () => {
      suite("with taxRate", () => {
        it("should return an array of Purchase types", async () => {
          const entries: PurchaseEntry[] = [
            {
              shopId,
              productId,
              purchaseDate: "2023-01-01",
              quantity: 10,
              price: 19,
              taxRate: 17,
            },
            {
              shopId,
              productId,
              purchaseDate: "2023-01-02",
              quantity: 20,
              price: 190,
              taxRate: 17,
            },
          ];
          for (const entry of entries) {
            await purchaseModel.create(entry);
          }
          const result = await purchaseModel.findAll();
          assert.ok(Array.isArray(result), "result should be an array");
          result.map((elem, idx) => {
            assert.deepStrictEqual(
              elem?.shopId,
              entries[idx]?.shopId,
              `entry ${idx} shopId should be ${entries[idx]?.shopId}`,
            );
            assert.deepStrictEqual(
              elem?.productId,
              entries[idx]?.productId,
              `entry ${idx} productId should be ${entries[idx]?.productId}`,
            );
            assert.deepStrictEqual(
              elem?.purchaseDate,
              entries[idx]?.purchaseDate,
              `entry ${idx} purchaseDate should be ${entries[idx]?.purchaseDate}`,
            );
            assert.deepStrictEqual(
              elem?.quantity,
              entries[idx]?.quantity,
              `entry ${idx} quantity should be ${entries[idx]?.quantity}`,
            );
            assert.deepStrictEqual(
              elem?.taxRate,
              entries[idx]?.taxRate,
              `entry ${idx} taxRate should be ${entries[idx]?.taxRate}`,
            );
            assert.deepStrictEqual(
              elem?.taxAmount,
              0,
              `entry ${idx} taxAmount should be 0`,
            );
            assert.deepStrictEqual(
              elem?.mrpTaxAmount,
              0,
              "entry ${idx} mrpTaxAmount should be 0",
            );
            assert.deepStrictEqual(
              elem?.nonMrpTaxAmount,
              0,
              "entry ${idx} nonMrpTaxAmount should be 0",
            );
          });
        });
      });
      suite("with taxAmount", () => {
        it("should return an array of Purchase types", async () => {
          const entries: PurchaseEntry[] = [
            {
              shopId,
              productId,
              purchaseDate: "2023-01-01",
              quantity: 10,
              price: 19,
              taxAmount: 107,
            },
            {
              shopId,
              productId,
              purchaseDate: "2023-01-02",
              quantity: 20,
              price: 190,
              taxAmount: 107,
            },
          ];
          for (const entry of entries) {
            await purchaseModel.create(entry);
          }
          const result = await purchaseModel.findAll();
          result.map((elem, idx) => {
            assert.deepStrictEqual(
              elem?.shopId,
              entries[idx]?.shopId,
              `entry ${idx} shopId should be ${entries[idx]?.shopId}`,
            );
            assert.deepStrictEqual(
              elem?.productId,
              entries[idx]?.productId,
              `entry ${idx} productId should be ${entries[idx]?.productId}`,
            );
            assert.deepStrictEqual(
              elem?.purchaseDate,
              entries[idx]?.purchaseDate,
              `entry ${idx} purchaseDate should be ${entries[idx]?.purchaseDate}`,
            );
            assert.deepStrictEqual(
              elem?.quantity,
              entries[idx]?.quantity,
              `entry ${idx} quantity should be ${entries[idx]?.quantity}`,
            );
            assert.deepStrictEqual(
              elem?.taxAmount,
              entries[idx]?.taxAmount,
              `entry ${idx} taxAmount should be ${entries[idx]?.taxAmount}`,
            );
            assert.deepStrictEqual(
              elem?.taxRate,
              0,
              `entry ${idx} taxRate should be 0`,
            );
            assert.deepStrictEqual(
              elem?.mrpTaxAmount,
              0,
              `entry ${idx} mrpTaxAmount should be 0`,
            );
            assert.deepStrictEqual(
              elem?.nonMrpTaxAmount,
              0,
              `entry ${idx} nonMrpTaxAmount should be 0`,
            );
          });
        });
      });
      suite("with MRP and non-MRP Tax Amounts", () => {
        it("should return an array of Purchase types", async () => {
          const entries: PurchaseEntry[] = [
            {
              shopId,
              productId,
              purchaseDate: "2023-01-01",
              quantity: 10,
              price: 19,
              mrpTaxAmount: 17,
              nonMrpTaxAmount: 10,
            },
            {
              shopId,
              productId,
              purchaseDate: "2023-01-02",
              quantity: 20,
              price: 190,
              mrpTaxAmount: 107,
              nonMrpTaxAmount: 107,
            },
          ];
          for (const entry of entries) {
            await purchaseModel.create(entry);
          }
          const result = await purchaseModel.findAll();
          result.map((elem, idx) => {
            assert.deepStrictEqual(
              elem?.shopId,
              entries[idx]?.shopId,
              `entry ${idx} shopId should be ${entries[idx]?.shopId}`,
            );
            assert.deepStrictEqual(
              elem?.productId,
              entries[idx]?.productId,
              `entry ${idx} productId should be ${entries[idx]?.productId}`,
            );
            assert.deepStrictEqual(
              elem?.purchaseDate,
              entries[idx]?.purchaseDate,
              `entry ${idx} purchaseDate should be ${entries[idx]?.purchaseDate}`,
            );
            assert.deepStrictEqual(
              elem?.quantity,
              entries[idx]?.quantity,
              `entry ${idx} quantity should be ${entries[idx]?.quantity}`,
            );
            assert.deepStrictEqual(
              elem?.taxRate,
              0,
              `entry ${idx} taxRate should be 0`,
            );
            assert.deepStrictEqual(
              elem?.taxAmount,
              0,
              `entry ${idx} taxAmount should be 0`,
            );
            assert.deepStrictEqual(
              elem?.mrpTaxAmount,
              entries[idx]?.mrpTaxAmount,
              `entry ${idx} mrpTaxAmount should be ${entries[idx]?.mrpTaxAmount}`,
            );
            assert.deepStrictEqual(
              elem?.nonMrpTaxAmount,
              entries[idx]?.nonMrpTaxAmount,
              `entry ${idx} nonMrpTaxAmount should be ${entries[idx]?.nonMrpTaxAmount}`,
            );
          });
        });
      });
      suite("record not found", () => {
        it("should return an empty array if no purchases are found", async () => {
          const result = await purchaseModel.findAll();
          assert.deepStrictEqual(result, [], "result should be an empty array");
        });
      });
    });
  });
};
