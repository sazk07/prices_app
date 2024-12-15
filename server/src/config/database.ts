import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import { cwd } from "node:process";

// Create database directory
const createDir = async () => {
  const currDir = fileURLToPath(new URL(".", import.meta.url));
  const targetDir = join(currDir, "../../../database");
  const processRoot = cwd();
  const defaultDatabaseDir = processRoot.endsWith("server")
    ? "../database"
    : "./database";
  const dirPathStr =
    (await mkdir(targetDir, { recursive: true })) ?? defaultDatabaseDir;
  return dirPathStr;
};

const connectToDatabase = async () => {
  try {
    const createdTargetDir = await createDir();
    const dbPath = resolve(createdTargetDir, "prices.db");
    const db = new DatabaseSync(dbPath);
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
    console.log("Database tables and indexes created");
    return db;
  } catch (err) {
    console.error("Error connecting to sqlite database:", err);
    throw err;
  }
};

export default connectToDatabase;
