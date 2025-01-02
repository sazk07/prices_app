import "@/css/style.css";
import "@/css/tableStyle.css";
import { Column, SortState } from "@dataTypes/generics.types";
import { PurchaseOutput, PurchaseView } from "@dataTypes/purchase.types";
import { getData } from "../utils/fetchData";
import { createNav } from "../utils/nav";
import {
  createTableBody,
  createTableHeaders,
  sortTable,
} from "../utils/tableUtils";
import { getKeys } from "../utils/getkeys";

const LINK_COLUMN: Column<PurchaseView> = {
  name: "productName",
  baseUrl: "../../purchase/detail.html?purchaseId=",
  id: "purchaseId",
};
const purchaseList: PurchaseView[] = await getData(
  "http://localhost:3000/purchases",
);
const purchaseKeys = getKeys(purchaseList);

// NAV
const nav = createNav();
document.querySelector("a")?.insertAdjacentElement("afterend", nav);

// TABLE HEADERS
const tr = document.querySelector("tr") as HTMLTableRowElement;
const headerNames = [
  "Product Name",
  "Product Brand",
  "Product Category",
  "Shop Name",
  "Location",
  "Date",
  "Quantity",
  "Price",
  "Tax Rate",
  "Tax Amount",
  "MRP Tax Amount",
  "Non-MRP Tax Amount",
];
const thList = createTableHeaders(purchaseKeys, headerNames);
const desiredOrder = [
  "purchaseDate",
  "productName",
  "productBrand",
  "productCategory",
  "shopName",
  "shopLocation",
  "quantity",
  "price",
  "taxRate",
  "taxAmount",
  "mrpTaxAmount",
  "nonMrpTaxAmount",
];
const rearrangeCells = (cells: HTMLTableCellElement[], order: string[]) => {
  const cellMap = new Map(
    cells.map((cell) => [cell.getAttribute("data-column"), cell]),
  );
  return order.map(
    (column) => cellMap.get(column.toString()) as HTMLTableCellElement,
  );
};
const rearrangedCells = rearrangeCells(thList, desiredOrder);
tr.append(...rearrangedCells);

// TABLE BODY
const tbody = document.querySelector("tbody") as HTMLTableSectionElement;
tbody.setAttribute("id", "purchaseList");
// createTableBody(purchaseList, tbody, purchaseKeys, LINK_COLUMN);

// SORT BY MOUSE CLICK
const headers = document.querySelectorAll("th");
const currSortState: SortState<PurchaseOutput> = {
  column: null,
  direction: "asc",
};
const handleSortTable = (header: HTMLTableCellElement) =>
  sortTable(
    purchaseList,
    tbody,
    purchaseKeys,
    LINK_COLUMN,
    header,
    headers,
    currSortState,
  );
headers.forEach((header) => {
  // TODO
  header.addEventListener("click", () => {});
});
