import { NextFunction, Request, Response } from "express";
import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { DatabaseSync } from "node:sqlite";
import { afterEach, before, beforeEach, it, suite } from "node:test";
import { PurchaseEntry } from "@dataTypes/purchase.types.js";
import { ShopEntry } from "@dataTypes/shop.types.js";
import { ShopModel } from "@shop/models/shop.model.js";
import { ProductEntry } from "@dataTypes/product.types.js";
import { ProductModel } from "@product/models/product.model.js";
import { createPurchase } from "@purchase/controllers/purchase.create.controller.js";
import assert from "node:assert/strict";

export const testCreatePurchase = () => {
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
        shopName: "Test Shop from purchaseCreate",
        shopLocation: "Test Location from purchaseCreate",
      };
      shopId = mockShopModel
        .prepare("INSERT INTO Shop (shopName, shopLocation) VALUES (?, ?)")
        .run(shopEntryData.shopName, shopEntryData.shopLocation)
        .lastInsertRowid as number;

      productEntryData = {
        productName: "Test Product from purchaseCreate",
        productBrand: "Test Brand from purchaseCreate",
        productCategory: "Test Category from purchaseCreate",
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
        status: function (code: number) {
          this.statusCode = code;
          return this as Response;
        },
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

    suite("createPurchase controller", () => {
      suite("with taxRate", () => {
        it("should create a new purchase and return the purchase ID and status 201", async () => {
          const purchaseEntry: PurchaseEntry = {
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
              VALUES (?, ?, ?, ?, ?, ?)
            `,
            )
            .run(
              purchaseEntry.shopId,
              purchaseEntry.productId,
              purchaseEntry.purchaseDate,
              purchaseEntry.quantity,
              purchaseEntry.price,
              purchaseEntry.taxRate ?? 0,
            ).lastInsertRowid as number;

          mockReq = {
            body: {
              shopId,
              productId,
              purchaseDate: "2023-01-12",
              quantity: 100,
              price: 190,
              taxRate: 17,
            },
          };
          await createPurchase(
            mockReq as Request,
            mockRes as Response,
            mockNext,
          );
          assert.deepStrictEqual(mockRes["statusCode"], 201);
          assert.deepStrictEqual(mockRes["json"], {
            message: "Purchase created successfully",
            purchaseId: purchaseId + 1,
          });
          // clean up
          mockPurchaseModel
            .prepare("DELETE FROM Purchase WHERE purchaseId = ?")
            .run(purchaseId);
          mockPurchaseModel
            .prepare("DELETE FROM Purchase WHERE purchaseId = ?")
            .run(purchaseId + 1);
        });
      });
      suite("with taxAmount", () => {
        it("should create a new purchase and return the purchase ID and status 201", async () => {
          const purchaseEntry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-12",
            quantity: 10,
            price: 19,
            taxAmount: 7,
          };
          const purchaseId = mockPurchaseModel
            .prepare(
              `
              INSERT INTO Purchase
                (shopId, productId, purchaseDate, quantity, price, taxAmount)
              VALUES (?, ?, ?, ?, ?, ?)
            `,
            )
            .run(
              purchaseEntry.shopId,
              purchaseEntry.productId,
              purchaseEntry.purchaseDate,
              purchaseEntry.quantity,
              purchaseEntry.price,
              purchaseEntry.taxAmount ?? 0,
            ).lastInsertRowid as number;

          mockReq = {
            body: {
              shopId,
              productId,
              purchaseDate: "2023-01-12",
              quantity: 100,
              price: 190,
              taxAmount: 17,
            },
          };
          await createPurchase(
            mockReq as Request,
            mockRes as Response,
            mockNext,
          );
          assert.deepStrictEqual(mockRes["statusCode"], 201);
          assert.deepStrictEqual(mockRes["json"], {
            message: "Purchase created successfully",
            purchaseId: purchaseId + 1,
          });
          // clean up
          mockPurchaseModel
            .prepare("DELETE FROM Purchase WHERE purchaseId = ?")
            .run(purchaseId);
          mockPurchaseModel
            .prepare("DELETE FROM Purchase WHERE purchaseId = ?")
            .run(purchaseId + 1);
        });
      });
      suite("with MRP Tax Amount and Non-MRP Tax Amount", () => {
        it("should create a new purchase and return the purchase ID and status 201", async () => {
          const purchaseEntry: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2023-01-12",
            quantity: 10,
            price: 19,
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
              purchaseEntry.shopId,
              purchaseEntry.productId,
              purchaseEntry.purchaseDate,
              purchaseEntry.quantity,
              purchaseEntry.price,
              purchaseEntry.mrpTaxAmount ?? 0,
              purchaseEntry.nonMrpTaxAmount ?? 0,
            ).lastInsertRowid as number;

          mockReq = {
            body: {
              shopId,
              productId,
              purchaseDate: "2023-01-12",
              quantity: 100,
              price: 190,
              mrpTaxAmount: 10,
              nonMrpTaxAmount: 4,
            },
          };
          await createPurchase(
            mockReq as Request,
            mockRes as Response,
            mockNext,
          );
          assert.deepStrictEqual(mockRes["statusCode"], 201);
          assert.deepStrictEqual(mockRes["json"], {
            message: "Purchase created successfully",
            purchaseId: purchaseId + 1,
          });
          // clean up
          mockPurchaseModel
            .prepare("DELETE FROM Purchase WHERE purchaseId = ?")
            .run(purchaseId);
          mockPurchaseModel
            .prepare("DELETE FROM Purchase WHERE purchaseId = ?")
            .run(purchaseId + 1);
        });
      });
    });
  });
};
