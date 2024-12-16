import { setupServer } from "msw/node";
import assert from "node:assert/strict";
import { after, afterEach, before, describe, it } from "node:test";
import { purchaseErrorHandlers } from "./purchaseErrorHandlers.js";

export const testPurchaseErrorRoutes = () => {
  describe("Purchase error functional test", () => {
    const server = setupServer(...purchaseErrorHandlers);
    before(() => {
      server.listen({
        onUnhandledRequest: "error",
      });
    });
    afterEach(() => server.resetHandlers());
    after(() => server.close());

    it("should throw a validation error due to negative ID on GET /purchase/:id", async () => {
      const response = await fetch("http://localhost:3000/purchase/-1");
      const data = (await response.json()) as { error: string[] };
      assert.deepStrictEqual(response.status, 400);
      const keyOfJsonRes = Object.keys(data);
      assert.ok(keyOfJsonRes.includes("error"));
      const { error } = data;
      assert.deepStrictEqual(error.length, 1);
      assert.ok(Array.isArray(error));
    });
    it("should throw a validation error due to missing purchaseDate on POST /purchase/create", async () => {
      const response = await fetch("http://localhost:3000/purchase/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId: 1,
          productId: 1,
          quantity: 2,
          price: 10.99,
          taxRate: 18,
          taxAmount: 0,
          mrpTaxAmount: 0,
          nonMrpTaxAmount: 0,
        }),
      });
      const data = (await response.json()) as { error: string[] };
      assert.deepStrictEqual(response.status, 400);
      const keyOfJsonRes = Object.keys(data);
      assert.ok(keyOfJsonRes.includes("error"));
      const { error } = data;
      assert.deepStrictEqual(error.length, 1);
      assert.ok(Array.isArray(error));
      assert.deepStrictEqual(error[0], "Purchase Date is required");
    });
    it("should throw a validation error due to negative ID and missing purchaseDate on PUT /purchase/:id/update", async () => {
      const response = await fetch("http://localhost:3000/purchase/-1/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId: 1,
          productId: 1,
          quantity: 29,
          price: 10.99,
          taxRate: 17,
          taxAmount: 0,
          mrpTaxAmount: 0,
          nonMrpTaxAmount: 0,
        }),
      });
      const data = (await response.json()) as { error: string[] };
      assert.deepStrictEqual(response.status, 400);
      const keyOfJsonRes = Object.keys(data);
      assert.ok(keyOfJsonRes.includes("error"));
      const { error } = data;
      assert.deepStrictEqual(error.length, 2);
      assert.ok(Array.isArray(error));
      assert.deepStrictEqual(error[0], "ID must be a non-negative number");
      assert.deepStrictEqual(error[1], "Purchase Date is required");
    });
    it("should throw a validation error due to negative ID on DELETE /purchase/:id", async () => {
      const response = await fetch("http://localhost:3000/purchase/-1/delete", {
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
