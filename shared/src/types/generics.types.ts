export interface Column<T> {
  name: keyof T;
  baseUrl: string;
  id: keyof T;
}

export interface SortState<T> {
  column: keyof T | null;
  direction: "asc" | "desc";
}
