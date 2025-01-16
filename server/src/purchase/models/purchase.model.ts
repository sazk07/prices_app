import connectToDatabase from "@configs/database.js";
import { ModelError } from "@utils/model.error.js";

export const PurchaseModel = async () => {
  try {
    const db = await connectToDatabase();
    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS Purchase (
        purchaseId INTEGER PRIMARY KEY AUTOINCREMENT,
        shopId INTEGER NOT NULL,
        productId INTEGER NOT NULL,
        purchaseDate TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        taxRate REAL,
        taxAmount REAL,
        mrpTaxAmount REAL,
        nonMrpTaxAmount REAL,
        createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        editedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (shopId) REFERENCES Shop (shopId),
        FOREIGN KEY (productId) REFERENCES Product (productId));
    `,
    ).run();
    db.prepare(
      `
      CREATE INDEX IF NOT EXISTS idxPurchaseShopId ON Purchase(shopId);
      CREATE INDEX IF NOT EXISTS idxPurchaseProductId ON Purchase(productId);
      CREATE INDEX IF NOT EXISTS IDXPURCHASEDATE ON PURCHASE(purchaseDate);
    `,
    );
    return db;
  } catch (err) {
    console.error("Error creating PurchaseModel:", err);
    throw new ModelError("Failed to create PurchaseModel", err);
  }
};
