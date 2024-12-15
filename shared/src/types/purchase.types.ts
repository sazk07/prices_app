export interface Purchase {
  purchaseId: number;
  shopId: number;
  productId: number;
  purchaseDate: string;
  quantity: number;
  price: number;
  taxRate?: number | undefined;
  taxAmount?: number | undefined;
  mrpTaxAmount?: number | undefined;
  nonMrpTaxAmount?: number | undefined;
  createdAt: number;
  editedAt: number;
}

export type PurchaseEntry = Omit<
  Purchase,
  "purchaseId" | "createdAt" | "editedAt"
>;

export type PurchaseOutput = Omit<Purchase, "createdAt" | "editedAt">;
