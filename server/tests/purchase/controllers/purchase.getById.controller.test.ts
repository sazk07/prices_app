import { ProductEntry } from "@dataTypes/product.types.js";
import { PurchaseEntry } from "@dataTypes/purchase.types.js";
import { ShopEntry } from "@dataTypes/shop.types.js";
import { ProductModel } from "@product/models/product.model.js";
import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { ShopModel } from "@shop/models/shop.model.js";
import { NextFunction, Request, Response } from "express";
import { DatabaseSync } from "node:sqlite";
import { afterEach, before, beforeEach, it, suite } from "node:test";
import { getPurchaseById } from "@purchase/controllers/purchase.getById.controller.js";
import assert from "node:assert/strict";

export const testGetPurchaseById = () => {
  suite("PurchaseController", () => {
    let mockPurchaseModel: DatabaseSync;
    let mockShopModel: DatabaseSync;
    let mockProductModel: DatabaseSync;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let shopId: number;
    let productId: number;
    let shopEntryData: ShopEntry;
    let productEntryData: ProductEntry;

    before(async () => {
      mockPurchaseModel = await PurchaseModel();
      mockShopModel = await ShopModel();
      mockProductModel = await ProductModel();
    });

    beforeEach(async () => {
      shopEntryData = {
        shopName: "Test Shop from purchaseGetById",
        shopLocation: "Test Location from purchaseGetById",
      };
      shopId = mockShopModel
        .prepare("INSERT INTO Shop (shopName, shopLocation) VALUES (?, ?)")
        .run(shopEntryData.shopName, shopEntryData.shopLocation)
        .lastInsertRowid as number;

      productEntryData = {
        productName: "Test Product from purchaseGetById",
        productBrand: "Test Brand from purchaseGetById",
        productCategory: "Test Category from purchaseGetById",
      };
      productId = mockProductModel
        .prepare(
          `
          INSERT INTO Product
            (productName, productBrand, productCategory)
          VALUES (?, ?, ?)
        `,
        )
        .run(
          productEntryData.productName,
          productEntryData.productBrand,
          productEntryData.productCategory,
        ).lastInsertRowid as number;

      mockReq = {};
      mockRes = {
        json: function (data: any) {
          this.json = data;
          return this as Response;
        },
      };
      mockNext = () => {};
    });

    afterEach(() => {
      mockShopModel.prepare("DELETE FROM Shop WHERE shopId = ?").run(shopId);
      mockProductModel
        .prepare("DELETE FROM Product WHERE productId = ?")
        .run(productId);
    });

    suite("getPurchaseById", () => {
      suite("with taxRate", () => {
        it("should return status 200 and a json with purchase object", async () => {
          const purchaseEntryData: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-12",
            quantity: 10,
            price: 19,
            taxRate: 17,
          };
          const purchaseId = mockPurchaseModel
            .prepare(
              `
              INSERT INTO Purchase
                (shopId, productId, purchaseDate, quantity, price, taxRate)
              VALUES
                (?, ?, ?, ?, ?, ?)
            `,
            )
            .run(
              purchaseEntryData.shopId,
              purchaseEntryData.productId,
              purchaseEntryData.purchaseDate,
              purchaseEntryData.quantity,
              purchaseEntryData.price,
              purchaseEntryData.taxRate ?? 0,
            ).lastInsertRowid as number;

          mockReq = {
            body: purchaseEntryData,
            params: {
              id: purchaseId.toString(),
            },
          };
          await getPurchaseById(
            mockReq as Request,
            mockRes as Response,
            mockNext as NextFunction,
          );
          assert.deepStrictEqual(mockRes["statusCode"], 200);
          const purchase = mockPurchaseModel
            .prepare(
              `
            SELECT
              Purchase.purchaseId,
              Product.productName,
              Product.productBrand,
              Product.productCategory,
              Shop.shopName,
              Shop.shopLocation,
              Purchase.purchaseDate,
              Purchase.quantity,
              Purchase.price,
              Purchase.taxRate,
              Purchase.taxAmount,
              Purchase.mrpTaxAmount,
              Purchase.nonMrpTaxAmount
            FROM Purchase
            INNER JOIN Product ON Purchase.productId = Product.productId
            INNER JOIN Shop ON Purchase.shopId = Shop.shopId
            WHERE purchaseId = ?
          `,
            )
            .get(purchaseId);
          assert.deepStrictEqual(mockRes.json, purchase);
          // clean up
          mockPurchaseModel
            .prepare("DELETE FROM Purchase WHERE purchaseId = ?")
            .run(purchaseId);
        });
      });

      suite("with taxAmount", () => {
        it("should return status 200 and a json with purchase object", async () => {
          const purchaseEntryData: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-12",
            quantity: 40,
            price: 99,
            taxAmount: 7,
          };
          const purchaseId = mockPurchaseModel
            .prepare(
              `
              INSERT INTO Purchase
                (shopId, productId, purchaseDate, quantity, price, taxAmount)
              VALUES
                (?, ?, ?, ?, ?, ?)
            `,
            )
            .run(
              purchaseEntryData.shopId,
              purchaseEntryData.productId,
              purchaseEntryData.purchaseDate,
              purchaseEntryData.quantity,
              purchaseEntryData.price,
              purchaseEntryData.taxAmount ?? 0,
            ).lastInsertRowid as number;
          mockReq = {
            body: purchaseEntryData,
            params: {
              id: purchaseId.toString(),
            },
          };
          await getPurchaseById(
            mockReq as Request,
            mockRes as Response,
            mockNext,
          );
          assert.deepStrictEqual(mockRes["statusCode"], 200);
          const purchase = mockPurchaseModel
            .prepare(
              `
              SELECT
                Purchase.purchaseId,
                Product.productName,
                Product.productBrand,
                Product.productCategory,
                Shop.shopName,
                Shop.shopLocation,
                Purchase.purchaseDate,
                Purchase.quantity,
                Purchase.price,
                Purchase.taxRate,
                Purchase.taxAmount,
                Purchase.mrpTaxAmount,
                Purchase.nonMrpTaxAmount
              FROM Purchase
              INNER JOIN Product ON Purchase.productId = Product.productId
              INNER JOIN Shop ON Purchase.shopId = Shop.shopId
              WHERE purchaseId = ?
            `,
            )
            .get(purchaseId);
          assert.deepStrictEqual(mockRes.json, purchase);
          // clean up
          mockPurchaseModel
            .prepare("DELETE FROM Purchase WHERE purchaseId = ?")
            .run(purchaseId);
        });
      });

      suite("with MRP and non-MRP Tax Amounts", () => {
        it("should return status 200 and a json with purchase object", async () => {
          const purchaseEntryData: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-12",
            quantity: 100,
            price: 190,
            mrpTaxAmount: 10,
            nonMrpTaxAmount: 4,
          };
          const purchaseId = mockPurchaseModel
            .prepare(
              `
              INSERT INTO Purchase (
                shopId,
                productId,
                purchaseDate,
                quantity,
                price,
                mrpTaxAmount,
                nonMrpTaxAmount)
              VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?)
            `,
            )
            .run(
              purchaseEntryData.shopId,
              purchaseEntryData.productId,
              purchaseEntryData.purchaseDate,
              purchaseEntryData.quantity,
              purchaseEntryData.price,
              purchaseEntryData.mrpTaxAmount ?? 0,
              purchaseEntryData.nonMrpTaxAmount ?? 0,
            ).lastInsertRowid as number;
          mockReq = {
            body: purchaseEntryData,
            params: {
              id: purchaseId.toString(),
            },
          };
          await getPurchaseById(
            mockReq as Request,
            mockRes as Response,
            mockNext,
          );
          assert.deepStrictEqual(mockRes["statusCode"], 200);
          const purchase = mockPurchaseModel
            .prepare(
              `
              SELECT
                Purchase.purchaseId,
                Product.productName,
                Product.productBrand,
                Product.productCategory,
                Shop.shopName,
                Shop.shopLocation,
                Purchase.purchaseDate,
                Purchase.quantity,
                Purchase.price,
                Purchase.taxRate,
                Purchase.taxAmount,
                Purchase.mrpTaxAmount,
                Purchase.nonMrpTaxAmount
              FROM Purchase
              INNER JOIN Product ON Purchase.productId = Product.productId
              INNER JOIN Shop ON Purchase.shopId = Shop.shopId
              WHERE purchaseId = ?
            `,
            )
            .get(purchaseId);
          assert.deepStrictEqual(mockRes.json, purchase);
          // clean up
          mockPurchaseModel
            .prepare("DELETE FROM Purchase WHERE purchaseId = ?")
            .run(purchaseId);
        });
      });
    });
  });
};
