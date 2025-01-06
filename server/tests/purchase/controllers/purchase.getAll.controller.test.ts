import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { Request, Response, NextFunction } from "express";
import { DatabaseSync } from "node:sqlite";
import { before, beforeEach, it, suite } from "node:test";
import { getAllPurchases } from "@purchase/controllers/purchase.getAll.controller.js";
import assert from "node:assert/strict";

export const testGetAllPurchases = () => {
  suite("PurchaseController", () => {
    let mockPurchaseModel: DatabaseSync;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    before(async () => {
      mockPurchaseModel = await PurchaseModel();
    });

    beforeEach(async () => {
      mockReq = {};
      mockRes = {
        json: function (data: any) {
          this.json = data;
          return this as Response;
        },
      };
      mockNext = () => {};
    });

    suite("getAllPurchases controller", () => {
      suite("with taxRate", () => {
        it("should return status 201 and a json with an array of purchase objects", async () => {
          const purchases = mockPurchaseModel
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
            `,
            )
            .all();

          await getAllPurchases(
            mockReq as Request,
            mockRes as Response,
            mockNext,
          );
          assert.deepStrictEqual(mockRes["statusCode"], 200);
          assert.deepStrictEqual(mockRes.json, purchases);
        });
      });
      suite("with taxAmount", () => {
        it("should return status 201 and a json with an array of purchase objects", async () => {
          const purchases = mockPurchaseModel
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
            `,
            )
            .all();

          await getAllPurchases(
            mockReq as Request,
            mockRes as Response,
            mockNext,
          );
          assert.deepStrictEqual(mockRes["statusCode"], 200);
          assert.deepStrictEqual(mockRes.json, purchases);
        });
      });
      suite("with MRP and non-MRP Tax Amounts", () => {
        it("should return status 201 and a json with an array of purchase objects", async () => {
          const purchases = mockPurchaseModel
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
            `,
            )
            .all();

          await getAllPurchases(
            mockReq as Request,
            mockRes as Response,
            mockNext,
          );
          assert.deepStrictEqual(mockRes["statusCode"], 200);
          assert.deepStrictEqual(mockRes.json, purchases);
        });
      });
    });
  });
};
