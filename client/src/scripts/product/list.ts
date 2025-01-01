import "@/css/style.css";
import "@/css/tableStyle.css";
import { getData } from "../utils/fetchData";
import { createNav } from "../utils/nav";
import { ProductOutput } from "@dataTypes/product.types";
import {
  createTableHeaders,
  createTableBody,
  sortTable as sortTable,
} from "../utils/tableUtils";
import { Column, SortState } from "@dataTypes/generics.types";
import { getKeys } from "../utils/getkeys";

const LINK_COLUMN: Column<ProductOutput> = {
  name: "productName",
  baseUrl: "../../product/detail.html?productId=",
  id: "productId",
};
const productList: ProductOutput[] = await getData(
  "http://localhost:3000/products",
);
const productKeys = getKeys(productList);

// NAV
const nav = createNav();
document.querySelector("a")?.insertAdjacentElement("afterend", nav);

// TABLE HEADERS
const tr = document.querySelector("tr") as HTMLTableRowElement;
const headerNames = ["Product Name", "Product Brand", "Product Category"];
const thList = createTableHeaders(productKeys, headerNames);
tr.append(...thList);

// TABLE BODY
const tbody = document.querySelector("tbody") as HTMLTableSectionElement;
tbody.setAttribute("id", "productList");
createTableBody(productList, tbody, productKeys, LINK_COLUMN);

// SORT BY MOUSE CLICK
const headers = document.querySelectorAll("th");
const currSortState: SortState<ProductOutput> = {
  column: null,
  direction: "asc",
};
const handleSortTable = (header: HTMLTableCellElement) =>
  sortTable(
    productList,
    tbody,
    productKeys,
    LINK_COLUMN,
    header,
    headers,
    currSortState,
  );
headers.forEach((header) => {
  header.addEventListener("click", () => handleSortTable(header));
});
