import { testFindById } from "./purchase.findById.model.test.js";
import { testCreate } from "./purchase.create.model.test.js";
import { testFindAll } from "./purchase.findAll.model.test.js";
import { testUpdate } from "./purchase.update.model.test.js";
import { testDelete } from "./purchase.delete.model.test.js";

testCreate();
testFindAll();
testFindById();
testUpdate();
testDelete();
