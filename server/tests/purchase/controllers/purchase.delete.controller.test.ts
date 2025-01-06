import { ProductEntry } from "@dataTypes/product.types.js";
import { PurchaseEntry } from "@dataTypes/purchase.types.js";
import { ShopEntry } from "@dataTypes/shop.types.js";
import { ProductModel } from "@product/models/product.model.js";
import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { ShopModel } from "@shop/models/shop.model.js";
import { NextFunction, Request, Response } from "express";
import { DatabaseSync } from "node:sqlite";
import { before, afterEach, beforeEach, it, suite } from "node:test";
import { deletePurchase } from "@purchase/controllers/purchase.delete.controller.js";
import assert from "assert";

export const testDeletePurchase = () => {
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
        shopName: "Test Shop from purchaseDelete",
        shopLocation: "Test Location from purchaseDelete",
      };
      shopId = mockShopModel
        .prepare("INSERT INTO Shop (shopName, shopLocation) VALUES (?, ?)")
        .run(shopEntryData.shopName, shopEntryData.shopLocation)
        .lastInsertRowid as number;

      productEntryData = {
        productName: "Test Product from purchaseDelete",
        productCategory: "Test Category from purchaseDelete",
        productBrand: "Test Brand from purchaseDelete",
      };
      productId = mockProductModel
        .prepare(
          `
          INSERT INTO Product (
            productName,
            productCategory,
            productBrand)
          VALUES (?, ?, ?)
        `,
        )
        .run(
          productEntryData.productName,
          productEntryData.productCategory,
          productEntryData.productBrand,
        ).lastInsertRowid as number;

      mockReq = {};
      mockRes = {
        json: function (data: any) {
          this.json = data;
          return this as Response;
        },
        status: function (code: number) {
          this.statusCode = code;
          return this as Response;
        },
      };
      mockNext = () => {};
    });

    afterEach(() => {
      mockShopModel.prepare("DELETE FROM Shop WHERE shopId = ?").run(shopId);
      mockPurchaseModel
        .prepare("DELETE FROM Product WHERE productId = ?")
        .run(productId);
    });

    suite("deletePurchase controller", () => {
      suite("with taxRate", () => {
        it("should delete a purchase and return status 204", async () => {
          const purchaseEntryData: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2022-01-01",
            quantity: 10,
            price: 19,
            taxRate: 17,
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
                taxRate)
              VALUES (?, ?, ?, ?, ?, ?)
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
            params: {
              id: purchaseId.toString(),
            },
          };
          await deletePurchase(
            mockReq as Request,
            mockRes as Response,
            mockNext,
          );
          assert.deepStrictEqual(mockRes["statusCode"], 204);
          // clean up
          mockPurchaseModel
            .prepare("DELETE FROM Purchase WHERE purchaseId = ?")
            .run(purchaseId);
        });
      });
      suite("with taxAmount", () => {
        it("should delete a purchase and return status 204", async () => {
          const purchaseEntryData: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2022-01-01",
            quantity: 10,
            price: 19,
            taxAmount: 9,
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
                taxAmount)
              VALUES (?, ?, ?, ?, ?, ?)
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
            params: {
              id: purchaseId.toString(),
            },
          };
          await deletePurchase(
            mockReq as Request,
            mockRes as Response,
            mockNext,
          );
          assert.deepStrictEqual(mockRes["statusCode"], 204);
          // clean up
          mockPurchaseModel
            .prepare("DELETE FROM Purchase WHERE purchaseId = ?")
            .run(purchaseId);
        });
      });
      suite("with MRP and non-MRP Tax Amounts", () => {
        it("should delete a purchase and return status 204", async () => {
          const purchaseEntryData: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2022-01-01",
            quantity: 10,
            price: 19,
            mrpTaxAmount: 5,
            nonMrpTaxAmount: 3,
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
              VALUES (?, ?, ?, ?, ?, ?, ?)
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
            params: {
              id: purchaseId.toString(),
            },
          };
          await deletePurchase(
            mockReq as Request,
            mockRes as Response,
            mockNext,
          );
          assert.deepStrictEqual(mockRes["statusCode"], 204);
          // clean up
          mockPurchaseModel
            .prepare("DELETE FROM Purchase WHERE purchaseId = ?")
            .run(purchaseId);
        });
      });
    });
  });
};
