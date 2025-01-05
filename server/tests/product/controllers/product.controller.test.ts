import { ProductEntry } from "@dataTypes/product.types.js";
import { ProductModel } from "@product/models/product.model.js";
import { NextFunction, Request, Response } from "express";
import { DatabaseSync } from "node:sqlite";
import { before, beforeEach, describe, it } from "node:test";
import { createProduct } from "@product/controllers/product.create.controller.js";
import assert from "node:assert/strict";
import { getAllProducts } from "@product/controllers/product.getAll.controller.js";
import { getProductById } from "@product/controllers/product.getById.controller.js";
import { updateProduct } from "@product/controllers/product.update.controller.js";
import { deleteProduct } from "@product/controllers/product.delete.controller.js";

describe("Product Controllers", () => {
  let mockProductModel: DatabaseSync;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  before(async () => {
    mockProductModel = await ProductModel();
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

  describe("createProduct", () => {
    it("should create a new product and return the product ID and status 201", async () => {
      const mockProductEntry: ProductEntry = {
        productName: "Test Product 100",
        productBrand: "Test Brand 100",
        productCategory: "Test Category 100",
      };
      const productId = mockProductModel
        .prepare(
          `
          INSERT INTO Product
            (productName, productBrand, productCategory)
          VALUES (?, ?, ?)
        `,
        )
        .run(
          mockProductEntry.productName,
          mockProductEntry.productBrand,
          mockProductEntry.productCategory,
        ).lastInsertRowid as number;

      mockReq = {
        body: {
          productName: "Test Product 101",
          productBrand: "Test Brand 101",
          productCategory: "Test Category 101",
        },
      };
      await createProduct(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(mockRes["statusCode"], 201);
      assert.deepStrictEqual(mockRes["json"], {
        message: "Product created successfully",
        productId: productId + 1,
      });
      // clean up
      mockProductModel
        .prepare("DELETE FROM Product WHERE productId = ?")
        .run(productId);
      mockProductModel
        .prepare("DELETE FROM Product WHERE productId = ?")
        .run(productId + 1);
    });
  });
  describe("getAllProducts controller", () => {
    it("should return an array of product objects", async () => {
      const products = mockProductModel
        .prepare(
          `
        SELECT
          productId,
          productName,
          productBrand,
          productCategory
        FROM Product
      `,
        )
        .all();

      await getAllProducts(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(mockRes["statusCode"], 200);
      assert.deepStrictEqual(mockRes.json, products);
    });
  });
  describe("getProductById", () => {
    it("should return a product object", async () => {
      const productEntry: ProductEntry = {
        productName: "Test Product 102",
        productBrand: "Test Brand 102",
        productCategory: "Test Category 102",
      };
      const productId = mockProductModel
        .prepare(
          `
          INSERT INTO Product
            (productName, productBrand, productCategory)
          VALUES (?, ?, ?)
        `,
        )
        .run(
          productEntry.productName,
          productEntry.productBrand,
          productEntry.productCategory,
        ).lastInsertRowid as number;

      mockReq = {
        params: {
          id: String(productId),
        },
      };
      await getProductById(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(mockRes["statusCode"], 200);

      const product = mockProductModel
        .prepare(
          `
          SELECT
            productId,
            productName,
            productBrand,
            productCategory
          FROM Product
          WHERE productId = ?
        `,
        )
        .get(productId);
      assert.deepStrictEqual(mockRes.json, product);
      // clean up
      mockProductModel
        .prepare("DELETE FROM Product WHERE productId = ?")
        .run(productId);
    });
  });
  describe("updateProduct", () => {
    it("should update a product and return status 204", async () => {
      const productEntry: ProductEntry = {
        productName: "Test Product 103",
        productBrand: "Test Brand 103",
        productCategory: "Test Category 103",
      };
      const productId = mockProductModel
        .prepare(
          `
          INSERT INTO Product
            (productName, productBrand, productCategory)
          VALUES (?, ?, ?)
        `,
        )
        .run(
          productEntry.productName,
          productEntry.productBrand,
          productEntry.productCategory,
        ).lastInsertRowid as number;
      const updatedProductEntry: ProductEntry = {
        productName: "Test Product 104",
        productBrand: "Test Brand 104",
        productCategory: "Test Category 104",
      };

      mockReq = {
        params: {
          id: productId.toString(),
        },
        body: updatedProductEntry,
      };
      await updateProduct(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(mockRes["statusCode"], 204);
      // clean up
      mockProductModel
        .prepare("DELETE FROM Product WHERE productId = ?")
        .run(productId);
    });
  });
  describe("deleteProduct", () => {
    it("should delete a product and return status 204", async () => {
      const productEntry: ProductEntry = {
        productName: "Test Product 105",
        productBrand: "Test Brand 105",
        productCategory: "Test Category 105",
      };
      const productId = mockProductModel
        .prepare(
          `
          INSERT INTO Product
            (productName, productBrand, productCategory)
          VALUES (?, ?, ?)
        `,
        )
        .run(
          productEntry.productName,
          productEntry.productBrand,
          productEntry.productCategory,
        ).lastInsertRowid as number;

      mockReq = {
        params: {
          id: productId.toString(),
        },
      };
      await deleteProduct(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(mockRes["statusCode"], 204);
    });
  });
});
