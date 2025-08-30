import "../../css/style.css";
import "../../css/tableStyle.css";
import { getData } from "../utils/fetchData";
import { createNav } from "../utils/nav";
import { type ShopOutput } from "../../../../shared/src/types/shop.types";
import type {
  Column,
  SortState,
} from "../../../../shared/src/types/generics.types";
import { getKeys } from "../utils/getkeys";
import {
  createTableBody,
  createTableHeadersList,
  sortTable,
} from "../utils/tableUtils";

const LINK_COLUMN: Column<ShopOutput> = {
  name: "shopName",
  baseUrl: "../../shop/detail.html?shopId=",
  id: "shopId",
};
const shopList: ShopOutput[] = await getData("http://localhost:3000/shops");
const shopKeys = getKeys(shopList);

// NAV
const nav = createNav();
document.querySelector("a")?.insertAdjacentElement("afterend", nav);

// TABLE HEADERS
const tr = document.querySelector("tr") as HTMLTableRowElement;
const headerNames = ["Shop Name", "Shop Location"];
const thList = createTableHeadersList(shopKeys, headerNames);
tr.append(...thList);

// TABLE BODY
const tbody = document.querySelector("tbody") as HTMLTableSectionElement;
tbody.setAttribute("id", "productList");
createTableBody(shopList, tbody, shopKeys, LINK_COLUMN);

// SORT BY MOUSE CLICK
const headers = document.querySelectorAll("th");
const currSortState: SortState<ShopOutput> = {
  column: null,
  direction: "asc",
};
const handleSortTable = (header: HTMLTableCellElement) =>
  sortTable(
    shopList,
    tbody,
    shopKeys,
    LINK_COLUMN,
    header,
    headers,
    currSortState,
  );
headers.forEach((header) => {
  header.addEventListener("click", () => handleSortTable(header));
});
