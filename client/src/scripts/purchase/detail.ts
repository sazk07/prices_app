import "@/css/style.css";
import { PurchaseView } from "@dataTypes/purchase.types";
import { getData } from "../utils/fetchData";
import { createNav } from "../utils/nav";

const purchaseId = new URLSearchParams(window.location.search).get(
  "purchaseId",
);
const purchaseData: PurchaseView = await getData(
  `http://localhost:3000/purchase/${purchaseId}`,
);

// NAV
const nav = createNav();
document.querySelector("body")?.insertAdjacentElement("afterbegin", nav);

const title =
  document.querySelector("title") ?? document.createElement("title");
title.textContent = `${purchaseData.productName} - Expense Tracker`;

const id = document.querySelector("#purchaseId") as HTMLHeadingElement;
id.textContent = `ID: ${purchaseData.purchaseId}`;

const date = document.querySelector("#purchaseDate") as HTMLParagraphElement;
date.textContent = `Date: ${purchaseData.purchaseDate}`;

const name = document.querySelector("#productName") as HTMLParagraphElement;
name.textContent = `Product Name: ${purchaseData.productName}`;

const brand = document.querySelector("#productBrand") as HTMLParagraphElement;
brand.textContent = `Product Brand: ${purchaseData.productBrand}`;

const category = document.querySelector(
  "#productCategory",
) as HTMLParagraphElement;
category.textContent = `Product Category: ${purchaseData.productCategory}`;

const shopName = document.querySelector("#shopName") as HTMLParagraphElement;
shopName.textContent = `Shop Name: ${purchaseData.shopName}`;

const shopLocation = document.querySelector(
  "#shopLocation",
) as HTMLParagraphElement;
shopLocation.textContent = `Shop Location: ${purchaseData.shopLocation}`;

const quantity = document.querySelector("#quantity") as HTMLParagraphElement;
quantity.textContent = `Quantity: ${purchaseData.quantity}`;

const price = document.querySelector("#price") as HTMLParagraphElement;
price.textContent = `Price: ${purchaseData.price}`;

const taxRate = document.querySelector("#taxRate") as HTMLParagraphElement;
taxRate.textContent = `Tax Rate: ${purchaseData.taxRate}`;

const taxAmount = document.querySelector("#taxAmount") as HTMLParagraphElement;
taxAmount.textContent = `Tax Amount: ${purchaseData.taxAmount}`;

const mrpTaxAmount = document.querySelector(
  "#mrpTaxAmount",
) as HTMLParagraphElement;
mrpTaxAmount.textContent = `MRP Tax Amount: ${purchaseData.mrpTaxAmount}`;

const nonMrpTaxAmount = document.querySelector(
  "#nonMrpTaxAmount",
) as HTMLParagraphElement;
nonMrpTaxAmount.textContent = `Non-MRP Tax Amount: ${purchaseData.nonMrpTaxAmount}`;

const updateAnchor = document.createElement("a");
updateAnchor.href = `../../../purchase/update.html?purchaseId=${purchaseData.purchaseId}`;
updateAnchor.textContent = "Update Purchase";
document
  .querySelector("#nonMrpTaxAmount")
  ?.insertAdjacentElement("afterend", updateAnchor);
