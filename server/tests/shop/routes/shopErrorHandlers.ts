import { http, HttpResponse } from "msw";

export const shopErrorHandlers = [
  // Mock GET /shop/:id response
  http.get("http://localhost:3000/shop/-1", async () => {
    return HttpResponse.json(
      {
        error: ["ID must be a non-negative number"],
      },
      {
        status: 400,
      },
    );
  }),
  // Mock POST /shop/create response
  http.post("http://localhost:3000/shop/create", async () => {
    return HttpResponse.json(
      {
        error: ["Shop Location is required"],
      },
      {
        status: 400,
      },
    );
  }),
  // Mock PUT /shop/:id/update response
  http.put("http://localhost:3000/shop/-1/update", async () => {
    return HttpResponse.json(
      {
        error: [
          "ID must be a non-negative number",
          "Shop Location is required",
        ],
      },
      {
        status: 400,
      },
    );
  }),
  // Mock DELETE /shop/:id/delete response
  http.delete("http://localhost:3000/shop/-1/delete", async () => {
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
