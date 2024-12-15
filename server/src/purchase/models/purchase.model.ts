import { PurchaseEntry, PurchaseOutput } from "@dataTypes/purchase.types.js";
import { DatabaseSync } from "node:sqlite";
import { ModelError } from "@utils/model.error.js";
import connectToDatabase from "@configs/database.js";

export class PurchaseModel {
  #db!: DatabaseSync;

  private constructor(db: DatabaseSync) {
    this.#db = db;
  }

  static async createInstance(): Promise<PurchaseModel> {
    const db = await connectToDatabase();
    return new PurchaseModel(db);
  }

  async create(purchase: PurchaseEntry): Promise<number> {
    try {
      const {
        shopId,
        productId,
        purchaseDate,
        quantity,
        price,
        taxRate,
        taxAmount,
        mrpTaxAmount,
        nonMrpTaxAmount,
      } = purchase;
      const stmt = this.#db.prepare(
        `
        INSERT INTO Purchase (
          shopId,
          productId,
          purchaseDate,
          quantity,
          price,
          taxRate,
          taxAmount,
          mrpTaxAmount,
          nonMrpTaxAmount)
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?)
      `,
      );
      const result = stmt.run(
        shopId,
        productId,
        purchaseDate,
        quantity,
        price,
        taxRate ?? 0,
        taxAmount ?? 0,
        mrpTaxAmount ?? 0,
        nonMrpTaxAmount ?? 0,
      );
      return result.lastInsertRowid as number;
    } catch (err) {
      console.error("Error creating purchase:", err);
      throw new ModelError("Failed to create purchase", err);
    }
  }

  async findAll(): Promise<PurchaseOutput[]> {
    try {
      const stmt = this.#db.prepare(
        `
        SELECT
          purchaseId,
          shopId,
          productId,
          purchaseDate,
          quantity,
          price,
          taxRate,
          taxAmount,
          mrpTaxAmount,
          nonMrpTaxAmount
        FROM
          Purchase
      `,
      );
      const purchases = stmt.all() as PurchaseOutput[];
      return purchases;
    } catch (err) {
      console.error("Error retrieving purchase:", err);
      throw new ModelError("Failed to retrieve purchase", err);
    }
  }

  async findById(purchaseId: number): Promise<PurchaseOutput | null> {
    try {
      const stmt = this.#db.prepare(
        `
        SELECT
          purchaseId,
          shopId,
          productId,
          purchaseDate,
          quantity,
          price,
          taxRate,
          taxAmount,
          mrpTaxAmount,
          nonMrpTaxAmount
        FROM
          Purchase
        WHERE
          purchaseId = ?
      `,
      );
      const purchase = (stmt.get(purchaseId) as PurchaseOutput) ?? null;
      return purchase;
    } catch (err) {
      console.error("Error retrieving product by ID:", err);
      throw new ModelError("Failed to retrieve purchase by ID", err);
    }
  }

  async update(purchaseId: number, purchase: PurchaseEntry): Promise<boolean> {
    try {
      const {
        shopId,
        productId,
        purchaseDate,
        quantity,
        price,
        taxRate,
        taxAmount,
        mrpTaxAmount,
        nonMrpTaxAmount,
      } = purchase;
      const stmt = this.#db.prepare(
        `
        UPDATE
          Purchase
        SET
          shopId = ?,
          productId = ?,
          purchaseDate = ?,
          quantity = ?,
          price = ?,
          taxRate = ?,
          taxAmount = ?,
          mrpTaxAmount = ?,
          nonMrpTaxAmount = ?,
          editedAt = ?
        WHERE
          purchaseId = ?
      `,
      );
      const result = stmt.run(
        shopId,
        productId,
        purchaseDate,
        quantity,
        price,
        taxRate ?? 0,
        taxAmount ?? 0,
        mrpTaxAmount ?? 0,
        nonMrpTaxAmount ?? 0,
        Date.now(),
        purchaseId,
      );
      return result.changes > 0 ? true : false;
    } catch (err) {
      console.error("Error updating purchase:", err);
      throw new ModelError("Failed to update purchase", err);
    }
  }

  async delete(purchaseId: number): Promise<boolean> {
    try {
      const stmt = this.#db.prepare(
        "DELETE FROM Purchase WHERE purchaseId = ?",
      );
      const result = stmt.run(purchaseId);
      return result.changes > 0 ? true : false;
    } catch (err) {
      console.error("Error deleting purchase:", err);
      throw new ModelError("Failed to delete purchase", err);
    }
  }
}
