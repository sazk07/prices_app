import { ProductEntry } from "@dataTypes/product.types.js";
import { PurchaseEntry } from "@dataTypes/purchase.types.js";
import { ShopEntry } from "@dataTypes/shop.types.js";
import { ProductModel } from "@product/models/product.model.js";
import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { ShopModel } from "@shop/models/shop.model.js";
import { NextFunction, Request, Response } from "express";
import { DatabaseSync } from "node:sqlite";
import { after, afterEach, before, beforeEach, it, suite } from "node:test";
import { updatePurchase } from "@purchase/controllers/purchase.update.controller.js";
import assert from "node:assert/strict";
import connectToDatabase from "@configs/database.js";

export const testUpdatePurchase = () => {
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
        productCategory: "Another Test Category",
        productBrand: "Another Test Brand",
      };
      productId = await mockProductModel.create(productEntryData);

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
      db.prepare("DELETE FROM Purchase").run();
    });

    after(() => db.close());

    suite("updatePurchase controller", () => {
      suite("with taxRate", () => {
        it("should update a purchase and return status 204", async () => {
          const purchaseEntryData: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2022-01-01",
            quantity: 10,
            price: 19,
            taxRate: 17,
          };
          const purchaseId = await mockPurchaseModel.create(purchaseEntryData);
          const updatedPurchaseEntryData: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2022-01-01",
            quantity: 22,
            price: 85,
            taxRate: 18,
          };
          mockReq = {
            params: {
              id: purchaseId.toString(),
            },
            body: updatedPurchaseEntryData,
          };
          await updatePurchase(
            mockReq as Request,
            mockRes as Response,
            mockNext,
          );
          assert.deepStrictEqual(mockRes["statusCode"], 204);
        });
      });
      suite("with taxAmount", () => {
        it("should update a purchase and return status 204", async () => {
          const purchaseEntryData: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2022-01-01",
            quantity: 10,
            price: 19,
            taxAmount: 4,
          };
          const purchaseId = await mockPurchaseModel.create(purchaseEntryData);
          const updatedPurchaseEntryData: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2022-01-01",
            quantity: 22,
            price: 85,
            taxAmount: 44,
          };
          mockReq = {
            params: {
              id: purchaseId.toString(),
            },
            body: updatedPurchaseEntryData,
          };
          await updatePurchase(
            mockReq as Request,
            mockRes as Response,
            mockNext,
          );
          assert.deepStrictEqual(mockRes["statusCode"], 204);
        });
      });
      suite("with MRP and non-MRP Tax Amounts", () => {
        it("should update a purchase and return status 204", async () => {
          const purchaseEntryData: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2022-01-01",
            quantity: 10,
            price: 19,
            mrpTaxAmount: 12,
            nonMrpTaxAmount: 9,
          };
          const purchaseId = await mockPurchaseModel.create(purchaseEntryData);
          const updatedPurchaseEntryData: PurchaseEntry = {
            shopId,
            productId,
            purchaseDate: "2022-01-01",
            quantity: 22,
            price: 85,
            mrpTaxAmount: 25,
            nonMrpTaxAmount: 13,
          };
          mockReq = {
            params: {
              id: purchaseId.toString(),
            },
            body: updatedPurchaseEntryData,
          };
          await updatePurchase(
            mockReq as Request,
            mockRes as Response,
            mockNext,
          );
          assert.deepStrictEqual(mockRes["statusCode"], 204);
        });
      });
    });
  });
};
