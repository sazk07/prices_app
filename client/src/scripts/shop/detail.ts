import { ShopOutput } from "@dataTypes/shop.types";
import "@/css/style.css";
import { getData } from "@/scripts/utils/fetchData";
import { createNav } from "@/scripts/utils/nav";

// get shopId from query param in browser url
const shopId = new URLSearchParams(window.location.search).get("shopId");
const shopData: ShopOutput = await getData(
  `http://localhost:3000/shop/${shopId}`,
);

// NAV
const nav = createNav();
document.querySelector("body")?.insertAdjacentElement("afterbegin", nav);

const title =
  document.querySelector("title") ?? document.createElement("title");
title.textContent = `${shopData.shopName} - Expense Tracker`;

const id = document.querySelector("#shopId") as HTMLHeadingElement;
id.textContent = `ID: ${shopData.shopId}`;

const name = document.querySelector("#shopName") as HTMLParagraphElement;
name.textContent = `Shop Name: ${shopData.shopName}`;

const location = document.querySelector("#location") as HTMLParagraphElement;
location.textContent = `Location: ${shopData.shopLocation}`;

const updateAnchor = document.createElement("a");
updateAnchor.href = `../../../shop/update.html?shopId=${shopData.shopId}`;
updateAnchor.textContent = "Update Shop";
document.querySelector("#location")?.insertAdjacentElement("afterend", updateAnchor);
