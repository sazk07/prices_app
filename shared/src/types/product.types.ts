export interface Product {
  productId: number;
  productName: string;
  productCategory: string;
  productBrand: string;
  createdAt: number;
  editedAt: number;
}

export type ProductEntry = Omit<
  Product,
  "productId" | "createdAt" | "editedAt"
>;

export type ProductOutput = Omit<Product, "createdAt" | "editedAt">;
