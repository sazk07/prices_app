import { setupServer } from "msw/node";
import assert from "node:assert/strict";
import { after, afterEach, before, describe, it } from "node:test";
import {
  purchaseHandlersWithMrpTaxAmount,
  purchaseHandlersWithTaxAmount,
  purchaseHandlersWithTaxRate,
} from "./purchaseHandlers.js";
import { PurchaseOutput } from "@dataTypes/purchase.types.js";

export const testPurchaseRoutes = () => {
  describe("Purchase functional test with Tax Rates", () => {
    const server = setupServer(...purchaseHandlersWithTaxRate);
    before(() => {
      server.listen({
        onUnhandledRequest: "error",
      });
    });
    afterEach(() => server.resetHandlers());
    after(() => server.close());

    it("should return 200 OK as JSON response and list of purchases on GET /purchases", async () => {
      const response = await fetch("http://localhost:3000/purchases");
      const data = (await response.json()) as PurchaseOutput[];
      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(data.length, 2);
      assert.deepStrictEqual((data[0] as PurchaseOutput).purchaseId, 1);
      assert.deepStrictEqual((data[1] as PurchaseOutput).purchaseId, 2);
      assert.deepStrictEqual((data[0] as PurchaseOutput).shopId, 1);
      assert.deepStrictEqual((data[1] as PurchaseOutput).shopId, 1);
      assert.deepStrictEqual((data[0] as PurchaseOutput).productId, 1);
      assert.deepStrictEqual((data[1] as PurchaseOutput).productId, 1);
      assert.deepStrictEqual(
        (data[0] as PurchaseOutput).purchaseDate,
        "2023-01-01",
      );
      assert.deepStrictEqual(
        (data[1] as PurchaseOutput).purchaseDate,
        "2023-02-01",
      );
      assert.deepStrictEqual((data[0] as PurchaseOutput).quantity, 2);
      assert.deepStrictEqual((data[1] as PurchaseOutput).quantity, 3);
      assert.deepStrictEqual((data[0] as PurchaseOutput).price, 10.99);
      assert.deepStrictEqual((data[1] as PurchaseOutput).price, 15.99);
      assert.deepStrictEqual((data[0] as PurchaseOutput).taxRate, 17);
      assert.deepStrictEqual((data[1] as PurchaseOutput).taxRate, 17);
    });
    it("should return 200 OK as JSON response and single purchase on GET /purchase/:id", async () => {
      const response = await fetch("http://localhost:3000/purchase/1");
      const data = (await response.json()) as PurchaseOutput;
      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(data.purchaseId, 1);
      assert.deepStrictEqual(data.shopId, 1);
      assert.deepStrictEqual(data.productId, 1);
      assert.deepStrictEqual(data.purchaseDate, "2023-01-01");
      assert.deepStrictEqual(data.quantity, 2);
      assert.deepStrictEqual(data.price, 10.99);
      assert.deepStrictEqual(data.taxRate, 17);
    });
    it("should return 201 CREATED as JSON response and message on POST /purchase/create", async () => {
      const response = await fetch("http://localhost:3000/purchase/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId: 1,
          productId: 1,
          purchaseDate: "2023-01-01",
          quantity: 2,
          price: 10.99,
          taxRate: 17,
        }),
      });
      const data = (await response.json()) as {
        message: string;
        purchaseId: number;
      };
      assert.deepStrictEqual(response.status, 201);
      assert.deepStrictEqual(data.message, "Purchase created successfully");
      assert.deepStrictEqual(data.purchaseId, 1);
    });
    it("should return 204 NO CONTENT as JSON response on PUT /purchase/:id/update", async () => {
      const response = await fetch("http://localhost:3000/purchase/1/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId: 1,
          productId: 1,
          purchaseDate: "2023-01-01",
          quantity: 21,
          price: 103.99,
          taxRate: 17,
        }),
      });
      assert.deepStrictEqual(response.status, 204);
    });
    it("should return 204 NO CONTENT as JSON response on DELETE /purchase/:id/delete", async () => {
      const response = await fetch("http://localhost:3000/purchase/1/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      assert.deepStrictEqual(response.status, 204);
    });
  });
  describe("Purchase functional test with Tax Amounts", () => {
    const server = setupServer(...purchaseHandlersWithTaxAmount);
    before(() => {
      server.listen({
        onUnhandledRequest: "error",
      });
    });
    afterEach(() => server.resetHandlers());
    after(() => server.close());

    it("should return 200 OK as JSON response and list of purchases on GET /purchases", async () => {
      const response = await fetch("http://localhost:3000/purchases");
      const data = (await response.json()) as PurchaseOutput[];
      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(data.length, 2);
      assert.deepStrictEqual((data[0] as PurchaseOutput).purchaseId, 1);
      assert.deepStrictEqual((data[1] as PurchaseOutput).purchaseId, 2);
      assert.deepStrictEqual((data[0] as PurchaseOutput).shopId, 1);
      assert.deepStrictEqual((data[1] as PurchaseOutput).shopId, 1);
      assert.deepStrictEqual((data[0] as PurchaseOutput).productId, 1);
      assert.deepStrictEqual((data[1] as PurchaseOutput).productId, 1);
      assert.deepStrictEqual(
        (data[0] as PurchaseOutput).purchaseDate,
        "2023-01-01",
      );
      assert.deepStrictEqual(
        (data[1] as PurchaseOutput).purchaseDate,
        "2023-02-01",
      );
      assert.deepStrictEqual((data[0] as PurchaseOutput).quantity, 2);
      assert.deepStrictEqual((data[1] as PurchaseOutput).quantity, 3);
      assert.deepStrictEqual((data[0] as PurchaseOutput).price, 10.99);
      assert.deepStrictEqual((data[1] as PurchaseOutput).price, 15.99);
      assert.deepStrictEqual(data[0]?.taxAmount, 4);
      assert.deepStrictEqual(data[1]?.taxAmount, 7);
    });
    it("should return 200 OK as JSON response and single purchase on GET /purchase/:id", async () => {
      const response = await fetch("http://localhost:3000/purchase/1");
      const data = (await response.json()) as PurchaseOutput;
      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(data.purchaseId, 1);
      assert.deepStrictEqual(data.shopId, 1);
      assert.deepStrictEqual(data.productId, 1);
      assert.deepStrictEqual(data.purchaseDate, "2023-01-01");
      assert.deepStrictEqual(data.quantity, 2);
      assert.deepStrictEqual(data.price, 10.99);
      assert.deepStrictEqual(data.taxAmount, 6);
    });
    it("should return 201 CREATED as JSON response and message on POST /purchase/create", async () => {
      const response = await fetch("http://localhost:3000/purchase/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId: 1,
          productId: 1,
          purchaseDate: "2023-01-01",
          quantity: 2,
          price: 10.99,
          taxAmount: 6,
        }),
      });
      const data = (await response.json()) as {
        message: string;
        purchaseId: number;
      };
      assert.deepStrictEqual(response.status, 201);
      assert.deepStrictEqual(data.message, "Purchase created successfully");
      assert.deepStrictEqual(data.purchaseId, 1);
    });
    it("should return 204 NO CONTENT as JSON response on PUT /purchase/:id/update", async () => {
      const response = await fetch("http://localhost:3000/purchase/1/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId: 1,
          productId: 1,
          purchaseDate: "2023-01-01",
          quantity: 21,
          price: 103.99,
          taxAmount: 60,
        }),
      });
      assert.deepStrictEqual(response.status, 204);
    });
    it("should return 204 NO CONTENT as JSON response on DELETE /purchase/:id/delete", async () => {
      const response = await fetch("http://localhost:3000/purchase/1/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      assert.deepStrictEqual(response.status, 204);
    });
  });
  describe("Purchase functional test with MRP and Non-MRP tax amounts", () => {
    const server = setupServer(...purchaseHandlersWithMrpTaxAmount);
    before(() => {
      server.listen({
        onUnhandledRequest: "error",
      });
    });
    afterEach(() => server.resetHandlers());
    after(() => server.close());

    it("should return 200 OK as JSON response and list of purchases on GET /purchases", async () => {
      const response = await fetch("http://localhost:3000/purchases");
      const data = (await response.json()) as PurchaseOutput[];
      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(data.length, 2);
      assert.deepStrictEqual((data[0] as PurchaseOutput).purchaseId, 1);
      assert.deepStrictEqual((data[1] as PurchaseOutput).purchaseId, 2);
      assert.deepStrictEqual((data[0] as PurchaseOutput).shopId, 1);
      assert.deepStrictEqual((data[1] as PurchaseOutput).shopId, 1);
      assert.deepStrictEqual((data[0] as PurchaseOutput).productId, 1);
      assert.deepStrictEqual((data[1] as PurchaseOutput).productId, 1);
      assert.deepStrictEqual(
        (data[0] as PurchaseOutput).purchaseDate,
        "2023-01-01",
      );
      assert.deepStrictEqual(
        (data[1] as PurchaseOutput).purchaseDate,
        "2023-02-01",
      );
      assert.deepStrictEqual((data[0] as PurchaseOutput).quantity, 2);
      assert.deepStrictEqual((data[1] as PurchaseOutput).quantity, 3);
      assert.deepStrictEqual((data[0] as PurchaseOutput).price, 10.99);
      assert.deepStrictEqual((data[1] as PurchaseOutput).price, 15.99);
      assert.deepStrictEqual(data[0]?.mrpTaxAmount, 3);
      assert.deepStrictEqual(data[1]?.mrpTaxAmount, 6.5);
      assert.deepStrictEqual(data[0].nonMrpTaxAmount, 1.5);
      assert.deepStrictEqual(data[1].nonMrpTaxAmount, 3.6);
    });
    it("should return 200 OK as JSON response and single purchase on GET /purchase/:id", async () => {
      const response = await fetch("http://localhost:3000/purchase/1");
      const data = (await response.json()) as PurchaseOutput;
      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(data.purchaseId, 1);
      assert.deepStrictEqual(data.shopId, 1);
      assert.deepStrictEqual(data.productId, 1);
      assert.deepStrictEqual(data.purchaseDate, "2023-01-01");
      assert.deepStrictEqual(data.quantity, 2);
      assert.deepStrictEqual(data.price, 10.99);
      assert.deepStrictEqual(data.mrpTaxAmount, 3.4);
      assert.deepStrictEqual(data.nonMrpTaxAmount, 1.7);
    });
    it("should return 201 CREATED as JSON response and message on POST /purchase/create", async () => {
      const response = await fetch("http://localhost:3000/purchase/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId: 1,
          productId: 1,
          purchaseDate: "2023-01-01",
          quantity: 2,
          price: 10.99,
          mrpTaxAmount: 4.1,
          nonMrpTaxAmount: 2.7,
        }),
      });
      const data = (await response.json()) as {
        message: string;
        purchaseId: number;
      };
      assert.deepStrictEqual(response.status, 201);
      assert.deepStrictEqual(data.message, "Purchase created successfully");
      assert.deepStrictEqual(data.purchaseId, 1);
    });
    it("should return 204 NO CONTENT as JSON response on PUT /purchase/:id/update", async () => {
      const response = await fetch("http://localhost:3000/purchase/1/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId: 1,
          productId: 1,
          purchaseDate: "2023-01-01",
          quantity: 21,
          price: 103.99,
          mrpTaxAmount: 62.8,
          nonMrpTaxAmount: 12.6
        }),
      });
      assert.deepStrictEqual(response.status, 204);
    });
    it("should return 204 NO CONTENT as JSON response on DELETE /purchase/:id/delete", async () => {
      const response = await fetch("http://localhost:3000/purchase/1/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      assert.deepStrictEqual(response.status, 204);
    });
  });
};
