export interface Product {
  productId: number;
  productName: string;
  productBrand: string;
  productCategory: string;
  createdAt: number;
  editedAt: number;
}

export type ProductEntry = Omit<
  Product,
  "productId" | "createdAt" | "editedAt"
>;

export type ProductOutput = Omit<Product, "createdAt" | "editedAt">;

export interface ProductCount {
  "Number of Products": number;
}
