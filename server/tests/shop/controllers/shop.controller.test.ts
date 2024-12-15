import { ShopModel } from "@shop/models/shop.model.js";
import { NextFunction, Request, Response } from "express";
import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { createShop } from "@shop/controllers/shop.create.controller.js";
import { DatabaseSync } from "node:sqlite";
import { ShopEntry } from "@dataTypes/shop.types.js";
import { getAllShops } from "@shop/controllers/shop.getAll.controller.js";
import { getShopById } from "@shop/controllers/shop.getById.controller.js";
import { updateShop } from "@shop/controllers/shop.update.controller.js";
import { deleteShop } from "@shop/controllers/shop.delete.controller.js";
import connectToDatabase from "@configs/database.js";

describe("Shop Controllers", () => {
  let mockShopModel: ShopModel;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let db: DatabaseSync;

  beforeEach(async () => {
    mockShopModel = await ShopModel.createInstance();
    db = await connectToDatabase();
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
    db.prepare("DELETE FROM Shop").run();
    db.close();
  });

  describe("createShop", () => {
    it("should create a new shop", async () => {
      const shopEntry: ShopEntry = {
        shopName: "Another Test Shop",
        shopLocation: "Another Test Location",
      };
      const shopId = await mockShopModel.create(shopEntry);
      mockReq = {
        body: {
          shopName: "Test Shop",
          shopLocation: "Test Location",
        },
        params: {
          id: String(shopId + 1),
        },
      };
      await createShop(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(mockRes["statusCode"], 201);
      assert.deepStrictEqual(mockRes["json"], {
        message: "Shop created successfully",
        shopId: shopId + 1,
      });
    });
  });
  describe("getAllShops", () => {
    it("should return an array of shop objects", async () => {
      const shopEntries: ShopEntry[] = [
        {
          shopName: "Test Shop",
          shopLocation: "Test Location",
        },
        {
          shopName: "Another Test Shop",
          shopLocation: "Another Test Location",
        },
      ];
      for (const entry of shopEntries) {
        await mockShopModel.create(entry);
      }
      const shops = await mockShopModel.findAll();
      await getAllShops(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(mockRes["statusCode"], 200);
      assert.deepStrictEqual(mockRes.json, shops);
    });
  });
  describe("getShopById", () => {
    it("should return a single shop object", async () => {
      const shopEntry: ShopEntry = {
        shopName: "Test Shop",
        shopLocation: "Test Location",
      };
      const shopId = await mockShopModel.create(shopEntry);
      const shop = await mockShopModel.findById(shopId);
      mockReq = {
        params: {
          id: shopId.toString(),
        },
        body: {
          shopName: "Another Test Shop",
          shopLocation: "Another Test Location",
        },
      };
      await getShopById(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(
        mockRes["statusCode"],
        200,
        "Status code should be 200",
      );
      assert.deepStrictEqual(mockRes["json"], shop);
    });
  });
  describe("updateShop", () => {
    it("should update shop and return status 204", async () => {
      const shopEntry: ShopEntry = {
        shopName: "Test Shop",
        shopLocation: "Test Location",
      };
      const shopId = await mockShopModel.create(shopEntry);
      const updatedShopEntry: ShopEntry = {
        shopName: "Updated Test Shop",
        shopLocation: "Updated Test Location",
      };
      mockReq = {
        params: {
          id: shopId.toString(),
        },
        body: updatedShopEntry,
      };
      await updateShop(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(mockRes["statusCode"], 204);
    });
  });
  describe("deleteShop", () => {
    it("should delete a shop and return status 204", async () => {
      const shopEntry: ShopEntry = {
        shopName: "Test Shop",
        shopLocation: "Test Location",
      };
      const shopId = await mockShopModel.create(shopEntry);
      mockReq = {
        params: {
          id: shopId.toString(),
        },
      };
      await deleteShop(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(mockRes["statusCode"], 204);
    });
  });
});
