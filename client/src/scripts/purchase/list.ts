import "@/css/style.css";
import "@/css/tableStyle.css";
import { Column, SortState } from "@dataTypes/generics.types";
import { PurchaseOutput, PurchaseView } from "@dataTypes/purchase.types";
import { getData } from "../utils/fetchData";
import { createNav } from "../utils/nav";
import {
  createTableBody,
  createTableHeadersList,
  createTableWithId,
  rearrangeKeys,
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
let rearrangedKeys = rearrangeKeys(purchaseKeys, desiredOrder);
const thList = createTableHeadersList(rearrangedKeys, headerNames);
tr.append(...thList);

// TABLE BODY
const tbody =
  document.querySelector("tbody") ?? createTableWithId("purchaseList");
tbody.setAttribute("id", "purchaseList");
rearrangedKeys = rearrangeKeys(purchaseKeys, desiredOrder);
createTableBody(purchaseList, tbody, rearrangedKeys, LINK_COLUMN);

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
    rearrangedKeys,
    LINK_COLUMN,
    header,
    headers,
    currSortState,
  );
headers.forEach((header) => {
  header.addEventListener("click", () => handleSortTable(header));
});
