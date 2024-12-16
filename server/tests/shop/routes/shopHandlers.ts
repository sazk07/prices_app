import { http, HttpResponse } from "msw";

export const shopHandlers = [
  // Mock GET /shops response
  http.get("http://localhost:3000/shops", async () => {
    return HttpResponse.json(
      [
        {
          shopId: 1,
          shopName: "Test Shop 1",
          shopLocation: "Test Location 1",
        },
        {
          shopId: 2,
          shopName: "Test Shop 2",
          shopLocation: "Test Location 2",
        },
      ],
      {
        status: 200,
      },
    );
  }),
  // Mock GET /shop/:id response
  http.get("http://localhost:3000/shop/1", async () => {
    return HttpResponse.json(
      {
        shopId: 1,
        shopName: "Test Shop",
        shopLocation: "Test Location",
      },
      {
        status: 200,
      },
    );
  }),
  // Mock POST /shop/create response
  http.post("http://localhost:3000/shop/create", async () => {
    return HttpResponse.json(
      {
        message: "Shop created successfully",
        shopId: 1,
      },
      {
        status: 201,
      },
    );
  }),
  // Mock PUT /shop/:id/update response
  http.put("http://localhost:3000/shop/1/update", async () => {
    return new HttpResponse(null, {
      status: 204,
    });
  }),
  // Mock DELETE /shop/:id/delete response
  http.delete("http://localhost:3000/shop/1/delete", async () => {
    return new HttpResponse(null, {
      status: 204,
    });
  }),
];
