import { http } from "msw";

export const notFoundHandler = [
  // Mock GET 404 Not found response
  http.get("http://localhost:3000/not-found", async () => {
    return new Response(JSON.stringify({ error: "404 Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }),
];
