import { NextFunction, Request, Response } from "express";
import { PurchaseModel } from "@purchase/models/purchase.model.js";
import { DatabaseSync } from "node:sqlite";
import { after, afterEach, before, beforeEach, it, suite } from "node:test";
import { PurchaseEntry } from "@dataTypes/purchase.types.js";
import { ShopEntry } from "@dataTypes/shop.types.js";
import { ShopModel } from "@shop/models/shop.model.js";
import { ProductEntry } from "@dataTypes/product.types.js";
import { ProductModel } from "@product/models/product.model.js";
import { createPurchase } from "@purchase/controllers/purchase.create.controller.js";
import assert from "node:assert/strict";
import connectToDatabase from "@configs/database.js";

export const testCreatePurchase = () => {
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
      db.prepare("DELETE FROM Purchase").run();
    });

    after(() => db.close());

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
          const purchaseId = await mockPurchaseModel.create(purchaseEntry);
          mockReq = {
            body: {
              shopId,
              productId,
              purchaseDate: "2023-01-12",
              quantity: 100,
              price: 190,
              taxRate: 17,
            },
            params: {
              id: String(purchaseId + 1),
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
          const purchaseId = await mockPurchaseModel.create(purchaseEntry);
          mockReq = {
            body: {
              shopId,
              productId,
              purchaseDate: "2023-01-12",
              quantity: 100,
              price: 190,
              taxAmount: 17,
            },
            params: {
              id: String(purchaseId + 1),
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
          const purchaseId = await mockPurchaseModel.create(purchaseEntry);
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
            params: {
              id: String(purchaseId + 1),
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
        });
      });
    });
  });
};
