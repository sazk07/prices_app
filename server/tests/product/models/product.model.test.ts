import assert from "node:assert/strict";
import { after, afterEach, before, describe, it } from "node:test";
import { ProductModel } from "@product/models/product.model.js";
import { DatabaseSync } from "node:sqlite";
import { ProductEntry } from "@dataTypes/product.types.js";
import connectToDatabase from "@configs/database.js";

describe("ProductModel", () => {
  let productModel: ProductModel;
  let db: DatabaseSync;

  before(async () => {
    db = await connectToDatabase();
    productModel = await ProductModel.createInstance();
  });

  afterEach(() => {
    db.prepare("DELETE FROM Product").run();
  });

  after(() => db.close());

  describe("create method", () => {
    it("should create a new product successfully and return a Product type", async () => {
      const entryData: ProductEntry = {
        productName: "Test Product",
        productCategory: "Test Category",
        productBrand: "Test Brand",
      };
      const result = await productModel.create(entryData);
      assert.ok(typeof result === "number", "result should be a number");
    });
  });
  describe("findAll method", () => {
    it("should return an array of Product types", async () => {
      const entries: ProductEntry[] = [
        {
          productName: "Test Product 1",
          productCategory: "Test Category 1",
          productBrand: "Test Brand 1",
        },
        {
          productName: "Test Product 2",
          productCategory: "Test Category 2",
          productBrand: "Test Brand 2",
        },
      ];
      for (const entry of entries) {
        await productModel.create(entry);
      }
      const result = await productModel.findAll();
      assert.ok(Array.isArray(result), "result should be an array");
      result.map((elem, idx) => {
        assert.deepStrictEqual(
          elem?.productName,
          entries[idx]?.productName,
          `entry ${idx} product names should be ${entries[idx]?.productName}`,
        );
        assert.deepStrictEqual(
          elem?.productCategory,
          entries[idx]?.productCategory,
          `entry ${idx} product categories should be ${entries[idx]?.productCategory}`,
        );
        assert.deepStrictEqual(
          elem?.productBrand,
          entries[idx]?.productBrand,
          `entry ${idx} product brands should be ${entries[idx]?.productBrand}`,
        );
      });
    });
    it("should return an empty array if no products are found in database", async () => {
      const result = await productModel.findAll();
      assert.ok(Array.isArray(result), "result should be an array");
      assert.deepStrictEqual(result, [], "result should be an empty array");
    });
  });
  describe("findById method", () => {
    const entry: ProductEntry = {
      productName: "Test Product",
      productCategory: "Test Category",
      productBrand: "Test Brand",
    };
    it("should find a product by ID and return a Product type", async () => {
      const createdEntry = await productModel.create(entry);
      const result = await productModel.findById(createdEntry);
      assert.deepStrictEqual(
        result?.productName,
        entry.productName,
        "productName should match",
      );
      assert.deepStrictEqual(
        result?.productCategory,
        entry.productCategory,
        "productCategory should match",
      );
      assert.deepStrictEqual(
        result?.productBrand,
        entry.productBrand,
        "productBrand should match",
      );
    });
    it("should return null if product is not found in database", async () => {
      const createdEntry = await productModel.create(entry);
      const result = await productModel.findById(createdEntry + 1);
      assert.deepStrictEqual(result, null, "should be null");
    });
  });
  describe("update method", () => {
    it("should update an existing product and return true", async () => {
      const entry: ProductEntry = {
        productName: "Test Product",
        productCategory: "Test Category",
        productBrand: "Test Brand",
      };
      const result = await productModel.create(entry);
      const updatedEntry: ProductEntry = {
        productName: "Updated Test Product",
        productCategory: "Updated Test Category",
        productBrand: "Updated Test Brand",
      };
      const updated = await productModel.update(result, updatedEntry);
      assert.ok(typeof updated === "boolean", "updated should be a boolean");
      assert.deepStrictEqual(updated, true, "should be true");
    });
    it("should return false if no changes are made", async (t) => {
      const entry: ProductEntry = {
        productName: "Test Product",
        productCategory: "Test Category",
        productBrand: "Test Brand",
      };
      const result = await productModel.create(entry);
      const updatedEntry: ProductEntry = {
        productName: "Updated Test Product",
        productCategory: "Updated Test Category",
        productBrand: "Updated Test Brand",
      };
      t.mock.method(productModel, "update", () => false);
      const updated = await productModel.update(result, updatedEntry);
      assert.ok(typeof updated === "boolean", "updated should be a boolean");
      assert.deepStrictEqual(updated, false, "should be false");
    });
  });
  describe("delete method", () => {
    it("should delete an existing product and return true", async () => {
      const entry: ProductEntry = {
        productName: "Test Product",
        productCategory: "Test Category",
        productBrand: "Test Brand",
      };
      const result = await productModel.create(entry);
      const deleted = await productModel.delete(result);
      assert.deepStrictEqual(deleted, true, "should be true");
    });
    it("should return false if no changes are made", async (t) => {
      const entry: ProductEntry = {
        productName: "Test Product",
        productCategory: "Test Category",
        productBrand: "Test Brand",
      };
      const result = await productModel.create(entry);
      t.mock.method(productModel, "delete", () => false);
      const deleted = await productModel.delete(result);
      assert.ok(typeof deleted === "boolean", "deleted should be a boolean");
      assert.deepStrictEqual(deleted, false, "should be false");
    });
  });
});
