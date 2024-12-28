import "../../css/style.css";
import "@/css/productStyle.css";
import { getData } from "../utils/fetchData";
import { createNav } from "../utils/nav";
import { ProductOutput } from "@dataTypes/product.types";

const nav = createNav();
document.querySelector("a")?.insertAdjacentElement("afterend", nav);

const productListData: ProductOutput[] = await getData(
  "http://localhost:3000/products",
);

const tbody = document.querySelector("#productList") as HTMLTableSectionElement;

const renderTable = (data: ProductOutput[]) => {
  tbody.textContent = "";
  const productListDataLen = productListData.length;
  let idx = productListDataLen;
  while (idx > 0) {
    const product = data[productListDataLen - idx];
    const tr = document.createElement("tr");
    const nameTd = document.createElement("td");
    const nameLink = document.createElement("a");
    nameLink.href = `../../../product/detail.html?productId=${product?.productId}`;
    nameLink.textContent = product?.productName ?? "";
    nameTd.appendChild(nameLink);

    const brandTd = document.createElement("td");
    brandTd.textContent = product?.productBrand ?? "";

    const categoryTd = document.createElement("td");
    categoryTd.textContent = product?.productCategory ?? "";

    tr.appendChild(nameTd);
    tr.appendChild(brandTd);
    tr.appendChild(categoryTd);
    tbody.appendChild(tr);
    --idx;
  }
};

renderTable(productListData);

const headers = document.querySelectorAll("th");
let currSortCol: keyof ProductOutput | null = null
let currSortDirection: "asc" | "desc" = "asc";
const headersLen = headers.length;
let idx = headersLen;
while (idx > 0) {
  const header = headers[headersLen - idx];
  header?.addEventListener("click", () => {
    const col = header.getAttribute("data-column") as keyof ProductOutput;
    const isSameCol = col === currSortCol;
    currSortDirection =
      isSameCol && currSortDirection === "asc" ? "desc" : "asc";
    currSortCol = col;

    const sortedData = [...productListData].sort((a, b) => {
      const aVal = a[col].toString().toLowerCase() ?? "";
      const bVal = b[col].toString().toLowerCase() ?? "";
      if (aVal < bVal) {
        return currSortDirection === "asc" ? -1 : 1;
      }
      if (aVal > bVal) {
        return currSortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    let idx = headersLen;
    while (idx > 0) {
      const h = headers[headersLen - idx];
      h?.classList.remove("sort-asc", "sort-desc");
      --idx;
    }
    header.classList.add(
      currSortDirection === "asc" ? "sort-asc" : "sort-desc",
    );

    renderTable(sortedData);
  });
  --idx;
}
