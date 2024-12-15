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
    console.log("Purchase table and indexes created");
    return db;
  } catch (err) {
    console.error("Error creating PurchaseModel:", err);
    throw new ModelError("Failed to create PurchaseModel", err);
  }

  // async create(purchase: PurchaseEntry): Promise<number> {
  //   try {
  //     const {
  //       shopId,
  //       productId,
  //       purchaseDate,
  //       quantity,
  //       price,
  //       taxRate,
  //       taxAmount,
  //       mrpTaxAmount,
  //       nonMrpTaxAmount,
  //     } = purchase;
  //     const stmt = this.#db.prepare(
  //       `
  //       INSERT INTO Purchase (
  //         shopId,
  //         productId,
  //         purchaseDate,
  //         quantity,
  //         price,
  //         taxRate,
  //         taxAmount,
  //         mrpTaxAmount,
  //         nonMrpTaxAmount)
  //       VALUES (
  //         ?,
  //         ?,
  //         ?,
  //         ?,
  //         ?,
  //         ?,
  //         ?,
  //         ?,
  //         ?)
  //     `,
  //     );
  //     const result = stmt.run(
  //       shopId,
  //       productId,
  //       purchaseDate,
  //       quantity,
  //       price,
  //       taxRate ?? 0,
  //       taxAmount ?? 0,
  //       mrpTaxAmount ?? 0,
  //       nonMrpTaxAmount ?? 0,
  //     );
  //     return result.lastInsertRowid as number;
  //   } catch (err) {
  //     console.error("Error creating purchase:", err);
  //     throw new ModelError("Failed to create purchase", err);
  //   }
  // }

  // async findAll(): Promise<PurchaseOutput[]> {
  //   try {
  //     const stmt = this.#db.prepare(
  //       `
  //       SELECT
  //         purchaseId,
  //         shopId,
  //         productId,
  //         purchaseDate,
  //         quantity,
  //         price,
  //         taxRate,
  //         taxAmount,
  //         mrpTaxAmount,
  //         nonMrpTaxAmount
  //       FROM
  //         Purchase
  //     `,
  //     );
  //     const purchases = stmt.all() as PurchaseOutput[];
  //     return purchases;
  //   } catch (err) {
  //     console.error("Error retrieving purchase:", err);
  //     throw new ModelError("Failed to retrieve purchase", err);
  //   }
  // }

  // async findById(purchaseId: number): Promise<PurchaseOutput | null> {
  //   try {
  //     const stmt = this.#db.prepare(
  //       `
  //       SELECT
  //         purchaseId,
  //         shopId,
  //         productId,
  //         purchaseDate,
  //         quantity,
  //         price,
  //         taxRate,
  //         taxAmount,
  //         mrpTaxAmount,
  //         nonMrpTaxAmount
  //       FROM
  //         Purchase
  //       WHERE
  //         purchaseId = ?
  //     `,
  //     );
  //     const purchase = (stmt.get(purchaseId) as PurchaseOutput) ?? null;
  //     return purchase;
  //   } catch (err) {
  //     console.error("Error retrieving product by ID:", err);
  //     throw new ModelError("Failed to retrieve purchase by ID", err);
  //   }
  // }

  // async update(purchaseId: number, purchase: PurchaseEntry): Promise<boolean> {
  //   try {
  //     const {
  //       shopId,
  //       productId,
  //       purchaseDate,
  //       quantity,
  //       price,
  //       taxRate,
  //       taxAmount,
  //       mrpTaxAmount,
  //       nonMrpTaxAmount,
  //     } = purchase;
  //     const stmt = this.#db.prepare(
  //       `
  //       UPDATE
  //         Purchase
  //       SET
  //         shopId = ?,
  //         productId = ?,
  //         purchaseDate = ?,
  //         quantity = ?,
  //         price = ?,
  //         taxRate = ?,
  //         taxAmount = ?,
  //         mrpTaxAmount = ?,
  //         nonMrpTaxAmount = ?,
  //         editedAt = ?
  //       WHERE
  //         purchaseId = ?
  //     `,
  //     );
  //     const result = stmt.run(
  //       shopId,
  //       productId,
  //       purchaseDate,
  //       quantity,
  //       price,
  //       taxRate ?? 0,
  //       taxAmount ?? 0,
  //       mrpTaxAmount ?? 0,
  //       nonMrpTaxAmount ?? 0,
  //       Date.now(),
  //       purchaseId,
  //     );
  //     return result.changes > 0 ? true : false;
  //   } catch (err) {
  //     console.error("Error updating purchase:", err);
  //     throw new ModelError("Failed to update purchase", err);
  //   }
  // }

  // async delete(purchaseId: number): Promise<boolean> {
  //   try {
  //     const stmt = this.#db.prepare(
  //       "DELETE FROM Purchase WHERE purchaseId = ?",
  //     );
  //     const result = stmt.run(purchaseId);
  //     return result.changes > 0 ? true : false;
  //   } catch (err) {
  //     console.error("Error deleting purchase:", err);
  //     throw new ModelError("Failed to delete purchase", err);
  //   }
  // }
};
