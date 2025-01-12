import express from "express";
import shopRouter from "./shop/routes/shop.routes.js";
import productRouter from "./product/routes/product.routes.js";
import purchaseRouter from "./purchase/routes/purchase.routes.js";
import notFoundRouter from "./utils/notFound.routes.js";
import { logError, errorHandler } from "./utils/errorHandler.js";
import connectToDatabase from "@configs/database.js";
import homePageRouter from "./home/routes/home.routes.js";
import cors from "cors";
import { corsOptions } from "@utils/corsOptions.js";

const app = express();

await connectToDatabase();
console.log("Connected to the SQLite database.");
// express.json() and express.urlencoded() needed to populate req.body with the form fields
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cors(corsOptions));

app.use(homePageRouter);
app.use(shopRouter);
app.use(productRouter);
app.use(purchaseRouter);
app.use(notFoundRouter);

// error handler
app.use(logError);
app.use(errorHandler);

export default app;
