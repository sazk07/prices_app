import { testCreatePurchase } from "./purchase.create.controller.test.js";
import { testDeletePurchase } from "./purchase.delete.controller.test.js";
import { testGetAllPurchases } from "./purchase.getAll.controller.test.js";
import { testGetPurchaseById } from "./purchase.getById.controller.test.js";
import { testUpdatePurchase } from "./purchase.update.controller.test.js";

testCreatePurchase();
testGetAllPurchases();
testGetPurchaseById();
testUpdatePurchase();
testDeletePurchase();
