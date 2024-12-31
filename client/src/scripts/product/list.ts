import "@/css/style.css";
import "@/css/headerStyle.css";
import { getData } from "../utils/fetchData";
import { createNav } from "../utils/nav";
import { ProductOutput } from "@dataTypes/product.types";
import {
  createTableHeaders,
  createTableBody,
  sortData,
  filterKeys,
} from "../utils/tableUtils";

const nav = createNav();
document.querySelector("a")?.insertAdjacentElement("afterend", nav);

const productList: ProductOutput[] = await getData(
  "http://localhost:3000/products",
);

// TABLE HEADERS
const tr = document.querySelector("tr") as HTMLTableRowElement;
const productKeys = productList[0] ? Object.keys(productList[0]) : [];
const requiredKeys = filterKeys(productKeys);
const headerNames = ["Product Name", "Product Brand", "Product Category"];
const thList = createTableHeaders(requiredKeys, headerNames);
tr.append(...thList);

// TABLE BODY
const tbody = document.querySelector("tbody") as HTMLTableSectionElement;
tbody.setAttribute("id", "productList");
createTableBody(
  productList,
  tbody,
  ["productName", "productBrand", "productCategory"],
  {
    name: "productName",
    baseUrl: "../../product/detail.html?productId=",
    id: "productId",
  },
);

// SORT BY MOUSE CLICK
const headers = document.querySelectorAll("th");
let column: keyof ProductOutput | null = null;
let direction: "asc" | "desc" = "asc";
headers.forEach((header) => {
  header.addEventListener("click", () => {
    const col = header.getAttribute("data-column") as keyof ProductOutput;
    const isSameCol = col === column;
    direction = isSameCol && direction === "asc" ? "desc" : "asc";
    column = col;
    const sortedData = sortData(productList, col, direction);
    headers.forEach((h) => {
      h.classList.remove("sort-asc", "sort-desc");
    });
    header.classList.add(direction === "asc" ? "sort-asc" : "sort-desc");
    createTableBody(
      sortedData,
      tbody,
      ["productName", "productBrand", "productCategory"],
      {
        name: "productName",
        baseUrl: "../../product/detail.html?productId=",
        id: "productId",
      },
    );
  });
});
