import { http, HttpResponse } from "msw";

export const productErrorHandlers = [
  // Mock GET /product/:id response
  http.get("http://localhost:3000/product/-1", async () => {
    return HttpResponse.json(
      {
        error: ["ID must be a non-negative number"],
      },
      {
        status: 400,
      },
    );
  }),
  // Mock POST /product/create response
  http.post("http://localhost:3000/product/create", async () => {
    return HttpResponse.json(
      {
        error: ["Product Brand is required"],
      },
      {
        status: 400,
      },
    );
  }),
  // Mock PUT /product/:id/update response
  http.put("http://localhost:3000/product/-1/update", async () => {
    return HttpResponse.json(
      {
        error: [
          "ID must be a non-negative number",
          "Product Brand is required",
        ],
      },
      {
        status: 400,
      },
    );
  }),
  // Mock DELETE /product/:id/delete response
  http.delete("http://localhost:3000/product/-1/delete", async () => {
    return HttpResponse.json(
      {
        error: ["ID must be a non-negative number"],
      },
      {
        status: 400,
      },
    );
  }),
];
