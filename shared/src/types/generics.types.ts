export interface Column<T> {
  name: keyof T;
  baseUrl: string;
  id: keyof T;
}
