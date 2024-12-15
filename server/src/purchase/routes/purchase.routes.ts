import { Router } from "express";

const purchaseRouter = Router();

purchaseRouter.get("/purchase", async (_req, res, next) => {
  try {
    const message = await Promise.resolve("Hello from purchase");
    res.send(message);
  } catch (err) {
    next(err);
  }
});

export default purchaseRouter;
