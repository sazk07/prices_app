import assert from "node:assert/strict";
import { setupServer } from "msw/node";
import { after, afterEach, before, describe, it } from "node:test";
import { productErrorHandlers } from "./productErrorHandlers.js";

export const testProductErrorRoutes = () => {
  describe("Product error functional test", () => {
    const server = setupServer(...productErrorHandlers);
    before(() => {
      server.listen({
        onUnhandledRequest: "error",
      });
    });
    afterEach(() => server.resetHandlers());
    after(() => server.close());

    it("should throw a validation error due to negative ID on GET /product/:id", async () => {
      const response = await fetch("http://localhost:3000/product/-1");
      const data = (await response.json()) as { error: string[] };
      assert.deepStrictEqual(response.status, 400);
      const keyOfJsonRes = Object.keys(data);
      assert.ok(keyOfJsonRes.includes("error"));
      const { error } = data;
      assert.deepStrictEqual(error.length, 1);
      assert.ok(Array.isArray(error));
    });
    it("should throw a validation error due to missing productBrand on POST /product/create", async () => {
      const response = await fetch("http://localhost:3000/product/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: "Test Product",
          productCategory: "Test Category",
        }),
      });
      const data = (await response.json()) as { error: string[] };
      assert.deepStrictEqual(response.status, 400);
      const keyOfJsonRes = Object.keys(data);
      assert.ok(keyOfJsonRes.includes("error"));
      const { error } = data;
      assert.deepStrictEqual(error.length, 1);
      assert.ok(Array.isArray(error));
    });
    it("should throw a validation error due to negative ID and missing productBrand on PUT /product/:id/update", async () => {
      const response = await fetch("http://localhost:3000/product/-1/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: "Test Product",
          productCategory: "Test Category",
        }),
      });
      const data = (await response.json()) as { error: string[] };
      assert.deepStrictEqual(response.status, 400);
      const keyOfJsonRes = Object.keys(data);
      assert.ok(keyOfJsonRes.includes("error"));
      const { error } = data;
      assert.deepStrictEqual(error.length, 2);
      assert.ok(Array.isArray(error));
    });
    it("should throw a validation error due to negative ID on DELETE /product/:id/delete", async () => {
      const response = await fetch("http://localhost:3000/product/-1/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = (await response.json()) as { error: string[] };
      assert.deepStrictEqual(response.status, 400);
      const keyOfJsonRes = Object.keys(data);
      assert.ok(keyOfJsonRes.includes("error"));
      const { error } = data;
      assert.deepStrictEqual(error.length, 1);
      assert.ok(Array.isArray(error));
    });
  });
};
