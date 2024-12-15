import { ProductEntry } from "@dataTypes/product.types.js";
import { PurchaseEntry } from "@dataTypes/purchase.types.js";
import { ShopEntry } from "@dataTypes/shop.types.js";
import { ProductModel } from "@product/models/product.model.js";
import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { ShopModel } from "@shop/models/shop.model.js";
import { NextFunction, Request, Response } from "express";
import { DatabaseSync } from "node:sqlite";
import { after, afterEach, before, beforeEach, it, suite } from "node:test";
import { getPurchaseById } from "@purchase/controllers/purchase.getById.controller.js";
import assert from "node:assert/strict";
import connectToDatabase from "@configs/database.js";

export const testGetPurchaseById = () => {
  suite("PurchaseController", () => {
    let mockPurchaseModel: PurchaseModel;
    let mockShopModel: ShopModel;
    let mockProductModel: ProductModel;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let db: DatabaseSync;
    let shopId: number;
    let productId: number;

    before(async () => {
      mockPurchaseModel = await PurchaseModel.createInstance();
      mockShopModel = await ShopModel.createInstance();
      mockProductModel = await ProductModel.createInstance();
      db = await connectToDatabase();
    });

    beforeEach(async () => {
      db.prepare("DELETE FROM Shop").run();
      db.prepare("DELETE FROM Product").run();
      const shopEntryData: ShopEntry = {
        shopName: "Another Test Shop",
        shopLocation: "Another Test Location",
      };
      shopId = await mockShopModel.create(shopEntryData);

      const productEntryData: ProductEntry = {
        productName: "Another Test Product",
        productBrand: "Another Test Brand",
        productCategory: "Another Test Category",
      };
      productId = await mockProductModel.create(productEntryData);

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
      db.prepare("DELETE FROM Purchase").run();
    });

    after(() => db.close());

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
          const purchaseId = await mockPurchaseModel.create(purchaseEntryData);
          const purchase = await mockPurchaseModel.findById(purchaseId);
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
          assert.deepStrictEqual(mockRes.json, purchase);
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
          const purchaseId = await mockPurchaseModel.create(purchaseEntryData);
          const purchase = await mockPurchaseModel.findById(purchaseId);
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
          assert.deepStrictEqual(mockRes.json, purchase);
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
          const purchaseId = await mockPurchaseModel.create(purchaseEntryData);
          const purchase = await mockPurchaseModel.findById(purchaseId);
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
          assert.deepStrictEqual(mockRes.json, purchase);
        });
      });
    });
  });
};
