import "../../css/style.css";
import "@/css/headerStyle.css";
import { getData } from "../utils/fetchData";
import { createNav } from "../utils/nav";
import { ProductOutput } from "@dataTypes/product.types";
import {
  createTableBody,
  createTableHeaders,
  sortData,
} from "../utils/tableUtils";

const nav = createNav();
document.querySelector("a")?.insertAdjacentElement("afterend", nav);

const productList: ProductOutput[] = await getData(
  "http://localhost:3000/products",
);

const tr = document.querySelector("tr") as HTMLTableRowElement;

const productKeysArr = productList[0] ? Object.keys(productList[0]) : [];
const headerNames = ["Product Name", "Product Brand", "Product Category"];

const thList = createTableHeaders(productKeysArr, headerNames);
tr.append(...thList);

const tbody = document.querySelector("tbody") as HTMLTableSectionElement;
tbody.setAttribute("id", "productList");

const tbodyId = tbody.getAttribute("id") ?? "";
createTableBody<ProductOutput>(tbodyId, productKeysArr, productList);

const headers = document.querySelectorAll("th");
let currSortCol: keyof ProductOutput | null = null;
let currSortDirection: "asc" | "desc" = "asc";
headers.forEach((header) => {
  header.addEventListener("click", () => {
    const col = header.getAttribute("data-column") as keyof ProductOutput;
    const isSameCol = col === currSortCol;
    currSortDirection =
      isSameCol && currSortDirection === "asc" ? "desc" : "asc";
    currSortCol = col;
    const sortedData = sortData(productList, col, currSortDirection);
    headers.forEach((h) => {
      h.classList.remove("sort-asc", "sort-desc");
    });
    header.classList.add(
      currSortDirection === "asc" ? "sort-asc" : "sort-desc",
    );
    createTableBody<ProductOutput>(tbodyId, productKeysArr, sortedData);
  });
});
