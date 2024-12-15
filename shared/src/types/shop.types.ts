export interface Shop {
  shopId: number;
  shopName: string;
  shopLocation: string;
  createdAt: number;
  editedAt: number;
}

export type ShopEntry = Omit<Shop, "shopId" | "createdAt" | "editedAt">;

export type ShopOutput = Omit<Shop, "createdAt" | "editedAt">;
