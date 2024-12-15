import connectToDatabase from "@configs/database.js";
import { ModelError } from "@utils/model.error.js";

// TODO: add User table
export const ShopModel = async () => {
  try {
    const db = await connectToDatabase();
    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS Shop (
        shopId INTEGER PRIMARY KEY AUTOINCREMENT,
        shopName TEXT NOT NULL,
        shopLocation TEXT NOT NULL,
        createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        editedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        UNIQUE (shopName, shopLocation));
    `,
    ).run();
    db.prepare(
      `
      CREATE INDEX IF NOT EXISTS idxShopName ON Shop(shopName);
      CREATE INDEX IF NOT EXISTS idxShopLocation ON Shop(shopLocation);
    `,
    ).run();
    return db;
  } catch (err) {
    console.error("Error creating ShopModel:", err);
    throw new ModelError("Failed to create ShopModel", err);
  }
};
