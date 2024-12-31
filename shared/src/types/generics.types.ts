export interface Column<T> {
  name: keyof T;
  baseUrl: string;
  id: keyof T;
}

export interface Sort<T> {
  column: keyof T | null;
  direction: "asc" | "desc";
}
