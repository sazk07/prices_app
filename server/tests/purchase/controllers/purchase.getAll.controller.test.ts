import { ProductEntry } from "@dataTypes/product.types.js";
import { PurchaseEntry } from "@dataTypes/purchase.types.js";
import { ShopEntry } from "@dataTypes/shop.types.js";
import { ProductModel } from "@product/models/product.model.js";
import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { ShopModel } from "@shop/models/shop.model.js";
import { Request, Response, NextFunction } from "express";
import { DatabaseSync } from "node:sqlite";
import { after, afterEach, before, beforeEach, it, suite } from "node:test";
import { getAllPurchases } from "@purchase/controllers/purchase.getAll.controller.js";
import assert from "node:assert/strict";
import connectToDatabase from "@configs/database.js";

export const testGetAllPurchases = () => {
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
      };
      mockNext = () => {};
    });

    afterEach(() => {
      db.prepare("DELETE FROM Purchase").run();
    });

    after(() => db.close());

    suite("getAllPurchases controller", () => {
      suite("with taxRate", () => {
        it("should return status 201 and a json with an array of purchase objects", async () => {
          const purchaseEntries: PurchaseEntry[] = [
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
              purchaseDate: "2023-11-01",
              quantity: 20,
              price: 59,
              taxRate: 17,
            },
          ];
          for (const entry of purchaseEntries) {
            await mockPurchaseModel.create(entry);
          }
          const purchases = await mockPurchaseModel.findAll();
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
          const purchaseEntries: PurchaseEntry[] = [
            {
              shopId,
              productId,
              purchaseDate: "2023-01-01",
              quantity: 10,
              price: 190,
              taxAmount: 107,
            },
            {
              shopId,
              productId,
              purchaseDate: "2023-11-01",
              quantity: 20,
              price: 590,
              taxAmount: 127,
            },
          ];
          for (const entry of purchaseEntries) {
            await mockPurchaseModel.create(entry);
          }
          const purchases = await mockPurchaseModel.findAll();
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
          const purchaseEntries: PurchaseEntry[] = [
            {
              shopId,
              productId,
              purchaseDate: "2023-01-01",
              quantity: 10,
              price: 190,
              mrpTaxAmount: 107,
              nonMrpTaxAmount: 100,
            },
            {
              shopId,
              productId,
              purchaseDate: "2023-11-01",
              quantity: 20,
              price: 590,
              mrpTaxAmount: 127,
              nonMrpTaxAmount: 111,
            },
          ];
          for (const entry of purchaseEntries) {
            await mockPurchaseModel.create(entry);
          }
          const purchases = await mockPurchaseModel.findAll();
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
