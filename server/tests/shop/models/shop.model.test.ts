import assert from "node:assert/strict";
import { after, afterEach, before, describe, it } from "node:test";
import { ShopModel } from "@shop/models/shop.model.js";
import { ShopEntry } from "@dataTypes/shop.types.js";
import { DatabaseSync } from "node:sqlite";
import connectToDatabase from "@configs/database.js";

describe("ShopModel", () => {
  let shopModel: ShopModel;
  let db: DatabaseSync;

  before(async () => {
    db = await connectToDatabase();
    shopModel = await ShopModel.createInstance();
  });

  afterEach(() => {
    db.prepare("DELETE FROM Shop").run();
  });

  after(() => db.close());

  describe("create method", () => {
    it("should create a new shop successfully and return a number", async () => {
      const entryData: ShopEntry = {
        shopName: "Test Shop",
        shopLocation: "Test Location",
      };
      const result = await shopModel.create(entryData);
      assert.ok(typeof result === "number", "result should be a number");
    });
  });
  describe("findAll method", () => {
    it("should return an array of Shop types", async () => {
      const entries: ShopEntry[] = [
        {
          shopName: "Test Shop 1",
          shopLocation: "Test Location 1",
        },
        {
          shopName: "Test Shop 2",
          shopLocation: "Test Location 2",
        },
      ];
      for (const entry of entries) {
        await shopModel.create(entry);
      }
      const result = await shopModel.findAll();
      assert.ok(Array.isArray(result), "result should be an array");
      result.map((elem, idx) => {
        assert.deepStrictEqual(
          elem?.shopName,
          entries[idx]?.shopName,
          `entry ${idx} shop names should be ${entries[idx]?.shopName}`,
        );
        assert.deepStrictEqual(
          elem?.shopLocation,
          entries[idx]?.shopLocation,
          `entry ${idx} shop locations should be ${entries[idx]?.shopLocation}`,
        );
      });
    });
    it("should return an empty array if no shops are found", async () => {
      const result = await shopModel.findAll();
      assert.deepStrictEqual(result, [], "result should be an empty array");
    });
  });
  describe("findById method", () => {
    const entry: ShopEntry = {
      shopName: "Test Shop",
      shopLocation: "Test Location",
    };
    it("should find a shop by ID and return a Shop type", async () => {
      const createdEntry = await shopModel.create(entry);
      const result = await shopModel.findById(createdEntry);
      assert.deepStrictEqual(
        result?.shopName,
        entry.shopName,
        "shopName should match",
      );
      assert.deepStrictEqual(
        result?.shopLocation,
        entry.shopLocation,
        "shopLocation should match",
      );
    });
    it("should return null if shop is not found by corresponding ID", async () => {
      const createdEntry = await shopModel.create(entry);
      const result = await shopModel.findById(createdEntry + 1);
      assert.deepStrictEqual(result, null, "should be null");
    });
  });
  describe("update method", () => {
    it("should update an existing shop and return true", async () => {
      const entry: ShopEntry = {
        shopName: "Test Shop",
        shopLocation: "Test Location",
      };
      const result = await shopModel.create(entry);
      const updatedEntry: ShopEntry = {
        shopName: "Updated Test Shop",
        shopLocation: "Updated Test Location",
      };
      const updated = await shopModel.update(result, updatedEntry);
      assert.ok(typeof updated === "boolean", "updated should be a boolean");
      assert.deepStrictEqual(updated, true, "should be true");
    });
    it("should return false if no changes are made", async (t) => {
      const entry: ShopEntry = {
        shopName: "Test Shop",
        shopLocation: "Test Location",
      };
      const result = await shopModel.create(entry);
      const updatedEntry: ShopEntry = {
        shopName: "Updated Test Shop",
        shopLocation: "Updated Test Location",
      };
      t.mock.method(shopModel, "update", () => false);
      const updated = await shopModel.update(result, updatedEntry);
      assert.ok(typeof updated === "boolean", "updated should be a boolean");
      assert.deepStrictEqual(updated, false, "should be false");
    });
  });
  describe("delete method", () => {
    it("should delete an existing shop and return true", async () => {
      const entry: ShopEntry = {
        shopName: "Test Shop",
        shopLocation: "Test Location",
      };
      const result = await shopModel.create(entry);
      const deleted = await shopModel.delete(result);
      assert.deepStrictEqual(deleted, true, "should be true");
    });
    it("should return false if no changes are made", async (t) => {
      const entry: ShopEntry = {
        shopName: "Test Shop",
        shopLocation: "Test Location",
      };
      const result = await shopModel.create(entry);
      t.mock.method(shopModel, "delete", () => false);
      const deleted = await shopModel.delete(result);
      assert.ok(typeof deleted === "boolean", "deleted should be a boolean");
      assert.deepStrictEqual(deleted, false, "should be false");
    });
  });
});
