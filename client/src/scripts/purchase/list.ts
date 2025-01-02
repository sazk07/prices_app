import "@/css/style.css";
import "@/css/tableStyle.css";
import { Column, SortState } from "@dataTypes/generics.types";
import { PurchaseOutput } from "@dataTypes/purchase.types";
import { getData } from "../utils/fetchData";
import { createNav } from "../utils/nav";
import {
  createTableBody,
  createTableHeaders,
  sortTable,
} from "../utils/tableUtils";

const LINK_COLUMN: Column<PurchaseOutput> = {
  name: "productId",
  baseUrl: "../../purchase/detail.html?purchaseId=",
  id: "purchaseId",
};
const purchaseList: PurchaseOutput[] = await getData(
  "http://localhost:3000/purchases",
);
const purchaseKeys = purchaseList[0]
  ? (Object.keys(purchaseList[0]) as Array<keyof PurchaseOutput>)
  : [];

// NAV
const nav = createNav();
document.querySelector("a")?.insertAdjacentElement("afterend", nav);

// TABLE HEADERS
const tr = document.querySelector("tr") as HTMLTableRowElement;
const headerNames = [
  "Date",
  "Product Name",
  "Product Brand",
  "Product Category",
  "Shop Name",
  "Location",
  "Quantity",
  "Price",
  "Tax Rate",
  "Tax Amount",
  "MRP Tax Amount",
  "Non-MRP Tax Amount",
];
const thList = createTableHeaders(purchaseKeys, headerNames);
tr.append(...thList);

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
