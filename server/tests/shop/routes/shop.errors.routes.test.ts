import { setupServer } from "msw/node";
import assert from "node:assert/strict";
import { after, afterEach, before, describe, it } from "node:test";
import { shopErrorHandlers } from "./shopErrorHandlers.js";

export const testShopErrorRoutes = () => {
  describe("Shop error functional test", () => {
    const server = setupServer(...shopErrorHandlers);
    before(() => {
      server.listen({
        onUnhandledRequest: "error",
      });
    });
    afterEach(() => server.resetHandlers());
    after(() => server.close());

    it("should throw a validation error due to negative ID on GET /shop/:id", async () => {
      const response = await fetch("http://localhost:3000/shop/-1");
      const data = (await response.json()) as { error: string[] };
      assert.deepStrictEqual(response.status, 400);
      const keyOfJsonRes = Object.keys(data);
      assert.ok(keyOfJsonRes.includes("error"));
      const { error } = data;
      assert.deepStrictEqual(error.length, 1);
      assert.ok(Array.isArray(error));
    });
    it("should throw a validation error due to missing shopLocation on POST /shop/create", async () => {
      const response = await fetch("http://localhost:3000/shop/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopName: "Test Shop",
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
    it("should throw a validation error due to negative ID and missing shopLocation on PUT /shop/:id/update", async () => {
      const response = await fetch("http://localhost:3000/shop/-1/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopName: "Test Shop",
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
    it("should throw a validation error due to negative ID on DELETE /shop/:id", async () => {
      const response = await fetch("http://localhost:3000/shop/-1/delete", {
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
