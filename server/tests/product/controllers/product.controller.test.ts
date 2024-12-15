import { ProductEntry } from "@dataTypes/product.types.js";
import { ProductModel } from "@product/models/product.model.js";
import { NextFunction, Request, Response } from "express";
import { DatabaseSync } from "node:sqlite";
import { after, afterEach, before, beforeEach, describe, it } from "node:test";
import { createProduct } from "@product/controllers/product.create.controller.js";
import assert from "node:assert/strict";
import { getAllProducts } from "@product/controllers/product.getAll.controller.js";
import { getProductById } from "@product/controllers/product.getById.controller.js";
import { updateProduct } from "@product/controllers/product.update.controller.js";
import { deleteProduct } from "@product/controllers/product.delete.controller.js";
import connectToDatabase from "@configs/database.js";

describe("Product Controllers", () => {
  let mockProductModel: ProductModel;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let db: DatabaseSync;

  before(async () => {
    mockProductModel = await ProductModel.createInstance();
    db = await connectToDatabase();
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

  afterEach(() => {
    db.prepare("DELETE FROM Product").run();
  });

  after(() => db.close());

  describe("createProduct", () => {
    it("should create a new product and return the product ID and status 201", async () => {
      const productEntry: ProductEntry = {
        productName: "Another Test Product",
        productBrand: "Another Test Brand",
        productCategory: "Another Test Category",
      };
      const productId = await mockProductModel.create(productEntry);
      mockReq = {
        body: {
          productName: "Test Product",
          productBrand: "Test Brand",
          productCategory: "Test Category",
        },
        params: {
          id: String(productId + 1),
        },
      };
      await createProduct(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(mockRes["statusCode"], 201);
      assert.deepStrictEqual(mockRes["json"], {
        message: "Product created successfully",
        productId: productId + 1,
      });
    });
  });
  describe("getAllProducts controller", () => {
    it("should return an array of product objects", async () => {
      const productEntries: ProductEntry[] = [
        {
          productName: "Test Product",
          productBrand: "Test Brand",
          productCategory: "Test Category",
        },
        {
          productName: "Another Test Product",
          productBrand: "Another Test Brand",
          productCategory: "Another Test Category",
        },
      ];
      for (const entry of productEntries) {
        await mockProductModel.create(entry);
      }
      const products = await mockProductModel.findAll();
      await getAllProducts(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(mockRes["statusCode"], 200);
      assert.deepStrictEqual(mockRes.json, products);
    });
  });
  describe("getProductById", () => {
    it("should return a product object", async () => {
      const productEntry: ProductEntry = {
        productName: "Test Product",
        productBrand: "Test Brand",
        productCategory: "Test Category",
      };
      const productId = await mockProductModel.create(productEntry);
      const product = await mockProductModel.findById(productId);
      mockReq = {
        params: {
          id: String(productId),
        },
      };
      await getProductById(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(mockRes["statusCode"], 200);
      assert.deepStrictEqual(mockRes.json, product);
    });
  });
  describe("updateProduct", () => {
    it("should update a product and return status 204", async () => {
      const productEntry: ProductEntry = {
        productName: "Test Product",
        productBrand: "Test Brand",
        productCategory: "Test Category",
      };
      const productId = await mockProductModel.create(productEntry);
      const updatedProductEntry: ProductEntry = {
        productName: "Updated Test Product",
        productBrand: "Updated Test Brand",
        productCategory: "Updated Test Category",
      };
      mockReq = {
        params: {
          id: productId.toString(),
        },
        body: updatedProductEntry,
      };
      await updateProduct(mockReq as Request, mockRes as Response, mockNext);
      assert.deepStrictEqual(mockRes["statusCode"], 204);
    });
  });
  describe("deleteProduct", () => {
    it("should delete a product and return status 204", async () => {
      const productEntry: ProductEntry = {
        productName: "Test Product",
        productBrand: "Test Brand",
        productCategory: "Test Category",
      };
      const productId = await mockProductModel.create(productEntry);
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
