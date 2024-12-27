import { ShopOutput } from "@dataTypes/shop.types";
import "@/css/style.css";
import { fetchData } from "@/scripts/utils/fetchData";
import { createNav } from "@/scripts/utils/nav";

const nav = createNav();
document.querySelector("body")?.insertAdjacentElement("afterbegin", nav);
// get shopId from query param in browser url
const shopId = new URLSearchParams(window.location.search).get("shopId");
const shopData: ShopOutput = await fetchData(
  `http://localhost:3000/shop/${shopId}`,
);
// insert shopName into title and h1
const title =
  document.querySelector("title") ?? document.createElement("title");
title.textContent = `${shopData.shopName} - Expense Tracker`;
const id = document.querySelector("#shopId") as HTMLHeadingElement;
id.textContent = `ID: ${shopData.shopId}`;
const name = document.querySelector("p") as HTMLParagraphElement;
name.textContent = `Shop Name: ${shopData.shopName}`;
const location = document.querySelector("#location") as HTMLParagraphElement;
location.textContent = `Location: ${shopData.shopLocation}`;
