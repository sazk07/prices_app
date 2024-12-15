import { HttpError } from "./http-errors-enhanced/base.js";
import { after, afterEach, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { notFoundHandler } from "./notFoundHandlers.js";
import { setupServer } from "msw/node";

export const testNotFoundRoutes = () => {
  describe("404 Not Found functional test", () => {
    const server = setupServer(...notFoundHandler);
    before(() => {
      server.listen({
        onUnhandledRequest: "error",
      });
    });
    afterEach(() => server.resetHandlers());
    after(() => server.close());

    it("should return 404 Not Found as JSON response", async () => {
      const response = await fetch("http://localhost:3000/not-found");
      const data = (await response.json()) as HttpError;
      assert.strictEqual(response.status, 404);
      assert.strictEqual(data.error, "404 Not Found");
    });
  });
};
