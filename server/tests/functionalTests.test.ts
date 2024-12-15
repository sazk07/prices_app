import { testShopErrorRoutes } from "./shop/routes/shop.errors.routes.test.js";
import { testShopRoutes } from "./shop/routes/shop.routes.test.js";
import { testNotFoundRoutes } from "./utils/notFound.routes.test.js";

testShopRoutes();
testShopErrorRoutes();
testNotFoundRoutes();
