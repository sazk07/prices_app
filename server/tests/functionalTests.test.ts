import { testProductErrorRoutes } from "./product/routes/product.errors.routes.test.js";
import { testProductRoutes } from "./product/routes/product.routes.test.js";
import { testPurchaseErrorRoutes } from "./purchase/routes/purchase.errors.routes.test.js";
import { testPurchaseRoutes } from "./purchase/routes/purchase.routes.test.js";
import { testShopErrorRoutes } from "./shop/routes/shop.errors.routes.test.js";
import { testShopRoutes } from "./shop/routes/shop.routes.test.js";
import { testNotFoundRoutes } from "./utils/notFound.routes.test.js";

testShopRoutes();
testShopErrorRoutes();
testProductRoutes();
testProductErrorRoutes();
testPurchaseRoutes();
testPurchaseErrorRoutes();
testNotFoundRoutes();
