import "../../css/style.css";
import { getData } from "../utils/fetchData";
import { createNav } from "../utils/nav";
import { ProductOutput } from "@dataTypes/product.types";

const nav = createNav();
document.querySelector("a")?.insertAdjacentElement("afterend", nav);

const ul = document.createElement("ul");
ul.setAttribute("id", "productList");
document.querySelector("nav")?.insertAdjacentElement("afterend", ul);

const productListData: ProductOutput[] = await getData(
  "http://localhost:3000/products",
);
const productListDataLen = productListData.length;
let idx = productListDataLen;
while (idx > 0) {
  const product = productListData[productListDataLen - idx] as ProductOutput;
  const a = document.createElement("a");
  a.href = `../../../product/detail.html?productId=${product.productId}`;
  a.textContent = product.productName;
  const p = document.createElement("p");
  p.appendChild(a);
  const brandSpan = document.createElement("span");
  brandSpan.textContent = `, ${product.productBrand}`;
  const categorySpan = document.createElement("span");
  categorySpan.textContent = `, ${product.productCategory}`;
  p.appendChild(brandSpan);
  p.appendChild(categorySpan);
  const li = document.createElement("li");
  li.appendChild(p);
  document.querySelector("#productList")?.appendChild(li);
  --idx;
}
