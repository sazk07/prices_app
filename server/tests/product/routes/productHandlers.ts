import { http, HttpResponse } from "msw";

export const productHandlers = [
  // Mock GET /products response
  http.get("http://localhost:3000/products", async () => {
    return HttpResponse.json(
      [
        {
          productId: 1,
          productName: "Test Product 1",
          productCategory: "Test Category 1",
          productBrand: "Test Brand 1",
        },
        {
          productId: 2,
          productName: "Test Product 2",
          productCategory: "Test Category 2",
          productBrand: "Test Brand 2",
        },
      ],
      {
        status: 200,
      },
    );
  }),
  // Mock GET /product/:id response
  http.get("http://localhost:3000/product/1", async () => {
    return HttpResponse.json(
      {
        productId: 1,
        productName: "Test Product",
        productCategory: "Test Category",
        productBrand: "Test Brand",
      },
      {
        status: 200,
      },
    );
  }),
  // Mock POST /product/create response
  http.post("http://localhost:3000/product/create", async () => {
    return HttpResponse.json(
      {
        message: "Product created successfully",
        productId: 1,
      },
      {
        status: 201,
      },
    );
  }),
  // Mock PUT /product/:id/update response
  http.put("http://localhost:3000/product/1/update", async () => {
    return new HttpResponse(null, {
      status: 204,
    });
  }),
  // Mock DELETE /product/:id response
  http.delete("http://localhost:3000/product/1/delete", async () => {
    return new HttpResponse(null, {
      status: 204,
    });
  }),
];
