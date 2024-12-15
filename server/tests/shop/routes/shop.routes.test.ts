import { after, afterEach, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { Shop } from "@dataTypes/shop.types.js";
import { shopHandlers } from "./shopHandlers.js";
import { setupServer } from "msw/node";

export const testShopRoutes = () => {
  describe("Shop functional test", () => {
    const server = setupServer(...shopHandlers);
    before(() => {
      server.listen({
        onUnhandledRequest: "error",
      });
    });
    afterEach(() => server.resetHandlers());
    after(() => server.close());

    it("should return 200 OK as JSON response and list of shops on GET /shops", async () => {
      const response = await fetch("http://localhost:3000/shops");
      const data = (await response.json()) as Shop[];
      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(data.length, 2);
      assert.deepStrictEqual((data[0] as Shop).shopName, "Test Shop 1");
      assert.deepStrictEqual((data[1] as Shop).shopName, "Test Shop 2");
      assert.deepStrictEqual((data[0] as Shop).shopLocation, "Test Location 1");
      assert.deepStrictEqual((data[1] as Shop).shopLocation, "Test Location 2");
      assert.deepStrictEqual((data[0] as Shop).shopId, 1);
      assert.deepStrictEqual((data[1] as Shop).shopId, 2);
    });
    it("should return 200 OK as JSON response and single shop on GET /shop/:id", async () => {
      const response = await fetch("http://localhost:3000/shop/1");
      const data = (await response.json()) as Shop;
      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(data.shopName, "Test Shop");
      assert.deepStrictEqual(data.shopLocation, "Test Location");
      assert.deepStrictEqual(data.shopId, 1);
    });
    it("should return 201 CREATED and shopId as JSON response on POST /shop/create", async () => {
      const response = await fetch("http://localhost:3000/shop/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopName: "Test Shop",
          shopLocation: "Test Location",
        }),
      });
      const data = (await response.json()) as {
        message: string;
        shopId: number;
      };
      assert.deepStrictEqual(response.status, 201);
      assert.deepStrictEqual(data.message, "Shop created successfully");
      assert.deepStrictEqual(data.shopId, 1);
    });
    it("should return 204 No Content as JSON response on PUT /shop/:id/update", async () => {
      const response = await fetch("http://localhost:3000/shop/1/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopName: "Updated Shop",
          shopLocation: "Updated Location",
        }),
      });
      assert.deepStrictEqual(response.status, 204);
    });
    it("should return 204 No Content as JSON response on DELETE /shop/:id/delete", async () => {
      const response = await fetch("http://localhost:3000/shop/1/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      assert.deepStrictEqual(response.status, 204);
    });
  });
};
