import { http, HttpResponse } from "msw";

export const purchaseHandlersWithTaxRate = [
  // Mock GET /purchases response
  http.get("http://localhost:3000/purchases", async () => {
    return HttpResponse.json(
      [
        {
          purchaseId: 1,
          shopId: 1,
          productId: 1,
          purchaseDate: "2023-01-01",
          quantity: 2,
          price: 10.99,
          taxRate: 17,
          taxAmount: 0,
          mrpTaxAmount: 0,
          nonMrpTaxAmount: 0,
        },
        {
          purchaseId: 2,
          shopId: 1,
          productId: 1,
          purchaseDate: "2023-02-01",
          quantity: 3,
          price: 15.99,
          taxRate: 17,
          taxAmount: 0,
          mrpTaxAmount: 0,
          nonMrpTaxAmount: 0,
        },
      ],
      {
        status: 200,
      },
    );
  }),
  // Mock GET /purchase/:id response
  http.get("http://localhost:3000/purchase/1", async () => {
    return HttpResponse.json(
      {
        purchaseId: 1,
        shopId: 1,
        productId: 1,
        purchaseDate: "2023-01-01",
        quantity: 2,
        price: 10.99,
        taxRate: 17,
        taxAmount: 0,
        mrpTaxAmount: 0,
        nonMrpTaxAmount: 0,
      },
      {
        status: 200,
      },
    );
  }),
  // Mock POST /purchase/create response
  http.post("http://localhost:3000/purchase/create", async () => {
    return HttpResponse.json(
      {
        message: "Purchase created successfully",
        purchaseId: 1,
      },
      {
        status: 201,
      },
    );
  }),
  // Mock PUT /purchase/:id/update response
  http.put("http://localhost:3000/purchase/1/update", async () => {
    return new HttpResponse(null, {
      status: 204,
    });
  }),
  // Mock DELETE /purchase/:id/delete response
  http.delete("http://localhost:3000/purchase/1/delete", async () => {
    return new HttpResponse(null, {
      status: 204,
    });
  }),
];

export const purchaseHandlersWithTaxAmount = [
  // Mock GET /purchases response
  http.get("http://localhost:3000/purchases", async () => {
    return HttpResponse.json(
      [
        {
          purchaseId: 1,
          shopId: 1,
          productId: 1,
          purchaseDate: "2023-01-01",
          quantity: 2,
          price: 10.99,
          taxRate: 0,
          taxAmount: 4,
          mrpTaxAmount: 0,
          nonMrpTaxAmount: 0,
        },
        {
          purchaseId: 2,
          shopId: 1,
          productId: 1,
          purchaseDate: "2023-02-01",
          quantity: 3,
          price: 15.99,
          taxRate: 0,
          taxAmount: 7,
          mrpTaxAmount: 0,
          nonMrpTaxAmount: 0,
        },
      ],
      {
        status: 200,
      },
    );
  }),
  // Mock GET /purchase/:id response
  http.get("http://localhost:3000/purchase/1", async () => {
    return HttpResponse.json(
      {
        purchaseId: 1,
        shopId: 1,
        productId: 1,
        purchaseDate: "2023-01-01",
        quantity: 2,
        price: 10.99,
        taxRate: 0,
        taxAmount: 6,
        mrpTaxAmount: 0,
        nonMrpTaxAmount: 0,
      },
      {
        status: 200,
      },
    );
  }),
  // Mock POST /purchase/create response
  http.post("http://localhost:3000/purchase/create", async () => {
    return HttpResponse.json(
      {
        message: "Purchase created successfully",
        purchaseId: 1,
      },
      {
        status: 201,
      },
    );
  }),
  // Mock PUT /purchase/:id/update response
  http.put("http://localhost:3000/purchase/1/update", async () => {
    return new HttpResponse(null, {
      status: 204,
    });
  }),
  // Mock DELETE /purchase/:id/delete response
  http.delete("http://localhost:3000/purchase/1/delete", async () => {
    return new HttpResponse(null, {
      status: 204,
    });
  }),
];

export const purchaseHandlersWithMrpTaxAmount = [
  // Mock GET /purchases response
  http.get("http://localhost:3000/purchases", async () => {
    return HttpResponse.json(
      [
        {
          purchaseId: 1,
          shopId: 1,
          productId: 1,
          purchaseDate: "2023-01-01",
          quantity: 2,
          price: 10.99,
          taxRate: 0,
          taxAmount: 0,
          mrpTaxAmount: 3,
          nonMrpTaxAmount: 1.5,
        },
        {
          purchaseId: 2,
          shopId: 1,
          productId: 1,
          purchaseDate: "2023-02-01",
          quantity: 3,
          price: 15.99,
          taxRate: 0,
          taxAmount: 0,
          mrpTaxAmount: 6.5,
          nonMrpTaxAmount: 3.6,
        },
      ],
      {
        status: 200,
      },
    );
  }),
  // Mock GET /purchase/:id response
  http.get("http://localhost:3000/purchase/1", async () => {
    return HttpResponse.json(
      {
        purchaseId: 1,
        shopId: 1,
        productId: 1,
        purchaseDate: "2023-01-01",
        quantity: 2,
        price: 10.99,
        taxRate: 0,
        taxAmount: 0,
        mrpTaxAmount: 3.4,
        nonMrpTaxAmount: 1.7,
      },
      {
        status: 200,
      },
    );
  }),
  // Mock POST /purchase/create response
  http.post("http://localhost:3000/purchase/create", async () => {
    return HttpResponse.json(
      {
        message: "Purchase created successfully",
        purchaseId: 1,
      },
      {
        status: 201,
      },
    );
  }),
  // Mock PUT /purchase/:id/update response
  http.put("http://localhost:3000/purchase/1/update", async () => {
    return new HttpResponse(null, {
      status: 204,
    });
  }),
  // Mock DELETE /purchase/:id/delete response
  http.delete("http://localhost:3000/purchase/1/delete", async () => {
    return new HttpResponse(null, {
      status: 204,
    });
  }),
]
