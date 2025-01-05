import { ShopModel } from "@shop/models/shop.model.js";
import { NextFunction, Request, Response } from "express";
import { before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { createShop } from "@shop/controllers/shop.create.controller.js";
import { DatabaseSync } from "node:sqlite";
import { ShopEntry } from "@dataTypes/shop.types.js";
import { getAllShops } from "@shop/controllers/shop.getAll.controller.js";
import { getShopById } from "@shop/controllers/shop.getById.controller.js";
import { updateShop } from "@shop/controllers/shop.update.controller.js";
import { deleteShop } from "@shop/controllers/shop.delete.controller.js";

describe("Shop Controllers", () => {
  let mockShopModel: DatabaseSync;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  before(async () => {
    mockShopModel = await ShopModel();
  });

  beforeEach(async () => {
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

  describe("createShop", () => {
    it("should create a new shop", async () => {
      const mockShopEntry: ShopEntry = {
        shopName: "Test Shop 100",
        shopLocation: "Test Shop Location 100",
      };
      const shopId = mockShopModel
        .prepare("INSERT INTO Shop (shopName, shopLocation) VALUES (?, ?)")
        .run(mockShopEntry.shopName, mockShopEntry.shopLocation)
        .lastInsertRowid as number;

      mockReq = {
        body: {
          shopName: "Test Shop 101",
          shopLocation: "Test Shop 101",
        },
      };
      await createShop(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(mockRes["statusCode"], 201);
      assert.deepStrictEqual(mockRes["json"], {
        message: "Shop created successfully",
        shopId: shopId + 1,
      });
      // clean up
      mockShopModel.prepare("DELETE FROM Shop WHERE shopId = ?").run(shopId);
      mockShopModel
        .prepare("DELETE FROM Shop WHERE shopId = ?")
        .run(shopId + 1);
    });
  });
  describe("getAllShops", () => {
    it("should return an array of shop objects", async () => {
      const shops = mockShopModel
        .prepare("SELECT shopId, shopName, shopLocation FROM Shop")
        .all();

      await getAllShops(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(mockRes["statusCode"], 200);
      assert.deepStrictEqual(mockRes.json, shops);
    });
  });
  describe("getShopById", () => {
    it("should return a single shop object", async () => {
      const shopEntry: ShopEntry = {
        shopName: "Test Shop 102",
        shopLocation: "Test Location 102",
      };
      const shopId = mockShopModel
        .prepare("INSERT INTO Shop (shopName, shopLocation) VALUES (?, ?)")
        .run(shopEntry.shopName, shopEntry.shopLocation)
        .lastInsertRowid as number;

      mockReq = {
        params: {
          id: shopId.toString(),
        },
      };
      await getShopById(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(
        mockRes["statusCode"],
        200,
        "Status code should be 200",
      );

      const shop = mockShopModel
        .prepare(
          "SELECT shopId, shopName, shopLocation FROM Shop WHERE shopId = ?",
        )
        .get(shopId);
      assert.deepStrictEqual(mockRes["json"], shop);
      // clean up
      mockShopModel.prepare("DELETE FROM Shop WHERE shopId = ?").run(shopId);
    });
  });
  describe("updateShop", () => {
    it("should update shop and return status 204", async () => {
      const shopEntry: ShopEntry = {
        shopName: "Test Shop 103",
        shopLocation: "Test Location 103",
      };
      const shopId = mockShopModel
        .prepare("INSERT INTO Shop (shopName, shopLocation) VALUES (?, ?)")
        .run(shopEntry.shopName, shopEntry.shopLocation)
        .lastInsertRowid as number;

      const updatedShopEntry: ShopEntry = {
        shopName: "Test Shop 104",
        shopLocation: "Test Location 104",
      };

      mockReq = {
        params: {
          id: shopId.toString(),
        },
        body: updatedShopEntry,
      };
      await updateShop(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(mockRes["statusCode"], 204);
      // clean up
      mockShopModel.prepare("DELETE FROM Shop WHERE shopId = ?").run(shopId);
    });
  });
  describe("deleteShop", () => {
    it("should delete a shop and return status 204", async () => {
      const shopEntry: ShopEntry = {
        shopName: "Test Shop 105",
        shopLocation: "Test Location 105",
      };
      const shopId = mockShopModel
        .prepare("INSERT INTO Shop (shopName, shopLocation) VALUES (?, ?)")
        .run(shopEntry.shopName, shopEntry.shopLocation)
        .lastInsertRowid as number;

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
