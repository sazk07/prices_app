import { setupServer } from "msw/node";
import assert from "node:assert/strict";
import { after, afterEach, before, describe, it } from "node:test";
import { productHandlers } from "./productHandlers.js";
import { ProductOutput } from "@dataTypes/product.types.js";

export const testProductRoutes = () => {
  describe("Product functional test", () => {
    const server = setupServer(...productHandlers);
    before(() => {
      server.listen({
        onUnhandledRequest: "error",
      });
    });
    afterEach(() => server.resetHandlers());
    after(() => server.close());

    it("should return 200 OK as JSON response and a list of products on GET /products", async () => {
      const response = await fetch("http://localhost:3000/products");
      const data = (await response.json()) as ProductOutput[];
      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(data.length, 2);
      assert.deepStrictEqual(
        (data[0] as ProductOutput).productName,
        "Test Product 1",
      );
      assert.deepStrictEqual(
        (data[1] as ProductOutput).productName,
        "Test Product 2",
      );
      assert.deepStrictEqual(
        (data[0] as ProductOutput).productCategory,
        "Test Category 1",
      );
      assert.deepStrictEqual(
        (data[1] as ProductOutput).productCategory,
        "Test Category 2",
      );
      assert.deepStrictEqual(
        (data[0] as ProductOutput).productBrand,
        "Test Brand 1",
      );
      assert.deepStrictEqual(
        (data[1] as ProductOutput).productBrand,
        "Test Brand 2",
      );
      assert.deepStrictEqual((data[0] as ProductOutput).productId, 1);
      assert.deepStrictEqual((data[1] as ProductOutput).productId, 2);
    });
    it("should return 200 OK as JSON response and a single product on GET /product/:id", async () => {
      const response = await fetch("http://localhost:3000/product/1");
      const data = (await response.json()) as ProductOutput;
      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(data.productName, "Test Product");
      assert.deepStrictEqual(data.productCategory, "Test Category");
      assert.deepStrictEqual(data.productBrand, "Test Brand");
      assert.deepStrictEqual(data.productId, 1);
    });
    it("should return 201 CREATED and productId as JSON response on POST /product/create", async () => {
      const response = await fetch("http://localhost:3000/product/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: "Updated Product",
          productCategory: "Updated Category",
          productBrand: "Updated Brand",
        }),
      });
      const data = (await response.json()) as {
        message: string;
        productId: number;
      };
      assert.deepStrictEqual(response.status, 201);
      assert.deepStrictEqual(data.message, "Product created successfully");
      assert.deepStrictEqual(data.productId, 1);
    });
    it("should return 204 NO CONTENT as JSON response on PUT /product/:id/update", async () => {
      const response = await fetch("http://localhost:3000/product/1/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: "Updated Product",
          productCategory: "Updated Category",
          productBrand: "Updated Brand",
        }),
      });
      assert.deepStrictEqual(response.status, 204);
    });
    it("should return 204 NO CONTENT as JSON response on DELETE /product/:id/delete", async () => {
      const response = await fetch("http://localhost:3000/product/1/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      assert.deepStrictEqual(response.status, 204);
    });
  });
};
