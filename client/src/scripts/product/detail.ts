import "@/css/style.css";
import { createNav } from "../utils/nav";
import { type ProductOutput } from "@dataTypes/product.types";
import { getData } from "../utils/fetchData";

const productId = new URLSearchParams(window.location.search).get("productId");
const productData: ProductOutput = await getData(
  `http://localhost:3000/product/${productId}`,
);

// NAV
const nav = createNav();
document.querySelector("body")?.insertAdjacentElement("afterbegin", nav);

const title =
  document.querySelector("title") ?? document.createElement("title");
title.textContent = `${productData.productName} - Expense Tracker`;

const id = document.querySelector("#productId") as HTMLHeadingElement;
id.textContent = `ID: ${productData.productId}`;

const name = document.querySelector("#productName") as HTMLParagraphElement;
name.textContent = `Product Name: ${productData.productName}`;

const brand = document.querySelector("#productBrand") as HTMLParagraphElement;
brand.textContent = `Product Brand: ${productData.productBrand}`;

const category = document.querySelector(
  "#productCategory",
) as HTMLParagraphElement;
category.textContent = `Product Category: ${productData.productCategory}`;

const updateAnchor = document.createElement("a");
updateAnchor.href = `../../../product/update.html?productId=${productData.productId}`;
updateAnchor.textContent = "Update Product";
document
  .querySelector("#productCategory")
  ?.insertAdjacentElement("afterend", updateAnchor);
