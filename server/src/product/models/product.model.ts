import connectToDatabase from "@configs/database.js";
import { ModelError } from "@utils/model.error.js";

export const ProductModel = async () => {
  try {
    const db = await connectToDatabase();
    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS Product (
        productId INTEGER PRIMARY KEY AUTOINCREMENT,
        productName TEXT NOT NULL,
        productCategory TEXT NOT NULL,
        productBrand TEXT NOT NULL,
        createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        editedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        UNIQUE (productName, productCategory, productBrand));
    `,
    ).run();
    db.prepare(
      `
      CREATE INDEX IF NOT EXISTS idxProductName ON Product(productName);
      CREATE INDEX IF NOT EXISTS idxProductCategory ON Product(productCategory);
    `,
    ).run();
    console.log("Product table and indexes created");
    return db;
  } catch (err) {
    console.error("Error creating ProductModel:", err);
    throw new ModelError("Failed to create ProductModel", err);
  }
};
