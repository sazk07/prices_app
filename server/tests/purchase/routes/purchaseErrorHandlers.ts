import { http, HttpResponse } from "msw";

export const purchaseErrorHandlers = [
  // Mock GET /purchase/:id response
  http.get("http://localhost:3000/purchase/-1", async () => {
    return HttpResponse.json(
      {
        error: ["ID must be a non-negative number"],
      },
      {
        status: 400,
      },
    );
  }),
  // Mock POST /purchase/create response
  http.post("http://localhost:3000/purchase/create", async () => {
    return HttpResponse.json(
      {
        error: ["Purchase Date is required"],
      },
      {
        status: 400,
      },
    );
  }),
  // Mock PUT /purchase/:id/update response
  http.put("http://localhost:3000/purchase/-1/update", async () => {
    return HttpResponse.json(
      {
        error: [
          "ID must be a non-negative number",
          "Purchase Date is required",
        ],
      },
      {
        status: 400,
      },
    );
  }),
  // Mock DELETE /purchase/:id/delete response
  http.delete("http://localhost:3000/purchase/-1/delete", async () => {
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
